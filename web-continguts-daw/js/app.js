import { FILES } from "../data/files.js";

import {
    DEFAULT_LANG,
    current as currentLang,
    ensureDictionaries,
    locale,
    setLanguage,
    translate as t,
} from "./i18n.js";

const courseName = (course) => t(`course.${course}`);

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

const FALLBACK_PALETTE = [
    "#1769e8",
    "#ff5b45",
    "#7c3aed",
    "#4a9fd4",
    "#c8e832",
    "#f5b83c",
    "#3cbdb1",
    "#d95c5c",
];

const DARK_TEXT_COLORS = new Set(["#c8e832", "#f5b83c"]);

const KEYS = Object.freeze({
    SLASH: "/",
    ESCAPE: "Escape",
    ARROW_LEFT: "ArrowLeft",
    ARROW_RIGHT: "ArrowRight",
});

const DEBOUNCE_MS = 120;

const TEXT_PREVIEW_LIMIT = 1_500_000;

const GZIP_PREVIEW_LIMIT = 262_144;

const GRID_ANIMATION_MS = 320;

const GRID_STAGGER_MS = 300;

const GRID_STAGGER_STEP_MS = 12;

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

const MATERIAL_DIRS = [
    "",
    "../../../Descargas/desenvolupament_aplicacions_web",
    "../Descargas/desenvolupament_aplicacions_web",
    "/Descargas/desenvolupament_aplicacions_web",
];

const $ = (selector, element = document) => element.querySelector(selector);
const $$ = (selector, element = document) => [...element.querySelectorAll(selector)];

const formatInfo = (ext) => {
    const known = FORMATS[ext];
    if (known) return { ...known, label: t(`fmt.${ext}`) };
    let checksum = 0;
    for (const char of ext) checksum += char.charCodeAt(0);
    return {
        label: ext.toUpperCase(),
        color: FALLBACK_PALETTE[checksum % FALLBACK_PALETTE.length],
        viewer: "file",
    };
};

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

const normalizeText = (text) =>
    String(text)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const textColorFor = (color) => (DARK_TEXT_COLORS.has(color) ? "var(--ink)" : "#ffffff");

const pluralWord = (count, baseKey) => t(count === 1 ? `${baseKey}.one` : `${baseKey}.many`);

const countNumber = (count) => count.toLocaleString(locale());

const createEl = (tag, attrs = {}, children = []) => {
    const el = document.createElement(tag);
    for (const [name, value] of Object.entries(attrs)) {
        if (value === null || value === undefined || value === false) continue;
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
        if (child === null || child === undefined || child === false) continue;
        el.append(child instanceof Node ? child : document.createTextNode(String(child)));
    }
    return el;
};

const createSvgEl = (tag, attrs = {}, children = []) => {
    const el = document.createElementNS(SVG_NAMESPACE, tag);
    for (const [name, value] of Object.entries(attrs)) {
        if (value === null || value === undefined || value === false) continue;
        el.setAttribute(name, String(value));
    }
    for (const child of children) if (child) el.append(child);
    return el;
};

const gridIcon = () =>
    createSvgEl("svg", { class: "tree-ico", viewBox: "0 0 16 16", "aria-hidden": "true" }, [
        createSvgEl("rect", {
            x: 1,
            y: 1,
            width: 6,
            height: 6,
            fill: "none",
            stroke: "currentColor",
            "stroke-width": 2,
        }),
        createSvgEl("rect", {
            x: 9,
            y: 1,
            width: 6,
            height: 6,
            fill: "none",
            stroke: "currentColor",
            "stroke-width": 2,
        }),
        createSvgEl("rect", {
            x: 1,
            y: 9,
            width: 6,
            height: 6,
            fill: "none",
            stroke: "currentColor",
            "stroke-width": 2,
        }),
        createSvgEl("rect", {
            x: 9,
            y: 9,
            width: 6,
            height: 6,
            fill: "none",
            stroke: "currentColor",
            "stroke-width": 2,
        }),
    ]);

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

const encodePath = (relative) => relative.split("/").map(encodeURIComponent).join("/");

const materialsProbe = (async () => {
    if (FILES.length === 0) return { base: "", ok: false };
    const sample = FILES[0].path;
    for (const candidate of MATERIAL_DIRS) {
        const prefix = candidate.replace(/\/+$/, "");

        const url = prefix ? `${prefix}/${encodePath(sample)}` : encodePath(sample);
        try {
            const response = await fetch(url, { method: "HEAD" });
            if (response.ok) return { base: prefix, ok: true };
        } catch {
            continue;
        }
    }
    return { base: "", ok: false };
})();

