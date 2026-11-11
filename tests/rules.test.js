import { describe, expect, test } from "vitest";
import { analizarCss, analizarHtml, analizarJs } from "../scripts/lib/rules.mjs";

/** Reglas detectadas, ordenadas, para comparar de un vistazo. */
const reglasDe = (hallazgos) => hallazgos.map((hallazgo) => hallazgo.regla).sort();

/** Envuelve un fragmento en un documento que ya cumple las reglas de metadatos. */
const documento = (cuerpo) => `<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Prueba</title>
</head>
<body>${cuerpo}</body>
</html>`;

describe("reglas de HTML", () => {
    test("un documento correcto no genera hallazgos", () => {
        const html = `<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Ejemplo</title>
</head>
<body>
    <img src="a.png" alt="Una imagen" />
    <label for="nombre">Nombre</label>
    <input id="nombre" />
    <button type="button">Enviar</button>
</body>
</html>`;
        expect(analizarHtml(html)).toEqual([]);
    });

    test("detecta metadatos y alt ausentes", () => {
        const html = `<html><head><title></title></head><body><img src="a.png" /></body></html>`;
        expect(reglasDe(analizarHtml(html))).toEqual([
            "html-charset",
            "html-img-alt",
            "html-lang",
            "html-title",
            "html-viewport",
        ]);
    });

    test("un campo sin label ni aria-label cuenta, pero con aria-label no", () => {
        const sinLabel = `<input id="correo" />`;
        const conAria = `<input id="correo" aria-label="Correo" />`;
        const oculto = `<input type="hidden" id="token" />`;
        expect(reglasDe(analizarHtml(documento(sinLabel)))).toEqual(["html-control-label"]);
        expect(analizarHtml(documento(conAria))).toEqual([]);
        expect(analizarHtml(documento(oculto))).toEqual([]);
    });

    test("un campo envuelto en <label> está asociado", () => {
        const html = documento(
            `<label><span>Horas</span><input id="horas" type="number" /></label>`
        );
        expect(analizarHtml(html)).toEqual([]);
    });

    test("señala div usado como botón", () => {
        const html = documento(`<div onclick="cerrar()">Cerrar</div>`);
        expect(reglasDe(analizarHtml(html))).toEqual(["html-div-interactivo"]);
    });
});

describe("reglas de CSS", () => {
    test("los tokens de :root no cuentan como colores sueltos", () => {
        const css = `:root { --color-primary: #0a7; }
.card { color: var(--color-primary); }`;
        expect(analizarCss(css)).toEqual([]);
    });

    test("detecta hex fuera de :root, !important y max-width", () => {
        const css = `.a { color: #fff !important; }
@media (max-width: 600px) { .a { color: #000; } }`;
        expect(reglasDe(analizarCss(css))).toEqual([
            "css-hex-suelto",
            "css-hex-suelto",
            "css-important",
            "css-media-max",
        ]);
    });

    test("ignora comentarios", () => {
        const css = `/* .a { color: #fff !important; } */\n.b { color: var(--c); }`;
        expect(analizarCss(css)).toEqual([]);
    });
});

describe("reglas de JavaScript", () => {
    test("código correcto no genera hallazgos", () => {
        const js = `const lista = [1, 2];
let total = 0;
if (lista.length === 2) total += 1;
if (lista == null) total = 0;`;
        expect(analizarJs(js)).toEqual([]);
    });

    test("detecta inyección de HTML, var, igualdad laxa, then y require", () => {
        const js = `var nodo = document.body;
nodo.innerHTML = "<b>hola</b>";
if (nodo === null) nodo = {};
if (nodo.value == 3) cargar().then(() => {});
const fs = require("fs");`;
        expect(reglasDe(analizarJs(js))).toEqual([
            "js-igualdad",
            "js-innerhtml",
            "js-require",
            "js-then",
            "js-var",
        ]);
    });

    test("no confunde cadenas ni comentarios con código", () => {
        const js = `// usar innerHTML está prohibido
const aviso = "no uses innerHTML ni == aquí";
const plantilla = \`var x = 1\`;`;
        expect(analizarJs(js)).toEqual([]);
    });
});
