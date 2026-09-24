/* ============================================================
   Continguts DAW — lógica de la aplicación
   ------------------------------------------------------------
   Convenciones de este archivo:
   - Los identificadores (variables, funciones, clases) van en
     inglés.
   - Los comentarios van en español.
   - Los textos visibles se traducen a través de i18n.js
     (ca/es/en); los nombres de ficheros y de módulos del
     inventario se mantienen intactos.
   - Sangría fija de 4 espacios.
   ============================================================ */
import { FILES } from "./data/files.js";

// Internacionalización: helpers y carga de diccionarios por idioma.
import { DEFAULT_LANG, current as currentLang, ensureDictionaries, locale, setLanguage, translate as t } from "./i18n.js";

/* ------------------------------------------------------------
   Constantes globales
   ------------------------------------------------------------ */

// Nombre visible de cada curso (traducido según el idioma).
const courseName = (course) => t(`course.${course}`);

// Tabla de formatos: color (paleta depobudget) y tipo de visor.
// Las etiquetas se traducen en i18n.js con la clave "fmt.<ext>".
const FORMATS = {
    pdf: { color: "#d95c5c", viewer: "pdf" },
    doc: { color: "#4a9fd4", viewer: "office" },
    docx: { color: "#1769e8", viewer: "office" },
    odt: { color: "#3cbdb1", viewer: "office" },
    pptx: { color: "#f5b83c", viewer: "office" },
    xlsx: { color: "#c8e832", viewer: "office" },
    png: { color: "#7c3aed", viewer: "image" },
    jpg: { color: "#ff5b45", viewer: "image" },
    svg: { color: "#4a9fd4", viewer: "image" },
    mp3: { color: "#7c3aed", viewer: "audio" },
    md: { color: "#3cbdb1", viewer: "text" },
    txt: { color: "#f5b83c", viewer: "text" },
    sql: { color: "#1769e8", viewer: "code" },
    gz: { color: "#1769e8", viewer: "gzip" },
    py: { color: "#4a9fd4", viewer: "code" },
    js: { color: "#f5b83c", viewer: "code" },
    jsx: { color: "#c8e832", viewer: "code" },
    java: { color: "#ff5b45", viewer: "code" },
    css: { color: "#7c3aed", viewer: "code" },
    html: { color: "#ff5b45", viewer: "code" },
    json: { color: "#f5b83c", viewer: "code" },
    xml: { color: "#3cbdb1", viewer: "code" },
    ipynb: { color: "#1769e8", viewer: "code" },
};

// Colores de reserva para formatos desconocidos, repartidos de
// forma determinista a partir del nombre de la extensión.
const FALLBACK_PALETTE = ["#1769e8", "#ff5b45", "#7c3aed", "#4a9fd4", "#c8e832", "#f5b83c", "#3cbdb1", "#d95c5c"];

// Colores claros sobre los que se debe pintar texto oscuro.
const DARK_TEXT_COLORS = new Set(["#c8e832", "#f5b83c"]);

// Teclas usadas por los atajos de teclado de la aplicación.
const KEYS = Object.freeze({
    SLASH: "/",
    ESCAPE: "Escape",
    ARROW_LEFT: "ArrowLeft",
    ARROW_RIGHT: "ArrowRight",
});

// Espera (ms) antes de aplicar la búsqueda mientras se escribe.
const DEBOUNCE_MS = 120;

// Por encima de este tamaño, el texto/código no se descarga con
// fetch y se muestra en un iframe para no bloquear el navegador.
const TEXT_PREVIEW_LIMIT = 1_500_000;

// Adelanto (bytes) que se descomprime y muestra de un fichero
// .sql.gz; evita volcar el fichero entero en el DOM.
const GZIP_PREVIEW_LIMIT = 262_144;

// Duración (ms) de la animación de entrada de las tarjetas.
const GRID_ANIMATION_MS = 320;

// Retardo acumulado máximo (ms) del efecto escalonado: evita que
// las tarjetas de una vista muy larga tarden demasiado en entrar.
const GRID_STAGGER_MS = 300;

// Retardo (ms) que suma cada tarjeta a la siguiente en el escalonado.
const GRID_STAGGER_STEP_MS = 12;

// Espacio de nombres de SVG para crear iconos de forma segura.
const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

// Carpetas candidatas donde puede vivir la carpeta de materiales.
// La primera ("") es la raíz del propio repositorio, que ya
// contiene los materiales (la web es autocontenida). El resto
// son rutas de la máquina de desarrollo por si se sirve la web
// desde otra carpeta y los materiales están junto a ella.
const MATERIAL_DIRS = [
    "",
    "../../../Descargas/desenvolupament_aplicacions_web",
    "../Descargas/desenvolupament_aplicacions_web",
    "/Descargas/desenvolupament_aplicacions_web",
];

/* ------------------------------------------------------------
   Utilidades generales
   ------------------------------------------------------------ */

// Atajos de consulta: el segundo argumento permite acotar el
// ámbito al elemento que se pasa (p. ej. el árbol de navegación).
const $ = (selector, element = document) => element.querySelector(selector);
const $$ = (selector, element = document) => [...element.querySelectorAll(selector)];

// Devuelve la ficha de un formato; si la extensión no está
// catalogada, genera una ficha de reserva con color estable.
const formatInfo = (ext) => {
    const known = FORMATS[ext];
    if (known) return { ...known, label: t(`fmt.${ext}`) };
    let checksum = 0;
    for (const char of ext) checksum += char.charCodeAt(0);
    return { label: ext.toUpperCase(), color: FALLBACK_PALETTE[checksum % FALLBACK_PALETTE.length], viewer: "file" };
};

// Formatea un número de bytes en una unidad legible (B, KB, MB…)
// con el separador decimal del idioma activo.
const formatBytes = (bytes) => {
    if (!Number.isFinite(bytes) || bytes < 0) return "—";
    const units = ["B", "KB", "MB", "GB"];
    let value = bytes;
    let unitIndex = 0;
    while (value >= 1024 && unitIndex < units.length - 1) {
        value /= 1024;
        unitIndex += 1;
    }
    const digits = value >= 100 || unitIndex === 0 ? 0 : 1;
    return `${value.toLocaleString(locale(), {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    })} ${units[unitIndex]}`;
};

// Normaliza un texto para comparar: quita tildes y pasa a
// minúsculas (permite buscar sin preocuparse por los acentos).
const normalizeText = (text) =>
    String(text)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