const state = {
    course: null,
    module: null,
    formats: new Set(),
    query: "",
};

const resetNavigation = () => {
    state.course = null;
    state.module = null;
    state.formats.clear();
};

const moduleKey = (course, moduleId) => `${course}|${moduleId}`;

let currentList = [];

let currentIndex = -1;

let requestToken = 0;

const modulesByCourse = { 1: [], 2: [] };

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

for (const list of Object.values(modulesByCourse)) {
    for (const mod of list) {
        mod.extensions = Object.keys(mod.formatCounts).sort(
            (a, b) => mod.formatCounts[b] - mod.formatCounts[a] || a.localeCompare(b)
        );
    }
}

const getModule = (course, moduleId) => moduleLookup.get(moduleKey(course, moduleId));

const contextFiles = () =>
    FILES.filter(
        (file) =>
            (state.course === null || file.course === state.course) &&
            (state.module === null || file.moduleId === state.module)
    );

const applyFilters = () => {
    const query = normalizeText(state.query.trim());
    return contextFiles().filter((file) => {
        if (state.formats.size > 0 && !state.formats.has(file.ext)) return false;
        if (query) {
            const haystack = [
                file.name,
                file.module,
                formatInfo(file.ext).label,
                file.ext,
                file.code,
            ]
                .map(normalizeText)
                .join(" ");
            if (!haystack.includes(query)) return false;
        }
        return true;
    });
};

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

