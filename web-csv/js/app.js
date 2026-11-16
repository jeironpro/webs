import { filterRows, paginateRows, parseCsv, sortRows, toCsv } from "./modules/csv.js";

const SAMPLE = `id,nombre,equipo,ciudad,proyectos,horas,estado,ultima_entrega
1,"Ana Torres",Producto,"Madrid, ES",7,32.5,Activo,2026-09-12
2,"Luis Gómez",Datos,Barcelona,4,28,Activo,2026-10-02
3,"Marta Ruiz",Producto,Valencia,9,41.25,Activo,2026-10-18
4,"Diego Salas",Ingeniería,"Sevilla, ES",3,19.75,Pausado,2026-08-30
5,"Elena Vidal",Diseño,Bilbao,6,34,Activo,2026-10-21
6,"Pablo Marín",Datos,"Madrid, ES",5,26.5,Activo,2026-09-29
7,"Sofía Navarro",Producto,Alicante,8,39,Activo,2026-10-10
8,"Hugo Pérez",Ingeniería,Valencia,2,15.5,Pausado,2026-07-14
9,"Clara Soto",Diseño,"Málaga, ES",4,22.75,Activo,2026-10-05
10,"Iván Castro",Datos,Zaragoza,6,30.25,Activo,2026-10-19
11,"Noa Gil",Producto,"Madrid, ES",5,27,Activo,2026-09-22
12,"Bruno León",Ingeniería,Bilbao,1,11.5,Baja,2026-06-08`;

const MAX_FILE_SIZE = 8 * 1024 * 1024;
const DELIMITERS = { ",": "coma", ";": "punto y coma", "\t": "tabulador" };

const $ = (id) => document.getElementById(id);

const elements = {
    fileInput: $("file-input"),
    sample: $("sample"),
    sampleEmpty: $("sample-empty"),
    reset: $("reset"),
    export: $("export"),
    clearFilters: $("clear-filters"),
    globalSearch: $("global-search"),
    filterList: $("filter-list"),
    sheetTitle: $("sheet-title"),
    fileMeta: $("file-meta"),
    feedback: $("feedback"),
    dropzone: $("dropzone"),
    tableArea: $("table-area"),
    tableScroll: $("table-scroll"),
    tableCaption: $("table-caption"),
    tableHead: $("table-head"),
    tableBody: $("table-body"),
    resultSummary: $("result-summary"),
    pageInfo: $("page-info"),
    prevPage: $("prev-page"),
    nextPage: $("next-page"),
    pageSize: $("page-size"),
    status: $("status"),
};

const state = {
    headers: [],
    rows: [],
    delimiter: ",",
    sourceName: "",
    query: "",
    filters: [],
    sort: { column: null, direction: "asc" },
    page: 1,
    pageSize: 25,
};

function makeElement(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
}

function setStatus(message) {
    elements.status.textContent = message;
}

function showError(message) {
    elements.feedback.textContent = message;
    elements.feedback.hidden = false;
}

function clearError() {
    elements.feedback.textContent = "";
    elements.feedback.hidden = true;
}

function hasData() {
    return state.headers.length > 0;
}

function delimiterLabel(delimiter) {
    return DELIMITERS[delimiter] ?? "coma";
}

function isNumeric(value) {
    return /^-?\d+(?:\.\d+)?$/.test(String(value).trim());
}

function visibleRows() {
    const filtered = filterRows(state.rows, state.headers, {
        query: state.query,
        filters: state.filters,
    });
    if (state.sort.column === null) return filtered;
    return sortRows(filtered, state.sort.column, state.sort.direction);
}

function renderFilterInputs() {
    elements.filterList.replaceChildren();

    if (!hasData()) {
        elements.filterList.append(
            makeElement("p", "filter-list__empty", "Abre un CSV para filtrar por cada columna.")
        );
        elements.globalSearch.disabled = true;
        elements.clearFilters.disabled = true;
        return;
    }

    elements.globalSearch.disabled = false;
    state.headers.forEach((header, index) => {
        const label = makeElement("label", "filter-field");
        const name = makeElement("span", "", header);
        const input = document.createElement("input");
        input.type = "search";
        input.value = state.filters[index] ?? "";
        input.placeholder = "Filtrar…";
        input.autocomplete = "off";
        input.spellcheck = false;
        input.setAttribute("aria-label", `Filtrar por ${header}`);
        input.addEventListener("input", () => {
            state.filters[index] = input.value;
            state.page = 1;
            render();
        });
        label.append(name, input);
        elements.filterList.append(label);
    });
}

