/* Guía GTA VI · interacciones y checklist persistente */

import { loadJSON } from "./data.js";

document.documentElement.classList.add("js");

const STORAGE_KEY = "gta6-leonida-checklist-v1";
const CAMPAIGN_STORAGE_KEY = "gta6-leonida-campaign-v1";
const CONSENT_KEY = "gta6-leonida-consent-v1";

const [CHECKLIST, MAP_POINTS, CAMPANA, SECUNDARIAS] = await Promise.all([
    loadJSON("checklist.json", []),
    loadJSON("mapa.json", []),
    loadJSON("campana.json", { chapters: [], choices: {} }),
    loadJSON("secundarias.json", { chains: [], hidden: [] }),
]);

const { chapters: CHAPTERS, choices: MISSION_CHOICES } = CAMPANA;
const { chains: SIDE_QUESTS, hidden: HIDDEN_QUESTS } = SECUNDARIAS;

const progressResetters = [];
const progressPersisters = [];

/* ---------- Utilidades ---------- */

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

function getStore() {
    try {
        return window.localStorage;
    } catch {
        return null;
    }
}

function consentStatus() {
    const store = getStore();
    if (!store) return "unavailable";

    try {
        const value = store.getItem(CONSENT_KEY);
        if (value === "granted" || value === "denied") return value;
        return "pending";
    } catch {
        return "unavailable";
    }
}

function canWriteStorage() {
    return consentStatus() === "granted";
}

function canReadStorage() {
    const status = consentStatus();
    return status === "granted" || status === "pending";
}

function loadState(key = STORAGE_KEY) {
    if (!canReadStorage()) return new Set();

    try {
        const raw = localStorage.getItem(key);
        if (!raw) return new Set();
        const parsed = JSON.parse(raw);
        return new Set(Array.isArray(parsed) ? parsed : []);
    } catch {
        return new Set();
    }
}

function saveState(state, key = STORAGE_KEY) {
    if (!canWriteStorage()) return;

    try {
        localStorage.setItem(key, JSON.stringify([...state]));
    } catch {
        /* almacenamiento no disponible: la checklist sigue funcionando en memoria */
    }
}

/* ---------- Header, progreso y navegación ---------- */

const header = $("#site-header");
const progressBar = $("#scroll-progress");

function onScroll() {
    const y = window.scrollY;
    header?.classList.toggle("is-scrolled", y > 24);

    const height = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = height > 0 ? Math.min(y / height, 1) : 0;
    if (progressBar) progressBar.style.width = `${ratio * 100}%`;
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

const nav = $("#nav");
const navToggle = $("#nav-toggle");

function closeNav() {
    if (!nav || !navToggle) return;
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Abrir menú");
}

navToggle?.addEventListener("click", () => {
    if (!nav) return;
    const open = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
});

$$("#nav a").forEach((link) => link.addEventListener("click", closeNav));

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNav();
});

/* ---------- Vistas por sección ---------- */

const navLinks = $$("#nav a");
const mainEl = $("#contenido");
const heroEl = $("#inicio");
const factsEl = $(".facts");
const tickerEl = $(".ticker");

const VIEW_LABELS = {
    inicio: "Inicio",
    historia: "Historia",
    personajes: "El reparto",
    protagonistas: "Jason y Lucía",
    leonida: "Leónida",
    ubicaciones: "Ubicaciones",
    sistemas: "Sistemas",
    "primeras-horas": "Primeras horas",
    campana: "Campaña",
    secundarias: "Secundarias",
    finales: "Finales",
    progreso: "Progreso",
    dinero: "Dinero",
    checklist: "100%",
    ediciones: "Ediciones",
    cronologia: "Cronología",
    recepcion: "Recepción",
    faq: "Preguntas",
    fuentes: "Fuentes",
};

const views = [];

if (mainEl && heroEl) {
    views.push({
        id: "inicio",
        label: "Inicio",
        els: [heroEl, factsEl, tickerEl].filter(Boolean),
    });
    $$("main > section.section", mainEl).forEach((section) => {
        if (!section.id) return;
        views.push({
            id: section.id,
            label: VIEW_LABELS[section.id] ?? section.id,
            els: [section],
        });
    });
}

