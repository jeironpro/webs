import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import { parse } from "yaml";

const ARCHIVO_YM = join(join(dirname(fileURLToPath(import.meta.url)), ".."), "..", "projects.yml");
const SALIDA_JSON = join(
    join(dirname(fileURLToPath(import.meta.url)), ".."),
    "..",
    "assets",
    "projects.json"
);

const RAICES_PERMITIDAS = ["html", "css", "javascript", "typescript", "react", "vite", "tailwind"];
const CATEGORIAS_PERMITIDAS = ["administracion", "finanzas", "monitoreo", "analitica", "soporte"];
const ESTADOS_PERMITIDOS = ["live", "pendiente", "externo"];
const ID_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function leerProjects() {
    const doc = parse(readFileSync(ARCHIVO_YM, "utf8"));
    if (!doc || !Array.isArray(doc.dashboards)) {
        throw new Error("projects.yml debe tener una lista top-level `dashboards`");
    }
    return doc.dashboards;
}

export function validarDashboard(dashboard, errores) {
    const { id } = dashboard;
    const ref = id ? `[${id}]` : "[?]";
    const push = (campo, motivo) => errores.push(`${ref} ${campo}: ${motivo}`);

    if (typeof id !== "string" || !ID_REGEX.test(id)) {
        push("id", `el id "${id}" no es valido (solo minusculas, numeros y guiones)`);
    }
    if (typeof dashboard.titulo !== "string" || dashboard.titulo.trim().length === 0) {
        push("titulo", "obligatorio y no vacio");
    } else if (dashboard.titulo.length > 60) {
        push("titulo", "no debe superar 60 caracteres");
    }
    if (typeof dashboard.descripcion !== "string" || dashboard.descripcion.trim().length < 10) {
        push("descripcion", "obligatoria y de al menos 10 caracteres");
    } else if (dashboard.descripcion.length > 240) {
        push("descripcion", "no debe superar 240 caracteres");
    }
    if (dashboard.url !== `./${id}/`) {
        push("url", `debe ser el subpath relativo "./${id}/"`);
    }
    if (dashboard.repo !== `https://github.com/jeironpro/dashboards/tree/main/${id}`) {
        push("repo", "debe apuntar a la ruta del monorepo en main");
    }
    const rutaCaptura = new URL(`../../${dashboard.screenshot}`, import.meta.url);
    if (!existsSync(fileURLToPath(rutaCaptura))) {
        push("screenshot", `no existe la captura "${dashboard.screenshot}"`);
    }
    if (!Array.isArray(dashboard.stack) || dashboard.stack.length === 0) {
        push("stack", "debe ser una lista no vacia");
    } else {
        dashboard.stack.forEach((s) => {
            if (!RAICES_PERMITIDAS.includes(s)) {
                push("stack", `tecnologia "${s}" no permitida (${RAICES_PERMITIDAS.join(", ")})`);
            }
        });
    }
    if (!Array.isArray(dashboard.categorias) || dashboard.categorias.length === 0) {
        push("categorias", "debe ser una lista no vacia");
    } else {
        dashboard.categorias.forEach((c) => {
            if (!CATEGORIAS_PERMITIDAS.includes(c)) {
                push(
                    "categorias",
                    `dominio "${c}" no permitido (${CATEGORIAS_PERMITIDAS.join(", ")})`
                );
            }
        });
    }
    if (!Array.isArray(dashboard.tags) || dashboard.tags.length === 0) {
        push("tags", "debe ser una lista no vacia");
    } else if (!dashboard.tags.every((t) => typeof t === "string" && /^[a-z0-9 ]+$/.test(t))) {
        push("tags", "solo minusculas, numeros y espacios");
    }
    if (!ESTADOS_PERMITIDOS.includes(dashboard.estado)) {
        push("estado", `debe ser uno de ${ESTADOS_PERMITIDOS.join(", ")}`);
    }
    if (typeof dashboard.destacado !== "boolean") {
        push("destacado", "debe ser booleano");
    }
}

export function validarCarpetasLocales(dashboards, errores) {
    const raiz = dirname(ARCHIVO_YM);
    const locales = readdirSync(raiz, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name)
        .filter((n) => /^dashboard-/.test(n));
    const enDataset = new Set(dashboards.map((j) => j.id));
    locales.forEach((n) => {
        if (!enDataset.has(n)) {
            errores.push(`[${n}] falta su entrada en projects.yml`);
        }
    });
    dashboards.forEach((j) => {
        if (!locales.includes(j.id)) {
            errores.push(`[${j.id}] no existe la carpeta local ${j.id}`);
        }
    });
}

export function validar(dashboards) {
    const errores = [];
    const vistos = new Set();
    dashboards.forEach((j) => {
        if (vistos.has(j.id)) {
            errores.push(`[${j.id}] id duplicado`);
        }
        vistos.add(j.id);
        validarDashboard(j, errores);
    });
    validarCarpetasLocales(dashboards, errores);
    return errores;
}

export function construirJSON(dashboards) {
    const ordenadas = [...dashboards].sort((a, b) => a.titulo.localeCompare(b.titulo, "es"));
    return {
        proyecto: "dashboards",
        actualizado: new Date().toISOString().slice(0, 10),
        total: ordenadas.length,
        dashboards: ordenadas,
    };
}

export function generar(output = SALIDA_JSON) {
    const dashboards = leerProjects();
    const errores = validar(dashboards);
    if (errores.length > 0) {
        return { errores };
    }
    writeFileSync(output, `${JSON.stringify(construirJSON(dashboards), null, 2)}\n`, "utf8");
    return { output: pathToFileURL(output).href };
}
