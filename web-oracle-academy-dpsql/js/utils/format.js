const UNITS = ["B", "KB", "MB", "GB"];

export function formatSize(bytes) {
    if (!Number.isFinite(bytes) || bytes < 0) {
        return "—";
    }
    let value = bytes;
    let index = 0;
    while (value >= 1024 && index < UNITS.length - 1) {
        value /= 1024;
        index += 1;
    }
    const isInteger = Number.isInteger(value);
    const decimals = index === 0 || value >= 100 || isInteger ? 0 : 1;
    const text = value.toLocaleString("es-ES", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
    return `${text} ${UNITS[index]}`;
}

const READABLE_TYPES = { pdf: "PDF", docx: "DOCX", zip: "ZIP" };

export function readableType(type) {
    return READABLE_TYPES[type] ?? type.toUpperCase();
}
