// Servidor estático local (cero dependencias) para desarrollo.
// Uso: npm run dev  (equivale a: node scripts/servir.js)
//
// Los ES Modules no cargan con file://, por lo que el proyecto se sirve
// por HTTP. Puerto por defecto: 4173 (se puede cambiar con PORT).

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { dirname, extname, join, normalize, sep } from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";

const ROOT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..");
const SAFE_ROOT = ROOT_DIR.endsWith(sep) ? ROOT_DIR : `${ROOT_DIR}${sep}`;
const INITIAL_PORT = Number(process.env.PORT) || 4173;

const CONTENT_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".mjs": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".ico": "image/x-icon",
    ".md": "text/markdown; charset=utf-8",
};

async function handleRequest(req, res) {
    const url = new URL(req.url ?? "/", "http://localhost");
    let path = decodeURIComponent(url.pathname);
    if (path === "/") {
        path = "/index.html";
    }

    const file = normalize(join(ROOT_DIR, path));
    if (!file.startsWith(SAFE_ROOT)) {
        res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("403 — Prohibido");
        return;
    }

    try {
        const info = await stat(file);
        if (!info.isFile()) {
            throw new Error("No es un archivo");
        }
        const content = await readFile(file);
        res.writeHead(200, {
            "Content-Type": CONTENT_TYPES[extname(file)] ?? "application/octet-stream",
        });
        res.end(content);
    } catch {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("404 — No encontrado");
    }
}

function start(port) {
    const server = createServer(handleRequest);
    server.on("error", (error) => {
        if (error.code === "EADDRINUSE" && port < INITIAL_PORT + 10) {
            start(port + 1);
        } else {
            console.error("Error al iniciar el servidor:", error.message);
            process.exitCode = 1;
        }
    });
    server.listen(port, () => {
        console.log(`Javarcises disponible en http://localhost:${port}`);
    });
}

start(INITIAL_PORT);
