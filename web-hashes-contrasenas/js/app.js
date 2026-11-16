import { hashTexts } from "./modules/hash.js";
import { checkPassword } from "./modules/strength.js";

const DEMO_HASH_TEXT = "Bóveda local · 2026";
const DEMO_PASSWORD = "Nube-47-Faro";

const $ = (id) => document.getElementById(id);

const elements = {
    hashInput: $("hash-input"),
    hashStats: $("hash-stats"),
    sha256: $("sha256-value"),
    md5: $("md5-value"),
    hashStatus: $("hash-status"),
    password: $("password-input"),
    passwordMeta: $("password-meta"),
    reveal: $("reveal-password"),
    gauge: $("strength-gauge"),
    strengthLabel: $("strength-label"),
    entropy: $("entropy-value"),
    summary: $("strength-summary"),
    classList: $("class-list"),
    crackList: $("crack-list"),
    warningList: $("warning-list"),
    tipList: $("tip-list"),
};

const segments = [...elements.gauge.querySelectorAll(".gauge__meter span")];
const numberFormatter = new Intl.NumberFormat("es-ES", {
    maximumFractionDigits: 0,
    useGrouping: true,
});

let hashStatusTimer;

function describeText(text) {
    const characters = Array.from(text).length;
    const bytes = new TextEncoder().encode(text).length;
    const noun = characters === 1 ? "carácter" : "caracteres";

    return `${numberFormatter.format(characters)} ${noun} · ${numberFormatter.format(bytes)} B`;
}

function showHashStatus(message) {
    clearTimeout(hashStatusTimer);
    elements.hashStatus.textContent = message;

    hashStatusTimer = setTimeout(() => {
        elements.hashStatus.textContent = "";
    }, 2800);
}

function renderHashes() {
    const text = elements.hashInput.value;
    const hashes = hashTexts(text);

    elements.hashStats.textContent = describeText(text);
    elements.sha256.textContent = hashes.sha256;
    elements.md5.textContent = hashes.md5;
    elements.hashStatus.textContent = "";
}

function createTextItem(text, className, tagName = "li") {
    const item = document.createElement(tagName);
    item.className = className;
    item.textContent = text;
    return item;
}

function renderClasses(result) {
    const items = result.classes.map((characterClass) =>
        createTextItem(
            characterClass.label,
            characterClass.active ? "class-chip is-active" : "class-chip"
        )
    );

    elements.classList.replaceChildren(...items);
}

function renderCrackTimes(result) {
    const rows = result.crackTimes.map((scenario) => {
        const row = document.createElement("div");
        row.className = "crack-row";

        const term = document.createElement("dt");
        term.append(
            createTextItem(scenario.label, "crack-row__label", "span"),
            createTextItem(scenario.rateLabel, "crack-row__rate", "span")
        );

        const detail = document.createElement("dd");
        detail.textContent = scenario.time;

        row.append(term, detail);
        return row;
    });

    elements.crackList.replaceChildren(...rows);
}

function renderFeedback(result) {
    const warnings = result.warnings.map((warning) =>
        createTextItem(warning, "feedback__item is-warning")
    );

    if (warnings.length === 0) {
        warnings.push(
            createTextItem(
                result.empty
                    ? "Escribe una contraseña para revisar sus patrones."
                    : "Sin patrones habituales detectados.",
                "feedback__item is-neutral"
            )
        );
    }

    const tips = result.tips.map((tip) => createTextItem(tip, "feedback__item is-tip"));

    elements.warningList.replaceChildren(...warnings);
    elements.tipList.replaceChildren(...tips);
}

function renderPassword() {
    const result = checkPassword(elements.password.value);
    const activeClasses = result.classes.filter((item) => item.active).length;
    const noun = result.length === 1 ? "carácter" : "caracteres";

    elements.passwordMeta.textContent = result.empty
        ? "0 caracteres"
        : `${result.length} ${noun} · ${activeClasses} ${activeClasses === 1 ? "clase" : "clases"}`;

    elements.gauge.dataset.score = String(result.score);
    elements.gauge.dataset.tone = result.tone;
    elements.gauge.setAttribute("aria-valuenow", String(result.score));
    elements.gauge.setAttribute(
        "aria-valuetext",
        result.empty
            ? "Sin contraseña"
            : `${result.label}: ${Math.round(result.entropy)} bits de entropía`
    );

    elements.strengthLabel.textContent = result.label;
    elements.strengthLabel.dataset.tone = result.tone;
    elements.entropy.textContent = result.empty ? "—" : `≈ ${Math.round(result.entropy)} bits`;
    elements.summary.textContent = result.summary;

    segments.forEach((segment, index) => {
        segment.classList.toggle("is-on", !result.empty && index <= result.score);
    });

    renderClasses(result);
    renderCrackTimes(result);
    renderFeedback(result);
}

async function copyHash(value, node, label) {
    try {
        if (!navigator.clipboard) throw new Error("El portapapeles no está disponible.");
        await navigator.clipboard.writeText(value);
        showHashStatus(`${label} copiado`);
    } catch {
        const selection = window.getSelection();
        if (selection) {
            const range = document.createRange();
            range.selectNodeContents(node);
            selection.removeAllRanges();
            selection.addRange(range);
        }
        showHashStatus(`${label} seleccionado: copia con Ctrl+C`);
    }
}

document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", () => {
        const kind = button.dataset.copy;
        const node = kind === "sha256" ? elements.sha256 : elements.md5;
        const label = kind === "sha256" ? "SHA-256" : "MD5";
        copyHash(node.textContent, node, label);
    });
});

elements.hashInput.addEventListener("input", renderHashes);

$("clear-hash").addEventListener("click", () => {
    elements.hashInput.value = "";
    renderHashes();
    elements.hashInput.focus();
});

elements.password.addEventListener("input", renderPassword);

elements.reveal.addEventListener("click", () => {
    const hidden = elements.password.type === "password";
    elements.password.type = hidden ? "text" : "password";
    elements.reveal.textContent = hidden ? "Ocultar" : "Mostrar";
    elements.reveal.setAttribute("aria-pressed", String(hidden));
});

$("clear-password").addEventListener("click", () => {
    elements.password.value = "";
    renderPassword();
    elements.password.focus();
});

document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
});

elements.hashInput.value = DEMO_HASH_TEXT;
elements.password.value = DEMO_PASSWORD;
renderHashes();
renderPassword();
