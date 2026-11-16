import { describe, expect, test } from "vitest";
import {
    formatBytes,
    formatDuration,
    formatJsonBody,
    formatResponseBody,
    headersFromRows,
    normalizeUrl,
} from "../../web-http/js/modules/http.js";
import { DEFAULT_PRESET_ID, PRESETS, getPreset } from "../../web-http/js/modules/presets.js";

describe("headersFromRows", () => {
    test("recorta nombres y valores y descarta filas vacías", () => {
        expect(
            headersFromRows([
                { key: " Accept ", value: " application/json " },
                { key: "", value: "x" },
                { key: "X-Key", value: "" },
            ])
        ).toEqual({ Accept: "application/json" });
        expect(headersFromRows([])).toEqual({});
    });

    test("la última cabecera repetida gana", () => {
        expect(
            headersFromRows([
                { key: "X-Token", value: "uno" },
                { key: "X-Token", value: "dos" },
            ])
        ).toEqual({ "X-Token": "dos" });
    });
});

describe("formatJsonBody", () => {
    test("formatea un cuerpo JSON válido", () => {
        expect(formatJsonBody('{"a":1,"b":[2]}').output).toBe(
            '{\n  "a": 1,\n  "b": [\n    2\n  ]\n}'
        );
    });

    test("informa de un JSON inválido", () => {
        const result = formatJsonBody("{a:1}");
        expect(result.ok).toBe(false);
        expect(result.error).toContain("JSON no válido");
    });

    test("trata un cuerpo vacío como error", () => {
        expect(formatJsonBody("  ")).toMatchObject({ ok: false });
    });
});

describe("formatResponseBody", () => {
    test("embellece JSON según el Content-Type", () => {
        const result = formatResponseBody('{"ok":true}', "application/json; charset=utf-8");
        expect(result).toEqual({ kind: "json", text: '{\n  "ok": true\n}' });
    });

    test("detecta JSON por su forma aunque falte el Content-Type", () => {
        expect(formatResponseBody("[1,2]")).toEqual({
            kind: "json",
            text: "[\n  1,\n  2\n]",
        });
    });

    test("deja el texto intacto si el JSON declarado no se puede leer", () => {
        expect(formatResponseBody("{roto", "application/json")).toEqual({
            kind: "text",
            text: "{roto",
        });
    });

    test("conserva texto plano", () => {
        expect(formatResponseBody("hola", "text/plain")).toEqual({
            kind: "text",
            text: "hola",
        });
    });

    test("resume contenido binario y respuestas vacías", () => {
        expect(formatResponseBody("...", "image/png").kind).toBe("binary");
        expect(formatResponseBody("", "application/json")).toEqual({
            kind: "empty",
            text: "(respuesta vacía)",
        });
    });
});

describe("formatBytes y formatDuration", () => {
    test("presenta bytes en B, KB y MB", () => {
        expect(formatBytes(0)).toBe("0 B");
        expect(formatBytes(512)).toBe("512 B");
        expect(formatBytes(1536)).toBe("1.5 KB");
        expect(formatBytes(2 * 1024 * 1024)).toBe("2.0 MB");
    });

    test("presenta milisegundos o segundos", () => {
        expect(formatDuration(12)).toBe("12 ms");
        expect(formatDuration(1500)).toBe("1.50 s");
    });
});

describe("normalizeUrl", () => {
    test("añade http a hosts locales", () => {
        expect(normalizeUrl("localhost:8000/biblias")).toBe("http://localhost:8000/biblias");
        expect(normalizeUrl("127.0.0.1:8000/pokemones")).toBe("http://127.0.0.1:8000/pokemones");
    });

    test("añade https a dominios públicos", () => {
        expect(normalizeUrl("jsonplaceholder.typicode.com/posts/1")).toBe(
            "https://jsonplaceholder.typicode.com/posts/1"
        );
        expect(normalizeUrl("example.com")).toBe("https://example.com/");
    });

    test("conserva URLs completas y rechaza esquemas no HTTP", () => {
        expect(normalizeUrl(" https://example.com/api?q=1 ")).toBe("https://example.com/api?q=1");
        expect(normalizeUrl("ftp://example.com")).toBe("");
        expect(normalizeUrl("")).toBe("");
    });
});

describe("presets", () => {
    test("incluye presets únicos para el catálogo y una demo", () => {
        const ids = PRESETS.map((preset) => preset.id);
        expect(new Set(ids).size).toBe(ids.length);
        expect(PRESETS.some((preset) => preset.id === DEFAULT_PRESET_ID)).toBe(true);
        expect(
            PRESETS.filter((preset) => preset.group !== "Demo").every((preset) =>
                preset.url.startsWith("http://127.0.0.1:8000/")
            )
        ).toBe(true);
    });

    test("cada preset tiene etiqueta, grupo y nota", () => {
        PRESETS.forEach((preset) => {
            expect(preset.label.length).toBeGreaterThan(0);
            expect(preset.group.length).toBeGreaterThan(0);
            expect(preset.note.length).toBeGreaterThan(0);
            expect(preset.method).toBe("GET");
        });
    });

    test("getPreset devuelve una copia editable", () => {
        const preset = getPreset("pokemon-lista");
        preset.headers[0].value = "secreta";
        expect(getPreset("pokemon-lista").headers[0].value).toBe("");
        expect(getPreset("no-existe")).toBeNull();
    });
});
