import { Roulette } from "./modules/roulette.js";
import { SidebarManager } from "./modules/sidebar.js";
import { $ } from "./utils/dom.js";

const roulette = new Roulette("roulette-canvas");
const spinButton = $("#spin-button");
const resultValue = $("#result-value");

let currentSegments = [];

roulette.onComplete = (result) => {
    resultValue.textContent = String(result);
    spinButton.disabled = false;
    roulette.canvas.setAttribute(
        "aria-label",
        `Ruleta con ${currentSegments.length} opciones. Resultado: ${result}`
    );
};

const sidebar = new SidebarManager((segments) => {
    currentSegments = segments;
    roulette.setSegments(segments);
    resultValue.textContent = "---";
    spinButton.disabled = false;
});

spinButton.addEventListener("click", () => {
    if (currentSegments.length === 0) {
        sidebar.open();
        return;
    }
    spinButton.disabled = true;
    resultValue.textContent = "...";
    roulette.spin();
});
