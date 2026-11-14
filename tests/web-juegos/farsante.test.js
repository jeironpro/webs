import { describe, expect, test } from "vitest";
import {
    MIN_JUGADORES_DOS_FARSANTES,
    avanzarRonda,
    crearJugador,
    crearPartida,
    elegirPalabra,
    normalizarNombre,
    ordenPistas,
    resolverVotacion,
    TEMATICAS,
    validarNombre,
} from "../../web-juegos/juego-farsante/js/farsante-core.js";
import {
    codificarInvitacion,
    crearEnlaceInvitacion,
    crearPayloadInvitacion,
    leerInvitacion,
    leerInvitacionDeHash,
} from "../../web-juegos/juego-farsante/js/farsante-invite.js";

const jugadores = [
    { id: "p-1", nombre: "Ana", avatar: 0 },
    { id: "p-2", nombre: "Luis", avatar: 1 },
    { id: "p-3", nombre: "Carla", avatar: 2 },
    { id: "p-4", nombre: "Marta", avatar: 3 },
];

const seisJugadores = [
    ...jugadores,
    { id: "p-5", nombre: "Nora", avatar: 4 },
    { id: "p-6", nombre: "Diego", avatar: 5 },
];

describe("Farsante · jugadores", () => {
    test("normaliza espacios y rechaza nombres vacíos o duplicados", () => {
        expect(normalizarNombre("  Ana   María ")).toBe("Ana María");
        expect(validarNombre("", jugadores)).toMatch(/2 letras/);
        expect(validarNombre("ana", jugadores)).toMatch(/ya está/);
        expect(validarNombre("Ana", jugadores, "p-1")).toBe("");
        expect(validarNombre("Mario", jugadores)).toBe("");
    });

    test("crea jugadores con avatares rotatorios", () => {
        expect(crearJugador("  Ana  ", 0)).toEqual({ id: "p-1", nombre: "Ana", avatar: 0 });
        expect(crearJugador("Luis", 8)).toMatchObject({ id: "p-9", avatar: 0 });
    });
});

describe("Farsante · reparto", () => {
    test("elige una palabra de las temáticas seleccionadas", () => {
        const palabra = elegirPalabra(["sabores"], () => 0);
        expect(palabra).toMatchObject({
            palabra: "canela",
            categoria: "Sabores",
            tematicaId: "sabores",
        });
        expect(TEMATICAS.some((tematica) => tematica.id === palabra.tematicaId)).toBe(true);
    });

    test("reparte un único impostor y una palabra", () => {
        const valores = [0, 0.5];
        const partida = crearPartida(
            jugadores.slice(0, 3),
            { tematicaIds: ["cotidiano"], rondas: 2 },
            () => valores.shift()
        );
        expect(partida.impostorId).toBe("p-2");
        expect(partida.palabra).toBe("paraguas");
        expect(partida.rondaActual).toBe(1);
        expect(partida.eliminados).toEqual([]);
        expect(partida.letra).toBe("P");
    });

    test("reparte dos farsantes distintos y exige una mesa grande", () => {
        const valores = [0, 0, 0.5];
        const partida = crearPartida(
            seisJugadores,
            { tematicaIds: ["cotidiano"], rondas: 2, farsantes: 2 },
            () => valores.shift()
        );
        expect(partida.farsanteIds).toHaveLength(2);
        expect(new Set(partida.farsanteIds).size).toBe(2);
        expect(partida.impostorId).toBe(partida.farsanteIds[0]);
        expect(() =>
            crearPartida(jugadores, {
                tematicaIds: ["cotidiano"],
                rondas: 2,
                farsantes: 2,
            })
        ).toThrow(new RegExp(`${MIN_JUGADORES_DOS_FARSANTES} jugadores`));
    });

    test("rota el orden de pistas por ronda", () => {
        expect(ordenPistas(jugadores, [], 1).map((j) => j.id)).toEqual([
            "p-1",
            "p-2",
            "p-3",
            "p-4",
        ]);
        expect(ordenPistas(jugadores, ["p-2"], 2).map((j) => j.id)).toEqual(["p-3", "p-4", "p-1"]);
    });
});

