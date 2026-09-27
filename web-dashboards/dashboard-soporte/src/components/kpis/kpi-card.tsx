/**
 * Tarjeta de métrica KPI.
 * Muestra un valor principal con etiqueta y detalle.
 * Soporte para animaciones de entrada y estado destacado.
 */
import { useEffect, useRef } from 'react'
import { animate, createScope } from 'animejs'
import { cn } from '@/lib/utils'

interface KpiCardProps {
    etiqueta: string
    valor: string
    detalle?: string
    destacado?: boolean
    index?: number
}

export function KpiCard({ etiqueta, valor, detalle, destacado = false, index = 0 }: KpiCardProps) {
    const rootRef = useRef<HTMLDivElement>(null)
    const valueRef = useRef<HTMLParagraphElement>(null)
    const scopeRef = useRef<ReturnType<typeof createScope> | null>(null)

    const match = valor.match(/^([\d.]+)(.*)$/)
    const esNumerico = !!match
    const numeroFinal = esNumerico ? parseFloat(match![1]) : 0
    const sufijo = esNumerico ? match![2] : ''

    useEffect(() => {
        scopeRef.current = createScope({ root: rootRef }).add(() => {
            animate(rootRef.current!, {
                opacity: [0, 1],
                translateY: [24, 0],
                scale: [0.96, 1],
                duration: 550,
                delay: index * 100 + 80,
                ease: 'out(3)',
            })

            if (esNumerico && valueRef.current) {
                const obj = { val: 0 }
                animate(obj, {
                    val: numeroFinal,
                    duration: 800,
                    delay: index * 100 + 300,
                    ease: 'out(3)',
                    onUpdate: () => {
                        if (valueRef.current) {
                            const v = obj.val
                            const display = Number.isInteger(numeroFinal)
                                ? Math.round(v).toString()
                                : v.toFixed(1)
                            valueRef.current.textContent = display + sufijo
                        }
                    },
                })
            }
        })

        return () => scopeRef.current?.revert()
    }, [esNumerico, numeroFinal, sufijo, index])

    return (
        <div
            ref={rootRef}
            className={cn(
                'flex flex-col gap-2 rounded-[var(--radius-lg)] border p-5 transition-[box-shadow] duration-[var(--dur-mid)] ease-[var(--ease-out)] hover:shadow-[0_20px_60px_-30px_rgba(40,30,120,0.28)]',
                destacado
                    ? 'border-border bg-[radial-gradient(160%_140%_at_100%_0%,var(--brand-tint),var(--paper-0)_60%)]'
                    : 'border-border bg-card',
            )}
            style={{ opacity: 0 }}
        >
            <p className="eyebrow">{etiqueta}</p>
            <p
                ref={valueRef}
                className="font-heading text-4xl font-semibold tracking-tight tabular-nums text-ink-0 sm:text-[2.5rem]"
            >
                {esNumerico ? sufijo : valor}
            </p>
            {detalle && <p className="text-xs text-ink-2">{detalle}</p>}
        </div>
    )
}
