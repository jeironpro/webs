import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuración de Vite con un middleware de desarrollo que simula el endpoint /api/pokemones.
// En producción, este mismo endpoint lo expone Cloudflare Functions (functions/api/pokemones.js).

const GEN_FOLDERS = [
  'primera_generacion', 'segunda_generacion', 'tercera_generacion',
  'cuarta_generacion', 'quinta_generacion', 'sexta_generacion',
  'septima_generacion', 'octava_generacion', 'novena_generacion',
];

const GEN_NAMES = [
  'primera', 'segunda', 'tercera', 'cuarta',
  'quinta', 'sexta', 'septima', 'octava', 'novena',
];

// Carga dinámica del JSON de una generación
async function cargarGeneracion(indice) {
  const mod = await import(`./data/pokemon/pokemons_${GEN_NAMES[indice]}_generacion.json`);
  return mod.default;
}

async function cargarColores() {
  const mod = await import('./data/pokemon/tipos_colores.json');
  return mod.default;
}

let colorMapMemo = null;

// Carga y memoiza el mapa de colores por tipo desde tipos_colores.json
async function obtenerColorMap() {
  if (colorMapMemo) return colorMapMemo;
  const tiposColores = await cargarColores();
  const map = {};
  tiposColores.forEach((t) => { map[t.nombre.toLowerCase()] = t.color; });
  colorMapMemo = map;
  return map;
}

// Agrega índice global, color a cada tipo y URL de imagen a un Pokémon
function enriquecerPokemon(pokemon, folder, indiceGlobal, colorMap) {
  return {
    ...pokemon,
    indice_global: indiceGlobal,
    tipos: pokemon.tipos.map((t) => ({
      ...t,
      color: colorMap[t.nombre.toLowerCase()] || '#666',
    })),
    imagen_url: `/pokemon-images/${folder}/${pokemon.nombre}.png`,
  };
}

// Filtra la lista por término de búsqueda (nombre) y/o tipo
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

export default defineConfig({
  // La base se inyecta en el despliegue (VITE_BASE) para que los assets del
  // build resuelvan siempre bien, incluso al abrir la SPA en una subruta.
  // Por defecto es relativa: yarn dev y yarn build funcionan en cualquier sitio.
  base: process.env.VITE_BASE || './',
  plugins: [
    react(),
    {
      name: 'api-pokemones',
      // Middleware de desarrollo que replica el endpoint serverless de producción
      configureServer(server) {
        server.middlewares.use('/api/pokemones', async (req, res) => {
          const url = new URL(req.url, `http://${req.headers.host}`);
          const genParam = url.searchParams.get('generacion');
          const pagina = parseInt(url.searchParams.get('pagina') || '1', 10);
          const porPagina = parseInt(url.searchParams.get('por_pagina') || '24', 10);
          const busqueda = url.searchParams.get('busqueda') || '';
          const tipo = url.searchParams.get('tipo') || '';

          const genIndex = genParam ? parseInt(genParam, 10) - 1 : null;

          const colorMap = await obtenerColorMap();
          let todos = [];
          let indiceGlobal = 0;

          for (let i = 0; i < 9; i++) {
            if (genIndex !== null && i !== genIndex) {
              const genData = await cargarGeneracion(i);
              indiceGlobal += genData.length;
              continue;
            }
            const genData = await cargarGeneracion(i);
            const folder = GEN_FOLDERS[i];
            genData.forEach((pokemon) => {
              todos.push(enriquecerPokemon(pokemon, folder, indiceGlobal, colorMap));
              indiceGlobal++;
            });
          }

          todos = filtrar(todos, busqueda, tipo);

          const total = todos.length;
          const totalPaginas = Math.max(1, Math.ceil(total / porPagina));
          const paginaSegura = Math.min(pagina, totalPaginas);
          const inicio = (paginaSegura - 1) * porPagina;
          const datos = todos.slice(inicio, inicio + porPagina);

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ datos, total, pagina: paginaSegura, por_pagina: porPagina, total_paginas: totalPaginas }));
        });
      },
    },
  ],
});
