import { describe, expect, test } from "vitest";
import {
    MAX_LINES,
    MAX_WORDS,
    computeStats,
    computeWordStats,
    diffInline,
    diffLines,
    diffWords,
    isTruncated,
    isWordTruncated,
    splitLines,
    tokenizeWords,
    toUnified,
    toWordDiff,
} from "../../web-diff/js/modules/diff.js";

describe("splitLines", () => {
    test("normaliza CRLF y descarta el salto final", () => {
        expect(splitLines("uno\r\ndos\r\ntres\n")).toEqual(["uno", "dos", "tres"]);
    });

    test("conserva líneas vacías intermedias y trata el texto vacío", () => {
        expect(splitLines("uno\n\ntres")).toEqual(["uno", "", "tres"]);
        expect(splitLines("")).toEqual([]);
    });
});

describe("diffLines", () => {
    test("sin cambios produce filas iguales numeradas", () => {
        const rows = diffLines("a\nb", "a\nb");
        expect(rows).toEqual([
            { type: "equal", left: "a", right: "a", leftNo: 1, rightNo: 1 },
            { type: "equal", left: "b", right: "b", leftNo: 2, rightNo: 2 },
        ]);
    });

    test("detecta una adición al final", () => {
        const rows = diffLines("a", "a\nb");
        expect(rows.map((row) => row.type)).toEqual(["equal", "add"]);
        expect(rows[1]).toMatchObject({ left: null, right: "b", rightNo: 2 });
    });

    test("detecta una eliminación", () => {
        const rows = diffLines("a\nb", "a");
        expect(rows.map((row) => row.type)).toEqual(["equal", "remove"]);
        expect(rows[1]).toMatchObject({ left: "b", right: null, leftNo: 2 });
    });

    test("empareja eliminación y adición contiguas como cambio", () => {
        const rows = diffLines("puerto: 8080", "puerto: 8081");
        expect(rows).toHaveLength(1);
        expect(rows[0]).toMatchObject({
            type: "change",
            left: "puerto: 8080",
            right: "puerto: 8081",
            leftNo: 1,
            rightNo: 1,
        });
    });

    test("resuelve bloques de cambio con distinto número de líneas", () => {
        const rows = diffLines("a\nb\nc", "a\nx\ny\nz");
        expect(rows.map((row) => row.type)).toEqual(["equal", "change", "change", "add"]);
        expect(rows[2]).toMatchObject({ left: "c", right: "y" });
        expect(rows[3]).toMatchObject({ type: "add", right: "z" });
    });

    test("ignora mayúsculas cuando se pide", () => {
        expect(diffLines("Hola", "hola").map((row) => row.type)).toEqual(["change"]);
        expect(diffLines("Hola", "hola", { ignoreCase: true }).map((row) => row.type)).toEqual([
            "equal",
        ]);
    });

    test("ignora espacios y los colapsa cuando se pide", () => {
        expect(
            diffLines("a   b", "a b", { ignoreWhitespace: true }).map((row) => row.type)
        ).toEqual(["equal"]);
        expect(diffLines("a   b", "a b").map((row) => row.type)).toEqual(["change"]);
    });

    test("con un lado vacío devuelve solo adiciones o eliminaciones", () => {
        expect(diffLines("", "a\nb").map((row) => row.type)).toEqual(["add", "add"]);
        expect(diffLines("a\nb", "").map((row) => row.type)).toEqual(["remove", "remove"]);
        expect(diffLines("", "")).toEqual([]);
    });

    test("acota la comparación al límite de líneas", () => {
        const long = Array.from({ length: MAX_LINES + 5 }, (_, index) => `línea ${index}`);
        expect(diffLines(long.join("\n"), long.join("\n"))).toHaveLength(MAX_LINES);
    });

    test("detecta textos por encima del límite", () => {
        const long = Array.from({ length: MAX_LINES + 1 }, () => "x").join("\n");
        expect(isTruncated("a", long)).toBe(true);
        expect(isTruncated("a", "b")).toBe(false);
    });
});

