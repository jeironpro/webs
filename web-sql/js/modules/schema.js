import { renderTokens, splitStatements, tokenizeSql } from "./sql.js";

const CONSTRAINT_STARTS = new Set([
    "PRIMARY",
    "NOT",
    "NULL",
    "UNIQUE",
    "DEFAULT",
    "REFERENCES",
    "CHECK",
    "CONSTRAINT",
    "GENERATED",
    "COLLATE",
]);

function cleanName(token) {
    if (!token) return "";
    const value = token.value;
    if (value.startsWith('"') && value.endsWith('"')) return value.slice(1, -1).replace(/""/g, '"');
    if (value.startsWith("`") && value.endsWith("`")) return value.slice(1, -1);
    if (value.startsWith("[") && value.endsWith("]")) return value.slice(1, -1);
    return value;
}

function nameKey(name) {
    return name.toLowerCase();
}

function readName(tokens, start) {
    let index = start;
    const parts = [];

    while (index < tokens.length) {
        const token = tokens[index];
        if (token.type !== "word" && token.type !== "identifier") break;
        parts.push(cleanName(token));
        index += 1;

        if (tokens[index]?.value !== ".") break;
        index += 1;
    }

    return { name: parts.join("."), index };
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

function readIdentifierList(tokens, start) {
    if (tokens[start]?.value !== "(") return { columns: [], index: start };
    const close = findClosingParen(tokens, start);
    const body = tokens.slice(start + 1, close);
    const columns = [];
    let current = [];
    let depth = 0;

    body.forEach((token) => {
        if (token.value === "(") depth += 1;
        if (token.value === ")") depth = Math.max(0, depth - 1);
        if (token.value === "," && depth === 0) {
            if (current.length > 0) columns.push(cleanName(current[0]));
            current = [];
            return;
        }
        current.push(token);
    });

    if (current.length > 0) columns.push(cleanName(current[0]));
    return { columns, index: close + 1 };
}

function hasSequence(tokens, first, second) {
    return tokens.some(
        (token, index) => token.upper === first && tokens[index + 1]?.upper === second
    );
}

function hasWord(tokens, word) {
    return tokens.some((token) => token.upper === word);
}

function findReference(tokens) {
    const index = tokens.findIndex((token) => token.upper === "REFERENCES");
    if (index === -1) return null;

    const target = readName(tokens, index + 1);
    if (target.name === "") return null;

    const columns = readIdentifierList(tokens, target.index);
    return {
        table: target.name,
        columns: columns.columns,
    };
}

function parseColumn(tokens) {
    const name = cleanName(tokens[0]);
    if (name === "") return null;

    let index = 1;
    let depth = 0;
    while (index < tokens.length) {
        const token = tokens[index];
        if (token.value === "(") depth += 1;
        if (token.value === ")") depth = Math.max(0, depth - 1);
        if (depth === 0 && CONSTRAINT_STARTS.has(token.upper)) break;
        index += 1;
    }

    const typeTokens = tokens.slice(1, index);
    const constraints = tokens.slice(index);
    const reference = findReference(constraints);

    return {
        name,
        type: typeTokens.length > 0 ? renderTokens(typeTokens) : "—",
        primaryKey: hasSequence(constraints, "PRIMARY", "KEY"),
        notNull: hasSequence(constraints, "NOT", "NULL"),
        unique: hasWord(constraints, "UNIQUE"),
        foreignKey: reference !== null,
        reference,
    };
}

function applyPrimaryKey(columns, names) {
    const wanted = new Set(names.map(nameKey));
    columns.forEach((column) => {
        if (wanted.has(nameKey(column.name))) column.primaryKey = true;
    });
}

function addRelations(relations, tableName, sourceColumns, reference) {
    if (reference === null) return;

    sourceColumns.forEach((column, index) => {
        const targetColumn = reference.columns[index] ?? reference.columns[0] ?? "";
        relations.push({
            fromTable: tableName,
            fromColumn: column,
            toTable: reference.table,
            toColumn: targetColumn,
        });
    });
}

function parseTable(tokens) {
    const codeStart = tokens.findIndex((token) => token.type !== "comment");
    if (codeStart === -1 || tokens[codeStart].upper !== "CREATE") return null;

    let cursor = codeStart + 1;
    while (cursor < tokens.length && tokens[cursor].upper !== "TABLE") cursor += 1;
    if (tokens[cursor]?.upper !== "TABLE") return null;

    cursor += 1;
    if (
        tokens[cursor]?.upper === "IF" &&
        tokens[cursor + 1]?.upper === "NOT" &&
        tokens[cursor + 2]?.upper === "EXISTS"
    ) {
        cursor += 3;
    }

    const tableName = readName(tokens, cursor);
    if (tableName.name === "") return null;

    cursor = tableName.index;
    while (cursor < tokens.length && tokens[cursor].value !== "(") cursor += 1;
    if (cursor >= tokens.length) return null;

    const close = findClosingParen(tokens, cursor);
    const body = tokens.slice(cursor + 1, close);
    const parts = [];
    let current = [];
    let depth = 0;

    body.forEach((token) => {
        if (token.value === "(") depth += 1;
        if (token.value === ")") depth = Math.max(0, depth - 1);
        if (token.value === "," && depth === 0) {
            if (current.length > 0) parts.push(current);
            current = [];
            return;
        }
        current.push(token);
    });
    if (current.length > 0) parts.push(current);

    const columns = [];
    const relations = [];

    parts.forEach((part) => {
        let start = 0;
        if (part[start]?.upper === "CONSTRAINT") start = 2;

        if (part[start]?.upper === "PRIMARY" && part[start + 1]?.upper === "KEY") {
            const list = readIdentifierList(part, start + 2);
            applyPrimaryKey(columns, list.columns);
            return;
        }

        if (part[start]?.upper === "FOREIGN" && part[start + 1]?.upper === "KEY") {
            const source = readIdentifierList(part, start + 2);
            const reference = findReference(part.slice(source.index));
            addRelations(relations, tableName.name, source.columns, reference);
            source.columns.forEach((name) => {
                const column = columns.find((item) => nameKey(item.name) === nameKey(name));
                if (column) {
                    column.foreignKey = true;
                    column.reference = reference;
                }
            });
            return;
        }

        if (part[start]?.upper === "UNIQUE") {
            const list = readIdentifierList(part, start + 1);
            list.columns.forEach((name) => {
                const column = columns.find((item) => nameKey(item.name) === nameKey(name));
                if (column) column.unique = true;
            });
            return;
        }

        if (part[start]?.upper === "CHECK") return;

        const column = parseColumn(part.slice(start));
        if (column !== null) {
            columns.push(column);
            if (column.reference !== null) {
                addRelations(relations, tableName.name, [column.name], column.reference);
            }
        }
    });

    if (columns.length === 0) return null;

    return {
        table: {
            name: tableName.name,
            columns,
        },
        relations,
    };
}

/** Read CREATE TABLE statements and extract columns, keys and foreign-key relations. */
export function parseSchema(source) {
    const tables = [];
    const relations = [];

    splitStatements(tokenizeSql(source)).forEach((tokens) => {
        const parsed = parseTable(tokens);
        if (parsed === null) return;
        tables.push(parsed.table);
        relations.push(...parsed.relations);
    });

    const byKey = new Map(tables.map((table) => [nameKey(table.name), table]));
    const uniqueRelations = [];
    const seen = new Set();

    relations.forEach((relation) => {
        const target = byKey.get(nameKey(relation.toTable));
        const fallbackColumn = target
            ? (target.columns.find((column) => column.primaryKey)?.name ??
              target.columns[0]?.name ??
              "")
            : "";
        const normalized = target
            ? { ...relation, toTable: target.name, toColumn: relation.toColumn || fallbackColumn }
            : relation;
        const id = [
            normalized.fromTable,
            normalized.fromColumn,
            normalized.toTable,
            normalized.toColumn,
        ]
            .join("|")
            .toLowerCase();

        if (!seen.has(id)) {
            seen.add(id);
            uniqueRelations.push(normalized);
        }
    });

    return { tables, relations: uniqueRelations };
}
