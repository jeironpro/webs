export function qs(selector, context = document) {
    return context.querySelector(selector);
}

export function on(element, eventName, handler, options = {}) {
    const target = typeof element === "string" ? qs(element) : element;
    if (!target) return;
    target.addEventListener(eventName, handler, options);
}

export function delegate(parent, selector, eventName, handler) {
    const root = typeof parent === "string" ? qs(parent) : parent;
    if (!root) return;

    root.addEventListener(eventName, (event) => {
        const target = event.target instanceof Element ? event.target.closest(selector) : null;
        if (target && root.contains(target)) handler(event, target);
    });
}

export function toggleClass(element, className) {
    const target = typeof element === "string" ? qs(element) : element;
    if (!target) return;
    target.classList.toggle(className);
}
