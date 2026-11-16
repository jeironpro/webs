import {
    documentStats,
    parseMarkdown,
    prefixSelection,
    wrapSelection,
} from "./modules/markdown.js";

const STORAGE_KEY = "pliego:v1";
const DESKTOP_QUERY = "(min-width: 64rem)";

const SAMPLE = [
    "# Cuaderno de campo",
    "",
    "Un **pliego** es una hoja de pruebas: aquí escribes en Markdown y ves la composición al otro lado, sin enviar nada a ningún servidor.",
    "",
    "## Lo esencial",
    "",
    "- **Negrita** para lo que no puede pasar desapercibido.",
    "- *Cursiva* para un matiz.",
    "- `código` cuando la precisión importa.",
    "- Un [enlace seguro](https://developer.mozilla.org/es/docs/Web/HTML) que se abre fuera.",
    "",
    "> Escribe a la izquierda. Corrige a la derecha.",
    "",
    "```js",
    'const editor = document.querySelector("#editor");',
    'editor.addEventListener("input", componer);',
    "```",
    "",
    "---",
    "",
    "1. Escribe el borrador.",
    "2. Revisa la galerada.",
    "3. Publica cuando esté limpio.",
    "",
].join("\n");

const $ = (id) => document.getElementById(id);

const elements = {
    editor: $("editor"),
    lineNumbers: $("line-numbers"),
    preview: $("preview"),
    previewEmpty: $("preview-empty"),
    panes: $("panes"),
    sourcePane: $("source-pane"),
    previewPane: $("preview-pane"),
    tabs: [...document.querySelectorAll(".pane-tab")],
    saveStatus: $("save-status"),
    formatBar: document.querySelector(".format-bar"),
    statWords: $("stat-words"),
    statChars: $("stat-chars"),
    statLines: $("stat-lines"),
    statMinutes: $("stat-minutes"),
};

const mediaDesktop = window.matchMedia(DESKTOP_QUERY);
let activePane = "source";
let saveTimer = null;
let storageAvailable = true;

const numberFormatter = new Intl.NumberFormat("es-ES");
const timeFormatter = new Intl.DateTimeFormat("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
});

function loadDraft() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return { text: stored === null ? SAMPLE : stored, hasDraft: stored !== null };
    } catch {
        storageAvailable = false;
        return { text: SAMPLE, hasDraft: false };
    }
}

function make(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
}

function renderInline(tokens) {
    const fragment = document.createDocumentFragment();

    tokens.forEach((token) => {
        if (token.type === "text") {
            fragment.append(token.text);
            return;
        }

        if (token.type === "strong" || token.type === "em" || token.type === "delete") {
            const tag = token.type === "strong" ? "strong" : token.type === "em" ? "em" : "del";
            const node = make(tag);
            node.append(renderInline(token.children));
            fragment.append(node);
            return;
        }

        if (token.type === "code") {
            fragment.append(make("code", null, token.text));
            return;
        }

        if (token.type === "link") {
            if (token.href === null) {
                fragment.append(renderInline(token.children));
                return;
            }
            const anchor = make("a");
            anchor.href = token.href;
            if (/^https?:\/\//i.test(token.href)) {
                anchor.target = "_blank";
                anchor.rel = "noopener noreferrer";
            }
            anchor.append(renderInline(token.children));
            fragment.append(anchor);
            return;
        }

        if (token.type === "image") {
            if (token.src === null) {
                fragment.append(token.alt);
                return;
            }
            const image = make("img", "prose__image");
            image.src = token.src;
            image.alt = token.alt;
            image.loading = "lazy";
            image.referrerPolicy = "no-referrer";
            fragment.append(image);
        }
    });

    return fragment;
}

function renderBlock(block) {
    if (block.type === "heading") {
        const heading = make(`h${block.level}`);
        heading.append(renderInline(block.children));
        return heading;
    }

    if (block.type === "paragraph") {
        const paragraph = make("p");
        paragraph.append(renderInline(block.children));
        return paragraph;
    }

    if (block.type === "list") {
        const list = make(block.ordered ? "ol" : "ul");
        block.items.forEach((item) => {
            const row = make("li");
            row.append(renderInline(item));
            list.append(row);
        });
        return list;
    }

    if (block.type === "blockquote") {
        const quote = make("blockquote");
        block.children.forEach((child) => quote.append(renderBlock(child)));
        return quote;
    }

    if (block.type === "code") {
        const pre = make("pre", "code-block");
        if (block.language) pre.dataset.language = block.language;
        pre.append(make("code", null, block.text));
        return pre;
    }

    return make("hr");
}

function updatePreview() {
    const blocks = parseMarkdown(elements.editor.value);
    elements.preview.hidden = blocks.length === 0;
    elements.previewEmpty.hidden = blocks.length > 0;
    elements.preview.replaceChildren(...blocks.map(renderBlock));
}

function updateStats() {
    const stats = documentStats(elements.editor.value);
    elements.statWords.textContent = numberFormatter.format(stats.words);
    elements.statChars.textContent = numberFormatter.format(stats.characters);
    elements.statLines.textContent = numberFormatter.format(stats.lines);
    elements.statMinutes.textContent = `${stats.minutes} min`;
}

