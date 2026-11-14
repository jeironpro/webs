import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { contarSoluciones, crearRng, generarPuzzle, validarTablero } from "../js/wend-core.js";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const CANTIDAD = Number(process.argv[2] ?? 20);
const SEMILLA = 9187;
const TABLERO = 6;

const palabras = JSON.parse(readFileSync(join(RAIZ, "json", "palabras.json"), "utf8")).map(
    (palabra) => palabra.toUpperCase()
);

const tableros = [];
const inicio = Date.now();

for (let k = 0; k < CANTIDAD; k++) {
    let tablero = null;
    for (let intento = 0; intento < 24 && !tablero; intento++) {
        const semilla = (SEMILLA + k * 7919 + intento * 104729) >>> 0;
        const puzzle = generarPuzzle(TABLERO, palabras, {
            rng: crearRng(semilla),
            intentos: 80,
        });
        if (puzzle && validarTablero(puzzle, palabras, { presupuesto: 300000 })) {
            tablero = puzzle;
        }
    }

    if (!tablero) {
        process.stderr.write(`No se pudo generar el tablero #${k + 1}`);
        process.exit(1);
    }

    const registro = {
        id: `wend-6-${k + 1}`,
        n: tablero.n,
        letras: tablero.letras,
        muros: tablero.muros,
        solucion: tablero.solucion,
    };

    const { soluciones } = contarSoluciones(tablero, palabras, {
        limite: 2,
        presupuesto: 300000,
    });
    if (soluciones.length !== 1) {
        process.stderr.write(`El tablero ${registro.id} no tiene solución única`);
        process.exit(1);
    }

    tableros.push(registro);
    process.stdout.write(
        `  ${registro.id}: ${registro.solucion.map(({ palabra }) => palabra).join(" · ")}\n`
    );
}

const salida = join(RAIZ, "json", "tableros.json");
mkdirSync(dirname(salida), { recursive: true });
writeFileSync(
    salida,
    `${JSON.stringify({ generado: new Date().toISOString().slice(0, 10), tableros }, null, 2)}\n`,
    "utf8"
);
process.stdout.write(
    `OK ${tableros.length} tableros en ${((Date.now() - inicio) / 1000).toFixed(1)}s -> ${salida}`
);