// Escapa los metacaracteres de regex de una cadena literal.
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Decide el color del texto sobre un fondo de color dado:
// los colores claros usan tinta oscura y el resto, blanco.
const textColorFor = (color) => (DARK_TEXT_COLORS.has(color) ? "var(--ink)" : "#ffffff");

// Devuelve la palabra en singular/plural correcta según el
// idioma activo a partir de una clave base ("module.one/many").
const pluralWord = (count, baseKey) => t(count === 1 ? `${baseKey}.one` : `${baseKey}.many`);

// Formatea un contador con el separador de miles del idioma.
const countNumber = (count) => count.toLocaleString(locale());

/* ------------------------------------------------------------
   Construcción de DOM (renderizado seguro, sin innerHTML)
   ------------------------------------------------------------ */

// Crea un elemento con atributos y contenido. Los hijos pueden
// ser nodos o texto plano; null/false se ignoran. La clave "text"
// fija el textContent y "class" el className (nunca atributos).
const createEl = (tag, attrs = {}, children = []) => {
    const el = document.createElement(tag);
    for (const [name, value] of Object.entries(attrs)) {
        if (value == null || value === false) continue;
        if (name === "class") el.className = value;
        else if (name === "text") el.textContent = String(value);
        else if (name === "style") {
            for (const [prop, val] of Object.entries(value)) el.style.setProperty(prop, val);
        } else if (name === "dataset") Object.assign(el.dataset, value);
        else if (name === "disabled") el.disabled = true;
        else if (name === "href") el.href = String(value);
        else if (name === "download") el.setAttribute("download", String(value));
        else el.setAttribute(name, value === true ? "" : String(value));
    }
    const list = Array.isArray(children) ? children : [children];
    for (const child of list) {
        if (child == null || child === false) continue;
        el.append(child instanceof Node ? child : document.createTextNode(String(child)));
    }
    return el;
};

// Crea un elemento SVG (los atributos se fijan sin tocar el
// namespace por defecto del documento).
const createSvgEl = (tag, attrs = {}, children = []) => {
    const el = document.createElementNS(SVG_NAMESPACE, tag);
    for (const [name, value] of Object.entries(attrs)) {
        if (value == null || value === false) continue;
        el.setAttribute(name, String(value));
    }
    for (const child of children) if (child) el.append(child);
    return el;
};

// Icono de cuadrícula usado en el botón raíz del árbol.
const gridIcon = () =>
    createSvgEl("svg", { class: "tree-ico", viewBox: "0 0 16 16", "aria-hidden": "true" }, [
        createSvgEl("rect", { x: 1, y: 1, width: 6, height: 6, fill: "none", stroke: "currentColor", "stroke-width": 2 }),
        createSvgEl("rect", { x: 9, y: 1, width: 6, height: 6, fill: "none", stroke: "currentColor", "stroke-width": 2 }),
        createSvgEl("rect", { x: 1, y: 9, width: 6, height: 6, fill: "none", stroke: "currentColor", "stroke-width": 2 }),
        createSvgEl("rect", { x: 9, y: 9, width: 6, height: 6, fill: "none", stroke: "currentColor", "stroke-width": 2 }),
    ]);

// Flecha de expansión (caret) de las secciones del árbol.
const caretIcon = () =>
    createSvgEl("svg", { class: "caret", viewBox: "0 0 12 12", "aria-hidden": "true" }, [
        createSvgEl("path", {
            d: "M3 1.5 8.5 6 3 10.5",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": 2.4,
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
        }),
    ]);

// Añade texto a un contenedor; si hay búsqueda activa, envuelve
// las coincidencias en <mark> para resaltarlas visualmente.
const highlightText = (container, text, query) => {
    if (!query) {
        container.append(text);
        return;
    }
    const regex = new RegExp(`(${escapeRegex(query)})`, "ig");
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(String(text)))) {
        if (match.index > lastIndex) container.append(String(text).slice(lastIndex, match.index));
        container.append(createEl("mark", {}, [match[0]]));
        lastIndex = match.index + match[0].length;
    }
    container.append(String(text).slice(lastIndex));
};

/* ------------------------------------------------------------
   Localización de la carpeta de materiales
   ------------------------------------------------------------ */

// Codifica cada segmento de una ruta relativa para usarla en URL.
const encodePath = (relative) => relative.split("/").map(encodeURIComponent).join("/");

// Sondea las carpetas candidatas con una petición HEAD sobre el
// primer fichero del inventario; devuelve la base que responde.
const materialsProbe = (async () => {
    if (FILES.length === 0) return { base: "", ok: false };
    const sample = FILES[0].path;
    for (const candidate of MATERIAL_DIRS) {
        const prefix = candidate.replace(/\/+$/, "");
        // Con candidato vacío la URL es relativa a la carpeta del
        // proyecto (raíz del repositorio, donde viven los materiales).
        const url = prefix ? `${prefix}/${encodePath(sample)}` : encodePath(sample);
        try {
            const response = await fetch(url, { method: "HEAD" });
            if (response.ok) return { base: prefix, ok: true };
        } catch (_) {
            // Silencioso: se prueba el siguiente candidato.
        }
    }
    return { base: "", ok: false };
})();

/* ------------------------------------------------------------
   Estado de navegación y filtrado
   ------------------------------------------------------------ */

// Estado global: curso/módulo seleccionado, formatos activos y
// texto de búsqueda. course/module admiten null = "todos".
const state = {
    course: null,
    module: null,
    formats: new Set(),
    query: "",
};

// Vuelve a la vista raíz (todos los ficheros de ambos cursos).
const resetNavigation = () => {
    state.course = null;
    state.module = null;
    state.formats.clear();
};

// Clave compuesta curso|módulo para indexar los módulos.
const moduleKey = (course, moduleId) => `${course}|${moduleId}`;

// Lista de ficheros filtrados que se muestran en la cuadrícula.
let currentList = [];

// Índice dentro de currentList del fichero abierto en el modal.
let currentIndex = -1;

// Token de petición: invalida renders del visor desactualizados
// cuando el usuario navega rápido entre ficheros.
let requestToken = 0;

/* ------------------------------------------------------------
   Índices sobre el inventario (módulos por curso)
   ------------------------------------------------------------ */

// Módulos agrupados por curso con sus contadores y formatos.
const modulesByCourse = { 1: [], 2: [] };

// Índice clave curso|módulo -> objeto módulo.
const moduleLookup = new Map();

