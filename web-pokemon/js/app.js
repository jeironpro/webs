const currentScript = document.currentScript || document.querySelector('script[src$="app.js"]');
const BASE = currentScript
    ? new URL("../", currentScript.src)
    : new URL(location.pathname.replace(/\/(?:generation\/\d+\/?)?$/, "/"), location.origin);
const BASE_PATH = BASE.pathname;
const DATASET_URL = new URL("data/pokemones.json", BASE);
const LOGO_URL = new URL("assets/images/pokemon-logo.png", BASE).href;

const GENERATIONS = [
    { id: 1, name: "primera" },
    { id: 2, name: "segunda" },
    { id: 3, name: "tercera" },
    { id: 4, name: "cuarta" },
    { id: 5, name: "quinta" },
    { id: 6, name: "sexta" },
    { id: 7, name: "septima" },
    { id: 8, name: "octava" },
    { id: 9, name: "novena" },
];

const AVAILABLE_TYPES = [
    "Acero",
    "Agua",
    "Bicho",
    "Dragón",
    "Electrico",
    "Eléctrico",
    "Fantasma",
    "Fuego",
    "Hada",
    "Hielo",
    "Lucha",
    "Normal",
    "Planta",
    "Psíquico",
    "Roca",
    "Siniestro",
    "Tierra",
    "Veneno",
    "Volador",
];

const PER_PAGE = 24;
const STATISTICS = [
    ["PS", "hp", "hp"],
    ["Ataque", "attack", "attack"],
    ["Defensa", "defense", "defense"],
    ["At.Esp", "special_attack", "sp-atk"],
    ["Def.Esp", "special_defense", "sp-def"],
    ["Vel.", "speed", "speed"],
];

const state = {
    generation: 1,
    search: "",
    type: "",
    page: 1,
    total: 0,
    totalPages: 1,
};

const elements = {
    splash: document.getElementById("splash"),
    layout: document.getElementById("layout"),
    content: document.getElementById("content"),
    notFound: document.getElementById("not-found"),
    nav: document.getElementById("nav-generations"),
    overlay: document.getElementById("menu-overlay"),
    hamburger: document.getElementById("hamburger"),
    hamburgerIcon: document.getElementById("hamburger-icon"),
    logo: document.getElementById("home-logo"),
    backHomeLink: document.getElementById("back-home"),
};

let currentView = "home";
let datasetPromise = null;
let requestToken = 0;
let searchTimer = null;
let splashTimer = null;
let menuOpen = false;

function escapeHtml(value) {
    return String(value ?? "").replace(
        /[&<>"']/g,
        (char) =>
            ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;",
            })[char]
    );
}

function formatName(name) {
    let formatted = String(name).replace(/_/g, " ");
    if (formatted.endsWith("-f")) formatted = `${formatted.slice(0, -2)}\u2640`;
    else if (formatted.endsWith("-m")) formatted = `${formatted.slice(0, -2)}\u2642`;
    else if (formatted.endsWith("hd")) formatted = `${formatted.slice(0, -1)}'d`;
    return formatted;
}

function formatId(index) {
    return String(Number(index) + 1).padStart(4, "0");
}

function estrellas(value) {
    return "\u2605".repeat(Math.max(0, Number(value) || 0));
}

function generationUrl(id) {
    return new URL(`generation/${id}`, BASE);
}

function updateNav(generationId) {
    let activeLink = null;

    document.querySelectorAll("[data-generation]").forEach((link) => {
        const active = Number(link.dataset.generation) === Number(generationId);
        link.classList.toggle("active", active);
        if (active) {
            link.setAttribute("aria-current", "page");
            activeLink = link;
        } else {
            link.removeAttribute("aria-current");
        }
    });

    revealActiveLink(activeLink);
}

/* Cuando la barra de generaciones se desplaza horizontalmente, la generación
   activa debe quedar a la vista sin que el usuario tenga que arrastrarla. */
function revealActiveLink(link) {
    const nav = elements.nav;
    if (!link || !nav || nav.scrollWidth <= nav.clientWidth) return;

    const linkBox = link.getBoundingClientRect();
    const navBox = nav.getBoundingClientRect();

    if (linkBox.left < navBox.left) {
        nav.scrollLeft -= navBox.left - linkBox.left;
    } else if (linkBox.right > navBox.right) {
        nav.scrollLeft += linkBox.right - navBox.right;
    }
}

