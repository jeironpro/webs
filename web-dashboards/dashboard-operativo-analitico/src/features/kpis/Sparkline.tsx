import { useId } from 'react'

import { cn } from '@/lib/utils'

interface SparklineProps {
    data: number[]
    className?: string
}

/**
 * Mini-gráfico de tendencia en SVG puro (área + línea), coloreado con el
 * acento de la tarjeta (`--card-accent`).
 */
export function Sparkline({ data, className }: SparklineProps) {
    const gradientId = useId()
    const width = 120
    const height = 36

    if (data.length < 2) return null

    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1

    const points = data.map((value, index) => {
        const x = (index / (data.length - 1)) * width
        const y = height - 4 - ((value - min) / range) * (height - 8)
        return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    const line = points.join(' ')
    const area = `0,${height} ${line} ${width},${height}`

    return (
        <svg
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            aria-hidden="true"
            className={cn('h-9 w-full', className)}
        >
            <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop
                        offset="0%"
                        stopColor="var(--card-accent, var(--color-pear))"
                        stopOpacity="0.35"
                    />
                    <stop
                        offset="100%"
                        stopColor="var(--card-accent, var(--color-pear))"
                        stopOpacity="0"
                    />
                </linearGradient>
            </defs>
            <polygon points={area} fill={`url(#${gradientId})`} />
            <polyline
                points={line}
                fill="none"
                stroke="var(--card-accent, var(--color-pear))"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    )
}
