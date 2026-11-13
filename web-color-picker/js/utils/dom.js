export const $ = (selector, context = document) => context.querySelector(selector);

export const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

export function createElement(tag, attrs = {}, content = "") {
    const element = document.createElement(tag);

    Object.entries(attrs).forEach(([key, value]) => {
        if (key === "className") {
            element.className = value;
        } else if (key === "dataset") {
            Object.assign(element.dataset, value);
        } else {
            element.setAttribute(key, value);
        }
    });

    if (content) {
        if (typeof content === "string") {
            element.textContent = content;
        } else {
            element.appendChild(content);
        }
    }

    return element;
}
