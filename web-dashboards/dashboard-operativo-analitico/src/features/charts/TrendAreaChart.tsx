import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from '@/components/ui/chart'
import { formatCompactCurrency } from '@/lib/formatters'

import type { TrendPoint } from './trendData'

const chartConfig = {
    revenue: {
        label: 'Ventas',
        color: 'var(--color-pear)',
    },
} satisfies ChartConfig

interface TrendAreaChartProps {
    data: TrendPoint[]
    /** sufijo del periodo para el título (ej. "últimos 30 días") */
    periodLabel: string
}

/** Tendencia de ventas del periodo como gráfico de área con gradiente pera. */
export function TrendAreaChart({ data, periodLabel }: TrendAreaChartProps) {
    return (
        <ChartContainer config={chartConfig} className="h-72 w-full">
            <AreaChart
                data={data}
                margin={{ top: 8, right: 12, bottom: 0, left: 0 }}
                accessibilityLayer
            >
                <defs>
                    <linearGradient id="trend-revenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-pear)" stopOpacity="0.45" />
                        <stop offset="95%" stopColor="var(--color-pear)" stopOpacity="0.02" />
                    </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                    dataKey="key"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    minTickGap={28}
                    interval="preserveStartEnd"
                />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    width={64}
                    tickFormatter={(value: number) => formatCompactCurrency(value)}
                />
                <ChartTooltip
                    cursor={{ stroke: 'var(--color-pear)', strokeDasharray: '3 3' }}
                    content={
                        <ChartTooltipContent
                            labelFormatter={(label) => `${String(label)} · ${periodLabel}`}
                            formatter={(value) => formatCompactCurrency(Number(value))}
                        />
                    }
                />
                <Area
                    dataKey="revenue"
                    type="monotone"
                    stroke="var(--color-pear)"
                    strokeWidth={2.5}
                    fill="url(#trend-revenue)"
                    activeDot={{ r: 5 }}
                />
            </AreaChart>
        </ChartContainer>
    )
}
