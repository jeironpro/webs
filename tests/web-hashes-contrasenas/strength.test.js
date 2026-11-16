import { describe, expect, test } from "vitest";
import {
    checkPassword,
    estimateCrackTimes,
    formatSeconds,
} from "../../web-hashes-contrasenas/js/modules/strength.js";

describe("checkPassword", () => {
    test("la contraseña vacía queda en espera", () => {
        const result = checkPassword("");
        expect(result.empty).toBe(true);
        expect(result.score).toBe(0);
        expect(result.label).toBe("Sin contraseña");
        expect(result.crackTimes.every((scenario) => scenario.time === "—")).toBe(true);
    });

    test("detecta las clases de caracteres presentes", () => {
        const result = checkPassword("aA1!");
        const active = result.classes.filter((item) => item.active).map((item) => item.id);
        expect(active).toEqual(["lower", "upper", "digit", "symbol"]);
        expect(result.poolSize).toBe(94);
    });

    test("una contraseña común se marca como muy débil", () => {
        const result = checkPassword("password");
        expect(result.common).toBe(true);
        expect(result.score).toBe(0);
        expect(result.label).toBe("Muy débil");
        expect(result.warnings.join(" ")).toContain("comunes");
        expect(result.crackTimes[0].seconds).toBeLessThan(300);
    });

    test("penaliza secuencias, repeticiones y fechas", () => {
        expect(checkPassword("abcdefgh").warnings.join(" ")).toContain("secuencia");
        expect(checkPassword("aaaaaaaaaaaa").warnings.join(" ")).toContain("Repite");
        expect(checkPassword("Nube-47-Faro-2026").warnings.join(" ")).toContain("año");
    });

    test("una contraseña variada y larga obtiene buena nota", () => {
        const result = checkPassword("Nube-47-Faro");
        expect(result.score).toBe(3);
        expect(result.label).toBe("Fuerte");
        expect(result.warnings).toEqual([]);
        expect(result.entropy).toBeGreaterThan(70);
    });

    test("una frase larga puede llegar a muy fuerte", () => {
        const result = checkPassword("correcto caballo batería grapa");
        expect(result.score).toBe(4);
        expect(result.label).toBe("Muy fuerte");
        expect(result.tips.at(-1)).toContain("gestor");
    });

    test("una frase corta o repetitiva no supera la nota media", () => {
        expect(checkPassword("aA1!").score).toBeLessThanOrEqual(2);
        expect(checkPassword("aaaaaaaaaaaa").score).toBeLessThanOrEqual(2);
        expect(checkPassword("12345678").score).toBeLessThanOrEqual(2);
    });

    test("los tiempos de ataque solo crecen con la entropía", () => {
        const weak = checkPassword("abc12345");
        const strong = checkPassword("Nube-47-Faro");
        expect(strong.entropy).toBeGreaterThan(weak.entropy);
        expect(strong.crackTimes[2].seconds).toBeGreaterThan(weak.crackTimes[2].seconds);
    });
});

describe("formatSeconds", () => {
    test("elige una unidad legible", () => {
        expect(formatSeconds(0.5)).toBe("menos de un segundo");
        expect(formatSeconds(90)).toBe("1,5 min");
        expect(formatSeconds(7200)).toBe("2 h");
        expect(formatSeconds(365.25 * 24 * 60 * 60)).toBe("1 año");
    });

    test("resume duraciones enormes sin desbordar", () => {
        expect(formatSeconds(365.25 * 24 * 60 * 60 * 1000)).toBe("1.000 años");
        expect(formatSeconds(Number.POSITIVE_INFINITY)).toBe("prácticamente imposible");
        expect(formatSeconds(1e18)).toBe("más de 1.000 millones de años");
    });
});

describe("estimateCrackTimes", () => {
    test("devuelve los tres escenarios de ataque ordenados", () => {
        const times = estimateCrackTimes(60);
        expect(times.map((item) => item.id)).toEqual(["online", "server", "gpu"]);
        expect(times[0].seconds).toBeGreaterThan(times[1].seconds);
        expect(times[1].seconds).toBeGreaterThan(times[2].seconds);
        expect(times[0].time).toContain("año");
    });
});
