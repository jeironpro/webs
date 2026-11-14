const THEME_KEY = "exerciness-theme";
const FAVORITES_KEY = "exerciness-favorites";
const COMPARE_KEY = "exerciness-compare";
const COMPARE_LIMIT = 4;

const bodyPartLabels = {
    waist: "Cintura",
    "upper legs": "Piernas superiores",
    "lower legs": "Piernas inferiores",
    back: "Espalda",
    chest: "Pecho",
    "upper arms": "Brazos",
    "lower arms": "Antebrazos",
    neck: "Cuello",
    shoulders: "Hombros",
    cardio: "Cardio",
};

const equipmentLabels = {
    "body weight": "Peso corporal",
    dumbbell: "Mancuernas",
    kettlebell: "Kettlebell",
    barbell: "Barra",
    "ez barbell": "Barra Z",
    "olympic barbell": "Barra olímpica",
    "trap bar": "Barra trampa",
    cable: "Poleas",
    band: "Banda elástica",
    "resistance band": "Banda de resistencia",
    "stability ball": "Balón de estabilidad",
    "medicine ball": "Balón medicinal",
    "bosu ball": "Bosu",
    "leverage machine": "Máquina de palanca",
    "sled machine": "Trineo",
    assisted: "Máquina asistida",
    rope: "Cuerda",
    hammer: "Martillo",
    "smith machine": "Máquina Smith",
    "upper body ergometer": "Ergómetro de brazo",
    "stationary bike": "Bicicleta estática",
    "elliptical machine": "Elíptica",
    "stepmill machine": "Escaladora",
    "skierg machine": "Máquina de esquí",
    weighted: "Con peso",
    "wheel roller": "Rueda abdominal",
    roller: "Rodillo",
    tire: "Neumático",
};

const muscleLabels = {
    abdominals: "Abdominales",
    "ankle stabilizers": "Estabilizadores del tobillo",
    ankles: "Tobillos",
    back: "Espalda",
    biceps: "Bíceps",
    brachialis: "Braquial",
    calves: "Gemelos",
    chest: "Pecho",
    core: "Core",
    deltoids: "Deltoides",
    feet: "Pies",
    forearms: "Antebrazos",
    glutes: "Glúteos",
    "grip muscles": "Músculos de agarre",
    groin: "Ingle",
    hamstrings: "Isquiotibiales",
    hands: "Manos",
    "hip flexors": "Flexores de cadera",
    "inner thighs": "Aductores",
    "latissimus dorsi": "Dorsal ancho",
    lats: "Dorsales",
    "lower abs": "Abdominales bajos",
    "lower back": "Lumbar",
    obliques: "Oblicuos",
    quadriceps: "Cuádriceps",
    "rear deltoids": "Deltoides posteriores",
    rhomboids: "Romboides",
    "rotator cuff": "Manguito rotador",
    shins: "Tibiales",
    shoulders: "Hombros",
    soleus: "Sóleo",
    sternocleidomastoid: "Esternocleidomastoideo",
    trapezius: "Trapecio",
    traps: "Trapecios",
    triceps: "Tríceps",
    "upper back": "Espalda alta",
    "upper chest": "Pecho superior",
    "wrist extensors": "Extensores de muñeca",
    "wrist flexors": "Flexores de muñeca",
    wrists: "Muñecas",
    abductors: "Abductores",
    abs: "Abdominales",
    adductors: "Aductores",
    "cardiovascular system": "Cardiovascular",
    delts: "Deltoides",
    "levator scapulae": "Elevador de la escápula",
    pectorals: "Pectorales",
    quads: "Cuádriceps",
    "serratus anterior": "Serrato anterior",
    spine: "Columna",
};

const label = (value, dictionary) => {
    if (!value) return "";
    return dictionary[value] || value.charAt(0).toUpperCase() + value.slice(1);
};

const readIds = (key) => {
    try {
        const stored = JSON.parse(localStorage.getItem(key) || "[]");
        if (Array.isArray(stored)) return stored;
        if (stored && stored.state && Array.isArray(stored.state.ids)) return stored.state.ids;
        return [];
    } catch {
        return [];
    }
};

