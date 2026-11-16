const KEYWORDS = new Set(
    `SELECT FROM WHERE GROUP BY HAVING ORDER LIMIT OFFSET JOIN LEFT RIGHT FULL INNER OUTER CROSS ON USING
    AS AND OR NOT NULL IS IN BETWEEN LIKE EXISTS CASE WHEN THEN ELSE END ASC DESC DISTINCT ALL
    INSERT INTO VALUES UPDATE SET DELETE RETURNING CREATE TABLE PRIMARY KEY FOREIGN REFERENCES CONSTRAINT
    UNIQUE CHECK DEFAULT CASCADE ALTER ADD DROP COLUMN IF EXISTS BEGIN COMMIT ROLLBACK TRANSACTION
    UNION INTERSECT EXCEPT WITH RECURSIVE OVER PARTITION WINDOW FETCH FIRST NEXT ROWS ONLY
    TRUE FALSE CURRENT_TIMESTAMP CURRENT_DATE CURRENT_TIME`
        .split(/\s+/)
        .filter(Boolean)
);

const TYPES = new Set(
    `INTEGER INT BIGINT SMALLINT SERIAL BIGSERIAL TEXT VARCHAR CHAR BOOLEAN BOOL DATE TIMESTAMP
    TIMESTAMPTZ NUMERIC DECIMAL REAL DOUBLE PRECISION FLOAT JSON JSONB UUID BLOB`
        .split(/\s+/)
        .filter(Boolean)
);

const FUNCTIONS = new Set(
    `COUNT SUM AVG MIN MAX COALESCE NULLIF CAST LOWER UPPER LENGTH ROUND NOW DATE_TRUNC ROW_NUMBER RANK
    DENSE_RANK ABS CEIL FLOOR`
        .split(/\s+/)
        .filter(Boolean)
);

const CLAUSE_WORDS = new Set([
    "SELECT",
    "FROM",
    "WHERE",
    "HAVING",
    "LIMIT",
    "OFFSET",
    "RETURNING",
    "VALUES",
    "SET",
    "JOIN",
    "ON",
    "USING",
    "WINDOW",
    "INTERSECT",
    "EXCEPT",
]);

const JOIN_WORDS = new Set(["LEFT", "RIGHT", "FULL", "INNER", "CROSS"]);

function readQuoted(source, start, quote, closing = quote) {
    let index = start + 1;
    let value = source[start];

    while (index < source.length) {
        if (source[index] === closing) {
            if (source[index + 1] === closing && quote === "'") {
                value += source[index] + source[index + 1];
                index += 2;
                continue;
            }
            value += source[index];
            return { value, end: index + 1 };
        }
        value += source[index];
        index += 1;
    }

    return { value, end: index };
}

/** Split SQL into tokens while preserving strings, comments and quoted identifiers. */
export function tokenizeSql(source) {
    const tokens = [];
    let index = 0;

    while (index < source.length) {
        const character = source[index];

        if (/\s/.test(character)) {
            index += 1;
            continue;
        }

        if (character === "-" && source[index + 1] === "-") {
            let end = source.indexOf("\n", index);
            if (end === -1) end = source.length;
            tokens.push({
                type: "comment",
                value: source.slice(index, end).trimEnd(),
                upper: source.slice(index, end).trimEnd().toUpperCase(),
            });
            index = end;
            continue;
        }

        if (character === "/" && source[index + 1] === "*") {
            let end = source.indexOf("*/", index + 2);
            end = end === -1 ? source.length : end + 2;
            tokens.push({
                type: "comment",
                value: source.slice(index, end),
                upper: source.slice(index, end).toUpperCase(),
            });
            index = end;
            continue;
        }

        if (character === "'") {
            const quoted = readQuoted(source, index, "'");
            tokens.push({ type: "string", value: quoted.value, upper: quoted.value.toUpperCase() });
            index = quoted.end;
            continue;
        }

        if (character === '"' || character === "`") {
            const quoted = readQuoted(source, index, character);
            tokens.push({
                type: "identifier",
                value: quoted.value,
                upper: quoted.value.toUpperCase(),
            });
            index = quoted.end;
            continue;
        }

        if (character === "[") {
            const quoted = readQuoted(source, index, "[", "]");
            tokens.push({
                type: "identifier",
                value: quoted.value,
                upper: quoted.value.toUpperCase(),
            });
            index = quoted.end;
            continue;
        }

        if (/[0-9]/.test(character)) {
            const match = /^\d+(?:\.\d+)?/.exec(source.slice(index));
            tokens.push({ type: "number", value: match[0], upper: match[0] });
            index += match[0].length;
            continue;
        }

        if (/[A-Za-z_]/.test(character)) {
            const match = /^[A-Za-z_][A-Za-z0-9_$]*/.exec(source.slice(index));
            tokens.push({ type: "word", value: match[0], upper: match[0].toUpperCase() });
            index += match[0].length;
            continue;
        }

        if ("(),;.".includes(character)) {
            tokens.push({ type: "punct", value: character, upper: character });
            index += 1;
            continue;
        }

        const pair = source.slice(index, index + 2);
        if (["<=", ">=", "<>", "!=", "||", "::", ":="].includes(pair)) {
            tokens.push({ type: "operator", value: pair, upper: pair });
            index += 2;
            continue;
        }

        tokens.push({ type: "operator", value: character, upper: character });
        index += 1;
    }

    return tokens;
}

