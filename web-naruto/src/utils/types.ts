// Tipos compartidos — interfaces de personajes, filtros y ordenamiento
export interface CharacterStats {
    fuerza: number;
    habilidad: number;
    resistencia: number;
    estrategia: number;
}

// Información completa de un personaje (sin puntaje calculado)
export interface Character {
    id: string;
    nombre: string;
    aldea: string;
    clan: string;
    equipo: string;
    rango: string;
    imagen: string;
    habilidades: string[];
    debilidades: string[];
    fortalezas: string[];
    estadisticas: CharacterStats;
}

// Personaje con puntaje total calculado (fuerza*0.3 + habilidad*0.3 + resistencia*0.2 + estrategia*0.2)
export interface CharacterWithScore extends Character {
    scoreTotal: number;
}

// Opciones de ordenamiento: por puntaje (asc/desc) o nombre (asc/desc)
export type SortOption = 'score-desc' | 'score-asc' | 'nombre-asc' | 'nombre-desc';

// Estado completo de los filtros aplicados en la UI
export interface FilterState {
    aldea: string;
    clan: string;
    equipo: string;
    rango: string;
    sort: SortOption;
    search: string;
}
