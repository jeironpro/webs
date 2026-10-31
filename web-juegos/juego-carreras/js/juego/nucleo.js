const IMPORTACIONES = {
    env: {
        abort: () => {
            throw new Error("nucleo.wasm abortó la ejecución");
        },
    },
};

/**
 * Instancia `wasm/nucleo.wasm` y devuelve una vista de solo lectura sobre el
 * bloque de muestras del circuito. Es el único cruce de frontera por frame:
 * un Float32Array sobre la memoria lineal del módulo.
 */
export async function cargarNucleo({ semilla = 2026, muestras = 640 } = {}) {
    const url = new URL("../../wasm/nucleo.wasm", import.meta.url);
    const respuesta = await fetch(url);

    if (!respuesta.ok) {
        throw new Error(`No se pudo cargar nucleo.wasm (${respuesta.status})`);
    }

    let instancia;
    try {
        const resultado = await WebAssembly.instantiateStreaming(respuesta.clone(), IMPORTACIONES);
        instancia = resultado.instance;
    } catch {
        const bytes = await respuesta.arrayBuffer();
        const resultado = await WebAssembly.instantiate(bytes, IMPORTACIONES);
        instancia = resultado.instance;
    }

    const modulo = instancia.exports;

    if (modulo.inicializar(semilla, muestras) !== 1) {
        throw new Error("El núcleo no pudo generar el circuito");
    }

    const estridas = modulo.estridas();
    const total = modulo.totalMuestras();
    const datos = new Float32Array(modulo.memory.buffer, modulo.datosPtr(), total * estridas);

    return {
        semilla: modulo.semilla(),
        estridas,
        total,
        datos,
        memoria: modulo.memory,
        longitud: modulo.longitud(),
        iniciarCarrera: (dificultad, vueltas) => modulo.iniciarCarrera(dificultad, vueltas),
        paso: (dt, acelerar, frenar, giro, derrape) =>
            modulo.paso(dt, acelerar, frenar, giro, derrape),
        totalRivales: () => modulo.totalRivales(),
        estado: () =>
            new Float32Array(
                modulo.memory.buffer,
                modulo.estadoPtr(),
                modulo.estridasEstado()
            ),
        posicionX: (indice) => modulo.posicionX(indice),
        posicionY: (indice) => modulo.posicionY(indice),
        posicionZ: (indice) => modulo.posicionZ(indice),
        peralteEn: (indice) => modulo.peralteEn(indice),
        buscarCercana: (x, z, desde, ventana = 24) => modulo.buscarCercana(x, z, desde, ventana),
    };
}
