const CANDIDATES = [",", ";", "\t"];

/** Count delimiters outside quotes and return the most likely separator. */
export function detectDelimiter(text) {
    const source = String(text ?? "").slice(0, 4096);
    const counts = new Map(CANDIDATES.map((candidate) => [candidate, 0]));
    let quoted = false;

    for (let index = 0; index < source.length; index += 1) {
        const character = source[index];
        if (character === '"') {
            if (quoted && source[index + 1] === '"') {
                index += 1;
                continue;
            }
            quoted = !quoted;
            continue;
        }
        if (quoted) continue;
        if (counts.has(character)) counts.set(character, counts.get(character) + 1);
    }

    let best = ",";
    let bestCount = 0;
    CANDIDATES.forEach((candidate) => {
        const count = counts.get(candidate);
        if (count > bestCount) {
            best = candidate;
            bestCount = count;
        }
    });
    return best;
}

function uniqueHeaders(raw) {
    const seen = new Map();

    return raw.map((value, index) => {
        const base = String(value ?? "").trim() || `Columna ${index + 1}`;
        const key = base.toLowerCase();
        const count = (seen.get(key) ?? 0) + 1;
        seen.set(key, count);
        return count === 1 ? base : `${base} (${count})`;
    });
}

/** Parse CSV text with quoted fields, CRLF and delimiter detection. */
export function parseCsv(text) {
    const source = String(text ?? "").replace(/^\uFEFF/, "");
    if (source.trim() === "") {
        return { ok: false, error: "El archivo está vacío." };
    }

    const delimiter = detectDelimiter(source);
    const rows = [];
    let row = [];
    let field = "";
    let quoted = false;

    const pushRow = () => {
        row.push(field);
        if (row.length > 1 || row[0] !== "") rows.push(row);
        row = [];
        field = "";
    };

    for (let index = 0; index < source.length; index += 1) {
        const character = source[index];

        if (quoted) {
            if (character === '"') {
                if (source[index + 1] === '"') {
                    field += '"';
                    index += 1;
                } else {
                    quoted = false;
                }
            } else {
                field += character;
            }
            continue;
        }

        if (character === '"') {
            quoted = true;
            continue;
        }

        if (character === delimiter) {
            row.push(field);
            field = "";
            continue;
        }

        if (character === "\n") {
            pushRow();
            continue;
        }

        if (character === "\r") {
            if (source[index + 1] === "\n") index += 1;
            pushRow();
            continue;
        }

        field += character;
    }

    if (field !== "" || row.length > 0) pushRow();
    if (rows.length === 0) {
        return { ok: false, error: "No se encontraron filas en el CSV." };
    }

    const headers = uniqueHeaders(rows.shift());
    let width = headers.length;
    rows.forEach((current) => {
        width = Math.max(width, current.length);
    });

    while (headers.length < width) headers.push(`Columna ${headers.length + 1}`);

    const normalized = rows.map((current) => {
        if (current.length === width) return current;
        return [...current, ...Array(width - current.length).fill("")];
    });

    return {
        ok: true,
        headers,
        rows: normalized,
        delimiter,
        warning: quoted ? "Hay una comilla sin cerrar; revisa el final del archivo." : "",
    };
}

/** Remove accents and case so searches work with natural Spanish text. */
export function normalizeSearch(value) {
    return String(value ?? "")
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase();
}

/** Filter rows by a global query and one substring filter per column. */
export function filterRows(rows, headers, { query = "", filters = [] } = {}) {
    const needle = normalizeSearch(query.trim());
    const columnNeedles = headers.map((_, index) => normalizeSearch((filters[index] ?? "").trim()));

    return rows.filter((row) => {
        if (needle !== "" && !row.some((cell) => normalizeSearch(cell).includes(needle))) {
            return false;
        }

        return columnNeedles.every((columnNeedle, index) => {
            if (columnNeedle === "") return true;
            return normalizeSearch(row[index] ?? "").includes(columnNeedle);
        });
    });
}

function numericValue(value) {
    const trimmed = String(value ?? "").trim();
    if (trimmed === "") return null;
    const number = Number(trimmed);
    return Number.isFinite(number) ? number : null;
}

/** Sort rows by a column, keeping empty cells at the end and preserving ties. */
export function sortRows(rows, column, direction = "asc") {
    const multiplier = direction === "desc" ? -1 : 1;
    const indexed = rows.map((row, index) => ({ row, index }));

    indexed.sort((left, right) => {
        const a = left.row[column] ?? "";
        const b = right.row[column] ?? "";

        if (a === "" && b !== "") return 1;
        if (a !== "" && b === "") return -1;
        if (a === "" && b === "") return left.index - right.index;

        const numberA = numericValue(a);
        const numberB = numericValue(b);
        let result;

        if (numberA !== null && numberB !== null) {
            result = numberA - numberB;
        } else {
            result = String(a).localeCompare(String(b), "es", {
                numeric: true,
                sensitivity: "base",
            });
        }

        if (result === 0) return left.index - right.index;
        return result * multiplier;
    });

    return indexed.map((entry) => entry.row);
}

/** Serialize headers and rows as RFC-style CSV, quoting when needed. */
export function toCsv(headers, rows, delimiter = ",") {
    const escape = (value) => {
        const text = String(value ?? "");
        if (text.includes(delimiter) || /["\r\n]/.test(text)) {
            return `"${text.replace(/"/g, '""')}"`;
        }
        return text;
    };

    return [headers, ...rows].map((row) => row.map(escape).join(delimiter)).join("\r\n");
}

/** Return one page and the clamped page number. */
export function paginateRows(rows, page, pageSize) {
    const size = Math.max(1, Number(pageSize) || 25);
    const totalPages = Math.max(1, Math.ceil(rows.length / size));
    const safePage = Math.min(Math.max(1, Number(page) || 1), totalPages);
    const start = (safePage - 1) * size;

    return {
        page: safePage,
        pageSize: size,
        totalPages,
        start,
        rows: rows.slice(start, start + size),
    };
}
