/**
 * Persistencia del mejor récord en localStorage.
 * @module utils/storage
 */

/** Clave bajo la que se guarda el mejor récord (menor cantidad de intentos). */
const STORAGE_KEY = "adivina-numero:mejor-record";

/**
 * Devuelve el mejor récord guardado, o null si no existe o es inválido.
 * @returns {number|null} Mejor récord en intentos, o null.
 */
export function getBestScore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return null;
    const value = JSON.parse(raw);
    return Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
}

/**
 * Guarda un nuevo mejor récord (solo si mejora el existente).
 * @param {number} attempts Intentos de la partida ganada.
 * @returns {boolean} true si se actualizó el récord, false en otro caso.
 */
export function saveBestScore(attempts) {
  const previous = getBestScore();
  const isRecord = previous === null || attempts < previous;
  if (isRecord) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(attempts));
    } catch {
      return false;
    }
  }
  return isRecord;
}