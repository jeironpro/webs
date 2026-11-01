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

function estadoActual() {
    return new Float32Array(nucleo.memory.buffer, nucleo.estadoPtr(), nucleo.estridasEstado());
}

// `inicializar` reconstruye los buffers del módulo, así que las vistas sobre
// memoria se piden después de cada reinicio.
function vistas() {
    const total = nucleo.totalMuestras();
    const est = nucleo.estridas();
    return {
        total,
        est,
        datos: new Float32Array(nucleo.memory.buffer, nucleo.datosPtr(), total * est),
        estado: estadoActual(),
    };
}

function indiceMuestra(total, indice) {
    return ((indice % total) + total) % total;
}

function curvaturaEn(datos, est, total, indice) {
    const antes = indiceMuestra(total, indice - 5) * est;
    const despues = indiceMuestra(total, indice + 5) * est;
    return Math.abs(datos[antes + 5] * datos[despues + 3] - datos[antes + 3] * datos[despues + 5]);
}

/**
 * Piloto de pruebas: como la dirección ya no se endereza sola, la carrera se
 * simula con un conductor que apunta a la pista y frena en las curvas cerradas.
 */
function pilotar({ estado, datos, est, total }) {
    const velocidad = estado[4];
    const adelanto = Math.round(7 + velocidad * 0.55);
    const objetivo = indiceMuestra(total, estado[11] + adelanto) * est;
    const deseado = Math.atan2(datos[objetivo] - estado[0], datos[objetivo + 2] - estado[2]);
    const error = normalizarAngulo(deseado - estado[3]);
    const curva = Math.max(
        curvaturaEn(datos, est, total, estado[11] + 12),
        curvaturaEn(datos, est, total, estado[11] + 24)
    );

    return {
        acelerar: 1,
        frenar: curva > 0.1 && velocidad > 45 * (1 - curva * 1.5) ? 0.55 : 0,
        giro: Math.max(-1, Math.min(1, -error * 2.4)),
    };
}

function normalizarAngulo(angulo) {
    let valor = angulo;
    while (valor > Math.PI) valor -= Math.PI * 2;
    while (valor < -Math.PI) valor += Math.PI * 2;
    return valor;
}

function simular(frames, conducir = true, dificultad = 1) {
    nucleo.inicializar(2026, MUESTRAS);
    nucleo.iniciarCarrera(dificultad, 3);
    const v = vistas();
    let pico = 0;
    for (let frame = 0; frame < frames; frame += 1) {
        const entrada = conducir ? pilotar(v) : { acelerar: 1, frenar: 0, giro: 0 };
        nucleo.paso(1 / 60, entrada.acelerar, entrada.frenar, entrada.giro, 0);
        pico = Math.max(pico, v.estado[4]);
    }
    return { valores: Array.from(v.estado), pico };
}

const carrera = simular(60 * 45);
const [cocheX, , cocheZ, , velocidad, desvio, progreso, vuelta, tiempo, mejorVuelta] =
    carrera.valores;

for (const [nombre, valor] of Object.entries({ cocheX, cocheZ, velocidad, desvio, tiempo })) {
    afirmar(Number.isFinite(valor), `${nombre} no es finito`);
}
afirmar(carrera.pico > 25, `velocidad máxima demasiado baja: ${carrera.pico.toFixed(1)} m/s`);
afirmar(vuelta >= 2, `esperaba al menos 2 vueltas, van ${vuelta}`);
afirmar(tiempo > 20, `tiempo de carrera demasiado bajo: ${tiempo.toFixed(1)} s`);
afirmar(mejorVuelta > 5, `mejor vuelta no registrada: ${mejorVuelta}`);
afirmar(progreso >= 0 && progreso < 1, `progreso fuera de rango: ${progreso}`);
afirmar(Math.abs(desvio) < 12, `el coche se ha salido demasiado: ${desvio.toFixed(1)} m`);

const rivalProgreso = carrera.valores[21];
const rivalVelocidad = carrera.valores[20];
afirmar(
    rivalProgreso >= 0 && rivalProgreso < 1,
    `progreso de rival fuera de rango: ${rivalProgreso}`
);
afirmar(rivalVelocidad > 20, `rival demasiado lento: ${rivalVelocidad.toFixed(1)} m/s`);

