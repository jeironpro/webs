const BASE_URL = new URL("./", document.baseURI);
const PAGE_SIZE = 24;

const VILLAGES = [
    "all",
    "Konohagakure",
    "Sunagakure",
    "Kirigakure",
    "Otogakure",
    "Iwagakure",
    "Hoshigakure",
    "Kumogakure",
    "Ishigakure",
    "Takumi",
    "S/A",
];
const CLANS = [
    "all",
    "Uchiha",
    "Uzumaki",
    "Hyûga",
    "Nara",
    "Yamanaka",
    "Akimichi",
    "Inuzuka",
    "Aburame",
    "Hatake",
    "Sarutobi",
    "Senju",
    "Katô",
    "Momochi",
    "Yuki",
    "Hoshigaki",
    "Kaguya",
    "Yamashiro",
    "Namiashi",
    "Kamizuru",
    "Fûma",
    "Kurama",
    "Shiin",
    "Kazekage",
    "Lee",
    "S/C",
];
const TEAMS = [
    "all",
    "Akatsuki",
    "Equipo 7",
    "Equipo 8",
    "Equipo 10",
    "Equipo Dosu",
    "Equipo Guy",
    "Equipo Konohamaru",
    "Equipo Kabuto",
    "Equipo Watari",
    "Equipo Hiruzen",
    "Equipo Minato",
    "Equipo Oboro",
    "Shinobazu",
    "Hermanos Criminales",
    "Hermanos Diabólicos",
    "Cuatro Hombres de los Símbolos Celestiales",
    "Hermanos de la Arena",
    "Siete Espadachines de la Niebla",
    "Consejeros del Hokage",
    "Familia Kurosuki",
    "Legendarios Hermanos Estupidos",
    "Tres Hermanos Ryûdôin",
    "Cuatro del Sonido",
    "S/E",
];
const RANKS = [
    "all",
    "Estudiante",
    "Genin",
    "Chûnin",
    "Tokubetsu Jônin",
    "Jônin",
    "ANBU",
    "Sannin",
    "Hokage",
    "Kazekage",
    "Mizukage",
    "Hoshikage",
    "Especialista Médico",
    "S/R",
];
const SORT_OPTIONS = [
    ["score-desc", "Mejor puntuación"],
    ["score-asc", "Peor puntuación"],
    ["name-asc", "Nombre A-Z"],
    ["name-desc", "Nombre Z-A"],
];

const filters = {
    village: "all",
    clan: "all",
    team: "all",
    rank: "all",
    sort: "score-desc",
    search: "",
};
let characters = [];
let currentPage = 1;
let totalPages = 1;

const $ = (selector) => document.querySelector(selector);
const escapeHtml = (value = "") =>
    String(value).replace(
        /[&<>"']/g,
        (character) =>
            ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]
    );

function setMarkup(element, markup) {
    const parsed = new DOMParser().parseFromString(markup, "text/html");
    element.replaceChildren(...parsed.body.childNodes);
}

function imageUrl(image = "") {
    return new URL(image, BASE_URL).href;
}

function calculateScore(stats = {}) {
    return (
        Math.round(
            (stats.strength * 0.3 +
                stats.skill * 0.3 +
                stats.resistance * 0.2 +
                stats.strategy * 0.2) *
                10
        ) / 10
    );
}

