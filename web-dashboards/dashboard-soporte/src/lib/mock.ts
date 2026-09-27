/**
 * Datos mock y funciones de acceso a datos.
 * Simula una API de backend con datos estáticos en JSON.
 * Incluye funciones de búsqueda y filtrado.
 */
import agentsData from '@/data/agents.json'
import clientsData from '@/data/customers.json'
import conversationsData from '@/data/conversations.json'
import ticketsData from '@/data/tickets.json'
import type { Agente, Cliente, Conversacion, Ticket } from './types'

export const AGENTES: Agente[] = agentsData as Agente[]
export const CLIENTES: Cliente[] = clientsData as Cliente[]
export const TICKETS: Ticket[] = ticketsData as Ticket[]
export const CONVERSACIONES: Conversacion[] = conversationsData as Conversacion[]

export function getTicketPorId(id: string): Ticket | undefined {
    return TICKETS.find((ticket) => ticket.id === id)
}

export function getAgentePorId(id: string | null): Agente | undefined {
    if (!id) return undefined
    return AGENTES.find((agente) => agente.id === id)
}

export function getClientePorId(id: string | null): Cliente | undefined {
    if (!id) return undefined
    return CLIENTES.find((cliente) => cliente.id === id)
}

export function getConversacionesDeTicket(ticketId: string): Conversacion[] {
    return CONVERSACIONES.filter((conversacion) => conversacion.ticket_id === ticketId)
}
