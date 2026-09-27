import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from 'recharts'

import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { formatCompactCurrency } from '@/lib/formatters'

import type { BreakdownPoint } from './trendData'

/** Acento Hum asignado a cada categoría (cada una es dueña de su superficie). */
const CATEGORY_COLORS: Readonly<Record<string, string>> = {
    electronica: 'var(--color-cyan)',
    hogar: 'var(--color-pear)',
    moda: 'var(--color-coral)',
    deportes: 'var(--color-lavender)',
    alimentacion: 'var(--color-mint)',
    juguetes: 'var(--color-pear-deep)',
}

interface CategoryBarChartProps {
    data: BreakdownPoint[]
}

/** Ventas por categoría en barras verticales, cada una con su acento. */
export function CategoryBarChart({ data }: CategoryBarChartProps) {
    return (
        <ChartContainer className="h-64 w-full" config={{}}>
            <BarChart
                data={data}
                margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
                accessibilityLayer
            >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    interval={0}
                />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    width={60}
                    tickFormatter={(value: number) => formatCompactCurrency(value)}
                />
                <ChartTooltip
                    cursor={{ fill: 'var(--color-paper-2)', opacity: 0.6 }}
                    content={
                        <ChartTooltipContent
                            formatter={(value) => formatCompactCurrency(Number(value))}
                        />
                    }
                />
                <Bar dataKey="revenue" radius={[8, 8, 0, 0]} maxBarSize={48}>
                    {data.map((entry) => (
                        <Cell
                            key={entry.id}
                            fill={CATEGORY_COLORS[entry.id] ?? 'var(--color-pear)'}
                        />
                    ))}
                </Bar>
            </BarChart>
        </ChartContainer>
    )
}
