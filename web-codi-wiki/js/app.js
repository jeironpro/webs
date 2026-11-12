document.addEventListener("DOMContentLoaded", () => {
    const languageList = document.getElementById("language-list");
    const paradigmList = document.getElementById("paradigm-list");
    const welcomeScreen = document.getElementById("welcome-screen");
    const detailView = document.getElementById("detail-view");
    const mainContent = document.querySelector(".main-content");

    function createElement(tag, className, text) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (text !== undefined) element.textContent = text;
        return element;
    }

    function renderMenu() {
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
                container.appendChild(button);
            });
        });
    }

    function showContent(item) {
        // Gestionar estado activo del menú
        document.querySelectorAll(".nav-item").forEach((element) => {
            element.classList.remove("is-active");
        });
        const activeItem = document.querySelector(`.nav-item[data-id="${item.id}"]`);
        if (activeItem) activeItem.classList.add("is-active");

        // Transición de pantallas
        welcomeScreen.style.display = "none";
        detailView.classList.remove("is-hidden");
        detailView.classList.add("view-active");

        // Scroll al inicio
        mainContent.scrollTop = 0;

        // Limpiar vista anterior
        detailView.replaceChildren();

        // 1. Header
        const header = createElement("header", "detail-header");
        header.append(
            createElement("span", "type-label", item.label),
            createElement("h1", "detail-title", item.name),
            createElement("p", "detail-description", item.description),
        );
        detailView.appendChild(header);

        // 2. Historia
        const historyBlock = createElement("div", "section-block");
        historyBlock.append(
            createElement("h2", null, "Historia y Origen"),
            createElement("p", null, item.history),
        );
        detailView.appendChild(historyBlock);

        // 3. Usos principales
        const usesList = document.createElement("ul");
        usesList.style.paddingLeft = "1.5rem";
        item.uses.forEach((use) => {
            usesList.appendChild(createElement("li", null, use));
        });

        const usesBlock = createElement("div", "section-block");
        usesBlock.append(createElement("h2", null, "Usos Principales"), usesList);
        detailView.appendChild(usesBlock);

        // 4. Análisis (pros y contras)
        const prosList = createElement("ul", "check-list");
        item.pros.forEach((pro) => {
            prosList.appendChild(createElement("li", null, pro));
        });

        const consList = createElement("ul", "cross-list");
        item.cons.forEach((con) => {
            consList.appendChild(createElement("li", null, con));
        });

        const prosColumn = createElement("div", "column");
        prosColumn.append(createElement("h4", null, "Ventajas"), prosList);

        const consColumn = createElement("div", "column");
        consColumn.append(createElement("h4", null, "Desventajas"), consList);

        const prosCons = createElement("div", "pros-cons");
        prosCons.append(prosColumn, consColumn);

        const analysisBlock = createElement("div", "section-block");
        analysisBlock.append(createElement("h2", null, "Análisis"), prosCons);
        detailView.appendChild(analysisBlock);

        // 5. Código de ejemplo
        const code = createElement("code", null, item.example);
        const pre = createElement("pre", "code-block");
        pre.appendChild(code);

        const codeBlock = createElement("div", "section-block");
        codeBlock.append(createElement("h2", null, "Código de Ejemplo"), pre);
        detailView.appendChild(codeBlock);

        // Reiniciar animación
        detailView.style.animation = "none";
        void detailView.offsetHeight; /* fuerza reflow */
        detailView.style.animation = "fadeIn 0.5s ease forwards";
    }

    // Inicializar
    renderMenu();
});
