// Lógica de personajes: carga el JSON, calcula puntajes, filtra, ordena y pagina.
// Sustituye a la antigua API serverless: todo se resuelve en el navegador (app 100% estática).
import rawData from '../../data/naruto/personajes.json';
import type { CharacterStats, CharacterWithScore, SortOption } from './types';

// Personaje crudo tal cual viene del JSON (algunos campos pueden faltar)
type RawCharacter = Partial<Omit<CharacterWithScore, 'scoreTotal'>> &
    Pick<CharacterWithScore, 'id' | 'nombre' | 'imagen'>;

// Pesos para el cálculo del puntaje total de cada personaje
const WEIGHTS: Record<keyof CharacterStats, number> = {
    fuerza: 0.3,
    habilidad: 0.3,
    resistencia: 0.2,
    estrategia: 0.2,
};

const DEFAULT_STATS: CharacterStats = { fuerza: 0, habilidad: 0, resistencia: 0, estrategia: 0 };

// Puntaje ponderado: fuerza*0.3 + habilidad*0.3 + resistencia*0.2 + estrategia*0.2
export function calcularPuntaje(stats?: CharacterStats): number {
    if (!stats) return 0;
    const total =
        stats.fuerza * WEIGHTS.fuerza +
        stats.habilidad * WEIGHTS.habilidad +
        stats.resistencia * WEIGHTS.resistencia +
        stats.estrategia * WEIGHTS.estrategia;
    return Math.round(total * 10) / 10;
}

// Todos los personajes normalizados (se calcula una sola vez al cargar el módulo)
export const personajes: CharacterWithScore[] = (rawData as unknown as RawCharacter[]).map((c) => ({
    id: c.id,
    nombre: c.nombre,
    aldea: c.aldea ?? '',
    clan: c.clan ?? '',
    equipo: c.equipo ?? '',
    rango: c.rango ?? '',
    imagen: c.imagen,
    habilidades: c.habilidades ?? [],
    fortalezas: c.fortalezas ?? [],
    debilidades: c.debilidades ?? [],
    estadisticas: c.estadisticas ?? DEFAULT_STATS,
    scoreTotal: calcularPuntaje(c.estadisticas),
}));

// Todos los personajes ordenados por puntaje descendente (para rankings como el top 3)
export const personajesPorPuntaje: CharacterWithScore[] = [...personajes].sort(
    (a, b) => b.scoreTotal - a.scoreTotal,
);

// Parámetros de consulta, equivalentes a los de la antigua API
export interface CharacterQuery {
    pagina?: number;
    porPagina?: number;
    busqueda?: string;
    aldea?: string;
    clan?: string;
    equipo?: string;
    rango?: string;
    ordenar?: SortOption | string;
}

// Resultado paginado, misma forma que devolvía la API
export interface CharacterPage {
    datos: CharacterWithScore[];
    total: number;
    pagina: number;
    por_pagina: number;
    total_paginas: number;
}

// Aplica búsqueda textual, filtros exactos y ordenamiento
function seleccionar({ busqueda, aldea, clan, equipo, rango, ordenar }: CharacterQuery): CharacterWithScore[] {
    let resultado = personajes;

    if (busqueda) {
        const termino = busqueda.toLowerCase();
        resultado = resultado.filter((c) => c.nombre.toLowerCase().includes(termino));
    }
    if (aldea && aldea !== 'todas') resultado = resultado.filter((c) => c.aldea === aldea);
    if (clan && clan !== 'todos') resultado = resultado.filter((c) => c.clan === clan);
    if (equipo && equipo !== 'todos') resultado = resultado.filter((c) => c.equipo === equipo);
    if (rango && rango !== 'todos') resultado = resultado.filter((c) => c.rango === rango);

    const ordenado = [...resultado];
    switch (ordenar) {
        case 'score-asc':
            ordenado.sort((a, b) => a.scoreTotal - b.scoreTotal);
            break;
        case 'nombre-asc':
            ordenado.sort((a, b) => a.nombre.localeCompare(b.nombre));
            break;
        case 'nombre-desc':
            ordenado.sort((a, b) => b.nombre.localeCompare(a.nombre));
            break;
        case 'score-desc':
        default:
            ordenado.sort((a, b) => b.scoreTotal - a.scoreTotal);
            break;
    }
    return ordenado;
}

// Devuelve una página de personajes aplicando filtros, orden y paginación
export function consultarPersonajes(query: CharacterQuery = {}): CharacterPage {
    const filtrados = seleccionar(query);
    const porPagina = Math.min(Math.max(1, query.porPagina ?? 24), 100);
    const total = filtrados.length;
    const totalPaginas = Math.max(1, Math.ceil(total / porPagina));
    const pagina = Math.min(Math.max(1, query.pagina ?? 1), totalPaginas);
    const inicio = (pagina - 1) * porPagina;
    return {
        datos: filtrados.slice(inicio, inicio + porPagina),
        total,
        pagina,
        por_pagina: porPagina,
        total_paginas: totalPaginas,
    };
}
