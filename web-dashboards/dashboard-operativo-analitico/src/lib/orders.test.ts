import { describe, expect, it } from 'vitest'

import type { Order } from '@/types'
import { DEFAULT_FILTERS } from './filters'
import {
    applyDashboardFilters,
    filterOrders,
    normalize,
    paginate,
    totalPages,
    type OrderQuery,
} from './orders'

function order(id: string, overrides: Partial<Order> = {}): Order {
    return {
        id,
        date: '2026-08-18',
        customer: 'Carolina Díaz',
        category: 'deportes',
        region: 'centro',
        channel: 'online',
        items: 2,
        revenue: 128,
        status: 'completado',
        ...overrides,
    }
}

const ORDERS: Order[] = [
    order('NB-00001', { customer: 'Ana Pérez', category: 'electronica', status: 'completado' }),
    order('NB-00002', { customer: 'Luis Gómez', category: 'moda', status: 'enviado' }),
    order('NB-00003', { customer: 'Marta Ruiz', category: 'hogar', status: 'procesando' }),
    order('NB-00004', { customer: 'Sofía Núñez', category: 'alimentacion', status: 'cancelado' }),
    order('NB-00005', { customer: 'Pedro Sánchez', category: 'electronica', status: 'completado' }),
]

describe('applyDashboardFilters', () => {
    it('sin filtros activos devuelve todos los pedidos', () => {
        expect(applyDashboardFilters(ORDERS, DEFAULT_FILTERS)).toHaveLength(5)
    })

    it('filtra por categoría y región combinados', () => {
        const result = applyDashboardFilters(ORDERS, {
            ...DEFAULT_FILTERS,
            category: 'electronica',
            region: 'centro',
        })
        expect(result.map((item) => item.id)).toEqual(['NB-00001', 'NB-00005'])
    })

    it('filtra por rango de fechas inclusivo', () => {
        const withDate = ORDERS.map((item, index) => ({
            ...item,
            date: `2026-08-${String(10 + index).padStart(2, '0')}`,
        }))
        const result = applyDashboardFilters(withDate, {
            ...DEFAULT_FILTERS,
            dateRange: { from: '2026-08-12', to: '2026-08-14' },
        })
        expect(result.map((item) => item.id)).toEqual(['NB-00003', 'NB-00004', 'NB-00005'])
    })
})

describe('normalize', () => {
    it('elimina tildes y diéresis', () => {
        expect(normalize('electrónica')).toBe('electronica')
        expect(normalize('Núñez')).toBe('Nunez')
    })
})

describe('filterOrders', () => {
    const empty: OrderQuery = { search: '', status: null }

    it('sin criterios devuelve todos los pedidos', () => {
        expect(filterOrders(ORDERS, empty)).toHaveLength(5)
    })

    it('busca por id, cliente o categoría (case-insensitive)', () => {
        expect(filterOrders(ORDERS, { ...empty, search: 'NB-00003' })).toHaveLength(1)
        expect(filterOrders(ORDERS, { ...empty, search: 'luis' })).toHaveLength(1)
        expect(filterOrders(ORDERS, { ...empty, search: 'ELECTRONICA' })).toHaveLength(2)
    })

    it('la búsqueda ignora tildes en ambos lados', () => {
        expect(filterOrders(ORDERS, { ...empty, search: 'electronica' })).toHaveLength(2)
        expect(filterOrders(ORDERS, { ...empty, search: 'nuñez' })).toHaveLength(1)
    })

    it('filtra por estado', () => {
        const result = filterOrders(ORDERS, { ...empty, status: 'completado' })
        expect(result.map((item) => item.id)).toEqual(['NB-00001', 'NB-00005'])
    })

    it('combina búsqueda y estado', () => {
        const result = filterOrders(ORDERS, { search: 'electronica', status: 'completado' })
        expect(result.map((item) => item.id)).toEqual(['NB-00001', 'NB-00005'])
    })

    it('no matchea si no hay resultados', () => {
        expect(filterOrders(ORDERS, { ...empty, search: 'zzz' })).toHaveLength(0)
    })
})

describe('paginate', () => {
    it('divide en páginas del tamaño configurado', () => {
        expect(paginate(ORDERS, 1, 2)).toHaveLength(2)
        expect(paginate(ORDERS, 2, 2)).toHaveLength(2)
        expect(paginate(ORDERS, 3, 2)).toHaveLength(1)
    })

    it('clampa páginas fuera de rango', () => {
        expect(paginate(ORDERS, 0, 2)).toHaveLength(2)
        expect(paginate(ORDERS, 99, 2)).toHaveLength(1)
    })
})

describe('totalPages', () => {
    it('mínimo una página', () => {
        expect(totalPages(0)).toBe(1)
        expect(totalPages(5)).toBe(1)
    })

    it('redondea hacia arriba', () => {
        expect(totalPages(11, 10)).toBe(2)
        expect(totalPages(21, 10)).toBe(3)
    })
})
