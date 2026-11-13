import { drugBosses, organizations } from "./data.js";

const bossesGrid = document.getElementById("bosses-grid");
const organizationsGrid = document.getElementById("organizations-grid");
const homeView = document.getElementById("home-view");
const detailView = document.getElementById("detail-view");
const detailContent = document.getElementById("detail-content");
const backButton = document.getElementById("back-button");
const bossesNav = document.getElementById("nav-bosses");
const organizationsNav = document.getElementById("nav-organizations");
const subtitle = document.querySelector(".home__subtitle");

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

const setNavState = (activeButton) => {
    [bossesNav, organizationsNav].forEach((button) => {
        const isActive = button === activeButton;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });
};

const clearApp = () => {
    bossesGrid.hidden = true;
    organizationsGrid.hidden = true;
};

const renderBossesGrid = () => {
    bossesGrid.replaceChildren();
    drugBosses.forEach((boss) => {
        bossesGrid.appendChild(createCard(boss, () => showBossDetail(boss)));
    });
};

const renderOrganizationsGrid = () => {
    organizationsGrid.replaceChildren();
    organizations.forEach((organization) => {
        organizationsGrid.appendChild(
            createCard(organization, () => showOrganizationDetail(organization), true)
        );
    });
};

const createCard = (item, clickHandler, isOrganization = false) => {
    const card = createElement("button", "boss-card");
    card.type = "button";
    card.setAttribute("aria-label", `Ver ficha de ${item.name}`);

    const imageContainer = createElement("span", "boss-card__image-container");
    const image = document.createElement("img");
    image.src = item.image;
    image.alt = item.name;
    image.className = "boss-card__image";
    image.loading = "lazy";
    image.decoding = "async";
    imageContainer.appendChild(image);

    const content = createElement("span", "boss-card__content");
    const name = createElement("span", "boss-card__name", item.name);

    const subinfo = createElement("span", "boss-card__subinfo");
    const origin = createElement("span", "", item.origin);
    const badge = createElement("span", "", isOrganization ? item.status : `${item.age} años`);
    subinfo.appendChild(origin);
    subinfo.appendChild(badge);

    const description = createElement(
        "span",
        "boss-card__description",
        isOrganization ? `${item.history.substring(0, 100)}...` : item.shortDescription
    );

    content.appendChild(name);
    content.appendChild(subinfo);
    content.appendChild(description);

    card.appendChild(imageContainer);
    card.appendChild(content);
    card.addEventListener("click", clickHandler);

    return card;
};

const createInfoItem = (labelText, valueText, modifier = "") => {
    const item = createElement("div", "info-item");
    item.appendChild(createElement("span", "info-item__label", labelText));
    const valueClass = modifier
        ? `info-item__value info-item__value--${modifier}`
        : "info-item__value";
    item.appendChild(createElement("span", valueClass, valueText));
    return item;
};

const showBossDetail = (boss) => {
    window.scrollTo({ top: 0, behavior: "auto" });
    detailContent.replaceChildren();

    const header = createDetailHeader(boss.image, boss.name, boss.role);
    const infoGrid = createElement("div", "info-grid");

    infoGrid.appendChild(createInfoItem("Nombre completo", boss.fullName));
    infoGrid.appendChild(createInfoItem("Nacionalidad", boss.origin));
    infoGrid.appendChild(createInfoItem("Nacimiento", boss.birthDate));
    infoGrid.appendChild(createInfoItem("Estado / muerte", boss.deathDate));
    infoGrid.appendChild(createInfoItem("Organización", boss.organization, "accent"));
    infoGrid.appendChild(createInfoItem("Fortuna estimada", boss.estimatedFortune, "gold"));

    header.querySelector(".detail-info").appendChild(infoGrid);
    detailContent.appendChild(header);
    detailContent.appendChild(addSection("Historia", boss.history));
    detailContent.appendChild(
        createDoubleSection(
            "Modus operandi",
            boss.modusOperandi,
            "Territorio y rutas",
            boss.territory
        )
    );
    detailContent.appendChild(createRelationsSection(boss.allies, boss.enemies));
    detailContent.appendChild(addSection("Impacto y sociedad", boss.impact));

    const endText = boss.deathDetails || boss.captureDetails;
    const endTitle = boss.deathDetails
        ? "Final: operativo de muerte"
        : "Final: captura y sentencia";
    detailContent.appendChild(addSection(endTitle, endText));
    detailContent.appendChild(addSection("Legado y cultura", boss.culturalImpact));

    if (boss.notableEvents) {
        detailContent.appendChild(addSection("Eventos notables", "", true, boss.notableEvents));
    }

    toggleViews(false);
};

