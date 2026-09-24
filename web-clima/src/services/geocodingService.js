import { ENDPOINTS } from '@/services/config'
import { getJson } from '@/services/http'

const DEFAULT_COUNT = 8

/**
 * Busca lugares por nombre usando la API de geocodificación de Open-Meteo.
 * Devuelve la lista ya normalizada o un array vacío si no hay coincidencias.
 */
export async function searchPlaces(name, { count = DEFAULT_COUNT, signal } = {}) {
    const params = new URLSearchParams({
        name,
        count: String(count),
        format: 'json',
        language: 'es',
    })

    const payload = await getJson(`${ENDPOINTS.geocoding}?${params.toString()}`, { signal })
    if (payload === null) return null

    const results = Array.isArray(payload?.results) ? payload.results : []
    return dedupePlaces(results.map(placeFromApi))
}

/**
 * Elimina resultados duplicados de la misma ciudad y país: la API devuelve
 * la ciudad y su región administrativa para búsquedas como "Madrid". Se
 * conserva la entrada con mayor población (en empate, la primera).
 */
function dedupePlaces(places) {
    const seen = new Map()
    for (const place of places) {
        const key = `${place.name.toLowerCase()}|${place.countryCode ?? ''}`
        const current = seen.get(key)
        if (!current || (place.population ?? -1) > (current.population ?? -1)) {
            seen.set(key, place)
        }
    }
    return [...seen.values()]
}

function placeFromApi(raw) {
    return {
        id: raw.id,
        name: raw.name,
        country: raw.country,
        countryCode: raw.country_code,
        admin1: raw.admin1 ?? null,
        latitude: raw.latitude,
        longitude: raw.longitude,
        elevation: raw.elevation ?? null,
        timezone: raw.timezone ?? 'UTC',
        population: raw.population ?? null,
        featureCode: raw.feature_code ?? null,
        label: formatLabel(raw),
    }
}

function formatLabel(raw) {
    const bits = [raw.name]
    if (raw.admin1) bits.push(raw.admin1)
    if (raw.country) bits.push(raw.country)
    return bits.join(', ')
}
