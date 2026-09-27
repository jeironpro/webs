import type { DailySale } from '@/types'
import { sliceWindow } from './aggregations'
import { addDaysIso, dayDiffIso } from './dates'

export interface DateRangeFilter {
    from: string
    to: string
}

export interface DashboardFilters {
    dateRange: DateRangeFilter | null
    category: string | null
    region: string | null
    channel: string | null
}

export const DEFAULT_FILTERS: DashboardFilters = {
    dateRange: null,
    category: null,
    region: null,
    channel: null,
}

/** Aplica todos los filtros activos a los registros diarios (inclusive en fechas). */
export function filterRecords(records: DailySale[], filters: DashboardFilters): DailySale[] {
    return records.filter((record) => {
        if (filters.category !== null && record.c !== filters.category) return false
        if (filters.region !== null && record.r !== filters.region) return false
        if (filters.channel !== null && record.ch !== filters.channel) return false
        if (filters.dateRange !== null) {
            if (record.d < filters.dateRange.from || record.d > filters.dateRange.to) return false
        }
        return true
    })
}

/** Número de filtros activos (para el contador del botón limpiar). */
export function activeFilterCount(filters: DashboardFilters): number {
    return (
        (filters.dateRange !== null ? 1 : 0) +
        (filters.category !== null ? 1 : 0) +
        (filters.region !== null ? 1 : 0) +
        (filters.channel !== null ? 1 : 0)
    )
}

/**
 * Ventanas de comparación de KPIs respetando los filtros:
 * - Sin rango de fechas: últimos 30 días vs los 30 anteriores (sliceWindow).
 * - Con rango de fechas: el rango filtrado vs el periodo de igual longitud
 *   inmediatamente anterior, con los mismos filtros de categoría/región/canal.
 */
export function computeComparisonWindows(
    records: DailySale[],
    filters: DashboardFilters,
): { current: DailySale[]; previous: DailySale[] } {
    if (filters.dateRange !== null) {
        const current = filterRecords(records, filters)
        const length = dayDiffIso(filters.dateRange.from, filters.dateRange.to) + 1
        const previous = filterRecords(records, {
            ...filters,
            dateRange: {
                from: addDaysIso(filters.dateRange.from, -length),
                to: addDaysIso(filters.dateRange.from, -1),
            },
        })
        return { current, previous }
    }

    return sliceWindow(filterRecords(records, filters))
}
