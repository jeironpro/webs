/**
 * Gráfico de distribución por categoría.
 * Muestra la cantidad de tickets por categoría en formato de barras horizontales.
 * Incluye tabla de acceso alternativo para lectores de pantalla.
 */
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { Categoria } from '@/lib/types'
import { ETIQUETAS_CATEGORIA } from '@/components/tickets/badges'
import { ChartTooltip } from '@/components/charts/chart-tooltip'

export function DistribucionCategoriaChart({
    distribucion,
}: {
    distribucion: Record<Categoria, number>
}) {
    const datos = (Object.entries(distribucion) as [Categoria, number][])
        .map(([categoria, total]) => ({
            categoria: ETIQUETAS_CATEGORIA[categoria],
            total,
        }))
        .sort((a, b) => b.total - a.total)

    return (
        <div>
            <div
                className="h-44 w-full sm:h-56"
                role="img"
                aria-label="Distribución de tickets por categoría"
            >
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={datos}
                        layout="vertical"
                        margin={{ top: 0, right: 32, bottom: 0, left: 0 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            horizontal={false}
                            className="stroke-border"
                        />
                        <XAxis type="number" allowDecimals={false} hide />
                        <YAxis
                            type="category"
                            dataKey="categoria"
                            width={84}
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 12 }}
                            stroke="var(--ink-3)"
                            fontSize={12}
                        />
                        <Tooltip
                            content={<ChartTooltip />}
                            cursor={{ fill: 'var(--paper-2)', opacity: 0.6 }}
                        />
                        <Bar
                            dataKey="total"
                            name="Tickets"
                            fill="var(--brand)"
                            radius={[0, 4, 4, 0]}
                            barSize={18}
                            label={{ position: 'right', fontSize: 12, fill: 'var(--ink-2)' }}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <table className="sr-only">
                <caption>Distribución de tickets por categoría</caption>
                <thead>
                    <tr>
                        <th scope="col">Categoría</th>
                        <th scope="col">Tickets</th>
                    </tr>
                </thead>
                <tbody>
                    {datos.map((fila) => (
                        <tr key={fila.categoria}>
                            <th scope="row">{fila.categoria}</th>
                            <td>{fila.total}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
