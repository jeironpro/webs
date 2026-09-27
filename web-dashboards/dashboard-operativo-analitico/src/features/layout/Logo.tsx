import { cn } from '@/lib/utils'

interface LogoProps {
    /** tamaño en píxeles (ancho y alto) */
    size?: number
    className?: string
}

/**
 * Marca del dashboard ("Pulso"): el mismo gráfico del favicon
 * (cuadrado pera + línea de pulso + acento coral), servido desde
 * `public/favicon.svg` para que logo y favicon sean siempre idénticos.
 */
export function Logo({ size = 36, className }: LogoProps) {
    return (
        <img
            src="/favicon.svg"
            alt="Pulso"
            width={size}
            height={size}
            draggable={false}
            className={cn('shrink-0 select-none', className)}
        />
    )
}
