import { describe, expect, test } from "vitest";
import {
    buildOutputs,
    offsetLabel,
    parseDateInput,
    parseTimestamp,
    relativeTime,
    toDatetimeLocal,
} from "../../web-timestamp/js/modules/timestamp.js";

describe("parseTimestamp", () => {
    test("interpreta diez dígitos como segundos", () => {
        const result = parseTimestamp("1780000000");
        expect(result.ok).toBe(true);
        expect(result.unit).toBe("s");
        expect(result.milliseconds).toBe(1780000000000);
        expect(result.date.toISOString()).toBe("2026-05-28T20:26:40.000Z");
    });

    test("interpreta trece dígitos como milisegundos", () => {
        const result = parseTimestamp("1780000000000");
        expect(result.ok).toBe(true);
        expect(result.unit).toBe("ms");
        expect(result.seconds).toBe(1780000000);
    });

    test("admite fechas anteriores a 1970", () => {
        const result = parseTimestamp("-1");
        expect(result.ok).toBe(true);
        expect(result.date.toISOString()).toBe("1969-12-31T23:59:59.000Z");
    });

    test("admite segundos con decimales", () => {
        const result = parseTimestamp("1.5");
        expect(result.ok).toBe(true);
        expect(result.milliseconds).toBe(1500);
    });

    test("rechaza vacío, texto y valores fuera de rango", () => {
        expect(parseTimestamp("")).toEqual({ ok: false, error: "empty" });
        expect(parseTimestamp("ayer")).toEqual({ ok: false, error: "invalid" });
        expect(parseTimestamp("99999999999999999999")).toEqual({ ok: false, error: "range" });
    });

    test("acepta números además de cadenas", () => {
        expect(parseTimestamp(1780000000).unit).toBe("s");
        expect(parseTimestamp(1780000000000).unit).toBe("ms");
    });
});

describe("parseDateInput", () => {
    test("interpreta un datetime-local en la zona local", () => {
        const result = parseDateInput("2026-11-16T05:30:00");
        expect(result.ok).toBe(true);
        expect(result.date.getFullYear()).toBe(2026);
        expect(result.date.getMonth()).toBe(10);
        expect(result.date.getDate()).toBe(16);
        expect(result.date.getHours()).toBe(5);
        expect(result.date.getMinutes()).toBe(30);
    });

    test("rechaza vacío y fechas inválidas", () => {
        expect(parseDateInput("")).toEqual({ ok: false, error: "empty" });
        expect(parseDateInput("no es una fecha")).toEqual({ ok: false, error: "invalid" });
    });
});

describe("toDatetimeLocal", () => {
    test("rellena con ceros y usa la hora local", () => {
        const date = new Date(2026, 0, 2, 3, 4, 5);
        expect(toDatetimeLocal(date)).toBe("2026-01-02T03:04:05");
    });
});

describe("relativeTime", () => {
    const now = new Date("2026-11-16T12:00:00.000Z");

    test("describe el pasado en horas", () => {
        expect(relativeTime(new Date("2026-11-16T10:00:00.000Z"), now)).toBe("hace 2 horas");
    });

    test("describe el futuro en días", () => {
        expect(relativeTime(new Date("2026-11-17T12:00:00.000Z"), now)).toBe("mañana");
    });

    test("trata el mismo instante como ahora", () => {
        expect(relativeTime(now, now)).toBe("ahora mismo");
        expect(relativeTime(new Date(now.getTime() + 400), now)).toBe("ahora mismo");
    });
});

describe("buildOutputs", () => {
    test("devuelve ISO, epoch y desfase coherentes", () => {
        const date = new Date("2026-11-16T05:30:00.000Z");
        const outputs = buildOutputs(date);
        expect(outputs.iso).toBe("2026-11-16T05:30:00.000Z");
        expect(outputs.seconds).toBe("1794807000");
        expect(outputs.milliseconds).toBe("1794807000000");
        expect(outputs.utc).toContain("2026");
        expect(outputs.local.length).toBeGreaterThan(10);
        expect(outputs.offset).toMatch(/^UTC[+-]\d{2}:\d{2}$/);
        expect(outputs.zone.length).toBeGreaterThan(0);
    });
});

describe("offsetLabel", () => {
    test("siempre produce el formato UTC±HH:MM", () => {
        expect(offsetLabel(new Date())).toMatch(/^UTC[+-]\d{2}:\d{2}$/);
    });
});
