import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

/** Página que captura la tarjeta: la url del catálogo, con su index.html. */
export function paginaDe(url) {
    const relativa = String(url || "").replace(/^\.\//, "");
    if (/\.html?$/.test(relativa)) return relativa;
    return `${relativa}${relativa.endsWith("/") ? "" : "/"}index.html`;
}

/** Recursos locales CSS/JS referenciados por el HTML, en orden estable. */
function recursosDe(html, pagina) {
    const base = dirname(join(RAIZ, pagina));
    const vistos = new Set();
    for (const match of html.matchAll(/(?:href|src)\s*=\s*["']([^"']+)["']/gi)) {
        const crudo = match[1].split(/[?#]/)[0].trim();
        if (!/\.(?:css|js)$/i.test(crudo)) continue;
        if (/^(?:[a-z]+:)?\/\//i.test(crudo) || crudo.startsWith("data:")) continue;
        const absoluta = crudo.startsWith("/") ? join(RAIZ, crudo) : resolve(base, crudo);
        if (!absoluta.startsWith(RAIZ)) continue;
        vistos.add(relative(RAIZ, absoluta));
    }
    return [...vistos].sort();
}

/** Huella del HTML y de sus CSS/JS locales: delata cambios aunque el commit sea posterior. */
export function huellaDe(url) {
    const pagina = paginaDe(url);
    const absoluta = join(RAIZ, pagina);
    if (!existsSync(absoluta)) return "";
    const html = readFileSync(absoluta);
    const hash = createHash("sha256").update(html);

    for (const recurso of recursosDe(html.toString("utf8"), pagina)) {
        hash.update(recurso);
        const ruta = join(RAIZ, recurso);
        if (existsSync(ruta)) hash.update(readFileSync(ruta));
    }

    return hash.digest("hex").slice(0, 16);
}

export { RAIZ };
