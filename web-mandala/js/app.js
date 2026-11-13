import { SAND_COLOR, createSvg } from "./mandala.js";
import { TEMPLATES, getById } from "./templates.js";

const PNG_SIZE = 2048;

const INITIAL_MESSAGE = "Elige un color y haz clic sobre una región para colorearla.";
const PRINT_MESSAGE = "Usa el diálogo de impresión de tu navegador para imprimir.";
const CLEAN_MANDALA_MESSAGE = "Mandala limpio.";
const UNDO_CHANGE_MESSAGE = "Cambio deshecho.";
const REDO_CHANGE_MESSAGE = "Cambio rehecho.";
const PNG_DOWNLOADED_MESSAGE = "PNG descargado.";
const SVG_DOWNLOADED_MESSAGE = "SVG descargado.";
const PNG_ERROR_MESSAGE = "No se pudo descargar el PNG. Inténtalo de nuevo.";
const SVG_ERROR_MESSAGE = "No se pudo descargar el SVG. Inténtalo de nuevo.";

const COLOR_SWATCHES = [
    { name: "Rojo", slug: "rojo", token: "--color-paleta-rojo" },
    { name: "Naranja", slug: "naranja", token: "--color-paleta-naranja" },
    { name: "Amarillo", slug: "amarillo", token: "--color-paleta-amarillo" },
    { name: "Verde", slug: "verde", token: "--color-paleta-verde" },
    { name: "Turquesa", slug: "turquesa", token: "--color-paleta-turquesa" },
    { name: "Azul", slug: "azul", token: "--color-paleta-azul" },
    { name: "Violeta", slug: "violeta", token: "--color-paleta-violeta" },
    { name: "Rosa", slug: "rosa", token: "--color-paleta-rosa" },
    { name: "Marrón", slug: "marron", token: "--color-paleta-marron" },
    { name: "Gris", slug: "gris", token: "--color-paleta-gris" },
];

let COLORS = [];
let currentSvg = null;
let currentTemplate = null;
let activeColor = null;
let lastSelectedColor = null;
let draftActive = false;
let history = [];
let redoStack = [];

let templateSelector = null;
let paletteContainer = null;
let colorInput = null;
let mandalaContainer = null;
let statusElement = null;
let canvasCaption = null;
let draftButton = null;
let undoButton = null;
let redoButton = null;
let clearButton = null;
let printButton = null;
let downloadPngButton = null;
let downloadSvgButton = null;