const viewById = new Map(views.map((view) => [view.id, view]));
const pagerEl = $("#view-pager");
let activeView = null;

const viewForElement = (element) =>
    views.find((view) => view.els.some((node) => node === element || node.contains(element)));

const scrollToElement = (element) => {
    const offset = (header?.offsetHeight ?? 74) + 12;
    const top = element ? window.scrollY + element.getBoundingClientRect().top - offset : 0;
    window.scrollTo({ top: Math.max(top, 0), behavior: "instant" });
};

const renderPager = (view) => {
    if (!pagerEl) return;

    const index = views.indexOf(view);
    const previous = views[index - 1];
    const next = views[index + 1];
    pagerEl.replaceChildren();

    const meta = document.createElement("p");
    meta.className = "view-pager__meta";
    meta.textContent = `Sección ${index + 1} de ${views.length}`;

    const links = document.createElement("div");
    links.className = "view-pager__links";

    [
        { target: previous, prefix: "← ", suffix: "" },
        { target: next, prefix: "", suffix: " →" },
    ].forEach(({ target, prefix, suffix }) => {
        if (!target) {
            links.append(document.createElement("span"));
            return;
        }

        const link = document.createElement("a");
        link.className = "view-pager__link";
        link.href = `#${target.id}`;
        link.textContent = `${prefix}${target.label}${suffix}`;
        links.append(link);
    });

    pagerEl.append(meta, links);
    pagerEl.hidden = views.length < 2;
};

const showView = (view, target = null, options = {}) => {
    const changed = view !== activeView;
    activeView = view;

    views.forEach((item) => {
        item.els.forEach((node) => {
            node.hidden = item !== view;
        });
    });

    navLinks.forEach((link) => {
        const current = link.getAttribute("href") === `#${view.id}`;
        link.classList.toggle("is-active", current);
        if (current) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
    });

    renderPager(view);
    scrollToElement(target && !view.els.includes(target) ? target : null);

    if (changed && options.focus) {
        const heading = view.els[0].querySelector("h1, h2");
        if (heading) {
            heading.setAttribute("tabindex", "-1");
            heading.focus({ preventScroll: true });
        }
    }

    onScroll();
};

const route = (hash, options = {}) => {
    const id = (hash || "").replace(/^#/, "") || "inicio";
    const element = document.getElementById(id);
    const view = (element && viewForElement(element)) || viewById.get(id) || viewById.get("inicio");

    if (!view) return;
    showView(view, element, options);
};

document.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const link = event.target.closest('a[href^="#"]');
    if (!link) return;

    const hash = link.getAttribute("href");
    if (!hash || hash === "#" || hash === "#contenido") return;

    const element = document.getElementById(hash.slice(1));
    if (!element) return;

    event.preventDefault();
    closeNav();
    if (window.location.hash !== hash) window.history.pushState(null, "", hash);
    route(hash, { focus: true });
});

window.addEventListener("popstate", () => route(window.location.hash));
window.addEventListener("hashchange", () => route(window.location.hash));

if (views.length) document.body.classList.add("is-paged");

/* ---------- Aparición al hacer scroll ---------- */

const reveals = $$(".reveal");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (reducedMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-visible"));
} else {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    reveals.forEach((el) => revealObserver.observe(el));
}

/* ---------- Spoilers ---------- */

$$(".spoiler-toggle").forEach((button) => {
    const target = document.getElementById(button.dataset.spoiler);
    if (!target) return;

    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", target.id);

    button.addEventListener("click", () => {
        const open = target.hidden;
        target.hidden = !open;
        button.setAttribute("aria-expanded", String(open));
        button.textContent = open ? "Ocultar spoiler" : "Mostrar aviso con spoiler";
    });
});

/* ---------- Pestañas del panel Jason y Lucía ---------- */

const tabs = $$(".tab");
const panels = $$(".tab-panel");

