import { describe, expect, test } from "vitest";
import {
    contrastRatio,
    hexToRgb,
    normalizeHex,
    relativeLuminance,
    wcagReport,
} from "../../web-contraste-wcag/js/modules/contrast.js";

describe("normalizeHex", () => {
    test("acepta códigos con y sin almohadilla y los normaliza", () => {
        expect(normalizeHex("#2563eb")).toBe("#2563EB");
        expect(normalizeHex("  fff  ")).toBe("#FFFFFF");
        expect(normalizeHex("#abc")).toBe("#AABBCC");
    });

    test("rechaza longitudes y caracteres no hexadecimales", () => {
        expect(normalizeHex("#12")).toBeNull();
        expect(normalizeHex("#12345G")).toBeNull();
        expect(normalizeHex("")).toBeNull();
        expect(normalizeHex(null)).toBeNull();
    });
});

describe("hexToRgb", () => {
    test("separa los canales de color", () => {
        expect(hexToRgb("#FF0000")).toEqual({ r: 255, g: 0, b: 0 });
        expect(hexToRgb("2563EB")).toEqual({ r: 37, g: 99, b: 235 });
    });

    test("devuelve null para un color inválido", () => {
        expect(hexToRgb("#GGGGGG")).toBeNull();
    });
});

describe("relativeLuminance", () => {
    test("usa los extremos de la escala sRGB", () => {
        expect(relativeLuminance("#000000")).toBe(0);
        expect(relativeLuminance("#FFFFFF")).toBe(1);
    });

    test("calcula la luminancia del rojo puro", () => {
        expect(relativeLuminance("#FF0000")).toBeCloseTo(0.2126, 4);
    });

    test("devuelve null si el color no es válido", () => {
        expect(relativeLuminance("nope")).toBeNull();
    });
});

describe("contrastRatio", () => {
    test("el blanco y el negro alcanzan 21:1", () => {
        expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 5);
    });

    test("el orden de los colores no altera la relación", () => {
        expect(contrastRatio("#2563EB", "#FFFFFF")).toBeCloseTo(
            contrastRatio("#FFFFFF", "#2563EB"),
            10
        );
    });

    test("calcula un par de tinta y papel conocido", () => {
        expect(contrastRatio("#2563EB", "#FFFFFF")).toBeCloseTo(5.17, 2);
    });

    test("devuelve null si falta un color válido", () => {
        expect(contrastRatio("#FFFFFF", "transparente")).toBeNull();
    });
});

describe("wcagReport", () => {
    test("7:1 cumple AAA para texto normal y grande", () => {
        expect(wcagReport(7)).toMatchObject({
            normalAA: true,
            largeAA: true,
            normalAAA: true,
            largeAAA: true,
            uiAA: true,
            level: "AAA",
        });
    });

    test("4.5:1 cumple AA normal y AAA grande, pero no AAA normal", () => {
        expect(wcagReport(4.5)).toMatchObject({
            normalAA: true,
            normalAAA: false,
            largeAAA: true,
            level: "AA",
        });
    });

    test("3:1 solo alcanza AA para texto grande y componentes", () => {
        expect(wcagReport(3)).toMatchObject({
            normalAA: false,
            largeAA: true,
            uiAA: true,
            level: "AA-large",
        });
    });

    test("por debajo de 3:1 no cumple ningún criterio", () => {
        expect(wcagReport(2.99)).toMatchObject({
            normalAA: false,
            largeAA: false,
            normalAAA: false,
            largeAAA: false,
            uiAA: false,
            level: "none",
        });
    });

    test("trata ratios inválidos como cero", () => {
        expect(wcagReport(null).level).toBe("none");
        expect(wcagReport(Number.NaN).normalAA).toBe(false);
    });
});