const writeIds = (key, ids) => {
    localStorage.setItem(key, JSON.stringify({ state: { ids }, version: 0 }));
};

let favorites = readIds(FAVORITES_KEY);
let compared = readIds(COMPARE_KEY);
let exercises = [];
let exerciseMap = new Map();

const isFavorite = (id) => favorites.includes(id);
const isCompared = (id) => compared.includes(id);

const persistFavorites = () => {
    writeIds(FAVORITES_KEY, favorites);
    updateFavoritesBadge();
};

const persistCompared = () => {
    writeIds(COMPARE_KEY, compared);
    updateCompareBar();
};

const toggleFavorite = (id) => {
    if (isFavorite(id)) favorites = favorites.filter((item) => item !== id);
    else favorites = [...favorites, id];
    persistFavorites();
    updateFavoriteUi(id);
    if (document.body.dataset.page === "favoritos") renderFavorites();
};

const toggleCompared = (id) => {
    if (isCompared(id)) {
        compared = compared.filter((item) => item !== id);
    } else {
        if (compared.length >= COMPARE_LIMIT) compared = compared.slice(1);
        compared = [...compared, id];
    }
    persistCompared();
    updateCompareButton(id);
    updateCompareBar();
    if (document.body.dataset.page === "comparar") renderCompare();
};

const updateFavoriteUi = (id) => {
    const button = document.getElementById("favorite-button");
    if (!button) return;
    const active = isFavorite(id);
    button.setAttribute("aria-pressed", String(active));
    const icon = button.querySelector(".material-symbols-rounded");
    if (icon) icon.textContent = active ? "favorite" : "favorite_border";
    icon?.setAttribute("aria-label", active ? "Quitar de favoritos" : "Añadir a favoritos");
};

const applyCompareButton = (button, id) => {
    const active = isCompared(id);
    button.dataset.compare = id;
    button.setAttribute("aria-pressed", String(active));
    button.setAttribute(
        "aria-label",
        active ? "Quitar de la comparación" : "Añadir a la comparación"
    );
    button.classList.toggle("bg-accent/12", active);
    button.classList.toggle("text-accent", active);
    button.classList.toggle("bg-paper-2", !active);
    button.classList.toggle("text-ink-2", !active);
    const icon = button.querySelector(".material-symbols-rounded");
    if (icon) icon.textContent = active ? "check_circle" : "compare_arrows";
};

const updateCompareButton = (id) => {
    document.querySelectorAll(`[data-compare="${CSS.escape(id)}"]`).forEach((button) => {
        applyCompareButton(button, id);
    });
};

const updateFavoritesBadge = () => {
    document.querySelectorAll('a[href="favoritos.html"]').forEach((link) => {
        let badge = link.querySelector(".favorites-badge");
        if (favorites.length === 0) {
            badge?.remove();
            return;
        }
        if (!badge) {
            badge = document.createElement("span");
            badge.className =
                "favorites-badge ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-3 px-1 text-xs font-bold text-paper";
            link.append(badge);
        }
        badge.textContent = String(favorites.length);
        badge.setAttribute("aria-label", `${favorites.length} favoritos`);
    });
};

const updateFavoritesCount = () => {
    const paragraph = document.querySelector("main header p");
    if (paragraph && document.body.dataset.page === "favoritos") {
        const total = favorites.length;
        paragraph.textContent = `${total} ${total === 1 ? "ejercicio guardado" : "ejercicios guardados"}.`;
    }
};

const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
};

const badge = (text, variant) => {
    const classes =
        variant === "primary"
            ? "inline-flex items-center rounded-pill px-2.5 py-0.5 font-mono text-xs font-medium uppercase tracking-wider bg-accent/12 text-accent"
            : variant === "target"
              ? "inline-flex items-center rounded-pill px-2.5 py-0.5 font-mono text-xs font-medium uppercase tracking-wider bg-accent-2/12 text-accent-2"
              : "inline-flex items-center rounded-pill px-2.5 py-0.5 font-mono text-xs font-medium uppercase tracking-wider border border-rule bg-paper-2 text-ink-2";
    return element("span", classes, text);
};