if (tabs.length && panels.length === tabs.length) {
    const activateTab = (index, moveFocus = false) => {
        tabs.forEach((tab, i) => {
            const active = i === index;
            tab.classList.toggle("is-active", active);
            tab.setAttribute("aria-selected", String(active));
            tab.tabIndex = active ? 0 : -1;
            panels[i].classList.toggle("is-active", active);
            panels[i].hidden = !active;
        });
        if (moveFocus) tabs[index].focus();
    };

    activateTab(0);

    tabs.forEach((tab, index) => {
        tab.addEventListener("click", () => activateTab(index));

        tab.addEventListener("keydown", (event) => {
            let next = null;
            if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
            if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
            if (event.key === "Home") next = 0;
            if (event.key === "End") next = tabs.length - 1;
            if (next === null) return;
            event.preventDefault();
            activateTab(next, true);
        });
    });
}

/* ---------- Mapa interactivo de Leónida ---------- */

const MAP_CAT_LABELS = {
    ciudad: "Ciudad",
    costa: "Costa",
    naturaleza: "Naturaleza",
    historia: "Punto de historia",
};

const mapViewport = document.getElementById("map-viewport");
const mapStage = document.getElementById("map-stage");
const mapDetail = document.getElementById("map-detail");

if (mapViewport && mapStage && mapDetail) {
    const markers = [];
    const markerLabel = (point) => `${point.name}, ${point.region}. ${MAP_CAT_LABELS[point.cat]}`;

    const selectPoint = (point, button) => {
        markers.forEach((marker) => marker.classList.toggle("is-active", marker === button));

        const tag = document.createElement("p");
        tag.className = "tag";
        tag.textContent = point.region;

        const title = document.createElement("h3");
        title.textContent = point.name;

        const meta = document.createElement("div");
        meta.className = "map-detail__meta";
        const category = document.createElement("span");
        category.textContent = MAP_CAT_LABELS[point.cat];
        meta.append(category);

        const desc = document.createElement("p");
        desc.textContent = point.desc;

        const note = document.createElement("p");
        note.className = "map-detail__note";
        note.append(document.createTextNode("Mapa oficial © Rockstar Games · "));

        const credit = document.createElement("a");
        credit.href = "https://www.rockstargames.com/VI/media";
        credit.rel = "noreferrer noopener";
        credit.target = "_blank";
        credit.textContent = "rockstargames.com/VI";
        note.append(credit);

        mapDetail.replaceChildren(tag, title, meta, desc, note);
    };

    MAP_POINTS.forEach((point, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "map-marker";
        button.style.setProperty("--x", `${point.x}%`);
        button.style.setProperty("--y", `${point.y}%`);
        button.dataset.cat = point.cat;
        button.dataset.id = point.id;
        button.setAttribute("aria-label", markerLabel(point));
        button.textContent = String(index + 1).padStart(2, "0");
        button.addEventListener("click", () => selectPoint(point, button));
        mapStage.append(button);
        markers.push(button);
    });

    let scale = 1;
    let offsetX = 0;
    let offsetY = 0;
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let startOffsetX = 0;
    let startOffsetY = 0;

    const clampOffsets = () => {
        const maxX = ((scale - 1) * mapViewport.clientWidth) / 2;
        const maxY = ((scale - 1) * mapViewport.clientHeight) / 2;
        offsetX = Math.min(maxX, Math.max(-maxX, offsetX));
        offsetY = Math.min(maxY, Math.max(-maxY, offsetY));
    };

    const applyMap = () => {
        clampOffsets();
        mapStage.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
        mapStage.style.setProperty("--inv", String(1 / scale));
    };

    const zoomMap = (delta) => {
        scale = Math.min(3.2, Math.max(1, scale + delta));
        if (scale === 1) {
            offsetX = 0;
            offsetY = 0;
        }
        applyMap();
    };

    mapViewport.addEventListener(
        "wheel",
        (event) => {
            event.preventDefault();
            zoomMap(event.deltaY < 0 ? 0.25 : -0.25);
        },
        { passive: false }
    );

    mapViewport.addEventListener("pointerdown", (event) => {
        if (scale <= 1 || event.target.closest(".map-marker")) return;
        dragging = true;
        mapViewport.classList.add("is-dragging");
        mapViewport.setPointerCapture(event.pointerId);
        startX = event.clientX;
        startY = event.clientY;
        startOffsetX = offsetX;
        startOffsetY = offsetY;
    });

    mapViewport.addEventListener("pointermove", (event) => {
        if (!dragging) return;
        offsetX = startOffsetX + event.clientX - startX;
        offsetY = startOffsetY + event.clientY - startY;
        applyMap();
    });

    const endDrag = (event) => {
        dragging = false;
        mapViewport.classList.remove("is-dragging");
        if (mapViewport.hasPointerCapture(event.pointerId)) {
            mapViewport.releasePointerCapture(event.pointerId);
        }
    };

    mapViewport.addEventListener("pointerup", endDrag);
    mapViewport.addEventListener("pointercancel", endDrag);

    $$("[data-map-zoom]").forEach((button) => {
        button.addEventListener("click", () => {
            const action = button.dataset.mapZoom;
            if (action === "in") zoomMap(0.35);
            else if (action === "out") zoomMap(-0.35);
            else {
                scale = 1;
                offsetX = 0;
                offsetY = 0;
                applyMap();
            }
        });
    });

    $$("[data-map-filter]").forEach((chip) => {
        chip.addEventListener("click", () => {
            $$("[data-map-filter]").forEach((other) => {
                other.classList.toggle("is-active", other === chip);
            });
            const filter = chip.dataset.mapFilter;
            markers.forEach((marker) => {
                marker.hidden = filter !== "all" && marker.dataset.cat !== filter;
            });
        });
    });
}

