import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";
import { contarSoluciones, esSolucion } from "../juego-zip/js/zip-core.js";

const datos = JSON.parse(
    readFileSync(fileURLToPath(new URL("../juego-zip/json/tableros.json", import.meta.url)), "utf8")
);

describe("tableros de Zip", () => {
    test("incluye los tres tamaños y al menos ocho tableros de cada uno", () => {
        for (const n of [6, 7, 8]) {
            const delTamano = datos.tableros.filter((t) => t.n === n);
            expect(delTamano.length, `tableros ${n}x${n}`).toBeGreaterThanOrEqual(8);
        }
    });

    test("cada tablero tiene exactamente una solución", () => {
        for (const tablero of datos.tableros) {
            const { soluciones } = contarSoluciones(tablero, { limite: 2, presupuesto: 400000 });
            expect(soluciones.length, `${tablero.id} soluciones`).toBe(1);
        }
    }, 60000);

    test("la solución guardada cumple todas las reglas", () => {
        for (const tablero of datos.tableros) {
            expect(esSolucion(tablero, tablero.solucion), tablero.id).toBe(true);
        }
    });

    test("rechaza caminos incompletos, repetidos o fuera de orden", () => {
        const [tablero] = datos.tableros;
        const solucion = tablero.solucion;

        expect(esSolucion(tablero, solucion.slice(0, -1))).toBe(false);
        expect(esSolucion(tablero, [solucion[0], ...solucion.slice(1, -1), solucion[1]])).toBe(
            false
        );
        expect(esSolucion(tablero, [...solucion].reverse())).toBe(false);
    });
});
