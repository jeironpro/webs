export function crearHud() {
    const contenedor = document.getElementById("hud");
    const velocidad = document.getElementById("hud-velocidad");
    const vuelta = document.getElementById("hud-vuelta");
    const backend = document.getElementById("hud-backend");
    const backendTexto = document.getElementById("hud-backend-texto");

    let ultimaVelocidad = -1;
    let ultimaVuelta = "";

    return {
        mostrar(visible) {
            contenedor.hidden = !visible;
        },
        backend(nombre) {
            const esWebGPU = nombre === "webgpu";
            backendTexto.textContent = esWebGPU ? "WebGPU activo" : "WebGL 2 (fallback)";
            backend.classList.add(esWebGPU ? "chip--gpu" : "chip--webgl");
        },
        actualizar({ velocidadKmh, vueltaActual, vueltasTotales }) {
            const redondeada = Math.round(velocidadKmh);
            if (redondeada !== ultimaVelocidad) {
                ultimaVelocidad = redondeada;
                velocidad.textContent = String(redondeada);
            }

            const texto = `${vueltaActual}/${vueltasTotales}`;
            if (texto !== ultimaVuelta) {
                ultimaVuelta = texto;
                vuelta.textContent = texto;
            }
        },
    };
}