/** Split tokens at top-level semicolons, ignoring empty statements. */
export function splitStatements(tokens) {
    const statements = [];
    let current = [];
    let depth = 0;

    tokens.forEach((token) => {
        if (token.value === "(") depth += 1;
        if (token.value === ")") depth = Math.max(0, depth - 1);

        if (token.value === ";" && depth === 0) {
            if (current.some((item) => item.type !== "comment")) statements.push(current);
            current = [];
            return;
        }

        current.push(token);
    });

    if (current.some((item) => item.type !== "comment")) statements.push(current);
    return statements;
}

function displayToken(token) {
    if (
        token.type === "word" &&
        (KEYWORDS.has(token.upper) || TYPES.has(token.upper) || FUNCTIONS.has(token.upper))
    ) {
        return token.upper;
    }
    return token.value;
}

/** Render a token run with compact punctuation and uppercase SQL words. */
export function renderTokens(tokens) {
    let output = "";

    tokens.forEach((token, index) => {
        const previous = tokens[index - 1];
        const beforePrevious = tokens[index - 2];
        const value = displayToken(token);

        let space = "";
        if (output) {
            const noSpaceBefore = [",", ")", ";", ".", "::"].includes(value);
            const noSpaceAfter = previous && ["(", ".", "::"].includes(previous.value);
            const functionCall =
                value === "(" &&
                previous?.type === "word" &&
                (FUNCTIONS.has(previous.upper) || TYPES.has(previous.upper));
            const referenceCall =
                value === "(" &&
                previous?.type === "word" &&
                beforePrevious?.upper === "REFERENCES";

            if (!noSpaceBefore && !noSpaceAfter && !functionCall && !referenceCall) space = " ";
        }

        output += space + value;
    });

    return output;
}

function clauseWidth(tokens, index) {
    const token = tokens[index];
    if (token.type !== "word") return 0;

    const next = tokens[index + 1];
    if (token.upper === "GROUP" || token.upper === "ORDER") {
        return next?.upper === "BY" ? 2 : 0;
    }

    if (JOIN_WORDS.has(token.upper)) {
        let cursor = index + 1;
        if (tokens[cursor]?.upper === "OUTER") cursor += 1;
        if (tokens[cursor]?.upper === "JOIN") return cursor - index + 1;
        return 0;
    }

    if (token.upper === "UNION" && next?.upper === "ALL") return 2;
    if (CLAUSE_WORDS.has(token.upper)) return 1;
    return 0;
}

function splitClauses(tokens) {
    const clauses = [];
    let current = [];
    let depth = 0;

    for (let index = 0; index < tokens.length; index += 1) {
        const token = tokens[index];
        const width = depth === 0 ? clauseWidth(tokens, index) : 0;

        if (width > 0) {
            if (current.length > 0) clauses.push(current);
            current = tokens.slice(index, index + width);
            index += width - 1;
            continue;
        }

        current.push(token);
        if (token.value === "(") depth += 1;
        if (token.value === ")") depth = Math.max(0, depth - 1);
    }

    if (current.length > 0) clauses.push(current);
    return clauses;
}

function splitByComma(tokens) {
    const groups = [];
    let current = [];
    let depth = 0;

    tokens.forEach((token) => {
        if (token.value === "(") depth += 1;
        if (token.value === ")") depth = Math.max(0, depth - 1);

        if (token.value === "," && depth === 0) {
            if (current.length > 0) groups.push(current);
            current = [];
            return;
        }

        current.push(token);
    });

    if (current.length > 0) groups.push(current);
    return groups;
}

function clauseHead(clause) {
    const first = clause[0]?.upper;
    let length = 1;

    if ((first === "GROUP" || first === "ORDER") && clause[1]?.upper === "BY") length = 2;
    if (JOIN_WORDS.has(first)) {
        let cursor = 1;
        if (clause[cursor]?.upper === "OUTER") cursor += 1;
        if (clause[cursor]?.upper === "JOIN") length = cursor + 1;
    }
    if (first === "UNION" && clause[1]?.upper === "ALL") length = 2;

    return {
        text: clause.slice(0, length).map(displayToken).join(" "),
        rest: clause.slice(length),
    };
}

