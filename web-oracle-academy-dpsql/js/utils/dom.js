export function createElement(tag, { className = "", text = "", attributes = {}, aria = {} } = {}) {
    const element = document.createElement(tag);
    if (className !== "") {
        element.className = className;
    }
    if (text !== "") {
        element.textContent = text;
    }
    for (const [name, value] of Object.entries(attributes)) {
        element.setAttribute(name, value);
    }
    for (const [name, value] of Object.entries(aria)) {
        element.setAttribute(`aria-${name}`, value);
    }
    return element;
}

export function clearNode(node) {
    while (node.firstChild !== null) {
        node.removeChild(node.firstChild);
    }
}
