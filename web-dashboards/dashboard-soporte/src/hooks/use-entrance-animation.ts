/**
 * Hook personalizado para animaciones de entrada.
 * Reutiliza el boilerplate de createScope + animate de animejs.
 *
 * @param selector - Selector CSS de los elementos a animar
 * @param configuracion - Configuración de la animación
 */
import { useEffect, useRef } from 'react'
import { animate, createScope, stagger, type AnimationParams } from 'animejs'

type ConfiguracionAnimacion = Omit<AnimationParams, 'targets'>

export function useEntranceAnimation(selector: string, configuracion: ConfiguracionAnimacion = {}) {
    const rootRef = useRef<HTMLElement>(null)
    const scopeRef = useRef<ReturnType<typeof createScope> | null>(null)

    useEffect(() => {
        if (!rootRef.current) return

        scopeRef.current = createScope({ root: rootRef }).add(() => {
            animate(selector, {
                opacity: [0, 1],
                duration: 400,
                delay: stagger(80, { start: 100 }),
                ease: 'out(3)',
                ...configuracion,
            })
        })

        return () => scopeRef.current?.revert()
    }, [])

    return rootRef
}
