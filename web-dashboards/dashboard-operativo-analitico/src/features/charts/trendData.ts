import type { Category, Channel, DailySale, Region } from '@/types'
import { sumTotals } from '@/lib/aggregations'
import { addDaysIso } from '@/lib/dates'
import { formatShortDate } from '@/lib/formatters'

import type { TrendPeriod } from '@/store/useDashboardStore'

/** Días visibles en la vista diaria. */
export const TREND_DAYS = 30
/** Semanas visibles en la vista semanal. */
export const TREND_WEEKS = 12
/** Meses visibles en la vista mensual. */
export const TREND_MONTHS = 8

export interface TrendPoint {
    /** etiqueta corta para el eje (día, semana o mes) */
    key: string
    /** fecha de referencia ISO */
    date: string
    revenue: number
    orders: number
}

export interface BreakdownPoint {
    id: string
    name: string
    revenue: number
    orders: number
}

export interface TrendData {
    period: TrendPeriod
    trend: TrendPoint[]
    byCategory: BreakdownPoint[]
    byChannel: BreakdownPoint[]
    byRegion: BreakdownPoint[]
    totalRevenue: number
}

function windowSizeFor(period: TrendPeriod): number {
    return period === 'diario'
        ? TREND_DAYS
        : period === 'semanal'
          ? TREND_WEEKS * 7
          : TREND_MONTHS * 30
}

/** Ventana de registros: los últimos `days` días disponibles. */
function lastNDays(records: DailySale[], days: number): DailySale[] {
    if (records.length === 0) return []
    const end = records.reduce((max, record) => (record.d > max ? record.d : max), records[0].d)
    const start = addDaysIso(end, -(days - 1))
    return records.filter((record) => record.d >= start && record.d <= end)
}

function groupByKey(records: DailySale[], keyOf: (record: DailySale) => string) {
    const byKey = new Map<string, DailySale[]>()
    for (const record of records) {
        const key = keyOf(record)
        const group = byKey.get(key) ?? []
        group.push(record)
        byKey.set(key, group)
    }
    return byKey
}

function mondayOf(isoDate: string): string {
    const date = new Date(`${isoDate}T00:00:00Z`)
    const day = date.getUTCDay() === 0 ? 6 : date.getUTCDay() - 1
    date.setUTCDate(date.getUTCDate() - day)
    return date.toISOString().slice(0, 10)
}

const monthNameFormatter = new Intl.DateTimeFormat('es-MX', { month: 'short' })

function capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1)
}

/** Agrupa los registros en puntos de tendencia según el periodo. */
function buildTrend(records: DailySale[], period: TrendPeriod): TrendPoint[] {
    const groups =
        period === 'diario'
            ? groupByKey(records, (record) => record.d)
            : period === 'semanal'
              ? groupByKey(records, (record) => mondayOf(record.d))
              : groupByKey(records, (record) => record.d.slice(0, 7))

    const keys = [...groups.keys()].sort()
    return keys.map((key) => {
        const totals = sumTotals(groups.get(key) ?? [])
        const label =
            period === 'diario'
                ? formatShortDate(key)
                : period === 'semanal'
                  ? formatShortDate(key)
                  : capitalize(monthNameFormatter.format(new Date(`${key}-01T00:00:00Z`)))

        return {
            key: label,
            date: key,
            revenue: totals.revenue,
            orders: totals.orders,
        }
    })
}

/** Desglose por una dimensión (categoría, región o canal). */
function buildBreakdown(
    records: DailySale[],
    dimension: 'c' | 'r' | 'ch',
    catalog: Array<{ id: string; name: string }>,
): BreakdownPoint[] {
    const byKey = groupByKey(records, (record) => record[dimension])
    const totalsByKey = new Map<string, { revenue: number; orders: number }>()

    for (const [key, group] of byKey) {
        const totals = sumTotals(group)
        totalsByKey.set(key, { revenue: totals.revenue, orders: totals.orders })
    }

    return catalog
        .map((item) => ({
            id: item.id,
            name: item.name,
            revenue: totalsByKey.get(item.id)?.revenue ?? 0,
            orders: totalsByKey.get(item.id)?.orders ?? 0,
        }))
        .sort((a, b) => b.revenue - a.revenue)
}

/**
 * Construye el conjunto de datos de tendencias para un periodo:
 * serie temporal + desgloses por categoría, canal y región, siempre
 * sobre la misma ventana de registros (todo coherente entre gráficos).
 */ export function buildTrendData(
    records: DailySale[],
    period: TrendPeriod,
    categories: Category[],
    regions: Region[],
    channels: Channel[],
    options: { windowed?: boolean } = {},
): TrendData {
    // Con un rango de fechas activo los registros ya llegan filtrados:
    // se muestran tal cual; sin rango se aplica la ventana del periodo.
    const windowRecords =
        options.windowed === false ? records : lastNDays(records, windowSizeFor(period))

    const trend = buildTrend(windowRecords, period)
    const byCategory = buildBreakdown(windowRecords, 'c', categories)
    const byChannel = buildBreakdown(windowRecords, 'ch', channels)
    const byRegion = buildBreakdown(windowRecords, 'r', regions)

    return {
        period,
        trend,
        byCategory,
        byChannel,
        byRegion,
        totalRevenue: trend.reduce((sum, point) => sum + point.revenue, 0),
    }
}
