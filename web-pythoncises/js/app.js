"use strict";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const nav = document.getElementById("nav");

if (nav !== null) {
    let ticking = false;

    function updateNav() {
        nav.classList.toggle("is-floating", window.scrollY > 24);
        ticking = false;
    }

    window.addEventListener(
        "scroll",
        () => {
            if (!ticking) {
                requestAnimationFrame(updateNav);
                ticking = true;
            }
        },
        { passive: true }
    );
    updateNav();
}

const counters = Array.from(document.querySelectorAll(".count"));

function formatNumber(value) {
    return value.toLocaleString("es-ES");
}

function runCounter(element) {
    const target = Number.parseInt(element.dataset.to ?? "0", 10) || 0;
    if (reducedMotion) {
        element.textContent = formatNumber(target);
        return;
    }

    const duration = 1200;
    const start = performance.now();

    function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = formatNumber(Math.round(target * eased));
        if (progress < 1) {
            requestAnimationFrame(tick);
            return;
        }
        element.textContent = formatNumber(target);
        if (element.animate) {
            element.animate(
                [
                    { transform: "scale(1)" },
                    { transform: "scale(1.07)" },
                    { transform: "scale(1)" },
                ],
                { duration: 320, easing: "ease-out" }
            );
        }
    }

    requestAnimationFrame(tick);
}

const stages = Array.from(document.querySelectorAll(".stage"));

if ("IntersectionObserver" in window) {
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        runCounter(entry.target);
                        counterObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.6 }
        );
        counters.forEach((counter) => counterObserver.observe(counter));
    }

    if (stages.length > 0) {
        const stageObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-in");
                        stageObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.25, rootMargin: "0px 0px -10% 0px" }
        );
        stages.forEach((stage) => stageObserver.observe(stage));
    }
} else {
    counters.forEach(runCounter);
    stages.forEach((stage) => stage.classList.add("is-in"));
}

const snake = document.getElementById("snake");

function burst(x, y) {
    if (reducedMotion) {
        return;
    }
    const star = document.createElement("span");
    star.className = "star-burst";
    star.style.position = "absolute";
    star.style.left = `${x - 12}px`;
    star.style.top = `${y - 12}px`;
    document.body.append(star);
    window.setTimeout(() => star.remove(), 460);
}

function reactSnake() {
    if (snake === null || reducedMotion) {
        return;
    }
    snake.classList.remove("is-react");
    void snake.offsetWidth;
    snake.classList.add("is-react");
}

document.querySelectorAll("[data-burst]").forEach((element) => {
    element.addEventListener("click", (event) => {
        burst(event.pageX, event.pageY);
        reactSnake();
    });
});

const searchInput = document.getElementById("search");
const filterChips = Array.from(document.querySelectorAll(".filter-chip"));
const categories = Array.from(document.querySelectorAll(".category"));
const cards = Array.from(document.querySelectorAll(".card"));
const emptyState = document.getElementById("no-results");
let activeCategory = "all";

function normalizeText(text) {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function applyFilters() {
    const term = normalizeText(searchInput === null ? "" : searchInput.value.trim());
    let visibleCards = 0;

    cards.forEach((card) => {
        const matchesCategory =
            activeCategory === "all" || card.dataset.category === activeCategory;
        const matchesTerm = term === "" || normalizeText(card.dataset.search).includes(term);
        const isVisible = matchesCategory && matchesTerm;
        card.hidden = !isVisible;
        if (isVisible) {
            visibleCards += 1;
        }
    });

    categories.forEach((category) => {
        category.hidden = category.querySelectorAll(".card:not([hidden])").length === 0;
    });

    if (emptyState !== null) {
        emptyState.hidden = visibleCards !== 0;
    }
}

if (searchInput !== null) {
    searchInput.addEventListener("input", applyFilters);
}

filterChips.forEach((chip) => {
    chip.addEventListener("click", () => {
        activeCategory = chip.dataset.category;
        filterChips.forEach((item) => item.classList.toggle("is-active", item === chip));
        applyFilters();
    });
});

const code = document.querySelector(".detail pre code");

function copyBySelection(text, onCopied) {
    const buffer = document.createElement("textarea");
    buffer.value = text;
    buffer.className = "copy-buffer";
    buffer.setAttribute("readonly", "");
    document.body.append(buffer);
    buffer.select();
    try {
        document.execCommand("copy");
        onCopied();
    } catch {
        return;
    } finally {
        buffer.remove();
    }
}

function markCopied(button) {
    button.textContent = "Copiado ✓";
    button.dataset.copied = "true";
    window.setTimeout(() => {
        button.textContent = "Copiar";
        delete button.dataset.copied;
    }, 2500);
}

async function copyCode(button, text) {
    if (navigator.clipboard && window.isSecureContext) {
        try {
            await Promise.race([
                navigator.clipboard.writeText(text),
                new Promise((_, reject) => window.setTimeout(reject, 600)),
            ]);
            markCopied(button);
            return;
        } catch {
            copyBySelection(text, () => markCopied(button));
            return;
        }
    }
    copyBySelection(text, () => markCopied(button));
}

function downloadCode(name, text) {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}

document.addEventListener("click", (event) => {
    const button =
        event.target instanceof Element ? event.target.closest("button[data-action]") : null;
    if (button === null || code === null) {
        return;
    }
    burst(event.pageX, event.pageY);
    reactSnake();
    const text = code.textContent.replace(/\s+$/, "");
    if (button.dataset.action === "copy") {
        copyCode(button, text);
    } else if (button.dataset.action === "download") {
        downloadCode(button.dataset.name, text);
    }
});
