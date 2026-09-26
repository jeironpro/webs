import { existsSync, readdirSync, readFileSync, unlinkSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";
import { construirJSON, generar, leerProjects, validar } from "../scripts/lib/data.mjs";

const raiz = fileURLToPath(new URL("..", import.meta.url));
const proyectos = leerProjects();

const carpetasLocales = readdirSync(raiz, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((n) => /^web-/.test(n));

describe("projects.yml", () => {
    test("contiene todas las carpetas web-* locales", () => {
        expect(proyectos.length).toBeGreaterThanOrEqual(40);
        expect(carpetasLocales.length).toBe(48);
        expect(proyectos.length).toBe(carpetasLocales.length);
    });

    test("los ids son unicos", () => {
        const ids = proyectos.map((w) => w.id);
        expect(new Set(ids).size).toBe(ids.length);
    });

    test("cada url relativa apunta a una carpeta local", () => {
        proyectos.forEach((w) => {
            const carpeta = fileURLToPath(new URL(w.url, new URL("..", import.meta.url)));
            expect(existsSync(carpeta), w.id).toBe(true);
        });
    });

    test("pasa todas las validaciones de esquema", () => {
        expect(validar(proyectos)).toEqual([]);
    });

    test("destaca al menos una web", () => {
        expect(proyectos.some((w) => w.destacado)).toBe(true);
    });
});

describe("generador", () => {
    test("construye el JSON de salida ordenado", () => {
        const json = construirJSON(proyectos);
        expect(json.total).toBe(proyectos.length);
        expect(json.webs.map((w) => w.titulo)).toEqual(
            [...json.webs.map((w) => w.titulo)].sort((a, b) => a.localeCompare(b, "es"))
        );
    });

    test("escribe el JSON de salida sin errores", () => {
        const tmp = fileURLToPath(new URL("../assets/projects.test.json", import.meta.url));
        const res = generar(tmp);
        expect(res.errores).toBeUndefined();
        const contenido = JSON.parse(readFileSync(tmp, "utf8"));
        expect(contenido.total).toBe(proyectos.length);
        unlinkSync(tmp);
    });
});
