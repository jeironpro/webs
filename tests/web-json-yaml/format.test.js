import { describe, expect, test } from "vitest";
import yaml from "../../web-json-yaml/vendor/js-yaml.mjs";
import {
    countKeys,
    errorContext,
    formatJson,
    formatYaml,
    lineTextAt,
    minifyJson,
    positionToLineColumn,
    sortKeysDeep,
    validateYaml,
} from "../../web-json-yaml/js/modules/format.js";

describe("positionToLineColumn", () => {
    test("traduce un desplazamiento a línea y columna", () => {
        const text = '{\n  "a": 1\n}';
        expect(positionToLineColumn(text, 0)).toEqual({ line: 1, column: 1 });
        expect(positionToLineColumn(text, 4)).toEqual({ line: 2, column: 3 });
        expect(positionToLineColumn(text, text.length)).toEqual({ line: 3, column: 2 });
    });

    test("recorta posiciones fuera del texto", () => {
        expect(positionToLineColumn("abc", 99)).toEqual({ line: 1, column: 4 });
        expect(positionToLineColumn("abc", -5)).toEqual({ line: 1, column: 1 });
    });
});

describe("lineTextAt y errorContext", () => {
    test("devuelve la línea pedida", () => {
        expect(lineTextAt("uno\ndos\ntres", 2)).toBe("dos");
        expect(lineTextAt("uno", 9)).toBe("");
    });

    test("marca la columna con un caret", () => {
        expect(errorContext('{\n  "a":\n}', { line: 2, column: 6 })).toBe('  "a":\n     ^');
    });
});

describe("countKeys", () => {
    test("cuenta claves anidadas y de arrays", () => {
        expect(countKeys({ a: 1, b: { c: 2, d: { e: 3 } }, f: [{ g: 4 }] })).toBe(7);
        expect(countKeys([])).toBe(0);
        expect(countKeys(null)).toBe(0);
        expect(countKeys("texto")).toBe(0);
    });
});

describe("sortKeysDeep", () => {
    test("ordena claves en todos los niveles sin mutar el original", () => {
        const original = { b: 1, a: { d: 2, c: [{ f: 3, e: 4 }] } };
        const sorted = sortKeysDeep(original);
        expect(Object.keys(sorted)).toEqual(["a", "b"]);
        expect(Object.keys(sorted.a)).toEqual(["c", "d"]);
        expect(Object.keys(sorted.a.c[0])).toEqual(["e", "f"]);
        expect(Object.keys(original)).toEqual(["b", "a"]);
    });
});

describe("formatJson", () => {
    test("formatea con la sangría indicada", () => {
        const result = formatJson('{"a":1,"b":[2]}', { indent: 4 });
        expect(result.ok).toBe(true);
        expect(result.output).toBe('{\n    "a": 1,\n    "b": [\n        2\n    ]\n}');
        expect(result.keys).toBe(2);
        expect(result.lines).toBe(6);
    });

    test("ordena claves cuando se pide", () => {
        const result = formatJson('{"b":1,"a":2}', { sortKeys: true });
        expect(result.output).toBe('{\n  "a": 2,\n  "b": 1\n}');
    });

    test("informa del error con línea y columna", () => {
        const result = formatJson('{\n  "a": 1,\n}', {});
        expect(result.ok).toBe(false);
        expect(result.error.line).toBe(3);
        expect(result.error.column).toBe(1);
        expect(result.error.message).toContain("JSON");
    });

    test("trata el documento vacío como error", () => {
        const result = formatJson("", {});
        expect(result.ok).toBe(false);
        expect(result.error).toMatchObject({ line: 1, column: 1 });
    });
});

describe("minifyJson", () => {
    test("elimina espacios y saltos de línea", () => {
        const result = minifyJson('{\n  "a": 1,\n  "b": [2, 3]\n}', {});
        expect(result.output).toBe('{"a":1,"b":[2,3]}');
    });

    test("ordena claves antes de minificar", () => {
        expect(minifyJson('{"b":1,"a":2}', { sortKeys: true }).output).toBe('{"a":2,"b":1}');
    });
});

describe("validateYaml", () => {
    test("acepta un documento válido y cuenta claves", () => {
        const result = validateYaml("a: 1\nb:\n  c: 2\n", yaml);
        expect(result.ok).toBe(true);
        expect(result.keys).toBe(3);
    });

    test("informa del error con línea y columna", () => {
        const result = validateYaml("a: 1\n b: 2\n", yaml);
        expect(result.ok).toBe(false);
        expect(result.error.line).toBeGreaterThan(0);
        expect(result.error.column).toBeGreaterThan(0);
        expect(result.error.message.length).toBeGreaterThan(0);
    });

    test("falla de forma controlada sin analizador", () => {
        const result = validateYaml("a: 1", null);
        expect(result.ok).toBe(false);
        expect(result.error.internal).toBe(true);
    });
});

describe("formatYaml", () => {
    test("produce YAML que vuelve a parsearse igual", () => {
        const source = '{"b":1,"a":{"c":[1,2]}}';
        const parsed = JSON.parse(source);
        const result = formatYaml(source, yaml, { sortKeys: true });
        expect(result.ok).toBe(true);
        expect(yaml.load(result.output)).toEqual(parsed);
        expect(result.output.startsWith("a:")).toBe(true);
    });

    test("propaga el error de validación", () => {
        const result = formatYaml("a: [1, 2", yaml, {});
        expect(result.ok).toBe(false);
        expect(result.error.line).toBeGreaterThan(0);
    });
});
