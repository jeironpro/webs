import { ACESFilmicToneMapping, SRGBColorSpace, WebGPURenderer } from "three/webgpu";

/**
 * Inicializa el renderizador. `WebGPURenderer` intenta WebGPU y cae a WebGL 2
 * por su cuenta; aquí solo se ajusta el pipeline y se informa del backend real.
 */
export async function crearRenderizador(contenedor) {
    const ancho = contenedor.clientWidth || globalThis.innerWidth || 1280;
    const alto = contenedor.clientHeight || globalThis.innerHeight || 720;

    const renderizador = new WebGPURenderer({
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
    });

    renderizador.setPixelRatio(Math.min(globalThis.devicePixelRatio || 1, 2));
    renderizador.setSize(ancho, alto);
    renderizador.outputColorSpace = SRGBColorSpace;
    renderizador.toneMapping = ACESFilmicToneMapping;
    renderizador.toneMappingExposure = 1.05;

    await renderizador.init();

    renderizador.domElement.classList.add("lienzo__canvas");
    contenedor.appendChild(renderizador.domElement);

    const backend = renderizador.backend?.isWebGPUBackend ? "webgpu" : "webgl2";

    return { renderizador, backend };
}

export function redimensionar(renderizador, camara, contenedor) {
    const ancho = contenedor.clientWidth || globalThis.innerWidth;
    const alto = contenedor.clientHeight || globalThis.innerHeight;
    if (ancho === 0 || alto === 0) return;

    renderizador.setPixelRatio(Math.min(globalThis.devicePixelRatio || 1, 2));
    renderizador.setSize(ancho, alto);
    camara.aspect = ancho / alto;
    camara.updateProjectionMatrix();
}
