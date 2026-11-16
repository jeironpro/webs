import { describe, expect, test } from "vitest";
import {
    DAY_MS,
    buildQueue,
    createCard,
    deckStats,
    formatInterval,
    isDue,
    nextDue,
    scheduleCard,
} from "../../web-flashcards/js/modules/srs.js";

const NOW = Date.UTC(2026, 0, 15, 12, 0, 0);

function card(overrides = {}) {
    return {
        ...createCard("card-1", "  Frente  ", "  Reverso  ", NOW),
        ...overrides,
    };
}

describe("createCard", () => {
    test("crea una tarjeta nueva pendiente y limpia los textos", () => {
        const result = createCard("a", "  ¿Qué es?  ", "  Un ejemplo  ", NOW);
        expect(result).toMatchObject({
            id: "a",
            front: "¿Qué es?",
            back: "Un ejemplo",
            due: NOW,
            interval: 0,
            ease: 2.5,
            reps: 0,
            lastReviewed: null,
        });
    });
});

describe("scheduleCard", () => {
    test("Bien en una tarjeta nueva programa un día", () => {
        const result = scheduleCard(card(), "good", NOW);
        expect(result.interval).toBe(1);
        expect(result.due).toBe(NOW + DAY_MS);
        expect(result.reps).toBe(1);
        expect(result.lastReviewed).toBe(NOW);
    });

    test("Fácil en una tarjeta nueva programa cuatro días y sube la facilidad", () => {
        const result = scheduleCard(card(), "easy", NOW);
        expect(result.interval).toBe(4);
        expect(result.ease).toBeCloseTo(2.65);
        expect(result.reps).toBe(1);
    });

    test("Difícil en una tarjeta nueva programa seis horas y baja la facilidad", () => {
        const result = scheduleCard(card(), "hard", NOW);
        expect(result.interval).toBe(0.25);
        expect(result.due).toBe(NOW + 6 * 60 * 60 * 1000);
        expect(result.ease).toBeCloseTo(2.35);
    });

    test("Otra vez devuelve la tarjeta a diez minutos y cuenta un fallo", () => {
        const result = scheduleCard(card(), "again", NOW);
        expect(result.interval).toBeCloseTo(10 / 1440);
        expect(result.due).toBe(NOW + 10 * 60 * 1000);
        expect(result.lapses).toBe(1);
        expect(result.reps).toBe(0);
        expect(result.ease).toBeCloseTo(2.3);
    });

    test("un repaso correcto multiplica el intervalo por la facilidad", () => {
        const result = scheduleCard(
            card({ interval: 4, ease: 2.5, reps: 3, lastReviewed: NOW - 4 * DAY_MS }),
            "good",
            NOW
        );
        expect(result.interval).toBe(10);
        expect(result.due).toBe(NOW + 10 * DAY_MS);
        expect(result.reps).toBe(4);
    });

    test("Fácil y Difícil ajustan un repaso ya existente", () => {
        const base = card({ interval: 4, ease: 2.5, reps: 3, lastReviewed: NOW - 4 * DAY_MS });
        expect(scheduleCard(base, "easy", NOW).interval).toBeCloseTo(13);
        expect(scheduleCard(base, "hard", NOW).interval).toBeCloseTo(4.8);
    });

    test("la facilidad nunca baja de 1,3", () => {
        let result = card();
        for (let index = 0; index < 10; index += 1) {
            result = scheduleCard(result, "again", NOW + index * 1000);
        }
        expect(result.ease).toBe(1.3);
    });

    test("el intervalo se limita a diez años", () => {
        const result = scheduleCard(
            card({ interval: 3000, ease: 2.5, reps: 8, lastReviewed: NOW - DAY_MS }),
            "good",
            NOW
        );
        expect(result.interval).toBe(3650);
    });

    test("rechaza calificaciones desconocidas", () => {
        expect(() => scheduleCard(card(), "perfect", NOW)).toThrow("calificación");
    });
});

describe("cola y estadísticas", () => {
    test("isDue respeta el instante exacto", () => {
        expect(isDue(card({ due: NOW }), NOW)).toBe(true);
        expect(isDue(card({ due: NOW + 1 }), NOW)).toBe(false);
    });

    test("buildQueue incluye vencidas y nuevas, y excluye el futuro", () => {
        const cards = [
            card({ id: "futura", due: NOW + DAY_MS }),
            card({ id: "nueva", due: NOW, lastReviewed: null }),
            card({ id: "vencida", due: NOW - DAY_MS }),
            card({ id: "tambien", due: NOW - 2 * DAY_MS }),
        ];
        expect(buildQueue(cards, NOW)).toEqual(["tambien", "vencida", "nueva"]);
    });

    test("deckStats separa nuevas, en aprendizaje y maduras", () => {
        const cards = [
            card({ id: "nueva", lastReviewed: null }),
            card({ id: "aprendizaje", interval: 4, lastReviewed: NOW - DAY_MS }),
            card({ id: "madura", interval: 30, lastReviewed: NOW - DAY_MS }),
            card({ id: "futura", interval: 2, due: NOW + DAY_MS, lastReviewed: NOW }),
        ];
        expect(deckStats(cards, NOW)).toEqual({
            total: 4,
            due: 3,
            new: 1,
            learning: 2,
            mature: 1,
        });
    });

    test("nextDue devuelve la futura más cercana", () => {
        const cards = [
            card({ id: "lejos", due: NOW + 10 * DAY_MS }),
            card({ id: "cerca", due: NOW + 2 * DAY_MS }),
            card({ id: "vencida", due: NOW - DAY_MS }),
        ];
        expect(nextDue(cards, NOW).id).toBe("cerca");
        expect(nextDue([card({ due: NOW - 1 })], NOW)).toBeNull();
    });
});

describe("formatInterval", () => {
    test("elige una unidad legible", () => {
        expect(formatInterval(10 / 1440)).toBe("10 min");
        expect(formatInterval(0.25)).toBe("6 h");
        expect(formatInterval(1)).toBe("1 día");
        expect(formatInterval(4.8)).toBe("5 días");
        expect(formatInterval(45)).toBe("2 meses");
        expect(formatInterval(400)).toBe("1 año");
    });
});
