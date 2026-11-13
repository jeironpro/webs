/**
 * Modulo principal del Color Picker
 * Gestiona los canvas de seleccion, sliders RGB, selector de formato y actualizacion de valores
 */
import { hsvToRgb, rgbToHsv, rgbToHsl, rgbToCmyk } from "./colorConverter.js";
import { rgbToHex, hexToRgb, getLuminance } from "../utils/format.js";
import { $, $$ } from "../utils/dom.js";

/* Estado interno del color actual en HSV */
let hue = 0;
let saturation = 100;
let value = 100;

/* Estado del selector de formato */
const formats = ["hex", "rgb", "cmyk", "hsv", "hsl"];
let formatIndex = 0;
let currentFormat = formats[0];
let editingFormat = false;

/* Referencias al DOM */
let svCanvas;
let hueCanvas;
let svCtx;
let hueCtx;
let colorDisplay;
let hexDisplay;
let formatInput;
let formatLabel;
let redSlider;
let greenSlider;
let blueSlider;
let redValueDisplay;
let greenValueDisplay;
let blueValueDisplay;
let rgbValuesDisplay;
let cmykValuesDisplay;
let hsvValuesDisplay;
let hslValuesDisplay;
let tooltip;

/* Flag para evitar bucles infinitos */
let isUpdating = false;

/* Referencias a botones de copia */
let copyButtons;

/**
 * Inicializa el color picker
 */
export function initColorPicker() {
    getDomReferences();
    resizeCanvases();
    drawHueCanvas();
    drawSvCanvas();
    updateFromHsv(hue, saturation, value);
    assignEvents();
    syncBarHeight();
}

/**
 * Obtiene todas las referencias a elementos del DOM
 */
function getDomReferences() {
    svCanvas = $("#svCanvas");
    hueCanvas = $("#hueCanvas");
    svCtx = svCanvas.getContext("2d");
    hueCtx = hueCanvas.getContext("2d");
    colorDisplay = $("#colorDisplay");
    hexDisplay = $("#hexValue");
    formatInput = $("#formatInput");
    formatLabel = $("#formatLabel");
    redSlider = $("#redSlider");
    greenSlider = $("#greenSlider");
    blueSlider = $("#blueSlider");
    redValueDisplay = $("#redValue");
    greenValueDisplay = $("#greenValue");
    blueValueDisplay = $("#blueValue");
    rgbValuesDisplay = $("#rgbValues");
    cmykValuesDisplay = $("#cmykValues");
    hsvValuesDisplay = $("#hsvValues");
    hslValuesDisplay = $("#hslValues");
    tooltip = $("#tooltip");
    copyButtons = $$(".floating-bar__copy-btn");
}

/**
 * Ajusta las dimensiones de los canvas al tamano de su contenedor
 */
function resizeCanvases() {
    const rect = svCanvas.getBoundingClientRect();
    const size = Math.floor(rect.width);

    svCanvas.width = size;
    svCanvas.height = size;

    hueCanvas.width = size;
    hueCanvas.height = 28;
}

/**
 * Dibuja la barra de matiz (hue) en el canvas correspondiente
 */
function drawHueCanvas() {
    const { width, height } = hueCanvas;
    const gradient = hueCtx.createLinearGradient(0, 0, width, 0);

    gradient.addColorStop(0.0, "rgb(255, 0, 0)");
    gradient.addColorStop(0.167, "rgb(255, 255, 0)");
    gradient.addColorStop(0.333, "rgb(0, 255, 0)");
    gradient.addColorStop(0.5, "rgb(0, 255, 255)");
    gradient.addColorStop(0.667, "rgb(0, 0, 255)");
    gradient.addColorStop(0.833, "rgb(255, 0, 255)");
    gradient.addColorStop(1.0, "rgb(255, 0, 0)");

    hueCtx.fillStyle = gradient;
    hueCtx.fillRect(0, 0, width, height);

    const indicatorX = (hue / 360) * width;
    const halfSize = 7;

    hueCtx.beginPath();
    hueCtx.moveTo(indicatorX, 0);
    hueCtx.lineTo(indicatorX - halfSize, height);
    hueCtx.lineTo(indicatorX + halfSize, height);
    hueCtx.closePath();
    hueCtx.fillStyle = "#ffffff";
    hueCtx.fill();
    hueCtx.strokeStyle = "rgba(0, 0, 0, 0.5)";
    hueCtx.lineWidth = 1;
    hueCtx.stroke();
}

