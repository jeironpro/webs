import { useEffect, useMemo, useRef } from 'react'
import { animate } from 'animejs'

import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { useDashboardStore, useFilteredDaily, type TrendPeriod } from '@/store/useDashboardStore'
import { formatCompactCurrency } from '@/lib/formatters'

import { buildTrendData, type TrendData } from './trendData'
import { ChartCard } from './ChartCard'
import { TrendAreaChart } from './TrendAreaChart'
import { CategoryBarChart } from './CategoryBarChart'
import { ChannelDonutChart } from './ChannelDonutChart'
import { RegionBarChart } from './RegionBarChart'

const PERIOD_LABELS: Record<TrendPeriod, string> = {
    diario: 'últimos 30 días',
    semanal: 'últimas 12 semanas',
    mensual: 'últimos 8 meses',
}

function ChartsSkeleton() {
    return (
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {[0, 1, 2, 3].map((item) => (
                <Card
                    key={item}
                    className={
                        item === 1 || item === 3
                            ? 'lg:col-span-3'
                            : item === 2
                              ? 'lg:col-span-2'
                              : undefined
                    }
                >
                    <CardContent className="flex h-56 flex-col justify-end gap-3 p-5">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-24" />
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

/**
 * Sección de tendencias: conmutador diario / semanal / mensual y cuatro
 * gráficos coherentes entre sí (misma ventana de datos). El cambio de
 * periodo se anima con animejs.
 */
export function TrendsSection() {
    const status = useDashboardStore((state) => state.status)
    const data = useDashboardStore((state) => state.data)
    const filters = useDashboardStore((state) => state.filters)
    const period = useDashboardStore((state) => state.period)
    const setPeriod = useDashboardStore((state) => state.setPeriod)
    const filteredDaily = useFilteredDaily()

    const trends: TrendData | null = useMemo(() => {
        if (!data) return null
        // Con rango de fechas activo los registros ya llegan filtrados (sin re-ventanear).
        return buildTrendData(filteredDaily, period, data.categories, data.regions, data.channels, {
            windowed: filters.dateRange === null,
        })
    }, [data, filteredDaily, period, filters.dateRange])

    const gridRef = useRef<HTMLDivElement>(null)

    // Transición orquestada al cambiar de periodo (animejs).
    useEffect(() => {
        const element = gridRef.current
        if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        const animation = animate(element, {
            opacity: [0.25, 1],
            translateY: [12, 0],
            duration: 420,
            ease: 'outExpo',
        })
        return () => {
            animation.cancel()
        }
    }, [period])

    if (status !== 'ready' || !trends) return <ChartsSkeleton />

    return (
        <section id="tendencias" aria-label="Tendencias" className="scroll-mt-24 py-12">
            <div className="reveal flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="mono-label">Tendencias</p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                        Cómo va la temporada
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Ventas {PERIOD_LABELS[period]}
                    </p>
                </div>
                <Tabs
                    value={period}
                    onValueChange={(value) => setPeriod(value as TrendPeriod)}
                    className="w-fit"
                >
                    <TabsList className="h-10 rounded-full">
                        <TabsTrigger value="diario">Diario</TabsTrigger>
                        <TabsTrigger value="semanal">Semanal</TabsTrigger>
                        <TabsTrigger value="mensual">Mensual</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div ref={gridRef} className="mt-8 grid gap-4 lg:grid-cols-3">
                <ChartCard
                    title="Ventas del periodo"
                    description={PERIOD_LABELS[period]}
                    className="lg:col-span-3"
                    action={
                        <Badge variant="secondary" className="py-1 text-sm font-semibold">
                            {formatCompactCurrency(trends.totalRevenue)}
                        </Badge>
                    }
                >
                    <TrendAreaChart data={trends.trend} periodLabel={PERIOD_LABELS[period]} />
                </ChartCard>

                <ChartCard
                    title="Ventas por categoría"
                    description="Desglose del periodo"
                    className="lg:col-span-2"
                >
                    <CategoryBarChart data={trends.byCategory} />
                </ChartCard>

                <ChartCard title="Por canal" description="Distribución del periodo">
                    <ChannelDonutChart data={trends.byChannel} />
                </ChartCard>

                <ChartCard
                    title="Por región"
                    description="Desglose del periodo"
                    className="lg:col-span-3"
                >
                    <RegionBarChart data={trends.byRegion} />
                </ChartCard>
            </div>
        </section>
    )
}