const seenModuleKeys = new Set();
for (const file of FILES) {
    const key = moduleKey(file.course, file.moduleId);
    if (!seenModuleKeys.has(key)) {
        seenModuleKeys.add(key);
        modulesByCourse[file.course].push({
            course: file.course,
            id: file.moduleId,
            code: file.code,
            label: file.module,
            count: 0,
            formatCounts: {},
        });
    }
}
for (const list of Object.values(modulesByCourse)) {
    for (const mod of list) moduleLookup.set(moduleKey(mod.course, mod.id), mod);
}
for (const file of FILES) {
    const mod = moduleLookup.get(moduleKey(file.course, file.moduleId));
    mod.count += 1;
    mod.formatCounts[file.ext] = (mod.formatCounts[file.ext] || 0) + 1;
}
// Extensiones de cada módulo ordenadas de más a menos frecuente.
for (const list of Object.values(modulesByCourse)) {
    for (const mod of list) {
        mod.extensions = Object.keys(mod.formatCounts).sort(
            (a, b) => mod.formatCounts[b] - mod.formatCounts[a] || a.localeCompare(b)
        );
    }
}

// Devuelve el módulo catalogado para un curso y un id de módulo.
const getModule = (course, moduleId) => moduleLookup.get(moduleKey(course, moduleId));

/* ------------------------------------------------------------
   Filtrado (navegación + formatos + búsqueda)
   ------------------------------------------------------------ */

// Ficheros del ámbito de navegación (curso/módulo sin aplicar
// todavía el filtro de formatos ni la búsqueda).
const contextFiles = () =>
    FILES.filter(
        (file) =>
            (state.course === null || file.course === state.course) &&
            (state.module === null || file.moduleId === state.module)
    );

// Aplica todos los filtros y devuelve la lista final.
const applyFilters = () => {
    const query = normalizeText(state.query.trim());
    return contextFiles().filter((file) => {
        if (state.formats.size > 0 && !state.formats.has(file.ext)) return false;
        if (query) {
            const haystack = [file.name, file.module, formatInfo(file.ext).label, file.ext, file.code]
                .map(normalizeText)
                .join(" ");
            if (!haystack.includes(query)) return false;
        }
        return true;
    });
};

/* ------------------------------------------------------------
   Resumen de estadísticas (se pinta una sola vez)
   ------------------------------------------------------------ */

// Dibuja las tarjetas de resumen: número de ficheros, formatos,
// módulos, cursos y tamaño total del material.
const renderSummary = () => {
    const section = $("#summary");
    section.textContent = "";

    const courseCount = new Set(FILES.map((file) => file.course)).size;
    const moduleCount = new Set(FILES.map((file) => moduleKey(file.course, file.moduleId))).size;
    const formatCount = new Set(FILES.map((file) => file.ext)).size;
    const totalSize = FILES.reduce((acc, file) => acc + (file.size || 0), 0);

    const stats = [
        { number: countNumber(FILES.length), label: t("summary.files") },
        { number: countNumber(formatCount), label: t("summary.formats") },
        { number: countNumber(moduleCount), label: t("summary.modules") },
        { number: countNumber(courseCount), label: t("summary.courses") },
        { number: formatBytes(totalSize), label: t("summary.material") },
    ];

    for (const stat of stats) {
        section.append(
            createEl("article", { class: "stat" }, [
                createEl("span", { class: "stat-num", text: stat.number }),
                createEl("span", { class: "stat-label", text: stat.label }),
            ])
        );
    }
};

/* ------------------------------------------------------------
   Árbol de navegación (panel lateral)
   ------------------------------------------------------------ */

// Construye el árbol: raíz "Todos los ficheros", luego cada curso
// con sus módulos y, dentro de cada módulo, sus formatos.
const buildTree = (tree) => {
    tree.textContent = "";

    const rootButton = createEl(
        "button",
        { type: "button", class: "tree-btn", dataset: { action: "root" }, "aria-current": "true" },
        [gridIcon(), createEl("span", { class: "tree-lbl", text: t("tree.allFiles") }), createEl("span", { class: "tree-count", text: String(FILES.length) })]
    );
    tree.append(rootButton, createEl("div", { class: "tree-sep", role: "presentation" }));

    for (const course of [1, 2]) {
        const modules = modulesByCourse[course];
        const total = modules.reduce((acc, mod) => acc + mod.count, 0);

        const section = createEl("section", { class: "course", dataset: { course: String(course) } });
        const header = createEl(
            "button",
            {
                type: "button",
                class: "tree-btn course-btn",
                dataset: { action: "course", course: String(course) },
                "aria-expanded": "false",
            },
            [
                caretIcon(),
                createEl("span", { class: "tree-lbl", text: courseName(course) }),
                createEl("span", { class: "tree-count", text: String(total) }),
            ]
        );
        const body = createEl("div", { class: "course-body" });
        // El contenido va dentro de un envoltorio: así la transición
        // de altura (rejilla 0fr -> 1fr) se anima con suavidad y el
        // borde/margen del árbol no queda visible al plegarse.
        const bodyInner = createEl("div", { class: "course-body-inner" });

        for (const mod of modules) {
            const moduleChildren = [];
            if (mod.code) moduleChildren.push(createEl("span", { class: "tree-codi", text: mod.code }));
            moduleChildren.push(
                createEl("span", { class: "tree-lbl", text: mod.label }),
                createEl("span", { class: "tree-count", text: String(mod.count) })
            );
            bodyInner.append(
                createEl("button", {
                    type: "button",
                    class: "tree-btn module-btn",
                    dataset: { action: "module", course: String(course), module: mod.id },
                }, moduleChildren)
            );

            const formatList = createEl("div", { class: "format-list" });
            for (const ext of mod.extensions) {
                const info = formatInfo(ext);
                formatList.append(
                    createEl(
                        "button",
                        {
                            type: "button",
                            class: "tree-btn format-btn",
                            dataset: { action: "format", course: String(course), module: mod.id, ext },
                        },
                        [
                            createEl("span", { class: "dot", style: { "--c": info.color }, "aria-hidden": "true" }),
                            createEl("span", { class: "tree-lbl", text: info.label }),
                            createEl("span", { class: "tree-count", text: String(mod.formatCounts[ext]) }),
                        ]
                    )
                );
            }
            bodyInner.append(formatList);
        }

        body.append(bodyInner);
        section.append(header, body);
        tree.append(section);
    }
};

// Expande o repliega la sección de un curso en el árbol.
const setCourseOpen = (tree, course, open) => {
    const section = tree.querySelector(`.course[data-course="${course}"]`);
    if (!section) return;
    section.classList.toggle("open", open);
    const button = section.querySelector(".course-btn");
    button.setAttribute("aria-expanded", open ? "true" : "false");
};

