import { afterEach, describe, expect, test, vi } from "vitest";
import {
    crearCodigoSala,
    enlaceSala,
    idAnfitrion,
    mensajeErrorSala,
    normalizarCodigoSala,
    SalaRemota,
} from "../../web-juegos/juego-farsante/js/farsante-sala.js";

afterEach(() => {
    vi.useRealTimers();
});

describe("Farsante · sala remota", () => {
    test("crea códigos legibles con el prefijo FAR", () => {
        const codigo = crearCodigoSala(() => 0);
        expect(codigo).toBe("FAR-AAAA");
        expect(crearCodigoSala(() => 0.999999)).toBe("FAR-9999");
    });

    test("normaliza códigos con o sin prefijo", () => {
        expect(normalizarCodigoSala("far-abcd")).toBe("FAR-ABCD");
        expect(normalizarCodigoSala("ABCD")).toBe("FAR-ABCD");
        expect(normalizarCodigoSala("FAR ABCD")).toBe("FAR-ABCD");
        expect(normalizarCodigoSala("123")).toBe("");
    });

    test("genera el identificador estable del anfitrión", () => {
        expect(idAnfitrion("far-abcd")).toBe("farsante-174-abcd-host");
        expect(idAnfitrion("mal")).toBe("");
    });

    test("construye el enlace de invitación sin conservar query ni hash", () => {
        expect(enlaceSala("FAR-ABCD", "https://example.com/juego/?x=1#hola")).toBe(
            "https://example.com/juego/?sala=FAR-ABCD"
        );
    });

    test("traduce los errores habituales de PeerJS", () => {
        expect(mensajeErrorSala({ type: "peer-unavailable" })).toMatch(/No encontramos/);
        expect(mensajeErrorSala({ type: "unavailable-id" })).toMatch(/ya está abierta/);
        expect(mensajeErrorSala({ type: "network" })).toMatch(/conexión/);
    });
});

describe("SalaRemota · reconexión del invitado", () => {
    class ConexionFalsa {
        constructor() {
            this.open = true;
            this.enviados = [];
            this.manejadores = {};
        }

        on(evento, manejador) {
            (this.manejadores[evento] ??= []).push(manejador);
            return this;
        }

        emitir(evento, ...argumentos) {
            (this.manejadores[evento] ?? []).forEach((manejador) => manejador(...argumentos));
        }

        send(datos) {
            this.enviados.push(datos);
        }

        close() {
            if (!this.open) return;
            this.open = false;
            this.emitir("close");
        }
    }

    class PeerFalso {
        static instancias = [];

        constructor(id) {
            this.id = id;
            this.open = false;
            this.destroyed = false;
            this.manejadores = {};
            this.conexiones = [];
            this.vecesConectado = 0;
            PeerFalso.instancias.push(this);
        }

        on(evento, manejador) {
            (this.manejadores[evento] ??= []).push(manejador);
            return this;
        }

        emitir(evento, ...argumentos) {
            (this.manejadores[evento] ?? []).forEach((manejador) => manejador(...argumentos));
        }

        connect() {
            this.vecesConectado += 1;
            const conexion = new ConexionFalsa();
            this.conexiones.push(conexion);
            return conexion;
        }

        destroy() {
            this.destroyed = true;
            this.open = false;
        }

        reconnect() {
            this.emitir("open");
        }
    }

    function crearSala(estados = []) {
        const sala = new SalaRemota({
            PeerClass: PeerFalso,
            onEstado: (estado, mensaje) => estados.push({ estado, mensaje }),
            historial: () => [],
        });
        return { sala, estados };
    }

    test("reintenta una vez y luego pide reconexión manual", () => {
        vi.useFakeTimers();
        PeerFalso.instancias = [];
        const { sala, estados } = crearSala();
        sala.unirse("FAR-ABCD");
        const peer = PeerFalso.instancias.at(-1);
        peer.open = true;
        peer.emitir("open");
        const primera = peer.conexiones[0];
        primera.emitir("open");
        expect(estados.at(-1).estado).toBe("conectado");

        primera.close();
        expect(estados.at(-1).estado).toBe("desconectado");
        expect(estados.at(-1).mensaje).toMatch(/Se perdió la conexión/);

        vi.advanceTimersByTime(1200);
        expect(peer.vecesConectado).toBe(2);
        const segunda = peer.conexiones[1];
        segunda.emitir("open");
        expect(estados.at(-1).estado).toBe("conectado");

        segunda.close();
        expect(estados.at(-1).mensaje).toMatch(/No se pudo reconectar/);
        vi.advanceTimersByTime(5000);
        expect(peer.vecesConectado).toBe(2);
        sala.cerrar();
    });

    test("cerrar la sala no dispara reconexiones", () => {
        vi.useFakeTimers();
        PeerFalso.instancias = [];
        const { sala, estados } = crearSala();
        sala.unirse("FAR-ABCD");
        const peer = PeerFalso.instancias.at(-1);
        peer.open = true;
        peer.emitir("open");
        const conexion = peer.conexiones[0];
        conexion.emitir("open");

        sala.cerrar();
        conexion.close();
        vi.advanceTimersByTime(5000);
        expect(peer.vecesConectado).toBe(1);
        expect(estados.at(-1).estado).toBe("conectado");
    });
    test("detecta un canal zombi sin latido y reconecta", () => {
        vi.useFakeTimers();
        PeerFalso.instancias = [];
        const { sala, estados } = crearSala();
        sala.unirse("FAR-ABCD");
        const peer = PeerFalso.instancias.at(-1);
        peer.open = true;
        peer.emitir("open");
        const primera = peer.conexiones[0];
        primera.emitir("open");

        vi.advanceTimersByTime(20000);
        expect(estados.at(-1).mensaje).toMatch(/Se perdió la conexión/);
        vi.advanceTimersByTime(1200);
        expect(peer.vecesConectado).toBe(2);
        expect(peer.conexiones[1]).toBeDefined();
        sala.cerrar();
    });
});
