const isNestedPage = window.location.pathname.split("/").includes("pages");
const BASE = isNestedPage ? ".." : ".";

const diagramLabels = {
    array: "Array",
    bst: "Arbol Binario de Busqueda",
    hashmap: "HashMap",
    heap: "Heap",
    linked_list: "Lista Enlazada",
    matrix: "Matriz",
    queue: "Cola",
    stack: "Pila",
    tree: "Arbol",
    trie: "Trie",
};

const topicLabels = {
    bash: "Bash",
    comando_sql: "Comandos SQL",
    conceptos_java: "Conceptos de Java",
    consejos_api: "Consejos de API",
    css_selectors: "Selectores CSS",
    fullstack: "Fullstack",
    funcions_cadenes_python: "Funciones de Cadena en Python",
    funcions_python: "Funciones de Python",
    git_github: "Git y GitHub",
    habilidades_por_sector: "Habilidades por Sector",
    hola_mon: "Hola Mundo",
    java_vs_python: "Java vs Python",
    lenguaje_creators: "Creadores de Lenguajes",
    leyes_desarrollo: "Leyes de Desarrollo",
    media_querys_breakpoints: "Media Queries y Breakpoints",
    modulos_python: "Módulos de Python",
    protocolos_redes: "Protocolos de Redes",
    puertos_redes: "Puertos de Redes",
    python_para_todo: "Python para Todo",
    sintaxis_sql: "Sintaxis SQL",
    sistema_archivos_linux: "Sistema de Archivos Linux",
    tipus_dades_python: "Tipos de Datos en Python",
};

function byDisplayName(a, b) {
    return a.displayName.localeCompare(b.displayName);
}

export function getDiagrams() {
    return Object.keys(diagramLabels).map((name) => ({
        name,
        path: `${BASE}/assets/images/diagrams/${name}.svg`,
    }));
}

export function getTopics() {
    return Object.keys(topicLabels)
        .map((name) => ({
            name,
            path: `${BASE}/data/info-util/${name}.yaml`,
            displayName: topicLabels[name],
        }))
        .sort(byDisplayName);
}

export async function fetchYaml(path) {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`No se pudo cargar ${path}`);
    return response.text();
}

export function getDiagramName(name) {
    return diagramLabels[name] || name;
}
