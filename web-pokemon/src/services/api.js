// Capa de servicio para consumir los datos de Pokémon.
// En desarrollo usa el middleware /api/pokemones de Vite; en el build estático
// (GitHub Pages) hace fallback a public/api/pokemones.json filtrando y
// paginando en cliente con la misma forma de respuesta.

// La app vive en un subdirectorio del monorepo (p. ej. /webs/web-pokemon/).
// El basename del router y la base de las imagenes se derivan del src del
// bundle; en desarrollo (vite) no hay hash de assets y se usan rutas locales.
const scriptSrc = document.querySelector('script[src*="assets/"]')?.src ?? '';
export const basename = scriptSrc.includes('/assets/')
    ? new URL(scriptSrc).pathname.replace(/\/assets\/.*$/, '')
    : '';
export const baseImagenes = basename ? `${basename}/` : '/';

export async function fetchPokemonData({ generacion, pagina = 1, porPagina = 24, busqueda = '', tipo = '' } = {}) {
    const params = new URLSearchParams();
    if (generacion) params.set('generacion', generacion);
    params.set('pagina', String(pagina));
    params.set('por_pagina', String(porPagina));
    if (busqueda) params.set('busqueda', busqueda);
    if (tipo) params.set('tipo', tipo);

    if (!basename) {
        // Con backend (dev con middleware de vite): API real.
        const respuesta = await fetch(`/api/pokemones?${params}`);
        if (respuesta.status === 500) {
            throw new Error('Error interno del servidor');
        }
        if (!respuesta.ok) {
            throw new Error('Error HTTP ' + respuesta.status);
        }
        return respuesta.json();
    }

    // Sin backend (Pages): dataset estático paginado y filtrado en cliente.
    const respuesta = await fetch(`${basename}/api/pokemones.json`);
    if (!respuesta.ok) {
        throw new Error('Error HTTP ' + respuesta.status);
    }
    const { datos } = await respuesta.json();
    let lista = datos;
    if (generacion) lista = lista.filter((p) => p.generacion === generacion);
    if (busqueda) {
        const termino = busqueda.toLowerCase().trim();
        lista = lista.filter((p) => p.nombre.toLowerCase().includes(termino));
    }
    if (tipo) {
        lista = lista.filter((p) =>
            p.tipos?.some((t) => t.nombre?.toLowerCase() === tipo.toLowerCase()),
        );
    }
    const total = lista.length;
    const totalPaginas = Math.max(1, Math.ceil(total / porPagina));
    const paginaSegura = Math.min(pagina, totalPaginas);
    const inicio = (paginaSegura - 1) * porPagina;
    return {
        datos: lista.slice(inicio, inicio + porPagina).map((p) => ({
            ...p,
            imagen_url: p.imagen_url.replace(/^\//, baseImagenes),
        })),
        total,
        pagina: paginaSegura,
        por_pagina: porPagina,
        total_paginas: totalPaginas,
    };
}
