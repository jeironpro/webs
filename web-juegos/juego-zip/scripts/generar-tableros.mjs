/**
 * Genera juego-zip/json/tableros.json con tableros de solución única.
 *
 * Uso: node juego-zip/scripts/generar-tableros.mjs [cantidad por tamaño]
 *
 * Las semillas son fijas, así que el archivo se puede reproducir tal cual.
 * La cantidad de números varía por tablero para que no todos se resuelvan igual.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { contarSoluciones, crearRng, esSolucion, generarPuzzle } from "../js/zip-core.js";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const TAMANOS = [6, 7, 8];
const POR_TAMANO = Number(process.argv[2] ?? 20);
const INTENTOS_SEMILLA = 40;
const RANGO_NUMEROS = {
    6: [5, 8],
    7: [6, 9],
    8: [7, 10],
};

const tableros = [];

for (const n of TAMANOS) {
    const [minimo, maximo] = RANGO_NUMEROS[n];
    for (let k = 0; k < POR_TAMANO; k++) {
        let puzzle = null;
        let cantidad = minimo;
        for (let intento = 0; intento < INTENTOS_SEMILLA && !puzzle; intento++) {
            cantidad = minimo + ((k * 3 + intento) % (maximo - minimo + 1));
            const semilla = (n * 100003 + k * 7919 + intento * 104729 + 17) >>> 0;
            puzzle = generarPuzzle(n, { rng: crearRng(semilla), intentos: 60, cantidad });
        }
        if (!puzzle) {
            console.error(`No se pudo generar el tablero ${n}x${n} #${k + 1}`);
            process.exit(1);
        }

        const { soluciones } = contarSoluciones(puzzle, { limite: 2, presupuesto: 400000 });
        if (soluciones.length !== 1) {
            console.error(`El tablero ${n}x${n} #${k + 1} no tiene solución única`);
            process.exit(1);
        }

        const tablero = {
            id: `zip-${n}-${k + 1}`,
            n,
            numeros: puzzle.numeros,
            muros: puzzle.muros,
            solucion: soluciones[0],
        };
        if (!esSolucion(tablero, tablero.solucion)) {
            console.error(`La solución guardada de ${tablero.id} no es válida`);
            process.exit(1);
        }
        tableros.push(tablero);
    }
    console.log(`${n}x${n}: ${POR_TAMANO} tableros`);
}

const salida = join(RAIZ, "json", "tableros.json");
mkdirSync(dirname(salida), { recursive: true });
writeFileSync(
    salida,
    `${JSON.stringify({ generado: new Date().toISOString().slice(0, 10), tableros }, null, 2)}\n`,
    "utf8"
);
console.log(`OK ${tableros.length} tableros -> ${salida}`);
