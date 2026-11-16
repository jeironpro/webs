import {
    DAY_MS,
    GRADES,
    buildQueue,
    createCard,
    deckStats,
    formatInterval,
    nextDue,
    scheduleCard,
} from "./modules/srs.js";

const STORAGE_KEY = "fichero:v1";
const DEMO_DECK_ID = "deck-js";

let storageAvailable = true;
const state = loadState();

const $ = (id) => document.getElementById(id);

const elements = {
    deckList: $("deck-list"),
    newDeckToggle: $("new-deck-toggle"),
    newDeckForm: $("new-deck-form"),
    newDeckName: $("new-deck-name"),
    newDeckCancel: $("new-deck-cancel"),
    storageStatus: $("storage-status"),
    deckTitle: $("deck-title"),
    deckMeta: $("deck-meta"),
    deleteDeck: $("delete-deck"),
    tabs: [...document.querySelectorAll("[data-view]")],
    studyView: $("study-view"),
    cardsView: $("cards-view"),
    sessionBar: $("session-bar"),
    sessionCount: $("session-count"),
    sessionProgress: $("session-progress"),
    reviewArea: $("review-area"),
    reviewCard: $("review-card"),
    cardSide: $("card-side"),
    cardFront: $("card-front"),
    cardAnswer: $("card-answer"),
    cardBack: $("card-back"),
    reveal: $("reveal"),
    gradeGroup: $("grade-group"),
    keyHint: $("key-hint"),
    stageState: $("stage-state"),
    stateKicker: $("state-kicker"),
    stateTitle: $("state-title"),
    stateText: $("state-text"),
    stateAction: $("state-action"),
    cardForm: $("card-form"),
    cardFormTitle: $("card-form-title"),
    frontInput: $("card-front-input"),
    backInput: $("card-back-input"),
    cardSubmit: $("card-submit"),
    cardCancel: $("card-cancel"),
    cardStatus: $("card-status"),
    cardsCount: $("cards-count"),
    cardList: $("card-list"),
    cardsEmpty: $("cards-empty"),
    dueCount: $("due-count"),
    newCount: $("new-count"),
    learningCount: $("learning-count"),
    matureCount: $("mature-count"),
    agendaList: $("agenda-list"),
    confirmDialog: $("confirm-dialog"),
    confirmTitle: $("confirm-title"),
    confirmText: $("confirm-text"),
    confirmAccept: $("confirm-accept"),
};

const gradePreviews = {
    again: $("preview-again"),
    hard: $("preview-hard"),
    good: $("preview-good"),
    easy: $("preview-easy"),
};

const dateFormatter = new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
});

let session = { queue: [], total: 0, completed: 0, revealed: false };
let view = "study";
let editingCardId = null;
let pendingConfirm = null;
let stateActionMode = "cards";

function demoCard(id, front, back, extra = {}) {
    const now = Date.now();
    return { ...createCard(id, front, back, now), ...extra };
}