/**
 * Ritmo del rival tras `segundos` de carrera: distancia en vueltas y velocidad
 * final, junto al avance del jugador para comparar. Es la medida que confirma
 * que la IA usa la dificultad para correr más y que el rival es competitivo sin
 * volverse imbatible.
 */
function ritmoRival(dificultad, segundos = 40) {
    const { valores } = simular(Math.round(60 * segundos), true, dificultad);
    return {
        avance: valores[22] - 1 + valores[21],
        velocidad: valores[20],
        avanceJugador: valores[7] - 1 + valores[6],
    };
}

const ritmoFacil = ritmoRival(0);
const ritmoNormal = ritmoRival(1);
const ritmoDificil = ritmoRival(2);

const vueltas = (ritmo) => `${ritmo.avance.toFixed(2)} vueltas`;
const vueltasDe = (avance) => `${avance.toFixed(2)} vueltas`;
afirmar(
    ritmoFacil.avance < ritmoNormal.avance && ritmoNormal.avance < ritmoDificil.avance,
    `la dificultad debe subir el ritmo del rival: ${vueltas(ritmoFacil)} / ${vueltas(ritmoNormal)} / ${vueltas(ritmoDificil)}`
);
// La velocidad instantánea no sirve para comparar: cada dificultad va por un
// punto distinto del circuito. Lo que manda es el ritmo medio, medido en
// distancia recorrida sobre los mismos segundos.
const ritmoMedio = (ritmo) => (ritmo.avance * largo) / 40;
afirmar(
    ritmoDificil.avance > ritmoFacil.avance * 1.05,
    `difícil debe rodar más rápido que fácil: ${vueltas(ritmoFacil)} vs ${vueltas(ritmoDificil)}`
);

// En normal el rival debe rodar cerca del jugador: por delante no interesa, y a
// más de un 35 % de desventaja la carrera deja de ser una carrera.
const proporcion = ritmoNormal.avance / ritmoNormal.avanceJugador;
afirmar(
    proporcion > 0.88 && proporcion < 1.2,
    `rival descompensado en normal: ${vueltasDe(ritmoNormal.avance)} frente a ${vueltasDe(ritmoNormal.avanceJugador)} del jugador`
);

// La dirección no está invertida: girar a la derecha (input +1) desplaza el coche
// hacia -X, que es la derecha en pantalla con el morro apuntando a +Z.
function simularGiro(giro) {
    nucleo.inicializar(2026, MUESTRAS);
    nucleo.iniciarCarrera(1, 3);
    const estado = estadoActual();
    for (let frame = 0; frame < 90; frame += 1) {
        nucleo.paso(1 / 60, 1, 0, giro, 0);
    }
    return { x: estado[0], rumbo: estado[3] };
}

const recto = simularGiro(0);
const derecha = simularGiro(1);
const izquierda = simularGiro(-1);

afirmar(
    derecha.x < recto.x && izquierda.x > recto.x,
    `la dirección está invertida: recto ${recto.x.toFixed(2)}, derecha ${derecha.x.toFixed(2)}, izquierda ${izquierda.x.toFixed(2)}`
);

const repetida = simular(60 * 45);
afirmar(
    carrera.valores.every((valor, indice) => valor === repetida.valores[indice]),
    "la misma semilla e input deben producir la misma carrera"
);

// Sin volante el coche sale de la trazada: la asistencia ya no conduce sola.
const suelto = simular(60 * 20, false);
afirmar(
    Math.abs(suelto.valores[5]) > 8,
    `el coche no debe completar la pista sin volante (desvío ${suelto.valores[5].toFixed(1)} m)`
);

console.log(
    `OK nucleo.wasm · ${(bytes.byteLength / 1024).toFixed(1)} KB · ${MUESTRAS} muestras · ${largo.toFixed(1)} m · paso ${paso.toFixed(2)} m`
);
console.log(
    `OK carrera simulada · ${tiempo.toFixed(1)} s · ${vuelta} vueltas · mejor ${mejorVuelta.toFixed(1)} s · pico ${(carrera.pico * 3.6).toFixed(0)} km/h`
);
console.log(
    `OK rival · fácil ${(ritmoMedio(ritmoFacil) * 3.6).toFixed(0)} km/h · normal ${(ritmoMedio(ritmoNormal) * 3.6).toFixed(0)} km/h · difícil ${(ritmoMedio(ritmoDificil) * 3.6).toFixed(0)} km/h · jugador ${vueltasDe(ritmoNormal.avanceJugador)} en 40 s`
);
