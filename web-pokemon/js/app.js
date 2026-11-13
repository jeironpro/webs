const BASE = new URL("../", import.meta.url);
const BASE_PATH = BASE.pathname;
const DATASET_URL = new URL("data/pokemones.json", BASE);
const LOGO_URL = new URL("assets/images/pokemon-logo.png", BASE).href;
const GA_ID = "G-ZTPH1017ZF";

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

const TYPES = [
    { name: "Acero", slug: "acero" },
    { name: "Agua", slug: "agua" },
    { name: "Bicho", slug: "bicho" },
    { name: "Dragón", slug: "dragon" },
    { name: "Eléctrico", slug: "electrico" },
    { name: "Fantasma", slug: "fantasma" },
    { name: "Fuego", slug: "fuego" },
    { name: "Hada", slug: "hada" },
    { name: "Hielo", slug: "hielo" },
    { name: "Lucha", slug: "lucha" },
    { name: "Normal", slug: "normal" },
    { name: "Planta", slug: "planta" },
    { name: "Psíquico", slug: "psiquico" },
    { name: "Roca", slug: "roca" },
    { name: "Siniestro", slug: "siniestro" },
    { name: "Tierra", slug: "tierra" },
    { name: "Veneno", slug: "veneno" },
    { name: "Volador", slug: "volador" },
];

const TYPE_SLUGS = {
    Acero: "acero",
    Agua: "agua",
    Bicho: "bicho",
    Dragón: "dragon",
    Electrico: "electrico",
    Eléctrico: "electrico",
    Fantasma: "fantasma",
    Fuego: "fuego",
    Hada: "hada",
    Hielo: "hielo",
    Lucha: "lucha",
    Normal: "normal",
    Planta: "planta",
    Psíquico: "psiquico",
    Roca: "roca",
    Siniestro: "siniestro",
    Tierra: "tierra",
    Veneno: "veneno",
    Volador: "volador",
};

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

const createElement = (tag, className = "", content = "") => {
    const element = document.createElement(tag);
    if (className) {
        element.className = className;
    }
    if (content) {
        element.textContent = content;
    }
    return element;
};

const formatName = (name) => {
    let formatted = String(name).replace(/_/g, " ");
    if (formatted.endsWith("-f")) {
        formatted = `${formatted.slice(0, -2)}\u2640`;
    } else if (formatted.endsWith("-m")) {
        formatted = `${formatted.slice(0, -2)}\u2642`;
    } else if (formatted.endsWith("hd")) {
        formatted = `${formatted.slice(0, -1)}'d`;
    }
    return formatted;
};

const formatId = (index) => String(Number(index) + 1).padStart(4, "0");

const estrellas = (value) => "\u2605".repeat(Math.max(0, Number(value) || 0));

const typeSlug = (name) => TYPE_SLUGS[name] || "normal";

const generationUrl = (id) => new URL(`generation/${id}`, BASE);

const updateNav = (generationId) => {
    let activeLink = null;

    document.querySelectorAll("[data-generation]").forEach((link) => {
        const active = Number(link.dataset.generation) === Number(generationId);
        link.classList.toggle("is-active", active);
        if (active) {
            link.setAttribute("aria-current", "page");
            activeLink = link;
        } else {
            link.removeAttribute("aria-current");
        }
    });

    revealActiveLink(activeLink);
};

const revealActiveLink = (link) => {
    const nav = elements.nav;
    if (!link || !nav || nav.scrollWidth <= nav.clientWidth) {
        return;
    }

    const linkBox = link.getBoundingClientRect();
    const navBox = nav.getBoundingClientRect();

    if (linkBox.left < navBox.left) {
        nav.scrollLeft -= navBox.left - linkBox.left;
    } else if (linkBox.right > navBox.right) {
        nav.scrollLeft += linkBox.right - navBox.right;
    }
};

const closeMenu = () => {
    menuOpen = false;
    elements.nav.classList.remove("is-open");
    elements.overlay.classList.add("is-hidden");
    elements.hamburgerIcon.textContent = "menu";
    elements.hamburger.setAttribute("aria-expanded", "false");
};

const toggleMenu = () => {
    menuOpen = !menuOpen;
    elements.nav.classList.toggle("is-open", menuOpen);
    elements.overlay.classList.toggle("is-hidden", !menuOpen);
    elements.hamburgerIcon.textContent = menuOpen ? "close" : "menu";
    elements.hamburger.setAttribute("aria-expanded", String(menuOpen));
};

