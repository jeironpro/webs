import { parseSchema } from "./modules/schema.js";
import { formatSql } from "./modules/sql.js";

const SAMPLE = `CREATE TABLE usuarios (
  id INTEGER PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  email VARCHAR(160) UNIQUE NOT NULL,
  activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE productos (
  id INTEGER PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  precio NUMERIC(10, 2) NOT NULL
);

CREATE TABLE pedidos (
  id INTEGER PRIMARY KEY,
  usuario_id INTEGER NOT NULL,
  creado_en TIMESTAMP NOT NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE pedido_items (
  pedido_id INTEGER NOT NULL,
  producto_id INTEGER NOT NULL,
  cantidad INTEGER NOT NULL,
  PRIMARY KEY (pedido_id, producto_id),
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
  FOREIGN KEY (producto_id) REFERENCES productos(id)
);

SELECT u.nombre, COUNT(p.id) AS pedidos
FROM usuarios u
LEFT JOIN pedidos p ON p.usuario_id = u.id
WHERE u.activo = TRUE
GROUP BY u.nombre
ORDER BY pedidos DESC;`;

const $ = (id) => document.getElementById(id);

const elements = {
    input: $("sql-input"),
    inputStats: $("input-stats"),
    format: $("format"),
    sample: $("sample"),
    clear: $("clear"),
    copy: $("copy"),
    status: $("format-status"),
    output: $("output"),
    outputCode: $("output-code"),
    outputMeta: $("output-meta"),
    tableCount: $("table-count"),
    columnCount: $("column-count"),
    relationCount: $("relation-count"),
    canvas: $("er-canvas"),
    grid: $("er-grid"),
    links: $("er-links"),
    empty: $("er-empty"),
    relations: $("relations-list"),
};

const SVG_NS = "http://www.w3.org/2000/svg";
let currentSchema = { tables: [], relations: [] };
let cardIndex = new Map();
let schemaTimer = null;
let drawFrame = 0;

function setStatus(message) {
    elements.status.textContent = message;
}

function setOutput(value) {
    elements.outputCode.textContent = value;
    const lines = value === "" ? 0 : value.split("\n").length;
    elements.outputMeta.textContent = `${lines} ${lines === 1 ? "línea" : "líneas"}`;
    elements.copy.disabled = value === "";
}

function updateInputStats() {
    const value = elements.input.value;
    const lines = value === "" ? 0 : value.split("\n").length;
    elements.inputStats.textContent = `${lines} ${lines === 1 ? "línea" : "líneas"} · ${
        value.length
    } caracteres`;
}

function makeElement(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
}

function relationTarget(relation) {
    return relation.toColumn ? `${relation.toTable}.${relation.toColumn}` : relation.toTable;
}

function renderTable(table) {
    const article = makeElement("article", "er-table");
    article.dataset.table = table.name;
    article.setAttribute("aria-label", `Tabla ${table.name}`);

    const header = makeElement("header", "er-table__head");
    header.append(
        makeElement("h3", "", table.name),
        makeElement(
            "span",
            "",
            `${table.columns.length} ${table.columns.length === 1 ? "col" : "cols"}`
        )
    );

    const list = document.createElement("ul");
    const columns = new Map();

    table.columns.forEach((column) => {
        const item = document.createElement("li");
        item.dataset.column = column.name;
        if (column.primaryKey) item.classList.add("is-pk");
        if (column.foreignKey) item.classList.add("is-fk");

        const name = makeElement("span", "col-name", column.name);
        const type = makeElement("span", "col-type", column.type);
        const badges = makeElement("span", "badges");

        if (column.primaryKey) {
            const badge = makeElement("span", "badge badge--pk", "PK");
            badge.title = "Clave primaria";
            badges.append(badge);
        }
        if (column.foreignKey) {
            const badge = makeElement("span", "badge badge--fk", "FK");
            badge.title = "Clave foránea";
            badges.append(badge);
        }

        item.append(name, type, badges);
        list.append(item);
        columns.set(column.name.toLowerCase(), item);
    });

    article.append(header, list);
    return { element: article, columns };
}

