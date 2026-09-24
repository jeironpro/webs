import { useEffect, useState } from 'react'
import { searchPlaces } from '@/services/geocodingService'
import { useDebounce } from '@/hooks/useDebounce'

const MIN_QUERY_LENGTH = 2
const DEFAULT_DEBOUNCE_MS = 350

/**
 * Busca lugares mientras se escribe una consulta (con debounce).
 * Devuelve el estado de la búsqueda: lugares, cargando y error.
 */
export function useGeocoding(query, { debounceMs = DEFAULT_DEBOUNCE_MS } = {}) {
    const debouncedQuery = useDebounce(query, debounceMs)
    const [places, setPlaces] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const effectiveQuery = debouncedQuery.trim()
    const enabled = effectiveQuery.length >= MIN_QUERY_LENGTH

    useEffect(() => {
        if (!enabled) {
            setPlaces([])
            setLoading(false)
            setError(null)
            return
        }

        const controller = new AbortController()
        let active = true
        setLoading(true)
        setError(null)

        searchPlaces(effectiveQuery, { signal: controller.signal })
            .then((result) => {
                if (!active) return
                setPlaces(result ?? [])
            })
            .catch((requestError) => {
                if (!active) return
                setPlaces([])
                setError(requestError)
            })
            .finally(() => {
                if (active) setLoading(false)
            })

        return () => {
            active = false
            controller.abort()
        }
    }, [enabled, effectiveQuery])

    return { places, loading, error }
}
