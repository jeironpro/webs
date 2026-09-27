/**
 * Lista de tickets recientes.
 * Muestra los últimos tickets en formato de grid con alineación vertical.
 * Incluye animaciones de entrada y hover effects.
 */
import { useEffect, useRef } from 'react'
import { ArrowUpRight, MessageSquare } from 'lucide-react'
import { Link } from 'react-router-dom'
import { animate, createScope, stagger } from 'animejs'
import { PriorityBadge, StatusBadge } from '@/components/tickets/badges'
import { getClientePorId, getConversacionesDeTicket } from '@/lib/mock'
import { formatearFecha } from '@/lib/format'
import type { Ticket } from '@/lib/types'

export function TicketsRecientes({ tickets }: { tickets: Ticket[] }) {
    const rootRef = useRef<HTMLDivElement>(null)
    const scopeRef = useRef<ReturnType<typeof createScope> | null>(null)

    useEffect(() => {
        scopeRef.current = createScope({ root: rootRef }).add(() => {
            animate('.ticket-row', {
                opacity: [0, 1],
                translateX: [-12, 0],
                duration: 400,
                delay: stagger(60, { start: 200 }),
                ease: 'out(3)',
            })
        })
        return () => scopeRef.current?.revert()
    }, [])

    return (
        <div
            ref={rootRef}
            className="grid grid-cols-[1fr_minmax(0,auto)_minmax(0,auto)_minmax(0,auto)] gap-x-3 rounded-[var(--radius-lg)] border border-border bg-card"
        >
            {tickets.map((ticket) => {
                const cliente = getClientePorId(ticket.cliente_id)
                const mensajes = getConversacionesDeTicket(ticket.id).length
                return (
                    <div
                        key={ticket.id}
                        className="ticket-row col-span-full grid grid-cols-[subgrid] border-t border-border first:border-t-0"
                        style={{ opacity: 0 }}
                    >
                        <Link
                            to={`/tickets/${ticket.id}`}
                            className="group col-span-full grid grid-cols-[subgrid] items-center px-4 py-3 transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)] hover:bg-muted/40 focus-visible:bg-muted/40"
                        >
                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-foreground group-hover:underline">
                                    {ticket.titulo}
                                </p>
                                <p className="mt-0.5 truncate font-mono text-[11px] tracking-[0.08em] text-ink-2 uppercase">
                                    {cliente?.empresa ?? cliente?.nombre}
                                    <span aria-hidden="true"> · </span>
                                    <time dateTime={ticket.creado_el}>
                                        {formatearFecha(ticket.creado_el)}
                                    </time>
                                </p>
                            </div>
                            <div className="hidden sm:block">
                                <PriorityBadge prioridad={ticket.prioridad} />
                            </div>
                            <div className="hidden sm:block">
                                <StatusBadge estado={ticket.estado} />
                            </div>
                            <div className="flex items-center justify-end gap-2">
                                <span className="flex items-center gap-1.5 font-mono text-[11px] text-ink-2 tabular-nums">
                                    <MessageSquare aria-hidden="true" className="size-3.5" />
                                    {mensajes}
                                </span>
                                <ArrowUpRight
                                    aria-hidden="true"
                                    className="size-4 shrink-0 text-ink-3 opacity-0 transition-opacity duration-[var(--dur-fast)] ease-[var(--ease-out)] group-hover:opacity-100"
                                />
                            </div>
                        </Link>
                    </div>
                )
            })}
        </div>
    )
}
