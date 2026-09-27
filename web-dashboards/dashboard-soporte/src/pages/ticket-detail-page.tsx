import { ArrowLeft, Mail, MapPin } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
    ETIQUETAS_CANAL,
    ETIQUETAS_CATEGORIA,
    PriorityBadge,
    StatusBadge,
} from '@/components/tickets/badges'
import { HiloConversacion } from '@/components/tickets/hilo-conversacion'
import {
    getAgentePorId,
    getClientePorId,
    getConversacionesDeTicket,
    getTicketPorId,
} from '@/lib/mock'
import { formatearDuracionHoras, formatearFechaHora, formatearIniciales } from '@/lib/format'

function FilaDato({ etiqueta, valor }: { etiqueta: string; valor: string }) {
    return (
        <div>
            <dt className="text-xs text-muted-foreground">{etiqueta}</dt>
            <dd className="truncate text-sm font-medium text-foreground">{valor}</dd>
        </div>
    )
}

export function TicketDetailPage() {
    const { ticketId } = useParams()
    const ticket = getTicketPorId(ticketId ?? '')

    if (!ticket) {
        return (
            <section className="flex max-w-2xl flex-col items-center gap-3 px-4 py-16 text-center">
                <p className="eyebrow">404</p>
                <p className="text-lg font-semibold text-foreground">Ticket no encontrado</p>
                <p className="text-sm text-muted-foreground">
                    El ticket {ticketId} no existe o fue eliminado.
                </p>
                <Button variant="outline" nativeButton={false} render={<Link to="/tickets" />}>
                    Volver a Tickets
                </Button>
            </section>
        )
    }

    const cliente = getClientePorId(ticket.cliente_id)
    const agente = getAgentePorId(ticket.agente_id)
    const mensajes = getConversacionesDeTicket(ticket.id)
    const tiempoRespuesta = ticket.primera_respuesta_el
        ? (new Date(ticket.primera_respuesta_el).getTime() - new Date(ticket.creado_el).getTime()) /
          3_600_000
        : null

    return (
        <section className="flex flex-col gap-4">
            <Button
                variant="ghost"
                size="sm"
                className="-mx-2 w-fit"
                nativeButton={false}
                render={<Link to="/tickets" />}
            >
                <ArrowLeft aria-hidden="true" className="size-4" />
                Volver a Tickets
            </Button>

            <Card>
                <CardHeader>
                    <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge estado={ticket.estado} />
                        <PriorityBadge prioridad={ticket.prioridad} />
                        <span className="text-sm text-muted-foreground">
                            {ETIQUETAS_CATEGORIA[ticket.categoria]}
                        </span>
                    </div>
                    <CardTitle className="text-2xl">{ticket.titulo}</CardTitle>
                    <CardDescription className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] tracking-[0.08em] text-ink-2 uppercase">
                        <span className="tabular-nums">{ticket.id}</span>
                        <span>{ETIQUETAS_CANAL[ticket.canal]}</span>
                        <span>
                            Creado{' '}
                            <time dateTime={ticket.creado_el}>
                                {formatearFechaHora(ticket.creado_el)}
                            </time>
                        </span>
                        {tiempoRespuesta !== null && (
                            <span>Respuesta en {formatearDuracionHoras(tiempoRespuesta)}</span>
                        )}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="max-w-prose text-sm text-foreground">{ticket.descripcion}</p>
                </CardContent>
            </Card>

            <div className="grid items-start gap-4 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <p className="eyebrow mb-1">Historial</p>
                        <CardTitle className="text-xl">Conversación</CardTitle>
                        <CardDescription className="font-mono text-[11px] tracking-[0.08em] uppercase">
                            {mensajes.length} mensajes
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <HiloConversacion mensajes={mensajes} estado={ticket.estado} />
                    </CardContent>
                </Card>

                <div className="flex flex-col gap-4">
                    <Card>
                        <CardHeader>
                            <p className="eyebrow mb-1">Quién reporta</p>
                            <CardTitle className="text-xl">Cliente</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {cliente && (
                                <div className="flex items-center gap-3">
                                    <Avatar size="lg">
                                        <AvatarFallback>
                                            {formatearIniciales(cliente.nombre)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium text-foreground">
                                            {cliente.nombre}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {cliente.empresa}
                                        </p>
                                    </div>
                                </div>
                            )}
                            <dl className="grid gap-3">
                                <FilaDato etiqueta="Plan" valor={cliente?.plan ?? '—'} />
                                <div>
                                    <dt className="sr-only">Email</dt>
                                    <dd className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Mail aria-hidden="true" className="size-4 shrink-0" />
                                        {cliente?.email ?? '—'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="sr-only">Ciudad</dt>
                                    <dd className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <MapPin aria-hidden="true" className="size-4 shrink-0" />
                                        {cliente?.ciudad ?? '—'}
                                    </dd>
                                </div>
                            </dl>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <p className="eyebrow mb-1">Equipo</p>
                            <CardTitle className="text-xl">Asignación</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {agente ? (
                                <div className="flex items-center gap-3">
                                    <Avatar size="lg">
                                        <AvatarFallback>
                                            {formatearIniciales(agente.nombre)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium text-foreground">
                                            {agente.nombre}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {agente.rol}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    Sin asignar a un agente todavía.
                                </p>
                            )}
                            <dl className="grid gap-3">
                                <FilaDato
                                    etiqueta="Tiempo de respuesta"
                                    valor={
                                        tiempoRespuesta
                                            ? formatearDuracionHoras(tiempoRespuesta)
                                            : 'Sin responder'
                                    }
                                />
                                <FilaDato
                                    etiqueta="Cerrado"
                                    valor={
                                        ticket.cerrado_el
                                            ? formatearFechaHora(ticket.cerrado_el)
                                            : '—'
                                    }
                                />
                                <FilaDato
                                    etiqueta="Satisfacción"
                                    valor={
                                        ticket.satisfaccion
                                            ? `${ticket.satisfaccion}/5`
                                            : 'Sin calificar'
                                    }
                                />
                            </dl>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}
