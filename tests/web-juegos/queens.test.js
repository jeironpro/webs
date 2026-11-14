import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";
import {
    contarSoluciones,
    esSolucion,
    regionesValidas,
} from "../../web-juegos/juego-queens/js/queens-core.js";

const datos = JSON.parse(
    readFileSync(
        fileURLToPath(new URL("../../web-juegos/juego-queens/data/tableros.json", import.meta.url))
    )
);

describe("tableros de Queens", () => {
    test("incluye los tres tamaños y al menos quince tableros de cada uno", () => {
        for (const n of [7, 8, 9]) {
            const delTamano = datos.tableros.filter((t) => t.n === n);
            expect(delTamano.length, `tableros ${n}x${n}`).toBeGreaterThanOrEqual(15);
        }
    });

    test("cada tablero tiene n regiones contiguas y no vacías", () => {
        for (const tablero of datos.tableros) {
            expect(tablero.regiones.length, tablero.id).toBe(tablero.n * tablero.n);
            expect(regionesValidas(tablero), `${tablero.id} regiones`).toBe(true);
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

    test("hay variedad de formas entre tableros del mismo tamaño", () => {
        for (const n of [7, 8, 9]) {
            const formas = new Set(
                datos.tableros.filter((t) => t.n === n).map((t) => t.regiones.join(","))
            );
            expect(formas.size, `formas ${n}x${n}`).toBeGreaterThanOrEqual(15);
        }
    });

    test("rechaza soluciones incompletas, repetidas o que se tocan", () => {
        const [tablero] = datos.tableros;
        const solucion = tablero.solucion;

        expect(esSolucion(tablero, solucion.slice(0, -1))).toBe(false);
        expect(esSolucion(tablero, [solucion[0], ...solucion.slice(0, -1)])).toBe(false);

        const fila = Math.floor(solucion[0] / tablero.n);
        const vecina = solucion[1] ?? fila * tablero.n + 1;
        expect(
            esSolucion(tablero, [solucion[0], solucion[0] + 1, vecina, ...solucion.slice(3)])
        ).toBe(false);
    });
});
