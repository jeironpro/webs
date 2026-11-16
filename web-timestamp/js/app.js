import {
    buildOutputs,
    parseDateInput,
    parseTimestamp,
    relativeTime,
    toDatetimeLocal,
} from "./modules/timestamp.js";

const $ = (id) => document.getElementById(id);

const elements = {
    liveEpoch: $("live-epoch"),
    liveUtc: $("live-utc"),
    liveLocal: $("live-local"),
    zoneLabel: $("zone-label"),
    localZone: $("local-zone"),
    timestampInput: $("timestamp-input"),
    datetimeInput: $("datetime-input"),
    unitLabel: $("unit-label"),
    now: $("now"),
    error: $("error"),
    copyStatus: $("copy-status"),
    outIso: $("out-iso"),
    outUtc: $("out-utc"),
    outLocal: $("out-local"),
    outRelative: $("out-relative"),
    outSeconds: $("out-seconds"),
    outMs: $("out-ms"),
    year: $("year"),
};

const UTC_CLOCK = new Intl.DateTimeFormat("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "UTC",
});

const LOCAL_CLOCK = new Intl.DateTimeFormat("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
});

const copyButtons = Array.from(document.querySelectorAll("[data-copy]"));
const copyValues = {};

let following = true;
let currentDate = new Date();
let statusTimer = 0;

function setCopy(key, value) {
    const button = copyButtons.find((item) => item.dataset.copy === key);
    copyValues[key] = value;

    if (button) button.disabled = value === "";
}

function clearError() {
    elements.error.textContent = "";
    elements.timestampInput.setAttribute("aria-invalid", "false");
    elements.datetimeInput.setAttribute("aria-invalid", "false");
}

function showError(message, input) {
    elements.error.textContent = message;
    elements.timestampInput.setAttribute("aria-invalid", String(input === elements.timestampInput));
    elements.datetimeInput.setAttribute("aria-invalid", String(input === elements.datetimeInput));
}

function clearOutputs() {
    currentDate = null;
    elements.outIso.textContent = "—";
    elements.outUtc.textContent = "—";
    elements.outLocal.textContent = "—";
    elements.outRelative.textContent = "—";
    elements.outSeconds.textContent = "—";
    elements.outMs.textContent = "—";

    ["iso", "utc", "local", "seconds", "milliseconds"].forEach((key) => setCopy(key, ""));
}

function renderOutputs(date) {
    const outputs = buildOutputs(date);

    elements.outIso.textContent = outputs.iso;
    elements.outUtc.textContent = outputs.utc;
    elements.outLocal.textContent = outputs.local;
    elements.outRelative.textContent = relativeTime(date);
    elements.outSeconds.textContent = outputs.seconds;
    elements.outMs.textContent = outputs.milliseconds;

    elements.zoneLabel.textContent = `${outputs.zone} · ${outputs.offset}`;
    elements.localZone.textContent = `${outputs.zone} (${outputs.offset})`;

    setCopy("iso", outputs.iso);
    setCopy("utc", outputs.utc);
    setCopy("local", outputs.local);
    setCopy("seconds", outputs.seconds);
    setCopy("milliseconds", outputs.milliseconds);
}

function applyDate(date, options = {}) {
    currentDate = date;

    if (options.timestamp !== false) {
        elements.timestampInput.value = String(Math.floor(date.getTime() / 1000));
    }

    if (options.datetime !== false) {
        elements.datetimeInput.value = toDatetimeLocal(date);
    }

    renderOutputs(date);
    clearError();
}

function handleTimestamp() {
    following = false;
    const result = parseTimestamp(elements.timestampInput.value);

    if (!result.ok) {
        clearOutputs();

        if (result.error === "empty") {
            clearError();
            return;
        }

        const message =
            result.error === "range"
                ? "Esa marca queda fuera del rango de fechas admitido."
                : "Esa marca no es un número válido. Usa segundos o milisegundos.";
        showError(message, elements.timestampInput);
        return;
    }

    elements.unitLabel.textContent = result.unit === "ms" ? "milisegundos" : "segundos";
    applyDate(result.date, { timestamp: false, datetime: true });
}

function handleDatetime() {
    following = false;
    const result = parseDateInput(elements.datetimeInput.value);

    if (!result.ok) {
        clearOutputs();

        if (result.error === "empty") {
            clearError();
            return;
        }

        showError("Esa fecha no es válida.", elements.datetimeInput);
        return;
    }

    elements.unitLabel.textContent = "segundos";
    applyDate(result.date, { timestamp: true, datetime: false });
}

function updateLive(date) {
    elements.liveEpoch.textContent = String(Math.floor(date.getTime() / 1000));
    elements.liveUtc.textContent = UTC_CLOCK.format(date);
    elements.liveLocal.textContent = LOCAL_CLOCK.format(date);
}

function tick() {
    const now = new Date();
    updateLive(now);

    if (following) {
        applyDate(now);
    } else if (currentDate) {
        elements.outRelative.textContent = relativeTime(currentDate, now);
    }
}

function goNow() {
    following = true;
    elements.unitLabel.textContent = "segundos";
    applyDate(new Date());
}

function announce(message) {
    elements.copyStatus.textContent = message;
    window.clearTimeout(statusTimer);
    statusTimer = window.setTimeout(() => {
        elements.copyStatus.textContent = "";
    }, 2600);
}

async function copyValue(button) {
    const value = copyValues[button.dataset.copy] ?? "";
    if (value === "") return;

    try {
        await navigator.clipboard.writeText(value);
        announce(`Copiado: ${button.getAttribute("aria-label").replace("Copiar ", "")}`);
    } catch {
        announce("No se pudo copiar");
    }
}

elements.timestampInput.addEventListener("input", handleTimestamp);
elements.datetimeInput.addEventListener("input", handleDatetime);
elements.now.addEventListener("click", goNow);

copyButtons.forEach((button) => {
    button.addEventListener("click", () => copyValue(button));
});

elements.year.textContent = String(new Date().getFullYear());

updateLive(new Date());
applyDate(new Date());

window.setInterval(tick, 1000);
