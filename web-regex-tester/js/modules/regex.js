const GLOBAL_FLAG = "g";

/**
 * Compile a pattern with the user selected flags plus the global flag.
 * Throws a SyntaxError when the expression is not valid.
 */
export function compilePattern(source, flags = "") {
    const normalized = flags.includes(GLOBAL_FLAG) ? flags : `${flags}${GLOBAL_FLAG}`;
    return new RegExp(source, normalized);
}

/**
 * Return every match of the pattern in the text. Zero-length matches are
 * counted once and the scanner advances so the loop always terminates.
 */
export function findMatches(source, flags, text) {
    if (source === "") return [];

    const expression = compilePattern(source, flags);
    const matches = [];
    let result = expression.exec(text);

    while (result !== null) {
        matches.push({
            value: result[0],
            index: result.index,
            groups: result.slice(1),
            namedGroups: result.groups ?? {},
        });

        if (result[0] === "") expression.lastIndex += 1;
        result = expression.exec(text);
    }

    return matches;
}

/**
 * Split the text into ordered segments so the UI can highlight matches
 * without injecting HTML. Zero-length matches are ignored for rendering.
 */
export function buildSegments(text, matches) {
    const visible = matches.filter((match) => match.value !== "").sort((a, b) => a.index - b.index);

    if (visible.length === 0) {
        return text === "" ? [] : [{ text, match: false }];
    }

    const segments = [];
    let cursor = 0;

    for (const match of visible) {
        if (match.index < cursor) continue;
        if (match.index > cursor) {
            segments.push({ text: text.slice(cursor, match.index), match: false });
        }
        segments.push({ text: match.value, match: true });
        cursor = match.index + match.value.length;
    }

    if (cursor < text.length) {
        segments.push({ text: text.slice(cursor), match: false });
    }

    return segments;
}

/**
 * Apply the replacement to every match. `${1}` style references and named
 * groups are resolved by the native String.replace implementation.
 */
export function replaceMatches(source, flags, text, replacement) {
    if (source === "") return text;
    return text.replace(compilePattern(source, flags), replacement);
}

/** Total number of captured groups across all matches. */
export function countGroups(matches) {
    return matches.reduce((total, match) => total + match.groups.length, 0);
}
