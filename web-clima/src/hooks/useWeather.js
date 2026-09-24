import { useAsyncResource } from '@/hooks/useAsyncResource'
import { fetchWeather } from '@/services/weatherService'

/**
 * Carga el pronóstico para una ubicación (lat/lon) y expone el estado.
 * `reload` reintenta tras un fallo. Cambiar la ubicación cancela la
 * petición anterior.
 */
export function useWeather(place) {
    return useAsyncResource(fetchWeather, { args: place })
}
