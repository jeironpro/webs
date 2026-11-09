import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const MANIFIESTO = join(RAIZ, "assets", "screenshots", "capturas.json");

/** Fecha ISO del último commit que tocó una ruta; si no hay git, la del archivo. */
function fechaDeCommit(ruta) {
    try {
        const salida = execFileSync("git", ["log", "-1", "--format=%cI", "--", ruta], {
            cwd: RAIZ,
            stdio: ["ignore", "pipe", "ignore"],
        })
            .toString()
            .trim();
        if (salida) return salida;
    } catch {
        /* fuera de un checkout de git: se usa la fecha del archivo */
    }
    const absoluta = join(RAIZ, ruta);
    return existsSync(absoluta) ? statSync(absoluta).mtime.toISOString() : "";
}

/** Huella del HTML que muestra la tarjeta. */
function huellaDe(ruta) {
    const absoluta = join(RAIZ, ruta);
    if (!existsSync(absoluta)) return "";
    return createHash("sha256").update(readFileSync(absoluta)).digest("hex").slice(0, 16);
}

/** Página que captura la tarjeta: la url del catálogo, con su index.html. */
function paginaDe(web) {
    const relativa = web.url.replace(/^\.\//, "");
    if (/\.html?$/.test(relativa)) return relativa;
    return `${relativa}${relativa.endsWith("/") ? "" : "/"}index.html`;
}

const fecha = (valor) => {
    const t = Date.parse(valor);
    return Number.isNaN(t) ? 0 : t;
};

const webs = JSON.parse(readFileSync(join(RAIZ, "assets", "projects.json"), "utf8")).webs;
const manifestadas = existsSync(MANIFIESTO) ? JSON.parse(readFileSync(MANIFIESTO, "utf8")) : {};

const desfasadas = [];
const sinCaptura = [];

for (const web of webs) {
    const captura = `assets/screenshots/${web.id}.webp`;
    if (!existsSync(join(RAIZ, captura))) {
        sinCaptura.push(web.id);
        continue;
    }

    const pagina = paginaDe(web);
    const registro = manifestadas[web.id];
    const fCaptura =
        (typeof registro === "string" ? registro : registro?.fecha) || fechaDeCommit(captura);
    const fPagina = fechaDeCommit(pagina);
    const huellaGuardada = registro && typeof registro === "object" ? registro.huella : "";
    const huellaActual = huellaDe(pagina);

    if (huellaGuardada && huellaActual) {
        if (huellaGuardada === huellaActual) continue;
        desfasadas.push({ id: web.id, pagina, captura, fCaptura, fPagina, motivo: "contenido" });
        continue;
    }

    if (fecha(fPagina) > fecha(fCaptura)) {
        desfasadas.push({ id: web.id, pagina, captura, fCaptura, fPagina, motivo: "fecha" });
    }
}

const enCI = Boolean(process.env.GITHUB_ACTIONS);
const dia = (valor) => String(valor || "").slice(0, 10) || "sin fecha";

for (const d of desfasadas) {
    const detalle =
        d.motivo === "contenido"
            ? `${d.pagina} cambió desde la captura del ${dia(d.fCaptura)}`
            : `${d.captura} es del ${dia(d.fCaptura)} y ${d.pagina} cambió el ${dia(d.fPagina)}`;
    console.log(`  ! ${d.id}: ${detalle}`);
    if (enCI) console.log(`::warning file=${d.captura}::${detalle}`);
}
for (const id of sinCaptura) {
    const detalle = `${id} no tiene captura en assets/screenshots/${id}.webp`;
    console.log(`  ! ${detalle}`);
    if (enCI) console.log(`::warning file=projects.yml::${detalle}`);
}

console.log(
    `capturas: ${webs.length} revisadas, ${desfasadas.length} desfasadas, ${sinCaptura.length} sin captura.`
);
if (desfasadas.length > 0) {
    console.log(
        `Regenera con: npm run data:screenshots -- ${desfasadas.map((d) => d.id).join(" ")}`
    );
}