function createKunais() {
    const svg = `<svg class="kunai" width="32" height="44" viewBox="0 0 60 200" fill="none" aria-hidden="true">
        <defs><linearGradient id="kunai-blade" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#8B929A"/><stop offset="50%" stop-color="#D1D5DB"/><stop offset="100%" stop-color="#8B929A"/></linearGradient></defs>
        <path d="M30 14 C24 32 12 44 11 56 C10 68 16 76 20 80 L28 84 L30 86 Z" fill="url(#kunai-blade)" stroke="#5C6065" stroke-width=".5"/>
        <path d="M30 14 C36 32 48 44 49 56 C50 68 44 76 40 80 L32 84 L30 86 Z" fill="url(#kunai-blade)" stroke="#5C6065" stroke-width=".5"/>
        <line x1="30" y1="14" x2="30" y2="86" stroke="#5C6065" stroke-width="1.5" opacity=".8"/>
        <rect x="24" y="84" width="12" height="4" rx="1" fill="#6B7278"/><rect x="26" y="88" width="8" height="48" rx="2" fill="#8B8F94"/>
        <ellipse cx="30" cy="150" rx="8" ry="6" fill="none" stroke="#8B929A" stroke-width="3"/>
    </svg>`;
    setMarkup($("#background-kunai"), svg.repeat(8));
}

function renderOptions(values, allLabel) {
    return values
        .map(
            (value) =>
                `<option value="${escapeHtml(value)}">${escapeHtml(
                    value === "all" ? allLabel : value
                )}</option>`
        )
        .join("");
}

function renderFilters() {
    setMarkup(
        $("#filter-bar"),
        `
        <div class="filter-search"><input type="text" class="filter-input" id="search" placeholder="Buscar personaje..." aria-label="Buscar personaje" value="${escapeHtml(filters.search)}"></div>
        <div class="filter-controls">
            <div class="filter-group"><label class="filter-label" for="village">Aldea</label><select class="filter-select" id="village">${renderOptions(VILLAGES, "Todas")}</select></div>
            <div class="filter-group"><label class="filter-label" for="clan">Clan</label><select class="filter-select" id="clan">${renderOptions(CLANS, "Todos")}</select></div>
            <div class="filter-group"><label class="filter-label" for="team">Equipo</label><select class="filter-select" id="team">${renderOptions(TEAMS, "Todos")}</select></div>
            <div class="filter-group"><label class="filter-label" for="rank">Rango</label><select class="filter-select" id="rank">${renderOptions(RANKS, "Todos")}</select></div>
            <div class="filter-group"><label class="filter-label" for="sort">Ordenar</label><select class="filter-select" id="sort">${SORT_OPTIONS.map(
                ([value, label]) => `<option value="${value}">${escapeHtml(label)}</option>`
            ).join("")}</select></div>
            <button type="button" class="filter-top3" id="top-three">Ver top 3</button>
            <button type="button" class="filter-reset" id="reset">Reiniciar</button>
        </div>`
    );
    syncFilters();

    $("#search").addEventListener("input", (event) => {
        filters.search = event.target.value;
        currentPage = 1;
        renderList();
    });
    ["village", "clan", "team", "rank", "sort"].forEach((key) => {
        $(`#${key}`).addEventListener("change", (event) => {
            filters[key] = event.target.value;
            currentPage = 1;
            renderList();
        });
    });
    $("#reset").addEventListener("click", () => {
        Object.assign(filters, {
            village: "all",
            clan: "all",
            team: "all",
            rank: "all",
            sort: "score-desc",
            search: "",
        });
        currentPage = 1;
        syncFilters();
        renderList();
    });
    $("#top-three").addEventListener("click", openTopThree);
}

function syncFilters() {
    $("#search").value = filters.search;
    ["village", "clan", "team", "rank", "sort"].forEach((key) => {
        $(`#${key}`).value = filters[key];
    });
}

function filterCharacters() {
    const term = filters.search.trim().toLowerCase();
    return characters
        .filter((character) => !term || character.name.toLowerCase().includes(term))
        .filter((character) => filters.village === "all" || character.village === filters.village)
        .filter((character) => filters.clan === "all" || character.clan === filters.clan)
        .filter((character) => filters.team === "all" || character.team === filters.team)
        .filter((character) => filters.rank === "all" || character.rank === filters.rank)
        .sort((a, b) => {
            if (filters.sort === "score-asc") return a.score - b.score;
            if (filters.sort === "name-asc") return a.name.localeCompare(b.name);
            if (filters.sort === "name-desc") return b.name.localeCompare(a.name);
            return b.score - a.score;
        });
}

