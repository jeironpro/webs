import { useEffect, useMemo } from 'react'

import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { computeKpis, dailySeries, relativeDelta } from '@/lib/aggregations'
import { computeComparisonWindows } from '@/lib/filters'
import { useDashboardStore } from '@/store/useDashboardStore'
import { useReveal } from '@/hooks/useReveal'

import { KPI_DEFINITIONS } from './kpiConfig'
import { KpiCard } from './KpiCard'

/** Esqueleto de carga mientras llegan los datos mock. */
function KpiGridSkeleton() {
    return (
        <section
            aria-label="Cargando KPIs del negocio"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
            {[0, 1, 2, 3, 4, 5].map((item) => (
                <Card
                    key={item}
                    className={item === 0 ? 'sm:col-span-2 xl:col-span-2 xl:row-span-2' : undefined}
                >
                    <CardContent className="flex h-full flex-col gap-4 p-5">
                        <Skeleton className="size-9 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-9 w-28" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="mt-auto h-9 w-full" />
                    </CardContent>
                </Card>
            ))}
        </section>
    )
}

/**
 * Grilla de KPIs del negocio: ventas (destacada), conversión, pedidos,
 * ticket promedio, retención y clientes nuevos. Compara los últimos 30
 * días contra los 30 anteriores y anima los contadores con animejs.
 */
export function KpiGrid() {
    const status = useDashboardStore((state) => state.status)
    const data = useDashboardStore((state) => state.data)
    const filters = useDashboardStore((state) => state.filters)
    const loadData = useDashboardStore((state) => state.loadData)
    useReveal([status])

    // Carga los datos mock una sola vez al montar la primera sección que los consume.
    useEffect(() => {
        if (status === 'idle') void loadData()
    }, [status, loadData])

    const kpis = useMemo(() => {
        if (!data) return null

        // Respeta los filtros activos: ventana actual vs periodo anterior equivalente.
        const { current, previous } = computeComparisonWindows(data.daily, filters)
        const currentKpis = computeKpis(current)
        const previousKpis = computeKpis(previous)

        return KPI_DEFINITIONS.map((definition) => ({
            definition,
            value: currentKpis[definition.id],
            delta: relativeDelta(currentKpis[definition.id], previousKpis[definition.id]),
            series: dailySeries(current, definition.id).map((point) => point.value),
        }))
    }, [data, filters])

    if (status !== 'ready' || !kpis) return <KpiGridSkeleton />

    return (
        <section
            aria-label="KPIs del negocio"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
            {kpis.map(({ definition, value, delta, series }) => (
                <KpiCard
                    key={definition.id}
                    definition={definition}
                    value={value}
                    delta={delta}
                    series={series}
                />
            ))}
        </section>
    )
}
