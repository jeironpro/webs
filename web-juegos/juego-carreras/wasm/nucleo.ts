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

// ---------------------------------------------------------------------------
// Carrera: coche, rivales, vueltas y cronometraje
// ---------------------------------------------------------------------------

const RIVALES: i32 = 3;
const ESTRIDO_ESTADO: i32 = 16 + RIVALES * 7;
const ANCHO_MEDIO: f32 = 6.4;
const LIMITE_FUERA: f32 = ANCHO_MEDIO + 4.5;
const VELOCIDAD_MAXIMA: f32 = 68.0;
const PI_F: f32 = 3.141592653589793;
const UNO: f32 = 1.0;
const CERO: f32 = 0.0;

let estado = new Float32Array(ESTRIDO_ESTADO);
let dificultadCarrera: i32 = 1;
let vueltasTotales: i32 = 3;

let cocheX: f32 = 0;
let cocheY: f32 = 0;
let cocheZ: f32 = 0;
let cocheRumbo: f32 = 0;
let cocheVelocidad: f32 = 0;
let cocheLateral: f32 = 0;
let cocheIndice: i32 = 0;
let cocheProgreso: f32 = 0;
let cocheProgresoPrevio: f32 = 0;
let cocheVuelta: i32 = 1;
let cocheTiempo: f32 = 0;
let cocheMejorVuelta: f32 = 0;
let cocheVueltaInicio: f32 = 0;
let cocheTerminado: i32 = 0;
let cocheChoques: i32 = 0;
let enfriamientoChoque: f32 = 0;

let rivalX = new Float32Array(RIVALES);
let rivalZ = new Float32Array(RIVALES);
let rivalY = new Float32Array(RIVALES);
let rivalRumbo = new Float32Array(RIVALES);
let rivalVelocidad = new Float32Array(RIVALES);
let rivalProgreso = new Float32Array(RIVALES);
let rivalDesvio = new Float32Array(RIVALES);
let rivalVuelta = new Float32Array(RIVALES);

function normalizarAngulo(angulo: f32): f32 {
    let valor = angulo;
    while (valor > PI_F) valor -= DOS_PI;
    while (valor < -PI_F) valor += DOS_PI;
    return valor;
}

/** Curvatura aproximada entre dos muestras separadas: alimenta la IA. */
function curvaturaEn(indice: i32): f32 {
    const antes = indiceMuestra(indice - 5) * ESTRIDO;
    const despues = indiceMuestra(indice + 5) * ESTRIDO;
    return Mathf.abs(datos[antes + 5] * datos[despues + 3] - datos[antes + 3] * datos[despues + 5]);
}

function situarRival(r: i32): void {
    const indice = indiceMuestra(i32(rivalProgreso[r] * f32(total)));
    const base = indice * ESTRIDO;
    rivalX[r] = datos[base] + datos[base + 6] * rivalDesvio[r];
    rivalY[r] = datos[base + 1];
    rivalZ[r] = datos[base + 2] + datos[base + 8] * rivalDesvio[r];
    rivalRumbo[r] = Mathf.atan2(datos[base + 3], datos[base + 5]);
}

function escribirEstado(): void {
    estado[0] = cocheX;
    estado[1] = cocheY;
    estado[2] = cocheZ;
    estado[3] = cocheRumbo;
    estado[4] = cocheVelocidad;
    estado[5] = cocheLateral;
    estado[6] = cocheProgreso;
    estado[7] = f32(cocheVuelta);
    estado[8] = cocheTiempo;
    estado[9] = cocheMejorVuelta;
    estado[10] = f32(cocheTerminado);
    estado[11] = f32(cocheIndice);
    estado[12] = f32(cocheChoques);
    estado[13] = f32(vueltasTotales);
    estado[14] = longitudTotal;
    estado[15] = f32(total);

    for (let r = 0; r < RIVALES; r++) {
        const base = 16 + r * 6;
        estado[base] = rivalX[r];
        estado[base + 1] = rivalY[r];
        estado[base + 2] = rivalZ[r];
        estado[base + 3] = rivalRumbo[r];
        estado[base + 4] = rivalVelocidad[r];
        estado[base + 5] = rivalProgreso[r];
        estado[base + 6] = rivalVuelta[r];
    }
}