/* ---------- Campaña: 97 entradas en 5 capítulos ---------- */

/* ---------- Decisiones documentadas por misión ---------- */

const makeEl = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
};

const buildChoices = (mission) => {
    const choices = MISSION_CHOICES[mission.name];
    if (!choices) {
        return makeEl(
            "p",
            "mission__linear",
            mission.pending ? "Decisiones sin confirmar" : "Sin decisiones · misión lineal"
        );
    }

    const details = makeEl("details", "mission__choices");
    const summary = makeEl("summary", null, "Decisiones ");
    summary.append(makeEl("span", "mission__choices-count", String(choices.length)));

    const list = makeEl("ul", "mission__choices-list");
    choices.forEach((decision) => {
        const item = makeEl("li", "decision");
        item.append(makeEl("p", "decision__q", decision.q));

        const options = makeEl("ul", "decision__opts");
        decision.opts.forEach(([label, effect]) => {
            const option = makeEl("li");
            option.append(makeEl("span", "decision__opt", label), makeEl("span", null, effect));
            options.append(option);
        });

        item.append(options);
        list.append(item);
    });

    details.append(summary, list);
    return details;
};

const campaignEl = document.getElementById("campaign");
const chapterNavEl = document.getElementById("chapter-nav");
const campaignSection = document.getElementById("campana");
const campaignProgressEl = document.getElementById("campaign-progress");