/**
 * Dibuja el canvas de saturacion-valor para el matiz actual
 */
function drawSvCanvas() {
    const { width, height } = svCanvas;
    const imageData = svCtx.createImageData(width, height);
    const data = imageData.data;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const sVal = (x / width) * 100;
            const vVal = (1 - y / height) * 100;
            const { r, g, b } = hsvToRgb(hue, sVal, vVal);

            const index = (y * width + x) * 4;
            data[index] = r;
            data[index + 1] = g;
            data[index + 2] = b;
            data[index + 3] = 255;
        }
    }

    svCtx.putImageData(imageData, 0, 0);

    const indX = (saturation / 100) * width;
    const indY = (1 - value / 100) * height;

    svCtx.beginPath();
    svCtx.arc(indX, indY, 7, 0, Math.PI * 2);
    svCtx.strokeStyle = "#ffffff";
    svCtx.lineWidth = 2.5;
    svCtx.stroke();

    svCtx.beginPath();
    svCtx.arc(indX, indY, 5, 0, Math.PI * 2);
    svCtx.strokeStyle = "rgba(0, 0, 0, 0.4)";
    svCtx.lineWidth = 1.5;
    svCtx.stroke();
}

/**
 * Actualiza toda la interfaz a partir de valores HSV
 */
function updateFromHsv(newH, newS, newV) {
    if (isUpdating) return;
    if (!isFinite(newH) || !isFinite(newS) || !isFinite(newV)) return;

    isUpdating = true;

    hue = newH;
    saturation = newS;
    value = newV;

    const { r, g, b } = hsvToRgb(hue, saturation, value);
    drawSvCanvas();
    drawHueCanvas();
    updateWholeInterface(r, g, b);

    isUpdating = false;
}

/**
 * Actualiza toda la interfaz a partir de valores RGB
 */
function updateFromRgb(r, g, b) {
    if (isUpdating) return;
    if (!isFinite(r) || !isFinite(g) || !isFinite(b)) return;
    isUpdating = true;

    const { h: newH, s: newS, v: newV } = rgbToHsv(r, g, b);

    hue = newH;
    saturation = newS;
    value = newV;

    drawSvCanvas();
    drawHueCanvas();

    updateWholeInterface(r, g, b);

    isUpdating = false;
}

/**
 * Obtiene el valor formateado para un espacio de color
 */
function getFormattedValue(format, r, g, b) {
    switch (format) {
        case "hex":
            return rgbToHex(r, g, b);
        case "rgb":
            return `${r}, ${g}, ${b}`;
        case "cmyk": {
            const { c, m, y, k } = rgbToCmyk(r, g, b);
            return `${c}%, ${m}%, ${y}%, ${k}%`;
        }
        case "hsv":
            return `${Math.round(hue)}°, ${Math.round(saturation)}%, ${Math.round(value)}%`;
        case "hsl": {
            const { h, s, l } = rgbToHsl(r, g, b);
            return `${h}°, ${s}%, ${l}%`;
        }
        default:
            return "";
    }
}

function getPlaceholder(format) {
    switch (format) {
        case "hex":
            return "#RRGGBB";
        case "rgb":
            return "R, G, B";
        case "cmyk":
            return "C%, M%, Y%, K%";
        case "hsv":
            return "H°, S%, V%";
        case "hsl":
            return "H°, S%, L%";
        default:
            return "";
    }
}

/**
 * Actualiza todos los elementos visuales con los valores RGB actuales
 */
function updateWholeInterface(r, g, b) {
    colorDisplay.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

    const luminance = getLuminance(r, g, b);
    const textColor = luminance > 0.5 ? "#1a1a1a" : "#ffffff";
    hexDisplay.style.color = textColor;

    const hex = rgbToHex(r, g, b);
    hexDisplay.textContent = hex;

    if (!editingFormat) formatInput.value = getFormattedValue(currentFormat, r, g, b);

    redSlider.value = r;
    greenSlider.value = g;
    blueSlider.value = b;
    redValueDisplay.textContent = r;
    greenValueDisplay.textContent = g;
    blueValueDisplay.textContent = b;

    const { h: hslH, s: hslS, l: hslL } = rgbToHsl(r, g, b);
    const { c, m, y, k } = rgbToCmyk(r, g, b);

    rgbValuesDisplay.textContent = `${r}, ${g}, ${b}`;
    cmykValuesDisplay.textContent = `${c}%, ${m}%, ${y}%, ${k}%`;
    hsvValuesDisplay.textContent = `${Math.round(hue)}°, ${Math.round(saturation)}%, ${Math.round(value)}%`;
    hslValuesDisplay.textContent = `${hslH}°, ${hslS}%, ${hslL}%`;
}

