// Núcleo determinista de Circuito Neón.
// Genera el trazado en WebAssembly y lo expone como un bloque plano de float32
// que el render lee directamente: un único buffer por circuito, sin objetos en
// el boundary.
//
// Layout por muestra (ESTRIDO floats):
//   [0..2] posicion  [3..5] tangente  [6..8] lateral  [9] peralte

const ESTRIDO: i32 = 10;
const PUNTOS_CONTROL: i32 = 12;
const MUESTRAS_FINAS: i32 = 4608;
const DOS_PI: f32 = 6.283185307179586;
const MAX_PERALTE: f32 = 0.22;

let datos = new Float32Array(0);
let finas = new Float32Array(0);
let acumulado = new Float32Array(0);
let peraltes = new Float32Array(0);
let control = new Float32Array(PUNTOS_CONTROL * 3);
let temporal = new Float32Array(3);

let total: i32 = 0;
let longitudTotal: f32 = 0;
let semillaActiva: u32 = 0;
let estadoAzar: u32 = 0;

/** mulberry32: mismo generador que la capa JS, reproducible entre sesiones. */
function azar(): f32 {
    estadoAzar = estadoAzar + 0x6d2b79f5;
    let t: u32 = estadoAzar;
    t = (t ^ (t >>> 15)) * (t | 1);
    t = t ^ (t + ((t ^ (t >>> 7)) * (t | 61)));
    return f32(t ^ (t >>> 14)) / 4294967296.0;
}

function limitar(valor: f32, minimo: f32, maximo: f32): f32 {
    if (valor < minimo) return minimo;
    if (valor > maximo) return maximo;
    return valor;
}

function catmull(p0: f32, p1: f32, p2: f32, p3: f32, t: f32): f32 {
    const t2 = t * t;
    const t3 = t2 * t;
    return 0.5 *
        (2.0 * p1 +
            (-p0 + p2) * t +
            (2.0 * p0 - 5.0 * p1 + 4.0 * p2 - p3) * t2 +
            (-p0 + 3.0 * p1 - 3.0 * p2 + p3) * t3);
}

function indiceControl(indice: i32): i32 {
    return ((indice % PUNTOS_CONTROL) + PUNTOS_CONTROL) % PUNTOS_CONTROL;
}

function indiceMuestra(indice: i32): i32 {
    return ((indice % total) + total) % total;
}

/** Rotación de Rodrigues sobre `temporal`; el eje debe llegar normalizado. */
function rotarAlrededor(
    vx: f32,
    vy: f32,
    vz: f32,
    kx: f32,
    ky: f32,
    kz: f32,
    angulo: f32
): void {
    const coseno = Mathf.cos(angulo);
    const seno = Mathf.sin(angulo);
    const proyeccion = vx * kx + vy * ky + vz * kz;
    const cx = ky * vz - kz * vy;
    const cy = kz * vx - kx * vz;
    const cz = kx * vy - ky * vx;
    temporal[0] = vx * coseno + cx * seno + kx * proyeccion * (1.0 - coseno);
    temporal[1] = vy * coseno + cy * seno + ky * proyeccion * (1.0 - coseno);
    temporal[2] = vz * coseno + cz * seno + kz * proyeccion * (1.0 - coseno);
}

function generarControl(): void {
    for (let i = 0; i < PUNTOS_CONTROL; i++) {
        const angulo = (f32(i) / f32(PUNTOS_CONTROL)) * DOS_PI;
        const radio: f32 = 104.0 + azar() * 46.0;
        const altura: f32 = Mathf.sin(f32(i) * 0.9) * 3.2 + azar() * 2.6;
        control[i * 3] = Mathf.cos(angulo) * radio;
        control[i * 3 + 1] = altura;
        control[i * 3 + 2] = Mathf.sin(angulo) * radio;
    }
}

