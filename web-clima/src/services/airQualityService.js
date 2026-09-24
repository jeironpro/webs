import { ENDPOINTS } from '@/services/config'
import { getJson } from '@/services/http'
import { aqiCategoryEU, aqiCategoryUS } from '@/utils/aqi'

/**
 * Consulta la calidad del aire actual en Open-Meteo.
 * Devuelve { index: { european, us } } normalizado o null si se canceló.
 */
export async function fetchAirQuality(params, { signal } = {}) {
    const { latitude, longitude } = params

    const search = new URLSearchParams({
        latitude: String(latitude),
        longitude: String(longitude),
        current: 'european_aqi,us_aqi',
        timezone: 'auto',
    })

    const payload = await getJson(`${ENDPOINTS.airQuality}?${search.toString()}`, { signal })
    if (payload === null) return null

    return airQualityFromApi(payload)
}

function airQualityFromApi(raw) {
    const current = raw.current ?? {}

    const european = current.european_aqi ?? null
    const us = current.us_aqi ?? null

    return {
        meta: {
            timezone: raw.timezone ?? 'UTC',
            utcOffsetSeconds: raw.utc_offset_seconds ?? 0,
        },
        index: {
            european: european === null ? null : { value: european, ...aqiCategoryEU(european) },
            us: us === null ? null : { value: us, ...aqiCategoryUS(us) },
        },
    }
}
