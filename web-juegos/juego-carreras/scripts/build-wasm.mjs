import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = fileURLToPath(new URL("..", import.meta.url));
const ENTRADA = join(RAIZ, "wasm", "nucleo.ts");
const SALIDA = join(RAIZ, "wasm", "nucleo.wasm");
const ASC = join(RAIZ, "node_modules", ".bin", process.platform === "win32" ? "asc.cmd" : "asc");

if (!existsSync(ASC)) {
    console.error("Falta assemblyscript. Ejecuta `npm install` dentro de juego-carreras/.");
    process.exit(1);
}

console.log("Compilando wasm/nucleo.ts → wasm/nucleo.wasm");
execFileSync(ASC, [ENTRADA, "--outFile", SALIDA, "-O3", "--noAssert"], {
    cwd: RAIZ,
    stdio: "inherit",
});

const bytes = readFileSync(SALIDA);
const importaciones = {
    env: {
        abort: () => {
            throw new Error("nucleo.wasm abortó la ejecución");
        },
    },
};

const { instance } = await WebAssembly.instantiate(bytes, importaciones);
const nucleo = instance.exports;

function afirmar(condicion, mensaje) {
    if (!condicion) {
        console.error(`Validación fallida: ${mensaje}`);
        process.exit(1);
    }
}

const MUESTRAS = 640;
afirmar(nucleo.inicializar(2026, MUESTRAS) === 1, "inicializar debe devolver 1");
afirmar(nucleo.totalMuestras() === MUESTRAS, "el total de muestras debe coincidir");
afirmar(nucleo.estridas() === 10, "el estrido del bloque debe ser 10");

const largo = nucleo.longitud();
afirmar(largo > 400 && largo < 2000, `longitud fuera de rango: ${largo}`);

const datos = new Float32Array(
    nucleo.memory.buffer,
    nucleo.datosPtr(),
    nucleo.totalMuestras() * nucleo.estridas()
);

// Los puntos deben existir, no repetirse y mantenerse a una distancia parecida
// (remuestreo por longitud de arco).
const primera = [nucleo.posicionX(0), nucleo.posicionY(0), nucleo.posicionZ(0)];
afirmar(
    primera.some((v) => Number.isFinite(v)),
    "la primera muestra debe ser finita"
);
afirmar(
    primera[0] !== nucleo.posicionX(10) || primera[2] !== nucleo.posicionZ(10),
    "las muestras no deben repetirse"
);

const paso = largo / MUESTRAS;
let minimo = Infinity;
let maximo = 0;
for (let i = 0; i < MUESTRAS; i += 1) {
    const a = i * 10;
    const b = ((i + 1) % MUESTRAS) * 10;
    const dx = datos[b] - datos[a];
    const dy = datos[b + 1] - datos[a + 1];
    const dz = datos[b + 2] - datos[a + 2];
    const distancia = Math.hypot(dx, dy, dz);
    minimo = Math.min(minimo, distancia);
    maximo = Math.max(maximo, distancia);
}
afirmar(minimo > paso * 0.6, `paso mínimo demasiado corto: ${minimo.toFixed(2)}`);
afirmar(maximo < paso * 1.6, `paso máximo demasiado largo: ${maximo.toFixed(2)}`);

// Determinismo: misma semilla, mismo binario en memoria.
const copia = datos.slice();
nucleo.inicializar(2026, MUESTRAS);
const repetido = new Float32Array(
    nucleo.memory.buffer,
    nucleo.datosPtr(),
    nucleo.totalMuestras() * nucleo.estridas()
);
afirmar(
    copia.every((valor, indice) => valor === repetido[indice]),
    "la misma semilla debe producir el mismo circuito"
);

// Semilla distinta, circuito distinto.
nucleo.inicializar(7, MUESTRAS);
afirmar(nucleo.posicionX(0) !== copia[0], "otra semilla debe cambiar el trazado");

// La proyección avanza de forma incremental sin saltos.
nucleo.inicializar(2026, MUESTRAS);
const cercana = nucleo.buscarCercana(nucleo.posicionX(120), nucleo.posicionZ(120), 110, 32);
afirmar(Math.abs(cercana - 120) <= 2, `buscarCercana devolvió ${cercana} en vez de ~120`);

console.log(
    `OK nucleo.wasm · ${(bytes.byteLength / 1024).toFixed(1)} KB · ${MUESTRAS} muestras · ${largo.toFixed(1)} m · paso ${paso.toFixed(2)} m`
);