const exerciseCard = (exercise) => {
    const card = element(
        "div",
        "rounded-card bg-paper shadow-soft transition-shadow duration-220 group relative overflow-hidden transition-transform duration-220 ease-spring hover:-translate-y-1"
    );
    const link = element("a", "block no-underline");
    link.href = `ejercicio.html?id=${encodeURIComponent(exercise.id)}`;

    const imageWrap = element("div", "overflow-hidden");
    const image = element(
        "img",
        "aspect-square w-full object-cover transition-transform duration-220 group-hover:scale-105"
    );
    image.src = exercise.image;
    image.alt = exercise.name;
    image.loading = "lazy";
    imageWrap.append(image);

    const info = element("div", "p-4");
    info.append(
        element("h3", "font-display text-base font-semibold leading-tight text-ink", exercise.name)
    );
    const badges = element("div", "mt-2 flex flex-wrap gap-1.5");
    if (exercise.body_part)
        badges.append(badge(label(exercise.body_part, bodyPartLabels), "primary"));
    if (exercise.equipment) badges.append(badge(label(exercise.equipment, equipmentLabels)));
    info.append(badges);
    link.append(imageWrap, info);

    const compare = element(
        "button",
        "inline-flex items-center justify-center gap-2 rounded-pill font-medium transition-colors focus-visible:outline-2 focus-visible:outline-focus bg-paper-2 text-ink-2 hover:bg-accent/8 hover:text-accent h-8 w-8 absolute right-3 top-3"
    );
    compare.type = "button";
    const icon = element("span", "icon-20 material-symbols-rounded select-none", "compare_arrows");
    icon.setAttribute("aria-hidden", "true");
    compare.append(icon);
    card.append(link, compare);
    return card;
};

const renderFavorites = () => {
    const grid = document.getElementById("favorites-grid");
    const empty = document.getElementById("favorites-empty");
    if (!grid || !empty) return;
    const selected = exercises.filter((exercise) => isFavorite(exercise.id));
    grid.replaceChildren(...selected.map(exerciseCard));
    grid.hidden = selected.length === 0;
    empty.hidden = selected.length > 0;
    updateFavoritesCount();
    updateCompareBar();
};

const renderCompare = () => {
    const container = document.getElementById("compare-content");
    if (!container) return;
    const selected = compared.map((id) => exerciseMap.get(id)).filter(Boolean);
    if (selected.length < 2) {
        const empty = element("div", "flex flex-col items-center gap-3 py-16 text-center");
        const icon = element(
            "span",
            "material-symbols-rounded select-none text-ink-2 icon-40",
            "compare_arrows"
        );
        icon.setAttribute("aria-hidden", "true");
        empty.append(
            icon,
            element(
                "h2",
                "font-display text-lg font-semibold text-ink",
                "Selecciona al menos dos ejercicios"
            ),
            element(
                "p",
                "max-w-md font-body text-sm text-ink-2",
                "Añade ejercicios con el botón de comparar del catálogo. Puedes comparar hasta cuatro a la vez."
            )
        );
        const action = element("a", "btn no-underline", "Ir al catálogo");
        action.href = "ejercicios.html";
        empty.append(action);
        container.replaceChildren(empty);
        updateCompareBar();
        return;
    }

    const wrapper = element(
        "div",
        "overflow-x-auto rounded-card border border-rule bg-paper shadow-soft"
    );
    const table = element("table", "w-full border-collapse font-body text-sm");
    const caption = element("caption", "sr-only", "Comparación de ejercicios seleccionados");
    const thead = element("thead");
    const headRow = element("tr", "border-b border-rule");
    headRow.append(
        element(
            "th",
            "sticky left-0 z-20 bg-paper p-4 text-left font-mono text-xs font-medium uppercase tracking-widest text-ink-2",
            "Atributo"
        )
    );
    selected.forEach((exercise) => {
        const cell = element("th", "min-w-40 p-4 text-left align-top");
        cell.scope = "col";
        const group = element("div", "flex flex-col gap-2");
        const image = element("img", "aspect-square w-full rounded-card object-cover");
        image.src = exercise.image;
        image.alt = "";
        const link = element(
            "a",
            "font-display text-sm font-semibold text-accent-2 no-underline hover:underline",
            exercise.name
        );
        link.href = `ejercicio.html?id=${encodeURIComponent(exercise.id)}`;
        const remove = element(
            "button",
            "inline-flex items-center gap-1 self-start font-mono text-xs uppercase tracking-wider text-ink-2 hover:text-accent-3"
        );
        remove.type = "button";
        remove.dataset.removeCompare = exercise.id;
        const icon = element("span", "icon-14 material-symbols-rounded select-none", "close");
        icon.setAttribute("aria-hidden", "true");
        remove.append(icon, document.createTextNode("Quitar"));
        group.append(image, link, remove);
        cell.append(group);
        headRow.append(cell);
    });
    thead.append(headRow);

    const tbody = element("tbody");
    const rows = [
        { labelText: "Grupo corporal", value: (item) => label(item.body_part, bodyPartLabels) },
        { labelText: "Equipo", value: (item) => label(item.equipment, equipmentLabels) },
        { labelText: "Objetivo", value: (item) => label(item.target, muscleLabels) },
        { labelText: "Músculo principal", value: (item) => label(item.muscle_group, muscleLabels) },
        {
            labelText: "Secundarios",
            value: (item) =>
                (item.secondary_muscles || [])
                    .map((muscle) => label(muscle, muscleLabels))
                    .join(", ") || "—",
        },
    ];
    rows.forEach((row) => {
        const tr = element("tr", "border-b border-rule last:border-b-0");
        const heading = element(
            "th",
            "sticky left-0 z-10 w-36 bg-paper p-4 text-left align-top font-mono text-xs font-medium uppercase tracking-widest text-ink-2",
            row.labelText
        );
        heading.scope = "row";
        tr.append(heading);
        selected.forEach((exercise) =>
            tr.append(element("td", "p-4 align-top font-body text-ink", row.value(exercise)))
        );
        tbody.append(tr);
    });

    table.append(caption, thead, tbody);
    wrapper.append(table);
    container.replaceChildren(wrapper);
    updateCompareBar();
};

