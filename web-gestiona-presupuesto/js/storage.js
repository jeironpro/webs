export const CONSENT_KEY = "web-gestiona-presupuesto:storage-consent";
export const TOTALS_KEY = "web-gestiona-presupuesto:totals";

export const EMPTY_TOTALS = Object.freeze({ incomeCents: 0, expenseCents: 0 });

function storageOrNull(storage) {
    if (storage) return storage;
    if (typeof window === "undefined") return null;
    try {
        return window.localStorage;
    } catch {
        return null;
    }
}

export function normalizeTotals(value) {
    return {
        incomeCents: Math.max(0, Math.round(Number(value?.incomeCents) || 0)),
        expenseCents: Math.max(0, Math.round(Number(value?.expenseCents) || 0)),
    };
}

export function parseStoredTotals(raw) {
    if (!raw) return { ...EMPTY_TOTALS };

    try {
        return normalizeTotals(JSON.parse(raw));
    } catch {
        return { ...EMPTY_TOTALS };
    }
}

export function hasStorageConsent(storage) {
    const target = storageOrNull(storage);
    if (!target) return false;

    try {
        return target.getItem(CONSENT_KEY) === "granted";
    } catch {
        return false;
    }
}

export function grantStorageConsent(storage) {
    const target = storageOrNull(storage);
    if (!target) return false;

    try {
        target.setItem(CONSENT_KEY, "granted");
        return true;
    } catch {
        return false;
    }
}

export function revokeStorageConsent(storage) {
    const target = storageOrNull(storage);
    if (!target) return false;

    try {
        target.removeItem(CONSENT_KEY);
        target.removeItem(TOTALS_KEY);
        return true;
    } catch {
        return false;
    }
}

export function readStoredTotals(storage) {
    const target = storageOrNull(storage);
    if (!target || !hasStorageConsent(target)) return { ...EMPTY_TOTALS };

    try {
        return parseStoredTotals(target.getItem(TOTALS_KEY));
    } catch {
        return { ...EMPTY_TOTALS };
    }
}

export function saveStoredTotals(storage, totals) {
    const target = storageOrNull(storage);
    if (!target || !hasStorageConsent(target)) return false;

    try {
        target.setItem(TOTALS_KEY, JSON.stringify(normalizeTotals(totals)));
        return true;
    } catch {
        return false;
    }
}