describe("Farsante · votación", () => {
    test("elimina al más votado y cierra el caso si era el farsante", () => {
        const resultado = resolverVotacion({
            jugadores: jugadores.slice(0, 3),
            votos: { "p-1": "p-2", "p-2": "p-1", "p-3": "p-2" },
            impostorId: "p-2",
            rondaActual: 1,
            rondasMax: 2,
        });
        expect(resultado.eliminadoId).toBe("p-2");
        expect(resultado.eraFarsante).toBe(true);
        expect(resultado.ganador).toBe("inocentes");
        expect(resultado.fin).toBe(true);
    });

    test("un empate no elimina y puede continuar", () => {
        const resultado = resolverVotacion({
            jugadores: jugadores.slice(0, 4),
            votos: { "p-1": "p-2", "p-2": "p-1", "p-3": "p-4", "p-4": "p-3" },
            impostorId: "p-4",
            rondaActual: 1,
            rondasMax: 2,
        });
        expect(resultado.empate).toBe(true);
        expect(resultado.eliminadoId).toBeNull();
        expect(resultado.fin).toBe(false);
    });

    test("el farsante gana si queda solo con un inocente", () => {
        const resultado = resolverVotacion({
            jugadores: jugadores.slice(0, 3),
            votos: { "p-1": "p-2", "p-2": "p-3", "p-3": "p-2" },
            impostorId: "p-1",
            rondaActual: 1,
            rondasMax: 3,
        });
        expect(resultado.eliminadoId).toBe("p-2");
        expect(resultado.restantes.map((j) => j.id)).toEqual(["p-1", "p-3"]);
        expect(resultado.ganador).toBe("farsante");
    });

    test("si se agotan las rondas, gana el farsante", () => {
        const resultado = resolverVotacion({
            jugadores: jugadores.slice(0, 4),
            votos: { "p-1": "p-2", "p-2": "p-3", "p-3": "p-4", "p-4": "p-2" },
            impostorId: "p-1",
            rondaActual: 2,
            rondasMax: 2,
        });
        expect(resultado.eliminadoId).toBe("p-2");
        expect(resultado.ganador).toBe("farsante");
    });

    test("con dos farsantes, eliminar a uno no cierra el caso", () => {
        const resultado = resolverVotacion({
            jugadores: seisJugadores,
            votos: {
                "p-1": "p-2",
                "p-2": "p-1",
                "p-3": "p-1",
                "p-4": "p-1",
                "p-5": "p-1",
                "p-6": "p-1",
            },
            farsanteIds: ["p-1", "p-3"],
            rondaActual: 1,
            rondasMax: 3,
        });
        expect(resultado.eliminadoId).toBe("p-1");
        expect(resultado.eraFarsante).toBe(true);
        expect(resultado.fin).toBe(false);
        expect(resultado.farsantesVivos.map((jugador) => jugador.id)).toEqual(["p-3"]);
    });

    test("con dos farsantes, caer ambos da la victoria a los inocentes", () => {
        const resultado = resolverVotacion({
            jugadores: seisJugadores,
            eliminados: ["p-1"],
            votos: {
                "p-2": "p-3",
                "p-3": "p-2",
                "p-4": "p-3",
                "p-5": "p-3",
                "p-6": "p-3",
            },
            farsanteIds: ["p-1", "p-3"],
            rondaActual: 2,
            rondasMax: 3,
        });
        expect(resultado.eliminadoId).toBe("p-3");
        expect(resultado.farsantesVivos).toEqual([]);
        expect(resultado.ganador).toBe("inocentes");
    });

    test("con dos farsantes, la paridad da la victoria al farsante", () => {
        const resultado = resolverVotacion({
            jugadores: seisJugadores,
            eliminados: ["p-2"],
            votos: {
                "p-1": "p-4",
                "p-3": "p-4",
                "p-4": "p-1",
                "p-5": "p-4",
                "p-6": "p-4",
            },
            farsanteIds: ["p-1", "p-3"],
            rondaActual: 2,
            rondasMax: 3,
        });
        expect(resultado.eliminadoId).toBe("p-4");
        expect(resultado.restantes).toHaveLength(4);
        expect(resultado.ganador).toBe("farsante");
    });

    test("avanzar ronda limpia los votos", () => {
        const partida = {
            rondaActual: 1,
            votos: { "p-1": "p-2" },
            indiceVotante: 2,
            resultado: { fin: false },
        };
        expect(avanzarRonda(partida)).toMatchObject({
            rondaActual: 2,
            votos: {},
            indiceVotante: 0,
            resultado: null,
        });
    });
});

describe("Farsante · invitaciones", () => {
    const config = {
        rondas: 2,
        tematicaIds: ["sabores", "lugares"],
        pista: true,
        farsantes: 2,
    };
    const partida = {
        farsanteIds: ["p-2", "p-5"],
        palabra: "canela",
        categoria: "Sabores",
        tematicaId: "sabores",
        letra: "C",
    };

    test("codifica y recupera el caso completo con nombres acentuados", () => {
        const mesa = seisJugadores.map((jugador, indice) =>
            indice === 0 ? { ...jugador, nombre: "Ana María" } : jugador
        );
        const payload = crearPayloadInvitacion({ jugadores: mesa, config, partida });
        const enlace = crearEnlaceInvitacion("https://example.com/juego-farsante/", payload);
        const codigo = enlace.split("#invitacion=")[1];
        const vuelta = leerInvitacion(codigo);

        expect(enlace).toContain("#invitacion=");
        expect(vuelta.jugadores[0].nombre).toBe("Ana María");
        expect(vuelta.config).toMatchObject({ rondas: 2, farsantes: 2, pista: true });
        expect(vuelta.partida).toMatchObject({
            palabra: "canela",
            farsanteIds: ["p-2", "p-5"],
        });
        expect(leerInvitacionDeHash(`#invitacion=${codigo}`)?.partida.palabra).toBe("canela");
    });

    test("rechaza códigos corruptos y farsantes ajenos a la mesa", () => {
        expect(() => leerInvitacion("no-es-una-invitacion")).toThrow();
        const payload = crearPayloadInvitacion({ jugadores: seisJugadores, config, partida });
        const invalida = { ...payload, partida: { ...payload.partida, farsanteIds: ["p-99"] } };
        expect(() => leerInvitacion(codificarInvitacion(invalida))).toThrow(/inexistente/);
    });
});