const updateCompareBar = () => {
    let bar = document.getElementById("compare-bar");
    if (bar) bar.remove();
    if (compared.length === 0) return;
    bar = element(
        "div",
        "fixed inset-x-0 bottom-0 z-40 border-t-2 border-rule bg-paper-2 shadow-lift"
    );
    bar.id = "compare-bar";
    const inner = element("div", "mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3");
    const thumbs = element("div", "hidden -space-x-2 sm:flex");
    thumbs.setAttribute("aria-hidden", "true");
    compared.slice(0, 3).forEach((id) => {
        const exercise = exerciseMap.get(id);
        if (!exercise) return;
        const image = element("img", "h-10 w-10 rounded-full border-2 border-paper object-cover");
        image.src = exercise.image;
        image.alt = "";
        thumbs.append(image);
    });
    const count = element(
        "span",
        "font-body text-sm font-medium text-ink",
        `${compared.length} seleccionados`
    );
    const actions = element("div", "ml-auto flex items-center gap-2");
    const clear = element("button", "btn btn--outline px-3 py-1.5 text-sm", "Limpiar");
    clear.type = "button";
    clear.id = "clear-compare";
    const link = element("a", "btn px-3 py-1.5 text-sm no-underline", "Comparar");
    link.href = "comparar.html";
    actions.append(clear, link);
    inner.append(thumbs, count, actions);
    bar.append(inner);
    document.body.append(bar);
};

