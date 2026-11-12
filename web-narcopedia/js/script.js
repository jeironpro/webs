import { drugBosses, organizations } from "./data.js";

const bossesGrid = document.getElementById("bosses-grid");
const organizationsGrid = document.getElementById("organizations-grid");
const homeView = document.getElementById("home-view");
const detailView = document.getElementById("detail-view");
const detailContent = document.getElementById("detail-content");
const backButton = document.getElementById("back-button");
const bossesNav = document.getElementById("nav-bosses");
const organizationsNav = document.getElementById("nav-organizations");
const subtitle = document.querySelector(".subtitle");

const createElement = (tag, className = "", content = "") => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (content) el.textContent = content;
    return el;
};

const clearApp = () => {
    bossesGrid.style.display = "none";
    organizationsGrid.style.display = "none";
    bossesNav.classList.remove("active");
    organizationsNav.classList.remove("active");
};

const renderBossesGrid = () => {
    bossesGrid.replaceChildren();
    drugBosses.forEach((boss) => {
        const card = createCard(boss, () => showBossDetail(boss));
        bossesGrid.appendChild(card);
    });
};

const renderOrganizationsGrid = () => {
    organizationsGrid.replaceChildren();
    organizations.forEach((org) => {
        const card = createCard(org, () => showOrganizationDetail(org), true);
        organizationsGrid.appendChild(card);
    });
};

const createCard = (item, clickHandler, isOrg = false) => {
    const card = createElement("div", "boss-card");

    const imageContainer = createElement("div", "boss-card__image-container");
    const image = document.createElement("img");
    image.src = item.image;
    image.alt = item.name;
    image.className = "boss-card__image";
    image.loading = "lazy";
    imageContainer.appendChild(image);

    const content = createElement("div", "boss-card__content");
    const name = createElement("h3", "boss-card__name", item.name);

    const subinfo = createElement("div", "boss-card__subinfo");
    const origin = createElement("span", "", item.origin);
    const badge = createElement("span", "", isOrg ? item.status : `${item.age} Años`);
    subinfo.appendChild(origin);
    subinfo.appendChild(badge);

    const description = createElement(
        "p",
        "boss-card__description",
        isOrg ? item.history.substring(0, 100) + "..." : item.shortDescription
    );

    content.appendChild(name);
    content.appendChild(subinfo);
    content.appendChild(description);

    card.appendChild(imageContainer);
    card.appendChild(content);

    card.addEventListener("click", clickHandler);
    return card;
};

const showBossDetail = (boss) => {
    window.scrollTo({ top: 0, behavior: "instant" });
    detailContent.replaceChildren();

    const header = createDetailHeader(boss.image, boss.name, boss.role);
    const infoGrid = createElement("div", "info-grid");

    const createInfoItem = (labelText, valueText, customColor = "") => {
        const item = createElement("div", "info-item");
        item.appendChild(createElement("label", "", labelText));
        const span = createElement("span", "", valueText);
        if (customColor) {
            span.style.color = customColor;
            span.style.fontWeight = "bold";
        }
        item.appendChild(span);
        return item;
    };

    infoGrid.appendChild(createInfoItem("Nombre Completo", boss.fullName));
    infoGrid.appendChild(createInfoItem("Nacionalidad", boss.origin));
    infoGrid.appendChild(createInfoItem("Nacimiento", boss.birthDate));
    infoGrid.appendChild(createInfoItem("Estado / Muerte", boss.deathDate));
    infoGrid.appendChild(createInfoItem("Organización", boss.organization, "var(--accent-color)"));
    infoGrid.appendChild(
        createInfoItem("Fortuna Estimada", boss.estimatedFortune, "var(--gold-accent)")
    );

    header.querySelector(".detail-info").appendChild(infoGrid);
    detailContent.appendChild(header);

    detailContent.appendChild(addSection("Historia", boss.history));

    detailContent.appendChild(
        createDoubleSection(
            "Modus Operandi",
            boss.modusOperandi,
            "Territorio y Rutas",
            boss.territory
        )
    );

    detailContent.appendChild(createRelationsSection(boss.allies, boss.enemies));

    detailContent.appendChild(addSection("Impacto y Sociedad", boss.impact));

    const endText = boss.deathDetails || boss.captureDetails;
    const endTitle = boss.deathDetails
        ? "Final: Operativo de Muerte"
        : "Final: Captura y Sentencia";
    detailContent.appendChild(addSection(endTitle, endText));

    detailContent.appendChild(addSection("Legado y Cultura", boss.culturalImpact));

    if (boss.notableEvents) {
        detailContent.appendChild(addSection("Eventos Notables", "", true, boss.notableEvents));
    }

    toggleViews(false);
};