/* Funciones de parseo para cada espacio de color */

function parseRgb(text) {
    const nums = text.split(",").map((s) => parseInt(s.trim(), 10));
    if (nums.length !== 3 || nums.some((n) => isNaN(n) || n < 0 || n > 255)) return null;
    return { r: nums[0], g: nums[1], b: nums[2] };
}

function parseCmyk(text) {
    const nums = text.split(",").map((s) => parseInt(s.trim().replace("%", ""), 10));
    if (nums.length !== 4 || nums.some((n) => isNaN(n) || n < 0 || n > 100)) return null;
    const c = nums[0] / 100,
        m = nums[1] / 100,
        y = nums[2] / 100,
        k = nums[3] / 100;
    return {
        r: Math.round(255 * (1 - c) * (1 - k)),
        g: Math.round(255 * (1 - m) * (1 - k)),
        b: Math.round(255 * (1 - y) * (1 - k)),
    };
}

function parseHsv(text) {
    const nums = text.split(",").map((s) => parseInt(s.trim().replace(/[^\d.-]/g, ""), 10));
    if (nums.length !== 3 || nums.some((n) => isNaN(n))) return null;
    const h = nums[0],
        s = nums[1],
        v = nums[2];
    if (h < 0 || h > 360 || s < 0 || s > 100 || v < 0 || v > 100) return null;
    return hsvToRgb(h, s, v);
}

function parseHsl(text) {
    const nums = text.split(",").map((s) => parseInt(s.trim().replace(/[^\d.-]/g, ""), 10));
    if (nums.length !== 3 || nums.some((n) => isNaN(n))) return null;
    const h = nums[0];
    let s = nums[1];
    let l = nums[2];
    if (h < 0 || h > 360 || s < 0 || s > 100 || l < 0 || l > 100) return null;

    s /= 100;
    l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0,
        g = 0,
        b = 0;

    switch (Math.floor(h / 60) % 6) {
        case 0:
            r = c;
            g = x;
            break;
        case 1:
            r = x;
            g = c;
            break;
        case 2:
            g = c;
            b = x;
            break;
        case 3:
            g = x;
            b = c;
            break;
        case 4:
            r = x;
            b = c;
            break;
        case 5:
            r = c;
            b = x;
            break;
    }

    return {
        r: Math.round((r + m) * 255),
        g: Math.round((g + m) * 255),
        b: Math.round((b + m) * 255),
    };
}

function parseFormat(format, text) {
    switch (format) {
        case "hex":
            return hexToRgb(text);
        case "rgb":
            return parseRgb(text);
        case "cmyk":
            return parseCmyk(text);
        case "hsv":
            return parseHsv(text);
        case "hsl":
            return parseHsl(text);
        default:
            return null;
    }
}

/**
 * Obtiene la posicion del cursor relativa al canvas, escalada correctamente
 */
function getCanvasPosition(canvas, clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return { x: 0, y: 0 };

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
        x: Math.max(0, Math.min((clientX - rect.left) * scaleX, canvas.width)),
        y: Math.max(0, Math.min((clientY - rect.top) * scaleY, canvas.height)),
    };
}

/**
 * Maneja la interaccion en el canvas de saturacion-valor
 */
function handleSvInteraction(event) {
    const clientX = event.clientX || event.touches?.[0]?.clientX;
    const clientY = event.clientY || event.touches?.[0]?.clientY;

    if (clientX === undefined) return;

    const { x, y } = getCanvasPosition(svCanvas, clientX, clientY);
    if (svCanvas.width === 0 || svCanvas.height === 0) return;

    const newS = (x / svCanvas.width) * 100;
    const newV = (1 - y / svCanvas.height) * 100;

    updateFromHsv(hue, newS, newV);
}

/**
 * Maneja la interaccion en el canvas de matiz
 */
