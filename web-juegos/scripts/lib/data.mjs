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

const RAICES_PERMITIDAS = ["html", "css", "javascript", "react", "vite"];
const CATEGORIAS_PERMITIDAS = ["tablero", "palabras", "logica", "memoria", "reflejos"];
const ESTADOS_PERMITIDOS = ["live", "pendiente", "externo"];
const ID_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function leerProjects() {
    const doc = parse(readFileSync(ARCHIVO_YM, "utf8"));
    if (!doc || !Array.isArray(doc.juegos)) {
        throw new Error("projects.yml debe tener una lista top-level `juegos`");
    }
    return doc.juegos;
}

export function validarJuego(juego, errores) {
    const { id } = juego;
    const ref = id ? `[${id}]` : "[?]";
    const push = (campo, motivo) => errores.push(`${ref} ${campo}: ${motivo}`);

    if (typeof id !== "string" || !ID_REGEX.test(id)) {
        push("id", `el id "${id}" no es valido (solo minusculas, numeros y guiones)`);
    }
    if (typeof juego.titulo !== "string" || juego.titulo.trim().length === 0) {
        push("titulo", "obligatorio y no vacio");
    } else if (juego.titulo.length > 60) {
        push("titulo", "no debe superar 60 caracteres");
    }
    if (typeof juego.descripcion !== "string" || juego.descripcion.trim().length < 10) {
        push("descripcion", "obligatoria y de al menos 10 caracteres");
    } else if (juego.descripcion.length > 240) {
        push("descripcion", "no debe superar 240 caracteres");
    }
    if (juego.url !== `./${id}/`) {
        push("url", `debe ser el subpath relativo "./${id}/"`);
    }
    if (juego.repo !== `https://github.com/jeironpro/juegos/tree/main/${id}`) {
        push("repo", "debe apuntar a la ruta del monorepo en main");
    }
    const rutaCaptura = new URL(`../../${juego.screenshot}`, import.meta.url);
    if (!existsSync(fileURLToPath(rutaCaptura))) {
        push("screenshot", `no existe la captura "${juego.screenshot}"`);
    }
    if (!Array.isArray(juego.stack) || juego.stack.length === 0) {
        push("stack", "debe ser una lista no vacia");
    } else {
        juego.stack.forEach((s) => {
            if (!RAICES_PERMITIDAS.includes(s)) {
                push("stack", `tecnologia "${s}" no permitida (${RAICES_PERMITIDAS.join(", ")})`);
            }
        });
    }
    if (!Array.isArray(juego.categorias) || juego.categorias.length === 0) {
        push("categorias", "debe ser una lista no vacia");
    } else {
        juego.categorias.forEach((c) => {
            if (!CATEGORIAS_PERMITIDAS.includes(c)) {
                push(
                    "categorias",
                    `genero "${c}" no permitido (${CATEGORIAS_PERMITIDAS.join(", ")})`
                );
            }
        });
    }
    if (!Array.isArray(juego.tags) || juego.tags.length === 0) {
        push("tags", "debe ser una lista no vacia");
    } else if (!juego.tags.every((t) => typeof t === "string" && /^[a-z0-9 ]+$/.test(t))) {
        push("tags", "solo minusculas, numeros y espacios");
    }
    if (!ESTADOS_PERMITIDOS.includes(juego.estado)) {
        push("estado", `debe ser uno de ${ESTADOS_PERMITIDOS.join(", ")}`);
    }
    if (typeof juego.destacado !== "boolean") {
        push("destacado", "debe ser booleano");
    }
}

export function validarCarpetasLocales(juegos, errores) {
    const raiz = dirname(ARCHIVO_YM);
    const locales = readdirSync(raiz, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name)
        .filter((n) => /^juego-/.test(n));
    const enDataset = new Set(juegos.map((j) => j.id));
    locales.forEach((n) => {
        if (!enDataset.has(n)) {
            errores.push(`[${n}] falta su entrada en projects.yml`);
        }
    });
    juegos.forEach((j) => {
        if (!locales.includes(j.id)) {
            errores.push(`[${j.id}] no existe la carpeta local ${j.id}`);
        }
    });
}

export function validar(juegos) {
    const errores = [];
    const vistos = new Set();
    juegos.forEach((j) => {
        if (vistos.has(j.id)) {
            errores.push(`[${j.id}] id duplicado`);
        }
        vistos.add(j.id);
        validarJuego(j, errores);
    });
    validarCarpetasLocales(juegos, errores);
    return errores;
}

export function construirJSON(juegos) {
    const ordenadas = [...juegos].sort((a, b) => a.titulo.localeCompare(b.titulo, "es"));
    return {
        proyecto: "juegos",
        actualizado: new Date().toISOString().slice(0, 10),
        total: ordenadas.length,
        juegos: ordenadas,
    };
}

export function generar(output = SALIDA_JSON) {
    const juegos = leerProjects();
    const errores = validar(juegos);
    if (errores.length > 0) {
        return { errores };
    }
    writeFileSync(output, `${JSON.stringify(construirJSON(juegos), null, 2)}\n`, "utf8");
    return { output: pathToFileURL(output).href };
}
