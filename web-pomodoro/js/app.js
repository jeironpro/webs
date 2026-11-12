const $ = (id) => document.getElementById(id);

const CIRCUNFERENCIA = 2 * Math.PI * 120;
const FOCUS_MINUTES = 25;
const BREAK_MINUTES = 5;

const elements = {
    estrellas: $("stars"),
    infoOpen: $("info-open"),
    info: $("info"),
    infoClose: $("info-close"),
    modeSelector: $("mode-selector"),
    focusModeButton: $("focus-mode"),
    breakModeButton: $("break-mode"),
    durationSelector: $("duration-selector"),
    minutes: $("minutes"),
    minusMinutes: $("minus-minutes"),
    plusMinutes: $("plus-minutes"),
    presets: $("presets"),
    presetButtons: [...document.querySelectorAll(".preset")],
    progress: $("progress"),
    tiempo: $("time"),
    timeLabel: $("time-label"),
    title: $("title"),
    titleActive: $("title-active"),
    titleText: $("title-text"),
    titleEdit: $("title-edit"),
    editTitle: $("edit-title"),
    primaryButton: $("primary"),
    playIcon: $("play-icon"),
    pauseIcon: $("pause-icon"),
    reiniciar: $("restart"),
    counter: $("counter"),
    counterDots: [...document.querySelectorAll(".counter-dot")],
    counterComplete: $("counter-complete"),
    dialog: $("dialog"),
    dialogIcon: $("dialog-icon"),
    dialogTitle: $("dialog-title"),
    dialogText: $("dialog-text"),
    dialogPrimary: $("dialog-primary"),
    dialogSecondary: $("dialog-secondary"),
};

const state = {
    mode: "focus",
    focusMinutes: FOCUS_MINUTES,
    breakMinutes: BREAK_MINUTES,
    pomodoros: 0,
    title: "",
    hasStarted: false,
    dialog: false,
    editing: false,
    remaining: FOCUS_MINUTES * 60,
    duration: FOCUS_MINUTES * 60,
    running: false,
    paused: false,
    finished: false,
    interval: null,
};

let audioContext = null;

function acento() {
    return state.mode === "focus" ? "#00d4ff" : "#f59e0b";
}

function currentMinutes() {
    return state.mode === "focus" ? state.focusMinutes : state.breakMinutes;
}

