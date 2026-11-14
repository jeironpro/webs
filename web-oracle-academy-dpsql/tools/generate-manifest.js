import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SITE_ROOT_PATH = fileURLToPath(new URL("..", import.meta.url));
const DEFAULT_ROOT_PATH = join(SITE_ROOT_PATH, "oracle_academy");
const MANIFEST_PATH = join(SITE_ROOT_PATH, "data/manifest.json");
const PUBLIC_ROOT = "oracle_academy";

const GITHUB_SIZE_LIMIT = 100 * 1024 * 1024;

const LFS_POINTER_PREFIX = "version https://git-lfs.github.com/spec/v1\n";

const BASE_BRANCH = "main";

const REPO_SUBPATH = "web-oracle-academy-dpsql";

const FOLDER_TITLES = {
    "0_recursos": "Recursos",
    "1_introduccion": "Introducción",
    "2_select_where": "SELECT y WHERE",
    "3_where_order_by_funciones": "WHERE, ORDER BY y funciones",
    "4_funciones_una_fila_parte_1": "Funciones de una fila (parte 1)",
    "5_funciones_una_fila_parte_2": "Funciones de una fila (parte 2)",
    "6_join_parte_1": "Joins (parte 1)",
    "7_join_parte_2": "Joins (parte 2)",
    "8_funciones_grupo_parte_1": "Funciones de grupo (parte 1)",
    "9_funciones_grupo_parte_2": "Funciones de grupo (parte 2)",
    "10_subconsultas": "Subconsultas",
    "11_garantia_consultas_calidad_parte_1": "Garantía de calidad de consultas (parte 1)",
    "12_dml": "DML (manipulación de datos)",
    "13_ddl": "DDL (definición de datos)",
    "14_restricciones": "Restricciones",
    "15_vistas": "Vistas",
    "16_secuencias_sinonimos": "Secuencias y sinónimos",
    "17_privilegios_expresiones_regulares": "Privilegios y expresiones regulares",
    "18_tcl": "TCL (control de transacciones)",
    "19_proyecto_final": "Proyecto final",
    "20_garantia_consultas_calidad_parte_2": "Garantía de calidad de consultas (parte 2)",
};

const FILE_TITLES = {
    "dfo_course_objectives_esp.pdf": "Objetivos del curso",
    "dp_course_map_esp.pdf": "Mapa del curso",
    "oracle_flix_project_rubric_esp.pdf": "Rúbrica del proyecto Oracle Flix",
    "oracle_flix_sql_project_exercise_esp.pdf": "Ejercicio del proyecto Oracle Flix (SQL)",
    "oracle_flix_sql_project_tables_esp.pdf": "Tablas del proyecto Oracle Flix (SQL)",
    "oracle_flix_project_erd_esp.pdf": "ERD del proyecto Oracle Flix",
    "oracle_apex_learner_guide_esp.pdf": "Guía de aprendizaje de Oracle APEX",
    "sql_schema_erd_and_table_designs.pdf": "ERD y diseño de tablas (esquema SQL)",
    "sql_schema.zip": "Esquema SQL (ZIP)",
};

const KNOWN_COURSES = {
    programacion_base_datos_sql_47_50: {
        title: "Programación de Base de Datos SQL",
        code: "DPSQL 47–50",
    },
};

const LESSON_PATTERN = /^dp_(\d+)_(\d+)(?:_practice)?_esp\.(pdf|docx|zip)$/;

const ACCENTS = {
    garantia: "Garantía",
    introduccion: "Introducción",
    restricciones: "Restricciones",
    funciones: "Funciones",
    secuencias: "Secuencias",
    sinonimos: "Sinónimos",
    subconsultas: "Subconsultas",
    vistas: "Vistas",
    privilegios: "Privilegios",
    expresiones: "Expresiones",
    regulares: "Regulares",
    proyecto: "Proyecto",
    final: "Final",
};

