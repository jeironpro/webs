import { MAX_ATTEMPTS } from "./game.js";
import { qs } from "../utils/dom.js";

const SVG_NS = "http://www.w3.org/2000/svg";

const COLORS = ["c0", "c1", "c2", "c3", "c4"];

function svg(tag, attrs = {}) {
    const node = document.createElementNS(SVG_NS, tag);
    for (const [name, value] of Object.entries(attrs)) {
        node.setAttribute(name, value);
    }
    return node;
}

function buildBalloon(color) {
    const li = document.createElement("li");
    li.className = `balloon balloon--${color}`;
    li.dataset.state = "alive";

    const art = svg("svg", {
        class: "balloon__svg",
        viewBox: "0 0 48 66",
        "aria-hidden": "true",
    });

    art.appendChild(
        svg("ellipse", { class: "balloon__body", cx: "24", cy: "26", rx: "15", ry: "19" })
    );
    art.appendChild(
        svg("ellipse", {
            class: "balloon__gloss",
            cx: "19",
            cy: "17",
            rx: "4",
            ry: "7",
            transform: "rotate(-14 19 17)",
        })
    );
    art.appendChild(svg("path", { class: "balloon__knot", d: "M24 44 L21 50 L27 50 Z" }));
    art.appendChild(
        svg("path", {
            class: "balloon__string",
            d: "M24 50 C 26 55 22 58 24 61 C 26 64 23 66 25 66",
            fill: "none",
        })
    );

    li.appendChild(art);
    return li;
}

export function initBalloons(container) {
    let balloons = [];

    function render() {
        container.replaceChildren();
        balloons = [];
        for (let i = 0; i < MAX_ATTEMPTS; i += 1) {
            const balloon = buildBalloon(COLORS[i % COLORS.length]);
            container.appendChild(balloon);
            balloons.push(balloon);
        }
    }

    function burst(li) {
        const originX = Math.round(window.innerWidth / 2);
        const originY = Math.round(window.innerHeight / 2);
        const color =
            getComputedStyle(li).getPropertyValue("--balloon-color").trim() ||
            "var(--color-accent)";

        const layer = document.createElement("div");
        layer.className = "balloon-pop";
        layer.style.setProperty("--origin-x", `${originX}px`);
        layer.style.setProperty("--origin-y", `${originY}px`);
        layer.style.setProperty("--balloon-color", color);

        for (let i = 0; i < 40; i += 1) {
            const base = (360 / 40) * i;
            const angle = base + Math.round((Math.random() - 0.5) * 8);
            const dist = 120 + Math.round(Math.random() * 200);
            const size = 4 + Math.round(Math.random() * 4);

            const track = document.createElement("span");
            track.className = "burst-track";
            track.style.setProperty("--a", `${angle}deg`);

            const dot = document.createElement("span");
            dot.className = "burst-dot";
            dot.style.setProperty("--dist", `${dist}px`);
            dot.style.setProperty("--s", `${size}px`);

            track.appendChild(dot);
            layer.appendChild(track);
        }

        document.body.appendChild(layer);
        window.setTimeout(() => layer.remove(), 760);
    }

    function pop() {
        const next = balloons.find((node) => node.dataset.state === "alive");
        if (!next) return;

        next.dataset.state = "popped";
        const art = qs(".balloon__svg", next);
        art.classList.add("balloon__svg--popped");
        burst(next);
        window.setTimeout(() => next.remove(), 620);
    }

    function celebrate() {
        balloons.forEach((node, index) => {
            if (node.dataset.state !== "alive") return;
            const art = qs(".balloon__svg", node);
            art.style.setProperty("--fly-delay", `${index * 60}ms`);
            art.classList.add("balloon__svg--flying");
        });
    }

    function reset() {
        render();
    }

    render();
    return { pop, celebrate, reset };
}
