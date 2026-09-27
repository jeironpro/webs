/**
 * Hilo de conversación del ticket.
 * Muestra los mensajes en orden cronológico con avatares y timestamps.
 * Incluye composer de mensajes deshabilitado (simulación).
 */
import { useEffect, useRef } from 'react'
import { BadgeCheck, StickyNote } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { animate, createScope, stagger } from 'animejs'
import { MessageComposer } from '@/components/tickets/message-composer'
import { getAgentePorId, getClientePorId } from '@/lib/mock'
import { formatearFechaHora, formatearIniciales } from '@/lib/format'
import type { Conversacion, TicketEstado } from '@/lib/types'

function obtenerAutor(mensaje: Conversacion): { nombre: string; rol: string | null } {
    if (mensaje.autor_tipo === 'agente') {
        const agente = getAgentePorId(mensaje.autor_id)
        return agente ? { nombre: agente.nombre, rol: agente.rol } : { nombre: 'Agente', rol: null }
    }
    if (mensaje.autor_tipo === 'cliente') {
        const cliente = getClientePorId(mensaje.autor_id)
        return cliente
            ? { nombre: cliente.nombre, rol: cliente.empresa }
            : { nombre: 'Cliente', rol: null }
    }
    return { nombre: 'Sistema', rol: null }
}

export function HiloConversacion({
    mensajes,
    estado,
}: {
    mensajes: Conversacion[]
    estado: TicketEstado
}) {
    const rootRef = useRef<HTMLOListElement>(null)
    const scopeRef = useRef<ReturnType<typeof createScope> | null>(null)

    useEffect(() => {
        scopeRef.current = createScope({ root: rootRef }).add(() => {
            animate('.msg-entrance', {
                opacity: [0, 1],
                translateX: [-8, 0],
                duration: 400,
                delay: stagger(70, { start: 100 }),
                ease: 'out(3)',
            })
        })
        return () => scopeRef.current?.revert()
    }, [])

    const ordenados = [...mensajes].sort(
        (a, b) => new Date(a.creado_el).getTime() - new Date(b.creado_el).getTime(),
    )

    const ticketCerrado = estado === 'cerrado'

    return (
        <div className="flex flex-col gap-4">
            <ol ref={rootRef} className="flex flex-col gap-4">
                {ordenados.map((mensaje) => {
                    if (mensaje.tipo === 'cambio_estado') {
                        return (
                            <li
                                key={mensaje.id}
                                className="msg-entrance flex items-center justify-center gap-2 text-center text-xs text-muted-foreground"
                                style={{ opacity: 0 }}
                            >
                                <BadgeCheck aria-hidden="true" className="size-3.5 shrink-0" />
                                <span className="max-w-[90%]">{mensaje.contenido}</span>
                                <time
                                    dateTime={mensaje.creado_el}
                                    className="shrink-0 whitespace-nowrap"
                                >
                                    {formatearFechaHora(mensaje.creado_el)}
                                </time>
                            </li>
                        )
                    }

                    const esNota = mensaje.tipo === 'nota_interna'
                    const esCliente = mensaje.autor_tipo === 'cliente'
                    const autor = obtenerAutor(mensaje)

                    if (esNota) {
                        return (
                            <li
                                key={mensaje.id}
                                className="msg-entrance mx-auto flex w-full max-w-lg flex-col gap-1.5 rounded-lg border border-dashed border-amber-400/60 bg-amber-50/60 px-4 py-3"
                                style={{ opacity: 0 }}
                            >
                                <span className="flex items-center gap-1.5 text-xs font-medium text-amber-900">
                                    <StickyNote aria-hidden="true" className="size-3.5" />
                                    Nota interna · {autor.nombre}
                                    <time
                                        dateTime={mensaje.creado_el}
                                        className="font-normal text-amber-900/70"
                                    >
                                        {formatearFechaHora(mensaje.creado_el)}
                                    </time>
                                </span>
                                <p className="text-sm text-amber-950">{mensaje.contenido}</p>
                            </li>
                        )
                    }

                    return (
                        <li
                            key={mensaje.id}
                            className={`msg-entrance flex items-start gap-3 ${esCliente ? '' : 'flex-row-reverse'}`}
                            style={{ opacity: 0 }}
                        >
                            <Avatar className="size-8 shrink-0">
                                <AvatarFallback>
                                    {mensaje.autor_tipo === 'sistema'
                                        ? '●'
                                        : formatearIniciales(autor.nombre)}
                                </AvatarFallback>
                            </Avatar>
                            <div
                                className={`flex max-w-[75%] flex-col gap-1 ${esCliente ? '' : 'items-end'}`}
                            >
                                <span className="flex items-baseline gap-2 font-mono text-[11px] tracking-[0.04em] text-ink-2 uppercase">
                                    <span className="font-medium text-foreground">
                                        {autor.nombre}
                                    </span>
                                    {autor.rol && <span aria-hidden="true">· {autor.rol}</span>}
                                    <time dateTime={mensaje.creado_el}>
                                        {formatearFechaHora(mensaje.creado_el)}
                                    </time>
                                </span>
                                <p
                                    className={`rounded-xl px-3.5 py-2.5 text-sm whitespace-pre-wrap ${
                                        esCliente
                                            ? 'bg-muted text-foreground'
                                            : 'bg-primary text-primary-foreground'
                                    }`}
                                >
                                    {mensaje.contenido}
                                </p>
                            </div>
                        </li>
                    )
                })}
            </ol>

            {!ticketCerrado && <MessageComposer />}
        </div>
    )
}
