import { transformText } from "./modules/codecs.js";

const CODECS = {
    base64: {
        index: "01",
        slug: "base64",
        title: "Base64, ida y vuelta",
        description:
            "Convierte texto UTF-8 en Base64 y recupera el original sin perder acentos ni emojis.",
        facts: ["texto UTF-8", "ASCII", "RFC 4648"],
        labels: {
            encode: ["Texto original", "Base64"],
            decode: ["Base64", "Texto original"],
        },
        placeholders: {
            encode: "Escribe o pega el texto que quieres convertir…",
            decode: "Pega aquí una cadena Base64…",
        },
        example: "Hola, mundo 🌍",
    },
    url: {
        index: "02",
        slug: "url",
        title: "Texto listo para una URL",
        description:
            "Escapa lo que rompe una dirección y recupera el texto original. Elige entre un componente o una URI completa.",
        facts: ["texto UTF-8", "%XX y ASCII", "RFC 3986"],
        labels: {
            encode: ["Texto original", "URL codificada"],
            decode: ["URL codificada", "Texto original"],
        },
        placeholders: {
            encode: "Escribe el texto o la URL que quieres escapar…",
            decode: "Pega aquí una URL codificada…",
        },
        example: "https://ejemplo.com/buscar?q=niño&orden=año",
    },
    html: {
        index: "03",
        slug: "html",
        title: "Entidades HTML sin sustos",
        description:
            "Escapa los caracteres que rompen el marcado y convierte entidades nombradas o numéricas de vuelta a texto.",
        facts: ["texto plano", "entidades", "HTML5"],
        labels: {
            encode: ["Texto original", "HTML escapado"],
            decode: ["HTML escapado", "Texto original"],
        },
        placeholders: {
            encode: "Escribe el HTML o el texto que quieres escapar…",
            decode: "Pega aquí HTML con entidades (&amp;, &#241;…)…",
        },
        example: '<p class="aviso">Tom & Jerry · 5 < 6</p>',
    },
};

const state = {
    codec: "base64",
    direction: "encode",
    drafts: new Map([["base64", CODECS.base64.example]]),
};

const $ = (id) => document.getElementById(id);

const elements = {
    input: $("codec-input"),
    output: $("codec-output"),
    inputLabel: $("input-label"),
    outputLabel: $("output-label"),
    inputStats: $("input-stats"),
    outputStats: $("output-stats"),
    kicker: $("workspace-kicker"),
    title: $("workspace-title"),
    description: $("codec-description"),
    factInput: $("fact-input"),
    factOutput: $("fact-output"),
    factRef: $("fact-ref"),
    error: $("error"),
    copy: $("copy"),
    copyStatus: $("copy-status"),
    reuse: $("reuse"),
    clear: $("clear"),
    example: $("example"),
};

const codecButtons = [...document.querySelectorAll("[data-codec]")];
const directionButtons = [...document.querySelectorAll("[data-direction]")];
const optionPanels = [...document.querySelectorAll("[data-options]")];
const formatter = new Intl.NumberFormat("es-ES");

let copyTimer;

function describeText(text) {
    const characters = Array.from(text).length;
    const bytes = new TextEncoder().encode(text).length;
    const noun = characters === 1 ? "carácter" : "caracteres";

    return `${formatter.format(characters)} ${noun} · ${formatter.format(bytes)} B`;
}

function readOptions() {
    if (state.codec === "url") {
        return { scope: document.querySelector('input[name="url-scope"]:checked').value };
    }

    if (state.codec === "html") {
        return { scope: document.querySelector('input[name="html-scope"]:checked').value };
    }

    return {};
}

function setError(message) {
    elements.error.textContent = message;
    elements.error.hidden = message === "";
    elements.input.setAttribute("aria-invalid", String(message !== ""));
}

function setOutputState(hasOutput) {
    elements.copy.disabled = !hasOutput;
    elements.reuse.disabled = !hasOutput;
}

function clearCopyStatus() {
    clearTimeout(copyTimer);
    elements.copyStatus.textContent = "";
}

