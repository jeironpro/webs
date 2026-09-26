// Hook de datos de personajes — resuelve filtros, orden y paginación en el cliente
// (la app es 100% estática: no hay backend ni peticiones HTTP).
import { useMemo } from 'react';
import { consultarPersonajes } from '../utils/characters';

interface UseNarutoDataParams {
    pagina?: number;
    porPagina?: number;
    busqueda?: string;
    aldea?: string;
    clan?: string;
    equipo?: string;
    rango?: string;
    ordenar?: string;
}

interface UseNarutoDataState {
    datos: ReturnType<typeof consultarPersonajes>['datos'];
    total: number;
    totalPaginas: number;
}

// Deriva la página de personajes de los filtros actuales. Todo es síncrono:
// el cálculo es trivial (162 personajes), así que useMemo es más que suficiente.
export function useNarutoData(params: UseNarutoDataParams): UseNarutoDataState {
    return useMemo(() => {
        const res = consultarPersonajes({
            pagina: params.pagina,
            porPagina: params.porPagina,
            busqueda: params.busqueda,
            aldea: params.aldea,
            clan: params.clan,
            equipo: params.equipo,
            rango: params.rango,
            ordenar: params.ordenar,
        });
        return { datos: res.datos, total: res.total, totalPaginas: res.total_paginas };
    }, [params.pagina, params.porPagina, params.busqueda, params.aldea, params.clan, params.equipo, params.rango, params.ordenar]);
}
