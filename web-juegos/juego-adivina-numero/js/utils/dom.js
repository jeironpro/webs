export function qs(selector, root = document) {
    return root.querySelector(selector);
}

export function createElement(tag, className = "", text = "") {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
}