const showOrganizationDetail = (organization) => {
    window.scrollTo({ top: 0, behavior: "auto" });
    detailContent.replaceChildren();

    const header = createDetailHeader(
        organization.image,
        organization.name,
        `Organización criminal - ${organization.status}`
    );
    const infoGrid = createElement("div", "info-grid");

    infoGrid.appendChild(createInfoItem("Fundación", organization.founded));
    infoGrid.appendChild(createInfoItem("Disolución", organization.dissolved));
    infoGrid.appendChild(createInfoItem("Origen", organization.origin, "accent"));
    infoGrid.appendChild(createInfoItem("Líderes", organization.leaders.join(", ")));

    header.querySelector(".detail-info").appendChild(infoGrid);
    detailContent.appendChild(header);
    detailContent.appendChild(addSection("Historia de la organización", organization.history));
    detailContent.appendChild(
        createDoubleSection(
            "Modus operandi",
            organization.modusOperandi,
            "Control territorial",
            organization.territory
        )
    );
    detailContent.appendChild(createRelationsSection(organization.allies, organization.enemies));

    toggleViews(false);
};

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
    section.appendChild(createElement("h2", "detail-section__title", title));

    if (isList) {
        const list = createElement("ul", "events");
        items.forEach((item) => list.appendChild(createElement("li", "events__item", item)));
        section.appendChild(list);
    } else {
        section.appendChild(createElement("p", "detail-section__text", contentText));
    }

    return section;
};

const createDoubleSection = (title1, content1, title2, content2) => {
    const section = createElement("div", "detail-section");
    const grid = createElement("div", "info-grid");

    const item1 = createElement("div", "info-item");
    item1.appendChild(createElement("h2", "info-item__title", title1));
    item1.appendChild(createElement("p", "detail-section__text", content1));

    const item2 = createElement("div", "info-item");
    item2.appendChild(createElement("h2", "info-item__title", title2));
    item2.appendChild(createElement("p", "detail-section__text", content2));

    grid.appendChild(item1);
    grid.appendChild(item2);
    section.appendChild(grid);
    return section;
};

const createRelationsSection = (allies, enemies) => {
    const section = createElement("div", "detail-section");
    const grid = createElement("div", "info-grid");

    const alliesBlock = createElement("div", "info-item");
    alliesBlock.appendChild(createElement("h2", "info-item__title", "Aliados principales"));
    const alliesList = createElement("ul", "events");
    allies.forEach((ally) => alliesList.appendChild(createElement("li", "events__item", ally)));
    alliesBlock.appendChild(alliesList);

    const enemiesBlock = createElement("div", "info-item");
    enemiesBlock.appendChild(createElement("h2", "info-item__title", "Enemigos clave"));
    const enemiesList = createElement("ul", "events");
    enemies.forEach((enemy) => enemiesList.appendChild(createElement("li", "events__item", enemy)));
    enemiesBlock.appendChild(enemiesList);

    grid.appendChild(alliesBlock);
    grid.appendChild(enemiesBlock);
    section.appendChild(grid);
    return section;
};

const toggleViews = (showHome) => {
    homeView.hidden = !showHome;
    detailView.hidden = showHome;
};

bossesNav.addEventListener("click", () => {
    clearApp();
    setNavState(bossesNav);
    bossesGrid.hidden = false;
    subtitle.textContent = "Los 10 señores de la droga más impactantes de la historia";
    renderBossesGrid();
});

organizationsNav.addEventListener("click", () => {
    clearApp();
    setNavState(organizationsNav);
    organizationsGrid.hidden = false;
    subtitle.textContent = "Las 10 organizaciones de la droga más impactantes de la historia";
    renderOrganizationsGrid();
});

backButton.addEventListener("click", () => toggleViews(true));

renderBossesGrid();
