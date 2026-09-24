const WEATHER_CODES = {
    0: { label: 'Despejado', group: 'clear', day: true },
    1: { label: 'Mayormente despejado', group: 'clear', day: true },
    2: { label: 'Parcialmente nublado', group: 'partly', day: true },
    3: { label: 'Nublado', group: 'cloud', day: true },
    45: { label: 'Niebla', group: 'fog', day: true },
    48: { label: 'Niebla engelante', group: 'fog', day: true },
    51: { label: 'Llovizna suave', group: 'drizzle', day: true },
    53: { label: 'Llovizna', group: 'drizzle', day: true },
    55: { label: 'Llovizna intensa', group: 'drizzle', day: true },
    56: { label: 'Llovizna engelante', group: 'drizzle', day: true },
    57: { label: 'Llovizna engelante', group: 'drizzle', day: true },
    61: { label: 'Lluvia suave', group: 'rain', day: true },
    63: { label: 'Lluvia', group: 'rain', day: true },
    65: { label: 'Lluvia fuerte', group: 'rain', day: true },
    66: { label: 'Lluvia helada', group: 'rain', day: true },
    67: { label: 'Lluvia helada', group: 'rain', day: true },
    71: { label: 'Nieve suave', group: 'snow', day: true },
    73: { label: 'Nieve', group: 'snow', day: true },
    75: { label: 'Nieve fuerte', group: 'snow', day: true },
    77: { label: 'Granos de nieve', group: 'snow', day: true },
    80: { label: 'Chubascos suaves', group: 'rain', day: true },
    81: { label: 'Chubascos moderados', group: 'rain', day: true },
    82: { label: 'Chubascos violentos', group: 'rain', day: true },
    85: { label: 'Chubascos de nieve', group: 'snow', day: true },
    86: { label: 'Chubascos de nieve fuertes', group: 'snow', day: true },
    95: { label: 'Tormenta', group: 'storm', day: true },
    96: { label: 'Tormenta con granizo', group: 'storm', day: true },
    99: { label: 'Tormenta con granizo fuerte', group: 'storm', day: true },
}

/**
 * Devuelve el descriptor de un código WMO. Códigos desconocidos caen en un
 * genérico `Desconocido`.
 */
export function getWeatherCode(code) {
    return WEATHER_CODES[code] ?? { label: 'Desconocido', group: 'unknown', day: true }
}