export function humanizeName(name) {
    const withoutExtension = name.replace(/\.[a-z0-9]+$/i, "");
    const withoutSuffix = withoutExtension.replace(/_esp$/, "");
    return withoutSuffix
        .split("_")
        .filter(Boolean)
        .map((word) => ACCENTS[word] ?? word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

export function folderTitle(name) {
    return FOLDER_TITLES[name] ?? humanizeName(name.replace(/^\d+_/, ""));
}

export function parseFileName(name) {
    const match = name.match(LESSON_PATTERN);
    if (match === null) {
        const type = name.split(".").pop() ?? "unknown";
        return { lesson: null, isPractice: false, type };
    }
    const [, topic, lesson, type] = match;
    return { lesson: `${topic}.${lesson}`, isPractice: name.includes("practice"), type };
}

export function fileTitle(name, parsed = parseFileName(name)) {
    if (FILE_TITLES[name] !== undefined) {
        return FILE_TITLES[name];
    }
    if (name.startsWith("datamodeler_")) {
        return "Oracle Data Modeler (instalador)";
    }
    if (parsed.lesson !== null) {
        return parsed.isPractice ? `Práctica ${parsed.lesson}` : `Lección ${parsed.lesson}`;
    }
    return humanizeName(name);
}

export function sizeFromPointer(content) {
    if (!content.startsWith(LFS_POINTER_PREFIX)) {
        return null;
    }
    const match = content.match(/^size (\d+)$/m);
    return match === null ? null : Number.parseInt(match[1], 10);
}

export async function effectiveSize(path, statSize) {
    if (statSize > 512) {
        return statSize;
    }
    try {
        const content = await readFile(path, "utf8");
        return sizeFromPointer(content) ?? statSize;
    } catch {
        return statSize;
    }
}

export function courseMetadata(folderName) {
    return (
        KNOWN_COURSES[folderName] ?? {
            title: humanizeName(folderName),
            code: folderName,
        }
    );
}

function compareFiles(a, b) {
    const lessonA = a.lesson ?? "999";
    const lessonB = b.lesson ?? "999";
    if (lessonA !== lessonB) {
        return lessonA.localeCompare(lessonB, "es", { numeric: true });
    }
    if (a.isPractice !== b.isPractice) {
        return a.isPractice ? 1 : -1;
    }
    const TYPE_ORDER = { pdf: 0, docx: 1, zip: 2 };
    return (TYPE_ORDER[a.type] ?? 3) - (TYPE_ORDER[b.type] ?? 3);
}

export async function generateManifest(root = DEFAULT_ROOT_PATH) {
    const entries = await readdir(root, { withFileTypes: true });
    const courseFolder = entries
        .filter((entry) => entry.isDirectory())
        .sort((a, b) => a.name.localeCompare(b.name))[0];
    if (courseFolder === undefined) {
        throw new Error(`No se encontró ninguna carpeta de curso en "${root}".`);
    }

    const coursePath = join(root, courseFolder.name);
    const publicCoursePath = `${PUBLIC_ROOT}/${courseFolder.name}`;
    const topicFolders = (await readdir(coursePath, { withFileTypes: true }))
        .filter((entry) => entry.isDirectory() && /^\d+_/.test(entry.name))
        .sort((a, b) => a.name.localeCompare(b.name, "es", { numeric: true }));

    const topics = [];
    let totalFiles = 0;

    for (const folder of topicFolders) {
        const topicPath = join(coursePath, folder.name);
        const files = [];

        for (const fileName of await readdir(topicPath)) {
            const filePath = join(topicPath, fileName);
            const info = await stat(filePath);
            if (!info.isFile()) {
                continue;
            }
            const size = await effectiveSize(filePath, info.size);
            const parsed = parseFileName(fileName);
            const isExternal = size > GITHUB_SIZE_LIMIT;
            files.push({
                name: fileName,
                title: fileTitle(fileName, parsed),
                path: `${publicCoursePath}/${folder.name}/${fileName}`,
                type: parsed.type,
                size,
                lesson: parsed.lesson,
                isPractice: parsed.isPractice,
                external: isExternal,
                externalUrl: isExternal
                    ? githubRawUrl(`${publicCoursePath}/${folder.name}/${fileName}`)
                    : null,
                note: isExternal
                    ? "Archivo grande alojado con Git LFS; la descarga sale de GitHub."
                    : null,
            });
            totalFiles += 1;
        }

        files.sort(compareFiles);
        topics.push({
            id: folder.name,
            number: Number.parseInt(folder.name.split("_")[0], 10),
            title: folderTitle(folder.name),
            path: publicCoursePath + "/" + folder.name,
            totalFiles: files.length,
            files,
        });
    }

    return {
        generatedAt: new Date().toISOString(),
        root: publicCoursePath,
        course: { ...courseMetadata(courseFolder.name), totalFiles, totalTopics: topics.length },
        topics,
    };
}

export function githubRawUrl(path) {
    const remote = process.env.GIT_REMOTE_ORIGIN ?? "git@github.com:jeironpro/webs.git";
    const match = remote.match(/(?:github\.com[:/])([^/]+)\/([^/]+?)(?:\.git)?$/);
    const owner = match?.[1] ?? "jeironpro";
    const repository = match?.[2] ?? "webs";
    return `https://github.com/${owner}/${repository}/raw/${BASE_BRANCH}/${REPO_SUBPATH}/${path}`;
}

export async function writeManifest(manifest, path = MANIFEST_PATH) {
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, `${JSON.stringify(manifest, null, 4)}\n`, "utf8");
}

async function readManifest() {
    try {
        return JSON.parse(await readFile(MANIFEST_PATH, "utf8"));
    } catch {
        return null;
    }
}

async function main() {
    const checkOnly = process.argv.includes("--check");
    try {
        const manifest = await generateManifest();
        if (checkOnly) {
            const current = await readManifest();
            const withoutDate = (m) => ({ ...m, generatedAt: "" });
            const matches =
                JSON.stringify(withoutDate(current)) === JSON.stringify(withoutDate(manifest));
            process.stdout.write(
                `${matches ? "Manifiesto al día." : "Manifiesto desactualizado."}\n`
            );
            process.exitCode = matches ? 0 : 1;
            return;
        }
        await writeManifest(manifest);
        const course = manifest.course;
        process.stdout.write(
            `Manifiesto generado: ${course.totalTopics} temas, ${course.totalFiles} archivos -> ${MANIFEST_PATH}\n`
        );
    } catch (error) {
        process.stderr.write(`Error al generar el manifiesto: ${error.message}\n`);
        process.exitCode = 1;
    }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
    main();
}
