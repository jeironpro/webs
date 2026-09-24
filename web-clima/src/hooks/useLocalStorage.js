import { useCallback, useState } from 'react'

/**
 * Estado sincronizado con localStorage. Devuelve [value, setValue];
 * setValue acepta un valor o una función para actualizar.
 */
export function useLocalStorage(key, initialValue = null) {
    const [value, setValue] = useState(() => {
        try {
            const stored = window.localStorage.getItem(key)
            return stored === null ? initialValue : JSON.parse(stored)
        } catch {
            return initialValue
        }
    })

    const update = useCallback(
        (next) => {
            setValue((current) => {
                const resolved = typeof next === 'function' ? next(current) : next
                try {
                    if (resolved === null || resolved === undefined) {
                        window.localStorage.removeItem(key)
                    } else {
                        window.localStorage.setItem(key, JSON.stringify(resolved))
                    }
                } catch {
                    // localStorage no disponible (modo privado/SSR): se ignora.
                }
                return resolved
            })
        },
        [key]
    )

    return [value, update]
}
