import {
    MAX_LINES,
    MAX_WORDS,
    computeStats,
    computeWordStats,
    diffInline,
    diffLines,
    diffWords,
    isTruncated,
    isWordTruncated,
    splitLines,
    toUnified,
    toWordDiff,
} from "./modules/diff.js";

const $ = (id) => document.getElementById(id);
const qsa = (selector) => Array.from(document.querySelectorAll(selector));

const elements = {
    textA: $("text-a"),
    textB: $("text-b"),
    countA: $("count-a"),
    countB: $("count-b"),
    ignoreCase: $("ignore-case"),
    ignoreSpace: $("ignore-space"),
    modes: qsa('input[name="mode"]'),
    example: $("example"),
    swap: $("swap"),
    clear: $("clear"),
    copy: $("copy"),
    copyStatus: $("copy-status"),
    diff: $("diff"),
    diffHead: $("diff-head"),
    empty: $("diff-empty"),
    wordDiff: $("word-diff"),
    wordDiffText: $("word-diff-text"),
    ribbon: $("ribbon"),
    summaryTitle: $("summary-title"),
    similarity: $("similarity"),
    statEqual: $("stat-equal"),
    statAdd: $("stat-add"),
    statRemove: $("stat-remove"),
    statChange: $("stat-change"),
    statChangeItem: $("stat-change-item"),
    labelEqual: $("label-equal"),
    labelAdd: $("label-add"),
    labelRemove: $("label-remove"),
    diffTitle: $("diff-title"),
    truncated: $("truncated"),
    year: $("year"),
};

const EXAMPLES = {
    original: `# Configuración del servicio
puerto: 8080
entorno: produccion
registro:
  nivel: info
  destino: archivo
correo:
  remitente: no-reply@ejemplo.com
  limite: 100
funciones:
  - autenticacion
  - pagos
  - informes
`,
    revised: `# Configuración del servicio
puerto: 8081
entorno: produccion
registro:
  nivel: debug
  destino: consola
correo:
  remitente: hola@ejemplo.com
  limite: 250
funciones:
  - autenticacion
  - pagos
  - informes
  - exportacion
`,
};

const BADGES = { equal: "=", add: "+", remove: "−", change: "~" };
const SEGMENT_LIMIT = 64;

let renderTimer = 0;
let statusTimer = 0;

function countLabel(value) {
    return `${splitLines(value).length} líneas`;
}

function updateCounts() {
    elements.countA.textContent = countLabel(elements.textA.value);
    elements.countB.textContent = countLabel(elements.textB.value);
}

function currentOptions() {
    return {
        ignoreCase: elements.ignoreCase.checked,
        ignoreWhitespace: elements.ignoreSpace.checked,
    };
}

function currentMode() {
    const checked = elements.modes.find((radio) => radio.checked);
    return checked ? checked.value : "lines";
}

function textNode(value) {
    return document.createTextNode(value);
}

function numberCell(value) {
    const cell = document.createElement("span");
    cell.className = "row__no";
    cell.textContent = value === null ? "" : String(value);
    return cell;
}

function codeCell(side) {
    const cell = document.createElement("code");
    cell.className = `row__code row__code--${side}`;
    return cell;
}

function badgeCell(type) {
    const badge = document.createElement("span");
    badge.className = "row__badge";
    badge.setAttribute("aria-hidden", "true");
    badge.textContent = BADGES[type];
    return badge;
}

function appendInline(cell, inline, side) {
    const changed = side === "left" ? inline.removed : inline.added;

    if (inline.prefix) cell.append(textNode(inline.prefix));

    if (changed) {
        const mark = document.createElement("mark");
        mark.className = `mark mark--${side}`;
        mark.textContent = changed;
        cell.append(mark);
    }

    if (inline.suffix) cell.append(textNode(inline.suffix));
}

function buildRow(row) {
    const item = document.createElement("li");
    item.className = `row row--${row.type}`;

    const leftCode = codeCell("left");
    const rightCode = codeCell("right");

    if (row.type === "change" && row.left !== null && row.right !== null) {
        const inline = diffInline(row.left, row.right);
        appendInline(leftCode, inline, "left");
        appendInline(rightCode, inline, "right");
    } else {
        leftCode.textContent = row.left ?? "";
        rightCode.textContent = row.right ?? "";
    }

    item.append(
        numberCell(row.leftNo),
        leftCode,
        badgeCell(row.type),
        rightCode,
        numberCell(row.rightNo)
    );

    return item;
}

function renderRows(rows) {
    const fragment = document.createDocumentFragment();
    rows.forEach((row) => fragment.append(buildRow(row)));
    elements.diff.replaceChildren(fragment);
}

function renderWords(segments) {
    const fragment = document.createDocumentFragment();

    const appendText = (value) => {
        if (value) fragment.append(textNode(value));
    };

    segments.forEach((segment) => {
        if (segment.type === "equal") {
            appendText(segment.text);
            return;
        }

        const match = segment.text.match(/^(\s*)([\s\S]*?)(\s*)$/);
        if (!match || match[2] === "") {
            appendText(segment.text);
            return;
        }

        appendText(match[1]);
        const element = document.createElement(segment.type === "remove" ? "del" : "ins");
        element.textContent = match[2];
        fragment.append(element);
        appendText(match[3]);
    });

    elements.wordDiffText.replaceChildren(fragment);
}