function renderRelations(relations) {
    elements.relations.replaceChildren();

    if (relations.length === 0) {
        elements.relations.append(
            makeElement("li", "relations__empty", "Sin claves foráneas declaradas.")
        );
        return;
    }

    relations.forEach((relation) => {
        const item = document.createElement("li");
        item.append(
            makeElement("span", "relation__from", `${relation.fromTable}.${relation.fromColumn}`),
            makeElement("span", "relation__arrow", "→"),
            makeElement("span", "relation__to", relationTarget(relation))
        );
        elements.relations.append(item);
    });
}

function drawLinks() {
    while (elements.links.firstChild) elements.links.removeChild(elements.links.firstChild);
    if (currentSchema.relations.length === 0 || cardIndex.size === 0) return;

    const canvasBox = elements.canvas.getBoundingClientRect();
    if (canvasBox.width === 0 || canvasBox.height === 0) return;

    elements.links.setAttribute(
        "viewBox",
        `0 0 ${Math.round(canvasBox.width)} ${Math.round(canvasBox.height)}`
    );

    const defs = document.createElementNS(SVG_NS, "defs");
    const marker = document.createElementNS(SVG_NS, "marker");
    marker.setAttribute("id", "er-arrow");
    marker.setAttribute("viewBox", "0 0 8 8");
    marker.setAttribute("refX", "7");
    marker.setAttribute("refY", "4");
    marker.setAttribute("markerWidth", "7");
    marker.setAttribute("markerHeight", "7");
    marker.setAttribute("orient", "auto");
    const arrow = document.createElementNS(SVG_NS, "path");
    arrow.setAttribute("d", "M0 0 L8 4 L0 8 Z");
    arrow.setAttribute("class", "er-arrow-head");
    marker.append(arrow);
    defs.append(marker);
    elements.links.append(defs);

    currentSchema.relations.forEach((relation) => {
        const source = cardIndex.get(relation.fromTable.toLowerCase());
        const target = cardIndex.get(relation.toTable.toLowerCase());
        if (!source || !target) return;

        const sourceRow = source.columns.get(relation.fromColumn.toLowerCase());
        const targetRow = target.columns.get(relation.toColumn.toLowerCase());
        if (!sourceRow || !targetRow) return;

        const sourceCard = source.element.getBoundingClientRect();
        const targetCard = target.element.getBoundingClientRect();
        const sourceBox = sourceRow.getBoundingClientRect();
        const targetBox = targetRow.getBoundingClientRect();
        const sourceCenterX = sourceCard.left + sourceCard.width / 2;
        const targetCenterX = targetCard.left + targetCard.width / 2;
        const sourceCenterY = sourceCard.top + sourceCard.height / 2;
        const targetCenterY = targetCard.top + targetCard.height / 2;
        const sameColumn =
            Math.abs(targetCenterX - sourceCenterX) <
            Math.min(sourceCard.width, targetCard.width) * 0.55;

        const path = document.createElementNS(SVG_NS, "path");
        let data;

        if (source.element === target.element) {
            const x = sourceCard.right - canvasBox.left;
            const startY = sourceBox.top + sourceBox.height / 2 - canvasBox.top;
            const endY = targetBox.top + targetBox.height / 2 - canvasBox.top;
            const bend = Math.max(42, Math.abs(endY - startY) * 0.6);
            data = `M ${x} ${startY} C ${x + bend} ${startY}, ${x + bend} ${endY}, ${x} ${endY}`;
        } else if (sameColumn) {
            const down = targetCenterY >= sourceCenterY;
            const startX =
                Math.min(Math.max(targetCenterX, sourceCard.left + 18), sourceCard.right - 18) -
                canvasBox.left;
            const endX =
                Math.min(Math.max(sourceCenterX, targetCard.left + 18), targetCard.right - 18) -
                canvasBox.left;
            const startY = (down ? sourceCard.bottom : sourceCard.top) - canvasBox.top;
            const endY = (down ? targetCard.top : targetCard.bottom) - canvasBox.top;
            const direction = down ? 1 : -1;
            const bend = Math.max(18, Math.abs(endY - startY) * 0.35);
            data = `M ${startX} ${startY} C ${startX} ${startY + direction * bend}, ${
                endX
            } ${endY - direction * bend}, ${endX} ${endY}`;
        } else {
            const goesRight = targetCard.left >= sourceCard.left;
            const x1 = (goesRight ? sourceCard.right : sourceCard.left) - canvasBox.left;
            const x2 = (goesRight ? targetCard.left : targetCard.right) - canvasBox.left;
            const y1 = sourceBox.top + sourceBox.height / 2 - canvasBox.top;
            const y2 = targetBox.top + targetBox.height / 2 - canvasBox.top;
            const direction = x2 >= x1 ? 1 : -1;
            const bend = Math.max(26, Math.abs(x2 - x1) * 0.38);
            data = `M ${x1} ${y1} C ${x1 + direction * bend} ${y1}, ${
                x2 - direction * bend
            } ${y2}, ${x2} ${y2}`;
        }

        path.setAttribute("d", data);
        path.setAttribute("class", "er-link");
        path.setAttribute("marker-end", "url(#er-arrow)");
        elements.links.append(path);
    });
}

