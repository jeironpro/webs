import { qsa, qs } from "./utils/dom.js";
import { buildSegments, countGroups, findMatches, replaceMatches } from "./modules/regex.js";

const MAX_RENDERED = 200;

const elements = {
    pattern: qs("#pattern"),
    patternError: qs("#pattern-error"),
    flags: qsa(".flag__input"),
    text: qs("#test-text"),
    replacement: qs("#replacement"),
    preview: qs("#preview"),
    matchList: qs("#match-list"),
    matchLimit: qs("#match-limit"),
    summary: qs("#summary"),
    output: qs("#replace-output"),
    copy: qs("#copy"),
    copyStatus: qs("#copy-status"),
    example: qs("#example"),
    clear: qs("#clear"),
    year: qs("#year"),
};

const SAMPLE = {
    pattern: String.raw`\b([\w.+-]+)@([\w-]+)\.([a-z]{2,})\b`,
    text: [
        "Escríbenos a soporte@ejemplo.com o a ventas@ejemplo.es.",
        "También atendemos consultas en hola@regex.dev y prensa@medio.org.",
        "",
        "Los correos con dominio inválido, como usuario@localhost,",
        "no deberían coincidir con este patrón.",
    ].join("\n"),
    replacement: "$1 [at] $2.$3",
};

function activeFlags() {
    return elements.flags
        .filter((input) => input.checked)
        .map((input) => input.dataset.flag ?? "")
        .join("");
}

function groupLabel(name) {
    return name === undefined ? "" : `$<${name}>`;
}

function renderPreview(text, matches) {
    elements.preview.replaceChildren();

    for (const segment of buildSegments(text, matches)) {
        const node = document.createElement(segment.match ? "mark" : "span");
        node.textContent = segment.text;
        elements.preview.append(node);
    }
}

function renderMatch(match, position) {
    const item = document.createElement("li");
    item.className = "table__row";

    const index = document.createElement("span");
    index.className = "table__idx";
    index.textContent = String(position + 1).padStart(2, "0");

    const value = document.createElement("code");
    value.className = "table__value";
    value.textContent = match.value === "" ? "«coincidencia vacía»" : match.value;

    const positionLabel = document.createElement("span");
    positionLabel.className = "table__pos";
    positionLabel.textContent = String(match.index);

    const groups = match.groups
        .map((group, positionGroup) => {
            const name = Object.keys(match.namedGroups).find(
                (key) => match.namedGroups[key] === group
            );
            const label = name
                ? `${groupLabel(name)} $${positionGroup + 1}`
                : `$${positionGroup + 1}`;
            return `${label}: ${group === undefined ? "sin captura" : group === "" ? "vacío" : group}`;
        })
        .join(" · ");

    const detail = document.createElement("span");
    detail.className = "table__groups";
    detail.textContent = groups === "" ? "—" : groups;

    item.append(index, value, positionLabel, detail);
    return item;
}

function renderMatches(matches) {
    elements.matchList.replaceChildren();
    const visible = matches.slice(0, MAX_RENDERED);
    visible.forEach((match, position) => {
        elements.matchList.append(renderMatch(match, position));
    });
    elements.matchLimit.hidden = matches.length <= MAX_RENDERED;
}

function showError(message) {
    elements.pattern.setAttribute("aria-invalid", "true");
    elements.patternError.textContent = message;
    elements.preview.replaceChildren();
    elements.matchList.replaceChildren();
    elements.matchLimit.hidden = true;
    elements.summary.textContent = "Patrón no válido";
    elements.output.value = "";
    elements.copy.disabled = true;
}

function render() {
    const source = elements.pattern.value;
    const flags = activeFlags();
    const text = elements.text.value;
    const replacement = elements.replacement.value;

    elements.pattern.removeAttribute("aria-invalid");
    elements.patternError.textContent = "";
    elements.copyStatus.textContent = "";

    try {
        const matches = findMatches(source, flags, text);
        const groups = countGroups(matches);

        renderPreview(text, matches);
        renderMatches(matches);
        elements.summary.textContent = `${matches.length} ${
            matches.length === 1 ? "coincidencia" : "coincidencias"
        } · ${groups} ${groups === 1 ? "grupo" : "grupos"}`;
        elements.output.value = replaceMatches(source, flags, text, replacement);
        elements.copy.disabled = text === "";
    } catch (error) {
        showError(`Patrón no válido: ${error.message}`);
    }
}

function loadExample() {
    elements.pattern.value = SAMPLE.pattern;
    elements.text.value = SAMPLE.text;
    elements.replacement.value = SAMPLE.replacement;
    elements.flags.forEach((input) => {
        input.checked = input.dataset.flag === "i";
    });
    render();
    elements.pattern.focus();
}

function clearAll() {
    elements.pattern.value = "";
    elements.text.value = "";
    elements.replacement.value = "";
    elements.flags.forEach((input) => {
        input.checked = false;
    });
    render();
    elements.pattern.focus();
}

async function copyOutput() {
    try {
        await navigator.clipboard.writeText(elements.output.value);
        elements.copyStatus.textContent = "Resultado copiado.";
    } catch {
        elements.copyStatus.textContent = "No se pudo copiar el resultado.";
    }
}

if (elements.year) {
    elements.year.textContent = String(new Date().getFullYear());
}

elements.pattern.addEventListener("input", render);
elements.text.addEventListener("input", render);
elements.replacement.addEventListener("input", render);
elements.flags.forEach((input) => input.addEventListener("change", render));
elements.example.addEventListener("click", loadExample);
elements.clear.addEventListener("click", clearAll);
elements.copy.addEventListener("click", copyOutput);

if (elements.text.value === "") {
    elements.text.value = SAMPLE.text;
}

render();