function seedState() {
    const now = Date.now();
    const day = DAY_MS;
    const cards = [
        demoCard(
            "js-1",
            "¿Qué devuelve `typeof null`?",
            '"object": una peculiaridad histórica de JavaScript.'
        ),
        demoCard(
            "js-2",
            "¿Cuál es la diferencia entre `let` y `const`?",
            "`let` permite reasignar; `const` impide reasignar la referencia."
        ),
        demoCard(
            "js-3",
            "¿Qué hace `Array.prototype.map`?",
            "Crea un array nuevo con el resultado de aplicar una función a cada elemento."
        ),
        demoCard(
            "js-4",
            "¿Qué es un closure?",
            "Una función que recuerda las variables de su ámbito léxico aunque ese ámbito ya haya terminado."
        ),
        demoCard(
            "js-5",
            "¿Qué compara `===`?",
            "Igualdad estricta: mismo tipo y mismo valor, sin coerción.",
            {
                interval: 0.25,
                ease: 2.35,
                reps: 1,
                lastReviewed: now - day,
            }
        ),
        demoCard(
            "js-6",
            "¿Qué es el DOM?",
            "La representación en árbol del documento HTML que manipula el navegador.",
            { interval: 4, ease: 2.5, reps: 3, lastReviewed: now - 4 * day }
        ),
        demoCard(
            "js-7",
            "¿Para qué sirve `localStorage`?",
            "Guardar pares clave-valor en el navegador; persisten tras recargar y no se envían al servidor.",
            {
                interval: 10,
                ease: 2.6,
                reps: 4,
                lastReviewed: now - 6 * day,
                due: now + 3 * day,
            }
        ),
        demoCard(
            "js-8",
            "¿Qué es una promesa?",
            "Un objeto que representa un valor futuro: pendiente, resuelto o rechazado.",
            {
                interval: 21,
                ease: 2.7,
                reps: 5,
                lastReviewed: now - 9 * day,
                due: now + 12 * day,
            }
        ),
    ];

    return {
        version: 1,
        activeDeckId: DEMO_DECK_ID,
        decks: [{ id: DEMO_DECK_ID, name: "JavaScript esencial", cards }],
    };
}

function normalizeCard(raw) {
    if (
        !raw ||
        typeof raw.id !== "string" ||
        typeof raw.front !== "string" ||
        typeof raw.back !== "string"
    ) {
        return null;
    }

    return {
        id: raw.id,
        front: raw.front,
        back: raw.back,
        due: Number.isFinite(raw.due) ? raw.due : Date.now(),
        interval: Number.isFinite(raw.interval) ? Math.max(0, raw.interval) : 0,
        ease: Number.isFinite(raw.ease) ? raw.ease : 2.5,
        reps: Number.isFinite(raw.reps) ? Math.max(0, raw.reps) : 0,
        lapses: Number.isFinite(raw.lapses) ? Math.max(0, raw.lapses) : 0,
        lastReviewed: Number.isFinite(raw.lastReviewed) ? raw.lastReviewed : null,
        createdAt: Number.isFinite(raw.createdAt) ? raw.createdAt : Date.now(),
    };
}

function normalizeDecks(rawDecks) {
    if (!Array.isArray(rawDecks)) return [];

    return rawDecks
        .filter((deck) => deck && typeof deck.id === "string" && typeof deck.name === "string")
        .map((deck) => ({
            id: deck.id,
            name: deck.name.trim().slice(0, 60) || "Mazo sin nombre",
            cards: Array.isArray(deck.cards) ? deck.cards.map(normalizeCard).filter(Boolean) : [],
        }));
}

function loadState() {
    let raw;

    try {
        raw = localStorage.getItem(STORAGE_KEY);
    } catch {
        storageAvailable = false;
        return seedState();
    }

    if (!raw) return seedState();

    let parsed;
    try {
        parsed = JSON.parse(raw);
    } catch {
        return seedState();
    }

    const decks = normalizeDecks(parsed?.decks);
    if (decks.length === 0) return seedState();

    const activeDeckId = decks.some((deck) => deck.id === parsed.activeDeckId)
        ? parsed.activeDeckId
        : decks[0].id;

    return { version: 1, activeDeckId, decks };
}

function makeId(prefix) {
    if (globalThis.crypto?.randomUUID) return `${prefix}-${globalThis.crypto.randomUUID()}`;
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function activeDeck() {
    return state.decks.find((deck) => deck.id === state.activeDeckId) ?? state.decks[0];
}

function formatDate(timestamp) {
    return dateFormatter.format(new Date(timestamp));
}

function updateStorageStatus() {
    elements.storageStatus.textContent = storageAvailable
        ? "Guardado en este navegador"
        : "Sin almacenamiento: los cambios son temporales";
    elements.storageStatus.classList.toggle("is-error", !storageAvailable);
}

function saveState() {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                version: 1,
                activeDeckId: state.activeDeckId,
                decks: state.decks,
            })
        );
        storageAvailable = true;
    } catch {
        storageAvailable = false;
    }

    updateStorageStatus();
}

