#!/usr/bin/env node
/**
 * Bible import pipeline.
 *
 * Converts the source text (built for the Biblia Latinoamericana) into
 * js/data/verses.json with the shape consumed by js/verses.js:
 *
 *   {
 *     "<book_id>": {
 *       "<chapter>": [ { "number": 1, "text": "..." }, ... ]
 *     },
 *     ...
 *   }
 *
 * Usage:
 *   node scripts/import_bible.mjs --input <directory|file>
 *       [--output js/data/verses.json]
 *       [--catalog js/data/catalog.js]
 *
 * Accepted input formats:
 *
 *   1. A directory with one .txt file per book, named after the catalog id
 *      (e.g. genesis.txt) with one verse per line:
 *
 *        1:1 En el principio creó Dios los cielos y la tierra
 *        1:2 Y la tierra estaba desordenada y vacía...
 *
 *   2. A single .json file already grouped by book and chapter. Each chapter
 *      can be an array of plain strings or an array of { number, text }
 *      objects:
 *
 *        { "genesis": { "1": [ "En el principio...", "Y la tierra..." ] } }
 *
 * The script validates ids and counts against BIBLE_CATALOG and writes the
 * dataset in a readable format for review in the repository.
 */

import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync } from "node:fs";
import { dirname, join, extname, basename } from "node:path";
import vm from "node:vm";

const ROOT = new URL("..", import.meta.url).pathname;

function parseArguments(cli) {
  const args = {};
  for (let i = 2; i < cli.length; i++) {
    const arg = cli[i];
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const value = cli[i + 1] && !cli[i + 1].startsWith("--") ? cli[i + 1] : true;
      args[key] = value;
      if (value !== true) i++;
    }
  }
  return args;
}

function loadCatalog(path) {
  const source = readFileSync(path, "utf8");
  const context = {};
  vm.createContext(context);
  // The catalog declares a top-level `const`; expose it so it can be read.
  vm.runInContext(source + "\n;globalThis.__BIBLE_CATALOG__ = BIBLE_CATALOG;", context);
  return context.__BIBLE_CATALOG__;
}

function flattenCatalog(catalog) {
  return Object.values(catalog).flat();
}

/** Parses a .txt file with "C:V text" lines. */
function parseTxt(content) {
  const byChapter = {};
  for (const line of content.split(/\r?\n/)) {
    const text = line.trim();
    if (!text) continue;
    const match = text.match(/^(\d+):(\d+)\s+(.+)$/);
    if (!match) {
      console.warn(`  línea ignorada (sin formato "C:V texto"): ${text.slice(0, 60)}`);
      continue;
    }
    const chapter = Number(match[1]);
    const number = Number(match[2]);
    const verseText = match[3].trim();
    if (!byChapter[chapter]) byChapter[chapter] = [];
    byChapter[chapter].push({ number, text: verseText });
  }
  return byChapter;
}

/** Parses a .json file grouped by book and chapter. */
function parseJson(content) {
  const data = JSON.parse(content);
  for (const bookId of Object.keys(data)) {
    for (const chapter of Object.keys(data[bookId])) {
      data[bookId][chapter] = data[bookId][chapter].map((verse, i) => {
        if (typeof verse === "string") return { number: i + 1, text: verse };
        return verse;
      });
    }
  }
  return data;
}

function validateAgainstCatalog(books, flatCatalog) {
  const errors = [];
  const byId = new Map(flatCatalog.map((book) => [book.id, book]));
  for (const bookId of Object.keys(books)) {
    const book = byId.get(bookId);
    if (!book) {
      errors.push(`libro desconocido en la entrada: ${bookId}`);
      continue;
    }
    const chapters = Object.keys(books[bookId]).map(Number);
    const declaredChapters = Array.from({ length: book.chapters }, (_, i) => i + 1);
    for (const chapter of chapters) {
      if (chapter < 1 || chapter > book.chapters) {
        errors.push(`${bookId}: capítulo ${chapter} fuera de rango (máx. ${book.chapters})`);
      }
    }
    const missing = declaredChapters.filter((c) => !chapters.includes(c));
    if (missing.length) {
      console.warn(`  ${bookId}: faltan capítulos ${missing.join(", ")}`);
    }
  }
  return errors;
}

function run() {
  const args = parseArguments(process.argv);
  const input = args.input;
  const output = args.output || join(ROOT, "js", "data", "verses.json");
  const catalogPath = args.catalog || join(ROOT, "js", "data", "catalog.js");

  if (!input) {
    console.error(
      "Falta --input. Uso: node scripts/import_bible.mjs --input <directorio|archivo> [--output ruta] [--catalog ruta]"
    );
    process.exit(1);
  }

  console.log(`Catálogo:  ${catalogPath}`);
  console.log(`Entrada:   ${input}`);
  console.log(`Salida:    ${output}`);
  console.log("");

  const catalog = loadCatalog(catalogPath);
  const flatCatalog = flattenCatalog(catalog);
  console.log(`Catálogo cargado: ${flatCatalog.length} libros`);

  const books = {};
  const stats = [];
  const inputPath = input.startsWith("/") ? input : join(ROOT, input);
  const isDirectory = statSync(inputPath).isDirectory();

  if (isDirectory) {
    const files = readdirSync(inputPath).filter((f) => extname(f).toLowerCase() === ".txt");
    for (const file of files) {
      const bookId = basename(file, ".txt").toLowerCase();
      const content = readFileSync(join(inputPath, file), "utf8");
      books[bookId] = parseTxt(content);
      const verseCount = Object.values(books[bookId]).reduce((n, verses) => n + verses.length, 0);
      stats.push({ bookId, verseCount });
      console.log(`  ${bookId}: ${verseCount} versículos`);
    }
  } else {
    const content = readFileSync(inputPath, "utf8");
    Object.assign(
      books,
      extname(inputPath).toLowerCase() === ".json" ? parseJson(content) : parseTxt(content)
    );
    const verseCount = Object.values(books).reduce(
      (n, chapters) => n + Object.values(chapters).reduce((m, verses) => m + verses.length, 0),
      0
    );
    console.log(`  ${Object.keys(books).length} libros, ${verseCount} versículos`);
  }

  console.log("");
  const errors = validateAgainstCatalog(books, flatCatalog);
  if (errors.length) {
    console.error("Errores de validación:");
    for (const error of errors) console.error(`  - ${error}`);
    process.exit(1);
  }

  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, JSON.stringify(books, null, 2) + "\n", "utf8");
  console.log(`Dataset escrito en ${output}`);
}

run();
