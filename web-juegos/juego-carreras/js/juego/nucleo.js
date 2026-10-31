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

    const nucleo = {
        semilla: 0,
        estridas: 0,
        total: 0,
        datos: null,
        memoria: modulo.memory,
        longitud: 0,
        posicionX: (indice) => modulo.posicionX(indice),
        posicionY: (indice) => modulo.posicionY(indice),
        posicionZ: (indice) => modulo.posicionZ(indice),
        peralteEn: (indice) => modulo.peralteEn(indice),
        buscarCercana: (x, z, desde, ventana = 24) => modulo.buscarCercana(x, z, desde, ventana),
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
        /** Regenera el circuito con otra semilla y refresca las vistas. */
        regenerar(nuevaSemilla, cantidadMuestras = nucleo.total || 640) {
            if (modulo.inicializar(nuevaSemilla, cantidadMuestras) !== 1) {
                throw new Error("El núcleo no pudo generar el circuito");
            }
            refrescar();
            return nucleo;
        },
    };

    function refrescar() {
        nucleo.semilla = modulo.semilla();
        nucleo.estridas = modulo.estridas();
        nucleo.total = modulo.totalMuestras();
        nucleo.longitud = modulo.longitud();
        nucleo.datos = new Float32Array(
            modulo.memory.buffer,
            modulo.datosPtr(),
            nucleo.total * nucleo.estridas
        );
    }

    refrescar();
    return nucleo;
}
