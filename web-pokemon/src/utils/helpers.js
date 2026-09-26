// Formatea el nombre interno: reemplaza guiones bajos, maneja sufijos de género (-f/-m) y "hd" → 'd
export function formatearNombre(nombre) {
    let formateado = nombre.replace(/_/g, ' ');

    if (formateado.endsWith('-f')) {
        formateado = formateado.slice(0, -2) + '\u2640';
    } else if (formateado.endsWith('-m')) {
        formateado = formateado.slice(0, -2) + '\u2642';
    } else if (formateado.endsWith('hd')) {
        formateado = formateado.slice(0, -1) + "'" + 'd';
    }

    return formateado;
}

// Convierte un índice numérico a string de 4 dígitos (ej. 0 → "0001")
export function formatearId(indice) {
    return String(indice + 1).padStart(4, '0');
}

// Genera una cadena de ★ repetidos para valoración visual
export function generarEstrellas(valor) {
    return '\u2605'.repeat(valor);
}

// Devuelve el rango de índices y nombre de una generación dado su ID (1-9)
export function obtenerRangoGeneracion(generacionId) {
    const generaciones = {
        1: { inicio: 0, fin: 151, nombre: 'primera' },
        2: { inicio: 151, fin: 251, nombre: 'segunda' },
        3: { inicio: 251, fin: 386, nombre: 'tercera' },
        4: { inicio: 386, fin: 493, nombre: 'cuarta' },
        5: { inicio: 493, fin: 649, nombre: 'quinta' },
        6: { inicio: 649, fin: 721, nombre: 'sexta' },
        7: { inicio: 721, fin: 809, nombre: 'septima' },
        8: { inicio: 809, fin: 905, nombre: 'octava' },
        9: { inicio: 905, fin: 1025, nombre: 'novena' },
    };

    return generaciones[generacionId] || null;
}
