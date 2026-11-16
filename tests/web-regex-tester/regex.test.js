import { describe, expect, test } from "vitest";
import {
    buildSegments,
    compilePattern,
    countGroups,
    findMatches,
    replaceMatches,
} from "../../web-regex-tester/js/modules/regex.js";

describe("compilePattern", () => {
    test("añade la bandera global y conserva las indicadas", () => {
        expect(compilePattern("abc", "im").flags).toBe("gim");
        expect(compilePattern("abc", "g").flags).toBe("g");
    });

    test("lanza un error con un patrón no válido", () => {
        expect(() => compilePattern("(", "")).toThrow(SyntaxError);
    });
});

describe("findMatches", () => {
    test("devuelve una lista vacía sin patrón", () => {
        expect(findMatches("", "", "texto")).toEqual([]);
    });

    test("encuentra todas las coincidencias con índice y grupos", () => {
        const matches = findMatches(String.raw`(\w+)@(\w+)\.com`, "", "a@b.com y c@d.com");
        expect(matches).toHaveLength(2);
        expect(matches[0]).toMatchObject({ value: "a@b.com", index: 0, groups: ["a", "b"] });
        expect(matches[1]).toMatchObject({ value: "c@d.com", index: 10, groups: ["c", "d"] });
    });

    test("respeta la bandera de mayúsculas", () => {
        expect(findMatches("hola", "", "Hola hola")).toHaveLength(1);
        expect(findMatches("hola", "i", "Hola hola")).toHaveLength(2);
    });

    test("respeta la bandera multilínea", () => {
        expect(findMatches("^a", "", "a\nb\na")).toHaveLength(1);
        expect(findMatches("^a", "m", "a\nb\na")).toHaveLength(2);
    });

    test("respeta la bandera dotAll", () => {
        expect(findMatches("a.b", "", "a\nb")).toHaveLength(0);
        expect(findMatches("a.b", "s", "a\nb")).toHaveLength(1);
    });

    test("expone los grupos con nombre", () => {
        const [match] = findMatches("(?<year>\\d{4})-(?<month>\\d{2})", "", "2026-11");
        expect(match.namedGroups).toEqual({ year: "2026", month: "11" });
    });

    test("termina con coincidencias vacías y las cuenta una vez", () => {
        const matches = findMatches("x*", "", "ab");
        expect(matches).toHaveLength(3);
        expect(matches.every((match) => match.value === "")).toBe(true);
    });
});

describe("buildSegments", () => {
    test("separa texto normal y coincidencias", () => {
        const matches = findMatches("b", "", "abc");
        expect(buildSegments("abc", matches)).toEqual([
            { text: "a", match: false },
            { text: "b", match: true },
            { text: "c", match: false },
        ]);
    });

    test("ignora coincidencias vacías y el texto vacío", () => {
        expect(buildSegments("", [])).toEqual([]);
        expect(buildSegments("abc", findMatches("x*", "", "abc"))).toEqual([
            { text: "abc", match: false },
        ]);
    });
});

describe("replaceMatches", () => {
    test("reemplaza todas las coincidencias con referencias a grupos", () => {
        const result = replaceMatches("(\\w+)@(\\w+)", "", "a@b c@d", "$2:$1");
        expect(result).toBe("b:a d:c");
    });

    test("admite grupos con nombre", () => {
        const result = replaceMatches("(?<user>\\w+)@", "", "ana@", "$<user> ");
        expect(result).toBe("ana ");
    });

    test("devuelve el texto intacto sin patrón", () => {
        expect(replaceMatches("", "", "texto", "otro")).toBe("texto");
    });
});

describe("countGroups", () => {
    test("suma los grupos de todas las coincidencias", () => {
        const matches = findMatches("(a)(b)", "", "ab ab");
        expect(countGroups(matches)).toBe(4);
        expect(countGroups([])).toBe(0);
    });
});