function scoreColor(score) {
    if (score >= 8) return "gold";
    if (score >= 6) return "silver";
    if (score >= 4) return "bronze";
    return "base";
}

function scoreBadge(score) {
    const value = Math.min(10, Math.max(0, score || 0));
    return `<div class="score-badge score-badge--${scoreColor(value)}" role="img" aria-label="Puntuación: ${value}"><span class="score-value" aria-hidden="true">${value}</span></div>`;
}

function renderTags(items = [], className) {
    return items
        .slice(0, 3)
        .map((item) => `<li class="${className}">${escapeHtml(item)}</li>`)
        .join("");
}

function renderCard(character) {
    const stats = character.stats;
    return `<article class="card">
        <div class="card-banner">
            <img class="card-banner-img" src="${imageUrl(character.image)}" alt="${escapeHtml(character.name)}" loading="lazy" data-name="${escapeHtml(character.name)}">
            <button type="button" class="card-expand" data-image="${character.id}" aria-label="Ver imagen completa">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/></svg>
            </button>
            <div class="card-banner-overlay"><h2 class="card-name">${escapeHtml(character.name)}</h2></div>
            <div class="card-banner-score">${scoreBadge(character.score)}</div>
        </div>
        <div class="card-body">
            <div class="card-meta"><span>${escapeHtml(character.village)}</span><span class="meta-div">|</span><span>${escapeHtml(character.clan)}</span><span class="meta-div">|</span><span>${escapeHtml(character.rank)}</span><span class="meta-div">|</span><span>${escapeHtml(character.team)}</span></div>
            <div class="card-divider"></div>
            <div class="card-stats-grid" aria-label="Estadísticas">
                <div class="snode"><div class="snode-value snode-value--strength">${stats.strength}</div><div class="snode-label">Fuerza</div></div>
                <div class="snode"><div class="snode-value snode-value--skill">${stats.skill}</div><div class="snode-label">Habilidad</div></div>
                <div class="snode"><div class="snode-value snode-value--resistance">${stats.resistance}</div><div class="snode-label">Resistencia</div></div>
                <div class="snode"><div class="snode-value snode-value--strategy">${stats.strategy}</div><div class="snode-label">Estrategia</div></div>
            </div>
            ${
                character.abilities.length
                    ? `<div class="card-divider"></div><div class="card-abilities"><span class="card-section-label">Habilidades</span><ul class="card-ability-list">${renderTags(character.abilities, "ability-tag")}</ul></div>`
                    : ""
            }
            ${
                character.strengths.length || character.weaknesses.length
                    ? `<div class="card-divider"></div><div class="card-sides">
                ${
                    character.strengths.length
                        ? `<div class="card-side"><span class="card-section-label card-section-label--green">Fortalezas</span><ul>${renderTags(character.strengths, "side-item side-item--pos")}</ul></div>`
                        : ""
                }
                ${
                    character.weaknesses.length
                        ? `<div class="card-side"><span class="card-section-label card-section-label--red">Debilidades</span><ul>${renderTags(character.weaknesses, "side-item side-item--neg")}</ul></div>`
                        : ""
                }
            </div>`
                    : ""
            }
        </div>
    </article>`;
}