const buildTree = (tree) => {
    tree.textContent = "";

    const rootButton = createEl(
        "button",
        { type: "button", class: "tree-btn", dataset: { action: "root" }, "aria-current": "true" },
        [
            gridIcon(),
            createEl("span", { class: "tree-lbl", text: t("tree.allFiles") }),
            createEl("span", { class: "tree-count", text: String(FILES.length) }),
        ]
    );
    tree.append(rootButton, createEl("div", { class: "tree-sep", role: "presentation" }));

    for (const course of [1, 2]) {
        const modules = modulesByCourse[course];
        const total = modules.reduce((acc, mod) => acc + mod.count, 0);

        const section = createEl("section", {
            class: "course",
            dataset: { course: String(course) },
        });
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

        const bodyInner = createEl("div", { class: "course-body-inner" });

        for (const mod of modules) {
            const moduleChildren = [];
            if (mod.code)
                moduleChildren.push(createEl("span", { class: "tree-codi", text: mod.code }));
            moduleChildren.push(
                createEl("span", { class: "tree-lbl", text: mod.label }),
                createEl("span", { class: "tree-count", text: String(mod.count) })
            );
            bodyInner.append(
                createEl(
                    "button",
                    {
                        type: "button",
                        class: "tree-btn module-btn",
                        dataset: { action: "module", course: String(course), module: mod.id },
                    },
                    moduleChildren
                )
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
                            dataset: {
                                action: "format",
                                course: String(course),
                                module: mod.id,
                                ext,
                            },
                        },
                        [
                            createEl("span", {
                                class: "dot",
                                style: { "--c": info.color },
                                "aria-hidden": "true",
                            }),
                            createEl("span", { class: "tree-lbl", text: info.label }),
                            createEl("span", {
                                class: "tree-count",
                                text: String(mod.formatCounts[ext]),
                            }),
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

const setCourseOpen = (tree, course, open) => {
    const section = tree.querySelector(`.course[data-course="${course}"]`);
    if (!section) return;
    section.classList.toggle("open", open);
    const button = section.querySelector(".course-btn");
    button.setAttribute("aria-expanded", open ? "true" : "false");
};

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

const handleTreeClick = (tree, event) => {
    const button = event.target.closest("[data-action]");
    if (!button || !tree.contains(button)) return;
    const action = button.dataset.action;
    const course = Number(button.dataset.course);

    if (action === "root") {
        resetNavigation();
    } else if (action === "course") {
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

            if (isSidebarOpen()) closeSidebar();
            return;
        }
        state.course = course;
        state.module = null;
        state.formats.clear();
        setCourseOpen(tree, course, true);
    } else if (action === "module") {
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

    if (isSidebarOpen()) closeSidebar();
};

const renderHeader = (files) => {
    const title = $("#viewTitle");
    const subtitle = $("#viewSub");
    const counter = $("#viewCount");

    const selectedFormats = [...state.formats];
    const selectedCount = selectedFormats.length;
    const formatsTitle = () =>
        selectedFormats
            .map((ext) => formatInfo(ext).label)
            .sort()
            .join(" + ");

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

const renderGrid = (files) => {
    const grid = $("#grid");
    grid.textContent = "";
    const query = state.query.trim();

    files.forEach((file, index) => {
        const info = formatInfo(file.ext);
        const textColor = textColorFor(info.color);

        const moduleEl = createEl("span", { class: "file-card-module" });
        highlightText(moduleEl, file.module, query);
        const nameEl = createEl("span", { class: "file-card-name" });
        highlightText(nameEl, file.name, query);

        const card = createEl(
            "button",
            {
                type: "button",
                class: "file-card",
                dataset: { index: String(index), ext: file.ext },
                title: `${file.name} · ${file.module}`,
                "aria-label": t("card.viewAria", { name: file.name, label: info.label }),

                style: {
                    "--c": info.color,
                    "--tc": textColor,
                    "animation-delay": `${Math.min(index * GRID_STAGGER_STEP_MS, GRID_STAGGER_MS)}ms`,
                },
            },
            [
                createEl(
                    "span",
                    { class: "file-card-visual", style: { "--c": info.color, "--tc": textColor } },
                    [
                        createEl("span", { class: "file-card-ext", text: info.label }),
                        createEl("span", { class: "file-card-size", text: formatBytes(file.size) }),
                    ]
                ),
                createEl("span", { class: "file-card-foot" }, [moduleEl, nameEl]),
            ]
        );
        grid.append(card);
    });
};

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

let gridAnimationTimer;

const renderView = (animate = false) => {
    const grid = $(".grid");

    grid.classList.remove("animating");
    window.clearTimeout(gridAnimationTimer);

    currentList = applyFilters();
    renderHeader(currentList);
    renderChips(contextFiles());
    renderGrid(currentList);
    renderEmpty(currentList);

    if (animate) {
        void grid.offsetWidth;
        grid.classList.add("animating");

        gridAnimationTimer = window.setTimeout(
            () => grid.classList.remove("animating"),
            GRID_ANIMATION_MS + GRID_STAGGER_MS
        );
    }
};

const unavailableContent = () =>
    createEl("div", { class: "alert" }, [
        createEl("p", {}, [createEl("strong", { text: t("unavailable.title") })]),
        createEl("p", { text: t("unavailable.body") }),
    ]);

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

const safeHref = (url) => {
    const trimmed = String(url).trim();
    if (/^(javascript|data|vbscript):/i.test(trimmed)) return null;
    return trimmed;
};

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
            const href =
                close > 0 && part.endsWith(")") ? safeHref(part.slice(close + 2, -1)) : null;
            if (close > 0 && href !== null && href !== undefined) {
                fragment.append(
                    createEl("a", { href, target: "_blank", rel: "noopener" }, [
                        part.slice(1, close),
                    ])
                );
            } else {
                fragment.append(part);
            }
        } else {
            fragment.append(part);
        }
    }
    return fragment;
};

const renderMarkdown = (text) => {
    const article = createEl("article", { class: "md-view" });
    const lines = String(text).replace(/\r\n?/g, "\n").split("\n");

    let openList = null;
    let openQuote = null;
    let openCode = null;

    const closeList = () => {
        openList = null;
    };

    for (const rawLine of lines) {
        const line = rawLine.trimEnd();

        if (openCode) {
            if (/^```/.test(line.trim())) {
                openCode = null;
                continue;
            }
            openCode.append(`${line}\n`);
            continue;
        }

        if (/^```/.test(line.trim())) {
            closeList();
            openQuote = null;
            const pre = createEl("pre", {}, []);
            openCode = createEl("code", {});
            pre.append(openCode);
            article.append(pre);
            continue;
        }

        const heading = line.match(/^(#{1,6})\s+(.*)$/);
        if (heading) {
            closeList();
            openQuote = null;
            article.append(
                createEl(`h${heading[1].length}`, {}, [renderInlineMarkdown(heading[2])])
            );
            continue;
        }

        if (/^\s*([-*_])\1{2,}\s*$/.test(line)) {
            closeList();
            openQuote = null;
            article.append(createEl("hr"));
            continue;
        }

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
            openList.el.append(
                createEl("li", {}, [renderInlineMarkdown(unordered ? unordered[1] : ordered[1])])
            );
            continue;
        }

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

        if (line.trim() === "") {
            closeList();
            openQuote = null;
            continue;
        }

        closeList();
        openQuote = null;
        article.append(createEl("p", {}, [renderInlineMarkdown(line)]));
    }
    return article;
};

const fileUrl = (base, file) => `${base ? `${base}/` : ""}${encodePath(file.path)}`;

const viewerFrame = (title, url) => {
    const frame = createEl("iframe", { class: "viewer-frame", title });
    frame.src = url;
    return frame;
};

const renderViewer = async (file, materials, token) => {
    const viewer = $("#viewer");
    viewer.textContent = "";
    viewer.append(createEl("p", { class: "viewer-loading", text: t("viewer.loading") }));

    const info = formatInfo(file.ext);
    const url = fileUrl(materials.base, file);
    const type = info.viewer;

    if (!materials.ok) {
        viewer.textContent = "";
        viewer.append(unavailableContent());
        return;
    }

    if (type === "pdf" || type === "html") {
        viewer.textContent = "";
        viewer.append(viewerFrame(file.name, url));
        return;
    }

    if (type === "image") {
        viewer.textContent = "";
        const image = createEl("img", { class: "viewer-img", alt: file.name });
        image.src = url;
        image.addEventListener(
            "error",
            () => {
                if (token === requestToken) {
                    viewer.textContent = "";
                    viewer.append(unavailableContent());
                }
            },
            { once: true }
        );
        viewer.append(image);
        return;
    }

    if (type === "audio") {
        viewer.textContent = "";
        const audio = createEl("audio", { controls: "", preload: "metadata" });
        audio.src = url;
        viewer.append(
            createEl("div", { class: "audio-wrap" }, [
                audio,
                createEl("p", {
                    class: "audio-note",
                    text: t("viewer.audioNote", {
                        label: info.label,
                        size: formatBytes(file.size),
                    }),
                }),
            ])
        );
        return;
    }

    if (type === "gzip") {
        if (typeof DecompressionStream === "undefined") {
            viewer.textContent = "";
            viewer.append(officeContent(info));
            return;
        }
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const reader = response.body.pipeThrough(new DecompressionStream("gzip")).getReader();
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
        } catch {
            if (token !== requestToken) return;
            viewer.textContent = "";
            viewer.append(officeContent(info));
        }
        return;
    }

    if (type === "office" || type === "file") {
        viewer.textContent = "";
        viewer.append(officeContent(info));
        return;
    }

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
    } catch {
        if (token !== requestToken) return;
        viewer.textContent = "";
        viewer.append(viewerFrame(file.name, url));
    }
};

const isModalOpen = () => !$("#modal").classList.contains("hidden");

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
    } catch {
        if (token !== requestToken) return;
        viewer.textContent = "";
        viewer.append(unavailableContent());
    }

    refreshNavButtons();
    $("#modalClose").focus();
};

