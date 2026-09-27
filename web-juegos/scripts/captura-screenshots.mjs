import { existsSync, mkdirSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { execFile, spawn } from "node:child_process";
import { leerProjects } from "./lib/data.mjs";

const RAIZ = fileURLToPath(new URL("..", import.meta.url));
const DIR_SCREENSHOTS = join(RAIZ, "assets", "screenshots");
const PUERTO = 8941;
const FUERZA = process.argv.includes("--force");
const CONCURRENCIA = 4;
const CHROME = "/usr/bin/google-chrome";
const PROBE = "juego-ajedrez";

async function servir() {
    const server = spawn(
        "python3",
        ["-m", "http.server", String(PUERTO), "--bind", "127.0.0.1", "--directory", RAIZ],
        {
            stdio: "ignore",
        }
    );
    for (let i = 0; i < 50; i++) {
        try {
            const res = await fetch(`http://127.0.0.1:${PUERTO}/${PROBE}/`);
            if (res.ok) return server;
        } catch {
            /* reintenta */
        }
        await new Promise((r) => setTimeout(r, 200));
    }
    throw new Error("no se pudo arrancar el servidor estatico");
}

function capturar(id) {
    return new Promise((resolve) => {
        const png = join("/tmp", `gj-${id}.png`);
        const webp = join(DIR_SCREENSHOTS, `${id}.webp`);
        if (!FUERZA && existsSync(webp)) {
            console.log(`  ~ ${id} ya existe`);
            return resolve(true);
        }
        rmSync(png, { force: true });
        const perfil = join("/tmp", `gj-profile-${id}`);
        const chrome = spawn(
            CHROME,
            [
                "--headless=new",
                "--disable-gpu",
                "--no-first-run",
                "--no-default-browser-check",
                "--hide-scrollbars",
                `--user-data-dir=${perfil}`,
                "--window-size=1280,800",
                "--virtual-time-budget=15000",
                `--screenshot=${png}`,
                `http://127.0.0.1:${PUERTO}/${id}/`,
            ],
            { stdio: ["ignore", "ignore", "ignore"] }
        );
        const temporizador = setTimeout(() => chrome.kill("SIGKILL"), 60000);
        chrome.on("close", (code) => {
            clearTimeout(temporizador);
            if (!existsSync(png)) {
                console.log(`  x ${id} sin captura (exit ${code})`);
                return resolve(false);
            }
            execFile("magick", ["-quiet", png, "-quality", "82", webp], () => {
                rmSync(png, { force: true });
                rmSync(perfil, { recursive: true, force: true });
                console.log(`  o ${id} -> ${webp}`);
                resolve(existsSync(webp));
            });
        });
    });
}

async function cola(items, concurrency, trabajo) {
    const resultados = new Array(items.length);
    let indice = 0;
    async function obrero() {
        while (indice < items.length) {
            const pos = indice++;
            resultados[pos] = await trabajo(items[pos]);
        }
    }
    await Promise.all(Array.from({ length: concurrency }, obrero));
    return resultados;
}

async function main() {
    mkdirSync(DIR_SCREENSHOTS, { recursive: true });
    const juegos = leerProjects();
    console.log(`Capturando ${juegos.length} juegos en http://127.0.0.1:${PUERTO}/`);
    const servidor = await servir();
    const ids = juegos.map((j) => j.id);
    const ok = await cola(ids, CONCURRENCIA, capturar);
    servidor.kill("SIGTERM");
    const fallidas = ids.filter((_, i) => !ok[i]);
    if (fallidas.length > 0) {
        console.error(`Fallaron ${fallidas.length}: ${fallidas.join(", ")}`);
        process.exit(1);
    }
    console.log("Capturas completas.");
}

main();
