import { describe, expect, test } from "vitest";
import {
    buildTrace,
    calculateAccuracy,
    calculateWpm,
    computeMetrics,
    countCorrect,
    formatClock,
} from "../../web-mecanografia/js/modules/typing.js";

describe("countCorrect", () => {
    test("cuenta solo las posiciones acertadas", () => {
        expect(countCorrect("teclado", "teclado")).toBe(7);
        expect(countCorrect("teclodo", "teclado")).toBe(6);
        expect(countCorrect("te", "teclado")).toBe(2);
    });

    test("trata acentos y mayúsculas como caracteres distintos", () => {
        expect(countCorrect("Pájaro", "pájaro")).toBe(5);
        expect(countCorrect("pajaro", "pájaro")).toBe(5);
    });

    test("tolera textos vacíos", () => {
        expect(countCorrect("", "hola")).toBe(0);
        expect(countCorrect("hola", "")).toBe(0);
    });
});

describe("calculateWpm", () => {
    test("calcula palabras por minuto con la regla de cinco caracteres", () => {
        expect(calculateWpm(250, 60000)).toBe(50);
        expect(calculateWpm(125, 30000)).toBe(50);
        expect(calculateWpm(500, 60000)).toBe(100);
    });

    test("devuelve cero sin tiempo transcurrido", () => {
        expect(calculateWpm(100, 0)).toBe(0);
        expect(calculateWpm(100, -50)).toBe(0);
    });
});

describe("calculateAccuracy", () => {
    test("calcula el porcentaje sobre las pulsaciones acumuladas", () => {
        expect(calculateAccuracy(10, 0)).toBe(100);
        expect(calculateAccuracy(10, 3)).toBe(70);
        expect(calculateAccuracy(3, 1)).toBe(67);
    });

    test("sin pulsaciones parte de cien", () => {
        expect(calculateAccuracy(0, 4)).toBe(100);
        expect(calculateAccuracy(-1, 4)).toBe(100);
    });
});

describe("formatClock", () => {
    test("formatea segundos y minutos con dos dígitos", () => {
        expect(formatClock(0)).toBe("0:00");
        expect(formatClock(1500)).toBe("0:02");
        expect(formatClock(30000)).toBe("0:30");
        expect(formatClock(60000)).toBe("1:00");
    });

    test("nunca muestra tiempos negativos", () => {
        expect(formatClock(-1000)).toBe("0:00");
    });
});

describe("computeMetrics", () => {
    test("combina aciertos, velocidad, precisión y errores", () => {
        const metrics = computeMetrics({
            typed: "teclado",
            target: "teclado",
            elapsedMs: 30000,
            totalTyped: 7,
            mistakes: 0,
        });

        expect(metrics).toEqual({ correct: 7, wpm: 3, accuracy: 100, errors: 0 });
    });

    test("un error acumulado reduce la precisión aunque se corrija", () => {
        const metrics = computeMetrics({
            typed: "teclado",
            target: "teclado",
            elapsedMs: 60000,
            totalTyped: 8,
            mistakes: 1,
        });

        expect(metrics.accuracy).toBe(88);
        expect(metrics.errors).toBe(1);
    });
});

describe("buildTrace", () => {
    test("genera una línea y un área cerrada", () => {
        const trace = buildTrace(
            [
                { elapsed: 0, wpm: 0 },
                { elapsed: 30000, wpm: 60 },
            ],
            60000
        );

        expect(trace.line).toBe("M 0.00 80.00 L 150.00 10.43");
        expect(trace.area.endsWith("Z")).toBe(true);
        expect(trace.peak).toBe(60);
        expect(trace.axisMax).toBe(69);
    });

    test("con un solo punto dibuja la línea pero no el área", () => {
        const trace = buildTrace([{ elapsed: 1000, wpm: 20 }], 30000);
        expect(trace.line.startsWith("M ")).toBe(true);
        expect(trace.area).toBe("");
    });

    test("ignora muestras inválidas y series vacías", () => {
        expect(buildTrace([], 30000)).toEqual({ line: "", area: "", peak: 0, axisMax: 0 });
        expect(
            buildTrace(
                [
                    { elapsed: -1, wpm: 10 },
                    { elapsed: 1000, wpm: Number.NaN },
                ],
                30000
            ).line
        ).toBe("");
    });
});
