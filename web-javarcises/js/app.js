import { paginate } from "./pagination.js";
import { createIcon, renderCard, renderPagination, renderDetail, renderEmpty } from "./render.js";

const appElement = document.querySelector("#app");
const statsElement = document.querySelector("#stats");
const resultsElement = document.createElement("div");
resultsElement.id = "results";
let catalog = null;

const state = {
    collection: "exercises", // clave de la colección activa
    page: 1,
    level: "all", // número de nivel o "all"
    query: "",
};

function getCollections() {
    return catalog.collections;
}

function getCollection(key) {
    return (
        catalog.collections.find((collection) => collection.key === key) ?? catalog.collections[0]
    );
}

async function loadCatalog() {
    const response = await fetch("./data/exercises.json");
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
}

function levelsOfCollection(collection) {
    const levels = [];
    for (const item of collection.items) {
        if (!levels.some((level) => level.number === item.level)) {
            levels.push({ number: item.level, name: item.levelName });
        }
    }
    return levels.sort((a, b) => a.number - b.number);
}

function filterItems(collection) {
    const query = state.query.trim().toLowerCase();
    return collection.items.filter((item) => {
        if (state.level !== "all" && item.level !== Number(state.level)) {
            return false;
        }
        if (query === "") {
            return true;
        }
        const fields = [item.title, item.levelName, item.category ?? "", ...item.topics];
        return fields.some((field) => field.toLowerCase().includes(query));
    });
}

function renderFilterBar() {
    const collection = getCollection(state.collection);

    const bar = document.createElement("div");
    bar.className = "filter-bar";

    const tabs = document.createElement("div");
    tabs.className = "tabs";
    tabs.setAttribute("role", "group");
    tabs.setAttribute("aria-label", "Elegir colección de ejercicios");
    for (const candidate of getCollections()) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "tab";
        button.dataset.collection = candidate.key;
        const active = candidate.key === state.collection;
        button.append(
            createIcon(candidate.key === "exercises" ? "code" : "design_services"),
            document.createTextNode(candidate.name)
        );
        button.setAttribute("aria-pressed", String(active));
        if (active) {
            button.classList.add("tab--active");
        }
        tabs.append(button);
    }
    bar.append(tabs);

    const levelField = document.createElement("div");
    levelField.className = "field";
    const levelLabel = document.createElement("label");
    levelLabel.htmlFor = "level-filter";
    levelLabel.textContent = "Nivel";
    const select = document.createElement("select");
    select.id = "level-filter";
    const allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = "Todos los niveles";
    select.append(allOption);
    for (const level of levelsOfCollection(collection)) {
        const option = document.createElement("option");
        option.value = String(level.number);
        option.textContent = `${level.number} — ${level.name}`;
        select.append(option);
    }
    select.value = state.level === "all" ? "all" : String(state.level);
    select.addEventListener("change", () => {
        state.level = select.value === "all" ? "all" : Number(select.value);
        state.page = 1;
        renderResults();
    });
    levelField.append(levelLabel, select);
    bar.append(levelField);

    const searchField = document.createElement("div");
    searchField.className = "field field--search";
    const searchLabel = document.createElement("label");
    searchLabel.htmlFor = "search";
    searchLabel.textContent = "Buscar";
    const inputWrap = document.createElement("div");
    inputWrap.className = "field__control";
    inputWrap.append(createIcon("search"));
    const input = document.createElement("input");
    input.type = "search";
    input.id = "search";
    input.placeholder = "Título, tema, nivel…";
    input.value = state.query;
    input.addEventListener("input", () => {
        state.query = input.value;
        state.page = 1;
        renderResults();
    });
    inputWrap.append(input);
    searchField.append(searchLabel, inputWrap);
    bar.append(searchField);

    return bar;
}

function renderResults() {
    const collection = getCollection(state.collection);
    const filtered = filterItems(collection);
    const result = paginate(filtered, state.page);
    state.page = result.page;

    const container = document.createElement("div");

    const counter = document.createElement("p");
    counter.className = "counter";
    counter.setAttribute("aria-live", "polite");
    counter.textContent =
        filtered.length === 0
            ? "0 fichas"
            : `Mostrando ${result.from}–${result.to} de ${result.total} fichas`;
    container.append(counter);

    if (filtered.length === 0) {
        container.append(
            renderEmpty({
                message:
                    "Ninguna ficha coincide con los filtros actuales. Prueba con otro término o borra los filtros.",
                action: { label: "Limpiar filtros", onClick: clearFilters },
            })
        );
    } else {
        const cardGrid = document.createElement("div");
        cardGrid.className = "exercise-grid";
        for (const item of result.items) {
            cardGrid.append(renderCard(item));
        }
        container.append(cardGrid);

        if (result.totalPages > 1) {
            container.append(
                renderPagination({
                    page: result.page,
                    totalPages: result.totalPages,
                    onGoToPage: (page) => {
                        state.page = page;
                        renderResults();
                        window.scrollTo(0, 0);
                    },
                })
            );
        }
    }

    resultsElement.replaceChildren(container);
}

