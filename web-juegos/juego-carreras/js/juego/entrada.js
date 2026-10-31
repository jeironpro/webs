const MAPA = new Map([
    ["ArrowUp", "acelerar"],
    ["KeyW", "acelerar"],
    ["ArrowDown", "frenar"],
    ["KeyS", "frenar"],
    ["ArrowLeft", "izquierda"],
    ["KeyA", "izquierda"],
    ["ArrowRight", "derecha"],
    ["KeyD", "derecha"],
    ["Space", "derrape"],
    ["ShiftLeft", "derrape"],
    ["KeyR", "reiniciar"],
    ["KeyP", "pausa"],
    ["Escape", "pausa"],
]);

const BLOQUEADAS = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"]);

export function crearEntrada() {
    const activas = new Set();
    const acciones = new Map();

    const alPulsar = (evento) => {
        const accion = MAPA.get(evento.code);
        if (!accion) return;
        if (BLOQUEADAS.has(evento.code)) evento.preventDefault();
        if (!evento.repeat) {
            const manejador = acciones.get(accion);
            if (manejador && (accion === "pausa" || accion === "reiniciar")) manejador();
        }
        activas.add(accion);
    };

    const alSoltar = (evento) => {
        const accion = MAPA.get(evento.code);
        if (accion) activas.delete(accion);
    };

    const alPerderFoco = () => activas.clear();

    globalThis.addEventListener("keydown", alPulsar, { passive: false });
    globalThis.addEventListener("keyup", alSoltar);
    globalThis.addEventListener("blur", alPerderFoco);

    return {
        alAccion(accion, manejador) {
            acciones.set(accion, manejador);
        },
        leer() {
            return {
                acelerar: activas.has("acelerar") ? 1 : 0,
                frenar: activas.has("frenar") ? 1 : 0,
                giro: (activas.has("derecha") ? 1 : 0) - (activas.has("izquierda") ? 1 : 0),
                derrape: activas.has("derrape"),
            };
        },
        liberar() {
            activas.clear();
            acciones.clear();
            globalThis.removeEventListener("keydown", alPulsar);
            globalThis.removeEventListener("keyup", alSoltar);
            globalThis.removeEventListener("blur", alPerderFoco);
        },
    };
}
