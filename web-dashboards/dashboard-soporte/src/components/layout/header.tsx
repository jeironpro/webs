/**
 * Cabecera de página.
 * Muestra el título dinámico según la ruta actual y el contador de tickets abiertos.
 * Incluye animaciones de entrada y focus management para accesibilidad.
 */
import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { animate, createScope, stagger } from 'animejs'
import { TICKETS } from '@/lib/mock'
import { getConteoPorEstado } from '@/lib/stats'

function obtenerTitulo(pathname: string): string {
    if (pathname === '/') return 'Panel'
    if (pathname === '/tickets') return 'Tickets'
    if (pathname.startsWith('/tickets/')) return 'Detalle del ticket'
    if (pathname === '/perfil') return 'Mi perfil'
    return 'NubeCart · Soporte'
}

function obtenerEyebrow(pathname: string): string {
    if (pathname === '/') return 'Mesa de ayuda'
    if (pathname === '/tickets') return 'Cola de trabajo'
    if (pathname.startsWith('/tickets/')) return 'Historial'
    if (pathname === '/perfil') return 'Cuenta'
    return 'NubeCart'
}

export function Header() {
    const location = useLocation()
    const titulo = obtenerTitulo(location.pathname)
    const eyebrow = obtenerEyebrow(location.pathname)
    const tituloRef = useRef<HTMLHeadingElement>(null)
    const rootRef = useRef<HTMLElement>(null)
    const scopeRef = useRef<ReturnType<typeof createScope> | null>(null)
    const conteoAbiertos = getConteoPorEstado(TICKETS).abierto

    useEffect(() => {
        tituloRef.current?.focus({ preventScroll: true })
    }, [location.pathname])

    useEffect(() => {
        scopeRef.current = createScope({ root: rootRef }).add(() => {
            animate('.header-entrance', {
                opacity: [0, 1],
                translateY: [12, 0],
                duration: 450,
                delay: stagger(80, { start: 50 }),
                ease: 'out(3)',
            })
        })
        return () => scopeRef.current?.revert()
    }, [])

    return (
        <header ref={rootRef} className="flex flex-col gap-2 px-4 pt-6 pb-6 sm:px-6 lg:px-8">
            <div className="header-entrance flex flex-wrap items-center gap-x-3 gap-y-2">
                <p className="eyebrow flex items-center gap-2">
                    <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
                    {eyebrow}
                </p>
                <span className="flex items-center gap-1.5 rounded-full border border-border bg-background/70 px-2.5 py-0.5 font-mono text-[10px] tracking-[0.12em] text-ink-2 uppercase">
                    <span aria-hidden="true" className="live-dot" />
                    <span aria-live="polite">
                        {conteoAbiertos} {conteoAbiertos === 1 ? 'abierto' : 'abiertos'}
                    </span>
                </span>
            </div>
            <h1
                ref={tituloRef}
                tabIndex={-1}
                className="header-entrance font-heading text-3xl font-semibold tracking-tight text-foreground outline-none sm:text-4xl"
            >
                {titulo}
            </h1>
        </header>
    )
}
