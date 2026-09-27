const currencyFormatter = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
})

const numberFormatter = new Intl.NumberFormat('es-MX')

const compactNumberFormatter = new Intl.NumberFormat('es-MX', {
    notation: 'compact',
    maximumFractionDigits: 1,
})

/** 1.234.567 → $1.234.567 */
export function formatCurrency(value: number): string {
    return currencyFormatter.format(value)
}

/** 1.234.567 → $1,2M (prefijo de moneda + número compacto) */
export function formatCompactCurrency(value: number): string {
    return `$${compactNumberFormatter.format(value)}`
}

/** 12345.6 → 12.346 */
export function formatNumber(value: number): string {
    return numberFormatter.format(Math.round(value))
}

/** 1234567 → 1.2M */
export function formatCompactNumber(value: number): string {
    return compactNumberFormatter.format(value)
}

/** 0.0367 → 3,7 % */
export function formatPercent(value: number, digits = 1): string {
    return `${new Intl.NumberFormat('es-MX', {
        maximumFractionDigits: digits,
        minimumFractionDigits: digits,
    }).format(value * 100)} %`
}

const dateFormatter = new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
})

const shortDateFormatter = new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: 'short',
})

/** '2026-08-18' → '18 ago 2026' */
export function formatDate(isoDate: string): string {
    return dateFormatter.format(new Date(`${isoDate}T00:00:00`))
}

/** '2026-08-18' → '18 ago' */
export function formatShortDate(isoDate: string): string {
    return shortDateFormatter.format(new Date(`${isoDate}T00:00:00`))
}

/** Muestra un delta como "+12,4 %" o "−3,1 %". */
export function formatDelta(value: number): string {
    const sign = value > 0 ? '+' : value < 0 ? '−' : ''
    return `${sign}${Math.abs(value).toLocaleString('es-MX', {
        maximumFractionDigits: 1,
    })} %`
}
