import { describe, expect, it } from 'vitest'

import type { DailySale } from '@/types'
import { buildTrendData, TREND_DAYS, TREND_MONTHS } from './trendData'

function record(
    date: string,
    category = 'hogar',
    region = 'centro',
    channel = 'online',
    revenue = 100,
) {
    return {
        d: date,
        c: category,
        r: region,
        ch: channel,
        rev: revenue,
        ord: 2,
        uni: 2,
        vis: 50,
        nc: 1,
        rc: 1,
        ref: 0,
    } satisfies DailySale
}

const CATALOG = [
    { id: 'hogar', name: 'Hogar' },
    { id: 'moda', name: 'Moda' },
]
const REGIONS = [{ id: 'centro', name: 'Centro' }]
const CHANNELS = [{ id: 'online', name: 'Online' }]

function buildRecords(): DailySale[] {
    const records: DailySale[] = []
    // 45 días válidos: 1–31 jul + 1–14 ago
    for (let day = 1; day <= 45; day++) {
        const date =
            day <= 31
                ? `2026-07-${String(day).padStart(2, '0')}`
                : `2026-08-${String(day - 31).padStart(2, '0')}`
        records.push(record(date, 'hogar', 'centro', 'online', 100))
    }
    records.push(record('2026-07-01', 'moda', 'centro', 'online', 250))
    return records
}

describe('buildTrendData', () => {
    it('en diario toma los últimos 30 días y agrupa por fecha', () => {
        const trend = buildTrendData(buildRecords(), 'diario', CATALOG, REGIONS, CHANNELS)

        expect(trend.period).toBe('diario')
        expect(trend.trend).toHaveLength(TREND_DAYS)
        expect(trend.trend[0].revenue).toBeGreaterThan(0)
        // el total suma las ventas de los 30 días
        expect(trend.totalRevenue).toBe(30 * 100)
    })

    it('en semanal agrupa por semanas (45 días = 7 semanas)', () => {
        const trend = buildTrendData(buildRecords(), 'semanal', CATALOG, REGIONS, CHANNELS)
        expect(trend.trend).toHaveLength(7)
        // la primera semana empieza en lunes
        expect(trend.trend[0].date).toBe('2026-06-29')
    })

    it('en mensual agrupa por mes (últimos 8 meses)', () => {
        const trend = buildTrendData(buildRecords(), 'mensual', CATALOG, REGIONS, CHANNELS)
        expect(trend.trend.length).toBeLessThanOrEqual(TREND_MONTHS)
    })

    it('el desglose por categoría ordena de mayor a menor venta', () => {
        const trend = buildTrendData(buildRecords(), 'diario', CATALOG, REGIONS, CHANNELS)

        expect(trend.byCategory.map((item) => item.id)).toEqual(['hogar', 'moda'])
        const total = trend.byCategory.reduce((sum, item) => sum + item.revenue, 0)
        expect(total).toBe(trend.totalRevenue)
    })

    it('incluye categorías sin ventas en el periodo con valor 0', () => {
        const records = [record('2026-07-01')]
        const trend = buildTrendData(records, 'diario', CATALOG, REGIONS, CHANNELS)

        const fashion = trend.byCategory.find((item) => item.id === 'moda')
        expect(fashion?.revenue).toBe(0)
    })
})
