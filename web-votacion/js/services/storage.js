const STORAGE_KEY = "lapapeleta:estado:v1";
const STATE_VERSION = 1;

function defaultState() {
    return {
        version: STATE_VERSION,
        parties: [],
        voteId: null,
    };
}

function isSane(state) {
    if (!state || typeof state !== "object") {
        return false;
    }
    if (state.version !== STATE_VERSION) {
        return false;
    }
    if (!Array.isArray(state.parties)) {
        return false;
    }
    return true;
}

export function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return defaultState();
        }
        const state = JSON.parse(raw);
        return isSane(state) ? state : defaultState();
    } catch {
        return defaultState();
    }
}

export function saveState(state) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
        return;
    }
}
