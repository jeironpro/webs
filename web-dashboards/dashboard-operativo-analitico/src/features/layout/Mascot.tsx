import { useCallback, useRef } from 'react'

import { cn } from '@/lib/utils'

interface MascotProps {
    className?: string
}

/**
 * Momento de personaje del tema Hum: una bolita pera que pulsa en reposo
 * y celebra con un star-burst coral al interactuar con ella.
 */
export function Mascot({ className }: MascotProps) {
    const markRef = useRef<HTMLSpanElement>(null)

    const fireStarBurst = useCallback(() => {
        const element = markRef.current
        if (!element) return
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

        const burst = document.createElement('span')
        burst.className = 'star-burst'
        element.appendChild(burst)
        window.setTimeout(() => burst.remove(), 450)
    }, [])

    return (
        <span
            ref={markRef}
            role="img"
            aria-label="Pulso, la mascota del dashboard"
            tabIndex={0}
            onClick={fireStarBurst}
            onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    fireStarBurst()
                }
            }}
            className={cn('character-mark cursor-pointer', className)}
        />
    )
}
