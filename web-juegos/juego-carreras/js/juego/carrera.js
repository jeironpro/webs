/**
 * Envuelve la carrera que simula el núcleo wasm. Cada frame solo se cruza el
 * `dt` y el input; el estado se lee de la memoria lineal del módulo.
 */
export function crearCarrera({ nucleo, dificultad = 1, vueltas = 3 }) {
    const totalRivales = nucleo.totalRivales();
    let estado = nucleo.estado();
    let config = { dificultad, vueltas };

    const leer = () => {
        const coche = {
            x: estado[0],
            y: estado[1],
            z: estado[2],
            rumbo: estado[3],
            velocidad: estado[4],
            desvio: estado[5],
            progreso: estado[6],
            vuelta: estado[7],
            tiempo: estado[8],
            mejorVuelta: estado[9],
            terminado: estado[10] === 1,
            indice: estado[11],
            choques: estado[12],
            vueltasTotales: estado[13],
            longitud: estado[14],
            muestras: estado[15],
        };

        const rivales = [];
        for (let r = 0; r < totalRivales; r += 1) {
            const base = 16 + r * 7;
            rivales.push({
                x: estado[base],
                y: estado[base + 1],
                z: estado[base + 2],
                rumbo: estado[base + 3],
                velocidad: estado[base + 4],
                progreso: estado[base + 5],
                vuelta: estado[base + 6],
            });
        }

        return { coche, rivales };
    };

    return {
        rivales: totalRivales,
        get vueltas() {
            return config.vueltas;
        },
        iniciar(opciones = {}) {
            config = {
                dificultad: opciones.dificultad ?? config.dificultad,
                vueltas: opciones.vueltas ?? config.vueltas,
            };
            nucleo.iniciarCarrera(config.dificultad, config.vueltas);
            estado = nucleo.estado();
            return leer();
        },
        paso(dt, input) {
            nucleo.paso(dt, input.acelerar, input.frenar, input.giro, input.derrape ? 1 : 0);
            return leer();
        },
        leer,
    };
}