const updateList = () => {
    const grid = document.getElementById("exercise-grid");
    const count = document.getElementById("results-count");
    if (!grid) return;
    const search = document.getElementById("exercise-search")?.value.trim().toLowerCase() || "";
    const body = document.getElementById("filter-body")?.value || "all";
    const equipment = document.getElementById("filter-equipment")?.value || "all";
    const target = document.getElementById("filter-target")?.value || "all";
    const muscle = document.getElementById("filter-muscle")?.value || "all";
    const sort = document.getElementById("filter-sort")?.value || "name";
    const cards = [...grid.children];
    cards.forEach((card) => {
        const link = card.querySelector('a[href^="ejercicio.html?id="]');
        const id = link ? new URL(link.href, location.href).searchParams.get("id") : "";
        const exercise = exerciseMap.get(id);
        if (!exercise) {
            card.hidden = true;
            return;
        }
        const matches =
            (!search || exercise.name.toLowerCase().includes(search)) &&
            (body === "all" || exercise.body_part === body) &&
            (equipment === "all" || exercise.equipment === equipment) &&
            (target === "all" || exercise.target === target) &&
            (muscle === "all" ||
                (exercise.secondary_muscles || []).includes(muscle) ||
                exercise.target === muscle);
        card.hidden = !matches;
    });
    const visible = cards.filter((card) => !card.hidden);
    if (count)
        count.textContent = `${visible.length} ${visible.length === 1 ? "ejercicio encontrado" : "ejercicios encontrados"}`;
    const comparator = (a, b) => {
        const first = exerciseMap.get(a.dataset.exerciseId);
        const second = exerciseMap.get(b.dataset.exerciseId);
        if (!first || !second) return 0;
        if (sort === "body_part")
            return (first.body_part || "").localeCompare(second.body_part || "", "es");
        if (sort === "equipment")
            return (first.equipment || "").localeCompare(second.equipment || "", "es");
        return first.name.localeCompare(second.name, "es");
    };
    cards.sort(comparator).forEach((card) => grid.append(card));
};

const initList = () => {
    const grid = document.getElementById("exercise-grid");
    if (!grid) return;
    [...grid.children].forEach((card) => {
        const link = card.querySelector('a[href^="ejercicio.html?id="]');
        if (!link) return;
        const id = new URL(link.href, location.href).searchParams.get("id");
        card.dataset.exerciseId = id;
        const compare = card.querySelector('button[aria-label*="comparación"]');
        if (compare) applyCompareButton(compare, id);
    });
    document.getElementById("exercise-search")?.addEventListener("input", updateList);
    ["filter-body", "filter-equipment", "filter-target", "filter-muscle", "filter-sort"].forEach(
        (id) => {
            document.getElementById(id)?.addEventListener("change", updateList);
        }
    );
    updateList();
};

const initDetail = async () => {
    const name = document.getElementById("detail-name");
    if (!name) return;
    const id = new URLSearchParams(location.search).get("id") || "";
    const exercise = exerciseMap.get(id);
    if (!exercise) {
        name.textContent = "Ejercicio no encontrado";
        document.getElementById("detail-badges")?.replaceChildren();
        document.getElementById("detail-image")?.setAttribute("hidden", "");
        document.getElementById("play-button")?.setAttribute("hidden", "");
        document
            .getElementById("detail-instructions")
            ?.replaceChildren(
                element("li", "list-decimal", "Vuelve al catálogo para elegir un ejercicio.")
            );
        return;
    }
    document.title = `${exercise.name} · exerciness`;
    name.textContent = exercise.name;
    const badges = document.getElementById("detail-badges");
    if (badges) {
        badges.replaceChildren();
        if (exercise.body_part)
            badges.append(badge(label(exercise.body_part, bodyPartLabels), "primary"));
        if (exercise.equipment) badges.append(badge(label(exercise.equipment, equipmentLabels)));
        if (exercise.target) badges.append(badge(label(exercise.target, muscleLabels), "target"));
    }
    const image = document.getElementById("detail-image");
    if (image) {
        image.src = exercise.image;
        image.alt = exercise.name;
    }
    const play = document.getElementById("play-button");
    if (play) {
        play.hidden = !exercise.gif_url;
        play.onclick = () => {
            if (!image || !exercise.gif_url) return;
            const showingGif = image.src.includes(exercise.gif_url);
            image.src = showingGif ? exercise.image : exercise.gif_url;
            play.querySelector(".material-symbols-rounded").textContent = showingGif
                ? "play_arrow"
                : "pause";
            play.lastChild.textContent = showingGif ? "Reproducir" : "Pausar";
        };
    }
    const instructions = document.getElementById("detail-instructions");
    if (instructions) {
        const steps = exercise.instruction_steps?.es || [];
        instructions.replaceChildren(...steps.map((step) => element("li", "list-decimal", step)));
    }
    const primary = document.getElementById("detail-primary");
    if (primary) {
        primary.replaceChildren(badge(label(exercise.muscle_group, muscleLabels), "primary"));
    }
    const secondary = document.getElementById("detail-secondary");
    if (secondary) {
        secondary.replaceChildren(
            ...(exercise.secondary_muscles || []).map((muscle) =>
                badge(label(muscle, muscleLabels))
            )
        );
    }
    const favorite = document.getElementById("favorite-button");
    if (favorite) {
        favorite.dataset.favorite = exercise.id;
        updateFavoriteUi(exercise.id);
    }
    updateCompareBar();
};

