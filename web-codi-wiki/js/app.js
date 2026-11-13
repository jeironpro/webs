import { wikiData } from "./data.js";

const languageList = document.querySelector("#language-list");
const paradigmList = document.querySelector("#paradigm-list");
const welcomeScreen = document.querySelector("#welcome-screen");
const detailView = document.querySelector("#detail-view");
const mainContent = document.querySelector("#main-content");

if (!languageList || !paradigmList || !welcomeScreen || !detailView || !mainContent) {
    throw new Error("No se encontraron los elementos de la wiki");
}

const createElement = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
};

const renderMenu = () => {
    const sections = [
        { items: wikiData.languages, type: "language", container: languageList },
        { items: wikiData.paradigms, type: "paradigm", container: paradigmList },
    ];

    sections.forEach(({ items, type, container }) => {
        items.forEach((item) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "nav-item";
            button.textContent = item.name;
            button.dataset.id = item.id;
            button.dataset.type = type;
            button.addEventListener("click", () => showContent(item));
            container.append(button);
        });
    });
};

const showContent = (item) => {
    document.querySelectorAll(".nav-item").forEach((element) => {
        element.classList.remove("is-active");
    });
    document.querySelector(`.nav-item[data-id="${item.id}"]`)?.classList.add("is-active");

    welcomeScreen.classList.add("is-hidden");
    detailView.classList.remove("is-hidden");
    mainContent.scrollTop = 0;
    detailView.replaceChildren();

    const header = createElement("header", "detail-header");
    header.append(
        createElement("span", "type-label", item.label),
        createElement("h2", "detail-title", item.name),
        createElement("p", "detail-description", item.description)
    );
    detailView.append(header);

    const historyBlock = createElement("section", "section-block");
    historyBlock.append(
        createElement("h3", null, "Historia y Origen"),
        createElement("p", null, item.history)
    );
    detailView.append(historyBlock);

    const usesList = createElement("ul", "uses-list");
    item.uses.forEach((use) => {
        usesList.append(createElement("li", null, use));
    });

    const usesBlock = createElement("section", "section-block");
    usesBlock.append(createElement("h3", null, "Usos Principales"), usesList);
    detailView.append(usesBlock);

    const prosList = createElement("ul", "check-list");
    item.pros.forEach((pro) => {
        prosList.append(createElement("li", null, pro));
    });

    const consList = createElement("ul", "cross-list");
    item.cons.forEach((con) => {
        consList.append(createElement("li", null, con));
    });

    const prosColumn = createElement("div", "column");
    prosColumn.append(createElement("h4", null, "Ventajas"), prosList);

    const consColumn = createElement("div", "column");
    consColumn.append(createElement("h4", null, "Desventajas"), consList);

    const prosCons = createElement("div", "pros-cons");
    prosCons.append(prosColumn, consColumn);

    const analysisBlock = createElement("section", "section-block");
    analysisBlock.append(createElement("h3", null, "Análisis"), prosCons);
    detailView.append(analysisBlock);

    const code = createElement("code", null, item.example);
    const pre = createElement("pre", "code-block");
    pre.append(code);

    const codeBlock = createElement("section", "section-block");
    codeBlock.append(createElement("h3", null, "Código de Ejemplo"), pre);
    detailView.append(codeBlock);

    detailView.classList.remove("view-active");
    void detailView.offsetWidth;
    detailView.classList.add("view-active");
};

renderMenu();