function closeMenu() {
    menuOpen = false;
    elements.nav.classList.remove("open");
    elements.overlay.classList.add("hidden");
    elements.hamburgerIcon.textContent = "menu";
    elements.hamburger.setAttribute("aria-expanded", "false");
}

function toggleMenu() {
    menuOpen = !menuOpen;
    elements.nav.classList.toggle("open", menuOpen);
    elements.overlay.classList.toggle("hidden", !menuOpen);
    elements.hamburgerIcon.textContent = menuOpen ? "close" : "menu";
    elements.hamburger.setAttribute("aria-expanded", String(menuOpen));
}

function clearSplash() {
    if (splashTimer !== null) {
        window.clearTimeout(splashTimer);
        splashTimer = null;
    }
}

function scheduleSplash() {
    clearSplash();
    splashTimer = window.setTimeout(() => {
        if (currentView === "home") navigate("generation/1");
    }, 5000);
}

function showSplash() {
    currentView = "home";
    clearSplash();
    requestToken += 1;
    closeMenu();
    updateNav(null);
    elements.layout.classList.add("hidden");
    elements.notFound.classList.add("hidden");
    elements.splash.classList.remove("hidden");
    elements.content.innerHTML = "";
    document.title = "Pokémon";
    scheduleSplash();
}

function showLayout() {
    elements.splash.classList.add("hidden");
    elements.layout.classList.remove("hidden");
    elements.notFound.classList.add("hidden");
}

function show404() {
    currentView = "404";
    clearSplash();
    requestToken += 1;
    closeMenu();
    updateNav(null);
    elements.splash.classList.add("hidden");
    elements.layout.classList.add("hidden");
    elements.notFound.classList.remove("hidden");
    elements.content.innerHTML = "";
    document.title = "Página no encontrada · Pokémon";
}

function navigate(path) {
    const url = path ? generationUrl(path.split("/").pop()) : new URL(BASE);
    window.history.pushState(null, "", url.pathname);
    if (!path) showSplash();
    else showGeneration(Number(path.split("/").pop()));
}

function currentRoute() {
    const base = BASE_PATH.endsWith("/") ? BASE_PATH : `${BASE_PATH}/`;
    let path = decodeURIComponent(window.location.pathname);

    if (path === base.replace(/\/$/, "")) path = "";
    else if (path.startsWith(base)) path = path.slice(base.length);

    path = path.replace(/^\/+|\/+$/g, "");

    if (path === "" || path === "index.html") return { view: "home" };

    const generation = path.match(/^generation\/(\d+)$/);
    if (generation) return { view: "generation", id: Number(generation[1]) };

    const query = window.location.search.match(/^\?\/(generation\/(\d+))(?:\/|&|$)/);
    if (query) {
        window.history.replaceState(null, "", `${base}${query[1]}`);
        return { view: "generation", id: Number(query[2]) };
    }

    return { view: "404" };
}

function route() {
    const path = currentRoute();
    if (path.view === "home") showSplash();
    else if (path.view === "generation") showGeneration(path.id);
    else show404();
}

async function loadDataset() {
    if (!datasetPromise) {
        datasetPromise = fetch(DATASET_URL)
            .then((response) => {
                if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
                return response.json();
            })
            .then(({ data }) =>
                data.map((pokemon) => ({
                    ...pokemon,
                    image_url: new URL(
                        `assets/images/pokemon${pokemon.image_url.replace(/^\/pokemon-images/, "")}`,
                        BASE
                    ).href,
                }))
            )
            .catch((error) => {
                datasetPromise = null;
                throw error;
            });
    }
    return datasetPromise;
}

function filterPokemon(data) {
    let list = data.filter((pokemon) => pokemon.generation === state.generation);
    if (state.search) {
        const term = state.search.toLowerCase().trim();
        list = list.filter((pokemon) => pokemon.name.toLowerCase().includes(term));
    }
    if (state.type) {
        list = list.filter((pokemon) =>
            pokemon.types?.some((type) => type.name?.toLowerCase() === state.type.toLowerCase())
        );
    }
    return list;
}

