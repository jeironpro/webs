const OPEN_METEO_BASE = import.meta.env.VITE_OPEN_METEO_BASE ?? 'https://api.open-meteo.com'
const GEOCODING_BASE = import.meta.env.VITE_GEOCODING_BASE ?? 'https://geocoding-api.open-meteo.com'

export const ENDPOINTS = {
    forecast: `${OPEN_METEO_BASE}/v1/forecast`,
    geocoding: `${GEOCODING_BASE}/v1/search`,
    airQuality: 'https://air-quality-api.open-meteo.com/v1/air-quality',
}