/** Coloca coche y rivales en la parrilla y reinicia el cronómetro. */
export function iniciarCarrera(dificultad: u32, vueltas: u32): void {
    if (total === 0) return;

    dificultadCarrera = dificultad > 2 ? 2 : i32(dificultad);
    vueltasTotales = vueltas < 1 ? 1 : i32(vueltas);

    const base = 0;
    cocheX = datos[base];
    cocheY = datos[base + 1];
    cocheZ = datos[base + 2];
    cocheRumbo = Mathf.atan2(datos[base + 3], datos[base + 5]);
    cocheVelocidad = 0;
    cocheLateral = 0;
    cocheIndice = 0;
    cocheProgreso = 0;
    cocheProgresoPrevio = 0;
    cocheVuelta = 1;
    cocheTiempo = 0;
    cocheMejorVuelta = 0;
    cocheVueltaInicio = 0;
    cocheTerminado = 0;
    cocheChoques = 0;
    enfriamientoChoque = 0;

    for (let r = 0; r < RIVALES; r++) {
        rivalProgreso[r] = 1.0 - f32(r + 1) * 0.008;
        rivalVelocidad[r] = 0;
        rivalDesvio[r] = (f32(r) - 1.0) * 2.2;
        rivalVuelta[r] = 1;
        situarRival(r);
    }

    escribirEstado();
}

/**
 * Un paso de simulación. `acelerar`, `frenar` y `giro` llegan en 0..1 y
 * `derrape` como 0/1. El coche se alinea solo con la pista para que se conduzca
 * con correcciones amplias, no con microajustes.
 */
