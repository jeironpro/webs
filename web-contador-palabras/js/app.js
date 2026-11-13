import { qs } from "./utils/dom.js";
import { getCounts } from "./modules/counter.js";
import { readTextFile } from "./modules/uploader.js";

const elements = {
    textarea: qs("#text"),
    words: qs("#word-count"),
    characters: qs("#character-count"),
    charactersNoSpaces: qs("#character-count-no-spaces"),
    clear: qs("#clear"),
    copy: qs("#copy"),
    example: qs("#example"),
    dropzone: qs("#dropzone"),
    file: qs("#file"),
};

const SAMPLE_TEXT = [
    "El contador de palabras es una herramienta sencilla y local.",
    "",
    "Todo lo que escribes aquí se procesa en tu navegador:",
    "nada se envía a ningún servidor. Puedes pegar un texto,",
    "escribir uno nuevo o subir un archivo de texto plano.",
    "",
    "Las tres métricas se actualizan mientras escribes:",
    "palabras, caracteres y caracteres sin espacios.",
].join("\n");

function renderStats(text) {
    const { words, characters, charactersNoSpaces } = getCounts(text);
    elements.words.textContent = String(words);
    elements.characters.textContent = String(characters);
    elements.charactersNoSpaces.textContent = String(charactersNoSpaces);
}

function updateControls(hasText) {
    elements.clear.disabled = !hasText;
    elements.copy.disabled = !hasText;
}

function sync() {
    const text = elements.textarea.value;
    renderStats(text);
    updateControls(text !== "");
}

function setText(text) {
    elements.textarea.value = text;
    sync();
    elements.textarea.focus();
}

function clear() {
    setText("");
}

async function copy() {
    const { words, characters, charactersNoSpaces } = getCounts(elements.textarea.value);
    const summary = [
        `Palabras: ${words}`,
        `Caracteres: ${characters}`,
        `Caracteres sin espacios: ${charactersNoSpaces}`,
    ].join("\n");

    try {
        await navigator.clipboard.writeText(summary);
    } catch {
        return;
    }
}

function loadExample() {
    setText(SAMPLE_TEXT);
}

function setDragover(active) {
    elements.dropzone.classList.toggle("is-dragover", active);
}

async function loadFile(file) {
    try {
        const text = await readTextFile(file);
        setText(text);
    } catch {
        return;
    }
}

elements.textarea.addEventListener("input", sync);
elements.clear.addEventListener("click", clear);
elements.copy.addEventListener("click", copy);
elements.example.addEventListener("click", loadExample);

elements.dropzone.addEventListener("dragenter", (event) => {
    event.preventDefault();
    setDragover(true);
});
elements.dropzone.addEventListener("dragover", (event) => {
    event.preventDefault();
    setDragover(true);
});
elements.dropzone.addEventListener("dragleave", (event) => {
    if (elements.dropzone.contains(event.relatedTarget)) return;
    setDragover(false);
});
elements.dropzone.addEventListener("drop", (event) => {
    event.preventDefault();
    setDragover(false);
    const file = event.dataTransfer.files[0];
    if (!file) return;
    loadFile(file);
});
elements.file.addEventListener("change", () => {
    const file = elements.file.files[0];
    if (!file) return;
    loadFile(file);
    elements.file.value = "";
});

sync();
