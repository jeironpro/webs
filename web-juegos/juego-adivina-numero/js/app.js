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

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const NOT_STARTED_MESSAGE =
    "Tienes 10 globos: piensa un número entre 1 y 100 y escribe tu primera suposición.";

let best = getBestScore();
renderBest();

let counterFrameId = null;

function renderBest() {
    elements.best.textContent = best === null ? "—" : String(best);
}

function setFeedback(message, state = "idle") {
    elements.feedback.textContent = message;
    elements.feedback.dataset.state = state;
}

function showError(message) {
    elements.error.textContent = message;
    elements.error.classList.add("is-visible");
    elements.input.setAttribute("aria-invalid", "true");
}

function clearError() {
    elements.error.textContent = "";
    elements.error.classList.remove("is-visible");
    elements.input.removeAttribute("aria-invalid");
}

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

function disableForm() {
    elements.input.disabled = true;
    elements.submit.disabled = true;
}

function enableForm() {
    elements.input.disabled = false;
    elements.submit.disabled = false;
}

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

function handleLose(attempts) {
    setFeedback(
        `¡Te quedaste sin globos! El número era ${game.secret} y lo intentaste ${attempts} veces.`,
        "lose"
    );

    disableForm();
}

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
