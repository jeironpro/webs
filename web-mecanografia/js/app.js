import { buildTrace, computeMetrics, formatClock } from "./modules/typing.js";

const RECORD_KEY = "teletipo:record";

const PARAGRAPHS = [
    "La luz de la mañana entra por la ventana y convierte la mesa en un pequeño taller de palabras. Escribir despacio no es perder el tiempo: es escuchar el ritmo de cada idea antes de dejarla caer sobre la página. El teclado responde, la taza humea y el día empieza a ordenarse.",
    "Hay tardes en que el silencio parece tener textura. Entonces conviene encender una lámpara, abrir el cuaderno y dejar que las frases lleguen sin prisa. Una palabra bien elegida puede sostener una escena entera; una palabra de más, en cambio, apaga la música.",
    "Aprender a escribir rápido exige algo más que mover los dedos. Hay que mirar lejos, confiar en la memoria y aceptar que los errores también enseñan. Cada pausa sirve para respirar; cada corrección, para afinar el pulso. La constancia vale más que cualquier truco.",
    "El taller huele a madera y a tinta. Sobre la mesa descansan papeles, lápices y una vieja máquina que aún conserva el sonido seco de las teclas. Cuando todo se apaga, queda la satisfacción de haber encontrado, entre tantas palabras, la que faltaba.",
];

const $ = (id) => document.getElementById(id);

const elements = {
    stage: $("stage"),
    typingViewport: $("typing-viewport"),
    typingText: $("typing-text"),
    input: $("type-input"),
    startOverlay: $("start-overlay"),
    resultOverlay: $("result-overlay"),
    startButton: $("start-button"),
    startNote: $("start-note"),
    restart: $("restart"),
    restartResult: $("restart-result"),
    wpm: $("wpm"),
    accuracy: $("accuracy"),
    errors: $("errors"),
    clock: $("clock"),
    resultWpm: $("result-wpm"),
    resultAccuracy: $("result-accuracy"),
    resultErrors: $("result-errors"),
    resultTime: $("result-time"),
    resultNote: $("result-note"),
    record: $("record-value"),
    traceLine: $("trace-line"),
    traceArea: $("trace-area"),
    tracePeak: $("trace-peak"),
    traceEnd: $("trace-end"),
    testStatus: $("test-status"),
};

const durationButtons = [...document.querySelectorAll(".duration")];

let durationMs = 30000;
let target = "";
let typed = "";
let charSpans = [];
let wordRanges = [];
let scrollOffset = 0;
let status = "idle";
let startedAt = 0;
let timerId = null;
let lastSampleAt = 0;
let samples = [];
let totalTyped = 0;
let mistakes = 0;
let record = readRecord();
let composing = false;

function readRecord() {
    try {
        const stored = Number(localStorage.getItem(RECORD_KEY));
        return Number.isFinite(stored) && stored > 0 ? Math.round(stored) : 0;
    } catch {
        return 0;
    }
}

function persistRecord(value) {
    try {
        localStorage.setItem(RECORD_KEY, String(value));
        return true;
    } catch {
        return false;
    }
}

function pickText() {
    const pool = [...PARAGRAPHS];

    for (let index = pool.length - 1; index > 0; index -= 1) {
        const swap = Math.floor(Math.random() * (index + 1));
        [pool[index], pool[swap]] = [pool[swap], pool[index]];
    }

    return pool.join(" ").replace(/\s+/g, " ").trim();
}

function make(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
}

function renderTarget() {
    const words = target.split(" ");
    charSpans = new Array(target.length).fill(null);
    wordRanges = [];
    elements.typingText.replaceChildren();
    elements.typingText.style.transform = "translateY(0)";
    scrollOffset = 0;

    let charIndex = 0;

    words.forEach((word, wordIndex) => {
        const wordElement = make("span", "word");
        const start = charIndex;

        for (const character of word) {
            const span = make("span", "char", character);
            charSpans[charIndex] = span;
            wordElement.append(span);
            charIndex += 1;
        }

        wordRanges.push({ start, end: charIndex, element: wordElement });
        elements.typingText.append(wordElement);

        if (wordIndex < words.length - 1) {
            charSpans[charIndex] = null;
            charIndex += 1;
            elements.typingText.append(document.createTextNode(" "));
        }
    });
}

