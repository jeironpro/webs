import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";
import {
    contarSoluciones,
    crearRng,
    esSolucionValida,
    generarPuzzle,
    resolverPorLogica,
} from "../juego-tango/js/tango-core.js";

const { tableros } = JSON.parse(
    readFileSync(new URL("../juego-tango/json/tableros.json", import.meta.url), "utf8")
);

describe("tableros de Tango", () => {
    test("hay 20 tableros de 6×6", () => {
        expect(tableros).toHaveLength(20);
        for (const tablero of tableros) {
            expect(tablero.n).toBe(6);
            expect(tablero.solucion).toHaveLength(36);
        }
    });

    test("cada solución cumple las reglas", () => {
        for (const tablero of tableros) {
            expect(esSolucionValida(tablero.n, tablero.solucion), tablero.id).toBe(true);
        }
    });

    test("las pistas coinciden con la solución", () => {
        for (const tablero of tableros) {
            const { n, solucion, dados, relaciones } = tablero;
            expect(dados.length, tablero.id).toBeGreaterThanOrEqual(4);
            expect(relaciones.length, tablero.id).toBeGreaterThanOrEqual(3);
            for (const { i, v } of dados) expect(solucion[i], tablero.id).toBe(v);
            for (const { a, b, tipo } of relaciones) {
                expect(
                    tipo === "=" ? solucion[a] === solucion[b] : solucion[a] !== solucion[b]
                ).toBe(true);
                const vecinos =
                    (Math.abs(Math.floor(a / n) - Math.floor(b / n)) === 1 && a % n === b % n) ||
                    (Math.abs((a % n) - (b % n)) === 1 && Math.floor(a / n) === Math.floor(b / n));
                expect(vecinos, tablero.id).toBe(true);
            }
        }
    });

    test("cada tablero tiene solución única y resoluble por lógica", () => {
        for (const tablero of tableros) {
            const { n, dados, relaciones } = tablero;
            expect(contarSoluciones(n, dados, relaciones), tablero.id).toBe(1);
            expect(resolverPorLogica(n, dados, relaciones), tablero.id).not.toBeNull();
        }
    });

    test("hay variedad de soluciones", () => {
        const claves = new Set(tableros.map((tablero) => tablero.solucion.join("")));
        expect(claves.size).toBeGreaterThanOrEqual(15);
    });
});

describe("generador de Tango", () => {
    test("es determinista con la misma semilla", () => {
        const a = generarPuzzle(crearRng(4242), 6);
        const b = generarPuzzle(crearRng(4242), 6);
        expect(a).toEqual(b);
    });

    test("rechaza soluciones inválidas", () => {
        const todasSoles = Array(36).fill(1);
        expect(esSolucionValida(6, todasSoles)).toBe(false);

        const triple = Array(36).fill(0);
        for (let c = 0; c < 6; c++) {
            triple[c] = 1;
            triple[6 + c] = 1;
            triple[12 + c] = 1;
        }
        expect(esSolucionValida(6, triple)).toBe(false);
    });
});
