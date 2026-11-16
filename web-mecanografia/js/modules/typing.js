export function countCorrect(typed, target) {
    const left = String(typed ?? "");
    const right = String(target ?? "");
    const length = Math.min(left.length, right.length);
    let correct = 0;

    for (let index = 0; index < length; index += 1) {
        if (left[index] === right[index]) correct += 1;
    }

    return correct;
}

export function calculateWpm(correctChars, elapsedMs) {
    if (!Number.isFinite(elapsedMs) || elapsedMs <= 0) return 0;
    const minutes = elapsedMs / 60000;
    return Math.max(0, Math.round(correctChars / 5 / minutes));
}

export function calculateAccuracy(totalTyped, mistakes) {
    if (!Number.isFinite(totalTyped) || totalTyped <= 0) return 100;
    const correct = Math.max(0, totalTyped - Math.max(0, mistakes));
    return Math.round((correct / totalTyped) * 100);
}

export function formatClock(ms) {
    const totalSeconds = Math.max(0, Math.ceil((Number(ms) || 0) / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function computeMetrics({
    typed = "",
    target = "",
    elapsedMs = 0,
    totalTyped = 0,
    mistakes = 0,
}) {
    const correct = countCorrect(typed, target);

    return {
        correct,
        wpm: calculateWpm(correct, elapsedMs),
        accuracy: calculateAccuracy(totalTyped, mistakes),
        errors: Math.max(0, mistakes),
    };
}

export function buildTrace(samples, durationMs, options = {}) {
    const width = options.width ?? 300;
    const height = options.height ?? 80;
    const clean = (Array.isArray(samples) ? samples : []).filter(
        (sample) =>
            sample &&
            Number.isFinite(sample.elapsed) &&
            Number.isFinite(sample.wpm) &&
            sample.elapsed >= 0 &&
            sample.wpm >= 0
    );

    if (clean.length === 0) return { line: "", area: "", peak: 0, axisMax: 0 };

    const safeDuration = Math.max(1, Number(durationMs) || 1);
    const peak = Math.max(...clean.map((sample) => sample.wpm));
    const axisMax = Math.max(20, peak * 1.15);
    const points = clean.map((sample) => {
        const x = (Math.min(sample.elapsed, safeDuration) / safeDuration) * width;
        const y = height - (Math.min(sample.wpm, axisMax) / axisMax) * height;
        return [x, y];
    });

    const line = points
        .map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`)
        .join(" ");

    const first = points[0];
    const last = points[points.length - 1];
    const area =
        points.length > 1
            ? `${line} L ${last[0].toFixed(2)} ${height} L ${first[0].toFixed(2)} ${height} Z`
            : "";

    return { line, area, peak: Math.round(peak), axisMax: Math.round(axisMax) };
}
