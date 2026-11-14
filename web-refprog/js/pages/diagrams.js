import { getDiagramName, getDiagrams } from "../services/contentService.js";
import { qs } from "../utils/dom.js";
import { initActiveNav, initMobileMenu } from "../modules/navigation.js";

function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
}

function createDiagramCard(diagram) {
    const name = getDiagramName(diagram.name);
    const card = createElement("article", "diagram-card");
    const preview = createElement("div", "diagram-preview");
    const image = document.createElement("img");
    image.src = diagram.path;
    image.alt = name;
    image.loading = "lazy";
    preview.append(image);
    card.append(preview, createElement("h2", "diagram-card-title", name));
    return card;
}

function showError(container, message) {
    container.replaceChildren(createElement("div", "info-error", message));
}

function initDiagrams() {
    const container = qs("#diagram-container");
    if (!container) return;

    try {
        const diagrams = getDiagrams();
        if (diagrams.length === 0) {
            showError(container, "No se encontraron diagramas.");
            return;
        }

        container.replaceChildren(...diagrams.map(createDiagramCard));
    } catch {
        showError(container, "Error al cargar los diagramas.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    initMobileMenu();
    initActiveNav();
    initDiagrams();
});