function getToken(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function loadColors() {
    return COLOR_SWATCHES.map((color) => ({
        ...color,
        value: getToken(color.token),
    }));
}

function toHexColor(value) {
    const channels = value.match(/\d+/g);
    if (!channels || channels.length < 3) {
        return value;
    }
    return `#${channels
        .slice(0, 3)
        .map((channel) => Number(channel).toString(16).padStart(2, "0"))
        .join("")}`;
}

function showStatus(message) {
    statusElement.textContent = message;
}

function updateHistoryButtons() {
    undoButton.disabled = history.length === 0;
    redoButton.disabled = redoStack.length === 0;
}

function applyColor(region, color) {
    const previousColor = region.getAttribute("fill");
    if (previousColor === color) {
        return;
    }
    region.setAttribute("fill", color);
    history.push({ region, previous: previousColor, next: color });
    redoStack = [];
    updateHistoryButtons();
}

function undo() {
    const action = history.pop();
    if (!action) {
        return;
    }
    action.region.setAttribute("fill", action.previous);
    redoStack.push(action);
    updateHistoryButtons();
    showStatus(UNDO_CHANGE_MESSAGE);
}

function redo() {
    const action = redoStack.pop();
    if (!action) {
        return;
    }
    action.region.setAttribute("fill", action.next);
    history.push(action);
    updateHistoryButtons();
    showStatus(REDO_CHANGE_MESSAGE);
}

function clearMandala() {
    const regions = currentSvg.querySelectorAll("[fill]");
    regions.forEach((region) => region.setAttribute("fill", SAND_COLOR));
    history = [];
    redoStack = [];
    updateHistoryButtons();
    showStatus(CLEAN_MANDALA_MESSAGE);
}

function selectColor(color) {
    if (color === null) {
        draftActive = true;
        activeColor = SAND_COLOR;
        draftButton.classList.add("tool--active");
        draftButton.setAttribute("aria-pressed", "true");
        return;
    }
    draftActive = false;
    activeColor = color;
    lastSelectedColor = color;
    draftButton.classList.remove("tool--active");
    draftButton.setAttribute("aria-pressed", "false");
    colorInput.value = toHexColor(color);
}

function toggleDraft() {
    if (draftActive) {
        selectColor(lastSelectedColor);
    } else {
        selectColor(null);
    }
}

function highlightPaletteColor(activeButton) {
    paletteContainer
        .querySelectorAll(".palette__color--active")
        .forEach((swatch) => swatch.classList.remove("palette__color--active"));
    if (activeButton) {
        activeButton.classList.add("palette__color--active");
    }
}

function renderMandala() {
    mandalaContainer.replaceChildren();
    currentSvg = createSvg(currentTemplate);
    mandalaContainer.appendChild(currentSvg);

    currentSvg.addEventListener("click", (event) => {
        const region = event.target.closest("path, circle");
        if (!region) {
            return;
        }
        applyColor(region, activeColor);
    });

    history = [];
    redoStack = [];
    updateHistoryButtons();
    canvasCaption.textContent = `${currentTemplate.name} · simetría ${currentTemplate.symmetry}`;
    showStatus(INITIAL_MESSAGE);
}

function changeTemplate(id) {
    currentTemplate = getById(id);
    renderMandala();
}

function serializeSvg() {
    return new XMLSerializer().serializeToString(currentSvg);
}

function downloadFromUrl(url, name, esObjectUrl) {
    const link = document.createElement("a");
    link.download = name;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    link.remove();
    if (esObjectUrl) {
        URL.revokeObjectURL(url);
    }
}

function loadImage(url) {
    return new Promise((resolver, rechazar) => {
        const image = new Image();
        image.onload = () => resolver(image);
        image.onerror = () => rechazar(new Error("No se pudo cargar la imagen del mandala."));
        image.src = url;
    });
}

async function downloadPng() {
    try {
        const blob = new Blob([serializeSvg()], {
            type: "image/svg+xml;charset=utf-8",
        });
        const url = URL.createObjectURL(blob);
        const image = await loadImage(url);
        URL.revokeObjectURL(url);

        const canvas = document.createElement("canvas");
        canvas.width = PNG_SIZE;
        canvas.height = PNG_SIZE;
        const context = canvas.getContext("2d");
        context.fillStyle = getToken("--color-imprimir");
        context.fillRect(0, 0, PNG_SIZE, PNG_SIZE);
        context.drawImage(image, 0, 0, PNG_SIZE, PNG_SIZE);

        downloadFromUrl(canvas.toDataURL("image/png"), `mandala-${currentTemplate.id}.png`, false);
        showStatus(PNG_DOWNLOADED_MESSAGE);
    } catch {
        showStatus(PNG_ERROR_MESSAGE);
    }
}

function downloadSvg() {
    try {
        const blob = new Blob([serializeSvg()], {
            type: "image/svg+xml;charset=utf-8",
        });
        const url = URL.createObjectURL(blob);
        downloadFromUrl(url, `mandala-${currentTemplate.id}.svg`, true);
        showStatus(SVG_DOWNLOADED_MESSAGE);
    } catch {
        showStatus(SVG_ERROR_MESSAGE);
    }
}

function imprimir() {
    showStatus(PRINT_MESSAGE);
    window.print();
}

function populateTemplateSelector() {
    TEMPLATES.forEach((template) => {
        const option = document.createElement("option");
        option.value = template.id;
        option.textContent = template.name;
        templateSelector.appendChild(option);
    });
}

function poblarPaleta() {
    COLORS.forEach((color) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = `palette__color palette__color--${color.slug}`;
        button.setAttribute("aria-label", `Usar color ${color.name}`);
        button.title = color.name;
        button.addEventListener("click", () => {
            selectColor(color.value);
            highlightPaletteColor(button);
        });
        paletteContainer.appendChild(button);
    });
}

function registrarEventos() {
    templateSelector.addEventListener("change", (event) => {
        changeTemplate(event.target.value);
    });

    colorInput.addEventListener("input", (event) => {
        selectColor(event.target.value);
        highlightPaletteColor(null);
    });

    draftButton.addEventListener("click", toggleDraft);
    undoButton.addEventListener("click", undo);
    redoButton.addEventListener("click", redo);
    clearButton.addEventListener("click", clearMandala);
    printButton.addEventListener("click", imprimir);
    downloadPngButton.addEventListener("click", downloadPng);
    downloadSvgButton.addEventListener("click", downloadSvg);

    document.addEventListener("keydown", (event) => {
        const hasModifier = event.ctrlKey || event.metaKey;
        if (!hasModifier || event.repeat) {
            return;
        }
        const key = event.key.toLowerCase();
        if (key === "z" && event.shiftKey) {
            event.preventDefault();
            redo();
        } else if (key === "z") {
            event.preventDefault();
            undo();
        }
    });
}

function iniciar() {
    templateSelector = document.getElementById("template-select");
    paletteContainer = document.getElementById("palette");
    colorInput = document.getElementById("color-input");
    mandalaContainer = document.getElementById("mandala-container");
    statusElement = document.getElementById("status");
    canvasCaption = document.getElementById("canvas-caption");
    draftButton = document.getElementById("draft-btn");
    undoButton = document.getElementById("undo-btn");
    redoButton = document.getElementById("redo-btn");
    clearButton = document.getElementById("clear-btn");
    printButton = document.getElementById("print-btn");
    downloadPngButton = document.getElementById("download-btn");
    downloadSvgButton = document.getElementById("download-svg-btn");

    COLORS = loadColors();
    populateTemplateSelector();
    poblarPaleta();
    registrarEventos();
    selectColor(COLORS[0].value);
    highlightPaletteColor(paletteContainer.querySelector(".palette__color"));
    changeTemplate(TEMPLATES[0].id);
}

iniciar();
