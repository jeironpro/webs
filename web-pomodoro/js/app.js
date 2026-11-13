const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const CIRCUMFERENCE = 2 * Math.PI * 120;
const FOCUS_MINUTES = 25;
const BREAK_MINUTES = 5;

const elements = {
    infoOpen: $("#info-open"),
    info: $("#info"),
    infoClose: $("#info-close"),
    focusModeButton: $("#focus-mode"),
    breakModeButton: $("#break-mode"),
    durationSelector: $("#duration-selector"),
    minutes: $("#minutes"),
    minusMinutes: $("#minus-minutes"),
    plusMinutes: $("#plus-minutes"),
    presets: $("#presets"),
    presetButtons: $$(".duration__preset"),
    progress: $("#progress"),
    time: $("#time"),
    timeLabel: $("#time-label"),
    title: $("#title"),
    titleActive: $("#title-active"),
    titleText: $("#title-text"),
    titleEdit: $("#title-edit"),
    editTitle: $("#edit-title"),
    primaryButton: $("#primary"),
    playIcon: $("#play-icon"),
    pauseIcon: $("#pause-icon"),
    restart: $("#restart"),
    counter: $("#counter"),
    counterDots: $$(".counter__dot"),
    counterComplete: $("#counter-complete"),
    dialog: $("#dialog"),
    dialogTitle: $("#dialog-title"),
    dialogText: $("#dialog-text"),
    dialogPrimary: $("#dialog-primary"),
    dialogSecondary: $("#dialog-secondary"),
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

const currentMinutes = () => (state.mode === "focus" ? state.focusMinutes : state.breakMinutes);

const format = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const rest = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
};

const show = (element, visible) => {
    element.classList.toggle("is-hidden", !visible);
};

const stopInterval = () => {
    if (state.interval !== null) {
        window.clearInterval(state.interval);
        state.interval = null;
    }
};

const startInterval = () => {
    stopInterval();
    state.interval = window.setInterval(tick, 1000);
};

const tick = () => {
    if (state.remaining <= 1) {
        state.remaining = 0;
        state.running = false;
        state.paused = false;
        state.finished = true;
        stopInterval();
        finish();
        return;
    }
    state.remaining -= 1;
    renderTimer();
};

const finish = () => {
    resumeAudio();
    playEndSound();
    if (state.mode === "focus") {
        state.pomodoros = Math.min(state.pomodoros + 1, 4);
    }
    state.title = "";
    state.dialog = true;
    state.editing = false;
    render();
    elements.dialogPrimary.focus({ preventScroll: true });
};

const start = () => {
    if (state.running) return;
    if (state.finished) {
        state.remaining = state.duration;
        state.finished = false;
    }
    resumeAudio();
    state.hasStarted = true;
    state.running = true;
    state.paused = false;
    startInterval();
    render();
};

const pause = () => {
    stopInterval();
    state.running = false;
    state.paused = true;
    render();
};

const stop = () => {
    stopInterval();
    state.running = false;
    state.paused = false;
    state.finished = false;
    state.remaining = state.duration;
    state.hasStarted = false;
    state.dialog = false;
    state.editing = false;
    state.title = "";
    render();
};

const switchMode = (mode) => {
    if (state.running || state.paused) return;
    stopInterval();
    state.mode = mode;
    state.hasStarted = false;
    state.dialog = false;
    state.editing = false;
    state.title = "";
    state.duration = (mode === "focus" ? state.focusMinutes : state.breakMinutes) * 60;
    state.remaining = state.duration;
    state.running = false;
    state.paused = false;
    state.finished = false;
    render();
};

const setMinutes = (value) => {
    if (state.running || state.paused) return;
    const minutes = Math.max(1, Math.min(99, Number(value) || 1));
    if (state.mode === "focus") {
        state.focusMinutes = minutes;
    } else {
        state.breakMinutes = minutes;
    }
    stopInterval();
    state.hasStarted = false;
    state.dialog = false;
    state.editing = false;
    state.duration = minutes * 60;
    state.remaining = state.duration;
    state.running = false;
    state.paused = false;
    state.finished = false;
    render();
};

const adjustMinutes = (delta) => {
    setMinutes(currentMinutes() + delta);
};

const renderMode = () => {
    const focus = state.mode === "focus";
    elements.focusModeButton.setAttribute("aria-pressed", String(focus));
    elements.breakModeButton.setAttribute("aria-pressed", String(!focus));
    elements.focusModeButton.disabled = state.running || state.paused;
    elements.breakModeButton.disabled = state.running || state.paused;
};

const renderDuration = () => {
    const minutes = currentMinutes();
    elements.minutes.value = String(minutes);
    elements.durationSelector.classList.toggle("is-hidden", state.hasStarted);
    elements.presetButtons.forEach((button) => {
        const active = Number(button.dataset.minutes) === minutes;
        button.setAttribute("aria-pressed", String(active));
    });
};

const renderTimer = () => {
    const progress = state.duration > 0 ? state.remaining / state.duration : 0;
    elements.progress.setAttribute(
        "stroke-dasharray",
        `${CIRCUMFERENCE * progress} ${CIRCUMFERENCE}`
    );
    elements.progress.classList.toggle("is-finished", state.finished);
    elements.time.textContent = format(state.remaining);
    show(elements.timeLabel, state.finished);
};