function scrollToWord(word) {
    if (!word) return;

    const lineHeight =
        Number.parseFloat(window.getComputedStyle(elements.typingText).lineHeight) || 38;
    const desired = Math.max(0, word.element.offsetTop - lineHeight);

    if (Math.abs(desired - scrollOffset) < 1) return;
    scrollOffset = desired;
    elements.typingText.style.transform = `translateY(-${scrollOffset}px)`;
}

function updateTypedView() {
    const cursor = Math.min(typed.length, target.length);

    charSpans.forEach((span, index) => {
        if (!span) return;
        span.classList.remove("is-correct", "is-wrong", "is-caret");
        if (index < typed.length) {
            span.classList.add(typed[index] === target[index] ? "is-correct" : "is-wrong");
        }
    });

    let caretIndex = cursor;
    while (caretIndex < target.length && target[caretIndex] === " ") caretIndex += 1;
    if (caretIndex < target.length) charSpans[caretIndex]?.classList.add("is-caret");

    const currentWord = wordRanges.findIndex(
        (range) => cursor >= range.start && cursor <= range.end
    );
    wordRanges.forEach((range, index) => {
        range.element.classList.toggle("is-current", index === currentWord);
    });

    if (currentWord !== -1) scrollToWord(wordRanges[currentWord]);
}

function updateMetrics(elapsedMs) {
    const metrics = computeMetrics({
        typed,
        target,
        elapsedMs,
        totalTyped,
        mistakes,
    });

    elements.wpm.textContent = String(metrics.wpm);
    elements.accuracy.textContent = `${metrics.accuracy}%`;
    elements.errors.textContent = String(metrics.errors);
    return metrics;
}

function renderTrace() {
    const trace = buildTrace(samples, durationMs);
    elements.traceLine.setAttribute("d", trace.line);
    elements.traceArea.setAttribute("d", trace.area);
    elements.tracePeak.textContent = `pico ${trace.peak} ppm`;
}

function updateRecordDisplay() {
    elements.record.textContent = record > 0 ? `${record} ppm` : "—";
}

function clearTimer() {
    if (timerId !== null) {
        window.clearInterval(timerId);
        timerId = null;
    }
}

function startTest() {
    if (status !== "idle") return;

    status = "running";
    startedAt = performance.now();
    lastSampleAt = 0;
    samples = [{ elapsed: 0, wpm: 0 }];
    elements.startOverlay.hidden = true;
    elements.resultOverlay.hidden = true;
    elements.input.readOnly = false;
    elements.testStatus.textContent = "Prueba en marcha.";
    timerId = window.setInterval(tick, 100);
}

function tick() {
    if (status !== "running") return;

    const elapsed = Math.min(performance.now() - startedAt, durationMs);
    const metrics = updateMetrics(elapsed);
    elements.clock.textContent = formatClock(durationMs - elapsed);

    if (elapsed - lastSampleAt >= 500) {
        lastSampleAt = elapsed;
        samples.push({ elapsed, wpm: metrics.wpm });
        renderTrace();
    }

    if (elapsed >= durationMs) finishTest();
}

function finishTest() {
    if (status !== "running") return;

    const elapsed = Math.min(performance.now() - startedAt, durationMs);
    status = "finished";
    clearTimer();

    const metrics = updateMetrics(elapsed);
    elements.clock.textContent = "0:00";
    samples.push({ elapsed, wpm: metrics.wpm });
    renderTrace();

    elements.resultWpm.textContent = String(metrics.wpm);
    elements.resultAccuracy.textContent = `${metrics.accuracy}%`;
    elements.resultErrors.textContent = String(metrics.errors);
    elements.resultTime.textContent = formatClock(elapsed);

    if (metrics.wpm > record) {
        record = metrics.wpm;
        const saved = persistRecord(record);
        elements.resultNote.textContent = saved
            ? "Nuevo récord local."
            : "Nuevo récord de la sesión; el navegador bloquea el almacenamiento.";
        updateRecordDisplay();
    } else if (record > 0) {
        elements.resultNote.textContent = `Tu récord sigue en ${record} ppm.`;
    } else {
        elements.resultNote.textContent = "Primera marca de la sesión.";
    }

    elements.resultOverlay.hidden = false;
    elements.input.readOnly = true;
    elements.input.blur();
    elements.testStatus.textContent = `Prueba terminada: ${metrics.wpm} palabras por minuto, ${metrics.accuracy}% de precisión y ${metrics.errors} errores.`;
    elements.restartResult.focus({ preventScroll: true });
}

