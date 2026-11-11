#!/usr/bin/env node
/**
 * Comprueba los enlaces internos del sitio contra el conjunto real de archivos
 * publicados (los que están en git, que es lo que sube Pages).
 *
 * - Ignora enlaces externos, anclas, mailto/tel/javascript y las plantillas.
 * - No cuenta el contenido de <pre>, <code>, <script>, <style> ni los
 *   comentarios: ahí hay ejemplos de código con rutas que no son enlaces.
 * - En el CSS de las SPA resuelve las rutas absolutas contra su public/,
 *   igual que hace Vite al compilar.
 * - Sale con código 1 si encuentra algún destino inexistente.
 */
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import posix from "node:path";

const ignora = (p) =>
    p.startsWith(".git/") ||
    p.includes("/node_modules/") ||
    p.startsWith("node_modules/") ||
    p.startsWith("dist/") ||
    p.includes("/dist/") ||
    p.includes("/vendor/") ||
    p.endsWith("package-lock.json") ||
    p.endsWith(".map") ||
    p.endsWith(".min.js");

let archivos;
try {
    archivos = execSync("git ls-files -z", { maxBuffer: 1 << 28 })
        .toString()
        .split("\0")
        .filter(Boolean);
} catch {
    console.error("check-links: hace falta un checkout de git para saber qué se publica.");
    process.exit(2);
}
const publicados = new Set(archivos.filter((f) => !ignora(f)));
// Los destinos sí incluyen ficheros minificados o vendorizados: el deploy
// publica todo el repo, así que una referencia a ellos es un enlace real.
const existentes = new Set(
    archivos.filter(
        (f) =>
            !f.startsWith(".git/") &&
            !f.includes("node_modules/") &&
            !f.includes("/dist/") &&
            !f.startsWith("dist/")
    )
);

const esCatalogo = (f) => /(^|\/)projects\.yml$/.test(f) || /(^|\/)assets\/projects\.json$/.test(f);
const baseCatalogo = (f) =>
    /(^|\/)assets\/projects\.json$/.test(f)
        ? f === "assets/projects.json"
            ? ""
            : posix.dirname(posix.dirname(f))
        : posix.dirname(f);

const fuentes = [...publicados].filter(
    (f) => /\.(html?|css)$/i.test(f) || esCatalogo(f) || /(^|\/)data\/manifest\.json$/.test(f)
);

const limpiarHtml = (html) =>
    html
        .replace(/<!--[\s\S]*?-->/g, "")
        .replace(/<script\b([^>]*)>[\s\S]*?<\/script>/gi, "<script$1></script>")
        .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<pre\b[^>]*>[\s\S]*?<\/pre>/gi, "")
        .replace(/<code\b[^>]*>[\s\S]*?<\/code>/gi, "")
        .replace(/&lt;[^&\n]{0,400}?&gt;/g, "");

const refs = [];
const añadir = (src, raw) => {
    if (raw && raw.trim()) refs.push({ src, raw: raw.trim() });
};

