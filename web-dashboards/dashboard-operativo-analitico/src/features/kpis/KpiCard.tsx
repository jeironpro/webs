import type { CSSProperties } from 'react'
import { ArrowDownRightIcon, ArrowUpRightIcon } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { formatDelta } from '@/lib/formatters'
import { useAnimatedNumber } from '@/hooks/useAnimatedNumber'

import type { KpiDefinition } from './kpiConfig'
import { Sparkline } from './Sparkline'

interface KpiCardProps {
    definition: KpiDefinition
    value: number
    /** variación % frente al periodo anterior (null si no hay comparación) */
    delta: number | null
    /** serie diaria del KPI para el sparkline */
    series: number[]
}

function DeltaBadge({ delta }: { delta: number | null }) {
    if (delta === null) return null

    const positive = delta >= 0
    const Icon = positive ? ArrowUpRightIcon : ArrowDownRightIcon
    return (
        <span
            className={cn(
                'inline-flex shrink-0 items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold tabular',
                positive ? 'bg-mint/30 text-foreground' : 'bg-coral/15 text-foreground',
            )}
        >
            <Icon className="size-3.5" aria-hidden="true" />
            {formatDelta(delta)}
            <span className="sr-only">
                {positive ? 'aumentó' : 'disminuyó'} frente al periodo anterior
            </span>
        </span>
    )
}

/**
 * Tarjeta KPI del tema Hum: superficie con tint de acento (color-shift en
 * hover), contador animado con animejs y sparkline SVG.
 */
export function KpiCard({ definition, value, delta, series }: KpiCardProps) {
    const displayValue = useAnimatedNumber(value)
    const { icon: Icon, accent, label, hint, format, featured } = definition

    return (
        <Card
            data-kpi={definition.id}
            style={{ '--card-accent': accent } as CSSProperties}
            className={cn(
                'kpi-card reveal border-0',
                featured && 'sm:col-span-2 xl:col-span-2 xl:row-span-2',
            )}
        >
            <CardContent className={cn('flex h-full flex-col gap-4', featured ? 'p-6' : 'p-5')}>
                <div className="flex items-center justify-between gap-2">
                    <span className="kpi-card__icon" aria-hidden="true">
                        <Icon className="size-4" />
                    </span>
                    <DeltaBadge delta={delta} />
                </div>

                <div className="min-w-0">
                    <p
                        aria-live="polite"
                        className={cn(
                            'kpi-card__value',
                            featured ? 'text-4xl sm:text-5xl' : 'text-3xl',
                        )}
                    >
                        {format(displayValue)}
                    </p>
                    <p className="mt-1.5 text-sm font-semibold">{label}</p>
                    <p className="text-xs text-muted-foreground">{hint}</p>
                </div>

                <div className="mt-auto">
                    <Sparkline data={series} />
                </div>
            </CardContent>
        </Card>
    )
}