if (campaignEl) {
    const doneMissions = loadState(CAMPAIGN_STORAGE_KEY);
    const chapterCounters = [];
    const totalEntries = CHAPTERS.reduce((sum, chapter) => sum + chapter.missions.length, 0);
    const progressNowEl = document.getElementById("campaign-progress-now");
    const progressFillEl = document.getElementById("campaign-progress-fill");
    const progressBarEl = document.getElementById("campaign-progress-bar");
    let counter = 0;

    const updateCampaignProgress = () => {
        let complete = 0;

        chapterCounters.forEach(({ chapter, el }) => {
            const chapterDone = chapter.missions.filter((mission) =>
                doneMissions.has(mission.id)
            ).length;
            complete += chapterDone;
            el.textContent = `${chapterDone} de ${chapter.missions.length} completadas`;
            el.classList.toggle("is-complete", chapterDone === chapter.missions.length);
        });

        if (progressNowEl) progressNowEl.textContent = String(complete);
        if (progressFillEl) {
            const ratio = totalEntries ? (complete / totalEntries) * 100 : 0;
            progressFillEl.style.width = `${ratio}%`;
        }
        if (progressBarEl) {
            progressBarEl.setAttribute("aria-valuenow", String(complete));
            progressBarEl.setAttribute("aria-valuemax", String(totalEntries));
        }
        campaignProgressEl?.classList.toggle("is-complete", complete === totalEntries);
    };

    CHAPTERS.forEach((chapter) => {
        const optionals = chapter.missions.filter((mission) => mission.opt).length;

        const article = document.createElement("article");
        article.className = "chapter";
        article.id = `cap-${chapter.n}`;

        const rows = chapter.missions.map((mission, index) => {
            counter += 1;
            const id = `m${chapter.n}-${index + 1}`;
            const number = String(counter).padStart(2, "0");
            const nameClass = mission.spoil
                ? "mission__name mission__name--spoil"
                : "mission__name";

            mission.id = id;

            const item = makeEl("li", "mission");
            item.dataset.mission = id;
            if (doneMissions.has(id)) item.classList.add("is-done");

            const num = makeEl("span", "mission__num", number);
            num.setAttribute("aria-hidden", "true");

            const body = makeEl("div", "mission__body");
            const heading = document.createElement("h3");
            const label = makeEl("label", "mission__label");
            const check = document.createElement("input");
            check.type = "checkbox";
            check.className = "mission__check";
            check.value = id;
            check.checked = doneMissions.has(id);
            check.addEventListener("change", () => {
                if (check.checked) doneMissions.add(id);
                else doneMissions.delete(id);
                item.classList.toggle("is-done", check.checked);
                saveState(doneMissions, CAMPAIGN_STORAGE_KEY);
                updateCampaignProgress();
            });

            label.append(check, makeEl("span", nameClass, mission.name));
            heading.append(label);
            if (mission.opt) heading.append(makeEl("span", "mission__opt", "Opcional"));

            body.append(heading, makeEl("p", null, mission.desc), buildChoices(mission));
            item.append(num, body);
            return item;
        });

        const header = makeEl("header", "chapter__head");
        const optionalText = optionals
            ? ` (${optionals} opcional${optionals > 1 ? "es" : ""})`
            : "";
        const countEl = makeEl("p", "chapter__count");
        chapterCounters.push({ chapter, el: countEl });

        header.append(
            makeEl(
                "p",
                "chapter__kicker",
                `Capítulo ${String(chapter.n).padStart(2, "0")} · ${chapter.missions.length} misiones${optionalText}`
            ),
            makeEl("h3", "chapter__title", chapter.title),
            makeEl("p", "chapter__place", chapter.place),
            makeEl("p", "chapter__summary", chapter.summary),
            countEl
        );

        const track = makeEl("ol", "mission-track");
        track.append(...rows);
        article.append(header, track);
        campaignEl.append(article);

        if (chapterNavEl) {
            const link = document.createElement("a");
            link.href = `#cap-${chapter.n}`;
            link.textContent = `Cap. ${chapter.n} · ${chapter.missions.length}`;
            chapterNavEl.append(link);
        }
    });

    updateCampaignProgress();

    const resetCampaign = () => {
        doneMissions.clear();
        $(".mission__check", campaignEl).forEach((input) => {
            input.checked = false;
            input.closest(".mission")?.classList.remove("is-done");
        });
        saveState(doneMissions, CAMPAIGN_STORAGE_KEY);
        updateCampaignProgress();
    };

    document.getElementById("campaign-reset")?.addEventListener("click", resetCampaign);
    progressResetters.push(resetCampaign);
    progressPersisters.push(() => saveState(doneMissions, CAMPAIGN_STORAGE_KEY));
}

const spoilerFinal = document.getElementById("spoiler-final");

if (spoilerFinal && campaignSection) {
    spoilerFinal.setAttribute("aria-pressed", "false");
    spoilerFinal.addEventListener("click", () => {
        const revealed = campaignSection.classList.toggle("is-revealed");
        spoilerFinal.setAttribute("aria-pressed", String(revealed));
        spoilerFinal.textContent = revealed
            ? "Ocultar nombre del final"
            : "Mostrar nombre del final";
    });
}

