/** Suma o resta días a una fecha ISO (YYYY-MM-DD) y devuelve otra fecha ISO. */
export function addDaysIso(isoDate: string, days: number): string {
    const date = new Date(`${isoDate}T00:00:00Z`)
    date.setUTCDate(date.getUTCDate() + days)
    return date.toISOString().slice(0, 10)
}

/** Días entre dos fechas ISO (inclusive). */
export function dayDiffIso(from: string, to: string): number {
    const start = new Date(`${from}T00:00:00Z`).getTime()
    const end = new Date(`${to}T00:00:00Z`).getTime()
    return Math.round((end - start) / 86_400_000)
}