// Marca como activo el botón del árbol que coincide con el
// estado de navegación y abre el curso correspondiente.
const refreshTree = (tree) => {
    for (const button of $$("[data-action]", tree)) {
        const action = button.dataset.action;
        const active =
            (action === "root" && state.course === null) ||
            (action === "course" && state.course === Number(button.dataset.course)) ||
            (action === "module" &&
                state.course === Number(button.dataset.course) &&
                state.module === button.dataset.module) ||
            (action === "format" &&
                state.course === Number(button.dataset.course) &&
                state.module === button.dataset.module &&
                state.formats.has(button.dataset.ext));
        button.classList.toggle("active", active);
        if (action === "root") button.setAttribute("aria-current", active ? "true" : "false");
    }
    for (const course of [1, 2]) setCourseOpen(tree, course, state.course === course);
};

// Gestiona los clics sobre cualquier botón del árbol.
const handleTreeClick = (tree, event) => {
    const button = event.target.closest("[data-action]");
    if (!button || !tree.contains(button)) return;
    const action = button.dataset.action;
    const course = Number(button.dataset.course);

    if (action === "root") {
        resetNavigation();
    } else if (action === "course") {
        const section = button.closest(".course");
        // Clic sobre el curso ya activo: si hay un módulo abierto
        // dentro, se sube al curso; si ya estamos en el curso, se
        // cierra (se vuelve a todos los ficheros y se repliega).
        if (state.course === course) {
            if (state.module !== null) {
                state.module = null;
                state.formats.clear();
            } else {
                state.course = null;
                state.formats.clear();
                setCourseOpen(tree, course, false);
            }
            refreshTree(tree);
            renderView(true);
            // En móvil, elegir una opción cierra el cajón para ver
            // los resultados a pantalla completa.
            if (isSidebarOpen()) closeSidebar();
            return;
        }
        state.course = course;
        state.module = null;
        state.formats.clear();
        setCourseOpen(tree, course, true);
    } else if (action === "module") {
        // Un segundo clic en el módulo activo lo cierra: se vuelve
        // al ámbito del curso (sin borrar la expansión del árbol).
        if (state.course === course && state.module === button.dataset.module) {
            state.module = null;
            state.formats.clear();
        } else {
            state.course = course;
            state.module = button.dataset.module;
            state.formats.clear();
            setCourseOpen(tree, course, true);
        }
        button.scrollIntoView({ block: "nearest" });
    } else if (action === "format") {
        // Si el formato pulsado es exactamente el activo, un nuevo
        // clic lo cierra y vuelve al ámbito del módulo.
        const formatActive =
            state.course === course &&
            state.module === button.dataset.module &&
            state.formats.size === 1 &&
            state.formats.has(button.dataset.ext);
        if (formatActive) {
            state.formats.clear();
        } else {
            state.course = course;
            state.module = button.dataset.module;
            state.formats = new Set([button.dataset.ext]);
            setCourseOpen(tree, course, true);
        }
        button.scrollIntoView({ block: "nearest" });
    }
    refreshTree(tree);
    renderView(true);
    // En móvil, elegir una opción cierra el cajón para ver los
    // resultados a pantalla completa.
    if (isSidebarOpen()) closeSidebar();
};

/* ------------------------------------------------------------
   Cabecera de vista, chips de formato y cuadrícula
   ------------------------------------------------------------ */

// Actualiza el título, el subtítulo y el contador de la vista
// según el estado de navegación, los filtros y la búsqueda.
const renderHeader = (files) => {
    const title = $("#viewTitle");
    const subtitle = $("#viewSub");
    const counter = $("#viewCount");

    const selectedFormats = [...state.formats];
    const selectedCount = selectedFormats.length;
    const formatsTitle = () => selectedFormats.map((ext) => formatInfo(ext).label).sort().join(" + ");

    let titleText = t("tree.allFiles");
    let subtitleText = "";

    if (state.module && selectedCount > 0) {
        titleText = formatsTitle();
        subtitleText = `${courseName(state.course)} · ${getModule(state.course, state.module).label}`;
    } else if (state.module) {
        const mod = getModule(state.course, state.module);
        titleText = mod.label;
        subtitleText = `${courseName(state.course)} · ${countNumber(mod.extensions.length)} ${pluralWord(mod.extensions.length, "format")}`;
    } else if (state.course) {
        titleText = courseName(state.course);
        subtitleText = `${countNumber(modulesByCourse[state.course].length)} ${pluralWord(modulesByCourse[state.course].length, "module")}`;
        if (selectedCount > 0) {
            subtitleText += ` · ${countNumber(selectedCount)} ${pluralWord(selectedCount, "selectedFormat")}`;
        }
    } else if (selectedCount > 0) {
        titleText = formatsTitle();
        subtitleText = t("header.acrossCourses", {
            count: countNumber(selectedCount),
            label: pluralWord(selectedCount, "selectedFormat"),
        });
    } else {
        subtitleText = t("view.defaultSubtitle");
    }

    // Añade el contexto de búsqueda al subtítulo cuando hay texto.
    const trimmedQuery = state.query.trim();
    if (trimmedQuery) {
        subtitleText = subtitleText
            ? `${subtitleText} · ${t("header.searchAppend", { query: trimmedQuery })}`
            : t("header.searchStandalone", { query: trimmedQuery });
    }

    title.textContent = titleText;
    subtitle.textContent = subtitleText;
    counter.textContent = `${countNumber(files.length)} ${pluralWord(files.length, "view.count")}`;
};

// Dibuja los chips de formato con su contador de ficheros; los
// chips activos quedan marcados y son combinables entre sí.
const renderChips = (files) => {
    const chips = $("#chips");
    chips.textContent = "";

    const counts = {};
    for (const file of files) counts[file.ext] = (counts[file.ext] || 0) + 1;
    const extensions = Object.keys(counts).sort(
        (a, b) => counts[b] - counts[a] || formatInfo(a).label.localeCompare(formatInfo(b).label)
    );

    for (const ext of extensions) {
        const info = formatInfo(ext);
        const active = state.formats.has(ext);
        chips.append(
            createEl(
                "button",
                {
                    type: "button",
                    class: `chip${active ? " active" : ""}`,
                    dataset: { ext },
                    style: { "--c": info.color },
                    "aria-pressed": active ? "true" : "false",
                },
                [
                    createEl("span", { class: "chip-dot", "aria-hidden": "true" }),
                    createEl("span", { class: "chip-lbl", text: info.label }),
                    createEl("span", { class: "chip-count", text: String(counts[ext]) }),
                ]
            )
        );
    }
};

