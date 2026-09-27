import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from '@/components/ui/chart'
import { formatCompactCurrency } from '@/lib/formatters'

import type { BreakdownPoint } from './trendData'

const chartConfig = {
    revenue: {
        label: 'Ventas',
        color: 'var(--color-cyan)',
    },
} satisfies ChartConfig

interface RegionBarChartProps {
    data: BreakdownPoint[]
}

/** Ventas por región en barras horizontales (cian, el acento secundario). */
export function RegionBarChart({ data }: RegionBarChartProps) {
    return (
        <ChartContainer config={chartConfig} className="h-56 w-full">
            <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 0, right: 16, bottom: 0, left: 0 }}
                accessibilityLayer
            >
                <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                <XAxis
                    type="number"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value: number) => formatCompactCurrency(value)}
                />
                <YAxis
                    type="category"
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    width={76}
                    tickMargin={8}
                />
                <ChartTooltip
                    cursor={{ fill: 'var(--color-paper-2)', opacity: 0.6 }}
                    content={
                        <ChartTooltipContent
                            formatter={(value) => formatCompactCurrency(Number(value))}
                        />
                    }
                />
                <Bar
                    dataKey="revenue"
                    fill="var(--color-cyan)"
                    radius={[0, 8, 8, 0]}
                    maxBarSize={22}
                />
            </BarChart>
        </ChartContainer>
    )
}
