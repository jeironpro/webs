import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { crearRng, generarPuzzle } from "../js/tango-core.js";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const CANTIDAD = Number(process.argv[2]) || 20;
const SEMILLA_BASE = 4207;

const tableros = [];
const inicio = Date.now();

for (let k = 1; k <= CANTIDAD; k++) {
    const t0 = performance.now();
    const rng = crearRng(SEMILLA_BASE + k * 7919);
    const puzzle = generarPuzzle(rng, 6);
    tableros.push({ id: `tango-6-${k}`, ...puzzle });
    const ms = Math.round(performance.now() - t0);
    process.stdout.write(
        `  ${k.toString().padStart(2, "0")} ${puzzle.dados.length} dadas, ${puzzle.relaciones.length} relaciones (${ms} ms)`
    );
}

mkdirSync(join(RAIZ, "json"), { recursive: true });
writeFileSync(join(RAIZ, "json", "tableros.json"), `${JSON.stringify({ tableros }, null, 2)}\n`);
process.stdout.write(`Listo: ${tableros.length} tableros en ${Date.now() - inicio} ms.`);
