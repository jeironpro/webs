import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";
import {
    contarSoluciones,
    crearRng,
    esSolucion,
    formaDe,
    generarPuzzle,
} from "../../web-juegos/juego-patches/js/patches-core.js";

const { tableros } = JSON.parse(
    readFileSync(
        new URL("../../web-juegos/juego-patches/data/tableros.json", import.meta.url),
        "utf8"
    )
);

describe("tableros de Patches", () => {
    test("hay 20 tableros de 6×6", () => {
        expect(tableros).toHaveLength(20);
        for (const tablero of tableros) {
            expect(tablero.n).toBe(6);
            expect(tablero.pistas.length).toBeGreaterThanOrEqual(5);
            expect(tablero.pistas.length).toBeLessThanOrEqual(7);
            expect(tablero.solucion).toHaveLength(tablero.pistas.length);
        }
    });

    test("cada solución cubre el tablero sin solapes", () => {
        for (const tablero of tableros) {
            expect(esSolucion(tablero, tablero.solucion), tablero.id).toBe(true);
        }
    });

    test("cada pista coincide con su retal", () => {
        for (const tablero of tableros) {
            const usadas = new Set();
            for (const pieza of tablero.solucion) {
                const pista = tablero.pistas[pieza.k];
                expect(pista, tablero.id).toBeDefined();
                expect(usadas.has(pieza.k), tablero.id).toBe(false);
                usadas.add(pieza.k);

                expect(pieza.w * pieza.h, tablero.id).toBe(pista.area);
                if (pista.forma !== "libre") {
                    expect(formaDe(pieza.w, pieza.h), tablero.id).toBe(pista.forma);
                }
                const fila = Math.floor(pista.i / tablero.n);
                const columna = pista.i % tablero.n;
                expect(fila >= pieza.r && fila < pieza.r + pieza.h, tablero.id).toBe(true);
                expect(columna >= pieza.c && columna < pieza.c + pieza.w, tablero.id).toBe(true);
            }
            expect(usadas.size, tablero.id).toBe(tablero.pistas.length);
        }
    });

    test("cada tablero tiene solución única", () => {
        for (const tablero of tableros) {
            const { soluciones } = contarSoluciones(tablero, { limite: 2 });
            expect(soluciones.length, tablero.id).toBe(1);
        }
    });

    test("hay variedad de tableros y de formas", () => {
        const claves = new Set(
            tableros.map((tablero) =>
                tablero.pistas.map((pista) => `${pista.i}:${pista.area}`).join("|")
            )
        );
        expect(claves.size).toBeGreaterThanOrEqual(15);

        const formas = new Set(tableros.flatMap((tablero) => tablero.pistas.map((p) => p.forma)));
        expect(formas.has("cuadrada")).toBe(true);
        expect(formas.has("ancha")).toBe(true);
        expect(formas.has("alta")).toBe(true);
    });
});

describe("generador de Patches", () => {
    test("es determinista con la misma semilla", () => {
        const a = generarPuzzle(6, crearRng(6242), { intentos: 400 });
        const b = generarPuzzle(6, crearRng(6242), { intentos: 400 });
        expect(a).toEqual(b);
        expect(a).not.toBeNull();
    });

    test("rechaza soluciones incompletas o con solapes", () => {
        const tablero = tableros[0];
        expect(esSolucion(tablero, [])).toBe(false);

        const solapadas = tablero.solucion.map((pieza, i) =>
            i === 1 ? { ...pieza, r: 0, c: 0 } : pieza
        );
        expect(esSolucion(tablero, solapadas)).toBe(false);

        const areaMala = tablero.solucion.map((pieza, i) =>
            i === 0 ? { ...pieza, w: pieza.w + 1 } : pieza
        );
        expect(esSolucion(tablero, areaMala)).toBe(false);

        const sinPista = tablero.pistas.map((pista) => ({ ...pista, forma: "alta" }));
        expect(esSolucion({ ...tablero, pistas: sinPista }, tablero.solucion)).toBe(false);
    });
});
