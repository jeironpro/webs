/**
 * Gráfico de tickets por día.
 * Muestra la tendencia de tickets abiertos, en progreso y cerrados.
 * Incluye tabla de acceso alternativo para lectores de pantalla.
 */
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'
import type { SerieDia } from '@/lib/stats'
import { ChartTooltip } from '@/components/charts/chart-tooltip'

const SERIES = [
    { key: 'cerrado', etiqueta: 'Cerrados', color: 'var(--success)' },
    { key: 'en_progreso', etiqueta: 'En progreso', color: 'var(--brand)' },
    { key: 'abierto', etiqueta: 'Abiertos', color: 'var(--warning)' },
] as const

export function TicketsPorDiaChart({ datos }: { datos: SerieDia[] }) {
    return (
        <div>
            <div
                className="h-48 w-full sm:h-64"
                role="img"
                aria-label="Tickets creados por día y por estado en los últimos 30 días"
            >
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={datos} margin={{ top: 4, right: 4, bottom: 0, left: -18 }}>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            className="stroke-border"
                        />
                        <XAxis
                            dataKey="fecha"
                            tickFormatter={(valor: string) => {
                                const [, mes, dia] = valor.split('-')
                                return `${dia}/${mes}`
                            }}
                            minTickGap={28}
                            tick={{ fontSize: 12 }}
                            stroke="var(--ink-3)"
                            fontSize={12}
                        />
                        <YAxis
                            allowDecimals={false}
                            width={30}
                            tick={{ fontSize: 12 }}
                            stroke="var(--ink-3)"
                            fontSize={12}
                        />
                        <Tooltip
                            content={<ChartTooltip />}
                            labelFormatter={(label) => {
                                const [, mes, dia] = String(label).split('-')
                                return `${dia}/${mes}`
                            }}
                        />
                        {SERIES.map((serie) => (
                            <Area
                                key={serie.key}
                                type="monotone"
                                dataKey={serie.key}
                                name={serie.etiqueta}
                                stackId="tickets"
                                stroke={serie.color}
                                fill={serie.color}
                                fillOpacity={0.25}
                                strokeWidth={2}
                            />
                        ))}
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                {SERIES.map((serie) => (
                    <li key={serie.key} className="flex items-center gap-1.5">
                        <span
                            aria-hidden="true"
                            className="size-2 rounded-full"
                            style={{ backgroundColor: serie.color }}
                        />
                        {serie.etiqueta}
                    </li>
                ))}
            </ul>

            <table className="sr-only">
                <caption>Tickets creados por día y por estado</caption>
                <thead>
                    <tr>
                        <th scope="col">Fecha</th>
                        {SERIES.map((serie) => (
                            <th key={serie.key} scope="col">
                                {serie.etiqueta}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {datos.map((dia) => (
                        <tr key={dia.fecha}>
                            <th scope="row">{dia.fecha}</th>
                            <td>{dia.cerrado}</td>
                            <td>{dia.en_progreso}</td>
                            <td>{dia.abierto}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
