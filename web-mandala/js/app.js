/**
 * Lógica de interacción del coloreador de mandalas.
 *
 * Se encarga de:
 *  - Poblar y gestionar el selector de plantillas y la paleta de colores.
 *  - Renderizar el mandala de la plantilla activa y colorear sus regiones.
 *  - Mantener el historial de cambios para deshacer/rehacer.
 *  - Alternar el modo borrador y limpiar el lienzo.
 *  - Exportar el mandala a PNG y SVG, y lanzar el diálogo de impresión.
 *
 * Expone el namespace global AppMandala con su punto de entrada iniciar().
 * La aplicación se autoinicializa cuando el DOM está listo.
 */
(function (global) {
    "use strict";

    /* ------------------------------------------------------------------------
     * Constantes de configuración
     * ---------------------------------------------------------------------- */

    // Resolución del PNG exportado (cuadrado, misma proporción que el lienzo SVG).
    const PNG_SIZE = 2048;

    // Fondo blanco con el que se rellena el canvas antes de dibujar el mandala.
    const PNG_BACKGROUND_COLOR = "#ffffff";

    // Mensajes de estado mostrados en la barra accesible (role="status").
    const INITIAL_MESSAGE = "Elige un color y haz clic sobre una región para colorearla.";
    const PRINT_MESSAGE = "Usa el diálogo de impresión de tu navegador para imprimir.";
    const CLEAN_MANDALA_MESSAGE = "Mandala limpio.";
    const UNDO_CHANGE_MESSAGE = "Cambio deshecho.";
    const REDO_CHANGE_MESSAGE = "Cambio rehecho.";
    const PNG_DOWNLOADED_MESSAGE = "PNG descargado.";
    const SVG_DOWNLOADED_MESSAGE = "SVG descargado.";
    const PNG_ERROR_MESSAGE = "No se pudo descargar el PNG. Inténtalo de nuevo.";
    const SVG_ERROR_MESSAGE = "No se pudo descargar el SVG. Inténtalo de nuevo.";

    // Paleta de colores predefinida; cada entrada tiene un nombre legible
    // para construir etiquetas accesibles (aria-label y title).
    const COLORS = [
        { name: "Rojo", value: "#e6454f" },
        { name: "Naranja", value: "#f28c28" },
        { name: "Amarillo", value: "#f4c20d" },
        { name: "Verde", value: "#5cb85c" },
        { name: "Turquesa", value: "#3cb3a7" },
        { name: "Azul", value: "#4a90d9" },
        { name: "Violeta", value: "#7b5cb8" },
        { name: "Rosa", value: "#e6789a" },
        { name: "Marrón", value: "#a66b4f" },
        { name: "Gris", value: "#8c8c8c" },
    ];

    /* ------------------------------------------------------------------------
     * Estado de la aplicación
     * ---------------------------------------------------------------------- */

    let currentSvg = null; // SVG del mandala que se está mostrando.
    let currentTemplate = null; // Plantilla seleccionada en el selector.
    let activeColor = COLORS[0].value; // Color con el que se rellena al hacer clic.
    let lastSelectedColor = COLORS[0].value; // Último color real (no borrador).
    let draftActive = false; // Indica si el modo borrador está activo.
    let history = []; // Pila de acciones ejecutadas (para deshacer).
    let redoStack = []; // Pila de acciones deshechas (para rehacer).

    // Referencias a los elementos del DOM, resueltas en iniciar().
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

    /* ------------------------------------------------------------------------
     * Mensajes de estado accesibles
     * ---------------------------------------------------------------------- */

    /** Muestra un mensaje en la barra de estado (leído por lectores de pantalla). */
    function showStatus(message) {
        statusElement.textContent = message;
    }

    /** Sincroniza el estado habilitado de los botones de deshacer/rehacer. */
    function updateHistoryButtons() {
        undoButton.disabled = history.length === 0;
        redoButton.disabled = redoStack.length === 0;
    }

    /* ------------------------------------------------------------------------
     * Historial de acciones (deshacer/rehacer/limpiar)
     * ---------------------------------------------------------------------- */

    /**
     * Aplica un color a una región y registra la acción en el historial.
     * Si la región ya tiene ese color, no hace nada (evita ruido en el historial).
     */
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

    /** Deshace la última acción registrada y la mueve a la pila de rehacer. */
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

    /** Rehace la última acción deshecha y la devuelve al historial. */
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

    /**
     * Restaura todas las regiones al color de lienzo en blanco y vacía el
     * historial, de modo que el mandala vuelve a su estado original.
     */
    function clearMandala() {
        const regions = currentSvg.querySelectorAll("[fill]");
        regions.forEach((region) => region.setAttribute("fill", Mandala.SAND_COLOR));
        history = [];
        redoStack = [];
        updateHistoryButtons();
        showStatus(CLEAN_MANDALA_MESSAGE);
    }

    /* ------------------------------------------------------------------------
     * Selección de color y modo borrador
     * ---------------------------------------------------------------------- */

    /**
     * Configura el color de relleno activo.
     * Si el color es null, se activa el modo borrador (rellena en blanco);
     * en caso contrario se desactiva el borrador y se guarda el color elegido.
     */
    function selectColor(color) {
        if (color == null) {
            draftActive = true;
            activeColor = Mandala.SAND_COLOR;
            draftButton.classList.add("tool--active");
            draftButton.setAttribute("aria-pressed", "true");
            return;
        }
        draftActive = false;
        activeColor = color;
        lastSelectedColor = color;
        draftButton.classList.remove("tool--active");
        draftButton.setAttribute("aria-pressed", "false");
        colorInput.value = color;
    }

    /** Alterna el modo borrador entre activado y desactivado. */
    function toggleDraft() {
        if (draftActive) {
            selectColor(lastSelectedColor);
        } else {
            selectColor(null);
        }
    }

    /** Marca el color activo de la paleta, resaltando solo la ficha indicada. */
    function highlightPaletteColor(activeButton) {
        paletteContainer
            .querySelectorAll(".palette__color--active")
            .forEach((swatch) => swatch.classList.remove("palette__color--active"));
        if (activeButton) {
            activeButton.classList.add("palette__color--active");
        }
    }

    /* ------------------------------------------------------------------------
     * Renderizado del mandala
     * ---------------------------------------------------------------------- */

    /**
     * Renderiza el mandala de la plantilla activa en el contenedor y enlaza el
     * evento de clic que rellena las regiones con el color activo.
     */
    function renderMandala() {
        mandalaContainer.replaceChildren();
        currentSvg = Mandala.createSvg(currentTemplate);
        mandalaContainer.appendChild(currentSvg);

        // Las regiones coloreables son los <path> y <circle> del SVG.
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

    /** Cambia a la plantilla indicada por su id y la renderiza. */
    function changeTemplate(id) {
        currentTemplate = MandalaTemplates.get(id);
        renderMandala();
    }

    /* ------------------------------------------------------------------------
     * Exportación (PNG / SVG) e impresión
     * ---------------------------------------------------------------------- */

    /** Serializa el SVG actual a una cadena de texto con su XML. */
    function serializeSvg() {
        return new XMLSerializer().serializeToString(currentSvg);
    }

    /**
     * Descarga el contenido de una URL (blob o data URL) con el nombre indicado.
     * Si la URL es un object URL, se libera tras disparar la descarga.
     */
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

    /** Carga un SVG serializado como imagen para poder dibujarlo en un canvas. */
    function loadImage(url) {
        return new Promise((resolver, rechazar) => {
            const image = new Image();
            image.onload = () => resolver(image);
            image.onerror = () => rechazar(new Error("No se pudo cargar la imagen del mandala."));
            image.src = url;
        });
    }

    /**
     * Exporta el mandala actual como PNG (2048×2048 px) y lo descarga.
     * El flujo pasa por: SVG → blob → imagen → canvas → data URL.
     */
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
            context.fillStyle = PNG_BACKGROUND_COLOR;
            context.fillRect(0, 0, PNG_SIZE, PNG_SIZE);
            context.drawImage(image, 0, 0, PNG_SIZE, PNG_SIZE);

            downloadFromUrl(
                canvas.toDataURL("image/png"),
                `mandala-${currentTemplate.id}.png`,
                false
            );
            showStatus(PNG_DOWNLOADED_MESSAGE);
        } catch (error) {
            console.error(error);
            showStatus(PNG_ERROR_MESSAGE);
        }
    }

    /** Exporta el mandala actual como SVG vectorial y lo descarga. */
    function downloadSvg() {
        try {
            const blob = new Blob([serializeSvg()], {
                type: "image/svg+xml;charset=utf-8",
            });
            const url = URL.createObjectURL(blob);
            downloadFromUrl(url, `mandala-${currentTemplate.id}.svg`, true);
            showStatus(SVG_DOWNLOADED_MESSAGE);
        } catch (error) {
            console.error(error);
            showStatus(SVG_ERROR_MESSAGE);
        }
    }

    /** Lanza el diálogo de impresión del navegador con el mandala actual. */
    function imprimir() {
        showStatus(PRINT_MESSAGE);
        window.print();
    }

    /* ------------------------------------------------------------------------
     * Construcción de la interfaz
     * ---------------------------------------------------------------------- */

    /** Puebla el selector de plantillas con las opciones disponibles. */
    function populateTemplateSelector() {
        MandalaTemplates.list.forEach((template) => {
            const option = document.createElement("option");
            option.value = template.id;
            option.textContent = template.name;
            templateSelector.appendChild(option);
        });
    }

    /** Construye los botones de la paleta de colores predefinidos. */
    function poblarPaleta() {
        COLORS.forEach((color) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "palette__color";
            button.style.backgroundColor = color.value;
            button.setAttribute("aria-label", `Usar color ${color.name}`);
            button.title = color.name;
            button.addEventListener("click", () => {
                selectColor(color.value);
                highlightPaletteColor(button);
            });
            paletteContainer.appendChild(button);
        });
    }

    /** Enlaza los eventos de la interfaz con sus manejadores. */
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

        // Atajos de teclado para deshacer/rehacer (Ctrl+Z y Ctrl+Shift+Z).
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

    /* ------------------------------------------------------------------------
     * Inicialización
     * ---------------------------------------------------------------------- */

    /** Resuelve las referencias del DOM, construye la interfaz y renderiza. */
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

        populateTemplateSelector();
        poblarPaleta();
        registrarEventos();
        selectColor(COLORS[0].value);
        highlightPaletteColor(paletteContainer.querySelector(".palette__color"));
        changeTemplate(MandalaTemplates.list[0].id);
    }

    global.AppMandala = { iniciar };
})(window);

// La interfaz solo puede construirse cuando el documento ha terminado de
// cargarse y todos los scripts (mandala.js y templates.js) están disponibles.
document.addEventListener("DOMContentLoaded", () => {
    window.AppMandala.iniciar();
});
