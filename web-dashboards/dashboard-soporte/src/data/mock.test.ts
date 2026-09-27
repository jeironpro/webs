import { describe, expect, it } from 'vitest'
import { AGENTES, CLIENTES, CONVERSACIONES, TICKETS } from '@/lib/mock'
import { getConteoPorEstado, getTiempoRespuestaPromedioHoras } from '@/lib/stats'

describe('Datos mock de soporte', () => {
    it('tiene una distribución de 22 tickets con estado coherente', () => {
        expect(TICKETS).toHaveLength(22)
        expect(getConteoPorEstado(TICKETS)).toEqual({
            abierto: 6,
            en_progreso: 7,
            cerrado: 9,
        })
    })

    it('el tiempo de respuesta promedio ronda las dos horas', () => {
        expect(getTiempoRespuestaPromedioHoras(TICKETS)).toBeCloseTo(2.1, 1)
    })

    it('no repite identificadores de tickets', () => {
        const ids = TICKETS.map((ticket) => ticket.id)
        expect(new Set(ids).size).toBe(ids.length)
    })

    it('cada conversación referencia un ticket existente', () => {
        const idsDeTickets = new Set(TICKETS.map((ticket) => ticket.id))
        for (const conversacion of CONVERSACIONES) {
            expect(idsDeTickets.has(conversacion.ticket_id)).toBe(true)
        }
    })

    it('cada ticket referencia clientes y agentes existentes', () => {
        const idsDeClientes = new Set(CLIENTES.map((cliente) => cliente.id))
        const idsDeAgentes = new Set(AGENTES.map((agente) => agente.id))

        for (const ticket of TICKETS) {
            expect(idsDeClientes.has(ticket.cliente_id)).toBe(true)
            if (ticket.agente_id !== null) {
                expect(idsDeAgentes.has(ticket.agente_id)).toBe(true)
            }
        }
    })

    it('todo ticket con estado cerrado tiene fecha de cierre y satisfacción', () => {
        for (const ticket of TICKETS) {
            if (ticket.estado === 'cerrado') {
                expect(ticket.cerrado_el).not.toBeNull()
                expect(ticket.satisfaccion).not.toBeNull()
            }
        }
    })
})