function handleHueInteraction(event) {
    const clientX = event.clientX || event.touches?.[0]?.clientX;
    const clientY = event.clientY || event.touches?.[0]?.clientY;

    if (clientX === undefined) return;

    const { x } = getCanvasPosition(hueCanvas, clientX, clientY);
    if (hueCanvas.width === 0) return;

    const newH = (x / hueCanvas.width) * 360;

    if (Math.round(newH) !== Math.round(hue)) {
        hue = newH;
        drawSvCanvas();
        drawHueCanvas();
        updateFromHsv(hue, saturation, value);
    }
}

/* Manejadores de eventos de los canvas */

function onSVMouseDown(event) {
    handleSvInteraction(event);
    document.addEventListener("mousemove", onSVMouseMove);
    document.addEventListener("mouseup", onSVMouseUp);
}

function onSVMouseMove(event) {
    handleSvInteraction(event);
}

function onSVMouseUp() {
    document.removeEventListener("mousemove", onSVMouseMove);
    document.removeEventListener("mouseup", onSVMouseUp);
}

function onSVTouchStart(event) {
    event.preventDefault();
    handleSvInteraction(event);
    svCanvas.addEventListener("touchmove", onSVTouchMove, { passive: false });
    svCanvas.addEventListener("touchend", onSVTouchUp);
    svCanvas.addEventListener("touchcancel", onSVTouchUp);
}

function onSVTouchMove(event) {
    event.preventDefault();
    handleSvInteraction(event);
}

function onSVTouchUp() {
    svCanvas.removeEventListener("touchmove", onSVTouchMove);
    svCanvas.removeEventListener("touchend", onSVTouchUp);
    svCanvas.removeEventListener("touchcancel", onSVTouchUp);
}

function onHueMouseDown(event) {
    handleHueInteraction(event);
    document.addEventListener("mousemove", onHueMouseMove);
    document.addEventListener("mouseup", onHueMouseUp);
}

function onHueMouseMove(event) {
    handleHueInteraction(event);
}

function onHueMouseUp() {
    document.removeEventListener("mousemove", onHueMouseMove);
    document.removeEventListener("mouseup", onHueMouseUp);
}

function onHueTouchStart(event) {
    event.preventDefault();
    handleHueInteraction(event);
    hueCanvas.addEventListener("touchmove", onHueTouchMove, { passive: false });
    hueCanvas.addEventListener("touchend", onHueTouchUp);
    hueCanvas.addEventListener("touchcancel", onHueTouchUp);
}

function onHueTouchMove(event) {
    event.preventDefault();
    handleHueInteraction(event);
}

function onHueTouchUp() {
    hueCanvas.removeEventListener("touchmove", onHueTouchMove);
    hueCanvas.removeEventListener("touchend", onHueTouchUp);
    hueCanvas.removeEventListener("touchcancel", onHueTouchUp);
}

/**
 * Maneja el cambio en los sliders RGB
 */
function onSliderChange() {
    const r = parseInt(redSlider.value, 10);
    const g = parseInt(greenSlider.value, 10);
    const b = parseInt(blueSlider.value, 10);

    updateFromRgb(r, g, b);
}

/**
 * Cicla al siguiente formato de color
 */
function cycleFormat() {
    formatIndex = (formatIndex + 1) % formats.length;
    currentFormat = formats[formatIndex];
    formatLabel.textContent = currentFormat.toUpperCase();

    const { r, g, b } = hsvToRgb(hue, saturation, value);
    formatInput.value = getFormattedValue(currentFormat, r, g, b);
    formatInput.placeholder = getPlaceholder(currentFormat);
}

/**
 * Procesa la edicion del input de formato unificado
 */
function onFormatInput() {
    editingFormat = false;
    const text = formatInput.value.trim();
    if (!text) return;

    const rgb = parseFormat(currentFormat, text);

    if (rgb) {
        updateFromRgb(rgb.r, rgb.g, rgb.b);
    } else {
        const r = parseInt(redSlider.value, 10);
        const g = parseInt(greenSlider.value, 10);
        const b = parseInt(blueSlider.value, 10);
        formatInput.value = getFormattedValue(currentFormat, r, g, b);
    }
}

/**
 * Muestra un tooltip temporal con un mensaje
 */
function showTooltip(message, isError = false) {
    tooltip.textContent = message;
    tooltip.classList.toggle("tooltip--error", isError);
    tooltip.classList.add("tooltip--visible");

    setTimeout(() => {
        tooltip.classList.remove("tooltip--visible");
    }, 1500);
}

