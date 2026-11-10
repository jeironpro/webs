import { describe, expect, test } from "vitest";
import { generarPistasBots, votarBots } from "../juego-farsante/js/farsante-bots.js";

const humanos = [
    { id: "p-1", nombre: "Ana", avatar: 0 },
    { id: "p-2", nombre: "Luis", avatar: 1 },
];
const bots = [
    { id: "bot-1", nombre: "Bot 1", avatar: 2, bot: true },
    { id: "bot-2", nombre: "Bot 2", avatar: 3, bot: true },
];

function partida(extra = {}) {
    return {
        palabra: "paraguas",
        categoria: "Lo cotidiano",
        farsanteIds: ["p-1"],
        eliminados: [],
        rondaActual: 1,
        ...extra,
    };
}

describe("Farsante · bots", () => {
    test("los bots inocentes dan pistas verdaderas y los farsantes, falsas", () => {
        const mesa = [...humanos, ...bots];
        const pistas = generarPistasBots({
            jugadores: mesa,
            partida: partida({ farsanteIds: ["bot-1"] }),
        });

        expect(pistas["bot-1"]).toMatchObject({ correcta: false });
        expect(pistas["bot-2"]).toMatchObject({ correcta: true });
        expect(pistas["bot-2"].texto).not.toBe(pistas["bot-1"].texto);
    });

    test("los bots no votan por sí mismos y un inocente detecta la pista falsa", () => {
        const mesa = [humanos[0], bots[0], bots[1]];
        const votos = votarBots({
            jugadores: mesa,
            partida: partida({ farsanteIds: ["bot-1"] }),
        });

        expect(votos["bot-1"]).not.toBe("bot-1");
        expect(votos["bot-2"]).toBe("bot-1");
        expect(["p-1", "bot-2"]).toContain(votos["bot-1"]);
    });

    test("sin bots no genera pistas ni votos", () => {
        const mesa = humanos;
        expect(generarPistasBots({ jugadores: mesa, partida: partida() })).toEqual({});
        expect(votarBots({ jugadores: mesa, partida: partida() })).toEqual({});
    });
});
