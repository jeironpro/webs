import { describe, expect, it } from 'vitest'

import type { DailySale } from '@/types'
import {
    computeKpis,
    dailySeries,
    deriveKpis,
    relativeDelta,
    sliceWindow,
    sumTotals,
    type KpiTotals,
} from './aggregations'

function record(date: string, overrides: Partial<DailySale> = {}): DailySale {
    return {
        d: date,
        c: 'electronica',
        r: 'centro',
        ch: 'online',
        rev: 100,
        ord: 2,
        uni: 2,
        vis: 50,
        nc: 1,
        rc: 1,
        ref: 0,
        ...overrides,
    }
}

describe('sumTotals y deriveKpis', () => {
    it('suma los totales de un conjunto de registros', () => {
        const totals = sumTotals([
            record('2026-08-01', { rev: 1000, ord: 10, vis: 500 }),
            record('2026-08-02', { rev: 500, ord: 5, vis: 250 }),
        ])

        expect(totals.revenue).toBe(1500)
        expect(totals.orders).toBe(15)
        expect(totals.visitors).toBe(750)
    })

    it('deriva conversión, ticket y retención', () => {
        const kpis = deriveKpis({
            revenue: 2000,
            orders: 100,
            units: 120,
            visitors: 4000,
            newCustomers: 40,
            returningCustomers: 60,
            refunds: 0,
        } as KpiTotals)

        expect(kpis.conversion).toBeCloseTo(0.025)
        expect(kpis.ticket).toBe(20)
        expect(kpis.retention).toBeCloseTo(0.6)
    })

    it('no divide entre cero en conjuntos vacíos', () => {
        const kpis = computeKpis([])
        expect(kpis.conversion).toBe(0)
        expect(kpis.ticket).toBe(0)
        expect(kpis.retention).toBe(0)
    })
})

describe('relativeDelta', () => {
    it('calcula la variación porcentual', () => {
        expect(relativeDelta(120, 100)).toBeCloseTo(20)
        expect(relativeDelta(90, 100)).toBeCloseTo(-10)
    })

    it('devuelve null cuando no hay comparación posible', () => {
        expect(relativeDelta(120, 0)).toBeNull()
    })
})

describe('sliceWindow', () => {
    const records = [
        record('2026-01-01'),
        record('2026-01-02'),
        record('2026-01-03'),
        record('2026-01-04'),
        record('2026-01-05'),
    ]

    it('divide entre ventana actual y anterior de igual longitud', () => {
        const { current, previous } = sliceWindow(records, 2)

        expect(current.map((item) => item.d)).toEqual(['2026-01-04', '2026-01-05'])
        expect(previous.map((item) => item.d)).toEqual(['2026-01-02', '2026-01-03'])
    })

    it('maneja conjuntos vacíos', () => {
        expect(sliceWindow([])).toEqual({ current: [], previous: [] })
    })
})

describe('dailySeries', () => {
    it('agrega por fecha el valor del KPI indicado', () => {
        const series = dailySeries(
            [
                record('2026-08-01', { rev: 300, ord: 3 }),
                record('2026-08-01', { rev: 100, ord: 1 }),
            ],
            'revenue',
        )

        expect(series).toEqual([{ date: '2026-08-01', value: 400 }])
    })
})
