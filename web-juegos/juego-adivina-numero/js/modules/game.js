/**
 * Lógica del juego de adivinar el número.
 * @module modules/game
 */

/** Número mínimo del rango. */
export const MIN = 1;

/** Número máximo del rango. */
export const MAX = 100;

/** Máximo de intentos por partida (un globo por intento). */
export const MAX_ATTEMPTS = 10;

/**
 * Genera un número entero aleatorio entre MIN y MAX (inclusive).
 * @returns {number} Número secreto.
 */
function randomNumber() {
  return Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
}

/**
 * Crea una partida con estado propio (número secreto e intentos).
 * @returns {object} API de la partida.
 */
export function createGame() {
  let secret = randomNumber();
  let attempts = 0;

  return {
    /**
     * Número secreto de la partida actual.
     * @type {number}
     */
    get secret() {
      return secret;
    },

    /** Reinicia la partida con un nuevo número secreto y cero intentos. */
    startNew() {
      secret = randomNumber();
      attempts = 0;
    },

    /**
     * Evalúa una suposición del jugador.
     * @param {string|number} rawValue Valor bruto introducido en el formulario.
     * @returns {object} Resultado:
     *  - ok: false si el valor no es un entero dentro del rango.
     *  - ok: true, result: "win" | "low" | "high" | "lose",
     *    attempts: intentos usados.
     */
    evaluate(rawValue) {
      const value = Number(rawValue);
      if (!Number.isInteger(value) || value < MIN || value > MAX) {
        return { ok: false };
      }

      attempts += 1;

      if (value === secret) {
        return { ok: true, result: "win", attempts };
      }

      if (attempts >= MAX_ATTEMPTS) {
        return { ok: true, result: "lose", attempts };
      }

      return {
        ok: true,
        result: value < secret ? "low" : "high",
        attempts,
      };
    },
  };
}
