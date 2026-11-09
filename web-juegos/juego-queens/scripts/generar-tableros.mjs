/**
 * Genera juego-queens/json/tableros.json con tableros de solución única.
 *
 * Uso: node juego-queens/scripts/generar-tableros.mjs [cantidad por tamaño]
 *
 * Las semillas son fijas, así que el archivo se puede reproducir tal cual.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
    contarSoluciones,
    crearRng,
    esSolucion,
    generarPuzzle,
    regionesValidas,
} from "../js/queens-core.js";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const TAMANOS = [7, 8, 9];
const POR_TAMANO = Number(process.argv[2] ?? 20);
const INTENTOS = 400;

const tableros = [];

for (const n of TAMANOS) {
    const inicio = Date.now();
    for (let k = 0; k < POR_TAMANO; k++) {
        const semilla = (n * 200003 + k * 104729 + 29) >>> 0;
        const puzzle = generarPuzzle(n, {
            rng: crearRng(semilla),
            intentos: INTENTOS,
            presupuesto: 400000,
        });

        if (!puzzle) {
            console.error(`No se pudo generar el tablero ${n}x${n} #${k + 1}`);
            process.exit(1);
        }

        const tablero = {
            id: `queens-${n}-${k + 1}`,
            n,
            regiones: puzzle.regiones,
            solucion: puzzle.solucion,
        };

        const { soluciones } = contarSoluciones(tablero, { limite: 2, presupuesto: 400000 });
        if (soluciones.length !== 1) {
            console.error(`El tablero ${tablero.id} no tiene solución única`);
            process.exit(1);
        }
        if (!esSolucion(tablero, tablero.solucion) || !regionesValidas(tablero)) {
            console.error(`El tablero ${tablero.id} no es válido`);
            process.exit(1);
        }

        tableros.push(tablero);
        process.stdout.write(`  ${tablero.id}\n`);
    }
    console.log(`${n}x${n}: ${POR_TAMANO} tableros en ${((Date.now() - inicio) / 1000).toFixed(1)}s`);
}

const salida = join(RAIZ, "json", "tableros.json");
mkdirSync(dirname(salida), { recursive: true });
writeFileSync(
    salida,
    `${JSON.stringify({ generado: new Date().toISOString().slice(0, 10), tableros }, null, 2)}\n`,
    "utf8"
);
console.log(`OK ${tableros.length} tableros -> ${salida}`);