function startSession() {
    const deck = activeDeck();
    const queue = deck ? buildQueue(deck.cards, Date.now()) : [];

    session = {
        queue,
        total: queue.length,
        completed: 0,
        revealed: false,
    };
}

function renderDeckHeader(deck) {
    const stats = deckStats(deck.cards);
    const pending = stats.due === 1 ? "1 pendiente" : `${stats.due} pendientes`;
    const cards = stats.total === 1 ? "1 tarjeta" : `${stats.total} tarjetas`;

    elements.deckTitle.textContent = deck.name;
    elements.deckMeta.textContent = `${pending} · ${cards}`;
    elements.deleteDeck.disabled = state.decks.length <= 1;
    elements.deleteDeck.title =
        state.decks.length <= 1 ? "No se puede eliminar el único mazo" : "Eliminar este mazo";
}

function renderDeckList() {
    const deck = activeDeck();

    const items = state.decks.map((item) => {
        const stats = deckStats(item.cards);
        const button = document.createElement("button");
        button.type = "button";
        button.className = "deck";
        button.setAttribute("aria-pressed", String(item.id === deck.id));
        button.setAttribute(
            "aria-label",
            `${item.name}: ${stats.due} pendientes, ${stats.total} tarjetas`
        );

        const top = document.createElement("span");
        top.className = "deck__top";

        const name = document.createElement("span");
        name.className = "deck__name";
        name.textContent = item.name;

        const badge = document.createElement("span");
        badge.className = stats.due > 0 ? "deck__due" : "deck__due is-clear";
        badge.textContent = String(stats.due);
        top.append(name, badge);

        const meta = document.createElement("span");
        meta.className = "deck__meta";
        meta.textContent =
            stats.due > 0
                ? `${stats.due} pendientes · ${stats.total} tarjetas`
                : `Al día · ${stats.total} tarjetas`;

        button.append(top, meta);
        button.addEventListener("click", () => selectDeck(item.id));
        return button;
    });

    elements.deckList.replaceChildren(...items);
}

function renderRail(deck) {
    const stats = deckStats(deck.cards);
    elements.dueCount.textContent = String(stats.due);
    elements.newCount.textContent = String(stats.new);
    elements.learningCount.textContent = String(stats.learning);
    elements.matureCount.textContent = String(stats.mature);

    const now = Date.now();
    const buckets = [0, 0, 0];
    deck.cards.forEach((card) => {
        const delta = card.due - now;
        if (delta <= DAY_MS) buckets[0] += 1;
        else if (delta <= 7 * DAY_MS) buckets[1] += 1;
        else buckets[2] += 1;
    });

    const labels = ["Hoy o mañana", "Esta semana", "Más adelante"];
    const rows = labels.map((label, index) => {
        const item = document.createElement("li");
        const term = document.createElement("span");
        term.textContent = label;
        const count = document.createElement("b");
        count.textContent = String(buckets[index]);
        item.append(term, count);
        return item;
    });

    elements.agendaList.replaceChildren(...rows);
}

