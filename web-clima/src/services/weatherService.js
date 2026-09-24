import { ENDPOINTS } from '@/services/config'
import { getJson } from '@/services/http'

const CURRENT_FIELDS = [
    'temperature_2m',
    'apparent_temperature',
    'relative_humidity_2m',
    'precipitation',
    'weather_code',
    'wind_speed_10m',
    'wind_direction_10m',
    'is_day',
    'surface_pressure',
    'uv_index',
    'visibility',
].join(',')

const HOURLY_FIELDS = [
    'temperature_2m',
    'apparent_temperature',
    'precipitation_probability',
    'weather_code',
    'wind_speed_10m',
].join(',')

const DAILY_FIELDS = [
    'weather_code',
    'temperature_2m_max',
    'temperature_2m_min',
    'sunrise',
    'sunset',
    'precipitation_sum',
    'precipitation_probability_max',
    'wind_speed_10m_max',
    'uv_index_max',
].join(',')

/**
 * Consulta el pronóstico de Open-Meteo para unas coordenadas.
 * Devuelve el objeto normalizado { meta, current, hourly, daily } o null si la
 * petición se canceló.
 */
export async function fetchWeather(params, { signal } = {}) {
    const { latitude, longitude } = params

    const search = new URLSearchParams({
        latitude: String(latitude),
        longitude: String(longitude),
        current: CURRENT_FIELDS,
        hourly: HOURLY_FIELDS,
        daily: DAILY_FIELDS,
        timezone: 'auto',
        forecast_days: '7',
        temperature_unit: 'celsius',
        wind_speed_unit: 'kmh',
        precipitation_unit: 'mm',
    })

    const payload = await getJson(`${ENDPOINTS.forecast}?${search.toString()}`, { signal })
    if (payload === null) return null

    return weatherFromApi(payload)
}

function weatherFromApi(raw) {
    const current = raw.current ?? {}
    const hourly = raw.hourly ?? {}
    const daily = raw.daily ?? {}

    return {
        meta: {
            latitude: raw.latitude,
            longitude: raw.longitude,
            timezone: raw.timezone ?? 'UTC',
            utcOffsetSeconds: raw.utc_offset_seconds ?? 0,
            units: {
                temperature: raw.current_units?.temperature_2m ?? '°C',
                wind: raw.current_units?.wind_speed_10m ?? 'km/h',
                pressure: raw.current_units?.surface_pressure ?? 'hPa',
            },
            elevation: raw.elevation ?? null,
        },
        current: {
            time: current.time ?? null,
            temperature: current.temperature_2m ?? null,
            apparentTemperature: current.apparent_temperature ?? null,
            humidity: current.relative_humidity_2m ?? null,
            precipitation: current.precipitation ?? null,
            weatherCode: current.weather_code ?? null,
            windSpeed: current.wind_speed_10m ?? null,
            windDirection: current.wind_direction_10m ?? null,
            isDay: current.is_day ?? 1,
            pressure: current.surface_pressure ?? null,
            uvIndex: current.uv_index ?? null,
            visibility: current.visibility ?? null,
        },
        hourly: {
            time: hourly.time ?? [],
            temperature: hourly.temperature_2m ?? [],
            apparentTemperature: hourly.apparent_temperature ?? [],
            precipitationProbability: hourly.precipitation_probability ?? [],
            weatherCode: hourly.weather_code ?? [],
            windSpeed: hourly.wind_speed_10m ?? [],
        },
        daily: {
            time: daily.time ?? [],
            weatherCode: daily.weather_code ?? [],
            temperatureMax: daily.temperature_2m_max ?? [],
            temperatureMin: daily.temperature_2m_min ?? [],
            sunrise: daily.sunrise ?? [],
            sunset: daily.sunset ?? [],
            precipitationSum: daily.precipitation_sum ?? [],
            precipitationProbabilityMax: daily.precipitation_probability_max ?? [],
            windSpeedMax: daily.wind_speed_10m_max ?? [],
            uvIndexMax: daily.uv_index_max ?? [],
        },
    }
}
