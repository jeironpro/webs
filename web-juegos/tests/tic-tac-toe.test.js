import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";
import { describe, expect, test } from "vitest";

const fuente = readFileSync(
    fileURLToPath(new URL("../juego-tic-tac-toe/js/bot.js", import.meta.url)),
    "utf8"
);

function cargarBot() {
    const contexto = {};
    runInNewContext(fuente, contexto);
    return contexto.TresEnRayaBot;
}

const tablero = (texto) => [...texto].map((casilla) => (casilla === "." ? "" : casilla));
const aleatorio = (valor) => () => valor;

describe("bot de tres en raya", () => {
    const bot = cargarBot();

    test("detecta las líneas ganadoras y el empate", () => {
        expect(bot.evaluarTablero(tablero("XXX.O.O.."))?.ganador).toBe("X");
        expect(bot.evaluarTablero(tablero("OOO.XX.X."))?.ganador).toBe("O");
        expect(bot.evaluarTablero(tablero("XOXOOXXXO"))?.ganador).toBe(null);
    });

    test("gana si puede cerrar una línea, incluso si también debe bloquear", () => {
        const posicion = tablero("OO.XX....");

        for (const dificultad of ["facil", "medio", "dificil"]) {
            expect(bot.elegirJugadaDelBot(posicion, dificultad, aleatorio(0.99))).toBe(2);
        }
    });

    test("bloquea la victoria inmediata del jugador en todos los niveles", () => {
        const posicion = tablero("XX..O....");

        for (const dificultad of ["facil", "medio", "dificil"]) {
            expect(bot.elegirJugadaDelBot(posicion, dificultad, aleatorio(0.99))).toBe(2);
        }
    });

    test("no modifica el tablero al calcular la jugada", () => {
        const posicion = tablero("XX..O....");
        const copia = [...posicion];

        expect(bot.elegirJugadaDelBot(posicion, "dificil", aleatorio(0.99))).toBe(2);
        expect(posicion).toEqual(copia);
    });
});
