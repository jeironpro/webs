import { DiceManager } from "./modules/dice.js";
import { sumValues } from "./services/diceService.js";

const diceGrid = document.getElementById("dice-grid");
const diceCountDisplay = document.getElementById("dice-count");
const diceCountSlider = document.getElementById("dice-count-slider");
const rollAnnouncer = document.getElementById("roll-announce");

const diceManager = new DiceManager(diceGrid);
diceManager.render();

function setupControls() {
    if (diceCountSlider && diceCountDisplay) {
        diceCountSlider.addEventListener("input", (event) => {
            const count = Number.parseInt(event.currentTarget.value, 10);
            diceCountDisplay.textContent = count;
            diceManager.setCount(count);
        });
    }
}

function setupRollEvents() {
    function isControlTarget(target) {
        return target instanceof Element && target.closest(".controls") !== null;
    }

    document.addEventListener("click", function (event) {
        if (isControlTarget(event.target)) {
            return;
        }
        handleRoll();
    });

    document.addEventListener(
        "touchstart",
        function (event) {
            if (isControlTarget(event.target)) {
                return;
            }
            handleRoll();
        },
        { passive: true }
    );

    document.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
            if (isControlTarget(event.target)) {
                return;
            }
            event.preventDefault();
            handleRoll();
        }
    });
}

async function handleRoll() {
    if (diceManager.isRolling) {
        return;
    }
    if (diceCountSlider) {
        diceCountSlider.disabled = true;
    }
    try {
        announceResult(await diceManager.rollAll());
    } finally {
        if (diceCountSlider) {
            diceCountSlider.disabled = false;
        }
    }
}

function announceResult(values) {
    if (!rollAnnouncer) {
        return;
    }
    const total = sumValues(values);
    rollAnnouncer.textContent = "";

    requestAnimationFrame(() => {
        rollAnnouncer.textContent = `Resultado: ${values.join(", ")}. Total: ${total}`;
    });
}

setupControls();
setupRollEvents();