const closeModal = () => {
    if (!isModalOpen()) return;
    requestToken += 1;
    $("#modal").classList.add("hidden");
    document.body.classList.remove("modal-open");
    $("#viewer").textContent = "";
};

const refreshNavButtons = () => {
    const prev = $("#modalPrev");
    const next = $("#modalNext");
    prev.disabled = currentIndex <= 0;
    next.disabled = currentIndex >= currentList.length - 1;
    $("#modalPos").textContent =
        currentList.length > 1 ? `${currentIndex + 1} / ${currentList.length}` : "";
};

const applyStaticTexts = () => {
    document.documentElement.lang = currentLang();
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", t("meta.desc"));

    for (const el of $$("[data-i18n]")) el.textContent = t(el.dataset.i18n);
    for (const el of $$("[data-i18n-aria]")) el.setAttribute("aria-label", t(el.dataset.i18nAria));
    for (const el of $$("[data-i18n-placeholder]")) el.placeholder = t(el.dataset.i18nPlaceholder);
};

const syncLanguageButtons = () => {
    for (const button of $$(".lang-btn")) {
        const active = button.dataset.lang === currentLang();
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", active ? "true" : "false");
    }
};

const changeLanguage = async (lang) => {
    if (!setLanguage(lang)) return;

    const wasOpen = isModalOpen();
    const reopenIndex = currentIndex;
    if (wasOpen) closeModal();

    try {
        await ensureDictionaries(currentLang());
    } catch {
        setLanguage(DEFAULT_LANG);
    }

    applyStaticTexts();
    syncLanguageButtons();
    renderAll();

    if (wasOpen && reopenIndex >= 0 && reopenIndex < currentList.length) {
        openModal(reopenIndex);
    }
};

