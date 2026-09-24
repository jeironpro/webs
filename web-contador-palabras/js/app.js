/**
 * Punto de entrada del contador de palabras: conecta la lógica con el DOM.
 * @module app
 */

import { qs } from "./utils/dom.js";
import { getCounts } from "./modules/counter.js";
import { readTextFile } from "./modules/uploader.js";

const elements = {
  textarea: qs("#texto"),
  palabras: qs("#valor-palabras"),
  caracteres: qs("#valor-caracteres"),
  sinEspacios: qs("#valor-sin-espacios"),
  limpiar: qs("#limpiar"),
  copiar: qs("#copiar"),
  ejemplo: qs("#ejemplo"),
  dropzone: qs("#dropzone"),
  archivo: qs("#archivo"),
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
  const { palabras, caracteres, sinEspacios } = getCounts(text);
  elements.palabras.textContent = String(palabras);
  elements.caracteres.textContent = String(caracteres);
  elements.sinEspacios.textContent = String(sinEspacios);
}

/**
 * Habilita o deshabilita los controles según haya contenido o no.
 * @param {boolean} hasText Hay texto en el área de escritura.
 */
function updateControls(hasText) {
  elements.limpiar.disabled = !hasText;
  elements.copiar.disabled = !hasText;
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
function establecerTexto(text) {
  elements.textarea.value = text;
  sync();
  elements.textarea.focus();
}

/**
 * Vacía el área de texto y restablece la interfaz.
 */
function limpiar() {
  establecerTexto("");
}

/**
 * Copia un resumen con las tres métricas al portapapeles.
 */
async function copiar() {
  const { palabras, caracteres, sinEspacios } = getCounts(
    elements.textarea.value
  );
  const resumen = [
    `Palabras: ${palabras}`,
    `Caracteres: ${caracteres}`,
    `Caracteres sin espacios: ${sinEspacios}`,
  ].join("\n");

  try {
    await navigator.clipboard.writeText(resumen);
  } catch {
    /* Portapapeles no disponible: la acción se ignora. */
  }
}

/**
 * Carga el texto de ejemplo y actualiza la interfaz.
 */
function cargarEjemplo() {
  establecerTexto(SAMPLE_TEXT);
}

/**
 * Muestra u oculta el estado visual de arrastre sobre la zona de subida.
 * @param {boolean} activo El usuario está arrastrando sobre la zona.
 */
function setDragover(activo) {
  elements.dropzone.classList.toggle("is-dragover", activo);
}

/**
 * Abre el selector de archivos del sistema al hacer clic en la zona.
 */
function abrirSelector() {
  elements.archivo.click();
}

/**
 * Carga un archivo en el área de texto y actualiza la interfaz.
 * @param {File} file Archivo de texto plano a cargar.
 */
async function cargarArchivo(file) {
  try {
    const text = await readTextFile(file);
    establecerTexto(text);
  } catch {
    /* Archivo ilegible: se ignora y no se cambia el texto. */
  }
}

elements.textarea.addEventListener("input", sync);
elements.limpiar.addEventListener("click", limpiar);
elements.copiar.addEventListener("click", copiar);
elements.ejemplo.addEventListener("click", cargarEjemplo);

elements.dropzone.addEventListener("click", abrirSelector);
elements.dropzone.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    abrirSelector();
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
  cargarArchivo(file);
});
elements.archivo.addEventListener("change", () => {
  cargarArchivo(elements.archivo.files[0]);
  elements.archivo.value = "";
});

sync();