function clearFilters() {
    state.level = "all";
    state.query = "";
    renderListView();
}

function renderListView() {
    appElement.replaceChildren(renderFilterBar(), resultsElement);
    renderResults();
    document.title = "Javarcises — Ejercicios de programación en Java";
}

function renderDetailView(route) {
    const collection = getCollection(route.collection);
    const index = collection.items.findIndex((item) => item.number === route.number);

    if (index === -1) {
        document.title = "Ficha no encontrada — Javarcises";
        appElement.replaceChildren(
            renderEmpty({
                icon: "error",
                title: "Ficha no encontrada",
                message: "El número de ficha no existe en esta colección.",
                action: { label: "Volver al listado", href: "#/" },
            })
        );
        return;
    }

    const item = collection.items[index];
    const previous = collection.items[index - 1] ?? null;
    const next = collection.items[index + 1] ?? null;
    appElement.replaceChildren(renderDetail(item, collection, previous, next));
    document.title = `${item.title} — Javarcises`;

    const detailTitle = document.querySelector("#detail-title");
    if (detailTitle && document.activeElement !== detailTitle) {
        detailTitle.focus({ preventScroll: true });
    }
}

function parseRoute() {
    const match = location.hash.match(/^#\/card\/(exercises|problems)\/(\d+)$/);
    if (match) {
        return { view: "detail", collection: match[1], number: Number(match[2]) };
    }
    return { view: "list" };
}

function render() {
    const route = parseRoute();
    document.body.classList.toggle("detail-mode", route.view === "detail");
    if (route.view === "detail") {
        renderDetailView(route);
    } else {
        renderListView();
    }
}

function renderStats() {
    const grid = document.createElement("div");
    grid.className = "stats__grid";

    const addStat = (label, value) => {
        const stat = document.createElement("div");
        stat.className = "stat";
        const labelElement = document.createElement("p");
        labelElement.className = "stat__label";
        labelElement.textContent = label;
        const valueElement = document.createElement("p");
        valueElement.className = "stat__value";
        const number = document.createElement("span");
        number.className = "stat__num";
        number.textContent = value;
        valueElement.append(number);
        stat.append(labelElement, valueElement);
        grid.append(stat);
    };

    for (const collection of getCollections()) {
        addStat(collection.name, String(collection.items.length));
    }

    const levels = new Set();
    for (const collection of getCollections()) {
        for (const item of collection.items) {
            levels.add(item.level);
        }
    }
    addStat("Niveles de dificultad", String(levels.size));

    statsElement.replaceChildren(grid);
}

function selectCollection(key) {
    if (state.collection === key) {
        return;
    }
    state.collection = key;
    state.page = 1;
    state.level = "all";
    renderListView();
    syncCollectionControls();
}

function syncCollectionControls() {
    for (const button of document.querySelectorAll("[data-collection]")) {
        const active = button.dataset.collection === state.collection;
        button.setAttribute("aria-pressed", String(active));
        button.classList.toggle("tab--active", active);
        button.classList.toggle("nav__link--active", active);
    }
}

async function init() {
    catalog = await loadCatalog();
    renderStats();
    syncCollectionControls();

    document.addEventListener("click", (event) => {
        const button = event.target.closest("[data-collection]");
        if (!button) {
            return;
        }
        selectCollection(button.dataset.collection);
        if (button.dataset.scrollTo) {
            const target = document.querySelector(`#${button.dataset.scrollTo}`);
            const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            target?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
        }
    });

    window.addEventListener("hashchange", render);
    render();
}

init().catch(() => {
    statsElement.replaceChildren();
    appElement.replaceChildren(
        renderEmpty({
            icon: "error",
            title: "No se pudo cargar el catálogo",
            message: "Comprueba la conexión y vuelve a intentarlo.",
            action: { label: "Reintentar", onClick: () => location.reload() },
        })
    );
});
