import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";
import { contarSoluciones, esSolucion } from "../juego-zip/js/zip-core.js";

const datos = JSON.parse(
    readFileSync(fileURLToPath(new URL("../juego-zip/json/tableros.json", import.meta.url)), "utf8")
);

const RANGO_NUMEROS = { 6: [5, 8], 7: [6, 9], 8: [7, 10] };

describe("tableros de Zip", () => {
    test("incluye los tres tamaños y al menos quince tableros de cada uno", () => {
        for (const n of [6, 7, 8]) {
            const delTamano = datos.tableros.filter((t) => t.n === n);
            expect(delTamano.length, `tableros ${n}x${n}`).toBeGreaterThanOrEqual(15);
        }
    });

    test("cada tablero respeta su rango de números y hay variedad", () => {
        for (const tablero of datos.tableros) {
            const [minimo, maximo] = RANGO_NUMEROS[tablero.n];
            const cantidad = tablero.numeros.length;
            expect(cantidad, tablero.id).toBeGreaterThanOrEqual(minimo);
            expect(cantidad, tablero.id).toBeLessThanOrEqual(maximo);
        }
        for (const n of [6, 7, 8]) {
            const cantidades = new Set(
                datos.tableros.filter((t) => t.n === n).map((t) => t.numeros.length)
            );
            expect(cantidades.size, `variedad ${n}x${n}`).toBeGreaterThanOrEqual(3);
        }
    });

    test("cada tablero tiene exactamente una solución", () => {
        for (const tablero of datos.tableros) {
            const { soluciones } = contarSoluciones(tablero, { limite: 2, presupuesto: 400000 });
            expect(soluciones.length, `${tablero.id} soluciones`).toBe(1);
        }
    }, 120000);

    test("la solución guardada cumple todas las reglas", () => {
        for (const tablero of datos.tableros) {
            expect(esSolucion(tablero, tablero.solucion), tablero.id).toBe(true);
        }
    });

    test("rechaza caminos incompletos, repetidos o fuera de orden", () => {
        const [tablero] = datos.tableros;
        const solucion = tablero.solucion;

        expect(esSolucion(tablero, solucion.slice(0, -1))).toBe(false);
        expect(esSolucion(tablero, [...solucion].reverse())).toBe(false);
        expect(esSolucion(tablero, [solucion[0], ...solucion.slice(1, -1), solucion[1]])).toBe(
            false
        );
    });
});
