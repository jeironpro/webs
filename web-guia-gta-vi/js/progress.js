/* Guía GTA VI · Progreso: categorías, apartados y fichas */

import { PROGRESS, PROGRESS_TOTAL, countEntries } from "./progress-data.js";

const PLACEHOLDER_TITLE = "Sin título";
const ACCENTS = ["#ff2d78", "#ff7a1a", "#ffc857", "#7b2ff7", "#2ad4c3"];

const app = document.getElementById("progreso-app");
const view = document.getElementById("progreso-view");
const crumbs = document.getElementById("progreso-crumbs");
const back = document.getElementById("progreso-back");
const summary = document.getElementById("progreso-summary");
const totalLabel = document.getElementById("progreso-total");

let path = [];

const currentCategory = () => path[0] ?? null;
const currentImage = (node) =>
    node.image ?? currentCategory()?.image ?? "./assets/cover-oficial.jpg";

function itemTitle(item) {
    if (typeof item === "string") return item;
    return item.title ?? PLACEHOLDER_TITLE;
}

function isPlaceholder(item) {
    return typeof item === "object" && item !== null && !item.title;
}

function makeCard({ title, kicker, meta, image, tall, index, placeholder, onSelect }) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `pcard${tall ? " pcard--tall" : ""}${placeholder ? " pcard--placeholder" : ""}`;
    button.style.setProperty("--pcard-accent", ACCENTS[index % ACCENTS.length]);

    const bg = document.createElement("span");
    bg.className = "pcard__bg";
    bg.setAttribute("aria-hidden", "true");
    bg.style.backgroundImage = `url("${image}")`;

    const body = document.createElement("span");
    body.className = "pcard__body";

    if (kicker) {
        const kickerEl = document.createElement("span");
        kickerEl.className = "pcard__kicker";
        kickerEl.textContent = kicker;
        body.append(kickerEl);
    }

    const titleEl = document.createElement("span");
    titleEl.className = "pcard__title";
    titleEl.textContent = title;
    body.append(titleEl);

    if (meta) {
        const metaEl = document.createElement("span");
        metaEl.className = "pcard__meta";
        metaEl.textContent = meta;
        body.append(metaEl);
    }

    button.append(bg, body);
    button.addEventListener("click", onSelect);
    return button;
}

function buildGrid(cards, variant) {
    const grid = document.createElement("div");
    grid.className = variant ? `pgrid pgrid--${variant}` : "pgrid";
    grid.append(...cards);
    return grid;
}

function renderCategories() {
    const cards = PROGRESS.map((category, index) =>
        makeCard({
            title: category.title,
            kicker: category.kicker,
            meta: `${countEntries(category)} fichas`,
            image: currentImage(category),
            tall: true,
            index,
            onSelect: () => {
                path = [category];
                render(true);
            },
        })
    );

    view.append(buildGrid(cards, "tall"));
}

function renderGroups(node, image) {
    const cards = node.groups.map((group, index) => {
        const children = countEntries(group);
        const label = group.groups ? `${group.groups.length} apartados` : `${children} fichas`;

        return makeCard({
            title: group.title ?? PLACEHOLDER_TITLE,
            kicker: String(index + 1).padStart(2, "0"),
            meta: label,
            image,
            index,
            placeholder: Boolean(group.placeholder),
            onSelect: () => {
                path = [...path, group];
                render(true);
            },
        });
    });

    view.append(buildGrid(cards));
}

function renderItems(node, image) {
    const items = node.items;
    const cards = items.map((item, index) =>
        makeCard({
            title: itemTitle(item),
            kicker: String(index + 1).padStart(2, "0"),
            image,
            index,
            placeholder: isPlaceholder(item),
        })
    );

    view.append(buildGrid(cards));

    if (items.some(isPlaceholder)) {
        const note = document.createElement("p");
        note.className = "progreso__note";
        note.textContent =
            "Las fichas «Sin título» todavía no tienen nombre confirmado: aparecen con el título por defecto.";
        view.append(note);
    }
}

function renderCheats(node) {
    const list = document.createElement("ul");
    list.className = "cheat-list";

    node.list.forEach(([name, code]) => {
        const item = document.createElement("li");
        item.className = "cheat";

        const nameEl = document.createElement("span");
        nameEl.className = "cheat__name";
        nameEl.textContent = name;

        const codeEl = document.createElement("code");
        codeEl.className = "cheat__code";
        codeEl.textContent = code;

        item.append(nameEl, codeEl);
        list.append(item);
    });

    view.append(list);
}

function renderCrumbs() {
    crumbs.replaceChildren();

    const root = document.createElement("button");
    root.type = "button";
    root.className = "progreso__crumb";
    root.textContent = "Progreso";
    root.addEventListener("click", () => {
        path = [];
        render(true);
    });
    crumbs.append(root);

    path.forEach((node, index) => {
        const separator = document.createElement("span");
        separator.className = "progreso__sep";
        separator.setAttribute("aria-hidden", "true");
        separator.textContent = "/";
        crumbs.append(separator);

        if (index === path.length - 1) {
            const current = document.createElement("span");
            current.className = "progreso__crumb is-current";
            current.setAttribute("aria-current", "page");
            current.textContent = node.title ?? PLACEHOLDER_TITLE;
            crumbs.append(current);
            return;
        }

        const button = document.createElement("button");
        button.type = "button";
        button.className = "progreso__crumb";
        button.textContent = node.title ?? PLACEHOLDER_TITLE;
        button.addEventListener("click", () => {
            path = path.slice(0, index + 1);
            render(true);
        });
        crumbs.append(button);
    });
}

function render(moveFocus = false) {
    const node = path[path.length - 1] ?? null;

    view.replaceChildren();
    renderCrumbs();

    back.hidden = path.length === 0;

    if (!node) {
        renderCategories();
        if (summary)
            summary.textContent = `${PROGRESS.length} categorías · ${PROGRESS_TOTAL} fichas`;
        if (totalLabel) totalLabel.textContent = String(PROGRESS_TOTAL);
    } else {
        const image = currentImage(node);
        if (node.list) renderCheats(node);
        else if (node.groups) renderGroups(node, image);
        else renderItems(node, image);

        if (totalLabel) totalLabel.textContent = String(countEntries(node));
    }

    if (moveFocus) {
        const first = view.querySelector("button, .cheat");
        if (first) {
            if (first.classList.contains("cheat")) first.setAttribute("tabindex", "-1");
            first.focus({ preventScroll: true });
        }
    }
}

if (app && view && crumbs && back) {
    back.addEventListener("click", () => {
        path = path.slice(0, -1);
        render(true);
    });

    app.addEventListener("keydown", (event) => {
        if (event.key !== "Escape" || path.length === 0) return;
        event.preventDefault();
        path = path.slice(0, -1);
        render(true);
    });

    render();
}
