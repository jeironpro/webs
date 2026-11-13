import { httpStatusCodes } from "./data.js";

const codeList = document.querySelector("#code-list");
const yearNodes = document.querySelectorAll("[data-year]");

if (!codeList) {
    throw new Error("No se encontró la lista de códigos HTTP");
}

const createStatusCard = (status) => {
    const item = document.createElement("li");
    item.className = "status-card";

    const code = document.createElement("code");
    code.className = "status-card__code";
    code.textContent = status.code;

    const description = document.createElement("p");
    description.className = "status-card__description";
    description.textContent = status.description;

    item.append(code, description);
    return item;
};

const renderSection = (family, codes) => {
    const section = document.createElement("section");
    section.className = "status-section";
    section.dataset.family = family;
    section.setAttribute("aria-labelledby", `family-${family}`);

    const title = document.createElement("h2");
    title.id = `family-${family}`;
    title.textContent = family;

    const list = document.createElement("ul");
    list.className = "status-list";

    codes.forEach((status) => {
        list.append(createStatusCard(status));
    });

    section.append(title, list);
    return section;
};

Object.entries(httpStatusCodes).forEach(([family, codes]) => {
    codeList.append(renderSection(family, codes));
});

const currentYear = new Date().getFullYear();
yearNodes.forEach((node) => {
    node.textContent = currentYear;
});
