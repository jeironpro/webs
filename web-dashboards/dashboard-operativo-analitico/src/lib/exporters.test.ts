import { describe, expect, it } from 'vitest'

import type { DailySale } from '@/types'
import { buildCategoryReport, csvEscape, toCsv } from './exporters'

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

const CATEGORIES = [
    { id: 'hogar', name: 'Hogar' },
    { id: 'moda', name: 'Moda' },
    { id: 'electronica', name: 'Electrónica' },
]

describe('buildCategoryReport', () => {
    it('agrega ingresos, pedidos y unidades por categoría', () => {
        const report = buildCategoryReport(
            [
                record('2026-07-01', { c: 'hogar', rev: 100, ord: 2, uni: 3 }),
                record('2026-07-02', { c: 'hogar', rev: 50, ord: 1, uni: 1 }),
                record('2026-07-03', { c: 'moda', rev: 200, ord: 4, uni: 4 }),
            ],
            CATEGORIES,
        )

        const home = report.rows.find((row) => row.categoryId === 'hogar')
        const fashion = report.rows.find((row) => row.categoryId === 'moda')

        expect(home).toMatchObject({ revenue: 150, orders: 3, units: 4 })
        expect(fashion).toMatchObject({ revenue: 200, orders: 4, units: 4 })
        expect(report.totals).toEqual({ revenue: 350, orders: 7, units: 8 })
    })

    it('calcula la participación sobre el total y ordena por ingresos', () => {
        const report = buildCategoryReport(
            [
                record('2026-07-01', { c: 'hogar', rev: 100 }),
                record('2026-07-02', { c: 'moda', rev: 300 }),
                record('2026-07-03', { c: 'electronica', rev: 600 }),
            ],
            CATEGORIES,
        )

        expect(report.rows.map((row) => row.categoryId)).toEqual(['electronica', 'moda', 'hogar'])
        expect(report.rows[0].share).toBeCloseTo(60, 5)
        expect(report.rows[1].share).toBeCloseTo(30, 5)
    })

    it('resuelve el nombre del catálogo y usa el id como fallback', () => {
        const report = buildCategoryReport(
            [record('2026-07-01', { c: 'hogar' }), record('2026-07-02', { c: 'desconocida' })],
            CATEGORIES,
        )

        const names = report.rows.map((row) => row.category)
        expect(names).toContain('Hogar')
        expect(names).toContain('desconocida')
    })

    it('devuelve reporte vacío sin registros', () => {
        const report = buildCategoryReport([], CATEGORIES)
        expect(report.rows).toHaveLength(0)
        expect(report.totals).toEqual({ revenue: 0, orders: 0, units: 0 })
    })

    it('estima el margen bruto según la tasa de la categoría', () => {
        const report = buildCategoryReport([record('2026-07-01', { c: 'electronica' })], CATEGORIES)
        expect(report.rows[0].margin).toBeCloseTo(28, 5)
    })
})

describe('csvEscape', () => {
    it('no escapa valores simples', () => {
        expect(csvEscape('Hogar')).toBe('Hogar')
        expect(csvEscape(1234)).toBe('1234')
    })

    it('envuelve entre comillas los valores con comas, comillas o saltos', () => {
        expect(csvEscape('a,b')).toBe('"a,b"')
        expect(csvEscape('a"b')).toBe('"a""b"')
        expect(csvEscape('a\nb')).toBe('"a\nb"')
    })
})

describe('toCsv', () => {
    it('serializa cabeceras y filas con CRLF y BOM UTF-8', () => {
        const csv = toCsv(
            ['Categoría', 'Ingresos'],
            [
                ['Hogar', 150],
                ['Moda, Premium', 200],
            ],
        )

        expect(csv.startsWith('\uFEFF')).toBe(true)
        expect(csv).toContain('Categoría,Ingresos\r\n')
        expect(csv).toContain('Hogar,150\r\n')
        expect(csv).toContain('"Moda, Premium",200\r\n')
        expect(csv.endsWith('\r\n')).toBe(true)
    })
})
