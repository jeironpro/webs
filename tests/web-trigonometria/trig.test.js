import { describe, expect, test } from "vitest";
import {
    exactValues,
    formatAngle,
    formatNumber,
    formatRadians,
    normalizeAngle,
    pointOnCircle,
    quadrantOf,
    toRadians,
    trigValues,
} from "../../web-trigonometria/js/modules/trig.js";

describe("normalizeAngle", () => {
    test("lleva ángulos negativos y vueltas completas a [0, 360)", () => {
        expect(normalizeAngle(-30)).toBe(330);
        expect(normalizeAngle(360)).toBe(0);
        expect(normalizeAngle(725)).toBe(5);
    });

    test("trata valores no finitos como cero", () => {
        expect(normalizeAngle(Number.NaN)).toBe(0);
        expect(normalizeAngle(Infinity)).toBe(0);
    });
});

describe("toRadians", () => {
    test("convierte grados a radianes", () => {
        expect(toRadians(180)).toBeCloseTo(Math.PI, 12);
        expect(toRadians(90)).toBeCloseTo(Math.PI / 2, 12);
    });
});

describe("trigValues", () => {
    test("devuelve los valores exactos de 0° y 180°", () => {
        expect(trigValues(0)).toMatchObject({ sin: 0, cos: 1, tan: 0 });
        expect(trigValues(180)).toMatchObject({ sin: 0, cos: -1, tan: 0 });
    });

    test("calcula 30° sin ruido de coma flotante", () => {
        const values = trigValues(30);
        expect(values.sin).toBeCloseTo(0.5, 12);
        expect(values.cos).toBeCloseTo(Math.sqrt(3) / 2, 12);
        expect(values.tan).toBeCloseTo(1 / Math.sqrt(3), 12);
    });

    test("la tangente no está definida en 90° y 270°", () => {
        expect(trigValues(90).tan).toBeNull();
        expect(trigValues(270).tan).toBeNull();
    });

    test("normaliza el ángulo antes de calcular", () => {
        expect(trigValues(390).sin).toBeCloseTo(0.5, 12);
        expect(trigValues(-90).tan).toBeNull();
    });
});

describe("quadrantOf", () => {
    test("distingue cuadrantes y ejes", () => {
        expect(quadrantOf(0)).toBe("Eje X");
        expect(quadrantOf(45)).toBe("Cuadrante I");
        expect(quadrantOf(90)).toBe("Eje Y");
        expect(quadrantOf(135)).toBe("Cuadrante II");
        expect(quadrantOf(180)).toBe("Eje X");
        expect(quadrantOf(225)).toBe("Cuadrante III");
        expect(quadrantOf(270)).toBe("Eje Y");
        expect(quadrantOf(315)).toBe("Cuadrante IV");
    });
});

describe("pointOnCircle", () => {
    test("sitúa los puntos cardinales", () => {
        expect(pointOnCircle(0)).toEqual({ x: 1, y: 0 });
        const top = pointOnCircle(90);
        expect(top.x).toBeCloseTo(0, 12);
        expect(top.y).toBeCloseTo(1, 12);
        const left = pointOnCircle(180);
        expect(left.x).toBeCloseTo(-1, 12);
        expect(left.y).toBeCloseTo(0, 12);
    });
});

describe("exactValues", () => {
    test("devuelve los valores exactos de 30°", () => {
        expect(exactValues(30)).toEqual({
            sin: "1/2",
            cos: "√3/2",
            tan: "√3/3",
            coords: "(√3/2, 1/2)",
            radians: "π/6",
        });
    });

    test("la tangente exacta no existe en 90° y 270°", () => {
        expect(exactValues(90)).toMatchObject({ cos: "0", tan: null, radians: "π/2" });
        expect(exactValues(270).tan).toBeNull();
    });

    test("normaliza 360° y absorbe el redondeo del arrastre", () => {
        expect(exactValues(360)).toMatchObject({ sin: "0", cos: "1", radians: "0" });
        expect(exactValues(30.04)).not.toBeNull();
        expect(exactValues(30.2)).toBeNull();
    });

    test("devuelve null para ángulos no frecuentes", () => {
        expect(exactValues(37)).toBeNull();
    });
});

describe("formatos", () => {
    test("evita el menos cero", () => {
        expect(formatNumber(-0.0001)).toBe("0.000");
        expect(formatNumber(0.5)).toBe("0.500");
    });

    test("formatea ángulos normalizados", () => {
        expect(formatAngle(360)).toBe("0°");
        expect(formatAngle(45.25)).toBe("45.3°");
        expect(formatAngle(-30)).toBe("330°");
    });

    test("formatea radianes con tres decimales", () => {
        expect(formatRadians(180)).toBe("3.142 rad");
        expect(formatRadians(360)).toBe("0 rad");
    });
});
