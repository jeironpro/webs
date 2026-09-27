import { describe, expect, it } from 'vitest'
import type { Ticket } from './types'
import {
    getConteoPorEstado,
    getDistribucionPorCategoria,
    getDistribucionPorPrioridad,
    getSatisfaccionPromedio,
    getTicketsPorDia,
    getTicketsRecientes,
    getTiempoRespuestaPromedioHoras,
    getTiempoResolucionPromedioHoras,
} from './stats'

function ticket(parcial: Partial<Ticket>): Ticket {
    return {
        id: 'TK-X',
        titulo: 'Título',
        descripcion: 'Descripción',
        estado: 'abierto',
        prioridad: 'media',
        categoria: 'consulta',
        canal: 'email',
        cliente_id: 'cus-01',
        agente_id: 'ag-01',
        creado_el: '2026-08-01T10:00:00-03:00',
        primera_respuesta_el: null,
        cerrado_el: null,
        satisfaccion: null,
        ...parcial,
    }
}

describe('getConteoPorEstado', () => {
    it('cuenta los tickets por estado', () => {
        const tickets = [
            ticket({ id: '1', estado: 'abierto' }),
            ticket({ id: '2', estado: 'abierto' }),
            ticket({ id: '3', estado: 'en_progreso' }),
            ticket({ id: '4', estado: 'cerrado' }),
        ]

        expect(getConteoPorEstado(tickets)).toEqual({
            abierto: 2,
            en_progreso: 1,
            cerrado: 1,
        })
    })
})

describe('getTiempoRespuestaPromedioHoras', () => {
    it('promedia la primera respuesta de los tickets con respuesta', () => {
        const tickets = [
            ticket({
                id: '1',
                creado_el: '2026-08-01T10:00:00-03:00',
                primera_respuesta_el: '2026-08-01T12:00:00-03:00',
            }),
            ticket({
                id: '2',
                creado_el: '2026-08-02T10:00:00-03:00',
                primera_respuesta_el: '2026-08-02T14:00:00-03:00',
            }),
            ticket({
                id: '3',
                creado_el: '2026-08-03T10:00:00-03:00',
                primera_respuesta_el: null,
            }),
        ]

        expect(getTiempoRespuestaPromedioHoras(tickets)).toBe(3)
    })

    it('ignora tickets sin respuesta', () => {
        const tickets = [ticket({ primera_respuesta_el: null })]

        expect(getTiempoRespuestaPromedioHoras(tickets)).toBeNull()
    })
})

describe('getTiempoResolucionPromedioHoras', () => {
    it('promedia el tiempo hasta el cierre', () => {
        const tickets = [
            ticket({
                creado_el: '2026-08-01T10:00:00-03:00',
                cerrado_el: '2026-08-02T10:00:00-03:00',
            }),
            ticket({
                creado_el: '2026-08-01T10:00:00-03:00',
                cerrado_el: '2026-08-01T12:00:00-03:00',
            }),
        ]

        expect(getTiempoResolucionPromedioHoras(tickets)).toBe(13)
    })

    it('devuelve null cuando no hay tickets cerrados', () => {
        expect(getTiempoResolucionPromedioHoras([ticket({})])).toBeNull()
    })
})

describe('getSatisfaccionPromedio', () => {
    it('promedia las puntuaciones y redondea a un decimal', () => {
        const tickets = [
            ticket({ satisfaccion: 4 }),
            ticket({ satisfaccion: 5 }),
            ticket({ satisfaccion: null }),
        ]

        expect(getSatisfaccionPromedio(tickets)).toBe(4.5)
    })
})

describe('getDistribucionPorPrioridad', () => {
    it('cuenta cada prioridad', () => {
        const tickets = [
            ticket({ prioridad: 'critica' }),
            ticket({ prioridad: 'alta' }),
            ticket({ prioridad: 'media' }),
            ticket({ prioridad: 'media' }),
            ticket({ prioridad: 'baja' }),
        ]

        expect(getDistribucionPorPrioridad(tickets)).toEqual({
            baja: 1,
            media: 2,
            alta: 1,
            critica: 1,
        })
    })
})

describe('getDistribucionPorCategoria', () => {
    it('cuenta cada categoría', () => {
        const tickets = [
            ticket({ categoria: 'bug' }),
            ticket({ categoria: 'bug' }),
            ticket({ categoria: 'facturacion' }),
        ]

        const distribucion = getDistribucionPorCategoria(tickets)
        expect(distribucion.bug).toBe(2)
        expect(distribucion.facturacion).toBe(1)
        expect(distribucion.acceso).toBe(0)
    })
})

describe('getTicketsPorDia', () => {
    it('genera la serie de los últimos días incluyendo días sin tickets', () => {
        const tickets = [
            ticket({ id: '1', estado: 'abierto', creado_el: '2026-08-10T09:00:00-03:00' }),
            ticket({ id: '2', estado: 'cerrado', creado_el: '2026-08-10T11:00:00-03:00' }),
            ticket({
                id: '3',
                estado: 'en_progreso',
                creado_el: '2026-08-09T11:00:00-03:00',
            }),
        ]
        const serie = getTicketsPorDia(tickets, 3, new Date('2026-08-10T18:00:00-03:00'))

        expect(serie).toHaveLength(3)
        expect(serie[0]).toMatchObject({ fecha: '2026-08-08', total: 0 })
        expect(serie[1]).toMatchObject({ fecha: '2026-08-09', en_progreso: 1, total: 1 })
        expect(serie[2]).toMatchObject({
            fecha: '2026-08-10',
            abierto: 1,
            cerrado: 1,
            total: 2,
        })
    })
})

describe('getTicketsRecientes', () => {
    it('devuelve los tickets más recientes ordenados por fecha de creación', () => {
        const tickets = [
            ticket({ id: '1', creado_el: '2026-08-01T10:00:00-03:00' }),
            ticket({ id: '2', creado_el: '2026-08-05T10:00:00-03:00' }),
            ticket({ id: '3', creado_el: '2026-08-03T10:00:00-03:00' }),
        ]

        expect(getTicketsRecientes(tickets, 2).map((t) => t.id)).toEqual(['2', '3'])
    })
})
