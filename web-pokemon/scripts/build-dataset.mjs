// Genera public/api/pokemones.json con el dataset completo enriquecido,
// replicando exactamente el JSON que responde /api/pokemones en producción.
// Lo consume el fallback estático de src/services/api.js cuando no hay
// backend (GitHub Pages). Se ejecuta automaticamente en el build (prebuild).

import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = dirname(fileURLToPath(import.meta.url)) + "/..";
const GEN_FOLDERS = [
    "primera_generacion",
    "segunda_generacion",
    "tercera_generacion",
    "cuarta_generacion",
    "quinta_generacion",
    "sexta_generacion",
    "septima_generacion",
    "octava_generacion",
    "novena_generacion",
];
const GEN_NAMES = [
    "primera",
    "segunda",
    "tercera",
    "cuarta",
    "quinta",
    "sexta",
    "septima",
    "octava",
    "novena",
];

const tiposColores = (
    await import(join(RAIZ, "data/pokemon/tipos_colores.json"), {
        with: { type: "json" },
    })
).default;
const colorMap = {};
tiposColores.forEach((t) => {
    colorMap[t.nombre.toLowerCase()] = t.color;
});

const todos = [];
let indiceGlobal = 0;
for (let i = 0; i < 9; i++) {
    const genData = (
        await import(
            join(RAIZ, `data/pokemon/pokemons_${GEN_NAMES[i]}_generacion.json`),
            { with: { type: "json" } }
        )
    ).default;
    const folder = GEN_FOLDERS[i];
    for (const pokemon of genData) {
        todos.push({
            ...pokemon,
            generacion: i + 1,
            indice_global: indiceGlobal,
            tipos: pokemon.tipos.map((t) => ({
                ...t,
                color: colorMap[t.nombre.toLowerCase()] || "#666",
            })),
            imagen_url: `/pokemon-images/${folder}/${pokemon.nombre}.png`,
        });
        indiceGlobal++;
    }
}

const salida = join(RAIZ, "public/api/pokemones.json");
mkdirSync(dirname(salida), { recursive: true });
writeFileSync(salida, JSON.stringify({ datos: todos, total: todos.length }));
console.log(
    `OK public/api/pokemones.json (${todos.length} pokemons, ${(
        existsSync(salida) ? "escrito" : "error"
    )})`,
);
