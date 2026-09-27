import { useMemo } from 'react'
import { create } from 'zustand'

import type {
    Category,
    Channel,
    CustomerMonth,
    DailySale,
    MonthlySeries,
    Order,
    Region,
    WeeklySeries,
} from '@/types'
import { DEFAULT_FILTERS, filterRecords, type DashboardFilters } from '@/lib/filters'

export type TrendPeriod = 'diario' | 'semanal' | 'mensual'

export interface DashboardData {
    daily: DailySale[]
    weekly: WeeklySeries[]
    monthly: MonthlySeries[]
    customers: CustomerMonth[]
    orders: Order[]
    categories: Category[]
    regions: Region[]
    channels: Channel[]
}

type LoadStatus = 'idle' | 'loading' | 'ready' | 'error'

interface DashboardState {
    status: LoadStatus
    /** conmutador de tendencias: diario / semanal / mensual */
    period: TrendPeriod
    /** filtros activos (fecha, categoría, región, canal) */
    filters: DashboardFilters
    data: DashboardData | null
    setPeriod: (period: TrendPeriod) => void
    setFilters: (patch: Partial<DashboardFilters>) => void
    resetFilters: () => void
    loadData: () => Promise<void>
}

/**
 * Store global del dashboard. Carga los JSON mock de forma diferida
 * (dynamic import) para no inflar el bundle inicial.
 */
export const useDashboardStore = create<DashboardState>((set) => ({
    status: 'idle',
    period: 'diario',
    filters: DEFAULT_FILTERS,
    data: null,

    setPeriod: (period) => set({ period }),

    setFilters: (patch) => set((state) => ({ filters: { ...state.filters, ...patch } })),

    resetFilters: () => set({ filters: DEFAULT_FILTERS }),

    loadData: async () => {
        set({ status: 'loading' })
        try {
            const [daily, weekly, monthly, customers, orders, categories, regions, channels] =
                await Promise.all([
                    import('@/data/daily-sales.json'),
                    import('@/data/weekly.json'),
                    import('@/data/monthly.json'),
                    import('@/data/customers.json'),
                    import('@/data/orders.json'),
                    import('@/data/categories.json'),
                    import('@/data/regions.json'),
                    import('@/data/channels.json'),
                ])

            set({
                status: 'ready',
                data: {
                    daily: daily.default,
                    weekly: weekly.default,
                    monthly: monthly.default,
                    customers: customers.default,
                    orders: orders.default as Order[],
                    categories: categories.default,
                    regions: regions.default,
                    channels: channels.default,
                },
            })
        } catch {
            set({ status: 'error' })
        }
    },
}))

/** Registros diarios con los filtros activos ya aplicados. */
export function useFilteredDaily(): DailySale[] {
    const data = useDashboardStore((state) => state.data)
    const filters = useDashboardStore((state) => state.filters)

    return useMemo(() => (data ? filterRecords(data.daily, filters) : []), [data, filters])
}