function scheduleDraw() {
    window.cancelAnimationFrame(drawFrame);
    drawFrame = window.requestAnimationFrame(drawLinks);
}

function renderMap(schema) {
    currentSchema = schema;
    cardIndex = new Map();
    elements.grid.replaceChildren();
    elements.relations.replaceChildren();

    const columns = schema.tables.reduce((total, table) => total + table.columns.length, 0);
    elements.tableCount.textContent = String(schema.tables.length);
    elements.columnCount.textContent = String(columns);
    elements.relationCount.textContent = String(schema.relations.length);
    elements.empty.hidden = schema.tables.length > 0;
    elements.grid.hidden = schema.tables.length === 0;

    schema.tables.forEach((table) => {
        const card = renderTable(table);
        elements.grid.append(card.element);
        cardIndex.set(table.name.toLowerCase(), card);
    });

    renderRelations(schema.relations);
    scheduleDraw();
}

function refreshSchema() {
    if (schemaTimer !== null) {
        window.clearTimeout(schemaTimer);
        schemaTimer = null;
    }
    renderMap(parseSchema(elements.input.value));
}

function scheduleSchema() {
    if (schemaTimer !== null) window.clearTimeout(schemaTimer);
    schemaTimer = window.setTimeout(() => {
        schemaTimer = null;
        renderMap(parseSchema(elements.input.value));
    }, 180);
}

function formatInput() {
    refreshSchema();
    const result = formatSql(elements.input.value);
    setOutput(result.output);

    if (result.output === "") {
        setStatus("Escribe una consulta para formatear.");
        return;
    }

    setStatus(
        `${result.statements} ${result.statements === 1 ? "sentencia formateada" : "sentencias formateadas"}.`
    );
}

function loadSample() {
    elements.input.value = SAMPLE;
    updateInputStats();
    formatInput();
    setStatus("Ejemplo cargado. Edita el SQL y pulsa Formatear.");
}

function clearInput() {
    elements.input.value = "";
    updateInputStats();
    setOutput("");
    refreshSchema();
    setStatus("Editor vacío.");
    elements.input.focus();
}

async function copyOutput() {
    const value = elements.outputCode.textContent;
    if (value === "") return;

    try {
        await navigator.clipboard.writeText(value);
        setStatus("Salida copiada al portapapeles.");
    } catch {
        setStatus("No se pudo copiar. Selecciona la salida manualmente.");
    }
}

elements.input.addEventListener("input", () => {
    updateInputStats();
    if (elements.input.value.trim() === "") setOutput("");
    scheduleSchema();
});

elements.input.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        formatInput();
    }
});

elements.format.addEventListener("click", formatInput);
elements.sample.addEventListener("click", loadSample);
elements.clear.addEventListener("click", clearInput);
elements.copy.addEventListener("click", copyOutput);

const resizeObserver = new ResizeObserver(scheduleDraw);
resizeObserver.observe(elements.canvas);
window.addEventListener("resize", scheduleDraw);

document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
});

loadSample();
