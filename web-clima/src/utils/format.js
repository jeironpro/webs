const KPH_TO_MPH = 0.621371
const COMPASS = [
    'N',
    'NNE',
    'NE',
    'ENE',
    'E',
    'ESE',
    'SE',
    'SSE',
    'S',
    'SSO',
    'SO',
    'OSO',
    'O',
    'ONO',
    'NO',
    'NNO',
]

/**
 * Redondea al entero más cercano.
 */
export function round(value) {
    return Math.round(value)
}

/**
 * Convierte km/h a la unidad elegida y la formatea.
 */
export function formatWind(kmh, unit = 'km/h') {
    if (kmh === null || kmh === undefined) return null
    const value = unit === 'mph' ? kmh * KPH_TO_MPH : kmh
    return `${round(value)} ${unit}`
}

/**
 * Dirección del viento (grados) → punto de brújula (es-ES).
 */
export function windDirection(degrees) {
    if (degrees === null || degrees === undefined) return null
    const index = Math.round(degrees / 22.5) % 16
    return COMPASS[index]
}

/**
 * Convierte celsius a la unidad elegida ("C" o "F").
 */
export function toUserTemp(celsius, unit) {
    if (celsius === null || celsius === undefined) return null
    return unit === 'F' ? round((celsius * 9) / 5 + 32) : round(celsius)
}

/**
 * Temperatura redondeada con símbolo de unidad: "21°C" / "70°F".
 */
export function tempLabel(celsius, unit = 'C') {
    const value = toUserTemp(celsius, unit)
    if (value === null) return null
    return `${round(value)}°${unit}`
}

/**
 * Formatea la hora local de un lugar usando su zona horaria (IANA).
 */
export function formatTime(timezone, date = new Date()) {
    return formatHourLabel(date.toISOString(), timezone)
}

/**
 * Etiqueta horaria "14:00" a partir de un instante ISO en la zona del lugar.
 */
export function formatHourLabel(iso, timezone = 'UTC') {
    if (!iso) return null
    try {
        return new Intl.DateTimeFormat('es-ES', {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        }).format(new Date(iso))
    } catch {
        return iso.slice(11, 16)
    }
}

/**
 * Fecha y hora local de un lugar (IANA): "lunes, 10 ago. · 08:19".
 */
export function formatDateTime(timezone, date = new Date()) {
    if (!date) return null
    try {
        const tz = { timeZone: timezone }
        const day = new Intl.DateTimeFormat('es-ES', {
            ...tz,
            weekday: 'long',
            day: 'numeric',
            month: 'short',
        }).format(date)
        const time = new Intl.DateTimeFormat('es-ES', {
            ...tz,
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        }).format(date)
        return `${day} · ${time}`
    } catch {
        return null
    }
}

/**
 * Desplazamiento UTC en horas "UTC+02:00" a partir de segundos.
 */
export function formatOffset(utcOffsetSeconds) {
    if (utcOffsetSeconds === null || utcOffsetSeconds === undefined) return null
    const sign = utcOffsetSeconds < 0 ? '-' : '+'
    const abs = Math.abs(utcOffsetSeconds)
    const hours = Math.floor(abs / 3600)
    const minutes = Math.round((abs % 3600) / 60)
    const pad = (n) => String(n).padStart(2, '0')
    return `UTC${sign}${pad(hours)}:${pad(minutes)}`
}

/**
 * Agrupa cifras con punto de miles (es-ES): 34_250 -> "34.250".
 */
export function formatNumber(value) {
    if (value === null || value === undefined) return null
    return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

/**
 * Etiqueta de fecha "martes, 9 ago." para los días del pronóstico.
 * index 0 = hoy, 1 = mañana; el resto usa el calendario de la fecha.
 */
export function formatDayLabel(dateString, index = 0) {
    const labels = [
        'Hoy',
        'Mañana',
        'Martes',
        'Miércoles',
        'Jueves',
        'Viernes',
        'Sábado',
        'Domingo',
        'Lunes',
    ]
    if (index === 0) return 'Hoy'
    if (index === 1) return 'Mañana'
    try {
        // El día de la semana es una propiedad del calendario de la fecha
        // (YYYY-MM-DD). Se construye en UTC al mediodía para no arrastrar
        // conversiones de zona horaria.
        const [year, month, day] = dateString.split('-').map(Number)
        const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0))
        const weekday = new Intl.DateTimeFormat('es-ES', {
            timeZone: 'UTC',
            weekday: 'long',
        }).format(date)
        return weekday.charAt(0).toUpperCase() + weekday.slice(1)
    } catch {
        return labels[index] ?? dateString
    }
}