function format(seconds) {
    const minutes = Math.floor(seconds / 60);
    const resto = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(resto).padStart(2, "0")}`;
}

function show(element, visible) {
    element.classList.toggle("hidden", !visible);
}

function pararIntervalo() {
    if (state.interval !== null) {
        window.clearInterval(state.interval);
        state.interval = null;
    }
}

function startInterval() {
    pararIntervalo();
    state.interval = window.setInterval(tick, 1000);
}

function tick() {
    if (state.remaining <= 1) {
        state.remaining = 0;
        state.running = false;
        state.paused = false;
        state.finished = true;
        pararIntervalo();
        finalizar();
        return;
    }
    state.remaining -= 1;
    renderTimer();
}

function finalizar() {
    reanudarAudio();
    playEndSound();
    if (state.mode === "focus") {
        state.pomodoros = Math.min(state.pomodoros + 1, 4);
    }
    state.title = "";
    state.dialog = true;
    state.editing = false;
    render();
    elements.dialogPrimary.focus({ preventScroll: true });
}

function iniciar() {
    if (state.running) return;
    if (state.finished) {
        state.remaining = state.duration;
        state.finished = false;
    }
    reanudarAudio();
    state.hasStarted = true;
    state.running = true;
    state.paused = false;
    startInterval();
    render();
}

function pausar() {
    pararIntervalo();
    state.running = false;
    state.paused = true;
    render();
}

function detener() {
    pararIntervalo();
    state.running = false;
    state.paused = false;
    state.finished = false;
    state.remaining = state.duration;
    state.hasStarted = false;
    state.dialog = false;
    state.editing = false;
    state.title = "";
    render();
}

function switchMode(mode) {
    if (state.running || state.paused) return;
    pararIntervalo();
    state.mode = mode;
    state.hasStarted = false;
    state.dialog = false;
    state.editing = false;
    state.title = "";
    state.duration = (mode === "focus" ? FOCUS_MINUTES : BREAK_MINUTES) * 60;
    state.remaining = state.duration;
    state.running = false;
    state.paused = false;
    state.finished = false;
    render();
}

function setMinutes(value) {
    if (state.running || state.paused) return;
    const minutes = Math.max(1, Math.min(99, Number(value) || 1));
    if (state.mode === "focus") state.focusMinutes = minutes;
    else state.breakMinutes = minutes;
    pararIntervalo();
    state.hasStarted = false;
    state.dialog = false;
    state.editing = false;
    state.duration = minutes * 60;
    state.remaining = state.duration;
    state.running = false;
    state.paused = false;
    state.finished = false;
    render();
}

function adjustMinutes(delta) {
    setMinutes(currentMinutes() + delta);
}

function renderMode() {
    const focus = state.mode === "focus";
    const active = focus ? elements.focusModeButton : elements.breakModeButton;
    const inactivo = focus ? elements.breakModeButton : elements.focusModeButton;

    elements.focusModeButton.style.backgroundColor = focus ? "#00d4ff" : "transparent";
    elements.focusModeButton.style.color = focus ? "#0c1222" : "#64748b";
    elements.focusModeButton.style.boxShadow = focus ? "0 0 12px rgba(0,212,255,0.3)" : "none";
    elements.breakModeButton.style.backgroundColor = focus ? "transparent" : "#f59e0b";
    elements.breakModeButton.style.color = focus ? "#64748b" : "#0c1222";
    elements.breakModeButton.style.boxShadow = focus ? "none" : "0 0 12px rgba(245,158,11,0.3)";
    elements.focusModeButton.setAttribute("aria-pressed", String(focus));
    elements.breakModeButton.setAttribute("aria-pressed", String(!focus));
    elements.focusModeButton.disabled = state.running || state.paused;
    elements.breakModeButton.disabled = state.running || state.paused;
    active.setAttribute("aria-pressed", "true");
    inactivo.setAttribute("aria-pressed", "false");
}

function renderDuration() {
    const minutes = currentMinutes();
    elements.minutes.value = String(minutes);
    elements.minutes.style.textShadow = `0 0 20px ${acento()}33`;
    elements.durationSelector.classList.toggle("hidden", state.hasStarted);
    elements.presetButtons.forEach((button) => {
        const active = Number(button.dataset.minutes) === minutes;
        button.style.backgroundColor = active ? acento() : "transparent";
        button.style.color = active ? "#0c1222" : "#94a3b8";
        button.setAttribute("aria-pressed", String(active));
    });
}

function renderTimer() {
    const progress = state.duration > 0 ? state.remaining / state.duration : 0;
    const color = acento();
    elements.progress.setAttribute(
        "stroke-dasharray",
        `${CIRCUNFERENCIA * progress} ${CIRCUNFERENCIA}`
    );
    elements.progress.setAttribute("stroke", color);
    elements.progress.setAttribute("filter", state.finished ? "none" : "url(#ringGlow)");
    elements.tiempo.textContent = format(state.remaining);
    elements.tiempo.style.textShadow = `0 0 30px ${color}33, 0 0 60px ${color}11`;
    elements.timeLabel.style.color = color;
    show(elements.timeLabel, state.finished);
}

function renderTitle() {
    const active = state.hasStarted && !state.finished && !state.editing;
    const editing = state.hasStarted && !state.finished && state.editing;
    show(elements.title, !active && !editing);
    show(elements.titleActive, active);
    show(elements.titleEdit, editing);
    elements.titleText.textContent = state.title || "Sin título";

    if (!active && !editing) {
        elements.title.value = state.title;
    }
}

function renderControls() {
    show(elements.reiniciar, state.hasStarted);
    show(elements.playIcon, !state.running);
    show(elements.pauseIcon, state.running);
    elements.primaryButton.style.backgroundColor = state.running ? "#1e293b" : "#00d4ff";
    elements.primaryButton.style.boxShadow = state.running
        ? "0 0 0 2px rgba(148,163,184,0.2)"
        : "0 0 20px rgba(0,212,255,0.3)";
    elements.primaryButton.setAttribute(
        "aria-label",
        state.running ? "Pausar" : state.paused ? "Reanudar" : "Iniciar"
    );
}

function renderCounter() {
    const visible = state.hasStarted && !state.finished;
    show(elements.counter, visible);
    elements.counterDots.forEach((dot, index) => {
        const active = index < state.pomodoros;
        dot.style.backgroundColor = active ? "#00d4ff" : "rgba(148,163,184,0.12)";
        dot.style.boxShadow = active ? "0 0 8px rgba(0,212,255,0.4)" : "none";
    });
    show(elements.counterComplete, state.pomodoros >= 4);
}

function renderDialog() {
    show(elements.dialog, state.dialog);
    const focus = state.mode === "focus";
    const color = focus ? "#f59e0b" : "#00d4ff";
    elements.dialogIcon.style.backgroundColor = focus ? "#00d4ff" : "#f59e0b";
    elements.dialogIcon.style.boxShadow = focus
        ? "0 0 20px rgba(0,212,255,0.3)"
        : "0 0 20px rgba(245,158,11,0.3)";
    elements.dialogTitle.textContent = focus ? "¡Pomodoro completado!" : "Descanso terminado";
    elements.dialogText.textContent = focus
        ? "¿Quieres tomar un descanso de 5 minutos?"
        : "¿Listo para volver al trabajo?";
    elements.dialogPrimary.textContent = focus ? "Sí, descansar" : "Sí, trabajar";
    elements.dialogPrimary.style.backgroundColor = color;
    elements.dialogPrimary.style.boxShadow = focus
        ? "0 0 16px rgba(245,158,11,0.3)"
        : "0 0 16px rgba(0,212,255,0.3)";
    elements.dialogSecondary.textContent = focus ? "No, seguir" : "No, descansar más";
}

function render() {
    renderMode();
    renderDuration();
    renderTimer();
    renderTitle();
    renderControls();
    renderCounter();
    renderDialog();
}

function saveTitle() {
    state.title = elements.titleEdit.value.trim();
    state.editing = false;
    renderTitle();
}

function getAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
}

function reanudarAudio() {
    const context = getAudioContext();
    if (context.state === "suspended") context.resume();
}

function playEndSound() {
    const context = getAudioContext();
    const ahora = context.currentTime;
    [523.25, 659.25, 783.99].forEach((frecuencia, index) => {
        const oscilador = context.createOscillator();
        const ganancia = context.createGain();
        oscilador.type = "sine";
        oscilador.frequency.value = frecuencia;
        ganancia.gain.setValueAtTime(0.3, ahora + index * 0.15);
        ganancia.gain.exponentialRampToValueAtTime(0.001, ahora + index * 0.15 + 0.4);
        oscilador.connect(ganancia);
        ganancia.connect(context.destination);
        oscilador.start(ahora + index * 0.15);
        oscilador.stop(ahora + index * 0.15 + 0.4);
    });
}

function createStars() {
    const container = elements.estrellas;
    const star = "polygon(50% 0%, 40% 40%, 0% 50%, 40% 60%, 50% 100%, 60% 60%, 100% 50%, 60% 40%)";
    const random = (min, max) => Math.random() * (max - min) + min;

    for (let i = 0; i < 80; i += 1) {
        const size = random(1.5, 3.5);
        const svgSize = size * 4;
        const color = i % 7 === 0 ? "#f59e0b" : "#ffffff";
        const opacidad = random(0.2, 0.9);
        const glow = document.createElement("div");
        glow.style.cssText = `
            position:absolute;left:${random(0, 100)}%;top:${random(0, 100)}%;
            width:${svgSize}px;height:${svgSize}px;margin-left:-${svgSize / 2}px;margin-top:-${svgSize / 2}px;
            border-radius:50%;background:radial-gradient(circle,${color} ${size * 0.8}px,transparent ${size * 2.5}px);
            opacity:${opacidad * 0.4};animation:twinkle ${random(3, 7)}s ease-in-out infinite;
            animation-delay:${random(0, 8)}s;`;
        container.appendChild(glow);

        const dot = document.createElement("div");
        dot.style.cssText = `
            position:absolute;left:${random(0, 100)}%;top:${random(0, 100)}%;
            width:${svgSize}px;height:${svgSize}px;margin-left:-${svgSize / 2}px;margin-top:-${svgSize / 2}px;
            background:${color};clip-path:${star};opacity:${opacidad};
            animation:twinkle ${random(3, 7)}s ease-in-out infinite;animation-delay:${random(0, 8)}s;`;
        container.appendChild(dot);
    }

    for (let i = 0; i < 3; i += 1) {
        const meteoro = document.createElement("div");
        const glow = document.createElement("div");
        glow.style.cssText =
            "position:absolute;top:-5px;left:-5px;width:12px;height:12px;border-radius:50%;background:radial-gradient(circle,rgba(0,212,255,0.5) 0%,transparent 100%)";
        const head = document.createElement("div");
        head.style.cssText = `position:absolute;top:-6px;left:-6px;width:14px;height:14px;background:#ffffff;clip-path:${star};box-shadow:0 0 6px #00d4ff;`;
        meteoro.append(glow, head);
        meteoro.style.cssText = `position:absolute;left:${random(65, 100)}%;top:${random(5, 35)}%;width:2px;height:2px;animation:shooting-cycle 30s ease-out infinite;animation-delay:${i * 10}s;`;
        container.appendChild(meteoro);
    }
}

