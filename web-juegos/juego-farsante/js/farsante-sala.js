const PREFIJO_PEER = "farsante-174";
const ALFABETO = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function crearCodigoSala(random = Math.random) {
    let codigo = "";
    for (let i = 0; i < 4; i += 1) {
        codigo += ALFABETO[Math.floor(random() * ALFABETO.length)];
    }
    return `FAR-${codigo}`;
}

export function normalizarCodigoSala(valor) {
    const limpio = String(valor ?? "")
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "");
    const cuerpo = limpio.startsWith("FAR") ? limpio.slice(3) : limpio;
    return cuerpo.length === 4 ? `FAR-${cuerpo}` : "";
}

export function idAnfitrion(codigo) {
    const normalizado = normalizarCodigoSala(codigo);
    return normalizado ? `${PREFIJO_PEER}-${normalizado.slice(4).toLowerCase()}-host` : "";
}

export function enlaceSala(codigo, base = globalThis.location?.href ?? "") {
    try {
        const url = new URL(base);
        url.search = "";
        url.hash = "";
        url.searchParams.set("sala", normalizarCodigoSala(codigo) || codigo);
        return url.href;
    } catch {
        return "";
    }
}

export function mensajeErrorSala(error) {
    switch (error?.type) {
        case "unavailable-id":
            return "Esa sala ya está abierta en otro dispositivo. Crea una nueva.";
        case "peer-unavailable":
            return "No encontramos esa sala. Revisa el código y que el anfitrión siga conectado.";
        case "network":
        case "server-error":
        case "socket-error":
        case "socket-closed":
            return "No se pudo conectar al servicio de salas. Revisa tu conexión.";
        case "browser-incompatible":
            return "Este navegador no soporta las salas en tiempo real.";
        default:
            return "La sala se desconectó. Puedes volver a intentarlo.";
    }
}

/**
 * Sala en estrella: el anfitrión mantiene el historial y retransmite los
 * mensajes a todos los invitados. No hay servidor propio ni cuentas.
 */
export class SalaRemota {
    constructor({ onEstado, onMensaje, onConexiones, onLimpiar, historial, PeerClass } = {}) {
        this.onEstado = onEstado ?? (() => {});
        this.onMensaje = onMensaje ?? (() => {});
        this.onConexiones = onConexiones ?? (() => {});
        this.onLimpiar = onLimpiar ?? (() => {});
        this.obtenerHistorial = historial ?? (() => []);
        this.PeerClass = PeerClass ?? globalThis.Peer;
        this.modo = null;
        this.codigo = "";
        this.peer = null;
        this.conexion = null;
        this.conexiones = [];
        this.temporizador = null;
        this.temporizadorReconexion = null;
        this.temporizadorLatido = null;
        this.temporizadorVigilancia = null;
        this.ultimaSenal = 0;
        this.detectadoCorte = false;
        this.intentosReconexion = 0;
        this.cerrado = false;
    }

    crear(codigo) {
        const normalizado = normalizarCodigoSala(codigo);
        if (!normalizado) {
            this.onEstado("error", "El código de sala no es válido.");
            return;
        }
        this.cerrar();
        this.cerrado = false;
        this.modo = "anfitrion";
        this.codigo = normalizado;
        this.onEstado("conectando", "");
        if (!this.PeerClass) {
            this.onEstado("error", "No se pudo cargar el motor de salas.");
            return;
        }

        this.peer = new this.PeerClass(idAnfitrion(normalizado), { debug: 0 });
        this.peer.on("open", () => {
            if (this.cerrado) return;
            this.limpiarTemporizador();
            this.onEstado("conectado", "");
            this.onConexiones(this.conexiones.length);
            this.iniciarLatido();
        });
        this.peer.on("connection", (conexion) => this.registrarConexion(conexion));
        this.peer.on("error", (error) => this.fallar(error));
        this.peer.on("disconnected", () => {
            if (this.cerrado) return;
            this.onEstado("desconectado", "Conexión perdida. Reconectando…");
            try {
                this.peer.reconnect();
            } catch {
                /* PeerJS reintentará en la próxima acción */
            }
        });
        this.programarTimeout();
    }

