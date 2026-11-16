/**
 * Utilidades de comparación de texto por líneas.
 *
 * El algoritmo es una subsecuencia común más larga (LCS) sobre las líneas
 * normalizadas. Tras la traza, las eliminaciones y adiciones contiguas se
 * emparejan para formar filas de tipo `change`, que es lo que se muestra en
 * la cinta.
 */

/** Límite de líneas por lado para mantener el coste de la matriz acotado. */
export const MAX_LINES = 2000;

/**
 * Divide un texto en líneas normalizando CRLF y descartando el salto final.
 * @param {string} text
 * @returns {string[]}
 */
export function splitLines(text) {
    if (typeof text !== "string" || text === "") return [];
    const normalized = text.replace(/\r\n?/g, "\n");
    const lines = normalized.split("\n");
    if (lines.length > 1 && lines.at(-1) === "") lines.pop();
    return lines;
}

/**
 * Indica si alguno de los textos supera el límite de líneas comparables.
 * @param {string} leftText
 * @param {string} rightText
 * @returns {boolean}
 */
export function isTruncated(leftText, rightText) {
    return splitLines(leftText).length > MAX_LINES || splitLines(rightText).length > MAX_LINES;
}

/**
 * Normaliza una línea según las opciones activas.
 * @param {string} line
 * @param {{ ignoreCase?: boolean, ignoreWhitespace?: boolean }} options
 * @returns {string}
 */
function normalizeLine(line, options) {
    let value = line;
    if (options.ignoreWhitespace) value = value.replace(/\s+/g, " ").trim();
    if (options.ignoreCase) value = value.toLowerCase();
    return value;
}

/**
 * Compara dos textos y devuelve filas alineadas.
 * @param {string} leftText
 * @param {string} rightText
 * @param {{ ignoreCase?: boolean, ignoreWhitespace?: boolean }} [options]
 * @returns {Array<{type: "equal"|"add"|"remove"|"change", left: string|null, right: string|null, leftNo: number|null, rightNo: number|null}>}
 */
export function diffLines(leftText, rightText, options = {}) {
    const left = splitLines(leftText).slice(0, MAX_LINES);
    const right = splitLines(rightText).slice(0, MAX_LINES);
    const leftKeys = left.map((line) => normalizeLine(line, options));
    const rightKeys = right.map((line) => normalizeLine(line, options));

    const width = right.length + 1;
    const matrix = new Int32Array((left.length + 1) * width);

    for (let i = left.length - 1; i >= 0; i--) {
        for (let j = right.length - 1; j >= 0; j--) {
            matrix[i * width + j] =
                leftKeys[i] === rightKeys[j]
                    ? matrix[(i + 1) * width + j + 1] + 1
                    : Math.max(matrix[(i + 1) * width + j], matrix[i * width + j + 1]);
        }
    }

    const rows = [];
    let i = 0;
    let j = 0;

    while (i < left.length && j < right.length) {
        if (leftKeys[i] === rightKeys[j]) {
            rows.push({
                type: "equal",
                left: left[i],
                right: right[j],
                leftNo: i + 1,
                rightNo: j + 1,
            });
            i++;
            j++;
        } else if (matrix[(i + 1) * width + j] >= matrix[i * width + j + 1]) {
            rows.push({ type: "remove", left: left[i], right: null, leftNo: i + 1, rightNo: null });
            i++;
        } else {
            rows.push({ type: "add", left: null, right: right[j], leftNo: null, rightNo: j + 1 });
            j++;
        }
    }

    while (i < left.length) {
        rows.push({ type: "remove", left: left[i], right: null, leftNo: i + 1, rightNo: null });
        i++;
    }

    while (j < right.length) {
        rows.push({ type: "add", left: null, right: right[j], leftNo: null, rightNo: j + 1 });
        j++;
    }

    return pairChanges(rows);
}

/**
 * Convierte bloques contiguos de eliminaciones y adiciones en filas `change`.
 * @param {Array<object>} rows
 * @returns {Array<object>}
 */
function pairChanges(rows) {
    const result = [];

    for (let index = 0; index < rows.length;) {
        if (rows[index].type === "equal") {
            result.push(rows[index]);
            index++;
            continue;
        }

        const removed = [];
        const added = [];

        while (index < rows.length && rows[index].type !== "equal") {
            if (rows[index].type === "remove") removed.push(rows[index]);
            else added.push(rows[index]);
            index++;
        }

        const size = Math.max(removed.length, added.length);
        for (let position = 0; position < size; position++) {
            const from = removed[position];
            const to = added[position];

            if (from && to) {
                result.push({
                    type: "change",
                    left: from.left,
                    right: to.right,
                    leftNo: from.leftNo,
                    rightNo: to.rightNo,
                });
            } else if (from) {
                result.push(from);
            } else {
                result.push(to);
            }
        }
    }

    return result;
}

/**
 * Cuenta los tipos de fila y calcula el porcentaje de líneas sin cambios.
 * @param {Array<{type: string}>} rows
 * @returns {{equal: number, add: number, remove: number, change: number, total: number, similarity: number}}
 */
export function computeStats(rows) {
    const stats = { equal: 0, add: 0, remove: 0, change: 0 };

    rows.forEach((row) => {
        if (row.type in stats) stats[row.type]++;
    });

    const total = rows.length;
    return {
        ...stats,
        total,
        similarity: total === 0 ? 100 : Math.round((stats.equal / total) * 100),
    };
}

/**
 * Genera un diff unificado completo, sin recorte de contexto.
 * @param {Array<object>} rows
 * @param {{ leftLabel?: string, rightLabel?: string }} [labels]
 * @returns {string}
 */
export function toUnified(rows, labels = {}) {
    const { leftLabel = "original", rightLabel = "nueva" } = labels;
    const lines = [`--- ${leftLabel}`, `+++ ${rightLabel}`];

    rows.forEach((row) => {
        if (row.type === "equal") {
            lines.push(` ${row.left ?? ""}`);
        } else if (row.type === "remove") {
            lines.push(`-${row.left ?? ""}`);
        } else if (row.type === "add") {
            lines.push(`+${row.right ?? ""}`);
        } else {
            lines.push(`-${row.left ?? ""}`, `+${row.right ?? ""}`);
        }
    });

    return lines.join("\n");
}

/**
 * Separa el prefijo y el sufijo comunes de dos líneas para resaltar el cambio.
 * @param {string} left
 * @param {string} right
 * @returns {{prefix: string, removed: string, added: string, suffix: string}}
 */
export function diffInline(left, right) {
    if (left === right) return { prefix: left, removed: "", added: "", suffix: "" };

    const max = Math.min(left.length, right.length);
    let start = 0;
    while (start < max && left[start] === right[start]) start++;

    let end = 0;
    while (end < max - start && left[left.length - 1 - end] === right[right.length - 1 - end]) {
        end++;
    }

    return {
        prefix: left.slice(0, start),
        removed: left.slice(start, left.length - end),
        added: right.slice(start, right.length - end),
        suffix: left.slice(left.length - end),
    };
}