if (chapterNavEl && "IntersectionObserver" in window) {
    const chapterLinks = $$("a", chapterNavEl);
    const chapterSpy = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                chapterLinks.forEach((link) => {
                    link.classList.toggle(
                        "is-current",
                        link.getAttribute("href") === `#${entry.target.id}`
                    );
                });
            });
        },
        { rootMargin: "-25% 0px -65% 0px", threshold: 0 }
    );
    $$(".chapter", campaignEl).forEach((chapter) => chapterSpy.observe(chapter));
}

/* ---------- Misiones secundarias ---------- */

const sideQuestsEl = $("#side-quests");
const sideIndexEl = $("#side-index");
const hiddenQuestsBody = $("#hidden-quests-body");

if (sideQuestsEl) {
    SIDE_QUESTS.forEach((quest) => {
        const article = makeEl("article", "chapter side-quest");
        article.id = `sec-${quest.id}`;

        const header = makeEl("header", "chapter__head");
        header.append(
            makeEl("p", "chapter__kicker", `Capítulo ${quest.chapter} · ${quest.giver}`),
            makeEl("h3", "chapter__title", quest.title),
            makeEl("p", "chapter__place", quest.place),
            makeEl("p", "chapter__summary", quest.summary)
        );

        const facts = makeEl("ul", "side-quest__facts");
        [
            ["Quién", quest.who],
            ["Misiones", String(quest.missions.length)],
            ["Recompensa", quest.reward],
            ["Perdible", quest.missable],
        ].forEach(([label, value]) => {
            const fact = makeEl("li");
            fact.append(makeEl("span", null, label), makeEl("strong", null, value));
            facts.append(fact);
        });
        header.append(facts);
        article.append(header);

        const track = makeEl("ol", "mission-track");
        quest.missions.forEach((mission, index) => {
            const item = makeEl("li", "mission");
            const num = makeEl("span", "mission__num", String(index + 1).padStart(2, "0"));
            num.setAttribute("aria-hidden", "true");

            const body = makeEl("div", "mission__body");
            const heading = document.createElement("h4");
            heading.append(makeEl("span", "mission__name", mission.name));
            body.append(heading, makeEl("p", null, mission.desc));
            item.append(num, body);
            track.append(item);
        });
        article.append(track);

        const tip = makeEl("p", "side-quest__tip");
        tip.append(makeEl("strong", null, "Aviso. "), document.createTextNode(quest.tip));
        article.append(tip);
        sideQuestsEl.append(article);

        if (sideIndexEl) {
            const link = document.createElement("a");
            link.href = `#sec-${quest.id}`;
            link.textContent = quest.title;
            sideIndexEl.append(link);
        }
    });
}

if (hiddenQuestsBody) {
    HIDDEN_QUESTS.forEach((quest) => {
        const row = document.createElement("tr");
        const name = document.createElement("th");
        name.scope = "row";
        name.textContent = quest.name;
        [
            ["Cómo empieza", quest.start],
            ["Qué hay que hacer", quest.steps],
            ["Recompensa", quest.reward],
        ].forEach(([label, value]) => {
            const cell = document.createElement("td");
            cell.dataset.label = label;
            cell.textContent = value;
            row.append(cell);
        });
        row.prepend(name);
        hiddenQuestsBody.append(row);
    });
}

/* ---------- Checklist 100% ---------- */

const list = $("#check-list");
const count = $("#check-count");
const fill = $("#check-fill");
const bar = $("#check-progress");

