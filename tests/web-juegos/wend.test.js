import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";
import {
    buscarPalabra,
    contarSoluciones,
    crearRng,
    esCaminoDePalabra,
    generarPuzzle,
    solucionCubreTablero,
    validarTablero,
} from "../../web-juegos/juego-wend/js/wend-core.js";

const { tableros } = JSON.parse(
    readFileSync(
        fileURLToPath(new URL("../../web-juegos/juego-wend/data/tableros.json", import.meta.url)),
        "utf8"
    )
);

const palabras = JSON.parse(
    readFileSync(
        fileURLToPath(new URL("../../web-juegos/juego-wend/data/palabras.json", import.meta.url)),
        "utf8"
    )
);

const diccionario = new Set(palabras);

describe("tableros de Wend", () => {
    test("hay 20 tableros de 6×6 llenos de letras y con cinco palabras", () => {
        expect(tableros).toHaveLength(20);
        for (const tablero of tableros) {
            expect(tablero.n).toBe(6);
            expect(tablero.letras).toHaveLength(36);
            expect(tablero.letras.every((letra) => typeof letra === "string")).toBe(true);
            expect(tablero.letras.every((letra) => letra.length === 1)).toBe(true);
            expect(tablero.muros).toEqual([]);
            expect(tablero.solucion).toHaveLength(5);
            expect(tablero.solucion.map(({ palabra }) => palabra.length)).toEqual([6, 7, 7, 8, 8]);
        }
    });

    test("las cinco palabras cubren las 36 casillas sin solaparse", () => {
        for (const tablero of tableros) {
            expect(solucionCubreTablero(tablero), tablero.id).toBe(true);
            const celdas = tablero.solucion.flatMap((entrada) => entrada.celdas);
            expect(new Set(celdas).size, tablero.id).toBe(36);
            expect(celdas).toHaveLength(36);
            expect(celdas).toHaveLength(
                tablero.solucion.reduce((total, { palabra }) => total + palabra.length, 0)
            );
            for (const { palabra } of tablero.solucion) {
                expect(palabra.length, tablero.id).toBeGreaterThanOrEqual(3);
                expect(palabra.length, tablero.id).toBeLessThanOrEqual(8);
                expect(diccionario.has(palabra), `${tablero.id}: ${palabra}`).toBe(true);
            }
            expect(new Set(tablero.solucion.map(({ palabra }) => palabra)).size, tablero.id).toBe(
                5
            );
        }
    });

    test("cada tablero tiene exactamente una solución", () => {
        for (const tablero of tableros) {
            const { soluciones, agotado } = contarSoluciones(tablero, palabras, {
                limite: 2,
                presupuesto: 300000,
            });
            expect(agotado, tablero.id).toBe(false);
            expect(soluciones.length, tablero.id).toBe(1);
        }
    });

    test("validarTablero acepta los tableros guardados y rechaza una casilla vacía", () => {
        for (const tablero of tableros) {
            expect(validarTablero(tablero, palabras, { presupuesto: 300000 }), tablero.id).toBe(
                true
            );
        }

        const incompleto = {
            ...tableros[0],
            letras: [...tableros[0].letras.slice(0, -1), null],
        };
        expect(validarTablero(incompleto, palabras)).toBe(false);
    });

    test("buscarPalabra acepta la ruta en ambos sentidos y rechaza rutas parciales", () => {
        const tablero = tableros[0];
        const indice = 0;
        const celdas = tablero.solucion[indice].celdas;

        expect(buscarPalabra(tablero, celdas)).toBe(indice);
        expect(buscarPalabra(tablero, [...celdas].reverse())).toBe(indice);
        expect(buscarPalabra(tablero, celdas.slice(0, -1))).toBe(-1);
        expect(buscarPalabra(tablero, [celdas[0], ...celdas.slice(0, -1)])).toBe(-1);
    });

    test("esCaminoDePalabra exige el camino y las letras exactas", () => {
        const tablero = tableros[0];
        const entrada = tablero.solucion[0];

        expect(esCaminoDePalabra(tablero, entrada.palabra, entrada.celdas)).toBe(true);
        expect(esCaminoDePalabra(tablero, entrada.palabra, [...entrada.celdas].reverse())).toBe(
            false
        );
        expect(esCaminoDePalabra(tablero, entrada.palabra, entrada.celdas.slice(0, -1))).toBe(
            false
        );
    });
});

describe("generador de Wend", () => {
    test("es determinista con la misma semilla y produce un tablero lleno y válido", () => {
        const a = generarPuzzle(6, palabras, { rng: crearRng(9187), intentos: 80 });
        const b = generarPuzzle(6, palabras, { rng: crearRng(9187), intentos: 80 });
        expect(a).toEqual(b);
        expect(a).not.toBeNull();
        expect(a.letras).toHaveLength(36);
        expect(a.letras.every((letra) => typeof letra === "string")).toBe(true);
        expect(a.solucion).toHaveLength(5);
        expect(validarTablero(a, palabras, { presupuesto: 300000 })).toBe(true);
    });
});