function updateFilterState() {
    const active =
        state.filters.filter((value) => value.trim() !== "").length +
        (state.query.trim() === "" ? 0 : 1);
    elements.clearFilters.disabled = active === 0;
}

function renderHead() {
    const row = document.createElement("tr");
    elements.tableHead.replaceChildren();

    state.headers.forEach((header, index) => {
        const th = document.createElement("th");
        th.scope = "col";
        th.setAttribute(
            "aria-sort",
            state.sort.column === index
                ? state.sort.direction === "asc"
                    ? "ascending"
                    : "descending"
                : "none"
        );

        const button = makeElement("button", "sort-button");
        button.type = "button";
        button.dataset.column = String(index);
        button.append(
            makeElement("span", "", header),
            makeElement(
                "span",
                "sort-mark",
                state.sort.column === index ? (state.sort.direction === "asc" ? "↑" : "↓") : "↕"
            )
        );
        button.querySelector(".sort-mark").setAttribute("aria-hidden", "true");
        button.addEventListener("click", () => {
            if (state.sort.column === index) {
                state.sort.direction = state.sort.direction === "asc" ? "desc" : "asc";
            } else {
                state.sort = { column: index, direction: "asc" };
            }
            state.page = 1;
            render();
            elements.tableHead.querySelector(`button[data-column="${index}"]`)?.focus();
        });

        th.append(button);
        row.append(th);
    });

    elements.tableHead.append(row);
}

function renderBody(rows) {
    elements.tableBody.replaceChildren();

    if (rows.length === 0) {
        const row = document.createElement("tr");
        const cell = makeElement(
            "td",
            "empty-table",
            "No hay filas que coincidan con los filtros."
        );
        cell.colSpan = state.headers.length;
        row.append(cell);
        elements.tableBody.append(row);
        return;
    }

    const fragment = document.createDocumentFragment();
    rows.forEach((values) => {
        const row = document.createElement("tr");
        values.forEach((value) => {
            const cell = makeElement("td", "", value);
            if (isNumeric(value)) cell.classList.add("is-number");
            if (String(value).length > 32) cell.title = value;
            row.append(cell);
        });
        fragment.append(row);
    });
    elements.tableBody.append(fragment);
}

function updatePagination(page) {
    elements.pageInfo.textContent = `Página ${page.page} de ${page.totalPages}`;
    elements.prevPage.disabled = page.page <= 1;
    elements.nextPage.disabled = page.page >= page.totalPages;
}

function render() {
    if (!hasData()) return;

    const filtered = filterRows(state.rows, state.headers, {
        query: state.query,
        filters: state.filters,
    });
    const sorted =
        state.sort.column === null
            ? filtered
            : sortRows(filtered, state.sort.column, state.sort.direction);
    const page = paginateRows(sorted, state.page, state.pageSize);
    state.page = page.page;

    renderHead();
    renderBody(page.rows);
    updatePagination(page);
    updateFilterState();

    elements.resultSummary.textContent = `${filtered.length} de ${
        state.rows.length
    } filas · ${state.headers.length} columnas · ${delimiterLabel(state.delimiter)}`;
    elements.fileMeta.textContent = `${state.rows.length} filas · ${
        state.headers.length
    } columnas · ${delimiterLabel(state.delimiter)}`;
    elements.export.disabled = filtered.length === 0;
}

function showEmptyState() {
    state.headers = [];
    state.rows = [];
    state.delimiter = ",";
    state.sourceName = "";
    state.query = "";
    state.filters = [];
    state.sort = { column: null, direction: "asc" };
    state.page = 1;
    elements.sheetTitle.textContent = "Sin datos";
    elements.fileMeta.textContent = "Abre un CSV para empezar.";
    elements.tableCaption.textContent = "Vista previa del CSV";
    elements.resultSummary.textContent = "0 filas";
    elements.pageInfo.textContent = "Página 0 de 0";
    elements.prevPage.disabled = true;
    elements.nextPage.disabled = true;
    elements.export.disabled = true;
    elements.dropzone.hidden = false;
    elements.tableScroll.hidden = true;
    elements.tableHead.replaceChildren();
    elements.tableBody.replaceChildren();
    elements.globalSearch.value = "";
    elements.globalSearch.disabled = true;
    elements.clearFilters.disabled = true;
    elements.filterList.replaceChildren(
        makeElement("p", "filter-list__empty", "Abre un CSV para filtrar por cada columna.")
    );
    setStatus("");
}

