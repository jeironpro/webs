export const MIN = 1;

export const MAX = 100;

export const MAX_ATTEMPTS = 10;

function randomNumber() {
    return Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
}

export function createGame() {
    let secret = randomNumber();
    let attempts = 0;

    return {
        get secret() {
            return secret;
        },

        startNew() {
            secret = randomNumber();
            attempts = 0;
        },

        evaluate(rawValue) {
            const value = Number(rawValue);
            if (!Number.isInteger(value) || value < MIN || value > MAX) {
                return { ok: false };
            }

            attempts += 1;

            if (value === secret) {
                return { ok: true, result: "win", attempts };
            }

            if (attempts >= MAX_ATTEMPTS) {
                return { ok: true, result: "lose", attempts };
            }

            return {
                ok: true,
                result: value < secret ? "low" : "high",
                attempts,
            };
        },
    };
}
