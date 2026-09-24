const REQUEST_TIMEOUT_MS = 12000

/**
 * Tipo de error de red normalizado.
 * kind: 'http' | 'network' | 'timeout' | 'parse'
 */
export class FetchError extends Error {
    constructor(message, kind = 'network', status = null) {
        super(message)
        this.name = 'FetchError'
        this.kind = kind
        this.status = status
    }
}

function isAbortError(error) {
    return error instanceof DOMException && error.name === 'AbortError'
}

/**
 * Realiza una petición GET y devuelve el cuerpo parseado como JSON.
 * - Respeta una señal externa (cancelación de hooks).
 * - Cancela con { kind: 'network' } si el servidor no responde.
 * - Devuelve null si la petición fue abortada por la señal externa.
 */
export async function getJson(url, { signal } = {}) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

    let abortedByCaller = false
    const onExternalAbort = () => {
        abortedByCaller = true
        controller.abort()
    }
    signal?.addEventListener('abort', onExternalAbort)

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { Accept: 'application/json' },
            signal: controller.signal,
        })

        if (!response.ok) {
            throw new FetchError(
                `HTTP ${response.status} consultando ${url}`,
                'http',
                response.status
            )
        }

        try {
            return await response.json()
        } catch {
            throw new FetchError('La respuesta no es JSON válido', 'parse')
        }
    } catch (error) {
        if (isAbortError(error) && abortedByCaller) return null
        if (isAbortError(error))
            throw new FetchError('La petición superó el tiempo límite', 'timeout')
        if (error instanceof FetchError) throw error
        throw new FetchError('No se pudo contactar con el servidor', 'network')
    } finally {
        clearTimeout(timer)
        signal?.removeEventListener('abort', onExternalAbort)
    }
}