elements.focusModeButton.addEventListener("click", () => switchMode("focus"));
elements.breakModeButton.addEventListener("click", () => switchMode("break"));
elements.minusMinutes.addEventListener("click", () => adjustMinutes(-1));
elements.plusMinutes.addEventListener("click", () => adjustMinutes(1));
elements.primaryButton.addEventListener("click", () => {
    if (state.running) pausar();
    else iniciar();
});
elements.reiniciar.addEventListener("click", detener);
elements.minutes.addEventListener("focus", () => show(elements.presets, true));
elements.minutes.addEventListener("input", (evento) => {
    const value = evento.target.value === "" ? 1 : Number(evento.target.value);
    setMinutes(value);
});
elements.presetButtons.forEach((button) => {
    button.addEventListener("click", () => {
        setMinutes(Number(button.dataset.minutes));
        show(elements.presets, false);
    });
});
document.addEventListener("pointerdown", (evento) => {
    if (!elements.durationSelector.contains(evento.target)) {
        show(elements.presets, false);
    }
});

elements.title.addEventListener("input", (evento) => {
    state.title = evento.target.value;
});
elements.title.addEventListener("focus", (evento) => {
    evento.target.style.borderColor = "#00d4ff";
});
elements.title.addEventListener("blur", (evento) => {
    evento.target.style.borderColor = "rgba(148, 163, 184, 0.2)";
});
elements.editTitle.addEventListener("click", () => {
    state.editing = true;
    elements.titleEdit.value = state.title;
    renderTitle();
    elements.titleEdit.focus();
    elements.titleEdit.select();
});
elements.titleEdit.addEventListener("blur", saveTitle);
elements.titleEdit.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter") {
        evento.preventDefault();
        saveTitle();
    }
    if (evento.key === "Escape") {
        state.editing = false;
        renderTitle();
    }
});

elements.infoOpen.addEventListener("click", () => show(elements.info, true));
elements.infoClose.addEventListener("click", () => show(elements.info, false));
elements.info.addEventListener("click", (evento) => {
    if (evento.target === elements.info) show(elements.info, false);
});

elements.dialogPrimary.addEventListener("click", () => {
    switchMode(state.mode === "focus" ? "break" : "focus");
});
elements.dialogSecondary.addEventListener("click", () => {
    switchMode(state.mode);
});

createStars();
render();
