import { useEffect, useState } from 'react'

/**
 * Devuelve el valor pasado atrás `delay` ms desde el último cambio.
 * Típicamente para retrasar búsquedas mientras el usuario escribe.
 */
export function useDebounce(value, delay = 300) {
    const [debounced, setDebounced] = useState(value)

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay)
        return () => clearTimeout(timer)
    }, [value, delay])

    return debounced
}