const clearSplash = () => {
    if (splashTimer !== null) {
        window.clearTimeout(splashTimer);
        splashTimer = null;
    }
};

const scheduleSplash = () => {
    clearSplash();
    splashTimer = window.setTimeout(() => {
        if (currentView === "home") {
            navigate("generation/1");
        }
    }, 5000);
};

const showSplash = () => {
    currentView = "home";
    clearSplash();
    requestToken += 1;
    closeMenu();
    updateNav(null);
    elements.layout.classList.add("is-hidden");
    elements.notFound.classList.add("is-hidden");
    elements.splash.classList.remove("is-hidden");
    elements.content.replaceChildren();
    document.title = "Pokémon";
    scheduleSplash();
};

const showLayout = () => {
    elements.splash.classList.add("is-hidden");
    elements.layout.classList.remove("is-hidden");
    elements.notFound.classList.add("is-hidden");
};

const show404 = () => {
    currentView = "404";
    clearSplash();
    requestToken += 1;
    closeMenu();
    updateNav(null);
    elements.splash.classList.add("is-hidden");
    elements.layout.classList.add("is-hidden");
    elements.notFound.classList.remove("is-hidden");
    elements.content.replaceChildren();
    document.title = "Página no encontrada · Pokémon";
};

const navigate = (path) => {
    const url = path ? generationUrl(path.split("/").pop()) : new URL(BASE);
    window.history.pushState(null, "", url.pathname);
    if (!path) {
        showSplash();
    } else {
        showGeneration(Number(path.split("/").pop()));
    }
};

const currentRoute = () => {
    const base = BASE_PATH.endsWith("/") ? BASE_PATH : `${BASE_PATH}/`;
    const query = window.location.search.match(/^\?\/(generation\/(\d+))(?:&|\/|$)/);

    if (query) {
        window.history.replaceState(null, "", `${base}${query[1]}`);
        return { view: "generation", id: Number(query[2]) };
    }

    let path = decodeURIComponent(window.location.pathname);

    if (path === base.replace(/\/$/, "")) {
        path = "";
    } else if (path.startsWith(base)) {
        path = path.slice(base.length);
    }

    path = path.replace(/^\/+|\/+$/g, "");

    if (path === "" || path === "index.html") {
        return { view: "home" };
    }

    const generation = path.match(/^generation\/(\d+)$/);
    if (generation) {
        return { view: "generation", id: Number(generation[1]) };
    }

    return { view: "404" };
};

const route = () => {
    const path = currentRoute();
    if (path.view === "home") {
        showSplash();
    } else if (path.view === "generation") {
        showGeneration(path.id);
    } else {
        show404();
    }
};

