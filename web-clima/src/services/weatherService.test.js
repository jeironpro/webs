import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchWeather } from '@/services/weatherService'

const RAW_FORECAST = {
    latitude: 40.42,
    longitude: -3.7,
    utc_offset_seconds: 7200,
    timezone: 'Europe/Madrid',
    current_units: {
        temperature_2m: '°C',
        wind_speed_10m: 'km/h',
        surface_pressure: 'hPa',
    },
    current: {
        time: '2026-08-09T18:00',
        temperature_2m: 28.4,
        apparent_temperature: 30.1,
        relative_humidity_2m: 38,
        precipitation: 0,
        weather_code: 2,
        wind_speed_10m: 12.5,
        wind_direction_10m: 240,
        is_day: 1,
        surface_pressure: 1018.3,
        uv_index: 3.2,
        visibility: 10000,
    },
    hourly: {
        time: ['2026-08-09T18:00', '2026-08-09T19:00'],
        temperature_2m: [28.4, 27.9],
        precipitation_probability: [2, 5],
        weather_code: [2, 2],
        wind_speed_10m: [12.5, 11.8],
    },
    daily: {
        time: ['2026-08-09'],
        weather_code: [2],
        temperature_2m_max: [34.2],
        temperature_2m_min: [21.5],
        sunrise: ['2026-08-09T07:01'],
        sunset: ['2026-08-09T21:20'],
        precipitation_sum: [0],
        precipitation_probability_max: [5],
        wind_speed_10m_max: [21],
        uv_index_max: [8],
    },
}

describe('fetchWeather', () => {
    beforeEach(() => {
        globalThis.fetch = vi.fn().mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => RAW_FORECAST,
        })
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('solicita el endpoint con las coordenadas y unidades métricas', async () => {
        await fetchWeather({ latitude: 40.41678, longitude: -3.70379 })

        const calledUrl = String(globalThis.fetch.mock.calls[0][0])
        expect(calledUrl).toContain('/v1/forecast')
        expect(calledUrl).toContain('latitude=40.41678')
        expect(calledUrl).toContain('temperature_unit=celsius')
        expect(calledUrl).toContain('temperature_2m')
    })

    it('normaliza el pronóstico a un objeto plano', async () => {
        const weather = await fetchWeather({ latitude: 40.41678, longitude: -3.70379 })

        expect(weather.meta.timezone).toBe('Europe/Madrid')
        expect(weather.meta.utcOffsetSeconds).toBe(7200)
        expect(weather.current.temperature).toBe(28.4)
        expect(weather.current.apparentTemperature).toBe(30.1)
        expect(weather.hourly.temperature).toHaveLength(2)
        expect(weather.daily.temperatureMax[0]).toBe(34.2)
    })

    it('lanza un error normalizado cuando la API responde mal', async () => {
        globalThis.fetch = vi.fn().mockResolvedValue({
            ok: false,
            status: 503,
            json: async () => ({}),
        })

        await expect(fetchWeather({ latitude: 0, longitude: 0 })).rejects.toMatchObject({
            kind: 'http',
            status: 503,
        })
    })
})