function skeletonHTML() {
    return `<div class="skeleton-grid">${Array.from(
        { length: 6 },
        () => `<div class="skeleton-card">
            <div class="skeleton-image"></div>
            <div class="skeleton-content">
                <div class="skeleton-line short"></div>
                <div class="skeleton-line medium"></div>
                <div class="skeleton-line"></div>
                <div class="skeleton-line short"></div>
            </div>
        </div>`
    ).join("")}</div>`;
}

function statsHTML(stats) {
    if (!stats) return "";
    return STATISTICS.map(([label, key, className]) => {
        const value = Number(stats[key]) || 0;
        return `<div class="stat ${className}">
            <span class="stat-label">${label}</span>
            <span class="stat-stars">${estrellas(value)}</span>
            <span class="stat-value">${value}</span>
        </div>`;
    }).join("");
}

function cardHTML(pokemon, delay) {
    const name = formatName(pokemon.name);
    const typeColor = pokemon.types?.[0]?.color || "#f0f0f0";
    const types = (pokemon.types || [])
        .map(
            (type) =>
                `<span class="type-badge" style="background-color:${escapeHtml(
                    type.color || "#666"
                )}">${escapeHtml(type.name)}</span>`
        )
        .join("");

    return `<article class="card" style="animation-delay:${delay}ms;background:linear-gradient(135deg, ${typeColor}22 0%, ${typeColor}11 100%)">
        <div class="card-image">
            ${
                pokemon.image_url
                    ? `<img src="${escapeHtml(pokemon.image_url)}" alt="${escapeHtml(
                          name
                      )}" loading="lazy" />`
                    : '<div style="color:#999;font-size:14px">Sin imagen</div>'
            }
        </div>
        <div class="card-content">
            <div class="card-header">
                <h3 class="card-name">${escapeHtml(name)}</h3>
                <span class="card-id">N.\u00A0${formatId(pokemon.global_index)}</span>
            </div>
            <div class="card-types">${types}</div>
            <p class="card-description">${escapeHtml(pokemon.description)}</p>
            <div class="card-stats">${statsHTML(pokemon.stats)}</div>
        </div>
    </article>`;
}

function paginationHTML() {
    return `<div class="pagination">
        <button class="generation-btn" data-page="anterior" ${
            state.page <= 1 ? "disabled" : ""
        } aria-label="Página anterior">
            <span class="material-icons">chevron_left</span>
        </button>
        <span class="pagination-info">${state.page} de ${state.totalPages} (${state.total} pokemon)</span>
        <button class="generation-btn" data-page="siguiente" ${
            state.page >= state.totalPages ? "disabled" : ""
        } aria-label="Página siguiente">
            <span class="material-icons">chevron_right</span>
        </button>
    </div>`;
}

function renderResults(list) {
    const total = list.length;
    state.total = total;
    state.totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
    state.page = Math.min(state.page, state.totalPages) || 1;

    const inicio = (state.page - 1) * PER_PAGE;
    const page = list.slice(inicio, inicio + PER_PAGE);
    const results = document.getElementById("results");
    if (!results) return;

    if (page.length === 0) {
        results.innerHTML = '<p class="no-results">No se encontraron pokemon con esos filtros.</p>';
        return;
    }

    results.innerHTML = `<div class="cards-container">${page
        .map((pokemon, index) => cardHTML(pokemon, (index % 20) * 40))
        .join("")}</div>${state.totalPages > 1 ? paginationHTML() : ""}`;
}

async function loadResults() {
    const results = document.getElementById("results");
    if (!results) return;
    const token = ++requestToken;
    results.innerHTML = skeletonHTML();

    try {
        const data = await loadDataset();
        if (token !== requestToken) return;
        renderResults(filterPokemon(data));
    } catch (error) {
        if (token !== requestToken) return;
        results.innerHTML = `<div class="generation-content"><h2>Error</h2><p>${escapeHtml(
            error.message
        )}</p></div>`;
    }
}

function scheduleLoad(delay) {
    if (searchTimer !== null) window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(loadResults, delay);
}

function typeOptionsHTML() {
    return AVAILABLE_TYPES.map(
        (type) => `<option value="${escapeHtml(type)}">${escapeHtml(type)}</option>`
    ).join("");
}

function showGeneration(id) {
    currentView = "generation";
    clearSplash();
    closeMenu();
    showLayout();
    updateNav(id);

    state.generation = id;
    state.search = "";
    state.type = "";
    state.page = 1;
    state.total = 0;
    state.totalPages = 1;

    const generation = GENERATIONS.find((item) => item.id === id);
    if (!generation) {
        document.title = "Generación no válida · Pokémon";
        elements.content.innerHTML = `<div class="generation-content">
            <h2>Generacion no valida</h2>
            <p>Selecciona una generacion del menu de navegacion.</p>
        </div>`;
        return;
    }

    document.title = `Pokémon · ${generation.name} generación`;
    const progress = (id / GENERATIONS.length) * 100;
    elements.content.innerHTML = `<div class="generation-content">
        <div class="generation-navigation">
            <button class="generation-btn" id="btn-gen-previous" ${id <= 1 ? "disabled" : ""}>
                <span class="material-icons">arrow_back</span>
                <span>Anterior</span>
            </button>
            <div class="generation-progress">
                <span>Generacion ${id} de ${GENERATIONS.length}</span>
                <div class="generation-bar">
                    <div class="generation-bar-inner" style="width:${progress}%"></div>
                </div>
            </div>
            <button class="generation-btn" id="btn-gen-next" ${
                id >= GENERATIONS.length ? "disabled" : ""
            }>
                <span>Siguiente</span>
                <span class="material-icons">arrow_forward</span>
            </button>
        </div>

        <h2>Pokemon de ${escapeHtml(generation.name)} generacion</h2>

        <div class="filters">
            <input class="search-input" id="search" type="text" placeholder="Buscar pokemon..." />
            <select class="type-filter" id="type-filter">
                <option value="">Todos los tipos</option>
                ${typeOptionsHTML()}
            </select>
        </div>

        <div id="results">${skeletonHTML()}</div>
    </div>`;

    document.getElementById("btn-gen-previous").addEventListener("click", () => {
        if (id > 1) navigate(`generation/${id - 1}`);
    });
    document.getElementById("btn-gen-next").addEventListener("click", () => {
        if (id < GENERATIONS.length) navigate(`generation/${id + 1}`);
    });
    document.getElementById("search").addEventListener("input", (event) => {
        state.search = event.target.value;
        state.page = 1;
        scheduleLoad(event.target.value ? 300 : 0);
    });
    document.getElementById("type-filter").addEventListener("change", (event) => {
        state.type = event.target.value;
        state.page = 1;
        loadResults();
    });
    document.getElementById("results").addEventListener("click", (event) => {
        const button = event.target.closest("[data-page]");
        if (!button) return;
        if (button.dataset.page === "anterior" && state.page > 1) {
            state.page -= 1;
            loadResults();
        }
        if (button.dataset.page === "siguiente" && state.page < state.totalPages) {
            state.page += 1;
            loadResults();
        }
    });

    loadResults();
}

function setupLinks() {
    document.querySelectorAll("[data-logo]").forEach((image) => {
        image.src = LOGO_URL;
    });
    document.querySelectorAll("[data-generation]").forEach((link) => {
        link.href = generationUrl(link.dataset.generation).pathname;
        link.addEventListener("click", (event) => {
            event.preventDefault();
            navigate(`generation/${link.dataset.generation}`);
        });
    });
    elements.logo.href = BASE_PATH;
    elements.logo.addEventListener("click", (event) => {
        event.preventDefault();
        window.history.pushState(null, "", BASE_PATH);
        showSplash();
    });
    elements.backHomeLink.href = BASE_PATH;
    elements.backHomeLink.addEventListener("click", (event) => {
        event.preventDefault();
        window.history.pushState(null, "", BASE_PATH);
        showSplash();
    });
    elements.hamburger.addEventListener("click", toggleMenu);
    elements.overlay.addEventListener("click", closeMenu);
    window.addEventListener("popstate", route);
}

setupLinks();
route();
