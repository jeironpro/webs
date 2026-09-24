/*
 * Servicio de dados - logica de generacion de valores aleatorios
 * Proporciona funciones para lanzar uno o varios dados de 6 caras
 */

const FACES = 6;

/**
 * Genera un valor aleatorio simulando el lanzamiento de un dado de 6 caras
 * @returns {number} Valor entero entre 1 y 6
 */
export function roll() {
    return Math.floor(Math.random() * FACES) + 1;
}

/**
 * Genera multiples valores simulando el lanzamiento de varios dados
 * @param {number} count - Cantidad de dados a lanzar
 * @returns {number[]} Array con los valores de cada dado (1-6)
 */
export function rollMultiple(count) {
    return Array.from({ length: count }, () => roll());
}

/**
 * Calcula la suma de los valores de un array de dados
 * @param {number[]} values - Array de valores de dados
 * @returns {number} Suma total
 */
export function sumValues(values) {
    return values.reduce((total, value) => total + value, 0);
}
