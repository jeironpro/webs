import { qs, on } from "../utils/dom.js";

export function initMobileMenu() {
    const toggle = qs(".menu-toggle");
    const nav = qs(".header-nav");
    if (!toggle || !nav) return;

    const closeMenu = () => {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Abrir menú");
    };

    on(toggle, "click", () => {
        const isOpen = nav.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(isOpen));
        toggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
    });

    on(document, "click", (event) => {
        if (!toggle.contains(event.target) && !nav.contains(event.target)) closeMenu();
    });
}

export function initActiveNav() {
    const path = window.location.pathname;

    document.querySelectorAll(".header-nav a").forEach((link) => {
        const href = link.getAttribute("href");
        if (href && path.endsWith(href)) link.classList.add("active");
    });
}