function formatSelect(head, rest) {
    let selectHead = head;
    let items = rest;

    if (items[0]?.upper === "DISTINCT" || items[0]?.upper === "ALL") {
        selectHead += ` ${items[0].upper}`;
        items = items.slice(1);
    }

    const groups = splitByComma(items);
    if (groups.length === 0) return selectHead;

    return `${selectHead}\n${groups.map((group) => `  ${renderTokens(group)}`).join(",\n")}`;
}

function splitLogical(tokens) {
    const chunks = [];
    let current = [];
    let depth = 0;

    tokens.forEach((token) => {
        if (token.value === "(") depth += 1;
        if (token.value === ")") depth = Math.max(0, depth - 1);

        if (depth === 0 && (token.upper === "AND" || token.upper === "OR") && current.length > 0) {
            chunks.push(current);
            current = [token];
            return;
        }

        current.push(token);
    });

    if (current.length > 0) chunks.push(current);
    return chunks;
}

function formatCondition(head, rest, baseIndent) {
    const chunks = splitLogical(rest);
    if (chunks.length === 0) return `${baseIndent}${head}`;

    let output = `${baseIndent}${head} ${renderTokens(chunks[0])}`;
    chunks.slice(1).forEach((chunk) => {
        output += `\n${baseIndent}  ${renderTokens(chunk)}`;
    });
    return output;
}

function formatSet(head, rest) {
    const groups = splitByComma(rest);
    if (groups.length === 0) return head;
    return `${head}\n${groups.map((group) => `  ${renderTokens(group)}`).join(",\n")}`;
}

function formatClause(clause) {
    const { text: head, rest } = clauseHead(clause);
    const first = clause[0]?.upper;

    if (first === "SELECT") return formatSelect(head, rest);
    if (first === "WHERE" || first === "HAVING") return formatCondition(head, rest, "");
    if (first === "ON") return formatCondition(head, rest, "  ");
    if (first === "SET") return formatSet(head, rest);
    if (first === "GROUP" || first === "ORDER") {
        return rest.length > 0 ? `${head} ${renderTokens(rest)}` : head;
    }
    if (rest.length === 0) return head;
    return `${head} ${renderTokens(rest)}`;
}

function findOpeningParen(tokens) {
    let depth = 0;
    for (let index = 0; index < tokens.length; index += 1) {
        if (tokens[index].value === "(") {
            if (depth === 0) return index;
            depth += 1;
        }
        if (tokens[index].value === ")") depth = Math.max(0, depth - 1);
    }
    return -1;
}

function findClosingParen(tokens, openIndex) {
    let depth = 0;
    for (let index = openIndex; index < tokens.length; index += 1) {
        if (tokens[index].value === "(") depth += 1;
        if (tokens[index].value === ")") {
            depth -= 1;
            if (depth === 0) return index;
        }
    }
    return tokens.length - 1;
}

function formatCreateTable(tokens) {
    const openIndex = findOpeningParen(tokens);
    if (openIndex === -1) return renderTokens(tokens);

    const closeIndex = findClosingParen(tokens, openIndex);
    const header = renderTokens(tokens.slice(0, openIndex));
    const body = tokens.slice(openIndex + 1, closeIndex);
    const trailing = tokens.slice(closeIndex + 1);
    const groups = splitByComma(body);

    if (groups.length === 0) {
        return `${header} ()${trailing.length > 0 ? ` ${renderTokens(trailing)}` : ""}`;
    }

    return `${header} (\n${groups
        .map((group) => `  ${renderTokens(group)}`)
        .join(",\n")}\n)${trailing.length > 0 ? ` ${renderTokens(trailing)}` : ""}`;
}

function formatStatement(tokens) {
    const comments = [];
    let cursor = 0;
    while (tokens[cursor]?.type === "comment") {
        comments.push(tokens[cursor].value);
        cursor += 1;
    }

    const body = tokens.slice(cursor);
    if (body.length === 0) return comments.join("\n");

    const isCreateTable = body[0]?.upper === "CREATE" && body[1]?.upper === "TABLE";
    let formatted;

    if (isCreateTable) {
        formatted = formatCreateTable(body);
    } else {
        const clauses = splitClauses(body);
        formatted = clauses.map(formatClause).join("\n");
    }

    return comments.length > 0 ? `${comments.join("\n")}\n${formatted}` : formatted;
}

/**
 * Format SQL statements with one clause per line and two-space indentation.
 * The formatter is intentionally conservative: it never changes values or identifiers.
 */
export function formatSql(source) {
    const statements = splitStatements(tokenizeSql(source));
    if (statements.length === 0) return { ok: true, output: "", statements: 0 };

    const output = statements.map((tokens) => `${formatStatement(tokens)};`).join("\n\n");
    return { ok: true, output, statements: statements.length };
}
