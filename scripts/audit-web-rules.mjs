/**
 * CLI de auditoría: recorre los ficheros HTML/CSS/JS versionados y agrupa los
 * hallazgos por web, para poder refactorizar por lotes y medir el avance.
 *
 * Uso:
 *   node scripts/audit-web-rules.mjs                 # resumen por web
 *   node scripts/audit-web-rules.mjs --regla js-var  # solo una regla
 *   node scripts/audit-web-rules.mjs --web web-juegos --detalle
 *   node scripts/audit-web-rules.mjs --json
 *   node scripts/audit-web-rules.mjs --fail          # sale 1 si hay hallazgos
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { REGLAS, analizarArchivo } from "./lib/rules.mjs";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const GRUPO_RAIZ = "(raíz)";

/** CSS compilado (Tailwind, bundles) o minificado: no se edita a mano. */
function esCssGenerado(contenido) {
    const cabecera = contenido.slice(0, 300);
    if (/tailwindcss/i.test(cabecera) || contenido.includes("@layer properties{")) return true;
    const lineaMasLarga = contenido
        .split("\n")
        .reduce((maximo, linea) => Math.max(maximo, linea.length), 0);
    return lineaMasLarga > 500;
}

/** Rutas que no son código propio: dependencias, builds y terceros. */
const EXCLUIDAS = /(^|\/)(node_modules|vendor|dist|site|\.yarn|coverage)\//;
/** Salidas de bundler con hash en el nombre (Vite, Rollup...): no se editan a mano. */
const COMPILADOS = /(^|\/)assets\/[^/]+-[A-Za-z0-9_-]{8}\.(m?js|css)$/;
const EXTENSIONES = /\.(html?|css|m?js)$/i;

function argumento(nombre) {
    const indice = process.argv.indexOf(`--${nombre}`);
    if (indice === -1) return null;
    const valor = process.argv[indice + 1];
    return valor && !valor.startsWith("--") ? valor : true;
}

function ficherosVersionados() {
    const salida = execFileSync("git", ["ls-files"], { cwd: RAIZ }).toString();
    return salida
        .split("\n")
        .filter(Boolean)
        .filter((ruta) => EXTENSIONES.test(ruta))
        .filter((ruta) => !EXCLUIDAS.test(ruta))
        .filter((ruta) => !/\.min\.(js|css)$/i.test(ruta))
        .filter((ruta) => !COMPILADOS.test(ruta));
}

/** Agrupa por carpeta `web-*`; todo lo demás (raíz y scripts) es un solo grupo. */
function grupoDe(ruta) {
    const primera = ruta.split("/")[0];
    return primera.startsWith("web-") ? primera : GRUPO_RAIZ;
}

function auditar() {
    const porWeb = new Map();
    const resumenReglas = new Map();

    ficherosVersionados().forEach((ruta) => {
        let contenido;
        try {
            contenido = readFileSync(join(RAIZ, ruta), "utf8");
        } catch {
            return; // fichero declarado pero ausente (submódulo, fichero borrado)
        }
        if (/\.css$/i.test(ruta) && esCssGenerado(contenido)) return;
        const hallazgos = analizarArchivo(ruta, contenido);
        if (hallazgos.length === 0) return;

        const grupo = grupoDe(ruta);
        if (!porWeb.has(grupo))
            porWeb.set(grupo, { web: grupo, total: 0, porRegla: {}, detalle: [] });
        const entrada = porWeb.get(grupo);
        hallazgos.forEach((hallazgo) => {
            entrada.total += 1;
            entrada.porRegla[hallazgo.regla] = (entrada.porRegla[hallazgo.regla] ?? 0) + 1;
            entrada.detalle.push({ ...hallazgo, ruta });
            resumenReglas.set(hallazgo.regla, (resumenReglas.get(hallazgo.regla) ?? 0) + 1);
        });
    });

    return { porWeb, resumenReglas };
}

function tablaPorWeb(webs) {
    const cabecera = ["web", "HTML", "CSS", "JS", "total"];
    const filas = webs.map((entrada) => {
        const deTipo = (tipo) =>
            Object.entries(entrada.porRegla)
                .filter(([regla]) => REGLAS[regla].tipo === tipo)
                .reduce((suma, [, valor]) => suma + valor, 0);
        return [entrada.web, deTipo("html"), deTipo("css"), deTipo("js"), entrada.total];
    });
    const anchos = cabecera.map((titulo, columna) =>
        Math.max(titulo.length, ...filas.map((fila) => String(fila[columna]).length))
    );
    const formatear = (fila) =>
        fila.map((celda, columna) => String(celda).padEnd(anchos[columna])).join("  ");

    const lineas = [formatear(cabecera), anchos.map((ancho) => "-".repeat(ancho)).join("  ")];
    filas.forEach((fila) => lineas.push(formatear(fila)));
    return lineas.join("\n");
}

const { porWeb, resumenReglas } = auditar();
const filtroWeb = argumento("web");
const filtroRegla = argumento("regla");
const detalle = argumento("detalle") === true;
const comoJson = argumento("json") === true;
const fallar = argumento("fail") === true;

let webs = [...porWeb.values()].sort((a, b) => b.total - a.total);
if (typeof filtroWeb === "string") webs = webs.filter((entrada) => entrada.web === filtroWeb);
if (typeof filtroRegla === "string") webs = webs.filter((entrada) => entrada.porRegla[filtroRegla]);

const totalGeneral = webs.reduce((suma, entrada) => suma + entrada.total, 0);

if (comoJson) {
    console.log(JSON.stringify({ total: totalGeneral, webs }, null, 2));
} else if (webs.length === 0) {
    console.log("Sin hallazgos para ese filtro.");
} else {
    console.log(`Hallazgos por web (${totalGeneral} en ${webs.length} webs)\n`);
    console.log(tablaPorWeb(webs));

    console.log("\nPor regla");
    [...resumenReglas.entries()]
        .filter(([regla]) => !filtroRegla || regla === filtroRegla)
        .sort((a, b) => b[1] - a[1])
        .forEach(([regla, cuenta]) => {
            console.log(
                `  ${String(cuenta).padStart(5)}  ${regla.padEnd(20)} ${REGLAS[regla].descripcion}`
            );
        });

    if (detalle) {
        console.log("\nDetalle");
        webs.forEach((entrada) => {
            console.log(`\n${entrada.web}`);
            entrada.detalle
                .filter((hallazgo) => !filtroRegla || hallazgo.regla === filtroRegla)
                .forEach((hallazgo) => {
                    console.log(
                        `  ${hallazgo.ruta}:${hallazgo.linea}  [${hallazgo.regla}]  ${hallazgo.fragmento}`
                    );
                });
        });
    }
}

process.exitCode = fallar && totalGeneral > 0 ? 1 : 0;
