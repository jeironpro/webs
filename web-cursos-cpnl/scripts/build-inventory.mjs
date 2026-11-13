import { readdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const PROJECT_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_DIR = "cpnl";
const OUTPUT_FILE = "js/inventory.generated.js";

function collectPdfs(dir) {
    const entries = readdirSync(dir, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        if (entry.isDirectory()) {
            if (entry.name.startsWith("_")) continue;
            files.push(...collectPdfs(fullPath));
        } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".pdf")) {
            files.push(fullPath);
        }
    }
    return files;
}

const pdfs = collectPdfs(join(PROJECT_ROOT, SOURCE_DIR))
    .map((filePath) => relative(PROJECT_ROOT, filePath).replaceAll("\\", "/"))
    .sort();

const body = `export const INVENTORY = ${JSON.stringify(pdfs, null, 4)};\n`;

writeFileSync(join(PROJECT_ROOT, OUTPUT_FILE), body);
process.stdout.write(`Inventario generado: ${pdfs.length} PDFs → ${OUTPUT_FILE}`);