const renderTitle = () => {
    const active = state.hasStarted && !state.finished && !state.editing;
    const editing = state.hasStarted && !state.finished && state.editing;
    show(elements.title, !active && !editing);
    show(elements.titleActive, active);
    show(elements.titleEdit, editing);
    elements.titleText.textContent = state.title || "Sin título";
    if (!active && !editing) {
        elements.title.value = state.title;
    }
};

const renderControls = () => {
    show(elements.restart, state.hasStarted);
    show(elements.playIcon, !state.running);
    show(elements.pauseIcon, state.running);
    elements.primaryButton.classList.toggle("is-running", state.running);
    elements.primaryButton.setAttribute(
        "aria-label",
        state.running ? "Pausar" : state.paused ? "Reanudar" : "Iniciar"
    );
};

const renderCounter = () => {
    show(elements.counter, state.hasStarted && !state.finished);
    elements.counterDots.forEach((dot, index) => {
        dot.classList.toggle("is-active", index < state.pomodoros);
    });
    show(elements.counterComplete, state.pomodoros >= 4);
};

const renderDialog = () => {
    const focus = state.mode === "focus";
    show(elements.dialog, state.dialog);
    elements.dialog.dataset.nextMode = focus ? "break" : "focus";
    elements.dialogTitle.textContent = focus ? "¡Pomodoro completado!" : "Descanso terminado";
    elements.dialogText.textContent = focus
        ? "¿Quieres tomar un descanso de 5 minutos?"
        : "¿Listo para volver al trabajo?";
    elements.dialogPrimary.textContent = focus ? "Sí, descansar" : "Sí, trabajar";
    elements.dialogSecondary.textContent = focus ? "No, seguir" : "No, descansar más";
};

const render = () => {
    document.documentElement.dataset.mode = state.mode;
    renderMode();
    renderDuration();
    renderTimer();
    renderTitle();
    renderControls();
    renderCounter();
    renderDialog();
};

const saveTitle = () => {
    state.title = elements.titleEdit.value.trim();
    state.editing = false;
    renderTitle();
};

const getAudioContext = () => {
    if (!audioContext) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioContextClass();
    }
    return audioContext;
};

const resumeAudio = () => {
    const context = getAudioContext();
    if (context.state === "suspended") {
        context.resume();
    }
};

const playEndSound = () => {
    const context = getAudioContext();
    const now = context.currentTime;
    [523.25, 659.25, 783.99].forEach((frequency, index) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = "sine";
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0.3, now + index * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.15 + 0.4);
        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start(now + index * 0.15);
        oscillator.stop(now + index * 0.15 + 0.4);
    });
};

elements.focusModeButton.addEventListener("click", () => switchMode("focus"));
elements.breakModeButton.addEventListener("click", () => switchMode("break"));
elements.minusMinutes.addEventListener("click", () => adjustMinutes(-1));
elements.plusMinutes.addEventListener("click", () => adjustMinutes(1));
elements.primaryButton.addEventListener("click", () => {
    if (state.running) {
        pause();
    } else {
        start();
    }
});
elements.restart.addEventListener("click", stop);
elements.minutes.addEventListener("focus", () => show(elements.presets, true));
elements.minutes.addEventListener("input", (event) => {
    const value = event.target.value === "" ? 1 : Number(event.target.value);
    setMinutes(value);
});
elements.presetButtons.forEach((button) => {
    button.addEventListener("click", () => {
        setMinutes(Number(button.dataset.minutes));
        show(elements.presets, false);
    });
});
document.addEventListener("pointerdown", (event) => {
    if (!elements.durationSelector.contains(event.target)) {
        show(elements.presets, false);
    }
});
elements.title.addEventListener("input", (event) => {
    state.title = event.target.value;
});
elements.editTitle.addEventListener("click", () => {
    state.editing = true;
    elements.titleEdit.value = state.title;
    renderTitle();
    elements.titleEdit.focus();
    elements.titleEdit.select();
});
elements.titleEdit.addEventListener("blur", saveTitle);
elements.titleEdit.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        saveTitle();
    }
    if (event.key === "Escape") {
        state.editing = false;
        elements.titleEdit.value = state.title;
        renderTitle();
    }
});
elements.infoOpen.addEventListener("click", () => {
    show(elements.info, true);
    elements.infoClose.focus();
});
const closeInfo = () => {
    show(elements.info, false);
    elements.infoOpen.focus();
};

elements.infoClose.addEventListener("click", closeInfo);
elements.info.addEventListener("click", (event) => {
    if (event.target === elements.info) {
        closeInfo();
    }
});
elements.dialogPrimary.addEventListener("click", () => {
    switchMode(state.mode === "focus" ? "break" : "focus");
    elements.primaryButton.focus();
});
elements.dialogSecondary.addEventListener("click", () => {
    switchMode(state.mode);
    elements.primaryButton.focus();
});
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !elements.info.classList.contains("is-hidden")) {
        closeInfo();
    }
});

render();
