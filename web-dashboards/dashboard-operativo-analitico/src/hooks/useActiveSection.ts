import { useEffect, useState } from 'react'

/** Altura efectiva del sticky header + margen de anclaje (scroll-mt). */
const HEADER_OFFSET = 104

/**
 * Devuelve el id de la sección actualmente visible (scroll-spy).
 *
 * Implementación basada en scroll (rAF + resize + ResizeObserver), por lo
 * que es determinista en ambas direcciones, a diferencia del enfoque con
 * IntersectionObserver que desincronizaba el panel lateral.
 *
 * Regla: la sección activa es la última cuyo borde superior ya cruzó la
 * línea del sticky header. Al llegar al fondo del documento, si una sección
 * corta del final no alcanza a cruzar la línea (no hay scroll suficiente),
 * se resalta la primera que sigue visible debajo de la línea — la que queda
 * "anclada" arriba — en lugar de forzar siempre la última.
 */
export function useActiveSection(sectionIds: readonly string[]): string {
    const [active, setActive] = useState(sectionIds[0] ?? '')

    useEffect(() => {
        let rafId = 0

        const update = () => {
            let current = sectionIds[0] ?? ''

            // Sección activa = la última cuyo borde superior ya cruzó la línea
            // del sticky header.
            for (const id of sectionIds) {
                const element = document.getElementById(id)
                if (element && element.getBoundingClientRect().top <= HEADER_OFFSET) {
                    current = id
                }
            }

            // Al llegar al fondo, las secciones cortas del final nunca llegan a
            // cruzar la línea (no hay scroll suficiente). En ese caso la activa es
            // la primera sección que sigue visible por debajo de la línea (la que
            // queda "anclada" arriba), en lugar de forzar siempre la última, que
            // desincronizaba el panel lateral al hacer clic en la penúltima.
            const scrolledToBottom =
                window.innerHeight + Math.ceil(window.scrollY) >=
                document.documentElement.scrollHeight - 2
            if (scrolledToBottom) {
                for (const id of sectionIds) {
                    const element = document.getElementById(id)
                    if (element && element.getBoundingClientRect().top > HEADER_OFFSET) {
                        current = id
                        break
                    }
                }
            }

            setActive((previous) => (previous === current ? previous : current))
        }

        const scheduleUpdate = () => {
            cancelAnimationFrame(rafId)
            rafId = requestAnimationFrame(update)
        }

        update()
        window.addEventListener('scroll', scheduleUpdate, { passive: true })
        window.addEventListener('resize', scheduleUpdate, { passive: true })

        // Recalcula cuando el contenido cambia de tamaño (carga de KPIs/gráficos).
        const resizeObserver = new ResizeObserver(scheduleUpdate)
        resizeObserver.observe(document.body)

        return () => {
            cancelAnimationFrame(rafId)
            window.removeEventListener('scroll', scheduleUpdate)
            window.removeEventListener('resize', scheduleUpdate)
            resizeObserver.disconnect()
        }
    }, [sectionIds])

    return active
}
