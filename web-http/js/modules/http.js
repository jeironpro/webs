/** Convert editable header rows into a plain object, skipping empty entries. */
export function headersFromRows(rows) {
    const headers = {};

    rows.forEach((row) => {
        const key = String(row.key ?? "").trim();
        const value = String(row.value ?? "").trim();
        if (key === "" || value === "") return;
        headers[key] = value;
    });

    return headers;
}

/** Pretty-print a JSON request body and report parse errors. */
export function formatJsonBody(text) {
    if (String(text ?? "").trim() === "") {
        return { ok: false, error: "El cuerpo está vacío." };
    }

    try {
        return {
            ok: true,
            output: JSON.stringify(JSON.parse(text), null, 2),
        };
    } catch (error) {
        return { ok: false, error: `JSON no válido: ${error.message}` };
    }
}

/** Choose a readable representation for a response body. */
export function formatResponseBody(text, contentType = "") {
    const body = String(text ?? "");
    if (body === "") return { kind: "empty", text: "(respuesta vacía)" };

    if (/^(image|audio|video)\/|application\/octet-stream/i.test(contentType)) {
        return {
            kind: "binary",
            text: `Contenido binario · ${contentType}`,
        };
    }

    const looksJson = /json/i.test(contentType) || /^\s*[[{]/.test(body);
    if (looksJson) {
        try {
            return { kind: "json", text: JSON.stringify(JSON.parse(body), null, 2) };
        } catch {
            return { kind: "text", text: body };
        }
    }

    return { kind: "text", text: body };
}

export function formatBytes(bytes) {
    const value = Math.max(0, Number(bytes) || 0);
    if (value < 1024) return `${value} B`;
    if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
    return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatDuration(milliseconds) {
    const value = Math.max(0, Number(milliseconds) || 0);
    if (value < 1000) return `${Math.round(value)} ms`;
    return `${(value / 1000).toFixed(2)} s`;
}

/** Accept full URLs or bare hosts; local hosts default to http and the rest to https. */
export function normalizeUrl(input) {
    const trimmed = String(input ?? "").trim();
    if (trimmed === "") return "";

    let candidate = trimmed;
    if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)) {
        const local = /^(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?(?:[/?#]|$)/i.test(trimmed);
        candidate = `${local ? "http" : "https"}://${trimmed}`;
    }

    try {
        const url = new URL(candidate);
        if (url.protocol !== "http:" && url.protocol !== "https:") return "";
        return url.href;
    } catch {
        return "";
    }
}