/**
 * Respaldo del portapapeles para navegadores sin permisos: selecciona el texto
 * en un textarea oculto y lanza el copiado clásico.
 *
 * En iOS Safari hay que marcar el rango de seleccion a mano: select() no basta
 * y el campo no puede quedar en solo lectura.
 */
function copyWithTextarea(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.top = "0";
    textarea.style.left = "0";
    textarea.style.width = "1px";
    textarea.style.height = "1px";
    textarea.style.padding = "0";
    textarea.style.border = "none";
    textarea.style.outline = "none";
    textarea.style.boxShadow = "none";
    textarea.style.background = "transparent";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);

    textarea.contentEditable = "true";
    textarea.readOnly = false;

    const range = document.createRange();
    range.selectNodeContents(textarea);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    textarea.setSelectionRange(0, text.length);

    let copied = false;
    try {
        copied = document.execCommand("copy");
    } catch (error) {
        console.error("El portapapeles clásico tampoco está disponible", error);
    }

    document.body.removeChild(textarea);
    return copied;
}

/**
 * Copia un texto al portapapeles, con respaldo clásico si la API falla.
 */
async function copyText(text) {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            console.error("No se pudo copiar con la API del portapapeles", error);
        }
    }
    return copyWithTextarea(text);
}

/**
 * Copia un texto al portapapeles y avisa del resultado real de la operacion
 */
async function copyAndNotify(text) {
    const copied = await copyText(text);

    if (copied) {
        showTooltip("Copiado: " + text);
    } else {
        showTooltip("No se pudo copiar. Selecciona el valor y copialo a mano.", true);
    }
}

/**
 * Copia el valor de un espacio de color de la barra flotante al portapapeles
 */
async function copyValue(type) {
    const el = document.getElementById(type + "Values");
    const text = el.textContent;

    await copyAndNotify(text);
}

/**
 * Copia el valor hexadecimal al portapapeles
 */
async function copyHexToClipboard() {
    const hex = hexDisplay.textContent;

    await copyAndNotify(hex);
}

/**
 * Asigna todos los eventos a los elementos del DOM
 */
function assignEvents() {
    /* Eventos del canvas SV */
    svCanvas.addEventListener("mousedown", onSVMouseDown);
    svCanvas.addEventListener("touchstart", onSVTouchStart, { passive: false });

    /* Eventos del canvas de matiz */
    hueCanvas.addEventListener("mousedown", onHueMouseDown);
    hueCanvas.addEventListener("touchstart", onHueTouchStart, { passive: false });

    /* Eventos de los sliders RGB */
    redSlider.addEventListener("input", onSliderChange);
    greenSlider.addEventListener("input", onSliderChange);
    blueSlider.addEventListener("input", onSliderChange);

    /* Click en el label de formato para ciclar */
    formatLabel.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        cycleFormat();
    });
    formatLabel.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            cycleFormat();
        }
    });

    /* Eventos del input de formato unificado */
    formatInput.addEventListener("focus", () => {
        editingFormat = true;
    });
    formatInput.addEventListener("blur", onFormatInput);
    formatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") formatInput.blur();
    });

    /* Click en el panel izquierdo para copiar HEX */
    colorDisplay.addEventListener("click", copyHexToClipboard);

    /* Click en los botones de copia de la barra flotante */
    copyButtons.forEach((btn) => {
        btn.addEventListener("click", () => copyValue(btn.dataset.type));
    });

    /* Reajuste de canvas al redimensionar la ventana o cambiar orientacion */
    function resizeCanvas() {
        resizeCanvases();
        drawHueCanvas();
        drawSvCanvas();
        syncBarHeight();
    }

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("orientationchange", () => {
        setTimeout(resizeCanvas, 200);
    });
}

/**
 * Publica la altura real de la barra flotante para que el tooltip y el relleno
 * del panel se ajusten cuando la barra se envuelve en varias filas (movil).
 * Se usa una variable aparte del alto de diseño para no crear un ciclo: el
 * alto de la barra en escritorio se define con --floating-bar-height.
 */
function syncBarHeight() {
    const bar = document.querySelector(".floating-bar");
    if (!bar) return;

    const height = Math.round(bar.getBoundingClientRect().height);
    document.documentElement.style.setProperty("--floating-bar-offset", `${height}px`);
}