function dominantType(items) {
    const counts = { equal: 0, add: 0, remove: 0, change: 0 };
    items.forEach((item) => counts[item.type]++);

    return ["change", "remove", "add", "equal"].reduce((best, type) =>
        counts[type] > counts[best] ? type : best
    );
}

function renderRibbon(items) {
    elements.ribbon.replaceChildren();
    if (items.length === 0) return;

    const bucket = Math.ceil(items.length / SEGMENT_LIMIT);

    for (let start = 0; start < items.length; start += bucket) {
        const slice = items.slice(start, start + bucket);
        const segment = document.createElement("span");
        segment.className = `ribbon__seg ribbon__seg--${dominantType(slice)}`;
        segment.style.flexGrow = String(slice.length);
        elements.ribbon.append(segment);
    }
}

function renderStats(stats, isWords) {
    elements.statEqual.textContent = String(stats.equal);
    elements.statAdd.textContent = String(stats.add);
    elements.statRemove.textContent = String(stats.remove);
    elements.statChange.textContent = String(stats.change ?? 0);
    elements.statChangeItem.hidden = isWords;

    elements.labelEqual.textContent = isWords ? "palabras iguales" : "iguales";
    elements.labelAdd.textContent = isWords ? "palabras añadidas" : "añadidas";
    elements.labelRemove.textContent = isWords ? "palabras eliminadas" : "eliminadas";

    elements.summaryTitle.textContent = isWords ? "Resumen de palabras" : "Resumen de la cinta";
    elements.similarity.textContent = isWords
        ? `${stats.similarity} % de palabras iguales`
        : `${stats.similarity} % igual`;
}

function render() {
    const isWords = currentMode() === "words";
    const options = currentOptions();

    updateCounts();

    let items;

    if (isWords) {
        const segments = diffWords(elements.textA.value, elements.textB.value, options);
        items = segments;
        renderWords(segments);
        renderStats(computeWordStats(segments), true);
        elements.wordDiff.hidden = segments.length === 0;
        elements.diff.hidden = true;
        elements.diffHead.hidden = true;
        elements.truncated.hidden = !isWordTruncated(elements.textA.value, elements.textB.value);
        elements.truncated.textContent = `Textos largos: se comparan las primeras ${MAX_WORDS} palabras de cada lado.`;
        elements.diffTitle.textContent = "Palabra a palabra";
        elements.copy.textContent = "Copiar diff de palabras";
    } else {
        const rows = diffLines(elements.textA.value, elements.textB.value, options);
        items = rows;
        renderRows(rows);
        renderStats(computeStats(rows), false);
        elements.wordDiff.hidden = true;
        elements.diff.hidden = rows.length === 0;
        elements.diffHead.hidden = false;
        elements.truncated.hidden = !isTruncated(elements.textA.value, elements.textB.value);
        elements.truncated.textContent = `Textos largos: se comparan las primeras ${MAX_LINES} líneas de cada lado.`;
        elements.diffTitle.textContent = "Cinta de cambios";
        elements.copy.textContent = "Copiar diff unificado";
    }

    renderRibbon(items);
    elements.empty.hidden = items.length > 0;
    elements.copy.disabled = items.length === 0;
}

function scheduleRender() {
    window.clearTimeout(renderTimer);
    renderTimer = window.setTimeout(render, 120);
}

function setStatus(message) {
    elements.copyStatus.textContent = message;
    window.clearTimeout(statusTimer);
    if (message) {
        statusTimer = window.setTimeout(() => {
            elements.copyStatus.textContent = "";
        }, 2600);
    }
}

async function copyDiff() {
    const mode = currentMode();
    const options = currentOptions();
    const unified =
        mode === "words"
            ? toWordDiff(diffWords(elements.textA.value, elements.textB.value, options))
            : toUnified(diffLines(elements.textA.value, elements.textB.value, options), {
                  leftLabel: "original",
                  rightLabel: "versión nueva",
              });

    try {
        await navigator.clipboard.writeText(unified);
        setStatus(mode === "words" ? "Diff de palabras copiado" : "Diff copiado al portapapeles");
    } catch {
        setStatus("No se pudo copiar el diff");
    }
}

function loadExample() {
    elements.textA.value = EXAMPLES.original;
    elements.textB.value = EXAMPLES.revised;
    render();
    setStatus("Ejemplo cargado");
}

function swapTexts() {
    const previous = elements.textA.value;
    elements.textA.value = elements.textB.value;
    elements.textB.value = previous;
    render();
    setStatus("Versiones intercambiadas");
}

function clearTexts() {
    elements.textA.value = "";
    elements.textB.value = "";
    render();
    elements.textA.focus();
    setStatus("");
}

elements.textA.addEventListener("input", scheduleRender);
elements.textB.addEventListener("input", scheduleRender);
elements.ignoreCase.addEventListener("change", render);
elements.ignoreSpace.addEventListener("change", render);
elements.modes.forEach((radio) => radio.addEventListener("change", render));
elements.example.addEventListener("click", loadExample);
elements.swap.addEventListener("click", swapTexts);
elements.clear.addEventListener("click", clearTexts);
elements.copy.addEventListener("click", copyDiff);

elements.year.textContent = String(new Date().getFullYear());

loadExample();
setStatus("");
