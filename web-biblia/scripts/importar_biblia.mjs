#!/usr/bin/env node
/**
 * Pipeline de importación de la Biblia.
 *
 * Convierte el texto fuente (diseñado para la Biblia Latinoamericana) en
 * js/data/versiculos.json con el formato que consume js/versiculos.js:
 *
 *   {
 *     "<id_libro>": {
 *       "<capitulo>": [ { "numero": 1, "texto": "..." }, ... ]
 *     },
 *     ...
 *   }
 *
 * Uso:
 *   node scripts/importar_biblia.mjs --entrada <directorio|archivo>
 *       [--salida js/data/versiculos.json]
 *       [--catalogo js/data/catalogo.js]
 *
 * Formatos de entrada aceptados:
 *
 *   1. Directorio con un archivo .txt por libro, nombrado con el id del
 *      catálogo (p. ej. genesis.txt) y una línea por versículo:
 *
 *        1:1 En el principio creó Dios los cielos y la tierra
 *        1:2 Y la tierra estaba desordenada y vacía...
 *
 *   2. Un único archivo .json con la estructura ya agrupada por libro y
 *      capítulo. Cada capítulo puede ser un arreglo de textos simples o un
 *      arreglo de objetos { numero, texto }:
 *
 *        { "genesis": { "1": [ "En el principio...", "Y la tierra..." ] } }
 *
 * El script valida los ids y los recuentos contra CATALOGO_BIBLIA y escribe
 * el dataset con formato legible para su revisión en el repositorio.
 */

import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync } from "node:fs";
import { dirname, join, extname, basename } from "node:path";
import vm from "node:vm";

const RAIZ = new URL("..", import.meta.url).pathname;

function argumentos(cli) {
  const args = {};
  for (let i = 2; i < cli.length; i++) {
    const arg = cli[i];
    if (arg.startsWith("--")) {
      const clave = arg.slice(2);
      const valor = cli[i + 1] && !cli[i + 1].startsWith("--") ? cli[i + 1] : true;
      args[clave] = valor;
      if (valor !== true) i++;
    }
  }
  return args;
}

function cargarCatalogo(ruta) {
  const fuente = readFileSync(ruta, "utf8");
  const contexto = {};
  vm.createContext(contexto);
  // El catálogo declara `const` a nivel de script; se expone para poder leerlo.
  vm.runInContext(fuente + "\n;globalThis.__CATALOGO_BIBLIA__ = CATALOGO_BIBLIA;", contexto);
  return contexto.__CATALOGO_BIBLIA__;
}

function aplanarCatalogo(catalogo) {
  return Object.values(catalogo).flat();
}

/** Parsea un archivo .txt con líneas "C:V texto". */
function parsearTxt(contenido) {
  const porCapitulo = {};
  for (const linea of contenido.split(/\r?\n/)) {
    const texto = linea.trim();
    if (!texto) continue;
    const coincidencia = texto.match(/^(\d+):(\d+)\s+(.+)$/);
    if (!coincidencia) {
      console.warn(`  línea ignorada (sin formato "C:V texto"): ${texto.slice(0, 60)}`);
      continue;
    }
    const capitulo = Number(coincidencia[1]);
    const numero = Number(coincidencia[2]);
    const contenidoVersiculo = coincidencia[3].trim();
    if (!porCapitulo[capitulo]) porCapitulo[capitulo] = [];
    porCapitulo[capitulo].push({ numero, texto: contenidoVersiculo });
  }
  return porCapitulo;
}

/** Parsea un archivo .json agrupado por libro/capítulo. */
function parsearJson(contenido) {
  const datos = JSON.parse(contenido);
  for (const libroId of Object.keys(datos)) {
    for (const capitulo of Object.keys(datos[libroId])) {
      datos[libroId][capitulo] = datos[libroId][capitulo].map((v, i) => {
        if (typeof v === "string") return { numero: i + 1, texto: v };
        return v;
      });
    }
  }
  return datos;
}

function validarContraCatalogo(libros, catalogoPlano) {
  const errores = [];
  const porId = new Map(catalogoPlano.map((l) => [l.id, l]));
  for (const libroId of Object.keys(libros)) {
    const libro = porId.get(libroId);
    if (!libro) {
      errores.push(`libro desconocido en la entrada: ${libroId}`);
      continue;
    }
    const capitulos = Object.keys(libros[libroId]).map(Number);
    const capitulosDeclarados = Array.from({ length: libro.capitulos }, (_, i) => i + 1);
    for (const cap of capitulos) {
      if (cap < 1 || cap > libro.capitulos) {
        errores.push(`${libroId}: capítulo ${cap} fuera de rango (máx. ${libro.capitulos})`);
      }
    }
    const faltantes = capitulosDeclarados.filter((c) => !capitulos.includes(c));
    if (faltantes.length) {
      console.warn(`  ${libroId}: faltan capítulos ${faltantes.join(", ")}`);
    }
  }
  return errores;
}

function ejecutar() {
  const args = argumentos(process.argv);
  const entrada = args.entrada;
  const salida = args.salida || join(RAIZ, "js", "data", "versiculos.json");
  const rutaCatalogo = args.catalogo || join(RAIZ, "js", "data", "catalogo.js");

  if (!entrada) {
    console.error("Falta --entrada. Uso: node scripts/importar_biblia.mjs --entrada <directorio|archivo> [--salida ruta] [--catalogo ruta]");
    process.exit(1);
  }

  console.log(`Catálogo:  ${rutaCatalogo}`);
  console.log(`Entrada:   ${entrada}`);
  console.log(`Salida:    ${salida}`);
  console.log("");

  const catalogo = cargarCatalogo(rutaCatalogo);
  const catalogoPlano = aplanarCatalogo(catalogo);
  console.log(`Catálogo cargado: ${catalogoPlano.length} libros`);

  const libros = {};
  const estadisticas = [];
  const rutaEntrada = entrada.startsWith("/") ? entrada : join(RAIZ, entrada);
  const esDirectorio = statSync(rutaEntrada).isDirectory();

  if (esDirectorio) {
    const archivos = readdirSync(rutaEntrada).filter((f) => extname(f).toLowerCase() === ".txt");
    for (const archivo of archivos) {
      const libroId = basename(archivo, ".txt").toLowerCase();
      const contenido = readFileSync(join(rutaEntrada, archivo), "utf8");
      libros[libroId] = parsearTxt(contenido);
      const totalVersiculos = Object.values(libros[libroId]).reduce((n, vs) => n + vs.length, 0);
      estadisticas.push({ libroId, totalVersiculos });
      console.log(`  ${libroId}: ${totalVersiculos} versículos`);
    }
  } else {
    const contenido = readFileSync(rutaEntrada, "utf8");
    Object.assign(libros, extname(rutaEntrada).toLowerCase() === ".json" ? parsearJson(contenido) : parsearTxt(contenido));
    const totalVersiculos = Object.values(libros).reduce((n, caps) => n + Object.values(caps).reduce((m, vs) => m + vs.length, 0), 0);
    console.log(`  ${Object.keys(libros).length} libros, ${totalVersiculos} versículos`);
  }

  console.log("");
  const errores = validarContraCatalogo(libros, catalogoPlano);
  if (errores.length) {
    console.error("Errores de validación:");
    for (const error of errores) console.error(`  - ${error}`);
    process.exit(1);
  }

  mkdirSync(dirname(salida), { recursive: true });
  writeFileSync(salida, JSON.stringify(libros, null, 2) + "\n", "utf8");
  console.log(`Dataset escrito en ${salida}`);
}

ejecutar();