    unirse(codigo) {
        const normalizado = normalizarCodigoSala(codigo);
        if (!normalizado) {
            this.onEstado("error", "El código de sala no es válido.");
            return;
        }
        this.cerrar();
        this.cerrado = false;
        this.modo = "invitado";
        this.codigo = normalizado;
        this.intentosReconexion = 0;
        this.onEstado("conectando", "");
        if (!this.PeerClass) {
            this.onEstado("error", "No se pudo cargar el motor de salas.");
            return;
        }

        this.peer = new this.PeerClass({ debug: 0 });
        this.peer.on("open", () => {
            if (this.cerrado) return;
            const conexion = this.peer.connect(idAnfitrion(normalizado), { reliable: true });
            this.conectarInvitado(conexion);
        });
        this.peer.on("error", (error) => this.fallar(error));
        this.peer.on("disconnected", () => {
            if (!this.cerrado) this.onEstado("desconectado", "Conexión perdida. Vuelve a entrar.");
        });
        this.programarTimeout();
    }

    registrarConexion(conexion) {
        this.conexiones.push(conexion);
        this.onConexiones(this.conexiones.length);

        conexion.on("open", () => {
            try {
                conexion.send({ tipo: "historial", mensajes: this.obtenerHistorial() });
                conexion.send({ tipo: "latido" });
            } catch {
                /* la conexión se cerró antes de saludar */
            }
            this.onConexiones(this.conexiones.length);
        });
        conexion.on("data", (datos) => {
            if (datos?.tipo !== "pista" || !datos.mensaje) return;
            this.onMensaje(datos.mensaje, conexion);
        });
        const quitar = () => {
            this.conexiones = this.conexiones.filter((item) => item !== conexion);
            this.onConexiones(this.conexiones.length);
        };
        conexion.on("close", quitar);
        conexion.on("error", quitar);
    }

    conectarInvitado(conexion) {
        const anterior = this.conexion;
        this.conexion = conexion;
        if (anterior && anterior !== conexion) {
            try {
                anterior.close();
            } catch {
                /* el canal anterior ya estaba cerrado */
            }
        }
        this.detectadoCorte = false;
        this.ultimaSenal = Date.now();
        conexion.on("open", () => {
            if (this.cerrado) return;
            this.limpiarTemporizador();
            this.detectadoCorte = false;
            this.ultimaSenal = Date.now();
            this.onEstado("conectado", "");
            this.iniciarVigilancia();
        });
        conexion.on("data", (datos) => {
            this.ultimaSenal = Date.now();
            this.detectadoCorte = false;
            if (datos?.tipo === "historial" && Array.isArray(datos.mensajes)) {
                datos.mensajes.forEach((mensaje) => this.onMensaje(mensaje));
                return;
            }
            if (datos?.tipo === "limpiar") {
                this.onLimpiar();
                return;
            }
            if (datos?.tipo === "pista" && datos.mensaje) {
                this.onMensaje(datos.mensaje);
            }
        });
        conexion.on("close", () => {
            if (this.cerrado || this.conexion !== conexion) return;
            this.onEstado("desconectado", "Se perdió la conexión con la sala.");
            this.programarReconexionInvitado();
        });
        conexion.on("error", (error) => this.fallar(error));
    }

    iniciarLatido() {
        this.detenerLatido();
        this.temporizadorLatido = setInterval(() => {
            if (this.cerrado || this.modo !== "anfitrion") return;
            this.conexiones.forEach((conexion) => {
                if (!conexion.open) return;
                try {
                    conexion.send({ tipo: "latido" });
                } catch {
                    /* el invitado se está desconectando */
                }
            });
        }, 8000);
    }

    detenerLatido() {
        if (this.temporizadorLatido) {
            clearInterval(this.temporizadorLatido);
            this.temporizadorLatido = null;
        }
    }

