/**
 * Planificador de repetición espaciada inspirado en SM-2.
 * Las tarjetas son objetos inmutables: cada calificación devuelve una copia.
 */

export const DAY_MS = 86_400_000;
export const GRADES = ["again", "hard", "good", "easy"];

const MIN_EASE = 1.3;
const MAX_EASE = 3;
const MAX_INTERVAL = 3650;
const AGAIN_MINUTES = 10;

/** Crea una tarjeta nueva, pendiente para ahora mismo. */
export function createCard(id, front, back, now = Date.now()) {
    return {
        id,
        front: front.trim(),
        back: back.trim(),
        due: now,
        interval: 0,
        ease: 2.5,
        reps: 0,
        lapses: 0,
        lastReviewed: null,
        createdAt: now,
    };
}

/**
 * Aplica una calificación y devuelve la tarjeta reprogramada.
 * @param {object} card
 * @param {"again"|"hard"|"good"|"easy"} grade
 * @param {number} now
 */
export function scheduleCard(card, grade, now = Date.now()) {
    if (!GRADES.includes(grade)) {
        throw new Error("La calificación no es válida.");
    }

    const isNew = card.lastReviewed === null;
    let { interval, ease, reps, lapses } = card;

    if (grade === "again") {
        interval = AGAIN_MINUTES / 1440;
        ease = Math.max(MIN_EASE, ease - 0.2);
        lapses += 1;
        reps = 0;
    } else if (grade === "hard") {
        interval = isNew ? 0.25 : Math.max(1, interval * 1.2);
        ease = Math.max(MIN_EASE, ease - 0.15);
        reps += 1;
    } else if (grade === "good") {
        interval = isNew ? 1 : Math.max(1, interval * ease);
        reps += 1;
    } else {
        interval = isNew ? 4 : Math.max(4, interval * ease * 1.3);
        ease = Math.min(MAX_EASE, ease + 0.15);
        reps += 1;
    }

    interval = Math.min(MAX_INTERVAL, interval);

    return {
        ...card,
        due: now + interval * DAY_MS,
        interval,
        ease,
        reps,
        lapses,
        lastReviewed: now,
    };
}

export function isDue(card, now = Date.now()) {
    return card.due <= now;
}

/** Ids de las tarjetas pendientes, en orden estable de vencimiento. */
export function buildQueue(cards, now = Date.now()) {
    return cards
        .filter((card) => isDue(card, now))
        .sort((a, b) => a.due - b.due)
        .map((card) => card.id);
}

/** Resumen del mazo para la barra lateral. */
export function deckStats(cards, now = Date.now()) {
    return cards.reduce(
        (stats, card) => {
            stats.total += 1;
            if (card.lastReviewed === null) stats.new += 1;
            else if (card.interval >= 21) stats.mature += 1;
            else stats.learning += 1;
            if (isDue(card, now)) stats.due += 1;
            return stats;
        },
        { total: 0, due: 0, new: 0, learning: 0, mature: 0 }
    );
}

/** Primera tarjeta cuyo repaso aún no ha vencido. */
export function nextDue(cards, now = Date.now()) {
    const future = cards.filter((card) => card.due > now).sort((a, b) => a.due - b.due);
    return future[0] ?? null;
}

/** Convierte una intervalo en días a una etiqueta breve. */
export function formatInterval(days) {
    if (!Number.isFinite(days) || days < 0) return "—";

    const minutes = Math.round(days * 1440);
    if (minutes < 60) return `${Math.max(1, minutes)} min`;

    const hours = Math.round(days * 24);
    if (hours < 24) return `${hours} h`;

    const wholeDays = Math.round(days);
    if (wholeDays < 30) return `${wholeDays} ${wholeDays === 1 ? "día" : "días"}`;

    const months = Math.round(days / 30);
    if (months < 12) return `${months} ${months === 1 ? "mes" : "meses"}`;

    const years = Math.max(1, Math.round(days / 365.25));
    return `${years} ${years === 1 ? "año" : "años"}`;
}
