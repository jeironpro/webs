import { describe, expect, test } from "vitest";
import {
    documentStats,
    parseInline,
    parseMarkdown,
    prefixSelection,
    safeHref,
    safeImageSrc,
    wrapSelection,
} from "../../web-markdown/js/modules/markdown.js";

describe("parseInline", () => {
    test("combina texto, negrita, cursiva y código", () => {
        expect(
            parseInline("Hola **mundo** y *matiz* con `code`").map((token) => token.type)
        ).toEqual(["text", "strong", "text", "em", "text", "code"]);
        expect(parseInline("**mundo**")[0].children).toEqual([{ type: "text", text: "mundo" }]);
    });

    test("anida énfasis y tachado", () => {
        const [token] = parseInline("**muy _importante_**");
        expect(token.type).toBe("strong");
        expect(token.children.some((child) => child.type === "em")).toBe(true);
        expect(parseInline("~~fuera~~")[0].type).toBe("delete");
    });

    test("interpreta enlaces y rechaza esquemas peligrosos", () => {
        const [link] = parseInline("[MDN](https://developer.mozilla.org)");
        expect(link.type).toBe("link");
        expect(link.href).toBe("https://developer.mozilla.org");

        const [wiki] = parseInline("[wiki](https://es.wikipedia.org/wiki/JavaScript_(lenguaje))");
        expect(wiki.href).toBe("https://es.wikipedia.org/wiki/JavaScript_(lenguaje)");

        expect(parseInline("[no](javascript:alert(1))")).toHaveLength(1);
        expect(parseInline("[no](javascript:alert(1))")[0].href).toBeNull();
    });

    test("acepta imágenes seguras y deja las inseguras sin src", () => {
        expect(parseInline("![pliego](./assets/pliego.png)")[0]).toMatchObject({
            type: "image",
            src: "./assets/pliego.png",
            alt: "pliego",
        });
        expect(parseInline("![x](data:image/png;base64,aa)")[0].src).toBeNull();
    });

    test("respeta escapes y no interpreta snake_case", () => {
        expect(parseInline("\\*literal\\*")).toEqual([{ type: "text", text: "*literal*" }]);
        expect(parseInline("variable_snake_case")).toEqual([
            { type: "text", text: "variable_snake_case" },
        ]);
    });

    test("deja el marcado no cerrado como texto", () => {
        expect(parseInline("**sin cierre")).toEqual([{ type: "text", text: "**sin cierre" }]);
        expect(parseInline("`código")).toEqual([{ type: "text", text: "`código" }]);
    });
});

describe("safeHref", () => {
    test("permite http, https, mailto, anclas y rutas relativas", () => {
        expect(safeHref("https://example.com")).toBe("https://example.com");
        expect(safeHref("mailto:hola@example.com")).toBe("mailto:hola@example.com");
        expect(safeHref("#seccion")).toBe("#seccion");
        expect(safeHref("./pagina.html")).toBe("./pagina.html");
        expect(safeHref("/rutas/absoluta")).toBe("/rutas/absoluta");
    });

    test("bloquea javascript, data y rutas protocol-relative", () => {
        expect(safeHref("javascript:alert(1)")).toBeNull();
        expect(safeHref("data:text/html,hola")).toBeNull();
        expect(safeHref("//example.com")).toBeNull();
        expect(safeImageSrc("data:image/svg+xml,<svg />")).toBeNull();
    });
});

describe("parseMarkdown", () => {
    test("reconoce encabezados, párrafos y reglas", () => {
        const blocks = parseMarkdown("# Título\n\nUn párrafo.\n\n---");
        expect(blocks.map((block) => block.type)).toEqual(["heading", "paragraph", "hr"]);
        expect(blocks[0]).toMatchObject({ level: 1 });
        expect(blocks[1].children).toEqual([{ type: "text", text: "Un párrafo." }]);
    });

    test("une líneas de un mismo párrafo y separa bloques", () => {
        const blocks = parseMarkdown("uno\ndos\n\n## Dos");
        expect(blocks).toHaveLength(2);
        expect(blocks[0].children).toEqual([{ type: "text", text: "uno dos" }]);
    });

    test("agrupa listas ordenadas y no ordenadas", () => {
        const unordered = parseMarkdown("- uno\n- **dos**");
        expect(unordered[0]).toMatchObject({ type: "list", ordered: false });
        expect(unordered[0].items).toHaveLength(2);

        const ordered = parseMarkdown("1. uno\n2. dos");
        expect(ordered[0]).toMatchObject({ type: "list", ordered: true });
        expect(ordered[0].items).toHaveLength(2);
    });

    test("convierte citas con bloques internos", () => {
        const [quote] = parseMarkdown("> Una cita\n>\n> ## Con título");
        expect(quote.type).toBe("blockquote");
        expect(quote.children.map((block) => block.type)).toEqual(["paragraph", "heading"]);
    });

    test("captura bloques de código sin interpretar su contenido", () => {
        const [code] = parseMarkdown("```js\nconst x = **no**;\n```");
        expect(code).toEqual({ type: "code", language: "js", text: "const x = **no**;" });
    });

    test("un bloque de código sin cierre consume el resto", () => {
        const [code] = parseMarkdown("```\nsin cierre");
        expect(code).toMatchObject({ type: "code", text: "sin cierre" });
    });

    test("normaliza CRLF y tolera texto vacío", () => {
        expect(parseMarkdown("")).toEqual([]);
        expect(parseMarkdown("uno\r\ndos")[0]).toMatchObject({ type: "paragraph" });
    });
});

describe("documentStats", () => {
    test("cuenta palabras, caracteres, líneas y minutos", () => {
        expect(documentStats("uno dos\n\ntres")).toMatchObject({
            words: 3,
            characters: 13,
            lines: 3,
            minutes: 1,
        });
    });

    test("devuelve ceros para un documento vacío", () => {
        expect(documentStats("")).toEqual({ words: 0, characters: 0, lines: 0, minutes: 0 });
    });
});

describe("helpers de selección", () => {
    test("envuelve la selección y conserva el foco en el contenido", () => {
        expect(wrapSelection("hola mundo", 5, 10, "**")).toEqual({
            text: "hola **mundo**",
            selectionStart: 7,
            selectionEnd: 12,
        });
    });

    test("añade y retira prefijos de línea", () => {
        const prefixed = prefixSelection("uno\ndos", 0, 7, "- ");
        expect(prefixed.text).toBe("- uno\n- dos");
        expect(prefixed.selectionStart).toBe(0);
        expect(prefixSelection(prefixed.text, 0, prefixed.text.length, "- ").text).toBe("uno\ndos");
    });

    test("acota selecciones fuera de rango", () => {
        expect(wrapSelection("abc", -2, 99, "*").text).toBe("*abc*");
    });
});
