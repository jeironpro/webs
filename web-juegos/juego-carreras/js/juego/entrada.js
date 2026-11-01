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

/**
 * Teclado, gamepad estándar y botones táctiles comparten el mismo contrato:
 * acelerar/frenar en 0..1, giro en -1..1 y derrape booleano.
 */
export function crearEntrada() {
    const teclas = new Set();
    const tactiles = new Set();
    const acciones = new Map();
    let pausaGamepadPrevia = false;

    const alPulsar = (evento) => {
        const accion = MAPA.get(evento.code);
        if (!accion) return;
        if (BLOQUEADAS.has(evento.code)) evento.preventDefault();
        if (!evento.repeat && (accion === "pausa" || accion === "reiniciar")) {
            acciones.get(accion)?.();
        }
        teclas.add(accion);
    };

    const alSoltar = (evento) => {
        const accion = MAPA.get(evento.code);
        if (accion) teclas.delete(accion);
    };

    const alPerderFoco = () => teclas.clear();

    globalThis.addEventListener("keydown", alPulsar, { passive: false });
    globalThis.addEventListener("keyup", alSoltar);
    globalThis.addEventListener("blur", alPerderFoco);

    function enlazarTactil() {
        const botones = document.querySelectorAll("[data-accion]");
        botones.forEach((boton) => {
            const accion = boton.dataset.accion;
            const activar = (evento) => {
                evento.preventDefault();
                tactiles.add(accion);
                boton.dataset.pulsado = "true";
                boton.setPointerCapture?.(evento.pointerId);
            };
            const desactivar = () => {
                tactiles.delete(accion);
                delete boton.dataset.pulsado;
            };

            boton.addEventListener("pointerdown", activar);
            boton.addEventListener("pointerup", desactivar);
            boton.addEventListener("pointercancel", desactivar);
            boton.addEventListener("pointerleave", desactivar);
            boton.addEventListener("contextmenu", (evento) => evento.preventDefault());
        });
    }

    enlazarTactil();

    function leerGamepad() {
        const pads = navigator.getGamepads?.() ?? [];
        const pad = Array.from(pads).find((candidato) => candidato && candidato.connected);
        if (!pad) return null;

        const eje = pad.axes[0] ?? 0;
        const izquierdaDpad = pad.buttons[14]?.pressed ? 1 : 0;
        const derechaDpad = pad.buttons[15]?.pressed ? 1 : 0;
        const inicio = Boolean(pad.buttons[9]?.pressed);

        if (inicio && !pausaGamepadPrevia) acciones.get("pausa")?.();
        pausaGamepadPrevia = inicio;

        return {
            acelerar: pad.buttons[7]?.value ?? 0,
            frenar: pad.buttons[6]?.value ?? 0,
            giro: Math.abs(eje) > 0.15 ? eje : derechaDpad - izquierdaDpad,
            derrape: Boolean(pad.buttons[0]?.pressed),
        };
    }

    return {
        alAccion(accion, manejador) {
            acciones.set(accion, manejador);
        },
        /** Suelta los botones táctiles al ocultarlos: si no, quedan pegados. */
        soltarTactiles() {
            if (tactiles.size === 0) return;
            tactiles.clear();
            document.querySelectorAll("[data-accion]").forEach((boton) => {
                delete boton.dataset.pulsado;
            });
        },
        leer() {
            const pad = leerGamepad();
            const izquierda = teclas.has("izquierda") || tactiles.has("izquierda");
            const derecha = teclas.has("derecha") || tactiles.has("derecha");

            let acelerar = teclas.has("acelerar") || tactiles.has("acelerar") ? 1 : 0;
            let frenar = teclas.has("frenar") || tactiles.has("frenar") ? 1 : 0;
            let giro = (derecha ? 1 : 0) - (izquierda ? 1 : 0);
            let derrape = teclas.has("derrape") || tactiles.has("derrape");

            if (pad) {
                acelerar = Math.max(acelerar, pad.acelerar);
                frenar = Math.max(frenar, pad.frenar);
                giro = Math.max(-1, Math.min(1, giro + pad.giro));
                derrape = derrape || pad.derrape;
            }

            return { acelerar, frenar, giro, derrape };
        },
    };
}