export function paso(dt: f32, acelerar: f32, frenar: f32, giro: f32, derrape: u32): void {
    if (total === 0) return;

    let d = dt;
    if (d > 0.05) d = 0.05;
    if (d <= CERO) return;

    if (cocheTerminado == 0) cocheTiempo += d;

    cocheIndice = buscarCercana(cocheX, cocheZ, cocheIndice, 28);
    let base = cocheIndice * ESTRIDO;
    let tangenteX = datos[base + 3];
    let tangenteZ = datos[base + 5];
    let lateralX = datos[base + 6];
    let lateralZ = datos[base + 8];

    let dx = cocheX - datos[base];
    let dz = cocheZ - datos[base + 2];
    cocheLateral = dx * lateralX + dz * lateralZ;
    const fuera = Mathf.abs(cocheLateral) > ANCHO_MEDIO;

    const superficie: f32 = fuera ? 0.5 : 1.0;
    const motor = acelerar * 32.0 * superficie;
    const freno = frenar * 45.0;
    const arrastre = cocheVelocidad * 0.32 + cocheVelocidad * cocheVelocidad * 0.0062;
    const frenoMano: f32 = derrape != 0 ? cocheVelocidad * 1.1 : 0.0;

    cocheVelocidad += (motor - freno - arrastre - frenoMano) * d;
    if (cocheVelocidad < CERO) cocheVelocidad = 0;
    if (cocheVelocidad > VELOCIDAD_MAXIMA) cocheVelocidad = VELOCIDAD_MAXIMA;

    // Asistencia de conducción tipo pure pursuit: se apunta a la línea central
    // unas muestras por delante, así el coche corrige el desvío lateral en vez
    // de cortar las curvas.
    const adelanto = 8 + i32(cocheVelocidad * 0.32);
    const indiceObjetivo = indiceMuestra(cocheIndice + adelanto);
    const baseObjetivo = indiceObjetivo * ESTRIDO;
    const rumboObjetivo = Mathf.atan2(
        datos[baseObjetivo] - cocheX,
        datos[baseObjetivo + 2] - cocheZ
    );
    const diferencia = normalizarAngulo(rumboObjetivo - cocheRumbo);
    const alineacion: f32 = giro == 0 ? 3.2 : 0.8;
    const agarre: f32 = derrape != 0 ? 1.9 : 1.0;
    const respuesta: f32 = (1.5 + 4.5 / (1.0 + cocheVelocidad * 0.075)) * agarre;

    cocheRumbo += giro * respuesta * d;
    cocheRumbo += diferencia * (alineacion * d < UNO ? alineacion * d : UNO);
    cocheRumbo = normalizarAngulo(cocheRumbo);

    cocheX += Mathf.sin(cocheRumbo) * cocheVelocidad * d;
    cocheZ += Mathf.cos(cocheRumbo) * cocheVelocidad * d;

    // Re-proyección tras avanzar: el lateral y la altura salen de la pista real.
    cocheIndice = buscarCercana(cocheX, cocheZ, cocheIndice, 16);
    base = cocheIndice * ESTRIDO;
    tangenteX = datos[base + 3];
    tangenteZ = datos[base + 5];
    lateralX = datos[base + 6];
    lateralZ = datos[base + 8];
    dx = cocheX - datos[base];
    dz = cocheZ - datos[base + 2];
    cocheLateral = dx * lateralX + dz * lateralZ;

    // Muro blando: fuera del asfalto y del arcén el coche pierde velocidad y se reorienta.
    if (Mathf.abs(cocheLateral) > LIMITE_FUERA) {
        const exceso = Mathf.abs(cocheLateral) - LIMITE_FUERA;
        const signo: f32 = cocheLateral > CERO ? 1.0 : -1.0;
        cocheX -= lateralX * exceso * signo;
        cocheZ -= lateralZ * exceso * signo;
        cocheVelocidad *= 0.72;
        cocheRumbo = normalizarAngulo(cocheRumbo + diferencia * 0.15);
        if (enfriamientoChoque <= CERO) {
            cocheChoques++;
            enfriamientoChoque = 0.6;
        }
    }
    if (enfriamientoChoque > CERO) enfriamientoChoque -= d;

    cocheY = datos[base + 1];

    const avance = dx * tangenteX + dz * tangenteZ;
    const pasoMuestra = longitudTotal / f32(total);
    let progreso = (f32(cocheIndice) + avance / pasoMuestra) / f32(total);
    if (progreso < CERO) progreso += 1.0;
    if (progreso >= UNO) progreso -= 1.0;

    if (cocheProgresoPrevio > 0.7 && progreso < 0.3) {
        const tiempoVuelta = cocheTiempo - cocheVueltaInicio;
        if (tiempoVuelta > 5.0) {
            if (cocheMejorVuelta == CERO || tiempoVuelta < cocheMejorVuelta) {
                cocheMejorVuelta = tiempoVuelta;
            }
            cocheVueltaInicio = cocheTiempo;
            cocheVuelta++;
            if (cocheVuelta > vueltasTotales) cocheTerminado = 1;
        }
    } else if (cocheProgresoPrevio < 0.3 && progreso > 0.7 && cocheVuelta > 1) {
        cocheVuelta--;
    }

    cocheProgresoPrevio = progreso;
    cocheProgreso = progreso;

    if (cocheTerminado == 1) cocheVelocidad *= 0.985;

    // Rivales: línea de carrera, velocidad objetivo por curvatura y rubber-banding.
    for (let r = 0; r < RIVALES; r++) {
        const indice = indiceMuestra(i32(rivalProgreso[r] * f32(total)));
        const curvatura = curvaturaEn(indice);
        const baseObjetivo: f32 = 51.0 + f32(dificultadCarrera) * 4.0;
        const factorCurva: f32 = curvatura * 4.0 < 0.3 ? curvatura * 4.0 : 0.3;
        let objetivo: f32 = baseObjetivo * (1.0 - factorCurva);

        let diferenciaJugador: f32 = cocheProgreso - rivalProgreso[r];
        if (diferenciaJugador > 0.5) diferenciaJugador -= 1.0;
        if (diferenciaJugador < -0.5) diferenciaJugador += 1.0;
        const ajuste: f32 = limitar(1.0 + diferenciaJugador * 0.08, 0.93, 1.08);
        objetivo *= ajuste;

        rivalVelocidad[r] += (objetivo - rivalVelocidad[r]) * (f32(1.8) * d);
        rivalProgreso[r] += (rivalVelocidad[r] * d) / longitudTotal;

        if (rivalProgreso[r] >= UNO) {
            rivalProgreso[r] -= 1.0;
            rivalVuelta[r] += 1.0;
        }
        if (rivalProgreso[r] < CERO) rivalProgreso[r] += 1.0;

        const balanceo = Mathf.sin(cocheTiempo * 0.8 + f32(r) * 2.1) * 0.12;
        rivalDesvio[r] = limitar(rivalDesvio[r] + balanceo * d, -4.4, 4.4);
        situarRival(r);

        // Colisión simple entre cajas: separa y frena a ambos.
        const choqueX = rivalX[r] - cocheX;
        const choqueZ = rivalZ[r] - cocheZ;
        const distancia2 = choqueX * choqueX + choqueZ * choqueZ;
        if (distancia2 < 5.2) {
            let distancia = Mathf.sqrt(distancia2);
            if (distancia < 0.01) distancia = 0.01;
            // Roce, no choque frontal: se separa de lado y se conserva casi toda la velocidad.
            const empuje: f32 = (2.3 - distancia) * 0.45;
            cocheX -= (choqueX / distancia) * empuje;
            cocheZ -= (choqueZ / distancia) * empuje;
            cocheVelocidad *= 0.972;
            rivalVelocidad[r] *= 0.97;
            if (enfriamientoChoque <= CERO) {
                cocheChoques++;
                enfriamientoChoque = 0.5;
            }
        }
    }

    escribirEstado();
}

export function estadoPtr(): usize {
    return estado.dataStart;
}

export function estridasEstado(): i32 {
    return ESTRIDO_ESTADO;
}

export function totalRivales(): i32 {
    return RIVALES;
}
