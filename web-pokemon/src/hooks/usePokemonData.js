import { useState, useEffect, useRef } from 'react';
import { fetchPokemonData } from '../services/api';

// Hook personalizado que gestiona el estado de la lista de Pokémon.
// Aplica debounce de 300ms en búsquedas para no saturar la API.
// Limpia el timeout al desmontar o al cambiar dependencias.

export function usePokemonData({ generacion, pagina, porPagina = 24, busqueda = '', tipo = '' }) {
    const [estado, setEstado] = useState({ datos: [], total: 0, totalPaginas: 0, cargando: true, error: null });
    const timeoutRef = useRef(null);

    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Debounce: si hay búsqueda, espera 300ms antes de llamar a la API
        const tiempo = busqueda ? 300 : 0;

        timeoutRef.current = setTimeout(async () => {
            try {
                setEstado((prev) => ({ ...prev, cargando: true, error: null }));
                const res = await fetchPokemonData({ generacion, pagina, porPagina, busqueda, tipo });
                setEstado({ datos: res.datos, total: res.total, totalPaginas: res.total_paginas, cargando: false, error: null });
            } catch (err) {
                setEstado((prev) => ({ ...prev, cargando: false, error: err.message }));
            }
        }, tiempo);

        // Limpieza: cancela el timeout si el componente se desmonta o las dependencias cambian
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [generacion, pagina, porPagina, busqueda, tipo]);

    return estado;
}
