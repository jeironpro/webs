// Endpoint serverless (Cloudflare Functions) que expone /api/pokemones.
// En desarrollo, Vite.js lo replica con un middleware en vite.config.js.

import primeraGen from '../../data/pokemon/pokemons_primera_generacion.json';
import segundaGen from '../../data/pokemon/pokemons_segunda_generacion.json';
import terceraGen from '../../data/pokemon/pokemons_tercera_generacion.json';
import cuartaGen from '../../data/pokemon/pokemons_cuarta_generacion.json';
import quintaGen from '../../data/pokemon/pokemons_quinta_generacion.json';
import sextaGen from '../../data/pokemon/pokemons_sexta_generacion.json';
import septimaGen from '../../data/pokemon/pokemons_septima_generacion.json';
import octavaGen from '../../data/pokemon/pokemons_octava_generacion.json';
import novenaGen from '../../data/pokemon/pokemons_novena_generacion.json';
import tiposColores from '../../data/pokemon/tipos_colores.json';

const GEN_FOLDERS = [
  'primera_generacion', 'segunda_generacion', 'tercera_generacion',
  'cuarta_generacion', 'quinta_generacion', 'sexta_generacion',
  'septima_generacion', 'octava_generacion', 'novena_generacion',
];

const GEN_DATA = [
  primeraGen, segundaGen, terceraGen, cuartaGen,
  quintaGen, sextaGen, septimaGen, octavaGen, novenaGen,
];

// Construcción estática del mapa colorMap (se ejecuta una vez al iniciar)
const colorMap = {};
tiposColores.forEach((t) => {
  colorMap[t.nombre.toLowerCase()] = t.color;
});

function obtenerColor(tipoNombre) {
  return colorMap[tipoNombre.toLowerCase()] || '#666';
}

function enriquecerPokemon(pokemon, folder, indiceGlobal) {
  return {
    ...pokemon,
    indice_global: indiceGlobal,
    tipos: pokemon.tipos.map((t) => ({
      ...t,
      color: obtenerColor(t.nombre),
    })),
    imagen_url: `/pokemon-images/${folder}/${pokemon.nombre}.png`,
  };
}

function filtrar(lista, busqueda, tipo) {
  let resultado = lista;

  if (busqueda) {
    const termino = busqueda.toLowerCase().trim();
    resultado = resultado.filter((p) =>
      p.nombre.toLowerCase().includes(termino),
    );
  }

  if (tipo) {
    resultado = resultado.filter((p) =>
      p.tipos?.some((t) => t.nombre?.toLowerCase() === tipo.toLowerCase()),
    );
  }

  return resultado;
}

// Manejador principal de la petición HTTP GET
export async function onRequest(context) {
  const url = new URL(context.request.url);
  const genParam = url.searchParams.get('generacion');
  const pagina = parseInt(url.searchParams.get('pagina') || '1', 10);
  const porPagina = parseInt(url.searchParams.get('por_pagina') || '24', 10);
  const busqueda = url.searchParams.get('busqueda') || '';
  const tipo = url.searchParams.get('tipo') || '';

  const genIndex = genParam ? parseInt(genParam, 10) - 1 : null;

  // Si se filtra por generación, solo se procesa esa; si no, se procesan todas
  const indicesGen = genIndex !== null && genIndex >= 0 && genIndex < GEN_DATA.length
    ? [genIndex]
    : GEN_DATA.map((_, i) => i);

  let todos = [];
  let indiceGlobal = 0;

  // Recorre las generaciones, enriquece cada Pokémon y construye la lista plana
  GEN_DATA.forEach((genData, i) => {
    if (!indicesGen.includes(i)) {
      indiceGlobal += genData.length;
      return;
    }

    const folder = GEN_FOLDERS[i];
    genData.forEach((pokemon) => {
      todos.push(enriquecerPokemon(pokemon, folder, indiceGlobal));
      indiceGlobal++;
    });
  });

  todos = filtrar(todos, busqueda, tipo);

  // Paginación: calcula total de páginas y extrae el segmento correspondiente
  const total = todos.length;
  const totalPaginas = Math.max(1, Math.ceil(total / porPagina));
  const paginaSegura = Math.min(pagina, totalPaginas);
  const inicio = (paginaSegura - 1) * porPagina;
  const datos = todos.slice(inicio, inicio + porPagina);

  return new Response(JSON.stringify({ datos, total, pagina: paginaSegura, por_pagina: porPagina, total_paginas: totalPaginas }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