function renderStudy(deck) {
    const card = session.queue.length
        ? deck.cards.find((item) => item.id === session.queue[0])
        : null;

    elements.sessionBar.hidden = session.total === 0;
    elements.sessionCount.textContent = `${session.completed} de ${session.total}`;
    elements.sessionProgress.max = Math.max(1, session.total);
    elements.sessionProgress.value = session.completed;
    elements.sessionProgress.setAttribute("aria-valuenow", String(session.completed));
    elements.sessionProgress.setAttribute("aria-valuemax", String(Math.max(1, session.total)));

    if (card) {
        const now = Date.now();
        elements.reviewArea.hidden = false;
        elements.stageState.hidden = true;
        elements.cardSide.textContent = session.revealed ? "Reverso" : "Frente";
        elements.cardFront.textContent = card.front;
        elements.cardBack.textContent = card.back;
        elements.cardAnswer.hidden = !session.revealed;
        elements.reveal.hidden = session.revealed;
        elements.gradeGroup.hidden = !session.revealed;
        elements.keyHint.textContent = session.revealed
            ? "1 Otra vez · 2 Difícil · 3 Bien · 4 Fácil"
            : "Espacio para girar";

        GRADES.forEach((grade) => {
            gradePreviews[grade].textContent = formatInterval(
                scheduleCard(card, grade, now).interval
            );
        });
        return;
    }

    elements.reviewArea.hidden = true;
    elements.stageState.hidden = false;
    stateActionMode = "cards";
    elements.stateAction.textContent = "Ver tarjetas";

    const upcoming = nextDue(deck.cards, Date.now());

    if (session.total > 0) {
        const cards = session.total === 1 ? "1 tarjeta" : `${session.total} tarjetas`;
        elements.stateKicker.textContent = "Sesión";
        elements.stateTitle.textContent = "Sesión completada";
        elements.stateText.textContent = `Has repasado ${cards}.${
            upcoming ? ` Próximo repaso: ${formatDate(upcoming.due)}.` : ""
        }`;
        return;
    }

    if (deck.cards.length === 0) {
        elements.stateKicker.textContent = "Mazo vacío";
        elements.stateTitle.textContent = "Añade tu primera tarjeta";
        elements.stateText.textContent =
            "Este mazo aún no tiene nada que repasar. Crea una tarjeta para empezar.";
        elements.stateAction.textContent = "Añadir tarjeta";
        stateActionMode = "add";
        return;
    }

    elements.stateKicker.textContent = "Al día";
    elements.stateTitle.textContent = "Sin repasos pendientes";
    elements.stateText.textContent = upcoming
        ? `El próximo repaso será el ${formatDate(upcoming.due)}.`
        : "No hay repasos programados.";
}

function renderCards(deck) {
    const count = deck.cards.length;
    elements.cardsCount.textContent = `${count} ${count === 1 ? "tarjeta" : "tarjetas"}`;
    elements.cardsEmpty.hidden = count > 0;

    const now = Date.now();
    const items = deck.cards.map((card) => {
        const item = document.createElement("li");
        item.className = "card-item";

        const body = document.createElement("div");
        body.className = "card-item__body";

        const front = document.createElement("p");
        front.className = "card-item__front";
        front.textContent = card.front;

        const back = document.createElement("p");
        back.className = "card-item__back";
        back.textContent = card.back;

        const meta = document.createElement("p");
        meta.className = "card-item__meta";
        const dueLabel =
            card.lastReviewed === null
                ? "Nueva"
                : card.due <= now
                  ? "Pendiente"
                  : `En ${formatInterval((card.due - now) / DAY_MS)}`;
        meta.textContent = `${dueLabel} · ${card.reps} ${card.reps === 1 ? "repaso" : "repasos"}`;

        body.append(front, back, meta);

        const actions = document.createElement("div");
        actions.className = "card-item__actions";

        const edit = document.createElement("button");
        edit.type = "button";
        edit.className = "btn btn--small";
        edit.textContent = "Editar";
        edit.setAttribute("aria-label", `Editar tarjeta: ${card.front}`);
        edit.addEventListener("click", () => startEdit(card.id));

        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "btn btn--small btn--danger-quiet";
        remove.textContent = "Eliminar";
        remove.setAttribute("aria-label", `Eliminar tarjeta: ${card.front}`);
        remove.addEventListener("click", () => {
            askConfirm({
                title: "Eliminar tarjeta",
                text: `Se eliminará la tarjeta «${card.front}». Esta acción no se puede deshacer.`,
                acceptLabel: "Eliminar tarjeta",
                action: () => deleteCard(card.id),
            });
        });

        actions.append(edit, remove);
        item.append(body, actions);
        return item;
    });

    elements.cardList.replaceChildren(...items);
}

