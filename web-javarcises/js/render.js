// Renderizado seguro de los datos estructurados a DOM.
// Regla del proyecto: nunca se inyecta HTML (innerHTML/insertAdjacentHTML);
// todo se construye con createElement/textContent, por lo que el contenido
// de los ejercicios (markdown ya parseado) no puede inyectar marcado.

import { pageNumbers } from "./paginacion.js";
import { highlightJavaInto } from "./syntax-highlight.js";

/**
 * Crea un icono de Material Symbols (decorativo: aria-hidden).
 * @param {string} name Nombre del glifo (p. ej. "star", "arrow_forward").
 * @returns {HTMLSpanElement}
 */
export function createIcon(name) {
    const icon = document.createElement("span");
    icon.className = "material-symbols-outlined icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = name;
    return icon;
}

/**
 * Convierte texto con marcas inline (`**negrita**` y `` `código` ``) en un
 * fragmento de nodos de texto/strong/code. La negrita se usa como énfasis
 * de lectura; el código se renderiza con la fuente monoespaciada.
 * @param {string} text
 * @returns {DocumentFragment}
 */
export function renderRichText(text) {
    const fragment = document.createDocumentFragment();
    // Divide el texto en tokens: negrita, itálica, código o texto plano.
    const tokens = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g);
    for (const token of tokens) {
        if (token === "") {
            continue;
        }
        if (token.startsWith("**") && token.endsWith("**") && token.length > 4) {
            const strong = document.createElement("strong");
            strong.textContent = token.slice(2, -2);
            fragment.append(strong);
        } else if (token.startsWith("`") && token.endsWith("`") && token.length > 2) {
            const code = document.createElement("code");
            code.textContent = token.slice(1, -1);
            fragment.append(code);
        } else if (token.startsWith("*") && token.endsWith("*") && token.length > 2) {
            const emphasis = document.createElement("em");
            emphasis.textContent = token.slice(1, -1);
            fragment.append(emphasis);
        } else {
            fragment.append(document.createTextNode(token));
        }
    }
    return fragment;
}

/** Renderiza la dificultad (1–5) como cinco iconos de estrella. */
export function renderStars(difficulty) {
    const container = document.createElement("span");
    container.className = "difficulty";
    container.setAttribute("role", "img");
    container.setAttribute("aria-label", `Dificultad: ${difficulty} de 5`);
    for (let i = 1; i <= 5; i += 1) {
        const icon = createIcon("star");
        icon.classList.add("difficulty__star");
        if (i > difficulty) {
            icon.classList.add("difficulty__star--empty");
        }
        container.append(icon);
    }
    return container;
}

/**
 * Renderiza un bloque de código como panel claro con hairline y, si se
 * indica una etiqueta (p. ej. el lenguaje), una cabecera sin chrome falso.
 * Para Java, aplica resaltado de sintaxis con nodos DOM seguros.
 */
function renderCodeBlock(code, label = "") {
    const container = document.createElement("div");
    container.className = "block__code";
    if (label) {
        const header = document.createElement("div");
        header.className = "block__code-header";
        const text = document.createElement("span");
        text.textContent = label;
        header.append(text);
        container.append(header);
    }
    const pre = document.createElement("pre");
    pre.className = "block__code-body";
    const codeElement = document.createElement("code");

    // Aplicar resaltado de sintaxis solo para Java.
    if (label.toLowerCase() === "java") {
        highlightJavaInto(pre, code);
    } else {
        codeElement.textContent = code;
        pre.append(codeElement);
    }

    container.append(pre);
    return container;
}

