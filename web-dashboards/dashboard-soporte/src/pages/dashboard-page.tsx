import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { animate, createScope, stagger } from 'animejs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { KpiCard } from '@/components/kpis/kpi-card'
import { DistribucionCategoriaChart } from '@/components/charts/distribucion-categoria-chart'
import { TicketsPorDiaChart } from '@/components/charts/tickets-por-dia-chart'
import { TicketsRecientes } from '@/components/tickets/tickets-recientes'
import {
    getConteoPorEstado,
    getDistribucionPorCategoria,
    getSatisfaccionPromedio,
    getTicketsPorDia,
    getTicketsRecientes,
    getTiempoRespuestaPromedioHoras,
    getTiempoResolucionPromedioHoras,
} from '@/lib/stats'
import { TICKETS } from '@/lib/mock'
import { formatearDuracionHoras } from '@/lib/format'

export function DashboardPage() {
    const rootRef = useRef<HTMLElement>(null)
    const scopeRef = useRef<ReturnType<typeof createScope> | null>(null)

    useEffect(() => {
        scopeRef.current = createScope({ root: rootRef }).add(() => {
            animate('.chart-entrance', {
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 550,
                delay: stagger(120, { start: 500 }),
                ease: 'out(3)',
            })
        })
        return () => scopeRef.current?.revert()
    }, [])

    const conteo = getConteoPorEstado(TICKETS)
    const respuestaPromedio = getTiempoRespuestaPromedioHoras(TICKETS)
    const resolucionPromedio = getTiempoResolucionPromedioHoras(TICKETS)
    const satisfaccion = getSatisfaccionPromedio(TICKETS)
    const serie = getTicketsPorDia(TICKETS, 30)
    const distribucionCategoria = getDistribucionPorCategoria(TICKETS)
    const recientes = getTicketsRecientes(TICKETS, 5)

    const conRespuesta = TICKETS.filter((ticket) => ticket.primera_respuesta_el).length

    return (
        <section ref={rootRef} className="flex flex-col gap-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <KpiCard
                    etiqueta="Tickets abiertos"
                    valor={String(conteo.abierto)}
                    detalle="Esperando primera respuesta"
                    destacado
                    index={0}
                />
                <KpiCard
                    etiqueta="En progreso"
                    valor={String(conteo.en_progreso)}
                    detalle="Siendo atendidos por el equipo"
                    index={1}
                />
                <KpiCard
                    etiqueta="Cerrados"
                    valor={String(conteo.cerrado)}
                    detalle={`CSAT ${satisfaccion ?? '—'} de 5`}
                    index={2}
                />
                <KpiCard
                    etiqueta="Tiempo de respuesta promedio"
                    valor={formatearDuracionHoras(respuestaPromedio)}
                    detalle={`Basado en ${conRespuesta} primeras respuestas`}
                    index={3}
                />
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
                <Card className="chart-entrance lg:col-span-2" style={{ opacity: 0 }}>
                    <CardHeader className="flex-row items-end justify-between gap-4">
                        <div>
                            <p className="eyebrow mb-1">Flujo por día</p>
                            <CardTitle className="text-xl">Tickets por día</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <TicketsPorDiaChart datos={serie} />
                    </CardContent>
                </Card>

                <Card className="chart-entrance" style={{ opacity: 0 }}>
                    <CardHeader>
                        <p className="eyebrow mb-1">Composición</p>
                        <CardTitle className="text-xl">Por categoría</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DistribucionCategoriaChart distribucion={distribucionCategoria} />
                    </CardContent>
                </Card>
            </div>

            <Card className="chart-entrance" style={{ opacity: 0 }}>
                <CardHeader className="flex-row items-end justify-between gap-4">
                    <div>
                        <p className="eyebrow mb-1">Últimas solicitudes</p>
                        <CardTitle className="text-xl">Tickets recientes</CardTitle>
                        <CardDescription>
                            Tiempo medio de resolución {formatearDuracionHoras(resolucionPromedio)}{' '}
                            {satisfaccion !== null ? `· CSAT ${satisfaccion}/5` : ''}
                        </CardDescription>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        nativeButton={false}
                        render={<Link to="/tickets" />}
                    >
                        Ver todos
                    </Button>
                </CardHeader>
                <CardContent>
                    <TicketsRecientes tickets={recientes} />
                </CardContent>
            </Card>
        </section>
    )
}
