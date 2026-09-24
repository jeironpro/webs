import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchAirQuality } from '@/services/airQualityService'

const RAW_AIR = {
    latitude: 40.42,
    longitude: -3.7,
    timezone: 'Europe/Madrid',
    utc_offset_seconds: 7200,
    current: { european_aqi: 23, us_aqi: 40 },
}

describe('fetchAirQuality', () => {
    beforeEach(() => {
        globalThis.fetch = vi.fn().mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => RAW_AIR,
        })
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('solicita el endpoint de calidad del aire con las coordenadas', async () => {
        await fetchAirQuality({ latitude: 40.42, longitude: -3.7 })

        const calledUrl = String(globalThis.fetch.mock.calls[0][0])
        expect(calledUrl).toContain('/v1/air-quality')
        expect(calledUrl).toContain('latitude=40.42')
        expect(calledUrl).toContain('european_aqi')
    })

    it('normaliza los índices europeo y de EE. UU. con su categoría', async () => {
        const air = await fetchAirQuality({ latitude: 40.42, longitude: -3.7 })

        expect(air.meta.timezone).toBe('Europe/Madrid')
        expect(air.index.european).toEqual({ value: 23, key: 'good', label: 'Buena' })
        expect(air.index.us).toEqual({ value: 40, key: 'good', label: 'Buena' })
    })

    it('deja null los campos ausentes', async () => {
        globalThis.fetch = vi.fn().mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => ({ current: {} }),
        })

        const air = await fetchAirQuality({ latitude: 0, longitude: 0 })
        expect(air.index.european).toBeNull()
        expect(air.index.us).toBeNull()
    })
})
