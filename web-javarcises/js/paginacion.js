// Lógica pura de paginación: no depende del DOM, por lo que se puede
// testear con node --test (js/paginacion.test.js).

export const PER_PAGE = 12;

/**
 * Corta una lista para la página indicada.
 * Devuelve los ítems de la página, el número de página seguro (dentro de
 * rango) y los contadores "desde–hasta de total".
 */
export function paginate(list, page, perPage = PER_PAGE) {
    const totalPages = Math.max(1, Math.ceil(list.length / perPage));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const start = (safePage - 1) * perPage;
    const items = list.slice(start, start + perPage);
    return {
        items,
        page: safePage,
        totalPages,
        from: list.length === 0 ? 0 : start + 1,
        to: list.length === 0 ? 0 : start + items.length,
        total: list.length,
    };
}

/**
 * Calcula la secuencia de páginas a mostrar en el paginador: primera y
 * última siempre visibles, la actual con una vecina a cada lado, y "…"
 * donde haya un salto.
 */
export function pageNumbers(currentPage, totalPages) {
    if (totalPages <= 7) {
        return range(1, totalPages).map((number) => ({ type: "page", number }));
    }
    const result = [{ type: "page", number: 1 }];
    const from = Math.max(2, currentPage - 1);
    const to = Math.min(totalPages - 1, currentPage + 1);
    if (from > 2) {
        result.push({ type: "ellipsis" });
    }
    for (let number = from; number <= to; number += 1) {
        result.push({ type: "page", number });
    }
    if (to < totalPages - 1) {
        result.push({ type: "ellipsis" });
    }
    result.push({ type: "page", number: totalPages });
    return result;
}

function range(start, end) {
    const values = [];
    for (let i = start; i <= end; i += 1) {
        values.push(i);
    }
    return values;
}