function renderAll() {
    const deck = activeDeck();
    if (!deck) return;

    renderDeckHeader(deck);
    renderDeckList();
    renderRail(deck);
    renderStudy(deck);
    renderCards(deck);
    updateStorageStatus();
}

function selectView(nextView) {
    view = nextView;

    elements.tabs.forEach((tab) => {
        const active = tab.dataset.view === nextView;
        tab.setAttribute("aria-selected", String(active));
        tab.tabIndex = active ? 0 : -1;
    });

    elements.studyView.hidden = nextView !== "study";
    elements.cardsView.hidden = nextView !== "cards";

    if (nextView === "study") {
        const deck = activeDeck();
        if (deck) renderStudy(deck);
    } else {
        const deck = activeDeck();
        if (deck) renderCards(deck);
    }
}

function selectDeck(id) {
    const changed = state.activeDeckId !== id;
    state.activeDeckId = id;

    if (changed) {
        saveState();
        resetCardForm();
        startSession();
    }

    selectView("study");
    renderAll();
}

function selectCardForm() {
    elements.cardStatus.textContent = "";
    selectView("cards");
}

function startEdit(id) {
    const card = activeDeck().cards.find((item) => item.id === id);
    if (!card) return;

    editingCardId = id;
    elements.cardFormTitle.textContent = "Editar tarjeta";
    elements.frontInput.value = card.front;
    elements.backInput.value = card.back;
    elements.cardSubmit.textContent = "Guardar cambios";
    elements.cardCancel.hidden = false;
    selectCardForm();
    elements.frontInput.focus();
}

function resetCardForm() {
    editingCardId = null;
    elements.cardForm.reset();
    elements.cardFormTitle.textContent = "Añadir tarjeta";
    elements.cardSubmit.textContent = "Añadir tarjeta";
    elements.cardCancel.hidden = true;
    elements.cardStatus.textContent = "";
}

function deleteCard(id) {
    const deck = activeDeck();
    deck.cards = deck.cards.filter((card) => card.id !== id);

    if (editingCardId === id) resetCardForm();
    saveState();
    startSession();
    renderAll();
    elements.cardStatus.textContent = "Tarjeta eliminada.";
}

function askConfirm({ title, text, acceptLabel, action }) {
    pendingConfirm = action;
    elements.confirmTitle.textContent = title;
    elements.confirmText.textContent = text;
    elements.confirmAccept.textContent = acceptLabel;
    elements.confirmDialog.returnValue = "cancel";

    if (elements.confirmDialog.open) elements.confirmDialog.close();
    elements.confirmDialog.showModal();
}

function revealAnswer() {
    if (session.queue.length === 0 || session.revealed) return;

    session.revealed = true;
    renderStudy(activeDeck());
    elements.reviewCard.focus();
}

function applyGrade(grade) {
    if (!session.revealed || session.queue.length === 0) return;

    const deck = activeDeck();
    const id = session.queue[0];
    const index = deck.cards.findIndex((card) => card.id === id);

    if (index === -1) {
        session.queue.shift();
        renderAll();
        return;
    }

    deck.cards[index] = scheduleCard(deck.cards[index], grade, Date.now());
    session.revealed = false;

    if (grade === "again") {
        session.queue.shift();
        session.queue.push(id);
    } else {
        session.queue.shift();
        session.completed += 1;
    }

    saveState();
    renderAll();

    if (session.queue.length > 0) elements.reveal.focus();
    else elements.stateAction.focus();
}

elements.newDeckToggle.addEventListener("click", () => {
    const willOpen = elements.newDeckForm.hidden;
    elements.newDeckForm.hidden = !willOpen;
    if (willOpen) elements.newDeckName.focus();
});

elements.newDeckCancel.addEventListener("click", () => {
    elements.newDeckForm.reset();
    elements.newDeckForm.hidden = true;
    elements.newDeckToggle.focus();
});

