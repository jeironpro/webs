const FACES = 6;

export function roll() {
    return Math.floor(Math.random() * FACES) + 1;
}

export function rollMultiple(count) {
    return Array.from({ length: count }, () => roll());
}

export function sumValues(values) {
    return values.reduce((total, value) => total + value, 0);
}
