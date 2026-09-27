/**
 * Punto de entrada del juego: conecta la lógica con el DOM.
 * @module app
 */

import { qs, createElement } from "./utils/dom.js";
import { getBestScore, saveBestScore } from "./utils/storage.js";
import { createGame, MIN, MAX } from "./modules/game.js";
import { initModal } from "./modules/modal.js";
import { initBalloons } from "./modules/balloons.js";

initModal();

const form = qs("#game-form");

const elements = {
  form,
  input: qs("#guess"),
  error: qs("#guess-error"),
  feedback: qs("#feedback"),
  attempts: qs("#attempts"),
  best: qs("#best"),
  newGame: qs("#new-game"),
  mark: qs(".game-mark"),
  balloons: qs("#balloons"),
  submit: qs(".btn", form),
};

const game = createGame();
const balloons = initBalloons(elements.balloons);

/** Preferencias de movimiento reducido del usuario. */
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const NOT_STARTED_MESSAGE =
  "Tienes 10 globos: piensa un número entre 1 y 100 y escribe tu primera suposición.";

let best = getBestScore();
renderBest();

/** Identificador del frame en curso de la animación del contador. */
let counterFrameId = null;

/**
 * Muestra el mejor récord en la interfaz.
 */
function renderBest() {
  elements.best.textContent = best === null ? "—" : String(best);
}

/**
 * Escribe el mensaje de retroalimentación y su estado visual.
 * @param {string} message Texto del mensaje.
 * @param {string} [state] Estado usado para estilar (low, high, win, idle).
 */
function setFeedback(message, state = "idle") {
  elements.feedback.textContent = message;
  elements.feedback.dataset.state = state;
}

/**
 * Muestra el mensaje de error de validación y marca el campo.
 * @param {string} message Texto del error.
 */
function showError(message) {
  elements.error.textContent = message;
  elements.error.classList.add("is-visible");
  elements.input.setAttribute("aria-invalid", "true");
}

/**
 * Oculta el mensaje de error y limpia el estado del campo.
 */
function clearError() {
  elements.error.textContent = "";
  elements.error.classList.remove("is-visible");
  elements.input.removeAttribute("aria-invalid");
}

/**
 * Anima un contador desde un valor inicial hasta uno final.
 * Con movimiento reducido muestra el valor final directamente.
 * @param {HTMLElement} node Elemento cuyo texto se actualiza.
 * @param {number} from Valor inicial.
 * @param {number} to Valor final.
 */
function tickCounter(node, from, to) {
  if (prefersReducedMotion) {
    node.textContent = String(to);
    return;
  }

  if (counterFrameId !== null) {
    cancelAnimationFrame(counterFrameId);
  }

  const start = performance.now();
  const duration = 400;

  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(from + (to - from) * eased);
    node.textContent = String(value);

    if (progress < 1) {
      counterFrameId = requestAnimationFrame(frame);
    } else {
      counterFrameId = null;
    }
  }

  counterFrameId = requestAnimationFrame(frame);
}

/**
 * Deshabilita el formulario al finalizar la partida.
 */
function disableForm() {
  elements.input.disabled = true;
  elements.submit.disabled = true;
}

/**
 * Habilita el formulario para comenzar una partida.
 */
function enableForm() {
  elements.input.disabled = false;
  elements.submit.disabled = false;
}

/**
 * Lanza la animación del personaje según el resultado de la jugada.
 * @param {"low"|"high"|"win"} result Resultado de la suposición.
 */
function animateMark(result) {
  if (result === "win") {
    elements.mark.classList.add("is-celebrating");
    elements.mark.addEventListener(
      "animationend",
      () => elements.mark.classList.remove("is-celebrating"),
      { once: true }
    );

    const star = createElement("span", "star-burst");
    elements.mark.appendChild(star);
    star.addEventListener("animationend", () => star.remove(), { once: true });
    return;
  }

  elements.mark.classList.add("is-shaking");
  elements.mark.addEventListener(
    "animationend",
    () => elements.mark.classList.remove("is-shaking"),
    { once: true }
  );
}

/**
 * Finaliza la partida al acertar el número.
 * @param {number} attempts Intentos usados en la partida.
 */
function handleWin(attempts) {
  const isRecord = saveBestScore(attempts);
  if (isRecord) {
    best = attempts;
    renderBest();
  }

  const recordNote = isRecord ? " ¡Nuevo récord!" : "";
  setFeedback(
    `¡Acertaste! El número era ${game.secret} y lo lograste en ${attempts} intentos.${recordNote}`,
    "win"
  );

  balloons.celebrate();
  disableForm();
}

/**
 * Finaliza la partida al agotar los globos.
 * @param {number} attempts Intentos usados en la partida.
 */
function handleLose(attempts) {
  setFeedback(
    `¡Te quedaste sin globos! El número era ${game.secret} y lo intentaste ${attempts} veces.`,
    "lose"
  );

  disableForm();
}

/**
 * Reinicia el juego con un nuevo número secreto.
 */
function startNewGame() {
  if (counterFrameId !== null) {
    cancelAnimationFrame(counterFrameId);
    counterFrameId = null;
  }
  game.startNew();
  clearError();
  balloons.reset();
  elements.input.value = "";
  enableForm();
  elements.attempts.textContent = "0";
  renderBest();
  setFeedback(NOT_STARTED_MESSAGE);
  elements.input.focus();
}

elements.form.addEventListener("submit", (event) => {
  event.preventDefault();

  const rawValue = elements.input.value.trim();
  const result = game.evaluate(rawValue);

  if (!result.ok) {
    showError(`Escribe un número entero entre ${MIN} y ${MAX}.`);
    elements.input.focus();
    return;
  }

  clearError();
  elements.input.value = "";
  elements.input.focus();

  const previous = Number(elements.attempts.textContent) || 0;
  tickCounter(elements.attempts, previous, result.attempts);

  if (result.result === "win") {
    handleWin(result.attempts);
  } else if (result.result === "lose") {
    balloons.pop();
    handleLose(result.attempts);
  } else {
    const hint = result.result === "low" ? "más alto" : "más bajo";
    setFeedback(`Es ${hint} que ${rawValue}.`, result.result);
    balloons.pop();
  }

  animateMark(result.result);
});

elements.newGame.addEventListener("click", startNewGame);