if (list) {
    const state = loadState();
    const total = CHECKLIST.length;

    CHECKLIST.forEach((item) => {
        const li = document.createElement("li");
        li.className = "check-item";
        li.dataset.group = item.group;

        const label = document.createElement("label");
        const input = document.createElement("input");
        input.type = "checkbox";
        input.value = item.id;
        input.checked = state.has(item.id);

        const box = document.createElement("span");
        box.className = "check-box";
        box.setAttribute("aria-hidden", "true");

        const text = document.createElement("span");
        text.className = "check-text";

        const title = document.createElement("strong");
        title.textContent = item.title;

        const detail = document.createElement("small");
        detail.textContent = item.detail;

        text.append(title, detail);
        label.append(input, box, text);
        li.append(label);
        list.append(li);
    });

    const update = () => {
        const done = state.size;
        if (count) count.textContent = String(done);
        const percent = (done / total) * 100;
        if (fill) fill.style.width = `${percent}%`;
        if (bar) {
            bar.setAttribute("aria-valuenow", String(done));
            bar.setAttribute("aria-valuemax", String(total));
            bar.setAttribute("aria-valuetext", `${done} de ${total} requisitos completados`);
        }
    };

    update();

    list.addEventListener("change", (event) => {
        const input = event.target.closest("input[type='checkbox']");
        if (!input) return;

        if (input.checked) state.add(input.value);
        else state.delete(input.value);

        saveState(state);
        update();
    });

    $("#check-reset")?.addEventListener("click", () => {
        state.clear();
        saveState(state);
        $$("input[type='checkbox']", list).forEach((input) => {
            input.checked = false;
        });
        update();
    });

    $$(".checklist__filters .chip").forEach((chip) => {
        chip.addEventListener("click", () => {
            $$(".checklist__filters .chip").forEach((other) => {
                other.classList.toggle("is-active", other === chip);
            });

            const filter = chip.dataset.filter;
            $$(".check-item", list).forEach((item) => {
                item.hidden = filter !== "all" && item.dataset.group !== filter;
            });
        });
    });

    progressResetters.push(() => {
        state.clear();
        $$("input[type='checkbox']", list).forEach((input) => {
            input.checked = false;
        });
        update();
    });

    progressPersisters.push(() => saveState(state));
}

/* ---------- Consentimiento de almacenamiento ---------- */

const storageBanner = $("#storage-banner");
const storageOpen = $("#storage-open");
const storageAccept = $("#storage-accept");
const storageDelete = $("#storage-delete");
const storageClose = $("#storage-close");
const storageActions = $("#storage-actions");
const storageConfirm = $("#storage-confirm");
const storageConfirmText = $("#storage-confirm-text");
const storageConfirmDelete = $("#storage-confirm-delete");
const storageCancel = $("#storage-cancel");
const storageStatus = $("#storage-status");

const plural = (count, singular, pluralForm) => `${count} ${count === 1 ? singular : pluralForm}`;

const countSavedProgress = () => {
    const store = getStore();
    const empty = { checklist: 0, campaign: 0 };
    if (!store) return empty;

    try {
        const checklist = JSON.parse(store.getItem(STORAGE_KEY) ?? "[]");
        const campaign = JSON.parse(store.getItem(CAMPAIGN_STORAGE_KEY) ?? "[]");
        return {
            checklist: Array.isArray(checklist) ? checklist.length : 0,
            campaign: Array.isArray(campaign) ? campaign.length : 0,
        };
    } catch {
        return empty;
    }
};

const consentMessage = () => {
    const status = consentStatus();
    const saved = countSavedProgress();

    if (status === "unavailable") {
        return "Este navegador bloquea el almacenamiento local: el progreso no se puede guardar.";
    }
    if (status === "granted") {
        return `Guardado activo: ${plural(saved.checklist, "requisito", "requisitos")} de la checklist y ${plural(saved.campaign, "misión", "misiones")} de Campaña.`;
    }
    if (status === "denied") {
        return "Guardado desactivado y datos eliminados. Las marcas de esta visita no se guardarán.";
    }
    if (saved.checklist || saved.campaign) {
        return `Hay ${plural(saved.checklist, "requisito", "requisitos")} y ${plural(saved.campaign, "misión", "misiones")} guardadas de una visita anterior. Acepta para seguir guardando.`;
    }
    return "Todavía no has aceptado el guardado. Puedes seguir marcando casillas, pero se perderán al cerrar.";
};