function updateLineNumbers() {
    const rows = elements.editor.value.split("\n").length;
    elements.lineNumbers.textContent = Array.from(
        { length: Math.max(1, rows) },
        (_, index) => index + 1
    ).join("\n");
    elements.lineNumbers.scrollTop = elements.editor.scrollTop;
}

function renderAll() {
    updatePreview();
    updateStats();
    updateLineNumbers();
}

function setSaveStatus(message, tone = "") {
    elements.saveStatus.textContent = message;
    elements.saveStatus.classList.toggle("is-saving", tone === "saving");
    elements.saveStatus.classList.toggle("is-error", tone === "error");
}

function saveDraft() {
    if (saveTimer !== null) {
        window.clearTimeout(saveTimer);
        saveTimer = null;
    }

    try {
        localStorage.setItem(STORAGE_KEY, elements.editor.value);
        storageAvailable = true;
        setSaveStatus(`Guardado · ${timeFormatter.format(new Date())}`);
    } catch {
        storageAvailable = false;
        setSaveStatus("Sin almacenamiento local", "error");
    }
}

function scheduleSave() {
    setSaveStatus("Guardando…", "saving");
    if (saveTimer !== null) window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(saveDraft, 450);
}

function applyEdit(result) {
    elements.editor.value = result.text;
    elements.editor.focus();
    elements.editor.setSelectionRange(result.selectionStart, result.selectionEnd);
    renderAll();
    scheduleSave();
}

function format(kind) {
    const text = elements.editor.value;
    const start = elements.editor.selectionStart;
    const end = elements.editor.selectionEnd;

    if (kind === "h1" || kind === "h2" || kind === "list" || kind === "quote") {
        const prefixes = { h1: "# ", h2: "## ", list: "- ", quote: "> " };
        applyEdit(prefixSelection(text, start, end, prefixes[kind]));
        return;
    }

    if (kind === "bold") {
        applyEdit(wrapSelection(text, start, end, "**"));
        return;
    }

    if (kind === "italic") {
        applyEdit(wrapSelection(text, start, end, "*"));
        return;
    }

    if (kind === "code") {
        applyEdit(wrapSelection(text, start, end, "`"));
        return;
    }

    if (kind === "codeblock") {
        applyEdit(wrapSelection(text, start, end, "```\n", "\n```"));
        return;
    }

    if (kind === "link") {
        const label = text.slice(start, end) || "texto del enlace";
        const prefix = `[${label}](`;
        const insertion = `${prefix}https://)`;
        const next = `${text.slice(0, start)}${insertion}${text.slice(end)}`;
        applyEdit({
            text: next,
            selectionStart: start + prefix.length,
            selectionEnd: start + prefix.length + 8,
        });
    }
}

function selectPane(pane) {
    activePane = pane;
    syncPanes();
    if (pane === "preview") updatePreview();
}

function syncPanes() {
    const desktop = mediaDesktop.matches;
    elements.sourcePane.hidden = !desktop && activePane !== "source";
    elements.previewPane.hidden = !desktop && activePane !== "preview";

    elements.tabs.forEach((tab) => {
        const selected = tab.dataset.pane === activePane;
        tab.setAttribute("aria-selected", String(selected));
        tab.tabIndex = selected ? 0 : -1;
    });
}

elements.editor.addEventListener("input", () => {
    renderAll();
    scheduleSave();
});

elements.editor.addEventListener("scroll", () => {
    elements.lineNumbers.scrollTop = elements.editor.scrollTop;
});

elements.formatBar.addEventListener("click", (event) => {
    const button = event.target.closest("[data-format]");
    if (!button) return;
    format(button.dataset.format);
});

elements.formatBar.addEventListener("mousedown", (event) => {
    if (event.target.closest("[data-format]")) event.preventDefault();
});

elements.editor.addEventListener("keydown", (event) => {
    if (!(event.ctrlKey || event.metaKey)) return;

    const key = event.key.toLowerCase();
    const shortcuts = { b: "bold", i: "italic", k: "link" };
    if (shortcuts[key]) {
        event.preventDefault();
        format(shortcuts[key]);
        return;
    }

    if (key === "s") {
        event.preventDefault();
        saveDraft();
    }
});

elements.tabs.forEach((tab) => {
    tab.addEventListener("click", () => selectPane(tab.dataset.pane));
    tab.addEventListener("keydown", (event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        const index = elements.tabs.indexOf(tab);
        const offset = event.key === "ArrowRight" ? 1 : -1;
        const next = elements.tabs[(index + offset + elements.tabs.length) % elements.tabs.length];
        selectPane(next.dataset.pane);
        next.focus();
    });
});

mediaDesktop.addEventListener("change", syncPanes);

window.addEventListener("beforeunload", () => {
    if (saveTimer === null) return;
    try {
        localStorage.setItem(STORAGE_KEY, elements.editor.value);
    } catch {
        // El navegador ya no permite escribir; no hay nada más que hacer aquí.
    }
});

document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
});

const draft = loadDraft();
elements.editor.value = draft.text;
renderAll();
syncPanes();

if (!storageAvailable) setSaveStatus("Sin almacenamiento local", "error");
else setSaveStatus(draft.hasDraft ? "Borrador restaurado" : "Borrador de ejemplo");
