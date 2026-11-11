// Servicio de contenido - rutas, nombres y fetch de diagramas e info-util

// Detecta subpath de GitHub Pages (ej: /repo/) para rutas absolutas
const BASE = (function () {
  const parts = window.location.pathname.split('/').filter(Boolean);
  return (parts.length > 1 && parts[0] !== 'pages') ? '/' + parts[0] : '';
})();

const diagramNames = {
  array: 'Array',
  bst: 'Arbol Binario de Busqueda',
  hashmap: 'HashMap',
  heap: 'Heap',
  linked_list: 'Lista Enlazada',
  matrix: 'Matriz',
  queue: 'Cola',
  stack: 'Pila',
  tree: 'Arbol',
  trie: 'Trie',
};

const topicNames = {
  bash: 'Bash',
  comando_sql: 'Comandos SQL',
  conceptos_java: 'Conceptos de Java',
  consejos_api: 'Consejos de API',
  css_selectors: 'Selectores CSS',
  fullstack: 'Fullstack',
  funcions_cadenes_python: 'Funciones de Cadena en Python',
  funcions_python: 'Funciones de Python',
  git_github: 'Git y GitHub',
  habilidades_por_sector: 'Habilidades por Sector',
  hola_mon: 'Hola Mundo',
  java_vs_python: 'Java vs Python',
  lenguaje_creators: 'Creadores de Lenguajes',
  leyes_desarrollo: 'Leyes de Desarrollo',
  media_querys_breakpoints: 'Media Queries y Breakpoints',
  modulos_python: 'Módulos de Python',
  protocolos_redes: 'Protocolos de Redes',
  puertos_redes: 'Puertos de Redes',
  python_para_todo: 'Python para Todo',
  sintaxis_sql: 'Sintaxis SQL',
  sistema_archivos_linux: 'Sistema de Archivos Linux',
  tipus_dades_python: 'Tipos de Datos en Python',
};

function byName(a, b) {
  return a.displayName.localeCompare(b.displayName);
}

// Devuelve lista de diagramas con ruta absoluta
export function getDiagramas() {
  return Object.keys(diagramNames).map(function (k) {
    return { name: k, path: BASE + '/diagramas-estructuras-datos/' + k + '.svg' };
  });
}

// Devuelve lista de temas info-util ordenada alfabeticamente
export function getTopics() {
  return Object.keys(topicNames).map(function (k) {
    return { name: k, path: BASE + '/info-util/' + k + '.yaml', displayName: topicNames[k] };
  }).sort(byName);
}

// Fetch de un archivo YAML y retorna texto plano
export async function fetchYaml(path) {
  const respuesta = await fetch(path);
  if (!respuesta.ok) throw new Error('Error al cargar ' + path);
  return respuesta.text();
}

// Nombre legible de un diagrama
export function getDiagramName(name) {
  return diagramNames[name] || name;
}
