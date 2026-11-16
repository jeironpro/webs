import { contrastRatio, normalizeHex, relativeLuminance, wcagReport } from "./modules/contrast.js";

const $ = (id) => document.getElementById(id);

const elements = {
    fgPicker: $("fg-picker"),
    bgPicker: $("bg-picker"),
    fgHex: $("fg-hex"),
    bgHex: $("bg-hex"),
    fgWell: $("fg-well"),
    bgWell: $("bg-well"),
    fgLum: $("fg-lum"),
    bgLum: $("bg-lum"),
    ratio: $("ratio"),
    verdict: $("verdict"),
    scaleMarker: $("scale-marker"),
    criteria: [...document.querySelectorAll("[data-criterion]")],
    announce: $("announce"),
};

const colors = {
    fg: "#2563EB",
    bg: "#FFFFFF",
};

const levelLabels = {
    AAA: "Nivel AAA",
    AA: "Nivel AA",
    "AA-large": "Solo AA grande",
    none: "Sin cumplir",
};

let announceTimer = null;

function announce(message, delay = 500) {
    if (announceTimer !== null) window.clearTimeout(announceTimer);
    announceTimer = window.setTimeout(() => {
        elements.announce.textContent = message;
    }, delay);
}

function syncInputs() {
    elements.fgPicker.value = colors.fg.toLowerCase();
    elements.bgPicker.value = colors.bg.toLowerCase();
    elements.fgHex.value = colors.fg.slice(1);
    elements.bgHex.value = colors.bg.slice(1);
    elements.fgHex.setAttribute("aria-invalid", "false");
    elements.bgHex.setAttribute("aria-invalid", "false");
}

function applyColors({ notify = true } = {}) {
    const ratio = contrastRatio(colors.fg, colors.bg) ?? 0;
    const report = wcagReport(ratio);
    const fgLum = relativeLuminance(colors.fg) ?? 0;
    const bgLum = relativeLuminance(colors.bg) ?? 0;
    const position = Math.min(99, Math.max(0, ((Math.min(ratio, 21) - 1) / 20) * 100));

    document.documentElement.style.setProperty("--sample-fg", colors.fg);
    document.documentElement.style.setProperty("--sample-bg", colors.bg);
    elements.fgWell.style.backgroundColor = colors.fg;
    elements.bgWell.style.backgroundColor = colors.bg;

    elements.ratio.textContent = ratio.toFixed(2);
    elements.fgLum.textContent = fgLum.toFixed(3);
    elements.bgLum.textContent = bgLum.toFixed(3);
    elements.scaleMarker.style.insetInlineStart = `${position}%`;

    elements.verdict.textContent = levelLabels[report.level];
    elements.verdict.classList.remove("is-aaa", "is-aa", "is-partial", "is-fail");
    elements.verdict.classList.add(
        report.level === "AAA"
            ? "is-aaa"
            : report.level === "AA"
              ? "is-aa"
              : report.level === "AA-large"
                ? "is-partial"
                : "is-fail"
    );

    elements.criteria.forEach((criterion) => {
        const pass = report[criterion.dataset.criterion] === true;
        criterion.classList.toggle("is-pass", pass);
        criterion.classList.toggle("is-fail", !pass);
        criterion.querySelector(".criterion__status").textContent = pass ? "Cumple" : "No cumple";
    });

    if (notify) {
        announce(
            `Relación ${ratio.toFixed(2)} a 1. ${levelLabels[report.level]}. ` +
                `AA normal ${report.normalAA ? "cumple" : "no cumple"}; ` +
                `AAA normal ${report.normalAAA ? "cumple" : "no cumple"}.`
        );
    }
}

function handlePicker(kind) {
    const picker = kind === "fg" ? elements.fgPicker : elements.bgPicker;
    const hex = normalizeHex(picker.value);
    if (hex === null) return;

    colors[kind] = hex;
    syncInputs();
    applyColors();
}

function handleHex(kind) {
    const input = kind === "fg" ? elements.fgHex : elements.bgHex;
    const hex = normalizeHex(input.value);

    if (hex === null) {
        input.setAttribute("aria-invalid", "true");
        elements.announce.textContent = "Código hexadecimal no válido. Usa tres o seis dígitos.";
        return;
    }

    input.setAttribute("aria-invalid", "false");
    colors[kind] = hex;
    if (kind === "fg") elements.fgPicker.value = hex.toLowerCase();
    else elements.bgPicker.value = hex.toLowerCase();
    applyColors();
}

function restoreHex(kind) {
    const input = kind === "fg" ? elements.fgHex : elements.bgHex;
    const hex = normalizeHex(input.value);

    if (hex !== null) colors[kind] = hex;
    input.value = colors[kind].slice(1);
    input.setAttribute("aria-invalid", "false");
    syncInputs();
    applyColors();
}

elements.fgPicker.addEventListener("input", () => handlePicker("fg"));
elements.bgPicker.addEventListener("input", () => handlePicker("bg"));

elements.fgHex.addEventListener("input", () => handleHex("fg"));
elements.bgHex.addEventListener("input", () => handleHex("bg"));

elements.fgHex.addEventListener("blur", () => restoreHex("fg"));
elements.bgHex.addEventListener("blur", () => restoreHex("bg"));

$("swap").addEventListener("click", () => {
    [colors.fg, colors.bg] = [colors.bg, colors.fg];
    syncInputs();
    applyColors();
});

document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
});

syncInputs();
applyColors({ notify: false });
