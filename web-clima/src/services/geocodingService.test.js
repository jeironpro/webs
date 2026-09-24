import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { searchPlaces } from '@/services/geocodingService'

const RAW_RESULTS = {
    results: [
        {
            id: 3117735,
            name: 'Madrid',
            latitude: 40.41678,
            longitude: -3.70379,
            elevation: 672,
            feature_code: 'PPLC',
            country_code: 'ES',
            admin1: 'Madrid',
            timezone: 'Europe/Madrid',
            population: 3255944,
            country: 'España',
        },
    ],
}

const RAW_DUPLICATES = {
    results: [
        ...RAW_RESULTS.results,
        {
            id: 2511171,
            name: 'Madrid',
            latitude: 40.4165,
            longitude: -3.70256,
            feature_code: 'ADM2',
            country_code: 'ES',
            admin1: 'Madrid',
            timezone: 'Europe/Madrid',
            population: 5407,
            country: 'España',
        },
    ],
}

describe('searchPlaces', () => {
    beforeEach(() => {
        globalThis.fetch = vi.fn().mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => RAW_RESULTS,
        })
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('consulta la API de geocodificación con la consulta y el idioma', async () => {
        await searchPlaces('Madrid')

        const calledUrl = String(globalThis.fetch.mock.calls[0][0])
        expect(calledUrl).toContain('/v1/search')
        expect(calledUrl).toContain('name=Madrid')
        expect(calledUrl).toContain('language=es')
    })

    it('normaliza un resultado de geocodificación', async () => {
        const places = await searchPlaces('Madrid')

        expect(places).toHaveLength(1)
        expect(places[0]).toMatchObject({
            id: 3117735,
            name: 'Madrid',
            country: 'España',
            admin1: 'Madrid',
            latitude: 40.41678,
            timezone: 'Europe/Madrid',
        })
        expect(places[0].label).toBe('Madrid, Madrid, España')
    })

    it('devuelve una lista vacía cuando no hay resultados', async () => {
        globalThis.fetch = vi.fn().mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => ({}),
        })

        const places = await searchPlaces('CiudadInventadaXyz')
        expect(places).toEqual([])
    })

    it('deduplica resultados de la misma ciudad y país conservando el de mayor población', async () => {
        globalThis.fetch = vi.fn().mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => RAW_DUPLICATES,
        })

        const places = await searchPlaces('Madrid')
        expect(places).toHaveLength(1)
        expect(places[0]).toMatchObject({ id: 3117735, population: 3255944 })
    })
})
