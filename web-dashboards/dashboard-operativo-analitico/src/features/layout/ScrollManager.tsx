import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Al navegar entre páginas vuelve al inicio (scroll a top). Si la URL lleva
 * un ancla (#seccion) del dashboard, desplaza suavemente a esa sección.
 */
export function ScrollManager() {
    const { pathname, hash } = useLocation()

    useEffect(() => {
        if (hash) {
            const element = document.getElementById(hash.slice(1))
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                return
            }
        }
        window.scrollTo(0, 0)
    }, [pathname, hash])

    return null
}
