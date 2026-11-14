const STORAGE_KEY = "adivina-numero:mejor-record";

export function getBestScore() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw === null) return null;
        const value = JSON.parse(raw);
        return Number.isFinite(value) ? value : null;
    } catch {
        return null;
    }
}

export function saveBestScore(attempts) {
    const previous = getBestScore();
    const isRecord = previous === null || attempts < previous;
    if (isRecord) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(attempts));
        } catch {
            return false;
        }
    }
    return isRecord;
}
