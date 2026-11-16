import {
    computeStats,
    diffInline,
    diffLines,
    isTruncated,
    splitLines,
    toUnified,
} from "./modules/diff.js";

const $ = (id) => document.getElementById(id);

const elements = {
    textA: $("text-a"),
    textB: $("text-b"),
    countA: $("count-a"),
    countB: $("count-b"),
    ignoreCase: $("ignore-case"),
    ignoreSpace: $("ignore-space"),
    example: $("example"),
    swap: $("swap"),
    clear: $("clear"),
    copy: $("copy"),
    copyStatus: $("copy-status"),
    diff: $("diff"),
    empty: $("diff-empty"),
    ribbon: $("ribbon"),
    similarity: $("similarity"),
    statEqual: $("stat-equal"),
    statAdd: $("stat-add"),
    statRemove: $("stat-remove"),
    statChange: $("stat-change"),
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

    elements.diff.hidden = rows.length === 0;
    elements.empty.hidden = rows.length > 0;
}

function dominantType(rows) {
    const counts = { equal: 0, add: 0, remove: 0, change: 0 };
    rows.forEach((row) => counts[row.type]++);

    return ["change", "remove", "add", "equal"].reduce((best, type) =>
        counts[type] > counts[best] ? type : best
    );
}

function renderRibbon(rows) {
    elements.ribbon.replaceChildren();
    if (rows.length === 0) return;

    const bucket = Math.ceil(rows.length / SEGMENT_LIMIT);

    for (let start = 0; start < rows.length; start += bucket) {
        const slice = rows.slice(start, start + bucket);
        const segment = document.createElement("span");
        segment.className = `ribbon__seg ribbon__seg--${dominantType(slice)}`;
        segment.style.flexGrow = String(slice.length);
        elements.ribbon.append(segment);
    }
}

function renderStats(rows) {
    const stats = computeStats(rows);

    elements.statEqual.textContent = String(stats.equal);
    elements.statAdd.textContent = String(stats.add);
    elements.statRemove.textContent = String(stats.remove);
    elements.statChange.textContent = String(stats.change);
    elements.similarity.textContent = `${stats.similarity} % igual`;
}

function render() {
    const rows = diffLines(elements.textA.value, elements.textB.value, currentOptions());

    updateCounts();
    renderStats(rows);
    renderRibbon(rows);
    renderRows(rows);

    elements.truncated.hidden = !isTruncated(elements.textA.value, elements.textB.value);
    elements.copy.disabled = rows.length === 0;
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

async function copyUnified() {
    const rows = diffLines(elements.textA.value, elements.textB.value, currentOptions());
    const unified = toUnified(rows, { leftLabel: "original", rightLabel: "versión nueva" });

    try {
        await navigator.clipboard.writeText(unified);
        setStatus("Diff copiado al portapapeles");
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
elements.example.addEventListener("click", loadExample);
elements.swap.addEventListener("click", swapTexts);
elements.clear.addEventListener("click", clearTexts);
elements.copy.addEventListener("click", copyUnified);

elements.year.textContent = String(new Date().getFullYear());

loadExample();
setStatus("");
