import { describe, expect, test } from "vitest";
import {
    CONSENT_KEY,
    EMPTY_TOTALS,
    TOTALS_KEY,
    grantStorageConsent,
    hasStorageConsent,
    normalizeTotals,
    parseStoredTotals,
    readStoredTotals,
    revokeStorageConsent,
    saveStoredTotals,
} from "../../web-gestiona-presupuesto/js/storage.js";

function createStorage(initial = {}) {
    const values = new Map(Object.entries(initial));
    return {
        getItem: (key) => (values.has(key) ? values.get(key) : null),
        setItem: (key, value) => values.set(key, String(value)),
        removeItem: (key) => values.delete(key),
        has: (key) => values.has(key),
    };
}

describe("consentimiento de presupuesto", () => {
    test("guarda y lee el consentimiento", () => {
        const storage = createStorage();
        expect(hasStorageConsent(storage)).toBe(false);
        expect(grantStorageConsent(storage)).toBe(true);
        expect(hasStorageConsent(storage)).toBe(true);
        expect(storage.getItem(CONSENT_KEY)).toBe("granted");
    });

    test("retirar el consentimiento borra también los totales", () => {
        const storage = createStorage({
            [CONSENT_KEY]: "granted",
            [TOTALS_KEY]: JSON.stringify({ incomeCents: 1000, expenseCents: 500 }),
        });
        expect(revokeStorageConsent(storage)).toBe(true);
        expect(storage.has(CONSENT_KEY)).toBe(false);
        expect(storage.has(TOTALS_KEY)).toBe(false);
    });
});

describe("totales del presupuesto", () => {
    test("no escribe nada sin consentimiento", () => {
        const storage = createStorage();
        expect(saveStoredTotals(storage, { incomeCents: 100, expenseCents: 50 })).toBe(false);
        expect(storage.has(TOTALS_KEY)).toBe(false);
    });

    test("guarda y recupera los totales con consentimiento", () => {
        const storage = createStorage({ [CONSENT_KEY]: "granted" });
        expect(saveStoredTotals(storage, { incomeCents: 12345, expenseCents: 6789 })).toBe(true);
        expect(readStoredTotals(storage)).toEqual({ incomeCents: 12345, expenseCents: 6789 });
    });

    test("normaliza importes negativos y decimales", () => {
        expect(normalizeTotals({ incomeCents: -10, expenseCents: "12.6" })).toEqual({
            incomeCents: 0,
            expenseCents: 13,
        });
        expect(normalizeTotals(null)).toEqual(EMPTY_TOTALS);
    });

    test("un JSON corrupto vuelve a cero", () => {
        expect(parseStoredTotals("{roto")).toEqual(EMPTY_TOTALS);
        expect(parseStoredTotals("")).toEqual(EMPTY_TOTALS);
    });

    test("sin consentimiento, la lectura no expone datos guardados", () => {
        const storage = createStorage({
            [TOTALS_KEY]: JSON.stringify({ incomeCents: 900, expenseCents: 100 }),
        });
        expect(readStoredTotals(storage)).toEqual(EMPTY_TOTALS);
    });
});