const attr = /\b(href|src|poster|data-src)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
const srcset = /\bsrcset\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
const cssUrl = /url\(\s*(['"]?)([^'")]+)\1\s*\)/gi;
const cssImport = /@import\s+(?:url\(\s*)?(['"])(\.{0,2}\/[^'"]+)\1/gi;

const esSpa = (f) => /\/src\/main\.[jt]sx?/.test(readFileSync(f, "utf8"));

for (const f of fuentes) {
    if (esCatalogo(f)) {
        const txt = readFileSync(f, "utf8");
        const yaml = /^\s*(screenshot|url|cover|imagen|image)\s*:\s*(\S+)\s*$/gim;
        const json = /"(screenshot|url|cover|image)"\s*:\s*"([^"]*)"/g;
        let m;
        while ((m = yaml.exec(txt))) añadir(f, m[2].replace(/^["']|["']$/g, ""));
        while ((m = json.exec(txt))) añadir(f, m[2]);
        continue;
    }
    if (f.endsWith(".json")) continue; // data/manifest.json: rutas internas del curso, no URLs
    const ext = f.split(".").pop().toLowerCase();
    if (ext === "css") {
        const txt = readFileSync(f, "utf8");
        let m;
        while ((m = cssUrl.exec(txt))) añadir(f, m[2]);
        while ((m = cssImport.exec(txt))) añadir(f, m[2]);
        continue;
    }
    // las páginas SPA se compilan en el deploy: su HTML fuente no es el publicado
    if (f.endsWith(".src.html") || esSpa(f)) continue;
    const txt = limpiarHtml(readFileSync(f, "utf8"));
    let m;
    while ((m = attr.exec(txt))) añadir(f, m[2] ?? m[3]);
    while ((m = srcset.exec(txt)))
        for (const parte of (m[1] ?? m[2]).split(",")) añadir(f, parte.trim().split(/\s+/)[0]);
}

const esCssDeSpa = (f) => f.split(".").pop().toLowerCase() === "css" && /\/src\//.test(f);
const raizSpa = (f) => f.slice(0, f.indexOf("/src/"));

const resolver = (src, raw) => {
    let u = raw.trim();
    if (!u || u.startsWith("#") || /^(mailto:|tel:|javascript:|data:|blob:|about:)/i.test(u))
        return null;
    if (u.includes("{{") || u.includes("${") || u.startsWith("//") || u.includes("%7B"))
        return null;
    u = u.split("#")[0].split("?")[0];
    if (!u) return null;
    if (/^https?:\/\//i.test(u)) {
        let url;
        try {
            url = new URL(u);
        } catch {
            return null;
        }
        if (url.hostname === "jeironpro.github.io" && url.pathname.startsWith("/webs/")) {
            return { ruta: decodeURIComponent(url.pathname.slice("/webs/".length)) };
        }
        return null;
    }
    if (u.startsWith("/webs/")) return { ruta: decodeURIComponent(u.slice("/webs/".length)) };
    if (u.startsWith("/")) {
        if (esCssDeSpa(src))
            return {
                ruta: posix.normalize(
                    posix.join(raizSpa(src), "public", decodeURIComponent(u.slice(1)))
                ),
            };
        return { ruta: decodeURIComponent(u.slice(1)), fuera: true };
    }
    const base = esCatalogo(src) ? baseCatalogo(src) : posix.dirname(src);
    return { ruta: posix.normalize(posix.join(base === "." ? "" : base, decodeURIComponent(u))) };
};

const existe = (p) => {
    if (p === "" || p === "." || p === "./") return true;
    if (p.startsWith("../")) return false;
    if (p.endsWith("/")) return existentes.has(p + "index.html");
    return existentes.has(p) || existentes.has(p + "/index.html") || existentes.has(p + ".html");
};

const rotos = new Map();
for (const r of refs) {
    const res = resolver(r.src, r.raw);
    if (!res) continue;
    if (!res.fuera && existe(res.ruta)) continue;
    const clave = res.fuera ? `[fuera de /webs/] ${res.ruta}` : res.ruta;
    if (!rotos.has(clave)) rotos.set(clave, []);
    rotos.get(clave).push(r);
}

if (rotos.size === 0) {
    console.log(`check-links: ${refs.length} referencias revisadas, 0 enlaces internos rotos.`);
    process.exit(0);
}

console.error(`check-links: ${refs.length} referencias revisadas, ${rotos.size} destinos rotos.\n`);
for (const [destino, lista] of [...rotos.entries()]
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 60)) {
    console.error(`  ${destino}  (${lista.length} referencia(s))`);
    for (const r of lista.slice(0, 3)) console.error(`      ${r.src}  ->  ${r.raw}`);
    if (lista.length > 3) console.error(`      … +${lista.length - 3}`);
}
if (rotos.size > 60) console.error(`  … y ${rotos.size - 60} destinos más`);
process.exit(1);
