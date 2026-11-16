import { describe, expect, test } from "vitest";
import {
    decodeBase64,
    decodeHtmlEntities,
    decodeUrl,
    encodeBase64,
    encodeHtmlEntities,
    encodeUrl,
    transformText,
} from "../../web-codecs/js/modules/codecs.js";

describe("Base64", () => {
    test("codifica texto ASCII y UTF-8", () => {
        expect(encodeBase64("Hola, mundo 🌍")).toBe("SG9sYSwgbXVuZG8g8J+MjQ==");
        expect(encodeBase64("ñ")).toBe("w7E=");
        expect(encodeBase64("")).toBe("");
    });

    test("decodifica UTF-8 e ignora saltos de línea", () => {
        expect(decodeBase64("SG9sYSwgbXVuZG8g8J+MjQ==")).toBe("Hola, mundo 🌍");
        expect(decodeBase64("SG9s\nYSwg  bXVuZG8=")).toBe("Hola, mundo");
        expect(decodeBase64("")).toBe("");
    });

    test("acepta Base64 sin relleno", () => {
        expect(decodeBase64("w7E")).toBe("ñ");
        expect(decodeBase64("YQ")).toBe("a");
    });

    test("rechaza caracteres y longitudes imposibles", () => {
        expect(() => decodeBase64("no es base64!")).toThrow("Base64 válido");
        expect(() => decodeBase64("YQ===")).toThrow("Base64 válido");
        expect(() => decodeBase64("abcde")).toThrow("Base64 válido");
        expect(() => decodeBase64("YQ-_")).toThrow("Base64 válido");
    });

    test("rechaza bytes que no forman UTF-8", () => {
        expect(() => decodeBase64("/w==")).toThrow("UTF-8 válido");
    });
});

describe("URL", () => {
    test("codifica y decodifica un componente", () => {
        const encoded = encodeUrl("a b&c/ño?x=1");
        expect(encoded).toBe("a%20b%26c%2F%C3%B1o%3Fx%3D1");
        expect(decodeUrl(encoded)).toBe("a b&c/ño?x=1");
    });

    test("la URI completa conserva los separadores", () => {
        const source = "https://ejemplo.com/a b?x=1&y=2";
        expect(encodeUrl(source, { scope: "full" })).toBe("https://ejemplo.com/a%20b?x=1&y=2");
        expect(decodeUrl("https://ejemplo.com/a%20b?x=1&y=2", { scope: "full" })).toBe(source);
    });

    test("avisa de escapes incompletos", () => {
        expect(() => decodeUrl("%E0%A4%A")).toThrow("escape de la URL");
        expect(() => decodeUrl("%ZZ")).toThrow("escape de la URL");
    });
});

describe("entidades HTML", () => {
    test("escapa los cinco caracteres esenciales", () => {
        expect(encodeHtmlEntities('<p class="x">Tom & Jerry\'s</p>')).toBe(
            "&lt;p class=&quot;x&quot;&gt;Tom &amp; Jerry&#39;s&lt;/p&gt;"
        );
    });

    test("convierte todo lo no ASCII en entidades numéricas", () => {
        expect(encodeHtmlEntities("niño 🌍", { scope: "all" })).toBe("ni&#xF1;o &#x1F30D;");
    });

    test("decodifica entidades nombradas y numéricas", () => {
        expect(decodeHtmlEntities("Tom &amp; Jerry &lt;3")).toBe("Tom & Jerry <3");
        expect(decodeHtmlEntities("&laquo;caf&eacute;?&raquo;")).toBe("«café?»");
        expect(decodeHtmlEntities("&#241; &#xF1; &#x1F30D;")).toBe("ñ ñ 🌍");
        expect(decodeHtmlEntities("&nbsp;")).toBe("\u00a0");
    });

    test("hace una sola pasada y conserva lo desconocido", () => {
        expect(decodeHtmlEntities("&amp;lt;")).toBe("&lt;");
        expect(decodeHtmlEntities("&desconocida; &#0; &#x110000;")).toBe(
            "&desconocida; &#0; &#x110000;"
        );
    });

    test("la ida y vuelta conserva el texto", () => {
        const source = "<button title='niño'>5 < 6 & 7 > 2</button> 🌍";
        expect(decodeHtmlEntities(encodeHtmlEntities(source))).toBe(source);
    });
});

describe("transformText", () => {
    test("dirige cada canal en ambos sentidos", () => {
        expect(transformText("hola", "base64", "encode")).toBe("aG9sYQ==");
        expect(transformText("aG9sYQ==", "base64", "decode")).toBe("hola");
        expect(transformText("a b", "url", "encode")).toBe("a%20b");
        expect(transformText("a%20b", "url", "decode")).toBe("a b");
        expect(transformText("<b>", "html", "encode")).toBe("&lt;b&gt;");
        expect(transformText("&lt;b&gt;", "html", "decode")).toBe("<b>");
    });

    test("pasa el alcance a los canales que lo usan", () => {
        expect(transformText("a/b", "url", "encode", { scope: "full" })).toBe("a/b");
        expect(transformText("ñ", "html", "encode", { scope: "all" })).toBe("&#xF1;");
    });

    test("rechaza canales y sentidos desconocidos", () => {
        expect(() => transformText("x", "rot13", "encode")).toThrow("canal");
        expect(() => transformText("x", "url", "lateral")).toThrow("sentido");
    });
});
