const MAX_INLINE_DEPTH = 8;
const ESCAPABLE = new Set([
    "\\",
    "`",
    "*",
    "_",
    "{",
    "}",
    "[",
    "]",
    "(",
    ")",
    "#",
    "+",
    "-",
    ".",
    "!",
    "|",
    ">",
    "~",
]);

/** Solo se permiten enlaces http(s), mailto, anclas y rutas relativas. */
export function safeHref(value) {
    const href = String(value ?? "").trim();
    if (href === "") return null;
    if (/^(https?:\/\/|mailto:|#)/i.test(href)) return href;
    if (/^\/(?!\/)/.test(href)) return href;
    if (/^\.{1,2}\//.test(href)) return href;
    return null;
}

export function safeImageSrc(value) {
    const src = String(value ?? "").trim();
    if (src === "") return null;
    if (/^https?:\/\//i.test(src)) return src;
    if (/^\/(?!\/)/.test(src)) return src;
    if (/^\.{1,2}\//.test(src)) return src;
    return null;
}

function pushText(tokens, text) {
    if (text === "") return;
    const last = tokens[tokens.length - 1];
    if (last && last.type === "text") last.text += text;
    else tokens.push({ type: "text", text });
}

function canOpenEmphasis(text, index, delimiter) {
    const before = text[index - 1];
    const after = text[index + delimiter.length];
    if (after === undefined || /\s/.test(after)) return false;
    if (delimiter[0] === "_" && before !== undefined && /[\w]/.test(before)) return false;
    return true;
}

function findClosing(text, delimiter, from) {
    let index = text.indexOf(delimiter, from);
    while (index !== -1) {
        if (text[index - 1] !== "\\") return index;
        index = text.indexOf(delimiter, index + delimiter.length);
    }
    return -1;
}

function findClosingParen(text, from) {
    let depth = 0;
    for (let i = from; i < text.length; i += 1) {
        if (text[i] === "\\") {
            i += 1;
            continue;
        }
        if (text[i] === "(") depth += 1;
        if (text[i] === ")") {
            if (depth === 0) return i;
            depth -= 1;
        }
    }
    return -1;
}

function parseLinkOrImage(text, index) {
    const image = text[index] === "!";
    const labelStart = image ? index + 2 : index + 1;
    const closeLabel = text.indexOf("]", labelStart);
    if (closeLabel === -1 || text[closeLabel + 1] !== "(") return null;

    const closeUrl = findClosingParen(text, closeLabel + 2);
    if (closeUrl === -1) return null;

    const label = text.slice(labelStart, closeLabel);
    const url = text.slice(closeLabel + 2, closeUrl).trim();
    if (image) {
        return {
            token: { type: "image", alt: label, src: safeImageSrc(url), raw: url },
            end: closeUrl + 1,
        };
    }
    return {
        token: { type: "link", href: safeHref(url), children: parseInline(label, 1) },
        end: closeUrl + 1,
    };
}

export function parseInline(value, depth = 0) {
    const text = String(value ?? "");
    if (depth >= MAX_INLINE_DEPTH) return [{ type: "text", text }];

    const tokens = [];
    let buffer = "";
    let i = 0;

    while (i < text.length) {
        const char = text[i];

        if (char === "\\" && i + 1 < text.length && ESCAPABLE.has(text[i + 1])) {
            buffer += text[i + 1];
            i += 2;
            continue;
        }

        if (char === "`") {
            const end = text.indexOf("`", i + 1);
            if (end !== -1) {
                pushText(tokens, buffer);
                buffer = "";
                tokens.push({ type: "code", text: text.slice(i + 1, end) });
                i = end + 1;
                continue;
            }
        }

        if (char === "!" && text[i + 1] === "[") {
            const parsed = parseLinkOrImage(text, i);
            if (parsed) {
                pushText(tokens, buffer);
                buffer = "";
                tokens.push(parsed.token);
                i = parsed.end;
                continue;
            }
        }

        if (char === "[") {
            const parsed = parseLinkOrImage(text, i);
            if (parsed) {
                pushText(tokens, buffer);
                buffer = "";
                tokens.push(parsed.token);
                i = parsed.end;
                continue;
            }
        }

        const strong = text.startsWith("**", i) ? "**" : text.startsWith("__", i) ? "__" : null;
        if (strong && canOpenEmphasis(text, i, strong)) {
            const end = findClosing(text, strong, i + 2);
            if (end > i + 2) {
                pushText(tokens, buffer);
                buffer = "";
                tokens.push({
                    type: "strong",
                    children: parseInline(text.slice(i + 2, end), depth + 1),
                });
                i = end + 2;
                continue;
            }
        }

        if (text.startsWith("~~", i)) {
            const end = findClosing(text, "~~", i + 2);
            if (end > i + 2) {
                pushText(tokens, buffer);
                buffer = "";
                tokens.push({
                    type: "delete",
                    children: parseInline(text.slice(i + 2, end), depth + 1),
                });
                i = end + 2;
                continue;
            }
        }

        if ((char === "*" || char === "_") && canOpenEmphasis(text, i, char)) {
            const end = findClosing(text, char, i + 1);
            if (end > i + 1) {
                pushText(tokens, buffer);
                buffer = "";
                tokens.push({
                    type: "em",
                    children: parseInline(text.slice(i + 1, end), depth + 1),
                });
                i = end + 1;
                continue;
            }
        }

        buffer += char;
        i += 1;
    }

    pushText(tokens, buffer);
    return tokens;
}

function isHr(line) {
    return /^ {0,3}(?:(?:\*\s*){3,}|(?:-\s*){3,}|(?:_\s*){3,})$/.test(line);
}

function isBlockStart(line) {
    return (
        /^ {0,3}#{1,6}\s+/.test(line) ||
        /^ {0,3}```/.test(line) ||
        /^ {0,3}>/.test(line) ||
        /^ {0,3}(?:[-*+]|\d+\.)\s+/.test(line) ||
        isHr(line)
    );
}

function listMatch(line) {
    const match = /^ {0,3}([-*+]|\d+\.)\s+(.*)$/.exec(line);
    if (!match) return null;
    return { ordered: /\d/.test(match[1]), text: match[2] };
}

export function parseMarkdown(value) {
    const lines = String(value ?? "")
        .replace(/\r\n?/g, "\n")
        .split("\n");
    const blocks = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];

        if (line.trim() === "") {
            i += 1;
            continue;
        }

        const fence = /^ {0,3}```([\w+#.-]*)\s*$/.exec(line);
        if (fence) {
            i += 1;
            const code = [];
            while (i < lines.length && !/^ {0,3}```\s*$/.test(lines[i])) {
                code.push(lines[i]);
                i += 1;
            }
            if (i < lines.length) i += 1;
            blocks.push({ type: "code", language: fence[1], text: code.join("\n") });
            continue;
        }

        const heading = /^ {0,3}(#{1,6})\s+(.*?)(?:\s+#+)?\s*$/.exec(line);
        if (heading) {
            blocks.push({
                type: "heading",
                level: heading[1].length,
                children: parseInline(heading[2]),
            });
            i += 1;
            continue;
        }

        if (isHr(line)) {
            blocks.push({ type: "hr" });
            i += 1;
            continue;
        }

        if (/^ {0,3}>/.test(line)) {
            const quoteLines = [];
            while (i < lines.length && /^ {0,3}>/.test(lines[i])) {
                quoteLines.push(lines[i].replace(/^ {0,3}>\s?/, ""));
                i += 1;
            }
            blocks.push({ type: "blockquote", children: parseMarkdown(quoteLines.join("\n")) });
            continue;
        }

        const item = listMatch(line);
        if (item) {
            const items = [];
            while (i < lines.length) {
                const current = listMatch(lines[i]);
                if (!current || current.ordered !== item.ordered) break;
                items.push(parseInline(current.text));
                i += 1;
            }
            blocks.push({ type: "list", ordered: item.ordered, items });
            continue;
        }

        const paragraph = [line.trim()];
        i += 1;
        while (i < lines.length && lines[i].trim() !== "" && !isBlockStart(lines[i])) {
            paragraph.push(lines[i].trim());
            i += 1;
        }
        blocks.push({ type: "paragraph", children: parseInline(paragraph.join(" ")) });
    }

    return blocks;
}

export function documentStats(value) {
    const source = String(value ?? "");
    const normalized = source.replace(/\r\n?/g, "\n");
    const trimmed = normalized.trim();
    const words = trimmed === "" ? 0 : trimmed.split(/\s+/u).length;
    const lines = normalized === "" ? 0 : normalized.split("\n").length;

    return {
        words,
        characters: source.length,
        lines,
        minutes: words === 0 ? 0 : Math.max(1, Math.ceil(words / 220)),
    };
}

export function wrapSelection(value, start, end, before, after = before) {
    const text = String(value ?? "");
    const from = Math.max(0, Math.min(start, text.length));
    const to = Math.max(from, Math.min(end, text.length));
    const selected = text.slice(from, to);

    return {
        text: `${text.slice(0, from)}${before}${selected}${after}${text.slice(to)}`,
        selectionStart: from + before.length,
        selectionEnd: from + before.length + selected.length,
    };
}

export function prefixSelection(value, start, end, prefix) {
    const text = String(value ?? "");
    const from = Math.max(0, Math.min(start, text.length));
    const to = Math.max(from, Math.min(end, text.length));
    const lineStart = text.lastIndexOf("\n", Math.max(0, from - 1)) + 1;
    const segment = text.slice(lineStart, to);
    const rows = segment.split("\n");
    const already = rows.every((row) => row.startsWith(prefix));
    const nextRows = rows.map((row) => (already ? row.slice(prefix.length) : `${prefix}${row}`));
    const replacement = nextRows.join("\n");

    return {
        text: `${text.slice(0, lineStart)}${replacement}${text.slice(to)}`,
        selectionStart: lineStart,
        selectionEnd: lineStart + replacement.length,
    };
}
