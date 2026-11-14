import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
    contarSoluciones,
    crearRng,
    esSolucion,
    generarPuzzle,
    formaDe,
} from "../js/patches-core.js";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const CANTIDAD = Number(process.argv[2] ?? 20);
const SEMILLA = 6207;
const TABLERO = 6;

const tableros = [];
const inicio = Date.now();

for (let k = 0; k < CANTIDAD; k++) {
    const puzzle = generarPuzzle(TABLERO, crearRng(SEMILLA + k * 7919), {
        intentos: 400,
        minimoRetales: 5,
        maximoRetales: 7,
    });

    if (!puzzle) {
        process.stderr.write(`No se pudo generar el tablero #${k + 1}`);
        process.exit(1);
    }

    const tablero = {
        id: `patches-6-${k + 1}`,
        n: puzzle.n,
        pistas: puzzle.pistas,
        solucion: puzzle.solucion,
    };

    const { soluciones } = contarSoluciones(tablero, { limite: 2 });
    if (soluciones.length !== 1) {
        process.stderr.write(`El tablero ${tablero.id} no tiene solución única`);
        process.exit(1);
    }
    if (!esSolucion(tablero, tablero.solucion)) {
        process.stderr.write(`El tablero ${tablero.id} no es válido`);
        process.exit(1);
    }

    for (const pista of tablero.pistas) {
        const pieza = tablero.solucion.find(
            (candidata) => candidata.k === tablero.pistas.indexOf(pista)
        );
        if (!pieza) {
            process.stderr.write(`La pista ${pista.i} de ${tablero.id} no tiene retal`);
            process.exit(1);
        }
        if (pieza.w * pieza.h !== pista.area) {
            process.stderr.write(`El área de la pista ${pista.i} de ${tablero.id} no coincide`);
            process.exit(1);
        }
        if (pista.forma !== "libre" && formaDe(pieza.w, pieza.h) !== pista.forma) {
            process.stderr.write(`La forma de la pista ${pista.i} de ${tablero.id} no coincide`);
            process.exit(1);
        }
    }

    tableros.push(tablero);
    process.stdout.write(`  ${tablero.id}: ${tablero.pistas.length} retales\n`);
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