// Dibuja la cuadrícula de tarjetas de ficheros. Cada tarjeta es
// cuadrada y muestra el formato en el área visual y, en el pie,
// el módulo y el nombre del fichero.
const renderGrid = (files) => {
    const grid = $("#grid");
    grid.textContent = "";
    const query = state.query.trim();

    files.forEach((file, index) => {
        const info = formatInfo(file.ext);
        const textColor = textColorFor(info.color);

        const moduleEl = createEl("span", { class: "card-module" });
        highlightText(moduleEl, file.module, query);
        const nameEl = createEl("span", { class: "card-name" });
        highlightText(nameEl, file.name, query);

        const card = createEl(
            "button",
            {
                type: "button",
                class: "card",
                dataset: { index: String(index), ext: file.ext },
                title: `${file.name} · ${file.module}`,
                "aria-label": t("card.viewAria", { name: file.name, label: info.label }),
                // Retardo escalonado de la animación de entrada; se
                // usa también al buscar, pero solo se dispara cuando
                // la cuadrícula lleva la clase "animating" (se usa el
                // nombre kebab-case porque setProperty no admite
                // camelCase).
                style: {
                    "--c": info.color,
                    "--tc": textColor,
                    "animation-delay": `${Math.min(index * GRID_STAGGER_STEP_MS, GRID_STAGGER_MS)}ms`,
                },
            },
            [
                createEl("span", { class: "card-visual", style: { "--c": info.color, "--tc": textColor } }, [
                    createEl("span", { class: "card-ext", text: info.label }),
                    createEl("span", { class: "card-size", text: formatBytes(file.size) }),
                ]),
                createEl("span", { class: "card-foot" }, [moduleEl, nameEl]),
            ]
        );
        grid.append(card);
    });
};

// Muestra u oculta el aviso de "sin resultados" y adapta su
// mensaje según el motivo (sin inventario, búsqueda o filtros).
const renderEmpty = (files) => {
    const empty = $("#empty");
    if (files.length === 0) {
        empty.classList.remove("hidden");
        const message = $("#emptyMsg");
        if (FILES.length === 0) {
            message.textContent = t("empty.inventory");
        } else if (state.query) {
            message.textContent = t("empty.search", { query: state.query.trim() });
        } else {
            message.textContent = t("empty.filters");
        }
    } else {
        empty.classList.add("hidden");
    }
};

// Temporizador que retira la clase de animación de la cuadrícula
// una vez terminado el efecto escalonado de las tarjetas.
let gridAnimationTimer;

// Renderiza la vista completa a partir del estado actual. Con
// "animate" a true (cambio de ámbito de navegación) se dispara la
// animación de entrada de las tarjetas; la búsqueda nunca anima.
const renderView = (animate = false) => {
    const grid = $(".grid");
    // Se retira siempre la clase de animación: la búsqueda no debe
    // re-dispararla y el próximo cambio de ámbito la reinicia limpio.
    grid.classList.remove("animating");
    window.clearTimeout(gridAnimationTimer);

    currentList = applyFilters();
    renderHeader(currentList);
    renderChips(contextFiles());
    renderGrid(currentList);
    renderEmpty(currentList);

    if (animate) {
        // Reflow forzado para reiniciar la animación aunque la clase
        // acabe de quitarse en el mismo repintado.
        void grid.offsetWidth;
        grid.classList.add("animating");
        // Al terminar se retira la clase: con fill-mode "both" la
        // animación bloquearía el transform del hover de las tarjetas.
        gridAnimationTimer = window.setTimeout(
            () => grid.classList.remove("animating"),
            GRID_ANIMATION_MS + GRID_STAGGER_MS
        );
    }
};

/* ------------------------------------------------------------
   Contenido auxiliar del visor (modal)
   ------------------------------------------------------------ */

// Aviso que se muestra cuando la carpeta de materiales no es
// accesible desde esta instalación.
const unavailableContent = (file) =>
    createEl("div", { class: "alert" }, [
        createEl("p", {}, [createEl("strong", { text: t("unavailable.title") })]),
        createEl("p", { text: t("unavailable.body") }),
    ]);

// Ficha informativa para formatos de Office que el navegador no
// puede previsualizar directamente.
const officeContent = (info) => {
    const textColor = textColorFor(info.color);
    return createEl("div", { class: "office" }, [
        createEl("div", { class: "office-icon", style: { "--c": info.color, "--tc": textColor } }, [
            createEl("span", { text: info.label }),
        ]),
        createEl("div", { class: "office-text" }, [
            createEl("p", { text: t("office.intro", { label: info.label }) }),
            createEl("p", { class: "office-hint", text: t("office.hint") }),
        ]),
    ]);
};

// Rechaza URL con esquemas peligrosos (javascript:, data:…).
const safeHref = (url) => {
    const trimmed = String(url).trim();
    if (/^(javascript|data|vbscript):/i.test(trimmed)) return null;
    return trimmed;
};

/* ------------------------------------------------------------
   Mini renderizador de Markdown (sin librerías externas)
   ------------------------------------------------------------ */

// Divide el texto en fragmentos inline (negritas, código, cursiva
// y enlaces) para procesarlos uno a uno.
const splitInline = (text) => {
    const parts = [];
    const regex = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*|\[[^\]]+\]\([^)\s]+\))/g;
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(text))) {
        if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
        parts.push(match[0]);
        lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) parts.push(text.slice(lastIndex));
    return parts;
};

// Convierte los fragmentos inline de Markdown en nodos DOM:
// **negrita**, `código`, *cursiva* y [enlace](url).
const renderInlineMarkdown = (text) => {
    const fragment = document.createDocumentFragment();
    for (const part of splitInline(String(text))) {
        if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
            fragment.append(createEl("strong", {}, [part.slice(2, -2)]));
        } else if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
            fragment.append(createEl("code", {}, [part.slice(1, -1)]));
        } else if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
            fragment.append(createEl("em", {}, [part.slice(1, -1)]));
        } else if (part.startsWith("[")) {
            const close = part.indexOf("](");
            const href = close > 0 && part.endsWith(")") ? safeHref(part.slice(close + 2, -1)) : null;
            if (close > 0 && href != null) {
                fragment.append(createEl("a", { href, target: "_blank", rel: "noopener" }, [part.slice(1, close)]));
            } else {
                fragment.append(part);
            }
        } else {
            fragment.append(part);
        }
    }
    return fragment;
};

