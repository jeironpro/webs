import { useAsyncResource } from '@/hooks/useAsyncResource'
import { fetchAirQuality } from '@/services/airQualityService'

const AIR_QUALITY_TIMEOUT_MS = 10_000

/**
 * Carga la calidad del aire para un lugar (mismo contrato que useWeather).
 */
export function useAirQuality(place) {
    return useAsyncResource(fetchAirQuality, {
        args: place,
        timeoutMs: AIR_QUALITY_TIMEOUT_MS,
    })
}
