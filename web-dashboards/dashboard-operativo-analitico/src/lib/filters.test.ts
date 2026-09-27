import { describe, expect, it } from 'vitest'

import type { DailySale } from '@/types'
import {
    activeFilterCount,
    computeComparisonWindows,
    DEFAULT_FILTERS,
    filterRecords,
    type DashboardFilters,
} from './filters'

function record(date: string, overrides: Partial<DailySale> = {}): DailySale {
    return {
        d: date,
        c: 'hogar',
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

const RECORDS = [
    record('2026-07-10', { c: 'hogar', r: 'centro', ch: 'online' }),
    record('2026-07-15', { c: 'moda', r: 'norte', ch: 'online' }),
    record('2026-07-20', { c: 'moda', r: 'norte', ch: 'tienda' }),
    record('2026-07-25', { c: 'hogar', r: 'sur', ch: 'marketplace' }),
]

describe('filterRecords', () => {
    it('sin filtros devuelve todos los registros', () => {
        expect(filterRecords(RECORDS, DEFAULT_FILTERS)).toHaveLength(4)
    })

    it('filtra por categoría', () => {
        const result = filterRecords(RECORDS, { ...DEFAULT_FILTERS, category: 'moda' })
        expect(result.map((item) => item.d)).toEqual(['2026-07-15', '2026-07-20'])
    })

    it('filtra por región y canal combinados', () => {
        const result = filterRecords(RECORDS, {
            ...DEFAULT_FILTERS,
            region: 'norte',
            channel: 'online',
        })
        expect(result.map((item) => item.d)).toEqual(['2026-07-15'])
    })

    it('el rango de fechas es inclusivo', () => {
        const result = filterRecords(RECORDS, {
            ...DEFAULT_FILTERS,
            dateRange: { from: '2026-07-15', to: '2026-07-20' },
        })
        expect(result).toHaveLength(2)
    })

    it('no matchea si no hay resultados', () => {
        const result = filterRecords(RECORDS, { ...DEFAULT_FILTERS, category: 'juguetes' })
        expect(result).toHaveLength(0)
    })
})

describe('activeFilterCount', () => {
    it('cuenta los filtros activos', () => {
        expect(activeFilterCount(DEFAULT_FILTERS)).toBe(0)
        expect(activeFilterCount({ ...DEFAULT_FILTERS, category: 'moda' })).toBe(1)
        expect(
            activeFilterCount({
                ...DEFAULT_FILTERS,
                category: 'moda',
                dateRange: { from: '2026-07-01', to: '2026-07-31' },
            }),
        ).toBe(2)
    })
})

describe('computeComparisonWindows', () => {
    it('sin rango de fechas usa la ventana de 30 días sobre los registros filtrados', () => {
        const { current, previous } = computeComparisonWindows(RECORDS, DEFAULT_FILTERS)
        // solo 4 registros: los últimos 30 días incluyen todos, el anterior ninguno
        expect(current).toHaveLength(4)
        expect(previous).toHaveLength(0)
    })

    it('con rango de fechas compara contra la misma longitud anterior', () => {
        const filters: DashboardFilters = {
            ...DEFAULT_FILTERS,
            dateRange: { from: '2026-07-15', to: '2026-07-20' },
        }
        const { current, previous } = computeComparisonWindows(RECORDS, filters)

        expect(current).toHaveLength(2)
        // ventana anterior: 6 días antes (9–14 jul) con los mismos filtros
        expect(previous.map((item) => item.d)).toEqual(['2026-07-10'])
    })
})
