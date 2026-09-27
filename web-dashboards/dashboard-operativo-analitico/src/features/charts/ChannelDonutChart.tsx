import { Cell, Pie, PieChart } from 'recharts'

import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from '@/components/ui/chart'
import { formatCompactCurrency, formatPercent } from '@/lib/formatters'

import type { BreakdownPoint } from './trendData'

const CHANNEL_COLORS: Readonly<Record<string, string>> = {
    online: 'var(--color-pear)',
    tienda: 'var(--color-cyan)',
    marketplace: 'var(--color-lavender)',
    mayorista: 'var(--color-coral)',
}

function buildConfig(data: BreakdownPoint[]): ChartConfig {
    return Object.fromEntries(
        data.map((entry) => [
            entry.id,
            { label: entry.name, color: CHANNEL_COLORS[entry.id] ?? 'var(--color-pear)' },
        ]),
    )
}

interface ChannelDonutChartProps {
    data: BreakdownPoint[]
}

/** Distribución de ventas por canal en donut con total en el centro. */
export function ChannelDonutChart({ data }: ChannelDonutChartProps) {
    const total = data.reduce((sum, entry) => sum + entry.revenue, 0)
    const config = buildConfig(data)

    return (
        <ChartContainer config={config} className="mx-auto h-64 w-full">
            <PieChart>
                <ChartTooltip
                    content={
                        <ChartTooltipContent
                            hideLabel
                            formatter={(value, name) => (
                                <>
                                    {name}
                                    <span className="ml-auto">
                                        {formatCompactCurrency(Number(value))} ·{' '}
                                        {formatPercent(total > 0 ? Number(value) / total : 0)}
                                    </span>
                                </>
                            )}
                        />
                    }
                />
                <Pie
                    data={data}
                    dataKey="revenue"
                    nameKey="name"
                    innerRadius="58%"
                    outerRadius="82%"
                    paddingAngle={2}
                    strokeWidth={0}
                >
                    {data.map((entry) => (
                        <Cell
                            key={entry.id}
                            fill={CHANNEL_COLORS[entry.id] ?? 'var(--color-pear)'}
                        />
                    ))}
                </Pie>
                <ChartLegend
                    content={<ChartLegendContent nameKey="name" />}
                    className="flex-wrap"
                />
            </PieChart>
        </ChartContainer>
    )
}
