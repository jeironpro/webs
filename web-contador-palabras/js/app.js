/**
 * Punto de entrada del contador de palabras: conecta la lógica con el DOM.
 * @module app
 */

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

/** Texto de muestra para probar la aplicación. */
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

/**
 * Actualiza las tres métricas con el conteo del texto dado.
 * @param {string} text Texto del que se muestran las métricas.
 */
function renderStats(text) {
    const { words, characters, charactersNoSpaces } = getCounts(text);
    elements.words.textContent = String(words);
    elements.characters.textContent = String(characters);
    elements.charactersNoSpaces.textContent = String(charactersNoSpaces);
}

/**
 * Habilita o deshabilita los controles según haya contenido o no.
 * @param {boolean} hasText Hay texto en el área de escritura.
 */
function updateControls(hasText) {
    elements.clear.disabled = !hasText;
    elements.copy.disabled = !hasText;
}

/**
 * Actualiza la interfaz completa a partir del texto actual.
 */
function sync() {
    const text = elements.textarea.value;
    renderStats(text);
    updateControls(text !== "");
}

/**
 * Fija el texto del área de escritura, actualiza la interfaz y devuelve el foco.
 * @param {string} text Nuevo contenido del área.
 */
function setText(text) {
    elements.textarea.value = text;
    sync();
    elements.textarea.focus();
}

/**
 * Vacía el área de texto y restablece la interfaz.
 */
function clear() {
    setText("");
}

/**
 * Copia un resumen con las tres métricas al portapapeles.
 */
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
        /* Portapapeles no disponible: la acción se ignora. */
    }
}

/**
 * Carga el texto de ejemplo y actualiza la interfaz.
 */
function loadExample() {
    setText(SAMPLE_TEXT);
}

/**
 * Muestra u oculta el estado visual de arrastre sobre la zona de subida.
 * @param {boolean} activo El usuario está arrastrando sobre la zona.
 */
function setDragover(active) {
    elements.dropzone.classList.toggle("is-dragover", active);
}

/**
 * Abre el selector de archivos del sistema al hacer clic en la zona.
 */
function openFilePicker() {
    elements.file.click();
}

/**
 * Carga un archivo en el área de texto y actualiza la interfaz.
 * @param {File} file Archivo de texto plano a cargar.
 */
async function loadFile(file) {
    try {
        const text = await readTextFile(file);
        setText(text);
    } catch {
        /* Archivo ilegible: se ignora y no se cambia el texto. */
    }
}

elements.textarea.addEventListener("input", sync);
elements.clear.addEventListener("click", clear);
elements.copy.addEventListener("click", copy);
elements.example.addEventListener("click", loadExample);

elements.dropzone.addEventListener("click", openFilePicker);
elements.dropzone.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openFilePicker();
    }
});
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
    loadFile(elements.file.files[0]);
    elements.file.value = "";
});

sync();