elements.newDeckForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = elements.newDeckName.value.trim();

    if (name === "") {
        elements.newDeckName.focus();
        return;
    }

    const deck = { id: makeId("deck"), name, cards: [] };
    state.decks.push(deck);
    state.activeDeckId = deck.id;
    saveState();
    elements.newDeckForm.reset();
    elements.newDeckForm.hidden = true;
    resetCardForm();
    startSession();
    selectView("study");
    renderAll();
});

elements.deleteDeck.addEventListener("click", () => {
    const deck = activeDeck();
    if (state.decks.length <= 1) return;

    askConfirm({
        title: "Eliminar mazo",
        text: `Se eliminarán «${deck.name}» y sus ${deck.cards.length} tarjetas. Esta acción no se puede deshacer.`,
        acceptLabel: "Eliminar mazo",
        action: () => {
            state.decks = state.decks.filter((item) => item.id !== deck.id);
            state.activeDeckId = state.decks[0].id;
            saveState();
            resetCardForm();
            startSession();
            selectView("study");
            renderAll();
        },
    });
});

elements.tabs.forEach((tab) => {
    tab.addEventListener("click", () => selectView(tab.dataset.view));
    tab.addEventListener("keydown", (event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

        event.preventDefault();
        const index = elements.tabs.indexOf(tab);
        const offset = event.key === "ArrowRight" ? 1 : -1;
        const next = elements.tabs[(index + offset + elements.tabs.length) % elements.tabs.length];
        selectView(next.dataset.view);
        next.focus();
    });
});

elements.reveal.addEventListener("click", revealAnswer);

elements.gradeGroup.addEventListener("click", (event) => {
    const button = event.target.closest("[data-grade]");
    if (!button) return;
    applyGrade(button.dataset.grade);
});

elements.stateAction.addEventListener("click", () => {
    selectView("cards");
    if (stateActionMode === "add") elements.frontInput.focus();
});

elements.cardForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const front = elements.frontInput.value.trim();
    const back = elements.backInput.value.trim();

    if (front === "" || back === "") {
        elements.cardStatus.textContent = "Completa el frente y el reverso.";
        (front === "" ? elements.frontInput : elements.backInput).focus();
        return;
    }

    const deck = activeDeck();

    if (editingCardId) {
        const card = deck.cards.find((item) => item.id === editingCardId);
        if (card) {
            card.front = front;
            card.back = back;
        }
        saveState();
        resetCardForm();
        renderAll();
        elements.cardStatus.textContent = "Cambios guardados.";
        return;
    }

    deck.cards.push(createCard(makeId("card"), front, back));
    saveState();
    resetCardForm();
    startSession();
    renderAll();
    selectView("cards");
    elements.cardStatus.textContent = "Tarjeta añadida.";
});

elements.cardCancel.addEventListener("click", () => {
    resetCardForm();
    elements.frontInput.focus();
});

elements.confirmDialog.addEventListener("close", () => {
    const action = pendingConfirm;
    pendingConfirm = null;
    if (elements.confirmDialog.returnValue === "confirm" && action) action();
});

document.addEventListener("keydown", (event) => {
    if (view !== "study" || elements.confirmDialog.open) return;
    if (
        event.target instanceof Element &&
        event.target.closest("input, textarea, select, button, a")
    ) {
        return;
    }
    if (session.queue.length === 0) return;

    if (event.code === "Space" && !session.revealed) {
        event.preventDefault();
        revealAnswer();
        return;
    }

    if (!session.revealed) return;

    const grades = { 1: "again", 2: "hard", 3: "good", 4: "easy" };
    const grade = grades[event.key];

    if (grade) {
        event.preventDefault();
        applyGrade(grade);
    }
});

document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
});

const initialDeck = activeDeck();
if (initialDeck && initialDeck.id !== state.activeDeckId) {
    state.activeDeckId = initialDeck.id;
}

startSession();
renderAll();
selectView("study");
updateStorageStatus();