function renderList() {
    const result = filterCharacters();
    totalPages = Math.max(1, Math.ceil(result.length / PAGE_SIZE));
    currentPage = Math.min(Math.max(1, currentPage), totalPages);
    const start = (currentPage - 1) * PAGE_SIZE;
    const visible = result.slice(start, start + PAGE_SIZE);
    const status = $("#status");

    if (!result.length) {
        status.className = "empty-state";
        status.textContent = "No se encontraron personajes con esos filtros.";
        setMarkup($("#cards"), "");
        setMarkup($("#pagination"), "");
        return;
    }

    status.className = "loading-state is-hidden";
    status.textContent = "";
    setMarkup($("#cards"), visible.map(renderCard).join(""));
    document.querySelectorAll(".card-banner-img").forEach((image) => {
        image.addEventListener(
            "error",
            () => {
                const fallback = document.createElement("div");
                fallback.className = "card-banner-fallback";
                const initial = document.createElement("span");
                initial.className = "card-banner-initial";
                initial.textContent = image.dataset.name?.[0] || "?";
                fallback.append(initial);
                image.replaceWith(fallback);
            },
            { once: true }
        );
    });
    document.querySelectorAll("[data-image]").forEach((button) => {
        button.addEventListener("click", () => openImage(button.dataset.image));
    });
    renderPagination();
}

function pageNumbers(current, total) {
    if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);
    const pages = [1];
    if (current > 3) pages.push("...");
    for (let page = Math.max(2, current - 1); page <= Math.min(total - 1, current + 1); page += 1)
        pages.push(page);
    if (current < total - 2) pages.push("...");
    pages.push(total);
    return pages;
}

