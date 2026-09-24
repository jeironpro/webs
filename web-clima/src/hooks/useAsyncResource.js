import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Carga de un recurso remoto bajo demanda con cancelación de vuelos
 * obsoletos. Unifica el patrón de petición de los hooks de datos:
 *
 * - `args === null` resetea el estado sin disparar ninguna petición.
 * - Cambiar el valor de `args` (lat/lon) cancela (ignora) la petición en curso.
 * - `timeoutMs > 0` aborta la petición si el servidor no responde.
 * - `reload` reintenta con los argumentos actuales.
 */
export function useAsyncResource(fetcher, { args, timeoutMs = 0 } = {}) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const attemptRef = useRef(0)
    const argsRef = useRef(args)
    argsRef.current = args

    const load = useCallback(
        async (nextArgs) => {
            const attempt = ++attemptRef.current
            setLoading(true)
            setError(null)

            if (nextArgs == null) {
                setData(null)
                setLoading(false)
                return
            }

            const controller = new AbortController()
            let timeoutId
            if (timeoutMs > 0) {
                timeoutId = setTimeout(() => controller.abort(), timeoutMs)
            }

            try {
                const result = await fetcher(nextArgs, { signal: controller.signal })
                if (attemptRef.current !== attempt) return
                setData(result)
            } catch (cause) {
                if (cause?.name === 'AbortError') return
                if (attemptRef.current !== attempt) return
                setError(cause)
            } finally {
                clearTimeout(timeoutId)
                if (attemptRef.current === attempt) setLoading(false)
            }
        },
        [fetcher, timeoutMs]
    )

    const argsKey = args ? `${args.latitude},${args.longitude}` : null

    useEffect(() => {
        load(argsRef.current)
        return () => {
            attemptRef.current += 1
        }
    }, [argsKey, load])

    const reload = useCallback(() => load(argsRef.current), [load])

    return { data, loading, error, reload }
}
