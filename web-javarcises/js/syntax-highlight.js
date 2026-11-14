const JAVA_KEYWORDS = new Set([
    "abstract",
    "assert",
    "boolean",
    "break",
    "byte",
    "case",
    "catch",
    "char",
    "class",
    "const",
    "continue",
    "default",
    "do",
    "double",
    "else",
    "enum",
    "extends",
    "final",
    "finally",
    "float",
    "for",
    "goto",
    "if",
    "implements",
    "import",
    "instanceof",
    "int",
    "interface",
    "long",
    "native",
    "new",
    "package",
    "private",
    "protected",
    "public",
    "return",
    "short",
    "static",
    "strictfp",
    "super",
    "switch",
    "synchronized",
    "this",
    "throw",
    "throws",
    "transient",
    "try",
    "void",
    "volatile",
    "while",
]);

const JAVA_TYPES = new Set([
    "String",
    "Scanner",
    "System",
    "Integer",
    "Double",
    "Float",
    "Long",
    "Boolean",
    "Character",
    "Object",
    "Number",
    "Math",
    "List",
    "ArrayList",
    "LinkedList",
    "Map",
    "HashMap",
    "Set",
    "HashSet",
    "TreeMap",
    "TreeSet",
    "Queue",
    "Deque",
    "Stack",
    "Vector",
    "Collection",
    "Collections",
    "Arrays",
    "Optional",
    "Stream",
    "Exception",
    "RuntimeException",
    "IOException",
    "File",
    "FileReader",
    "BufferedReader",
    "PrintWriter",
    "FileWriter",
    "Path",
    "Paths",
    "Files",
    "StringBuilder",
    "StringBuffer",
    "Comparator",
    "Comparable",
    "Iterable",
    "Iterator",
    "Map.Entry",
]);

function tokenizeLine(line) {
    const tokens = [];
    let i = 0;

    while (i < line.length) {
        if (line[i] === "/" && line[i + 1] === "/") {
            tokens.push({ type: "comment", text: line.slice(i) });
            break;
        }

        if (line[i] === "/" && line[i + 1] === "*") {
            const end = line.indexOf("*/", i + 2);
            if (end !== -1) {
                tokens.push({ type: "comment", text: line.slice(i, end + 2) });
                i = end + 2;
            } else {
                tokens.push({ type: "comment", text: line.slice(i) });
                break;
            }
            continue;
        }

        if (line[i] === '"') {
            let j = i + 1;
            while (j < line.length && line[j] !== '"') {
                if (line[j] === "\\") j++; // escapar carácter siguiente
                j++;
            }
            tokens.push({ type: "string", text: line.slice(i, j + 1) });
            i = j + 1;
            continue;
        }

        if (line[i] === "'") {
            let j = i + 1;
            while (j < line.length && line[j] !== "'") {
                if (line[j] === "\\") j++;
                j++;
            }
            tokens.push({ type: "char", text: line.slice(i, j + 1) });
            i = j + 1;
            continue;
        }

        if (
            /[0-9]/.test(line[i]) ||
            (line[i] === "." && i + 1 < line.length && /[0-9]/.test(line[i + 1]))
        ) {
            let j = i;
            if (line[j] === "0" && (line[j + 1] === "x" || line[j + 1] === "X")) {
                j += 2;
                while (j < line.length && /[0-9a-fA-F_]/.test(line[j])) j++;
            } else {
                while (j < line.length && /[0-9_]/.test(line[j])) j++;
                if (j < line.length && line[j] === ".") {
                    j++;
                    while (j < line.length && /[0-9_]/.test(line[j])) j++;
                }
                if (j < line.length && (line[j] === "e" || line[j] === "E")) {
                    j++;
                    if (j < line.length && (line[j] === "+" || line[j] === "-")) j++;
                    while (j < line.length && /[0-9_]/.test(line[j])) j++;
                }
            }
            while (j < line.length && /[fFdDlL]/.test(line[j])) j++;
            tokens.push({ type: "number", text: line.slice(i, j) });
            i = j;
            continue;
        }

        if (/[a-zA-Z_$]/.test(line[i])) {
            let j = i;
            while (j < line.length && /[a-zA-Z0-9_$]/.test(line[j])) j++;
            const word = line.slice(i, j);

            if (JAVA_KEYWORDS.has(word)) {
                tokens.push({ type: "keyword", text: word });
            } else if (JAVA_TYPES.has(word)) {
                tokens.push({ type: "type", text: word });
            } else {
                tokens.push({ type: "identifier", text: word });
            }
            i = j;
            continue;
        }

        if (/[+\-*/%=<>!&|^~?:]/.test(line[i])) {
            let j = i;
            while (j < line.length && /[+\-*/%=<>!&|^~?:]/.test(line[j])) j++;
            tokens.push({ type: "operator", text: line.slice(i, j) });
            i = j;
            continue;
        }

        if (/\s/.test(line[i])) {
            let j = i;
            while (j < line.length && /\s/.test(line[j])) j++;
            tokens.push({ type: "whitespace", text: line.slice(i, j) });
            i = j;
            continue;
        }

        tokens.push({ type: "punctuation", text: line[i] });
        i++;
    }

    return tokens;
}

function createTokenNode(token) {
    const span = document.createElement("span");
    span.className = `token token--${token.type}`;
    span.textContent = token.text;
    return span;
}

export function highlightJava(code) {
    const fragment = document.createDocumentFragment();
    const lines = code.split("\n");

    for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
        const line = lines[lineIdx];
        const tokens = tokenizeLine(line);

        for (const token of tokens) {
            fragment.append(createTokenNode(token));
        }

        if (lineIdx < lines.length - 1) {
            fragment.append(document.createTextNode("\n"));
        }
    }

    return fragment;
}

export function highlightJavaInto(preElement, code) {
    const fragment = highlightJava(code);
    preElement.replaceChildren(fragment);
}
