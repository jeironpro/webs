import { useEffect, useRef, useState } from 'react'
import { animate } from 'animejs'

/**
 * Devuelve un valor que anima desde el último mostrado hasta `target`
 * con animejs (ease outExpo, el tick-up del tema Hum).
 * Con `prefers-reduced-motion: reduce` muestra el valor final de inmediato.
 */
export function useAnimatedNumber(target: number, duration = 1200): number {
    const [display, setDisplay] = useState(target)
    const displayRef = useRef(target)

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            displayRef.current = target
            // Aplazado (rAF) para no llamar setState sincrónicamente dentro del efecto.
            const frame = requestAnimationFrame(() => setDisplay(target))
            return () => cancelAnimationFrame(frame)
        }

        const proxy = { value: displayRef.current }
        if (proxy.value === target) return

        const animation = animate(proxy, {
            value: target,
            duration,
            ease: 'outExpo',
            onUpdate: () => {
                displayRef.current = proxy.value
                setDisplay(proxy.value)
            },
            onComplete: () => {
                displayRef.current = target
                setDisplay(target)
            },
        })

        return () => {
            animation.cancel()
        }
    }, [target, duration])

    return display
}
