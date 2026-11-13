import { loadState, saveState } from "./services/storage.js";
import { el, byId, clear } from "./utils/dom.js";
import { initToast, showToast } from "./utils/toast.js";
import {
    partyRules,
    validatePartyInput,
    addParty,
    removeParty,
    changePartyColor,
} from "./modules/parties.js";
import { toggleVote } from "./modules/votes.js";
import {
    chipOf,
    campaignColorPicker,
    renderRoster,
    renderBallot,
    renderTally,
    renderBureau,
} from "./modules/render.js";

const state = loadState();

const form = byId("party-form");
const nameInput = byId("party-name");
const nameHelper = byId("party-name-helper");
const swatchesBox = byId("swatches");
const roster = byId("roster");
const partyList = byId("party-list");
const bureau = byId("bureau");
const main = byId("ballot");
const openBtn = byId("open-sidebar");
const closeBtn = byId("close-sidebar");
const scrim = byId("scrim");
const sidebar = byId("sidebar");
const desktopQuery = window.matchMedia("(min-width: 60rem)");

const tallyProjectors = {
    parties: byId("tally-parties"),
    votes: byId("tally-votes"),
    mine: byId("tally-mine"),
};

const bureauProjectors = {
    who: byId("bureau-who"),
    note: byId("bureau-note"),
};

const DEFAULT_TOKEN = partyRules.palette[0].token;
let customPickerColor = null;
let sidebarOpen = false;

function renderSwatches() {
    clear(swatchesBox);
    partyRules.palette.forEach((color) => {
        const label = el("label", { className: "swatch-label" });
        const input = el("input", {
            className: "swatch-input",
            attrs: {
                type: "radio",
                name: "color",
                value: color.token,
                "aria-label": color.name,
            },
        });
        input.checked = customPickerColor === null && color.token === DEFAULT_TOKEN;
        const swatch = el("span", { className: "swatch" });
        swatch.style.setProperty("--chip", chipOf(color.token));
        label.append(input, swatch);
        swatchesBox.append(label);
    });

    swatchesBox.append(campaignColorPicker({ value: customPickerColor || "#8a4f7d" }));
}

function markCustomColor(value) {
    customPickerColor = value;
    const custom = swatchesBox.querySelector(".swatch-custom__trigger");
    if (custom) {
        custom.style.setProperty("--chip", chipOf(value));
    }
    swatchesBox.querySelectorAll('input[name="color"]').forEach((radio) => {
        radio.checked = false;
    });
}

function renderAll() {
    renderRoster(roster, state.parties);
    renderBallot(partyList, state);
    renderTally(tallyProjectors, state);
    renderBureau(bureau, bureauProjectors, state);
}

function syncSidebarMode() {
    if (desktopQuery.matches) {
        sidebarOpen = false;
        sidebar.classList.remove("is-open");
        document.body.classList.remove("body-sidebar-open");
        sidebar.inert = false;
        sidebar.setAttribute("aria-hidden", "false");
        main.inert = false;
        openBtn.inert = false;
        openBtn.setAttribute("aria-expanded", "false");
        return;
    }

    if (!sidebarOpen) {
        const hadFocus = sidebar.contains(document.activeElement);
        sidebar.inert = true;
        sidebar.setAttribute("aria-hidden", "true");
        main.inert = false;
        openBtn.inert = false;
        if (hadFocus) {
            openBtn.focus();
        }
    }
}

function openSidebar() {
    if (desktopQuery.matches || sidebarOpen) {
        return;
    }
    sidebarOpen = true;
    sidebar.classList.add("is-open");
    document.body.classList.add("body-sidebar-open");
    sidebar.inert = false;
    sidebar.setAttribute("aria-hidden", "false");
    openBtn.setAttribute("aria-expanded", "true");
    openBtn.inert = true;
    main.inert = true;
    nameInput.focus();
}

function closeSidebar() {
    if (!sidebarOpen) {
        return;
    }
    sidebarOpen = false;
    sidebar.classList.remove("is-open");
    document.body.classList.remove("body-sidebar-open");
    sidebar.inert = true;
    sidebar.setAttribute("aria-hidden", "true");
    openBtn.setAttribute("aria-expanded", "false");
    main.inert = false;
    openBtn.inert = false;
    openBtn.focus();
}

function setError(message) {
    nameHelper.textContent = message;
    nameHelper.classList.add("field__helper--error");
    nameInput.setAttribute("aria-invalid", "true");
}

function clearError() {
    nameHelper.textContent = `Entre 1 y ${partyRules.maxLength} caracteres.`;
    nameHelper.classList.remove("field__helper--error");
    nameInput.removeAttribute("aria-invalid");
}

openBtn.addEventListener("click", openSidebar);
closeBtn.addEventListener("click", closeSidebar);
scrim.addEventListener("click", closeSidebar);
desktopQuery.addEventListener("change", syncSidebarMode);
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && sidebarOpen) {
        closeSidebar();
    }
});

nameInput.addEventListener("input", () => {
    if (nameInput.hasAttribute("aria-invalid")) {
        clearError();
    }
});

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const color =
        customPickerColor ??
        swatchesBox.querySelector('input[name="color"]:checked')?.value ??
        DEFAULT_TOKEN;
    const result = validatePartyInput(state, { name: nameInput.value, color });

    if (result.error) {
        setError(result.error);
        nameInput.focus();
        return;
    }

    clearError();
    addParty(state, { name: result.name, color: result.color });
    saveState(state);
    form.reset();
    customPickerColor = null;
    renderSwatches();
    renderAll();
});

swatchesBox.addEventListener("change", (event) => {
    if (event.target.matches('input[name="color"]')) {
        customPickerColor = null;
    }
});

swatchesBox.addEventListener("click", (event) => {
    const pick = event.target.closest('[data-action="custom-color"]');
    if (!pick) {
        return;
    }
    markCustomColor(pick.dataset.color);
    pick.closest("details").removeAttribute("open");
});

swatchesBox.addEventListener("input", (event) => {
    const pick = event.target.closest('[data-action="custom-color-lib"]');
    if (!pick) {
        return;
    }
    markCustomColor(pick.value);
});

partyList.addEventListener("click", (event) => {
    const button = event.target.closest('[data-action="vote"]');
    if (!button) {
        return;
    }
    const result = toggleVote(state, button.dataset.id);
    if (!result) {
        return;
    }
    saveState(state);
    renderAll();
});

roster.addEventListener("click", (event) => {
    const repaint = event.target.closest('[data-action="repaint"]');
    if (repaint) {
        const changed = changePartyColor(state, repaint.dataset.id, repaint.dataset.color);
        if (!changed) {
            return;
        }
        saveState(state);
        renderAll();
        return;
    }

    const button = event.target.closest(".roster__delete");
    if (!button) {
        return;
    }
    const removed = removeParty(state, button.dataset.id);
    if (!removed) {
        return;
    }
    saveState(state);
    renderAll();
    showToast({
        message: `«${removed.name}» retirado del padrón.`,
        tone: "info",
        action: {
            label: "Deshacer",
            run: () => {
                state.parties.push(removed);
                saveState(state);
                renderAll();
            },
        },
    });
});

roster.addEventListener("input", (event) => {
    const target = event.target.closest(".roster-color__picker");
    if (!target) {
        return;
    }
    const changed = changePartyColor(state, target.dataset.id, target.value);
    if (!changed) {
        return;
    }
    saveState(state);
    renderAll();
});

initToast();
syncSidebarMode();
nameInput.maxLength = partyRules.maxLength;
renderSwatches();
renderAll();
document.documentElement.dataset.ready = "true";
