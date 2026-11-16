import yaml from "../vendor/js-yaml.mjs";
import { qs, qsa } from "./utils/dom.js";
import {
    errorContext,
    formatJson,
    formatYaml,
    minifyJson,
    validateYaml,
} from "./modules/format.js";

const elements = {
    formats: qsa(".format__input"),
    source: qs("#source"),
    output: qs("#output"),
    indent: qs("#indent"),
    sortKeys: qs("#sort-keys"),
    format: qs("#format"),
    minify: qs("#minify"),
    example: qs("#example"),
    clear: qs("#clear"),
    copy: qs("#copy"),
    copyStatus: qs("#copy-status"),
    status: qs("#status"),
    outputSummary: qs("#output-summary"),
    error: qs("#error"),
    errorMessage: qs("#error-message"),
    errorContext: qs("#error-context"),
    year: qs("#year"),
};

const SAMPLES = {
    json: JSON.stringify({
        proyecto: "webs",
        version: 1,
        etiquetas: ["html", "css", "javascript"],
        autor: { nombre: "jeironpro", web: true },
    }),
    yaml: [
        "proyecto: webs",
        "version: 1",
        "etiquetas:",
        "  - html",
        "  - css",
        "  - javascript",
        "autor:",
        "  nombre: jeironpro",
        "  web: true",
    ].join("\n"),
};

function currentFormat() {
    return elements.formats.find((input) => input.checked)?.value ?? "json";
}

function options() {
    return {
        indent: Number.parseInt(elements.indent.value, 10),
        sortKeys: elements.sortKeys.checked,
    };
}

function hideError() {
    elements.error.hidden = true;
    elements.errorMessage.textContent = "";
    elements.errorContext.textContent = "";
    elements.source.removeAttribute("aria-invalid");
}

function showError(format, error) {
    elements.error.hidden = false;
    elements.errorMessage.textContent = `${format.toUpperCase()} no válido · línea ${error.line}, columna ${error.column}: ${error.message}`;
    elements.errorContext.textContent = errorContext(elements.source.value, error);
    elements.source.setAttribute("aria-invalid", "true");
    elements.status.textContent = `${format.toUpperCase()} no válido`;
}

function formatStatus(format, result) {
    const lines = result.lines ?? 0;
    return `${format.toUpperCase()} válido · ${result.keys} ${result.keys === 1 ? "clave" : "claves"} · ${lines} ${lines === 1 ? "línea" : "líneas"}`;
}

function renderResult(format, result) {
    elements.output.value = result.output;
    elements.copy.disabled = false;
    elements.outputSummary.textContent = `${result.lines} líneas`;
    elements.status.textContent = formatStatus(format, result);
    hideError();
}

function validateOnly() {
    const format = currentFormat();
    const text = elements.source.value;

    if (text.trim() === "") {
        hideError();
        elements.status.textContent = "Esperando datos";
        elements.outputSummary.textContent = "";
        return;
    }

    if (format === "json") {
        const result = formatJson(text, options());
        if (result.ok) {
            elements.status.textContent = `JSON válido · ${result.keys} ${result.keys === 1 ? "clave" : "claves"}`;
            hideError();
        } else {
            showError("json", result.error);
        }
        return;
    }

    const result = validateYaml(text, yaml);
    if (result.ok) {
        elements.status.textContent = `YAML válido · ${result.keys} ${result.keys === 1 ? "clave" : "claves"}`;
        hideError();
    } else {
        showError("yaml", result.error);
    }
}

function apply(mode) {
    const format = currentFormat();
    const text = elements.source.value;

    if (text.trim() === "") {
        validateOnly();
        return;
    }

    const result =
        format === "json"
            ? mode === "minify"
                ? minifyJson(text, options())
                : formatJson(text, options())
            : formatYaml(text, yaml, options());

    if (!result.ok) {
        showError(format, result.error);
        return;
    }

    renderResult(format, result);
}

function syncFormatUi() {
    const format = currentFormat();
    elements.minify.disabled = format === "yaml";
    elements.copyStatus.textContent = "";
    validateOnly();
}

function loadExample() {
    const format = currentFormat();
    elements.source.value = SAMPLES[format];
    elements.output.value = "";
    elements.copy.disabled = true;
    elements.outputSummary.textContent = "";
    apply("format");
}

function clearAll() {
    elements.source.value = "";
    elements.output.value = "";
    elements.copy.disabled = true;
    elements.outputSummary.textContent = "";
    elements.copyStatus.textContent = "";
    hideError();
    elements.status.textContent = "Esperando datos";
    elements.source.focus();
}

async function copyOutput() {
    try {
        await navigator.clipboard.writeText(elements.output.value);
        elements.copyStatus.textContent = "Resultado copiado.";
    } catch {
        elements.copyStatus.textContent = "No se pudo copiar el resultado.";
    }
}

if (elements.year) {
    elements.year.textContent = String(new Date().getFullYear());
}

elements.formats.forEach((input) =>
    input.addEventListener("change", () => {
        elements.output.value = "";
        elements.copy.disabled = true;
        elements.outputSummary.textContent = "";
        syncFormatUi();
    })
);
elements.source.addEventListener("input", validateOnly);
elements.format.addEventListener("click", () => apply("format"));
elements.minify.addEventListener("click", () => apply("minify"));
elements.example.addEventListener("click", loadExample);
elements.clear.addEventListener("click", clearAll);
elements.copy.addEventListener("click", copyOutput);

syncFormatUi();
loadExample();
