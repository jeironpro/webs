export function normalizeHex(value) {
    let hex = String(value ?? "")
        .trim()
        .replace(/^#/, "");

    if (/^[0-9a-f]{3}$/i.test(hex)) {
        hex = hex
            .split("")
            .map((character) => `${character}${character}`)
            .join("");
    }

    if (!/^[0-9a-f]{6}$/i.test(hex)) return null;
    return `#${hex.toUpperCase()}`;
}

export function hexToRgb(value) {
    const hex = normalizeHex(value);
    if (hex === null) return null;

    return {
        r: Number.parseInt(hex.slice(1, 3), 16),
        g: Number.parseInt(hex.slice(3, 5), 16),
        b: Number.parseInt(hex.slice(5, 7), 16),
    };
}

function linearChannel(channel) {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(value) {
    const rgb = hexToRgb(value);
    if (rgb === null) return null;

    return (
        0.2126 * linearChannel(rgb.r) +
        0.7152 * linearChannel(rgb.g) +
        0.0722 * linearChannel(rgb.b)
    );
}

export function contrastRatio(foreground, background) {
    const first = relativeLuminance(foreground);
    const second = relativeLuminance(background);
    if (first === null || second === null) return null;

    const lighter = Math.max(first, second);
    const darker = Math.min(first, second);
    return (lighter + 0.05) / (darker + 0.05);
}

export function wcagReport(ratio) {
    const value = Number(ratio);
    const safe = Number.isFinite(value) ? Math.max(0, value) : 0;

    return {
        normalAA: safe >= 4.5,
        largeAA: safe >= 3,
        normalAAA: safe >= 7,
        largeAAA: safe >= 4.5,
        uiAA: safe >= 3,
        level: safe >= 7 ? "AAA" : safe >= 4.5 ? "AA" : safe >= 3 ? "AA-large" : "none",
    };
}
