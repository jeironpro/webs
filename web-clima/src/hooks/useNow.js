import { useEffect, useState } from 'react'

/**
 * Date actualizada cada `intervalMs` milisegundos. Permite relojes locales
 * en vivo sin re-render continuo.
 */
export function useNow(intervalMs = 60_000) {
    const [now, setNow] = useState(() => new Date())

    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), intervalMs)
        return () => clearInterval(id)
    }, [intervalMs])

    return now
}
