// Extrae los ejercicios markdown (triviales/ y problemas-diseno/) a un módulo ES
// con datos estructurados (data/ejercicios.js). El navegador solo consume esta
// estructura; el parseo de markdown ocurre aquí, en tiempo de construcción.
//
// Uso: npm run generar  (equivale a: node scripts/extraer-datos.js)

import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..");
const TRIVIALES_DIR = join(ROOT_DIR, "triviales");
const PROBLEMAS_DIR = join(ROOT_DIR, "problemas-diseno");
const OUTPUT_FILE = join(ROOT_DIR, "data", "ejercicios.js");

// --- Expresiones para el parseo (estructura fija definida en
// triviales/instrucciones-generador-ejercicios-triviales.md) -------------------

const HEADING_PATTERN = /^# (?:Ejercicio|Problema) \d{3}\s*-\s*(.+)$/;
const META_PATTERN = /^\*\*([^*]+):\*\*\s*(.*)$/;
const EXAMPLE_PATTERN = /^\*\*(Ejemplo|Escenario)\b[^*]*\*\*:?\s*$/;
const LIST_ITEM_PATTERN = /^-\s+(.*)$/;
const NUMBERED_ITEM_PATTERN = /^\d+\.\s+(.*)$/;
const FENCE_PATTERN = /^```(\w*)\s*$/;
const SUMMARY_PATTERN = /<summary>(.*?)<\/summary>/;
const STAR_PATTERN = /⭐/g;

/** Cuenta las estrellas de dificultad de un valor como "⭐⭐☆☆☆". */
export function countStars(value) {
    const matches = String(value ?? "").match(STAR_PATTERN);
    return matches ? matches.length : 0;
}

/**
 * Divide una lista de temas separada por comas, respetando los paréntesis:
 * "a (x, y), b" → ["a (x, y)", "b"]. Así no se parte "operadores (&&, ||)".
 */
export function splitTopics(value) {
    const parts = [];
    let current = "";
    let depth = 0;
    for (const char of String(value ?? "")) {
        if (char === "(") {
            depth += 1;
        } else if (char === ")") {
            depth = Math.max(0, depth - 1);
        }
        if (char === "," && depth === 0) {
            parts.push(current.trim());
            current = "";
        } else {
            current += char;
        }
    }
    if (current.trim()) {
        parts.push(current.trim());
    }
    return parts;
}

/**
 * Convierte un conjunto de líneas de una sección en una lista de bloques
 * tipados: paragraph | list | code | example | hint.
 */
export function buildBlocks(lines) {
    const blocks = [];
    let stack = null; // bloque abierto (code, example o hint)
    let paragraph = [];
    let list = null;

    const closeParagraph = () => {
        if (paragraph.length > 0) {
            blocks.push({ type: "paragraph", text: paragraph.join(" ").trim() });
            paragraph = [];
        }
    };
    const closeList = () => {
        if (list) {
            blocks.push(list);
            list = null;
        }
    };

    for (const line of lines) {
        if (stack) {
            if (stack.type === "code") {
                if (FENCE_PATTERN.test(line)) {
                    blocks.push(stack);
                    stack = null;
                } else {
                    stack.code += (stack.code ? "\n" : "") + line;
                }
            } else if (stack.type === "example") {
                // Un ejemplo es un título + una valla de código. La primera valla abre
                // la recolección y la segunda la cierra (las líneas de valla se ignoran).
                if (FENCE_PATTERN.test(line)) {
                    if (stack.insideFence) {
                        stack.code = stack.code.trim();
                        blocks.push(stack);
                        stack = null;
                    } else {
                        stack.insideFence = true;
                    }
                } else {
                    stack.code += (stack.code ? "\n" : "") + line;
                }
            } else if (stack.type === "hint") {
                const summaryMatch = line.match(SUMMARY_PATTERN);
                if (summaryMatch) {
                    stack.summary = summaryMatch[1].trim();
                } else if (line.trim() === "</details>") {
                    blocks.push(stack);
                    stack = null;
                } else {
                    stack.content.push(line);
                }
            }
            continue;
        }

        if (line.trim() === "") {
            closeParagraph();
            closeList();
            continue;
        }

        const exampleMatch = line.match(EXAMPLE_PATTERN);
        if (exampleMatch) {
            closeParagraph();
            closeList();
            stack = {
                type: "example",
                title: line
                    .replace(/^\*\*/, "")
                    .replace(/\*\*:?\s*$/, "")
                    .trim(),
                code: "",
                insideFence: false,
            };
            continue;
        }

        const fenceMatch = line.match(FENCE_PATTERN);
        if (fenceMatch) {
            closeParagraph();
            closeList();
            stack = { type: "code", language: fenceMatch[1], code: "" };
            continue;
        }

        if (line.trim() === "<details>") {
            closeParagraph();
            closeList();
            stack = { type: "hint", summary: "", content: [] };
            continue;
        }

        const listMatch = line.match(LIST_ITEM_PATTERN);
        if (listMatch) {
            closeParagraph();
            if (!list || list.ordered) {
                list = { type: "list", ordered: false, items: [] };
            }
            list.items.push(listMatch[1].trim());
            continue;
        }

        const numberedMatch = line.match(NUMBERED_ITEM_PATTERN);
        if (numberedMatch) {
            closeParagraph();
            if (!list || !list.ordered) {
                list = { type: "list", ordered: true, items: [] };
            }
            list.items.push(numberedMatch[1].trim());
            continue;
        }

        // Texto normal: se acumula en el párrafo actual.
        closeList();
        paragraph.push(line.trim());
    }

    // Cierre pendiente al final de la sección.
    if (stack && (stack.type === "code" || stack.type === "example")) {
        stack.code = stack.code.trim();
        blocks.push(stack);
    }
    closeParagraph();
    closeList();

    // El contenido de una pista se parsea de forma recursiva (puede tener listas).
    return blocks.map((block) =>
        block.type === "hint" ? { ...block, content: buildBlocks(block.content) } : block
    );
}

/**
 * Parsea un archivo markdown de ejercicio y devuelve el objeto estructurado.
 * Se exporta para poder testearlo con node --test.
 */
export function parseFile(fileName, content) {
    const base = fileName.toLowerCase();
    const isProblem = base.startsWith("problema-");
    const number = Number.parseInt(base.match(/\d{3}/)?.[0] ?? "0", 10);

    const lines = content.split(/\r?\n/);
    const meta = {};
    let title = null;
    const sections = [];
    let currentSection = null;

    for (const line of lines) {
        const headingMatch = line.match(HEADING_PATTERN);
        if (headingMatch) {
            title = headingMatch[1].trim();
            continue;
        }
        const metaMatch = line.match(META_PATTERN);
        if (metaMatch && !currentSection) {
            meta[metaMatch[1].trim()] = metaMatch[2].trim();
            continue;
        }
        if (line.startsWith("## ")) {
            currentSection = { title: line.slice(3).trim(), blocks: [] };
            sections.push(currentSection);
            continue;
        }
        if (currentSection) {
            currentSection.blocks.push(line);
        }
    }

    const collection = isProblem ? "problems" : "exercises";
    const levelValue = meta["Nivel"] ?? "";
    const levelSeparator = levelValue.indexOf(" - ");

    return {
        number,
        collection,
        title: title ?? base.replace(/\.[^.]+$/, ""),
        level: levelSeparator >= 0 ? Number.parseInt(levelValue.slice(0, levelSeparator), 10) : 0,
        levelName: levelSeparator >= 0 ? levelValue.slice(levelSeparator + 3).trim() : "",
        topics: splitTopics(meta["Tema(s)"]),
        difficulty: countStars(meta["Dificultad estimada"]),
        category: meta["Categoría"] ?? null,
        oopFocus: meta["Enfoque POO"] ?? null,
        sections: sections
            .map((section) => {
                const blocks = buildBlocks(section.blocks);
                if (blocks.length === 0) {
                    return null;
                }
                return { title: section.title, blocks };
            })
            .filter(Boolean),
    };
}

/** Lee un directorio de ejercicios y devuelve los ítems ordenados por número. */
async function parseDirectory(directory) {
    // Se excluyen los archivos de soporte (índice e instrucciones del generador).
    const files = (await readdir(directory))
        .filter(
            (file) =>
                file.endsWith(".md") &&
                !file.toUpperCase().startsWith("INDICE") &&
                !file.startsWith("instrucciones-")
        )
        .sort();
    const items = [];
    for (const file of files) {
        const content = await readFile(join(directory, file), "utf8");
        items.push(parseFile(file, content));
    }
    items.sort((a, b) => a.number - b.number);
    return items;
}

async function main() {
    const exercises = await parseDirectory(TRIVIALES_DIR);
    const problems = await parseDirectory(PROBLEMAS_DIR);

    const data = {
        generatedAt: new Date().toISOString(),
        collections: [
            {
                key: "exercises",
                name: "Ejercicios",
                description: "Ejercicios de programación en Java, de Básico I a Experto I.",
                items: exercises,
            },
            {
                key: "problems",
                name: "Problemas de diseño",
                description: "Problemas de diseño POO, de Modelado simple a Sistemas completos.",
                items: problems,
            },
        ],
    };

    await mkdir(dirname(OUTPUT_FILE), { recursive: true });
    const jsContent = `/* eslint-disable */\n// Generado automáticamente por scripts/extraer-datos.js — NO editar a mano.\n// Regenerar con: npm run generar\n\nexport const JAVARCISES = ${JSON.stringify(data, null, 4)};\n`;
    await writeFile(OUTPUT_FILE, jsContent);

    const total = exercises.length + problems.length;
    const exerciseLevels = new Set(exercises.map((exercise) => exercise.level)).size;
    const problemLevels = new Set(problems.map((problem) => problem.level)).size;
    console.log(
        `Generados ${total} ítems → ${OUTPUT_FILE}\n` +
            `  ejercicios: ${exercises.length} (${exerciseLevels} niveles)\n` +
            `  problemas: ${problems.length} (${problemLevels} niveles)`
    );
}

// Solo se ejecuta al correrlo directamente (no al importarlo desde los tests).
const isRunDirectly = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isRunDirectly) {
    main().catch((error) => {
        console.error("Error al generar los datos:", error);
        process.exitCode = 1;
    });
}