function handleInput() {
    if (status === "finished") return;

    let value = elements.input.value;
    if (value.length > target.length) {
        value = value.slice(0, target.length);
        elements.input.value = value;
    }

    if (value.length > 0 && status === "idle") startTest();

    if (value.length > typed.length && value.startsWith(typed)) {
        for (let index = typed.length; index < value.length; index += 1) {
            totalTyped += 1;
            if (value[index] !== target[index]) mistakes += 1;
        }
    }

    typed = value;
    elements.input.setSelectionRange(value.length, value.length);
    updateTypedView();

    const elapsed = status === "running" ? Math.min(performance.now() - startedAt, durationMs) : 0;
    updateMetrics(elapsed);
    elements.clock.textContent = formatClock(
        status === "running" ? durationMs - elapsed : durationMs
    );

    if (status === "running" && typed.length >= target.length) finishTest();
}

function resetTest({ focus = false } = {}) {
    clearTimer();
    status = "idle";
    target = pickText();
    typed = "";
    totalTyped = 0;
    mistakes = 0;
    startedAt = 0;
    lastSampleAt = 0;
    samples = [];

    elements.input.value = "";
    elements.input.readOnly = false;
    elements.startOverlay.hidden = false;
    elements.resultOverlay.hidden = true;
    elements.startNote.textContent = `${durationMs / 1000} segundos · sin pausas · récord local`;
    elements.clock.textContent = formatClock(durationMs);
    elements.traceEnd.textContent = formatClock(durationMs);
    elements.testStatus.textContent = "";

    renderTarget();
    updateTypedView();
    updateMetrics(0);
    renderTrace();
    updateRecordDisplay();

    if (focus) focusInput();
}

function setDuration(nextDuration) {
    durationMs = nextDuration;
    durationButtons.forEach((button) => {
        const active = Number(button.dataset.duration) * 1000 === durationMs;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
    });
    resetTest();
}

function focusInput() {
    elements.input.focus({ preventScroll: true });
    const end = elements.input.value.length;
    elements.input.setSelectionRange(end, end);
}

durationButtons.forEach((button) => {
    button.addEventListener("click", () => setDuration(Number(button.dataset.duration) * 1000));
});

elements.startButton.addEventListener("click", () => {
    focusInput();
    elements.testStatus.textContent = "Campo listo. Escribe para comenzar.";
});

elements.stage.addEventListener("click", (event) => {
    if (status === "finished") return;
    if (event.target.closest("button")) return;
    focusInput();
});

elements.input.addEventListener("compositionstart", () => {
    composing = true;
});

elements.input.addEventListener("compositionend", () => {
    composing = false;
    handleInput();
});

elements.input.addEventListener("input", () => {
    if (!composing) handleInput();
});

elements.input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") event.preventDefault();
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) {
        event.preventDefault();
    }
});

["paste", "drop"].forEach((type) => {
    elements.input.addEventListener(type, (event) => event.preventDefault());
});

elements.restart.addEventListener("click", () => resetTest({ focus: true }));
elements.restartResult.addEventListener("click", () => resetTest({ focus: true }));

document.addEventListener("keydown", (event) => {
    if (status !== "idle" || event.defaultPrevented) return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.key.length !== 1) return;
    if (
        event.target instanceof Element &&
        event.target.closest("button, a, input, textarea, select")
    ) {
        return;
    }

    event.preventDefault();
    focusInput();
    elements.input.value = event.key;
    handleInput();
});

document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
});

durationMs = 30000;
setDuration(durationMs);