const setTheme = (theme) => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem(THEME_KEY, JSON.stringify({ state: { theme } }));
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
        const icon = button.querySelector(".material-symbols-rounded");
        if (icon) icon.textContent = theme === "dark" ? "light_mode" : "dark_mode";
        if (button.classList.contains("btn"))
            button.textContent = theme === "dark" ? "Modo claro" : "Modo oscuro";
        button.setAttribute(
            "aria-label",
            theme === "dark" ? "Activar modo claro" : "Activar modo oscuro"
        );
        button.title = theme === "dark" ? "Activar modo claro" : "Activar modo oscuro";
    });
};

const initTheme = () => {
    let theme = "light";
    try {
        const stored = JSON.parse(localStorage.getItem(THEME_KEY) || "null");
        theme =
            stored?.state?.theme === "dark" ? "dark" : stored?.theme === "dark" ? "dark" : "light";
    } catch {
        theme = "light";
    }
    if (!localStorage.getItem(THEME_KEY) && matchMedia("(prefers-color-scheme: dark)").matches)
        theme = "dark";
    setTheme(theme);
};

const initMenu = () => {
    const button = document.querySelector("[data-menu-toggle]");
    const menu = document.getElementById("mobile-menu");
    if (!button || !menu) return;
    button.addEventListener("click", () => {
        const open = menu.hidden;
        menu.hidden = !open;
        button.setAttribute("aria-expanded", String(open));
    });
};

const initNav = () => {
    const page = document.body.dataset.page;
    document.querySelectorAll("#mobile-menu a").forEach((link) => {
        if (
            link.getAttribute("href") === `${page}.html` ||
            (page === "home" && link.getAttribute("href") === "index.html")
        ) {
            link.setAttribute("aria-current", "page");
        }
    });
    updateFavoritesBadge();
    updateCompareBar();
};

const loadData = async () => {
    const response = await fetch("data/exercises.json");
    if (!response.ok) throw new Error("No se pudo cargar el catálogo");
    exercises = await response.json();
    exerciseMap = new Map(exercises.map((exercise) => [exercise.id, exercise]));
};

const boot = async () => {
    initTheme();
    initMenu();
    initNav();
    try {
        await loadData();
    } catch {
        const name = document.getElementById("detail-name");
        if (name) name.textContent = "No se pudo cargar el catálogo";
        return;
    }
    document.querySelectorAll("[data-compare]").forEach((button) => {
        applyCompareButton(button, button.dataset.compare);
    });
    initList();
    await initDetail();
    if (document.body.dataset.page === "favoritos") renderFavorites();
    if (document.body.dataset.page === "comparar") renderCompare();
    updateCompareBar();
};

document.addEventListener("click", (event) => {
    const themeButton = event.target.closest("[data-theme-toggle]");
    if (themeButton) {
        setTheme(document.documentElement.classList.contains("dark") ? "light" : "dark");
        return;
    }
    const menuButton = event.target.closest("[data-menu-toggle]");
    if (menuButton) return;
    const compareButton = event.target.closest("[data-compare]");
    if (compareButton) {
        toggleCompared(compareButton.dataset.compare);
        return;
    }
    const removeCompare = event.target.closest("[data-remove-compare]");
    if (removeCompare) {
        toggleCompared(removeCompare.dataset.removeCompare);
        return;
    }
    const favoriteButton = event.target.closest("#favorite-button");
    if (favoriteButton) {
        toggleFavorite(favoriteButton.dataset.favorite);
        return;
    }
    if (event.target.closest("#clear-compare")) {
        compared = [];
        persistCompared();
        document
            .querySelectorAll("[data-compare]")
            .forEach((button) => applyCompareButton(button, button.dataset.compare));
        updateCompareBar();
        renderCompare();
    }
});

boot();
