const JSON_POSITION = /at position (\d+)/;
const DEFAULT_INDENT = 2;

/** Resolve a zero-based offset into a 1-based line and column. */
export function positionToLineColumn(text, position) {
    const limit = Math.max(0, Math.min(position, text.length));
    const lines = text.slice(0, limit).split("\n");
    return {
        line: lines.length,
        column: lines[lines.length - 1].length + 1,
    };
}

/** Text of a 1-based line, or an empty string when it does not exist. */
export function lineTextAt(text, line) {
    return text.split("\n")[line - 1] ?? "";
}

/** Two-line snippet with a caret under the reported column. */
export function errorContext(text, { line, column }) {
    const source = lineTextAt(text, line).replace(/\t/g, " ");
    const caret = `${" ".repeat(Math.max(0, column - 1))}^`;
    return `${source}\n${caret}`;
}

/** Count every object key, including nested objects and arrays. */
export function countKeys(value) {
    if (Array.isArray(value)) {
        return value.reduce((total, item) => total + countKeys(item), 0);
    }
    if (value !== null && typeof value === "object") {
        return Object.values(value).reduce((total, item) => total + 1 + countKeys(item), 0);
    }
    return 0;
}

/** Return a copy with object keys sorted alphabetically at every level. */
export function sortKeysDeep(value) {
    if (Array.isArray(value)) {
        return value.map((item) => sortKeysDeep(item));
    }
    if (value !== null && typeof value === "object") {
        const entries = Object.keys(value)
            .sort((a, b) => a.localeCompare(b))
            .map((key) => [key, sortKeysDeep(value[key])]);
        return Object.fromEntries(entries);
    }
    return value;
}

function jsonError(text, error) {
    const match = JSON_POSITION.exec(error.message);
    const position = match === null ? 0 : Number.parseInt(match[1], 10);
    const { line, column } = positionToLineColumn(text, position);
    return { ok: false, error: { message: error.message, line, column } };
}

function jsonResult(text, indent, sortKeys, minify) {
    try {
        const parsed = JSON.parse(text);
        const data = sortKeys ? sortKeysDeep(parsed) : parsed;
        const output = minify ? JSON.stringify(data) : JSON.stringify(data, null, indent);
        return {
            ok: true,
            data,
            output,
            keys: countKeys(data),
            lines: output.split("\n").length,
        };
    } catch (error) {
        return jsonError(text, error);
    }
}

/** Parse, optionally sort and pretty-print a JSON document. */
export function formatJson(text, { indent = DEFAULT_INDENT, sortKeys = false } = {}) {
    return jsonResult(text, indent, sortKeys, false);
}

/** Parse, optionally sort and compact a JSON document. */
export function minifyJson(text, { sortKeys = false } = {}) {
    return jsonResult(text, DEFAULT_INDENT, sortKeys, true);
}

/** Validate a YAML document with the js-yaml library injected by the caller. */
export function validateYaml(text, yaml) {
    if (!yaml) {
        return {
            ok: false,
            error: {
                message: "No se pudo cargar el analizador YAML.",
                line: 1,
                column: 1,
                internal: true,
            },
        };
    }

    try {
        const data = yaml.load(text);
        return { ok: true, data, keys: countKeys(data) };
    } catch (error) {
        const mark = error.mark ?? {};
        return {
            ok: false,
            error: {
                message: error.reason ?? error.message,
                line: (mark.line ?? 0) + 1,
                column: (mark.column ?? 0) + 1,
            },
        };
    }
}

/** Validate and pretty-print a YAML document. */
export function formatYaml(text, yaml, { indent = DEFAULT_INDENT, sortKeys = false } = {}) {
    const validation = validateYaml(text, yaml);
    if (!validation.ok) return validation;

    const data = sortKeys ? sortKeysDeep(validation.data) : validation.data;
    const output = yaml.dump(data, {
        indent,
        lineWidth: 100,
        noRefs: true,
        sortKeys: false,
    });

    return {
        ok: true,
        data,
        output,
        keys: countKeys(data),
        lines: output.split("\n").length,
    };
}