/** Renderiza un bloque tipado (paragraph | list | code | example | hint). */
export function renderBlock(block) {
    switch (block.type) {
        case "paragraph": {
            const paragraph = document.createElement("p");
            paragraph.className = "block__paragraph";
            paragraph.append(renderRichText(block.text));
            return paragraph;
        }
        case "list": {
            const list = document.createElement(block.ordered ? "ol" : "ul");
            list.className = block.ordered ? "block__list block__list--ordered" : "block__list";
            for (const item of block.items) {
                const element = document.createElement("li");
                element.append(renderRichText(item));
                list.append(element);
            }
            return list;
        }
        case "code":
            return renderCodeBlock(block.code, block.language || "");
        case "example": {
            const figure = document.createElement("figure");
            figure.className = "example";
            const caption = document.createElement("figcaption");
            caption.className = "example__title";
            caption.textContent = block.title;
            figure.append(caption, renderCodeBlock(block.code));
            return figure;
        }
        case "hint": {
            const details = document.createElement("details");
            details.className = "hint";
            const summary = document.createElement("summary");
            summary.className = "hint__summary";
            summary.append(createIcon("lightbulb"), renderRichText(block.summary));
            details.append(summary);
            const content = document.createElement("div");
            content.className = "hint__content";
            content.append(renderBlocks(block.content));
            details.append(content);
            return details;
        }
        default:
            // Bloque desconocido: no debería ocurrir con los datos generados.
            return document.createElement("p");
    }
}

/** Renderiza una lista de bloques en orden. */
export function renderBlocks(blocks) {
    const fragment = document.createDocumentFragment();
    for (const block of blocks) {
        fragment.append(renderBlock(block));
    }
    return fragment;
}

/**
 * Renderiza la ficha (tarjeta) de un ejercicio. Toda la tarjeta es un único
 * enlace para que el teclado tenga un solo punto de tabulación.
 * @param {object} item Ítem estructurado (ver scripts/extraer-datos.js).
 * @returns {HTMLElement}
 */
export function renderCard(item) {
    const article = document.createElement("article");
    article.className = "card";

    const link = document.createElement("a");
    link.className = "card__link";
    link.href = `#/card/${item.collection}/${item.number}`;
    link.setAttribute(
        "aria-label",
        `Ver ficha ${String(item.number).padStart(3, "0")}: ${item.title}`
    );

    // Eyebrow: tipo de ficha + número (mono minúscula, acento).
    const eyebrow = document.createElement("p");
    eyebrow.className = "card__eyebrow";
    eyebrow.textContent = `${item.collection === "exercises" ? "ejercicio" : "problema"} ${String(item.number).padStart(3, "0")}`;
    link.append(eyebrow);

    const title = document.createElement("h2");
    title.className = "card__title";
    title.textContent = item.title;
    link.append(title);

    // Metadatos: badge de nivel (con color por nivel) + dificultad.
    const meta = document.createElement("div");
    meta.className = "card__meta";
    const level = document.createElement("span");
    level.className = `badge badge--level-${item.level}`;
    level.textContent = `Nivel ${item.level} · ${item.levelName}`;
    meta.append(level, renderStars(item.difficulty));
    link.append(meta);

    // Fila de chips: en los ejercicios son los temas; en los problemas de diseño,
    // la categoría. Así ambas fichas comparten exactamente la misma estructura.
    const topics = document.createElement("ul");
    topics.className = "card__topics";
    const chips = item.collection === "problems" ? [item.category] : item.topics;
    for (const text of chips) {
        if (!text) {
            continue;
        }
        const chip = document.createElement("li");
        chip.className = "chip";
        chip.textContent = text.replaceAll("`", "");
        topics.append(chip);
    }
    link.append(topics);

    const footer = document.createElement("p");
    footer.className = "card__footer";
    footer.append(document.createTextNode("ver ficha"), createIcon("arrow_forward"));
    link.append(footer);

    article.append(link);
    return article;
}

/**
 * Renderiza el paginador: anterior, páginas (con elipsis) y siguiente.
 * @param {{page: number, totalPages: number, onGoToPage: Function}} options
 * @returns {HTMLElement}
 */
export function renderPagination({ page, totalPages, onGoToPage }) {
    const nav = document.createElement("nav");
    nav.className = "pagination";
    nav.setAttribute("aria-label", "Paginación de fichas");

    nav.append(
        createPaginationButton("Anterior", "chevron_left", page <= 1, () => onGoToPage(page - 1))
    );

    for (const entry of pageNumbers(page, totalPages)) {
        if (entry.type === "ellipsis") {
            const ellipsis = document.createElement("span");
            ellipsis.className = "pagination__ellipsis";
            ellipsis.textContent = "…";
            ellipsis.setAttribute("aria-hidden", "true");
            nav.append(ellipsis);
            continue;
        }
        const button = createPaginationButton(String(entry.number), null, false, () =>
            onGoToPage(entry.number)
        );
        if (entry.number === page) {
            button.classList.add("pagination__button--active");
            button.setAttribute("aria-current", "page");
        }
        nav.append(button);
    }

    nav.append(
        createPaginationButton("Siguiente", "chevron_right", page >= totalPages, () =>
            onGoToPage(page + 1)
        )
    );
    return nav;
}