// Convierte un documento Markdown completo en un <article> DOM:
// títulos, listas, citas, bloques de código, hr y párrafos.
const renderMarkdown = (text) => {
    const article = createEl("article", { class: "md-view" });
    const lines = String(text).replace(/\r\n?/g, "\n").split("\n");

    // Bloques abiertos que deben cerrarse antes del siguiente
    // bloque de otro tipo.
    let openList = null; // { tag: 'ul'|'ol', el: <ul>|<ol> }
    let openQuote = null; // <blockquote>
    let openCode = null; // <code> dentro de un <pre>

    const closeList = () => {
        openList = null;
    };

    for (const rawLine of lines) {
        const line = rawLine.trimEnd();

        // Contenido de un bloque de código abierto con ```.
        if (openCode) {
            if (/^```/.test(line.trim())) {
                openCode = null;
                continue;
            }
            openCode.append(`${line}\n`);
            continue;
        }

        // Apertura de un bloque de código con ```.
        if (/^```/.test(line.trim())) {
            closeList();
            openQuote = null;
            const pre = createEl("pre", {}, []);
            openCode = createEl("code", {});
            pre.append(openCode);
            article.append(pre);
            continue;
        }

        // Títulos (# .. ######).
        const heading = line.match(/^(#{1,6})\s+(.*)$/);
        if (heading) {
            closeList();
            openQuote = null;
            article.append(createEl(`h${heading[1].length}`, {}, [renderInlineMarkdown(heading[2])]));
            continue;
        }

        // Línea separadora (---, ***, ___).
        if (/^\s*([-*_])\1{2,}\s*$/.test(line)) {
            closeList();
            openQuote = null;
            article.append(createEl("hr"));
            continue;
        }

        // Listas desordenadas y ordenadas.
        const unordered = line.match(/^\s*[-*+]\s+(.*)$/);
        const ordered = line.match(/^\s*\d+\.\s+(.*)$/);
        if (unordered || ordered) {
            openQuote = null;
            const tag = unordered ? "ul" : "ol";
            if (!openList || openList.tag !== tag) {
                closeList();
                openList = { tag, el: createEl(tag) };
                article.append(openList.el);
            }
            openList.el.append(createEl("li", {}, [renderInlineMarkdown(unordered ? unordered[1] : ordered[1])]));
            continue;
        }

        // Citas en bloque (> …).
        const quote = line.match(/^\s*>\s?(.*)$/);
        if (quote) {
            closeList();
            if (!openQuote) {
                openQuote = createEl("blockquote");
                article.append(openQuote);
            }
            openQuote.append(createEl("p", {}, [renderInlineMarkdown(quote[1])]));
            continue;
        }

        // Línea en blanco: cierra los bloques abiertos.
        if (line.trim() === "") {
            closeList();
            openQuote = null;
            continue;
        }

        // Párrafo normal.
        closeList();
        openQuote = null;
        article.append(createEl("p", {}, [renderInlineMarkdown(line)]));
    }
    return article;
};

/* ------------------------------------------------------------
   Visor de ficheros (modal)
   ------------------------------------------------------------ */

// Devuelve la URL completa de un fichero a partir de la base de
// materiales detectada y de su ruta relativa en el inventario.
const fileUrl = (base, file) => `${base ? `${base}/` : ""}${encodePath(file.path)}`;

// Crea un iframe para previsualizar un fichero en el visor.
const viewerFrame = (title, url) => {
    const frame = createEl("iframe", { class: "viewer-frame", title });
    frame.src = url;
    return frame;
};

// Rellena el visor con el contenido adecuado al tipo de fichero.
// El token evita que una petición antigua pise al fichero actual.
const renderViewer = async (file, materials, token) => {
    const viewer = $("#viewer");
    viewer.textContent = "";
    viewer.append(createEl("p", { class: "viewer-loading", text: t("viewer.loading") }));

    const info = formatInfo(file.ext);
    const url = fileUrl(materials.base, file);
    const type = info.viewer;

    // Sin acceso a la carpeta de materiales: aviso informativo.
    if (!materials.ok) {
        viewer.textContent = "";
        viewer.append(unavailableContent(file));
        return;
    }

    // PDF y HTML se incrustan directamente con el visor nativo.
    if (type === "pdf" || type === "html") {
        viewer.textContent = "";
        viewer.append(viewerFrame(file.name, url));
        return;
    }

    // Imágenes: se muestran escaladas; si falla la carga, aviso.
    if (type === "image") {
        viewer.textContent = "";
        const image = createEl("img", { class: "viewer-img", alt: file.name });
        image.src = url;
        image.addEventListener(
            "error",
            () => {
                if (token === requestToken) {
                    viewer.textContent = "";
                    viewer.append(unavailableContent(file));
                }
            },
            { once: true }
        );
        viewer.append(image);
        return;
    }

    // Audio: reproductor nativo del navegador.
    if (type === "audio") {
        viewer.textContent = "";
        const audio = createEl("audio", { controls: "", preload: "metadata" });
        audio.src = url;
        viewer.append(
            createEl("div", { class: "audio-wrap" }, [
                audio,
                createEl("p", { class: "audio-note", text: t("viewer.audioNote", { label: info.label, size: formatBytes(file.size) }) }),
            ])
        );
        return;
    }

    // GZip (p. ej. volcados SQL grandes): se descomprime por
    // streaming y solo se muestra un adelanto del texto para no
    // volcar el fichero completo en el DOM.
    if (type === "gzip") {
        if (typeof DecompressionStream === "undefined") {
            viewer.textContent = "";
            viewer.append(officeContent(info));
            return;
        }
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const reader = response.body
                .pipeThrough(new DecompressionStream("gzip"))
                .getReader();
            const decoder = new TextDecoder();
            let preview = "";
            let truncated = false;
            while (!truncated) {
                const { value, done } = await reader.read();
                if (done) break;
                const chunkText = decoder.decode(value, { stream: true });
                const room = GZIP_PREVIEW_LIMIT - preview.length;
                if (chunkText.length > room) {
                    preview += chunkText.slice(0, Math.max(0, room));
                    truncated = true;
                } else {
                    preview += chunkText;
                }
            }
            // Si se cortó el adelanto se cancela el flujo; si no,
            // se descarga el tramo final del decodificador.
            if (truncated) reader.cancel().catch(() => {});
            else preview += decoder.decode();

            if (token !== requestToken) return;
            viewer.textContent = "";
            const pre = createEl("pre", { class: "code-view" }, []);
            const code = createEl("code", {});
            code.textContent = preview;
            pre.append(code);
            viewer.append(pre);
            if (truncated) {
                viewer.append(createEl("p", { class: "code-note", text: t("viewer.gzipNote") }));
            }
        } catch (error) {
            // Si la descarga o la descompresión fallan (p. ej.
            // gzip corrupto), se muestra la ficha de descarga y se
            // registra el motivo en la consola.
            console.error("No se pudo previsualizar el fichero comprimido:", error);
            if (token !== requestToken) return;
            viewer.textContent = "";
            viewer.append(officeContent(info));
        }
        return;
    }

    // Office y formatos desconocidos: ficha con la acción a seguir.
    if (type === "office" || type === "file") {
        viewer.textContent = "";
        viewer.append(officeContent(info));
        return;
    }

    // Texto, código y Markdown: si el fichero es enorme se abre en
    // un iframe en lugar de descargarlo entero por fetch.
    if ((file.size || 0) >= TEXT_PREVIEW_LIMIT) {
        viewer.textContent = "";
        viewer.append(viewerFrame(file.name, url));
        return;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const content = await response.text();
        if (token !== requestToken) return;
        viewer.textContent = "";
        if (file.ext === "md") {
            viewer.append(renderMarkdown(content));
        } else {
            const pre = createEl("pre", { class: "code-view" }, []);
            const code = createEl("code", {});
            code.textContent = content;
            pre.append(code);
            viewer.append(pre);
        }
    } catch (_) {
        // Si el fetch falla (p. ej. CORS local), se intenta abrir
        // el fichero directamente en un iframe.
        if (token !== requestToken) return;
        viewer.textContent = "";
        viewer.append(viewerFrame(file.name, url));
    }
};

// Indica si el modal del visor está abierto.
const isModalOpen = () => !$("#modal").classList.contains("hidden");

// Abre el modal con el fichero que ocupa la posición "index" de
// la lista filtrada actual.
const openModal = async (index) => {
    const file = currentList[index];
    if (!file) return;

    currentIndex = index;
    requestToken += 1;
    const token = requestToken;

    const info = formatInfo(file.ext);
    const mod = getModule(file.course, file.moduleId);
    const route = `${courseName(file.course)} · ${mod.code ? `${mod.code} · ` : ""}${file.module}`;

    $("#modalKicker").textContent = `${info.label} · ${formatBytes(file.size)}`;
    $("#modalTitle").textContent = file.name;
    $("#modalTitle").title = file.path;
    $("#modalSub").textContent = route;
    $("#modalPath").textContent = file.path;
    $("#modalPath").title = file.path;

    // Los enlaces se rellenan al conocer la base de materiales.
    const openLink = $("#modalOpen");
    const downloadLink = $("#modalDownload");
    openLink.href = "#";
    downloadLink.href = "#";
    downloadLink.download = file.name;

    $("#modal").classList.remove("hidden");
    document.body.classList.add("modal-open");

    const viewer = $("#viewer");
    viewer.textContent = "";

    try {
        const materials = await materialsProbe;
        if (token !== requestToken) return;
        openLink.href = fileUrl(materials.base, file);
        downloadLink.href = fileUrl(materials.base, file);
        await renderViewer(file, materials, token);
    } catch (_) {
        if (token !== requestToken) return;
        viewer.textContent = "";
        viewer.append(unavailableContent(file));
    }

    refreshNavButtons();
    $("#modalClose").focus();
};

// Cierra el modal y limpia el visor.
const closeModal = () => {
    if (!isModalOpen()) return;
    requestToken += 1;
    $("#modal").classList.add("hidden");
    document.body.classList.remove("modal-open");
    $("#viewer").textContent = "";
};

// Actualiza los botones anterior/siguiente y el contador de
// posición del modal según el fichero abierto.
const refreshNavButtons = () => {
    const prev = $("#modalPrev");
    const next = $("#modalNext");
    prev.disabled = currentIndex <= 0;
    next.disabled = currentIndex >= currentList.length - 1;
    $("#modalPos").textContent = currentList.length > 1 ? `${currentIndex + 1} / ${currentList.length}` : "";
};

/* ------------------------------------------------------------
   Traducciones estáticas y selector de idioma
   ------------------------------------------------------------ */

// Aplica el idioma activo a los textos estáticos del HTML:
// atributo lang, meta description, texto de los nodos marcados
// con data-i18n, aria-label con data-i18n-aria y placeholders.
const applyStaticTexts = () => {
    document.documentElement.lang = currentLang();
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", t("meta.desc"));

    for (const el of $$("[data-i18n]")) el.textContent = t(el.dataset.i18n);
    for (const el of $$("[data-i18n-aria]")) el.setAttribute("aria-label", t(el.dataset.i18nAria));
    for (const el of $$("[data-i18n-placeholder]")) el.placeholder = t(el.dataset.i18nPlaceholder);
};

// Marca el botón del idioma activo en el selector.
const syncLanguageButtons = () => {
    for (const button of $$(".lang-btn")) {
        const active = button.dataset.lang === currentLang();
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", active ? "true" : "false");
    }
};

// Cambia el idioma de la interfaz y vuelve a pintar todo lo que
// depende de los textos (árbol, resumen, cabecera y cuadrícula).
// La carga del diccionario es asíncrona (fetch de lang/*.json).
const changeLanguage = async (lang) => {
    if (!setLanguage(lang)) return;

    // Si el modal estaba abierto se recuerda el fichero actual
    // para reabrirlo después de repintar con el nuevo idioma.
    const wasOpen = isModalOpen();
    const reopenIndex = currentIndex;
    if (wasOpen) closeModal();

    try {
        await ensureDictionaries(currentLang());
    } catch (error) {
        // Si falla la descarga (p. ej. sin red local), se intenta
        // con el catalán; si tampoco se puede, se avisa y se usa
        // la clave como texto de último recurso.
        console.error("No se pudo cargar el diccionario de idioma:", error);
        setLanguage(DEFAULT_LANG);
    }

    applyStaticTexts();
    syncLanguageButtons();
    renderAll();

    if (wasOpen && reopenIndex >= 0 && reopenIndex < currentList.length) {
        openModal(reopenIndex);
    }
};

/* ------------------------------------------------------------
   Buscador
   ------------------------------------------------------------ */

const searchInputEl = () => $("#searchInput");

// Muestra u oculta el botón de limpiar según haya texto escrito.
const refreshSearchClear = () => {
    $("#searchClear").classList.toggle("hidden", searchInputEl().value === "");
};

// Temporizador del retardo de la búsqueda (debounce).
let debounceTimer;

/* ------------------------------------------------------------
   Cajón lateral (móvil)
   ------------------------------------------------------------ */

// Elemento contenedor de toda la aplicación (recibe la clase que
// abre y cierra el cajón del panel lateral).
const appEl = () => document.querySelector(".app");

// Indica si el cajón del panel lateral está abierto (solo aplica
// en móvil; en pantallas grandes el panel es siempre visible).
const isSidebarOpen = () => appEl().classList.contains("sidebar-open");

// Cierra el cajón: quita las clases y sincroniza aria-expanded.
const closeSidebar = () => {
    const app = appEl();
    if (!app.classList.contains("sidebar-open")) return;
    app.classList.remove("sidebar-open");
    document.body.classList.remove("sidebar-open");
    const button = $("#menuBtn");
    if (button) button.setAttribute("aria-expanded", "false");
};

// Abre el cajón y lleva el foco al árbol de navegación para que el
// teclado pueda recorrer las opciones desde el principio.
const openSidebar = () => {
    appEl().classList.add("sidebar-open");
    document.body.classList.add("sidebar-open");
    $("#menuBtn").setAttribute("aria-expanded", "true");
    $("#tree").focus();
};

/* ------------------------------------------------------------
   Arranque de la aplicación
   ------------------------------------------------------------ */

// Pinta el árbol, el resumen y la vista principal. Se usa tanto
// al arrancar como al cambiar el idioma de la interfaz.
const renderAll = () => {
    const tree = $("#tree");
    buildTree(tree);
    renderSummary();
    renderView();
};

// Inicializa la interfaz: idioma, textos estáticos, árbol, resumen,
// vista y todos los manejadores de eventos.
const init = async () => {
    const tree = $("#tree");

    // Asegura que el diccionario del idioma guardado/detectado (y
    // el de catalán como respaldo) esté cargado antes de pintar.
    try {
        await ensureDictionaries(currentLang());
    } catch (error) {
        console.error("No se pudo cargar el diccionario de idioma:", error);
        setLanguage(DEFAULT_LANG);
    }

    // Aplica el idioma guardado/detectado y marca su botón.
    applyStaticTexts();
    syncLanguageButtons();

    renderAll();

    // Selector de idioma (CA / ES / EN).
    for (const button of $$(".lang-btn")) {
        button.addEventListener("click", () => changeLanguage(button.dataset.lang));
    }

    // Cajón lateral en móvil: el botón de menú abre y cierra el
    // panel; el fondo oscuro también lo cierra.
    $("#menuBtn").addEventListener("click", () => {
        if (isSidebarOpen()) closeSidebar();
        else openSidebar();
    });
    $("#sidebarBackdrop").addEventListener("click", () => {
        closeSidebar();
        $("#menuBtn").focus();
    });

    // Al pasar a pantalla grande el cajón deja de aplicarse: se
    // limpia el estado para que al volver a móvil empiece cerrado.
    window.matchMedia("(min-width: 921px)").addEventListener("change", (event) => {
        if (event.matches) closeSidebar();
    });

    // Navegación por el árbol lateral.
    tree.addEventListener("click", (event) => handleTreeClick(tree, event));

    // Clicks sobre los chips de formato (se combinan entre sí).
    $("#chips").addEventListener("click", (event) => {
        const button = event.target.closest("[data-ext]");
        if (!button) return;
        const ext = button.dataset.ext;
        if (state.formats.has(ext)) state.formats.delete(ext);
        else state.formats.add(ext);
        refreshTree(tree);
        renderView(true);
    });

    // Clicks sobre las tarjetas: abren el visor del fichero.
    $("#grid").addEventListener("click", (event) => {
        const card = event.target.closest(".card");
        if (!card) return;
        openModal(Number(card.dataset.index));
    });

    // Escritura en el buscador con retardo (debounce).
    const input = searchInputEl();
    input.addEventListener("input", () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            state.query = input.value;
            renderView();
        }, DEBOUNCE_MS);
    });

    // Escape dentro del buscador: limpia o quita el foco.
    input.addEventListener("keydown", (event) => {
        if (event.key === KEYS.ESCAPE) {
            if (input.value !== "") {
                input.value = "";
                state.query = "";
                renderView();
            } else {
                input.blur();
            }
        }
    });

    // Botón de limpiar la búsqueda.
    $("#searchClear").addEventListener("click", () => {
        input.value = "";
        state.query = "";
        renderView();
        input.focus();
    });

    // Botón "Mostra-ho tot" del estado vacío.
    $("#emptyReset").addEventListener("click", () => {
        resetNavigation();
        input.value = "";
        state.query = "";
        refreshTree(tree);
        renderView(true);
    });

    // Modal: cierre por botón, fondo o teclado.
    $("#modalClose").addEventListener("click", closeModal);
    $("#modal").querySelector("[data-close]").addEventListener("click", closeModal);
    $("#modalPrev").addEventListener("click", () => {
        if (currentIndex > 0) openModal(currentIndex - 1);
    });
    $("#modalNext").addEventListener("click", () => {
        if (currentIndex < currentList.length - 1) openModal(currentIndex + 1);
    });

    // Atajos globales de teclado: con el modal abierto, Escape lo
    // cierra y las flechas cambian de fichero; con "/" se enfoca
    // el buscador (salvo que el foco ya esté en un campo de texto).
    document.addEventListener("keydown", (event) => {
        if (isModalOpen()) {
            if (event.key === KEYS.ESCAPE) {
                closeModal();
            } else if (event.key === KEYS.ARROW_LEFT && currentIndex > 0) {
                openModal(currentIndex - 1);
            } else if (event.key === KEYS.ARROW_RIGHT && currentIndex < currentList.length - 1) {
                openModal(currentIndex + 1);
            }
            return;
        }
        // Escape cierra el cajón lateral del móvil si está abierto.
        if (event.key === KEYS.ESCAPE && isSidebarOpen()) {
            closeSidebar();
            $("#menuBtn").focus();
            return;
        }
        if (event.key === KEYS.SLASH) {
            const active = document.activeElement;
            if (active && (/^(INPUT|TEXTAREA|SELECT)$/.test(active.tagName) || active.isContentEditable)) return;
            event.preventDefault();
            input.focus();
            input.select();
        }
    });

    refreshSearchClear();
};

// Arranque automático cuando se ejecuta en un navegador (el
// guardado permite importar el módulo desde Node para pruebas).
if (typeof document !== "undefined" && typeof document.createElement === "function") {
    init().catch((error) => {
        // Cualquier error inesperado al arrancar se muestra en la
        // consola para poder diagnosticarlo.
        console.error("Error al iniciar la aplicación:", error);
    });
}