function renderPagination() {
    const container = $("#pagination");
    if (totalPages <= 1) {
        setMarkup(container, "");
        return;
    }
    setMarkup(
        container,
        `
        <button type="button" class="pagination-btn" data-page="${currentPage - 1}" aria-label="Página anterior" ${currentPage === 1 ? "disabled" : ""}><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        ${pageNumbers(currentPage, totalPages)
            .map((page) =>
                page === "..."
                    ? '<span class="pagination-ellipsis" aria-hidden="true">…</span>'
                    : `<button type="button" class="pagination-btn pagination-btn--page ${page === currentPage ? "pagination-btn--active" : ""}" data-page="${page}" aria-label="Página ${page}" ${page === currentPage ? 'aria-current="page"' : ""}>${page}</button>`
            )
            .join("")}
        <button type="button" class="pagination-btn" data-page="${currentPage + 1}" aria-label="Página siguiente" ${currentPage === totalPages ? "disabled" : ""}><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>`
    );
    container.querySelectorAll("[data-page]").forEach((button) => {
        button.addEventListener("click", () => {
            const destination = Number(button.dataset.page);
            if (destination >= 1 && destination <= totalPages && destination !== currentPage) {
                currentPage = destination;
                renderList();
                $("#filter-bar").scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });
}

function openModal(content, overlayClass = "") {
    setMarkup(
        $("#modal-root"),
        `<div class="modal-overlay ${overlayClass}" data-close><div class="modal-content" role="dialog" aria-modal="true" tabindex="-1">${content}</div></div>`
    );
    document.body.classList.add("modal-open");
    const overlay = $("#modal-root .modal-overlay");
    overlay.addEventListener("click", (event) => {
        if (event.target === overlay) closeModal();
    });
    overlay.querySelector(".modal-close")?.addEventListener("click", closeModal);
    overlay.querySelector(".modal-content")?.focus();
    document.addEventListener("keydown", handleEscape);
}

function closeModal() {
    setMarkup($("#modal-root"), "");
    document.body.classList.remove("modal-open");
    document.removeEventListener("keydown", handleEscape);
}

function handleEscape(event) {
    if (event.key === "Escape") closeModal();
}

function closeButton() {
    return `<button type="button" class="modal-close" aria-label="Cerrar"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M15 5L5 15M5 5l10 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>`;
}

function openTopThree() {
    const topThree = [...characters].sort((a, b) => b.score - a.score).slice(0, 3);
    if (topThree.length < 3) return;
    const ranks = [
        { key: "first", label: "1" },
        { key: "second", label: "2" },
        { key: "third", label: "3" },
    ];
    const items = [
        [topThree[1], ranks[1]],
        [topThree[0], ranks[0]],
        [topThree[2], ranks[2]],
    ];
    const content = `${closeButton()}<section class="podium"><h2 class="podium-title"><span class="podium-title-bg">TOP 3</span></h2><div class="ascension">
        ${items
            .map(
                ([character, rank]) => `<div class="ascension-item ascension-item--${rank.key}">
            <div class="ascension-particles" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span><span></span></div>
            <div class="ascension-frame">
                ${rank.key === "first" ? '<div class="ascension-halo"></div>' : ""}
                <div class="ascension-glow"></div>
                <img class="ascension-img" src="${imageUrl(character.image)}" alt="${escapeHtml(character.name)}" loading="lazy">
            </div>
            <div class="ascension-badge">${rank.label}</div>
            <div class="ascension-stream"><div class="ascension-stream-inner"></div></div>
            <div class="ascension-info"><span class="ascension-name">${escapeHtml(character.name)}</span><span class="ascension-score" aria-label="Puntuación: ${character.score}">${character.score}</span></div>
        </div>`
            )
            .join("")}
    </div></section>`;
    openModal(content);
}

function openImage(id) {
    const character = characters.find((item) => item.id === id);
    if (!character) return;
    const content = `<div class="modal-overlay imodal-overlay" data-close><div class="imodal" role="dialog" aria-modal="true" aria-label="Imagen de ${escapeHtml(character.name)}">
        <div class="imodal-bg"></div>
        <button type="button" class="modal-close imodal-close" aria-label="Cerrar"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
        <div class="imodal-image-wrap"><div class="imodal-image-glow"></div><img class="imodal-image" src="${imageUrl(character.image)}" alt="${escapeHtml(character.name)}" loading="lazy"></div>
        <div class="imodal-info"><h2 class="imodal-name">${escapeHtml(character.name)}</h2><div class="imodal-meta"><span class="imodal-tag">${escapeHtml(character.village)}</span><span class="imodal-dot">•</span><span class="imodal-tag">${escapeHtml(character.rank)}</span><span class="imodal-dot">•</span><span class="imodal-tag">${escapeHtml(character.team)}</span></div></div>
        <div class="imodal-corner imodal-corner--tl"></div><div class="imodal-corner imodal-corner--tr"></div><div class="imodal-corner imodal-corner--bl"></div><div class="imodal-corner imodal-corner--br"></div>
    </div></div>`;
    setMarkup($("#modal-root"), content);
    document.body.classList.add("modal-open");
    const overlay = $("#modal-root .imodal-overlay");
    overlay.addEventListener("click", (event) => {
        if (event.target === overlay) closeModal();
    });
    overlay.querySelector(".modal-close").addEventListener("click", closeModal);
    const image = overlay.querySelector(".imodal-image");
    image.addEventListener(
        "error",
        () => {
            const fallback = document.createElement("div");
            fallback.className = "imodal-fallback";
            const initial = document.createElement("span");
            initial.className = "imodal-initial";
            initial.textContent = character.name[0] || "?";
            fallback.append(initial);
            image.replaceWith(fallback);
        },
        { once: true }
    );
    overlay.querySelector(".imodal").addEventListener("click", (event) => event.stopPropagation());
    document.addEventListener("keydown", handleEscape);
}

async function init() {
    createKunais();
    renderFilters();
    try {
        const response = await fetch(new URL("data/naruto/personajes.json", BASE_URL));
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        characters = data.map((character) => ({
            id: character.id,
            name: character.name,
            village: character.village || "",
            clan: character.clan || "",
            team: character.team || "",
            rank: character.rank || "",
            image: character.image || "",
            abilities: character.abilities || [],
            strengths: character.strengths || [],
            weaknesses: character.weaknesses || [],
            stats: character.stats || {
                strength: 0,
                skill: 0,
                resistance: 0,
                strategy: 0,
            },
            score: calculateScore(character.stats),
        }));
        renderList();
    } catch {
        $("#status").className = "error-state";
        $("#status").textContent = "No se pudieron cargar los personajes. Inténtalo de nuevo.";
    }
}

init();
