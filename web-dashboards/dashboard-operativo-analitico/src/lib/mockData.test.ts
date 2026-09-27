import { describe, expect, it } from 'vitest'

/**
 * Tests de coherencia de los datos mock: los JSONs de src/data deben
 * cargarse y sus agregaciones deben ser consistentes entre series.
 */
describe('datos mock', () => {
    it('carga las dimensiones del negocio', async () => {
        const categories = await import('@/data/categories.json')
        const regions = await import('@/data/regions.json')
        const channels = await import('@/data/channels.json')

        expect(categories.default).toHaveLength(6)
        expect(regions.default).toHaveLength(5)
        expect(channels.default).toHaveLength(4)
        expect(categories.default[0]).toHaveProperty('id')
        expect(categories.default[0]).toHaveProperty('name')
    })

    it('la serie diaria cubre el año 2026 con registros válidos', async () => {
        const daily = (await import('@/data/daily-sales.json')).default as Array<{
            d: string
            rev: number
            ord: number
            vis: number
        }>

        expect(daily.length).toBeGreaterThan(10000)
        expect(daily[0].d).toBe('2026-01-01')
        expect(daily[daily.length - 1].d).toBe('2026-08-18')
        // Sin ingresos ni pedidos negativos
        for (const record of daily) {
            expect(record.rev).toBeGreaterThanOrEqual(0)
            expect(record.ord).toBeGreaterThanOrEqual(0)
            expect(record.vis).toBeGreaterThanOrEqual(0)
        }
    })

    it('el total mensual 2026 coincide con la suma de la serie diaria', async () => {
        const daily = (await import('@/data/daily-sales.json')).default as Array<{
            d: string
            rev: number
        }>
        const monthly = (await import('@/data/monthly.json')).default as Array<{
            month: string
            revenue: number
        }>

        const byMonth = new Map<string, number>()
        for (const record of daily) {
            const key = record.d.slice(0, 7)
            byMonth.set(key, (byMonth.get(key) ?? 0) + record.rev)
        }

        for (const entry of monthly.filter((item) => item.month.startsWith('2026'))) {
            expect(Math.round(byMonth.get(entry.month) ?? 0)).toBe(Math.round(entry.revenue))
        }
    })

    it('la tasa de conversión global es realista (1–8 %)', async () => {
        const daily = (await import('@/data/daily-sales.json')).default as Array<{
            ord: number
            vis: number
        }>

        let orders = 0
        let visitors = 0
        for (const record of daily) {
            orders += record.ord
            visitors += record.vis
        }
        const conversion = orders / visitors
        expect(conversion).toBeGreaterThan(0.01)
        expect(conversion).toBeLessThan(0.08)
    })

    it('la serie semanal tiene 12 semanas consecutivas', async () => {
        const weekly = (await import('@/data/weekly.json')).default as Array<{ week: string }>
        expect(weekly).toHaveLength(12)

        for (let i = 1; i < weekly.length; i++) {
            const prev = new Date(`${weekly[i - 1].week}T00:00:00Z`)
            const curr = new Date(`${weekly[i].week}T00:00:00Z`)
            const diffDays = (curr.getTime() - prev.getTime()) / 86400000
            expect(diffDays).toBe(7)
        }
    })
})
