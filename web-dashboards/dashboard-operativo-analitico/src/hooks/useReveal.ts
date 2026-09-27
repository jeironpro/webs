import { useEffect } from 'react'

/**
 * Revela los elementos con clase `.reveal` al entrar en viewport (una sola vez).
 * Con `prefers-reduced-motion: reduce` los muestra de inmediato.
 */
export function useReveal(dependencies: readonly unknown[] = []): void {
    useEffect(() => {
        const elements = Array.from(document.querySelectorAll<HTMLElement>('.reveal'))
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        if (reduced) {
            elements.forEach((element) => element.classList.add('is-visible'))
            return
        }

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible')
                        observer.unobserve(entry.target)
                    }
                }
            },
            { threshold: 0.12 },
        )

        elements.forEach((element) => observer.observe(element))
        return () => observer.disconnect()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependencies)
}
