import type { DailySale } from '@/types'
import { addDaysIso } from './dates'

/** Ventana de comparación por defecto: últimos 30 días vs los 30 anteriores. */
export const DEFAULT_WINDOW_DAYS = 30

/**
 * Margen bruto por categoría (supuesto del negocio mock, en %).
 * Se usa para estimar el margen del periodo filtrado.
 */
export const CATEGORY_MARGIN_RATES: Readonly<Record<string, number>> = {
    electronica: 0.28,
    hogar: 0.35,
    moda: 0.45,
    deportes: 0.38,
    alimentacion: 0.25,
    juguetes: 0.4,
}

/** Totales agregados de un conjunto de registros diarios. */
export interface KpiTotals {
    revenue: number
    orders: number
    units: number
    visitors: number
    newCustomers: number
    returningCustomers: number
}

/** KPIs derivados del negocio (los que se muestran en las tarjetas). */
export interface KpiSet {
    revenue: number
    orders: number
    /** pedidos / visitas */
    conversion: number
    /** ingresos / pedidos */
    ticket: number
    /** recurrentes / (nuevos + recurrentes) */
    retention: number
    newCustomers: number
}

const EMPTY_TOTALS: KpiTotals = {
    revenue: 0,
    orders: 0,
    units: 0,
    visitors: 0,
    newCustomers: 0,
    returningCustomers: 0,
}

/** Suma los totales de un conjunto de registros diarios. */
export function sumTotals(records: DailySale[]): KpiTotals {
    const totals = { ...EMPTY_TOTALS }
    for (const record of records) {
        totals.revenue += record.rev
        totals.orders += record.ord
        totals.units += record.uni
        totals.visitors += record.vis
        totals.newCustomers += record.nc
        totals.returningCustomers += record.rc
    }
    return totals
}

/** Calcula los KPIs derivados a partir de los totales. */
export function deriveKpis(totals: KpiTotals): KpiSet {
    return {
        revenue: totals.revenue,
        orders: totals.orders,
        conversion: totals.visitors > 0 ? totals.orders / totals.visitors : 0,
        ticket: totals.orders > 0 ? totals.revenue / totals.orders : 0,
        retention:
            totals.newCustomers + totals.returningCustomers > 0
                ? totals.returningCustomers / (totals.newCustomers + totals.returningCustomers)
                : 0,
        newCustomers: totals.newCustomers,
    }
}

/** Atajo: KPIs de un conjunto de registros. */
export function computeKpis(records: DailySale[]): KpiSet {
    return deriveKpis(sumTotals(records))
}

/**
 * Variación relativa en % entre el periodo actual y el anterior.
 * Devuelve null cuando no hay dato anterior con el que comparar.
 */
export function relativeDelta(current: number, previous: number): number | null {
    if (previous === 0) return null
    return ((current - previous) / previous) * 100
}

/**
 * Divide los registros (ordenados por fecha) en ventana actual y ventana
 * anterior de la misma longitud. La ventana actual termina en la última
 * fecha disponible.
 */
export function sliceWindow(
    records: DailySale[],
    days = DEFAULT_WINDOW_DAYS,
): { current: DailySale[]; previous: DailySale[] } {
    if (records.length === 0) return { current: [], previous: [] }

    const sorted = [...records].sort((a, b) => a.d.localeCompare(b.d))
    const end = sorted[sorted.length - 1].d
    const startCurrent = addDaysIso(end, -(days - 1))
    const startPrevious = addDaysIso(startCurrent, -days)

    const current: DailySale[] = []
    const previous: DailySale[] = []
    for (const record of sorted) {
        if (record.d >= startCurrent && record.d <= end) current.push(record)
        else if (record.d >= startPrevious && record.d < startCurrent) previous.push(record)
    }
    return { current, previous }
}

/**
 * Serie diaria de un KPI para sparklines: agrega por fecha el valor
 * indicado (los KPIs derivados se calculan por día).
 */
export function dailySeries(
    records: DailySale[],
    key: keyof KpiSet,
): Array<{ date: string; value: number }> {
    const byDate = new Map<string, DailySale[]>()
    for (const record of records) {
        const group = byDate.get(record.d) ?? []
        group.push(record)
        byDate.set(record.d, group)
    }

    const dates = [...byDate.keys()].sort()
    return dates.map((date) => {
        const group = byDate.get(date) ?? []
        const totals = sumTotals(group)
        const value = deriveKpis(totals)[key]
        return { date, value }
    })
}