function showCopyStatus(message) {
    clearTimeout(copyTimer);
    elements.copyStatus.textContent = message;

    copyTimer = setTimeout(() => {
        elements.copyStatus.textContent = "";
    }, 2600);
}

function render() {
    const source = elements.input.value;
    elements.inputStats.textContent = describeText(source);
    clearCopyStatus();

    if (source === "") {
        elements.output.value = "";
        elements.outputStats.textContent = describeText("");
        setError("");
        setOutputState(false);
        return;
    }

    try {
        const result = transformText(source, state.codec, state.direction, readOptions());
        elements.output.value = result;
        elements.outputStats.textContent = describeText(result);
        setError("");
        setOutputState(result !== "");
    } catch (error) {
        elements.output.value = "";
        elements.outputStats.textContent = describeText("");
        setError(error instanceof Error ? error.message : "No se pudo transformar el texto.");
        setOutputState(false);
    }
}

function updateLabels() {
    const meta = CODECS[state.codec];
    const encode = state.direction === "encode";
    const [inputLabel, outputLabel] = meta.labels[encode ? "encode" : "decode"];

    elements.inputLabel.textContent = inputLabel;
    elements.outputLabel.textContent = outputLabel;
    elements.input.placeholder = meta.placeholders[encode ? "encode" : "decode"];
}

function updateDirectionUi() {
    directionButtons.forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.direction === state.direction));
    });

    updateLabels();
}

function updateCodecUi() {
    const meta = CODECS[state.codec];

    elements.kicker.textContent = `canal ${meta.index} / ${meta.slug}`;
    elements.title.textContent = meta.title;
    elements.description.textContent = meta.description;
    elements.factInput.textContent = meta.facts[0];
    elements.factOutput.textContent = meta.facts[1];
    elements.factRef.textContent = meta.facts[2];

    optionPanels.forEach((panel) => {
        panel.hidden = panel.dataset.options !== state.codec;
    });

    codecButtons.forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.codec === state.codec));
    });

    updateLabels();
}

function selectCodec(codec) {
    if (codec === state.codec) return;

    state.drafts.set(state.codec, elements.input.value);
    state.codec = codec;
    elements.input.value = state.drafts.get(codec) ?? "";
    updateCodecUi();
    render();
}

function selectDirection(direction) {
    if (direction === state.direction) return;

    state.direction = direction;
    updateDirectionUi();
    render();
}

async function copyResult() {
    if (elements.output.value === "") return;

    try {
        if (!navigator.clipboard) throw new Error("El portapapeles no está disponible.");
        await navigator.clipboard.writeText(elements.output.value);
        showCopyStatus("Copiado al portapapeles");
    } catch {
        elements.output.focus();
        elements.output.select();
        showCopyStatus("Selecciona el texto y copia con Ctrl+C");
    }
}

function reuseResult() {
    if (elements.output.value === "") return;

    state.direction = state.direction === "encode" ? "decode" : "encode";
    elements.input.value = elements.output.value;
    state.drafts.set(state.codec, elements.input.value);
    updateDirectionUi();
    render();
    elements.input.focus();
}

codecButtons.forEach((button) => {
    button.addEventListener("click", () => selectCodec(button.dataset.codec));
});

directionButtons.forEach((button) => {
    button.addEventListener("click", () => selectDirection(button.dataset.direction));
});

optionPanels.forEach((panel) => {
    panel.querySelectorAll('input[name="url-scope"], input[name="html-scope"]').forEach((input) => {
        input.addEventListener("change", render);
    });
});

elements.input.addEventListener("input", render);

elements.clear.addEventListener("click", () => {
    elements.input.value = "";
    state.drafts.set(state.codec, "");
    render();
    elements.input.focus();
});

elements.example.addEventListener("click", () => {
    state.direction = "encode";
    elements.input.value = CODECS[state.codec].example;
    state.drafts.set(state.codec, elements.input.value);
    updateDirectionUi();
    render();
    elements.input.focus();
});

elements.copy.addEventListener("click", copyResult);
elements.reuse.addEventListener("click", reuseResult);

document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
});

elements.input.value = state.drafts.get("base64") ?? "";
updateCodecUi();
updateDirectionUi();
render();
