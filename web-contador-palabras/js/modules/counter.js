/**
 * Lógica de conteo de métricas de texto. Funciones puras sin estado ni DOM.
 * @module counter
 */

/**
 * Cuenta las palabras de un texto (tokens separados por espacios).
 * @param {string} text Texto a analizar.
 * @returns {number} Número de palabras (0 si el texto está vacío).
 */
export function countWords(text) {
  const trimmed = text.trim();
  return trimmed === "" ? 0 : trimmed.split(/\s+/).length;
}

/**
 * Cuenta los caracteres del texto, incluidos espacios y saltos de línea.
 * @param {string} text Texto a analizar.
 * @returns {number} Número de caracteres.
 */
export function countCharacters(text) {
  return text.length;
}

/**
 * Cuenta los caracteres del texto excluyendo espacios, tabulaciones y saltos.
 * @param {string} text Texto a analizar.
 * @returns {number} Número de caracteres sin espacios.
 */
export function countCharactersNoSpaces(text) {
  return text.replace(/\s/g, "").length;
}

/**
 * Calcula las tres métricas de un texto de una sola vez.
 * @param {string} text Texto a analizar.
 * @returns {{ palabras: number, caracteres: number, sinEspacios: number }}
 */
export function getCounts(text) {
  return {
    palabras: countWords(text),
    caracteres: countCharacters(text),
    sinEspacios: countCharactersNoSpaces(text),
  };
}