const searchInputEl = () => $("#searchInput");

const refreshSearchClear = () => {
    $("#searchClear").classList.toggle("hidden", searchInputEl().value === "");
};

let debounceTimer;

const appEl = () => document.querySelector(".app");

const isSidebarOpen = () => appEl().classList.contains("sidebar-open");

const closeSidebar = () => {
    const app = appEl();
    if (!app.classList.contains("sidebar-open")) return;
    app.classList.remove("sidebar-open");
    document.body.classList.remove("sidebar-open");
    const button = $("#menuBtn");
    if (button) button.setAttribute("aria-expanded", "false");
};

const openSidebar = () => {
    appEl().classList.add("sidebar-open");
    document.body.classList.add("sidebar-open");
    $("#menuBtn").setAttribute("aria-expanded", "true");
    $("#tree").focus();
};

const renderAll = () => {
    const tree = $("#tree");
    buildTree(tree);
    renderSummary();
    renderView();
};

const init = async () => {
    const tree = $("#tree");

    try {
        await ensureDictionaries(currentLang());
    } catch {
        setLanguage(DEFAULT_LANG);
    }

    applyStaticTexts();
    syncLanguageButtons();

    renderAll();

    for (const button of $$(".lang-btn")) {
        button.addEventListener("click", () => changeLanguage(button.dataset.lang));
    }

    $("#menuBtn").addEventListener("click", () => {
        if (isSidebarOpen()) closeSidebar();
        else openSidebar();
    });
    $("#sidebarBackdrop").addEventListener("click", () => {
        closeSidebar();
        $("#menuBtn").focus();
    });

    window.matchMedia("(min-width: 921px)").addEventListener("change", (event) => {
        if (event.matches) closeSidebar();
    });

    tree.addEventListener("click", (event) => handleTreeClick(tree, event));

    $("#chips").addEventListener("click", (event) => {
        const button = event.target.closest("[data-ext]");
        if (!button) return;
        const ext = button.dataset.ext;
        if (state.formats.has(ext)) state.formats.delete(ext);
        else state.formats.add(ext);
        refreshTree(tree);
        renderView(true);
    });

    $("#grid").addEventListener("click", (event) => {
        const card = event.target.closest(".file-card");
        if (!card) return;
        openModal(Number(card.dataset.index));
    });

    const input = searchInputEl();
    input.addEventListener("input", () => {
        refreshSearchClear();
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            state.query = input.value;
            renderView();
        }, DEBOUNCE_MS);
    });

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

    $("#searchClear").addEventListener("click", () => {
        input.value = "";
        state.query = "";
        renderView();
        refreshSearchClear();
        input.focus();
    });

    $("#emptyReset").addEventListener("click", () => {
        resetNavigation();
        input.value = "";
        state.query = "";
        refreshTree(tree);
        renderView(true);
    });

    $("#modalClose").addEventListener("click", closeModal);
    $("#modal").querySelector("[data-close]").addEventListener("click", closeModal);
    $("#modalPrev").addEventListener("click", () => {
        if (currentIndex > 0) openModal(currentIndex - 1);
    });
    $("#modalNext").addEventListener("click", () => {
        if (currentIndex < currentList.length - 1) openModal(currentIndex + 1);
    });

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

        if (event.key === KEYS.ESCAPE && isSidebarOpen()) {
            closeSidebar();
            $("#menuBtn").focus();
            return;
        }
        if (event.key === KEYS.SLASH) {
            const active = document.activeElement;
            if (
                active &&
                (/^(INPUT|TEXTAREA|SELECT)$/.test(active.tagName) || active.isContentEditable)
            )
                return;
            event.preventDefault();
            input.focus();
            input.select();
        }
    });

    refreshSearchClear();
};

if (typeof document !== "undefined" && typeof document.createElement === "function") {
    init().catch(() => {});
}
