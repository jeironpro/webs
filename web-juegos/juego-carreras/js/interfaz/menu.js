export function crearMenu({ alIniciar }) {
    const panel = document.getElementById("menu");
    const dificultad = document.getElementById("opcion-dificultad");
    const semilla = document.getElementById("opcion-semilla");
    const sonido = document.getElementById("opcion-sonido");
    const vueltas = document.getElementById("opcion-vueltas");
    const boton = document.getElementById("boton-iniciar");

    function leer() {
        const semillaIntroducida = Number.parseInt(semilla.value, 10);
        return {
            dificultad: Number.parseInt(dificultad.value, 10) || 0,
            semilla: Number.isFinite(semillaIntroducida) && semillaIntroducida > 0 ? semillaIntroducida : 2026,
            vueltas: Number.parseInt(vueltas.value, 10) || 3,
            sonido: sonido.checked,
        };
    }

    boton.addEventListener("click", () => alIniciar(leer()));

    return {
        leer,
        ocultar() {
            panel.classList.add("menu--oculto");
        },
        mostrar() {
            panel.classList.remove("menu--oculto");
        },
    };
}