const updateStorageBanner = (message = consentMessage()) => {
    if (!storageBanner) return;

    const status = consentStatus();
    if (storageStatus) storageStatus.textContent = message;

    if (storageAccept) {
        storageAccept.hidden = status === "granted" || status === "unavailable";
        storageAccept.textContent = status === "denied" ? "Activar guardado" : "Aceptar y guardar";
    }

    if (storageDelete) storageDelete.hidden = status === "unavailable";

    if (storageOpen) {
        const labels = {
            granted: "Datos y privacidad: guardado activo",
            denied: "Datos y privacidad: guardado desactivado",
            pending: "Datos y privacidad: pendiente de aceptar",
            unavailable: "Datos y privacidad: sin almacenamiento",
        };
        storageOpen.setAttribute("aria-label", labels[status]);
    }
};

const resetStorageConfirm = () => {
    if (storageConfirm) storageConfirm.hidden = true;
    if (storageActions) storageActions.hidden = false;
};

function openStorageBanner(focus = true) {
    if (!storageBanner) return;

    resetStorageConfirm();
    storageBanner.hidden = false;
    storageOpen?.setAttribute("aria-expanded", "true");
    updateStorageBanner();

    if (focus) {
        const first = storageAccept && !storageAccept.hidden ? storageAccept : storageClose;
        first?.focus();
    }
}

function closeStorageBanner() {
    if (!storageBanner) return;

    storageBanner.hidden = true;
    storageOpen?.setAttribute("aria-expanded", "false");
    resetStorageConfirm();
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && storageBanner && !storageBanner.hidden) {
        closeStorageBanner();
        storageOpen?.focus();
    }
});

storageOpen?.addEventListener("click", () => {
    if (!storageBanner) return;
    if (storageBanner.hidden) openStorageBanner();
    else closeStorageBanner();
});

storageClose?.addEventListener("click", closeStorageBanner);

storageAccept?.addEventListener("click", () => {
    const store = getStore();
    if (!store) return;

    try {
        store.setItem(CONSENT_KEY, "granted");
    } catch {
        return;
    }

    progressPersisters.forEach((persist) => persist());
    resetStorageConfirm();
    updateStorageBanner(
        "Guardado activado. A partir de ahora tus marcas se conservan en este navegador."
    );
});

storageDelete?.addEventListener("click", () => {
    const saved = countSavedProgress();
    const total = saved.checklist + saved.campaign;

    if (storageConfirmText) {
        storageConfirmText.textContent = total
            ? `Se borrarán ${plural(saved.checklist, "requisito", "requisitos")} de la checklist y ${plural(saved.campaign, "misión", "misiones")} de Campaña. No se puede deshacer.`
            : "Todavía no hay datos guardados. Al continuar, el guardado queda desactivado y no se guardará nada en este navegador.";
    }

    if (storageActions) storageActions.hidden = true;
    if (storageConfirm) storageConfirm.hidden = false;
    storageConfirmDelete?.focus();
});

storageCancel?.addEventListener("click", () => {
    resetStorageConfirm();
    const first = storageDelete && !storageDelete.hidden ? storageDelete : storageClose;
    first?.focus();
});

storageConfirmDelete?.addEventListener("click", () => {
    const store = getStore();

    if (store) {
        try {
            store.removeItem(STORAGE_KEY);
            store.removeItem(CAMPAIGN_STORAGE_KEY);
            store.removeItem(CONSENT_KEY);
            store.setItem(CONSENT_KEY, "denied");
        } catch {
            /* sin almacenamiento que borrar */
        }
    }

    progressResetters.forEach((reset) => reset());
    resetStorageConfirm();
    updateStorageBanner(
        "Datos borrados. El guardado queda desactivado y las casillas empiezan de cero."
    );
});

if (storageBanner) {
    $$("a", storageBanner).forEach((link) => link.addEventListener("click", closeStorageBanner));
    updateStorageBanner();

    if (consentStatus() === "pending") {
        window.setTimeout(() => {
            if (storageBanner.hidden) openStorageBanner(false);
        }, 900);
    }
}

/* ---------- Arranque de la vista ---------- */

// Se resuelve al final, cuando Campaña, Secundarias y Progreso ya han creado sus anclas.
if (views.length) route(window.location.hash, { focus: false });
