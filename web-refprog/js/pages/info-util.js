import { getTopics, fetchYaml } from "../services/contentService.js";
import { delegate, qs } from "../utils/dom.js";
import { initActiveNav, initMobileMenu } from "../modules/navigation.js";

function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
}

function createChevron() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "info-topic-icon");
    svg.setAttribute("width", "16");
    svg.setAttribute("height", "16");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("aria-hidden", "true");

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M6 9l6 6 6-6");
    path.setAttribute("stroke", "currentColor");
    path.setAttribute("stroke-width", "2");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    svg.append(path);
    return svg;
}

function createStatus(className, text) {
    return createElement("div", `info-loading ${className}`.trim(), text);
}

function createTopic(topic) {
    const item = createElement("article", "info-topic-item");
    item.dataset.path = topic.path;
    item.dataset.name = topic.name;

    const header = createElement("div", "info-topic-header");
    header.append(createElement("span", "info-topic-name", topic.displayName), createChevron());

    const content = createElement("div", "info-topic-content");
    content.append(createStatus("info-loading--inline", "Cargando..."));

    item.append(header, content);
    return item;
}

function appendSpan(parent, className, text) {
    parent.append(createElement("span", className, text));
}

function isQuotedScalar(value) {
    const trimmed = value.trim();
    return (
        trimmed.length >= 2 &&
        (trimmed.startsWith('"') || trimmed.startsWith("'")) &&
        trimmed.endsWith(trimmed[0])
    );
}

function decodeScalar(value) {
    if (!isQuotedScalar(value)) return value;

    const trimmed = value.trim();
    const quote = trimmed[0];
    const inner = trimmed.slice(1, -1);

    if (quote === "'") return inner.replace(/''/g, "'");

    try {
        return JSON.parse(trimmed);
    } catch {
        return inner.replace(/\\"/g, '"').replace(/\\\\/g, "\\");
    }
}

function appendScalar(parent, value) {
    const decoded = decodeScalar(value);
    const colonIndex = decoded.indexOf(": ");

    if (colonIndex > 0) {
        appendSpan(parent, "yaml-key", decoded.slice(0, colonIndex));
        parent.append(document.createTextNode(`: ${decoded.slice(colonIndex + 2)}`));
        return;
    }

    parent.append(document.createTextNode(decoded));
}

function appendHighlightedLine(parent, line) {
    const indent = line.match(/^\s*/)[0];
    const trimmed = line.trim();

    if (trimmed === "") {
        parent.append(document.createTextNode("\n"));
        return;
    }

    parent.append(document.createTextNode(indent));

    if (trimmed.startsWith("#")) {
        appendSpan(parent, "yaml-comment", trimmed);
        parent.append(document.createTextNode("\n"));
        return;
    }

    if (isQuotedScalar(trimmed)) {
        appendScalar(parent, trimmed);
        parent.append(document.createTextNode("\n"));
        return;
    }

    if (trimmed.startsWith("-")) {
        const afterDash = trimmed.slice(1);
        appendSpan(parent, "yaml-bullet", "-");

        if (!afterDash.startsWith(" ")) {
            parent.append(document.createTextNode(`${afterDash}\n`));
            return;
        }

        parent.append(document.createTextNode(" "));
        const rest = afterDash.slice(1);
        const colonIndex = rest.indexOf(": ");

        if (isQuotedScalar(rest)) {
            appendScalar(parent, rest);
        } else if (colonIndex > 0) {
            appendSpan(parent, "yaml-key", rest.slice(0, colonIndex));
            parent.append(document.createTextNode(`: ${decodeScalar(rest.slice(colonIndex + 2))}`));
        } else if (rest.endsWith(":")) {
            appendSpan(parent, "yaml-key", rest.slice(0, -1));
            parent.append(document.createTextNode(":"));
        } else {
            parent.append(document.createTextNode(rest));
        }

        parent.append(document.createTextNode("\n"));
        return;
    }

    const colonIndex = trimmed.indexOf(": ");
    if (colonIndex > 0) {
        appendSpan(parent, "yaml-key", trimmed.slice(0, colonIndex));
        parent.append(document.createTextNode(`: ${decodeScalar(trimmed.slice(colonIndex + 2))}`));
    } else if (trimmed.endsWith(":")) {
        appendSpan(parent, "yaml-key", trimmed.slice(0, -1));
        parent.append(document.createTextNode(":"));
    } else {
        parent.append(document.createTextNode(trimmed));
    }

    parent.append(document.createTextNode("\n"));
}

function highlightYaml(text) {
    const pre = createElement("pre", "yaml-highlighted");
    const fragment = document.createDocumentFragment();

    text.split("\n").forEach((line) => appendHighlightedLine(fragment, line));
    pre.append(fragment);
    return pre;
}

function showError(container, message) {
    container.replaceChildren(createElement("div", "info-error", message));
}

function initInfoUtil() {
    const container = qs("#info-container");
    if (!container) return;

    try {
        const topics = getTopics();
        if (topics.length === 0) {
            showError(container, "No se encontraron guías.");
            return;
        }

        container.replaceChildren(...topics.map(createTopic));

        delegate("#info-container", ".info-topic-item", "click", async (_event, item) => {
            const content = item.querySelector(".info-topic-content");
            if (!content) return;

            const loading = content.querySelector(".info-loading");
            if (loading) {
                try {
                    const raw = await fetchYaml(item.dataset.path);
                    content.replaceChildren(highlightYaml(raw));
                } catch (error) {
                    content.replaceChildren(
                        createElement("div", "info-error", `Error: ${error.message}`)
                    );
                }
            }

            item.classList.toggle("active");
        });
    } catch {
        showError(container, "Error al cargar la lista de guías.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    initMobileMenu();
    initActiveNav();
    initInfoUtil();
});