const showOrganizationDetail = (org) => {
    window.scrollTo({ top: 0, behavior: "instant" });
    detailContent.replaceChildren();

    const header = createDetailHeader(org.image, org.name, `Organización Criminal - ${org.status}`);
    const infoGrid = createElement("div", "info-grid");

    const createInfoItem = (labelText, valueText, color = "") => {
        const item = createElement("div", "info-item");
        item.appendChild(createElement("label", "", labelText));
        const span = createElement("span", "", valueText);
        if (color) {
            span.style.color = color;
            span.style.fontWeight = "bold";
        }
        item.appendChild(span);
        return item;
    };

    infoGrid.appendChild(createInfoItem("Fundación", org.founded));
    infoGrid.appendChild(createInfoItem("Disolución", org.dissolved));
    infoGrid.appendChild(createInfoItem("Origen", org.origin, "var(--accent-color)"));
    infoGrid.appendChild(createInfoItem("Líderes", org.leaders.join(", ")));

    header.querySelector(".detail-info").appendChild(infoGrid);
    detailContent.appendChild(header);

    detailContent.appendChild(addSection("Historia de la Organización", org.history));

    detailContent.appendChild(
        createDoubleSection(
            "Modus Operandi",
            org.modusOperandi,
            "Control Territorial",
            org.territory
        )
    );

    detailContent.appendChild(createRelationsSection(org.allies, org.enemies));

    toggleViews(false);
};

// Helpers de UI
const createDetailHeader = (imageUrl, nameText, taglineText) => {
    const header = createElement("div", "detail-header");

    const imageContainer = createElement("div", "detail-header__image-container");
    const image = document.createElement("img");
    image.src = imageUrl;
    image.alt = nameText;
    image.className = "detail-header__image";
    imageContainer.appendChild(image);

    const info = createElement("div", "detail-info");
    info.appendChild(createElement("h1", "detail-info__name", nameText));
    info.appendChild(createElement("p", "detail-info__tagline", taglineText));

    header.appendChild(imageContainer);
    header.appendChild(info);
    return header;
};

const addSection = (title, contentText, isList = false, items = []) => {
    const section = createElement("div", "detail-section");
    section.appendChild(createElement("h2", "", title));

    if (isList) {
        const list = createElement("ul", "events-list");
        items.forEach((item) => list.appendChild(createElement("li", "", item)));
        section.appendChild(list);
    } else {
        section.appendChild(createElement("p", "", contentText));
    }
    return section;
};

const createDoubleSection = (title1, content1, title2, content2) => {
    const section = createElement("div", "detail-section");
    const grid = createElement("div", "info-grid");

    const item1 = createElement("div", "info-item");
    item1.appendChild(createElement("h2", "", title1));
    item1.appendChild(createElement("p", "", content1));

    const item2 = createElement("div", "info-item");
    item2.appendChild(createElement("h2", "", title2));
    item2.appendChild(createElement("p", "", content2));

    grid.appendChild(item1);
    grid.appendChild(item2);
    section.appendChild(grid);
    return section;
};

const createRelationsSection = (allies, enemies) => {
    const section = createElement("div", "detail-section");
    const grid = createElement("div", "info-grid");

    const alliesBlock = createElement("div", "info-item");
    alliesBlock.appendChild(createElement("h2", "", "Aliados Principales"));
    const alliesList = createElement("ul", "events-list");
    allies.forEach((ally) => alliesList.appendChild(createElement("li", "", ally)));
    alliesBlock.appendChild(alliesList);

    const enemiesBlock = createElement("div", "info-item");
    enemiesBlock.appendChild(createElement("h2", "", "Enemigos Clave"));
    const enemiesList = createElement("ul", "events-list");
    enemies.forEach((enemy) => enemiesList.appendChild(createElement("li", "", enemy)));
    enemiesBlock.appendChild(enemiesList);

    grid.appendChild(alliesBlock);
    grid.appendChild(enemiesBlock);
    section.appendChild(grid);
    return section;
};

const toggleViews = (showHome) => {
    homeView.style.display = showHome ? "block" : "none";
    detailView.style.display = showHome ? "none" : "block";
};

// Navegación
bossesNav.addEventListener("click", () => {
    clearApp();
    bossesNav.classList.add("active");
    bossesGrid.style.display = "grid";
    subtitle.textContent = "Los 10 señores de la droga más impactantes de la historia";
    renderBossesGrid();
});

organizationsNav.addEventListener("click", () => {
    clearApp();
    organizationsNav.classList.add("active");
    organizationsGrid.style.display = "grid";
    subtitle.textContent = "Las 10 organizaciones de la droga más impactantes de la historia";
    renderOrganizationsGrid();
});

backButton.addEventListener("click", () => toggleViews(true));

// Inicialización
renderBossesGrid();