    iniciarVigilancia() {
        this.detenerVigilancia();
        this.temporizadorVigilancia = setInterval(() => {
            if (this.cerrado || this.modo !== "invitado") return;
            const conexion = this.conexion;
            if (!conexion?.open || this.detectadoCorte) return;
            if (Date.now() - this.ultimaSenal < 20000) return;
            this.detectadoCorte = true;
            this.onEstado("desconectado", "Se perdió la conexión con la sala.");
            this.programarReconexionInvitado();
        }, 5000);
    }

    detenerVigilancia() {
        if (this.temporizadorVigilancia) {
            clearInterval(this.temporizadorVigilancia);
            this.temporizadorVigilancia = null;
        }
    }

    programarReconexionInvitado() {
        if (this.modo !== "invitado" || this.cerrado || !this.codigo) return;
        this.detenerVigilancia();
        if (this.intentosReconexion >= 1) {
            this.onEstado("desconectado", "No se pudo reconectar. Pulsa Reconectar.");
            return;
        }
        this.intentosReconexion += 1;
        this.limpiarReconexion();
        this.temporizadorReconexion = setTimeout(() => {
            this.temporizadorReconexion = null;
            if (this.cerrado || this.modo !== "invitado") return;
            if (!this.peer?.open) {
                this.onEstado("desconectado", "Sin conexión. Pulsa Reconectar.");
                return;
            }
            this.onEstado("conectando", "Reconectando con la sala…");
            const conexion = this.peer.connect(idAnfitrion(this.codigo), { reliable: true });
            this.conectarInvitado(conexion);
        }, 1200);
    }

    limpiarReconexion() {
        if (this.temporizadorReconexion) {
            clearTimeout(this.temporizadorReconexion);
            this.temporizadorReconexion = null;
        }
    }

    enviar(mensaje) {
        if (this.modo === "anfitrion") {
            this.reenviar(mensaje);
            return true;
        }
        if (this.conexion?.open) {
            this.conexion.send({ tipo: "pista", mensaje });
            return true;
        }
        return false;
    }

    reenviar(mensaje) {
        this.conexiones.forEach((conexion) => {
            if (!conexion.open) return;
            try {
                conexion.send({ tipo: "pista", mensaje });
            } catch {
                /* el invitado se está desconectando */
            }
        });
    }

    limpiar() {
        this.conexiones.forEach((conexion) => {
            if (!conexion.open) return;
            try {
                conexion.send({ tipo: "limpiar" });
            } catch {
                /* el invitado se está desconectando */
            }
        });
    }

    programarTimeout() {
        this.limpiarTemporizador();
        this.temporizador = setTimeout(() => {
            if (this.cerrado) return;
            if (this.modo === "anfitrion" && this.peer?.open) return;
            if (this.modo === "invitado" && this.conexion?.open) return;
            this.onEstado(
                "error",
                "La conexión tardó demasiado. Comprueba la red y vuelve a intentarlo."
            );
        }, 15000);
    }

    limpiarTemporizador() {
        if (this.temporizador) {
            clearTimeout(this.temporizador);
            this.temporizador = null;
        }
    }

    fallar(error) {
        if (this.cerrado) return;
        this.limpiarTemporizador();
        this.limpiarReconexion();
        this.detenerVigilancia();
        this.onEstado("error", mensajeErrorSala(error));
    }

    cerrar() {
        this.cerrado = true;
        this.limpiarTemporizador();
        this.limpiarReconexion();
        this.detenerLatido();
        this.detenerVigilancia();
        this.intentosReconexion = 0;
        this.conexiones.forEach((conexion) => {
            try {
                conexion.close();
            } catch {
                /* ya estaba cerrada */
            }
        });
        this.conexiones = [];
        if (this.conexion) {
            try {
                this.conexion.close();
            } catch {
                /* ya estaba cerrada */
            }
        }
        this.conexion = null;
        if (this.peer) {
            try {
                this.peer.destroy();
            } catch {
                /* ya estaba destruido */
            }
        }
        this.peer = null;
        this.modo = null;
    }
}