/** Botón del paginador: nativo, con icono opcional. */
function createPaginationButton(label, icon, disabled, onClick) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "pagination__button";
    if (icon) {
        button.append(createIcon(icon));
    }
    button.append(document.createTextNode(label));
    button.disabled = disabled;
    button.addEventListener("click", onClick);
    return button;
}

/**
 * Renderiza la vista de detalle de un ejercicio con todas sus secciones.
 * @param {object} item Ítem actual.
 * @param {object} collection Colección a la que pertenece (para navegar).
 * @param {object|null} previous Ítem previo de la colección.
 * @param {object|null} next Ítem siguiente de la colección.
 * @returns {HTMLElement}
 */
export function renderDetail(item, collection, previous, next) {
    const article = document.createElement("article");
    article.className = "detail";

    // Cabecera de navegación: volver + miga de pan.
    const topNav = document.createElement("nav");
    topNav.className = "detail__top-nav";
    topNav.setAttribute("aria-label", "Navegación superior");
    const backLink = document.createElement("a");
    backLink.className = "detail__back";
    backLink.href = "#/";
    backLink.append(createIcon("arrow_back"), document.createTextNode("Volver al listado"));
    const breadcrumb = document.createElement("span");
    breadcrumb.className = "detail__breadcrumb";
    breadcrumb.textContent = `${collection.name} / ${String(item.number).padStart(3, "0")}`;
    topNav.append(backLink, breadcrumb);
    article.append(topNav);

    // Encabezado de la ficha: eyebrow + titular serif + especificación.
    const header = document.createElement("header");
    header.className = "detail__header";

    const eyebrow = document.createElement("p");
    eyebrow.className = "card__eyebrow";
    eyebrow.textContent = `${item.collection === "exercises" ? "ejercicio" : "problema"} ${String(item.number).padStart(3, "0")}`;
    header.append(eyebrow);

    const title = document.createElement("h1");
    title.className = "detail__title";
    title.id = "card-title";
    title.tabIndex = -1;
    title.textContent = item.title;
    header.append(title);

    // Especificación de la ficha: pares clave/valor en mono.
    const spec = document.createElement("dl");
    spec.className = "spec";

    const levelRow = document.createElement("div");
    levelRow.className = "spec__row";
    const dtLevel = document.createElement("dt");
    dtLevel.textContent = "Nivel";
    const ddLevel = document.createElement("dd");
    const levelBadge = document.createElement("span");
    levelBadge.className = `badge badge--level-${item.level}`;
    levelBadge.textContent = `${item.level} · ${item.levelName}`;
    ddLevel.append(levelBadge);
    levelRow.append(dtLevel, ddLevel);
    spec.append(levelRow);

    const difficultyRow = document.createElement("div");
    difficultyRow.className = "spec__row";
    const dtDifficulty = document.createElement("dt");
    dtDifficulty.textContent = "Dificultad";
    const ddDifficulty = document.createElement("dd");
    ddDifficulty.append(renderStars(item.difficulty));
    difficultyRow.append(dtDifficulty, ddDifficulty);
    spec.append(difficultyRow);

    if (item.category) {
        const categoryRow = document.createElement("div");
        categoryRow.className = "spec__row";
        const dtCategory = document.createElement("dt");
        dtCategory.textContent = "Categoría";
        const ddCategory = document.createElement("dd");
        ddCategory.textContent = item.category;
        categoryRow.append(dtCategory, ddCategory);
        spec.append(categoryRow);
    }

    if (item.oopFocus) {
        const focusRow = document.createElement("div");
        focusRow.className = "spec__row";
        const dtFocus = document.createElement("dt");
        dtFocus.textContent = "Enfoque POO";
        const ddFocus = document.createElement("dd");
        ddFocus.textContent = item.oopFocus;
        focusRow.append(dtFocus, ddFocus);
        spec.append(focusRow);
    }

    header.append(spec);

    if (item.topics.length > 0) {
        const topicsGroup = document.createElement("div");
        topicsGroup.className = "detail__topics";
        const topicsLabel = document.createElement("span");
        topicsLabel.className = "detail__topics-label";
        topicsLabel.textContent = "Temas";
        topicsGroup.append(topicsLabel);
        const topics = document.createElement("ul");
        topics.className = "detail__topics-list";
        for (const topic of item.topics) {
            const chip = document.createElement("li");
            chip.className = "chip";
            chip.textContent = topic.replaceAll("`", "");
            topics.append(chip);
        }
        topicsGroup.append(topics);
        header.append(topicsGroup);
    }
    article.append(header);

    // Cuerpo: secciones.
    const body = document.createElement("div");
    body.className = "detail__body";
    for (const section of item.sections) {
        const sectionElement = document.createElement("section");
        sectionElement.className = "detail__section";
        const sectionTitle = document.createElement("h2");
        sectionTitle.className = "detail__section-title";
        // Se descartan los paréntesis de metadato del markdown (p. ej. "(opcional, ocultables)").
        sectionTitle.textContent = section.title.replace(/\s*\([^)]*\)\s*$/, "");
        const content = document.createElement("div");
        content.className = "detail__section-content";
        content.append(renderBlocks(section.blocks));
        sectionElement.append(sectionTitle, content);
        body.append(sectionElement);
    }
    article.append(body);

    // Navegación entre fichas (anterior/siguiente).
    const cardNav = document.createElement("nav");
    cardNav.className = "detail__card-nav";
    cardNav.setAttribute("aria-label", "Fichas anterior y siguiente");
    cardNav.append(
        createCardNavLink(previous, "Anterior", "chevron_left", true),
        createCardNavLink(next, "Siguiente", "chevron_right", false)
    );
    article.append(cardNav);

    return article;
}