function loadParsed(parsed, name) {
    state.headers = parsed.headers;
    state.rows = parsed.rows;
    state.delimiter = parsed.delimiter;
    state.sourceName = name;
    state.query = "";
    state.filters = parsed.headers.map(() => "");
    state.sort = { column: null, direction: "asc" };
    state.page = 1;

    elements.globalSearch.value = "";
    elements.sheetTitle.textContent = name;
    elements.tableCaption.textContent = `Vista previa de ${name}`;
    elements.dropzone.hidden = true;
    elements.tableScroll.hidden = false;
    clearError();
    renderFilterInputs();
    render();
    setStatus(
        `${parsed.rows.length} filas cargadas desde ${name}.${
            parsed.warning ? ` ${parsed.warning}` : ""
        }`
    );
}

function loadText(text, name) {
    const parsed = parseCsv(text);
    if (!parsed.ok) {
        showError(parsed.error);
        return false;
    }
    loadParsed(parsed, name);
    return true;
}

async function loadFile(file) {
    clearError();

    if (file.size > MAX_FILE_SIZE) {
        showError("El archivo supera el límite de 8 MB.");
        return;
    }

    try {
        const text = await file.text();
        loadText(text, file.name);
    } catch {
        showError("No se pudo leer el archivo. Prueba con otro CSV.");
    }
}

function clearFilters() {
    state.query = "";
    state.filters = state.headers.map(() => "");
    state.page = 1;
    elements.globalSearch.value = "";
    renderFilterInputs();
    render();
    setStatus("Filtros limpiados.");
}

function exportView() {
    if (!hasData()) return;
    const rows = visibleRows();
    if (rows.length === 0) {
        setStatus("No hay filas para exportar.");
        return;
    }

    const csv = toCsv(state.headers, rows, ",");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const base =
        state.sourceName
            .replace(/\.[^.]+$/, "")
            .replace(/[\\/:*?"<>|]+/g, "-")
            .replace(/\s+/g, "-")
            .replace(/^-+|-+$/g, "") || "datos";
    const link = document.createElement("a");
    link.href = url;
    link.download = `${base}-filtrado.csv`;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus(`CSV exportado con ${rows.length} ${rows.length === 1 ? "fila" : "filas"}.`);
}

elements.fileInput.addEventListener("change", () => {
    const file = elements.fileInput.files?.[0];
    if (file) loadFile(file);
    elements.fileInput.value = "";
});

[elements.sample, elements.sampleEmpty].forEach((button) => {
    button.addEventListener("click", () => {
        loadText(SAMPLE, "equipo.csv");
    });
});

elements.globalSearch.addEventListener("input", () => {
    state.query = elements.globalSearch.value;
    state.page = 1;
    render();
});

elements.clearFilters.addEventListener("click", clearFilters);
elements.export.addEventListener("click", exportView);
elements.reset.addEventListener("click", () => {
    showEmptyState();
    clearError();
    setStatus("Visor vacío. Abre un CSV para empezar.");
    elements.sampleEmpty.focus();
});

elements.prevPage.addEventListener("click", () => {
    if (state.page <= 1) return;
    state.page -= 1;
    render();
});

elements.nextPage.addEventListener("click", () => {
    const filtered = filterRows(state.rows, state.headers, {
        query: state.query,
        filters: state.filters,
    });
    const totalPages = Math.max(1, Math.ceil(filtered.length / state.pageSize));
    if (state.page >= totalPages) return;
    state.page += 1;
    render();
});

elements.pageSize.addEventListener("change", () => {
    state.pageSize = Number(elements.pageSize.value) || 25;
    state.page = 1;
    render();
});

elements.tableArea.addEventListener("dragover", (event) => {
    event.preventDefault();
    elements.tableArea.classList.add("is-dragging");
});

elements.tableArea.addEventListener("dragleave", () => {
    elements.tableArea.classList.remove("is-dragging");
});

elements.tableArea.addEventListener("drop", (event) => {
    event.preventDefault();
    elements.tableArea.classList.remove("is-dragging");
    const file = event.dataTransfer?.files?.[0];
    if (file) loadFile(file);
});

document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
});

if (loadText(SAMPLE, "equipo-ejemplo.csv")) {
    setStatus("Ejemplo cargado. Abre tu CSV o ajusta los filtros.");
} else {
    showEmptyState();
}