const fetchDataset = async () => {
    try {
        const response = await fetch(DATASET_URL);
        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}`);
        }
        const { data } = await response.json();
        return data.map((pokemon) => ({
            ...pokemon,
            image_url: new URL(
                `assets/images/pokemon${pokemon.image_url.replace(/^\/pokemon-images/, "")}`,
                BASE
            ).href,
        }));
    } catch (error) {
        datasetPromise = null;
        throw error;
    }
};

const loadDataset = () => {
    if (!datasetPromise) {
        datasetPromise = fetchDataset();
    }
    return datasetPromise;
};

const filterPokemon = (data) => {
    let list = data.filter((pokemon) => pokemon.generation === state.generation);

    if (state.search) {
        const term = state.search.toLowerCase().trim();
        list = list.filter((pokemon) => pokemon.name.toLowerCase().includes(term));
    }

    if (state.type) {
        list = list.filter((pokemon) =>
            pokemon.types?.some((type) => typeSlug(type.name) === state.type)
        );
    }

    return list;
};

const createSkeleton = () => {
    const skeleton = createElement("div", "skeleton");
    skeleton.appendChild(createElement("div", "skeleton__image"));

    const content = createElement("div", "skeleton__content");
    ["skeleton__line--short", "skeleton__line--medium", "", "skeleton__line--short"].forEach(
        (modifier) => {
            content.appendChild(
                createElement("div", `skeleton__line${modifier ? ` ${modifier}` : ""}`)
            );
        }
    );
    skeleton.appendChild(content);
    return skeleton;
};

const skeletonGrid = () => {
    const grid = createElement("div", "skeletons");
    Array.from({ length: 6 }, () => grid.appendChild(createSkeleton()));
    return grid;
};

const createStat = (label, key, modifier, stats) => {
    const value = Number(stats[key]) || 0;
    const stat = createElement("div", `stat stat--${modifier}`);

    stat.appendChild(createElement("span", "stat__label", label));
    stat.appendChild(createElement("span", "stat__stars", estrellas(value)));
    stat.appendChild(createElement("span", "stat__value", String(value)));

    return stat;
};

const createCard = (pokemon) => {
    const card = createElement("article", "poke-card");
    const primaryType = pokemon.types?.[0];
    if (primaryType) {
        card.classList.add(`type--${typeSlug(primaryType.name)}`);
    }

    const imageContainer = createElement("div", "poke-card__image");
    if (pokemon.image_url) {
        const image = document.createElement("img");
        image.src = pokemon.image_url;
        image.alt = formatName(pokemon.name);
        image.loading = "lazy";
        imageContainer.appendChild(image);
    } else {
        imageContainer.appendChild(createElement("span", "poke-card__no-image", "Sin imagen"));
    }

    const content = createElement("div", "poke-card__content");
    const header = createElement("div", "poke-card__header");
    const name = formatName(pokemon.name);
    header.appendChild(createElement("h3", "poke-card__name", name));
    header.appendChild(
        createElement("span", "poke-card__id", `N.${"\u00A0"}${formatId(pokemon.global_index)}`)
    );

    const types = createElement("div", "poke-card__types");
    (pokemon.types || []).forEach((type) => {
        const badge = createElement(
            "span",
            `poke-card__type type--${typeSlug(type.name)}`,
            type.name
        );
        types.appendChild(badge);
    });

    const description = createElement("p", "poke-card__description", pokemon.description || "");

    const stats = createElement("div", "poke-card__stats");
    STATISTICS.forEach(([label, key, modifier]) => {
        stats.appendChild(createStat(label, key, modifier, pokemon.stats || {}));
    });

    content.appendChild(header);
    content.appendChild(types);
    content.appendChild(description);
    content.appendChild(stats);

    card.appendChild(imageContainer);
    card.appendChild(content);
    return card;
};

const createPagination = () => {
    const pagination = createElement("div", "pagination");

    const previous = createElement("button", "generation-btn");
    previous.type = "button";
    previous.dataset.page = "anterior";
    previous.disabled = state.page <= 1;
    previous.setAttribute("aria-label", "Página anterior");
    previous.appendChild(createElement("span", "material-icons", "chevron_left"));

    const info = createElement(
        "span",
        "pagination__info",
        `${state.page} de ${state.totalPages} (${state.total} pokemon)`
    );

    const next = createElement("button", "generation-btn");
    next.type = "button";
    next.dataset.page = "siguiente";
    next.disabled = state.page >= state.totalPages;
    next.setAttribute("aria-label", "Página siguiente");
    next.appendChild(createElement("span", "material-icons", "chevron_right"));

    pagination.appendChild(previous);
    pagination.appendChild(info);
    pagination.appendChild(next);
    return pagination;
};

const renderResults = (list) => {
    const total = list.length;
    state.total = total;
    state.totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
    state.page = Math.min(state.page, state.totalPages) || 1;

    const start = (state.page - 1) * PER_PAGE;
    const page = list.slice(start, start + PER_PAGE);
    const results = document.getElementById("results");
    if (!results) {
        return;
    }

    if (page.length === 0) {
        results.replaceChildren(
            createElement("p", "results__empty", "No se encontraron pokemon con esos filtros.")
        );
        return;
    }

    const cards = createElement("div", "cards");
    page.forEach((pokemon) => cards.appendChild(createCard(pokemon)));
    results.replaceChildren(cards);

    if (state.totalPages > 1) {
        results.appendChild(createPagination());
    }
};

const loadResults = async () => {
    const results = document.getElementById("results");
    if (!results) {
        return;
    }

    const token = ++requestToken;
    results.replaceChildren(skeletonGrid());

    try {
        const data = await loadDataset();
        if (token !== requestToken) {
            return;
        }
        renderResults(filterPokemon(data));
    } catch (error) {
        if (token !== requestToken) {
            return;
        }
        const container = createElement("div", "generation");
        container.appendChild(createElement("h2", "generation__title", "Error"));
        container.appendChild(createElement("p", "generation__text", error.message));
        results.replaceChildren(container);
    }
};

const scheduleLoad = (delay) => {
    if (searchTimer !== null) {
        window.clearTimeout(searchTimer);
    }
    searchTimer = window.setTimeout(loadResults, delay);
};

const createGenerationButton = (iconName, text, disabled) => {
    const button = createElement("button", "generation-btn");
    button.type = "button";
    button.disabled = disabled;

    const icon = createElement("span", "material-icons", iconName);
    icon.setAttribute("aria-hidden", "true");
    button.appendChild(icon);
    button.appendChild(createElement("span", "generation-btn__text", text));
    return button;
};

const buildGenerationView = (id) => {
    const generation = GENERATIONS.find((item) => item.id === id);
    const container = createElement("div", "generation");

    const navigation = createElement("div", "generation-navigation");
    const previous = createGenerationButton("arrow_back", "Anterior", id <= 1);
    previous.id = "btn-gen-previous";
    const next = createGenerationButton("arrow_forward", "Siguiente", id >= GENERATIONS.length);
    next.id = "btn-gen-next";

    const progress = createElement("div", "generation-progress");
    progress.appendChild(
        createElement(
            "span",
            "generation-progress__text",
            `Generación ${id} de ${GENERATIONS.length}`
        )
    );
    const bar = document.createElement("progress");
    bar.className = "generation-progress__bar";
    bar.max = GENERATIONS.length;
    bar.value = id;
    bar.setAttribute("aria-label", "Progreso de generaciones");
    progress.appendChild(bar);

    navigation.appendChild(previous);
    navigation.appendChild(progress);
    navigation.appendChild(next);

    container.appendChild(navigation);
    container.appendChild(
        createElement("h2", "generation__title", `Pokémon de la ${generation.name} generación`)
    );

    const filters = createElement("div", "filters");
    const search = document.createElement("input");
    search.className = "filters__search";
    search.id = "search";
    search.type = "search";
    search.placeholder = "Buscar pokemon...";
    search.setAttribute("aria-label", "Buscar Pokémon por nombre");

    const select = document.createElement("select");
    select.className = "filters__select";
    select.id = "type-filter";
    select.setAttribute("aria-label", "Filtrar por tipo");
    const allOption = document.createElement("option");
    allOption.value = "";
    allOption.textContent = "Todos los tipos";
    select.appendChild(allOption);
    TYPES.forEach((type) => {
        const option = document.createElement("option");
        option.value = type.slug;
        option.textContent = type.name;
        select.appendChild(option);
    });

    filters.appendChild(search);
    filters.appendChild(select);

    const results = createElement("div", "results");
    results.id = "results";
    results.appendChild(skeletonGrid());

    container.appendChild(filters);
    container.appendChild(results);
    return container;
};

const showGeneration = (id) => {
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
        const container = createElement("div", "generation");
        container.appendChild(createElement("h2", "generation__title", "Generación no válida"));
        container.appendChild(
            createElement(
                "p",
                "generation__text",
                "Selecciona una generación del menú de navegación."
            )
        );
        elements.content.replaceChildren(container);
        return;
    }

    document.title = `Pokémon · ${generation.name} generación`;
    elements.content.replaceChildren(buildGenerationView(id));

    document.getElementById("btn-gen-previous").addEventListener("click", () => {
        if (id > 1) {
            navigate(`generation/${id - 1}`);
        }
    });
    document.getElementById("btn-gen-next").addEventListener("click", () => {
        if (id < GENERATIONS.length) {
            navigate(`generation/${id + 1}`);
        }
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
        if (!button) {
            return;
        }
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
};

const setupLinks = () => {
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
        favicon.href = new URL("assets/icons/favicon.svg", BASE).href;
    }
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
};

const updateYear = () => {
    document.querySelectorAll("[data-year]").forEach((node) => {
        node.textContent = new Date().getFullYear();
    });
};

const initAnalytics = () => {
    window.dataLayer = window.dataLayer || [];
    window.gtag = (...args) => {
        window.dataLayer.push(args);
    };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID);
};

setupLinks();
route();
updateYear();
initAnalytics();
