import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { RAIZ, huellaDe, paginaDe } from "./lib/huella.mjs";

const MANIFIESTO = join(RAIZ, "assets", "screenshots", "capturas.json");
const TAMANO_MINIMO = 1024;

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

const fecha = (valor) => {
    const t = Date.parse(valor);
    return Number.isNaN(t) ? 0 : t;
};

const webs = JSON.parse(readFileSync(join(RAIZ, "assets", "projects.json"), "utf8")).webs;
const manifestadas = existsSync(MANIFIESTO) ? JSON.parse(readFileSync(MANIFIESTO, "utf8")) : {};

const desfasadas = [];
const sinCaptura = [];
const vacias = [];

for (const web of webs) {
    const captura = `assets/screenshots/${web.id}.webp`;
    const rutaCaptura = join(RAIZ, captura);
    if (!existsSync(rutaCaptura)) {
        sinCaptura.push(web.id);
        continue;
    }
    if (statSync(rutaCaptura).size < TAMANO_MINIMO) {
        vacias.push(web.id);
        continue;
    }

    const pagina = paginaDe(web.url);
    const registro = manifestadas[web.id];
    const fCaptura =
        (typeof registro === "string" ? registro : registro?.fecha) || fechaDeCommit(captura);
    const fPagina = fechaDeCommit(pagina);
    const huellaGuardada = registro && typeof registro === "object" ? registro.huella : "";
    const huellaActual = huellaDe(web.url);

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
    if (enCI) console.log(`::error file=${d.captura}::${detalle}`);
}
for (const id of sinCaptura) {
    const detalle = `${id} no tiene captura en assets/screenshots/${id}.webp`;
    console.log(`  ! ${detalle}`);
    if (enCI) console.log(`::error file=projects.yml::${detalle}`);
}
for (const id of vacias) {
    const detalle = `assets/screenshots/${id}.webp existe pero está vacía o corrupta`;
    console.log(`  ! ${detalle}`);
    if (enCI) console.log(`::error file=assets/screenshots/${id}.webp::${detalle}`);
}

console.log(
    `capturas: ${webs.length} revisadas, ${desfasadas.length} desfasadas, ${sinCaptura.length} sin captura, ${vacias.length} vacías.`
);
const pendientes = [...new Set([...desfasadas.map((d) => d.id), ...vacias])];
if (pendientes.length > 0) {
    console.log(`Regenera con: npm run data:screenshots -- --force ${pendientes.join(" ")}`);
}

process.exitCode = desfasadas.length + sinCaptura.length + vacias.length > 0 ? 1 : 0;