describe("tokenizeWords", () => {
    test("separa palabras con su espacio final y conserva el texto", () => {
        const tokens = tokenizeWords("hola mundo\nfinal");
        expect(tokens).toEqual(["hola ", "mundo\n", "final"]);
        expect(tokens.join("")).toBe("hola mundo\nfinal");
        expect(tokenizeWords("")).toEqual([]);
    });
});

describe("diffWords", () => {
    test("marca la palabra cambiada y conserva el contexto", () => {
        const segments = diffWords("hola mundo", "hola planeta");
        expect(segments).toEqual([
            { type: "equal", text: "hola " },
            { type: "remove", text: "mundo" },
            { type: "add", text: "planeta" },
        ]);
    });

    test("sin cambios devuelve un único segmento igual", () => {
        expect(diffWords("uno dos", "uno dos")).toEqual([{ type: "equal", text: "uno dos" }]);
    });

    test("ignora mayúsculas cuando se pide", () => {
        const cases = diffWords("Hola Mundo", "hola mundo").map((s) => s.type);
        expect(cases).toContain("remove");
        expect(cases).toContain("add");
        expect(
            diffWords("Hola Mundo", "hola mundo", { ignoreCase: true }).map((s) => s.type)
        ).toEqual(["equal"]);
    });

    test("detecta palabras añadidas al final", () => {
        const segments = diffWords("uno dos", "uno dos tres");
        expect(segments.at(-1)).toEqual({ type: "add", text: "tres" });
    });
});

describe("computeWordStats", () => {
    test("cuenta palabras y calcula la similitud", () => {
        const segments = diffWords("uno dos tres", "uno dos cuatro");
        const stats = computeWordStats(segments);
        expect(stats).toMatchObject({ equal: 2, add: 1, remove: 1, total: 4 });
        expect(stats.similarity).toBe(50);
    });

    test("un texto vacío se considera idéntico", () => {
        expect(computeWordStats([]).similarity).toBe(100);
    });
});

describe("toWordDiff", () => {
    test("serializa eliminaciones y adiciones con marcas", () => {
        const segments = diffWords("hola mundo", "hola planeta");
        expect(toWordDiff(segments)).toBe("hola [-mundo-]{+planeta+}");
    });

    test("conserva los espacios fuera de las marcas", () => {
        const segments = diffWords("uno dos", "uno tres");
        expect(toWordDiff(segments)).toBe("uno [-dos-]{+tres+}");
    });
});

describe("isWordTruncated", () => {
    test("detecta textos por encima del límite de palabras", () => {
        const long = "x ".repeat(MAX_WORDS + 1);
        expect(isWordTruncated("a", long)).toBe(true);
        expect(isWordTruncated("a", "b c")).toBe(false);
    });
});

describe("computeStats", () => {
    test("cuenta cada tipo y calcula la similitud", () => {
        const rows = diffLines("a\nb\nc", "a\nx\nc");
        const stats = computeStats(rows);
        expect(stats).toMatchObject({ equal: 2, change: 1, add: 0, remove: 0, total: 3 });
        expect(stats.similarity).toBe(67);
    });

    test("un diff vacío se considera idéntico", () => {
        expect(computeStats([]).similarity).toBe(100);
    });
});

describe("toUnified", () => {
    test("marca iguales, eliminadas, añadidas y cambios", () => {
        const rows = diffLines("a\nb", "a\nc\nd");
        const unified = toUnified(rows, { leftLabel: "viejo", rightLabel: "nuevo" });
        expect(unified).toBe(["--- viejo", "+++ nuevo", " a", "-b", "+c", "+d"].join("\n"));
    });
});

describe("diffInline", () => {
    test("separa prefijo, cambio y sufijo comunes", () => {
        expect(diffInline("puerto: 8080;", "puerto: 8081;")).toEqual({
            prefix: "puerto: 808",
            removed: "0",
            added: "1",
            suffix: ";",
        });
    });

    test("sin prefijo común marca toda la línea", () => {
        expect(diffInline("abc", "xyz")).toEqual({
            prefix: "",
            removed: "abc",
            added: "xyz",
            suffix: "",
        });
    });

    test("con líneas idénticas no marca nada", () => {
        expect(diffInline("igual", "igual")).toEqual({
            prefix: "igual",
            removed: "",
            added: "",
            suffix: "",
        });
    });
});