/** Enlace "Anterior/Siguiente" de una ficha (o placeholder si no existe). */
function createCardNavLink(item, label, icon, isPrevious) {
    const container = document.createElement("div");
    container.className = "detail__card-nav-item";
    if (!item) {
        const empty = document.createElement("span");
        empty.className = "detail__card-nav-empty";
        empty.append(createIcon(icon), document.createTextNode(label));
        container.append(empty);
        return container;
    }
    const link = document.createElement("a");
    link.className = "detail__card-nav-link";
    link.href = `#/card/${item.collection}/${item.number}`;
    const row = document.createElement("span");
    row.className = "detail__card-nav-row";
    if (isPrevious) {
        row.append(createIcon(icon), document.createTextNode(label));
    } else {
        row.append(document.createTextNode(label), createIcon(icon));
    }
    const title = document.createElement("span");
    title.className = "detail__card-nav-title";
    title.textContent = `${String(item.number).padStart(3, "0")} · ${item.title}`;
    link.append(row, title);
    container.append(link);
    return container;
}

/**
 * Estado vacío: sin resultados para los filtros actuales.
 * @param {{icon?: string, title?: string, message?: string, action?: {label: string, href?: string, onClick?: Function}}} options
 * @returns {HTMLElement}
 */
export function renderEmpty({
    icon = "search_off",
    title = "Sin resultados",
    message = "",
    action = null,
} = {}) {
    const container = document.createElement("div");
    container.className = "empty";
    const iconElement = createIcon(icon);
    iconElement.classList.add("empty__icon");
    container.append(iconElement);
    const titleElement = document.createElement("h2");
    titleElement.className = "empty__title";
    titleElement.textContent = title;
    container.append(titleElement);
    const text = document.createElement("p");
    text.className = "empty__text";
    text.textContent = message;
    container.append(text);
    if (action) {
        const button = document.createElement(action.href ? "a" : "button");
        button.className = "btn btn--ghost";
        button.textContent = action.label;
        if (action.href) {
            button.href = action.href;
        } else {
            button.type = "button";
            button.addEventListener("click", action.onClick);
        }
        container.append(button);
    }
    return container;
}
