/**
 * Utilidades numéricas del motor.
 * El PRNG es determinista: la misma semilla genera siempre el mismo circuito.
 */

export function crearAzar(semilla) {
    let estado = semilla >>> 0;
    return function azar() {
        estado = (estado + 0x6d2b79f5) >>> 0;
        let t = estado;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

export function limitar(valor, minimo, maximo) {
    return Math.min(Math.max(valor, minimo), maximo);
}

export function modulo(valor, base) {
    return ((valor % base) + base) % base;
}

/** Segundos → `m:ss.d`; con horas por delante si la carrera se alarga. */
export function formatearTiempo(segundos) {
    if (!Number.isFinite(segundos) || segundos < 0) return "—";

    const minutos = Math.floor(segundos / 60);
    const resto = segundos - minutos * 60;
    const decimas = Math.floor((resto % 1) * 10);
    const segundosEnteros = Math.floor(resto);

    return `${minutos}:${String(segundosEnteros).padStart(2, "0")}.${decimas}`;
}