/** Muestreo fino del spline cerrado y acumulación de longitudes de arco. */
function generarFinas(): void {
    finas = new Float32Array(MUESTRAS_FINAS * 3);
    acumulado = new Float32Array(MUESTRAS_FINAS + 1);

    for (let i = 0; i < MUESTRAS_FINAS; i++) {
        const u = (f32(i) / f32(MUESTRAS_FINAS)) * f32(PUNTOS_CONTROL);
        const tramo = i32(u) % PUNTOS_CONTROL;
        const t = u - f32(i32(u));

        const p0 = indiceControl(tramo - 1) * 3;
        const p1 = indiceControl(tramo) * 3;
        const p2 = indiceControl(tramo + 1) * 3;
        const p3 = indiceControl(tramo + 2) * 3;

        finas[i * 3] = catmull(control[p0], control[p1], control[p2], control[p3], t);
        finas[i * 3 + 1] = catmull(
            control[p0 + 1],
            control[p1 + 1],
            control[p2 + 1],
            control[p3 + 1],
            t
        );
        finas[i * 3 + 2] = catmull(
            control[p0 + 2],
            control[p1 + 2],
            control[p2 + 2],
            control[p3 + 2],
            t
        );
    }

    acumulado[0] = 0;
    for (let i = 1; i <= MUESTRAS_FINAS; i++) {
        const a = ((i - 1) % MUESTRAS_FINAS) * 3;
        const b = (i % MUESTRAS_FINAS) * 3;
        const dx = finas[b] - finas[a];
        const dy = finas[b + 1] - finas[a + 1];
        const dz = finas[b + 2] - finas[a + 2];
        acumulado[i] = acumulado[i - 1] + Mathf.sqrt(dx * dx + dy * dy + dz * dz);
    }

    longitudTotal = acumulado[MUESTRAS_FINAS];
}

/** Remuestreo uniforme por longitud de arco: cada muestra equidista de la anterior. */
function generarMuestras(): void {
    datos = new Float32Array(total * ESTRIDO);
    let cursor = 0;

    for (let j = 0; j < total; j++) {
        const objetivo = (f32(j) / f32(total)) * longitudTotal;
        while (cursor < MUESTRAS_FINAS - 1 && acumulado[cursor + 1] < objetivo) {
            cursor++;
        }

        const inicio = acumulado[cursor];
        const fin = acumulado[cursor + 1];
        const tramo = fin - inicio;
        const mezcla = tramo > 0 ? (objetivo - inicio) / tramo : 0.0;

        const a = (cursor % MUESTRAS_FINAS) * 3;
        const b = ((cursor + 1) % MUESTRAS_FINAS) * 3;
        const base = j * ESTRIDO;

        datos[base] = finas[a] + (finas[b] - finas[a]) * mezcla;
        datos[base + 1] = finas[a + 1] + (finas[b + 1] - finas[a + 1]) * mezcla;
        datos[base + 2] = finas[a + 2] + (finas[b + 2] - finas[a + 2]) * mezcla;
    }
}

/** Tangentes por diferencias centrales y lateral = tangente × arriba. */
function generarMarcos(): void {
    for (let j = 0; j < total; j++) {
        const anterior = indiceMuestra(j - 1) * ESTRIDO;
        const siguiente = indiceMuestra(j + 1) * ESTRIDO;
        const base = j * ESTRIDO;

        let tx = datos[siguiente] - datos[anterior];
        let ty = datos[siguiente + 1] - datos[anterior + 1];
        let tz = datos[siguiente + 2] - datos[anterior + 2];
        let largo = Mathf.sqrt(tx * tx + ty * ty + tz * tz);
        if (largo > 0) {
            tx /= largo;
            ty /= largo;
            tz /= largo;
        }

        datos[base + 3] = tx;
        datos[base + 4] = ty;
        datos[base + 5] = tz;

        // cross(tangente, (0,1,0)) = (-tz, 0, tx)
        let lx = -tz;
        let lz = tx;
        largo = Mathf.sqrt(lx * lx + lz * lz);
        if (largo > 0) {
            lx /= largo;
            lz /= largo;
        }

        datos[base + 6] = lx;
        datos[base + 7] = 0;
        datos[base + 8] = lz;
    }
}

