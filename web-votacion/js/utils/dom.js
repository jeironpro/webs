export function el(tag, { className, attrs, text, children } = {}) {
    const node = document.createElement(tag);
    if (className) {
        node.className = className;
    }
    if (attrs) {
        for (const [key, value] of Object.entries(attrs)) {
            node.setAttribute(key, value);
        }
    }
    if (text !== undefined && text !== null) {
        node.textContent = text;
    }
    if (children) {
        node.append(...children);
    }
    return node;
}

export function byId(id) {
    const node = document.getElementById(id);
    if (!node) {
        throw new Error(`Elemento con id "${id}" no encontrado`);
    }
    return node;
}

export function clear(node) {
    node.replaceChildren();
}
