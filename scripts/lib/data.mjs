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

const RAICES_PERMITIDAS = [
    "html",
    "css",
    "javascript",
    "typescript",
    "react",
    "vite",
    "tailwind",
    "gsap",
    "three",
    "svg",
];
const CATEGORIAS_PERMITIDAS = [
    "utilidades",
    "generadores",
    "educacion",
    "entretenimiento",
    "productividad",
    "referencia",
    "curricular",
];
const ESTADOS_PERMITIDOS = ["live", "pendiente", "externo"];
const ID_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function leerProjects() {
    const doc = parse(readFileSync(ARCHIVO_YM, "utf8"));
    if (!doc || !Array.isArray(doc.webs)) {
        throw new Error("projects.yml debe tener una lista top-level `webs`");
    }
    return doc.webs;
}

export function validarWeb(web, errores) {
    const { id } = web;
    const ref = id ? `[${id}]` : "[?]";
    const push = (campo, motivo) => errores.push(`${ref} ${campo}: ${motivo}`);

    if (typeof id !== "string" || !ID_REGEX.test(id)) {
        push("id", `el id "${id}" no es valido (solo minusculas, numeros y guiones)`);
    }
    if (typeof web.titulo !== "string" || web.titulo.trim().length === 0) {
        push("titulo", "obligatorio y no vacio");
    } else if (web.titulo.length > 60) {
        push("titulo", "no debe superar 60 caracteres");
    }
    if (typeof web.descripcion !== "string" || web.descripcion.trim().length < 10) {
        push("descripcion", "obligatoria y de al menos 10 caracteres");
    } else if (web.descripcion.length > 240) {
        push("descripcion", "no debe superar 240 caracteres");
    }
    if (web.url !== `./${id}/`) {
        push("url", `debe ser el subpath relativo "./${id}/"`);
    }
    if (web.repo !== `https://github.com/jeironpro/webs/tree/main/${id}`) {
        push("repo", "debe apuntar a la ruta del monorepo en main");
    }
    const rutaCaptura = new URL(`../../${web.screenshot}`, import.meta.url);
    if (!existsSync(fileURLToPath(rutaCaptura))) {
        push("screenshot", `no existe la captura "${web.screenshot}"`);
    }
    if (!Array.isArray(web.stack) || web.stack.length === 0) {
        push("stack", "debe ser una lista no vacia");
    } else {
        web.stack.forEach((s) => {
            if (!RAICES_PERMITIDAS.includes(s)) {
                push("stack", `tecnologia "${s}" no permitida (${RAICES_PERMITIDAS.join(", ")})`);
            }
        });
    }
    if (!Array.isArray(web.categorias) || web.categorias.length === 0) {
        push("categorias", "debe ser una lista no vacia");
    } else {
        web.categorias.forEach((c) => {
            if (!CATEGORIAS_PERMITIDAS.includes(c)) {
                push(
                    "categorias",
                    `categoria "${c}" no permitida (${CATEGORIAS_PERMITIDAS.join(", ")})`
                );
            }
        });
    }
    if (!Array.isArray(web.tags) || web.tags.length === 0) {
        push("tags", "debe ser una lista no vacia");
    } else if (!web.tags.every((t) => typeof t === "string" && /^[a-z0-9 ]+$/.test(t))) {
        push("tags", "solo minusculas, numeros y espacios");
    }
    if (!ESTADOS_PERMITIDOS.includes(web.estado)) {
        push("estado", `debe ser uno de ${ESTADOS_PERMITIDOS.join(", ")}`);
    }
    if (typeof web.destacado !== "boolean") {
        push("destacado", "debe ser booleano");
    }
}

export function validarCarpetasLocales(webs, errores) {
    const raiz = dirname(ARCHIVO_YM);
    const locales = readdirSync(raiz, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name)
        .filter((n) => /^web-/.test(n));
    const enDataset = new Set(webs.map((w) => w.id));
    locales.forEach((n) => {
        if (!enDataset.has(n)) {
            errores.push(`[${n}] falta su entrada en projects.yml`);
        }
    });
    webs.forEach((w) => {
        if (!locales.includes(w.id)) {
            errores.push(`[${w.id}] no existe la carpeta local ${w.id}`);
        }
    });
}

export function validar(webs) {
    const errores = [];
    const vistos = new Set();
    webs.forEach((w) => {
        if (vistos.has(w.id)) {
            errores.push(`[${w.id}] id duplicado`);
        }
        vistos.add(w.id);
        validarWeb(w, errores);
    });
    validarCarpetasLocales(webs, errores);
    return errores;
}

export function construirJSON(webs) {
    const ordenadas = [...webs].sort((a, b) => a.titulo.localeCompare(b.titulo, "es"));
    return {
        proyecto: "webs",
        actualizado: new Date().toISOString().slice(0, 10),
        total: ordenadas.length,
        webs: ordenadas,
    };
}

export function generar(output = SALIDA_JSON) {
    const webs = leerProjects();
    const errores = validar(webs);
    if (errores.length > 0) {
        return { errores };
    }
    writeFileSync(output, `${JSON.stringify(construirJSON(webs), null, 2)}\n`, "utf8");
    return { output: pathToFileURL(output).href };
}