/** Peralte proporcional a la curvatura, suavizado y aplicado al lateral. */
function generarPeralte(): void {
    peraltes = new Float32Array(total);
    const copia = new Float32Array(total);

    for (let j = 0; j < total; j++) {
        const anterior = indiceMuestra(j - 1) * ESTRIDO;
        const siguiente = indiceMuestra(j + 1) * ESTRIDO;
        const giro =
            datos[anterior + 5] * datos[siguiente + 3] - datos[anterior + 3] * datos[siguiente + 5];
        peraltes[j] = limitar(giro * 16.0, -MAX_PERALTE, MAX_PERALTE);
    }

    for (let pasada = 0; pasada < 4; pasada++) {
        for (let j = 0; j < total; j++) copia[j] = peraltes[j];
        for (let j = 0; j < total; j++) {
            const antes = copia[indiceMuestra(j - 1)];
            const despues = copia[indiceMuestra(j + 1)];
            peraltes[j] = (antes + copia[j] * 2.0 + despues) / 4.0;
        }
    }

    for (let j = 0; j < total; j++) {
        const base = j * ESTRIDO;
        rotarAlrededor(
            datos[base + 6],
            datos[base + 7],
            datos[base + 8],
            datos[base + 3],
            datos[base + 4],
            datos[base + 5],
            peraltes[j]
        );
        datos[base + 6] = temporal[0];
        datos[base + 7] = temporal[1];
        datos[base + 8] = temporal[2];
        datos[base + 9] = peraltes[j];
    }
}

/** Genera el circuito completo. Devuelve 1 si todo fue bien. */
export function inicializar(semilla: u32, cantidadMuestras: u32): i32 {
    if (cantidadMuestras < 32) return 0;

    semillaActiva = semilla;
    estadoAzar = semilla;
    total = i32(cantidadMuestras);
    longitudTotal = 0;

    generarControl();
    generarFinas();
    generarMuestras();
    generarMarcos();
    generarPeralte();

    return 1;
}

export function datosPtr(): usize {
    return datos.dataStart;
}

export function estridas(): i32 {
    return ESTRIDO;
}

export function totalMuestras(): i32 {
    return total;
}

export function longitud(): f32 {
    return longitudTotal;
}

export function semilla(): u32 {
    return semillaActiva;
}

export function posicionX(indice: i32): f32 {
    if (total === 0) return 0;
    return datos[indiceMuestra(indice) * ESTRIDO];
}

export function posicionY(indice: i32): f32 {
    if (total === 0) return 0;
    return datos[indiceMuestra(indice) * ESTRIDO + 1];
}

export function posicionZ(indice: i32): f32 {
    if (total === 0) return 0;
    return datos[indiceMuestra(indice) * ESTRIDO + 2];
}

export function peralteEn(indice: i32): f32 {
    if (total === 0) return 0;
    return datos[indiceMuestra(indice) * ESTRIDO + 9];
}

/**
 * Muestra más cercana a un punto sobre el plano XZ, buscando en una ventana
 * alrededor de `desde`. La física avanza el índice de forma incremental.
 */
export function buscarCercana(x: f32, z: f32, desde: i32, ventana: i32): i32 {
    if (total === 0) return -1;

    const centro = indiceMuestra(desde);
    let mejor = centro;
    let mejorDistancia = f32.MAX_VALUE;

    for (let k = -ventana; k <= ventana; k++) {
        const indice = indiceMuestra(centro + k);
        const base = indice * ESTRIDO;
        const dx = datos[base] - x;
        const dz = datos[base + 2] - z;
        const distancia = dx * dx + dz * dz;

        if (distancia < mejorDistancia) {
            mejorDistancia = distancia;
            mejor = indice;
        }
    }

    return mejor;
}
