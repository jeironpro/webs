/**
 * Sidebar flotante de navegación.
 * Se muestra fijo a la izquierda en desktop y como menú hamburguesa en móvil.
 * Incluye navegación principal, botón de nuevo ticket y perfil del usuario.
 */
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { animate, createScope, spring, stagger } from 'animejs'
import { ChevronLeft, ChevronRight, LogOut, Menu, User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { NuevoTicketDialog } from '@/components/tickets/nuevo-ticket-dialog'
import { AGENTES, TICKETS } from '@/lib/mock'
import { getConteoPorEstado } from '@/lib/stats'
import { useIsMobile } from '@/hooks/use-mobile'
import { NAV_PRINCIPAL } from '@/lib/nav'

const USUARIO = AGENTES[0]

export function FloatingSidebar() {
    const [colapsado, setColapsado] = useState(false)
    const [abiertoMovil, setAbiertoMovil] = useState(false)
    const rootRef = useRef<HTMLDivElement>(null)
    const scopeRef = useRef<ReturnType<typeof createScope> | null>(null)
    const location = useLocation()
    const conteoAbiertos = getConteoPorEstado(TICKETS).abierto
    const isMobile = useIsMobile()

    useEffect(() => {
        if (isMobile) {
            setColapsado(true)
            setAbiertoMovil(false)
        }
    }, [isMobile])

    useEffect(() => {
        scopeRef.current = createScope({ root: rootRef }).add(() => {
            animate('.sidebar-entrance', {
                opacity: [0, 1],
                translateX: [-20, 0],
                duration: 500,
                delay: stagger(80, { start: 100 }),
                ease: 'out(3)',
            })

            animate('.sidebar-logo', {
                scale: [0.8, 1],
                opacity: [0, 1],
                duration: 600,
                ease: spring({ bounce: 0.4 }),
            })
        })

        return () => scopeRef.current?.revert()
    }, [])

    useEffect(() => {
        if (scopeRef.current) {
            animate('.sidebar-nav-item', {
                scale: [0.95, 1],
                opacity: [0.7, 1],
                duration: 200,
                ease: 'out(2)',
            })
        }
    }, [location.pathname])

    const toggleColapsado = () => {
        const sidebar = rootRef.current?.querySelector<HTMLElement>('[data-sidebar]')
        if (!sidebar) return
        animate(sidebar, {
            width: colapsado ? 260 : 72,
            duration: 350,
            ease: 'out(4)',
        })
        setColapsado(!colapsado)
    }

    return (
        <div ref={rootRef} className="relative">
            {isMobile && (
                <button
                    type="button"
                    onClick={() => setAbiertoMovil(!abiertoMovil)}
                    className="fixed left-3 top-3 z-50 flex size-10 items-center justify-center rounded-full border border-border bg-paper-0 text-ink-3 shadow-md"
                    aria-label={abiertoMovil ? 'Cerrar menú' : 'Abrir menú'}
                >
                    <Menu className="size-5" />
                </button>
            )}

            {isMobile && abiertoMovil && (
                <div
                    className="fixed inset-0 z-30 bg-black/30"
                    onClick={() => setAbiertoMovil(false)}
                />
            )}

            <nav
                aria-label="Principal"
                data-sidebar
                className={`fixed left-3 top-3 bottom-3 z-40 flex flex-col overflow-hidden rounded-[20px] border border-border bg-paper-0 shadow-[0_8px_40px_-12px_rgba(20,30,80,0.12),0_0_0_1px_rgba(20,30,80,0.04)] backdrop-blur-xl transition-[width,transform] duration-300 ${
                    isMobile
                        ? abiertoMovil
                            ? 'translate-x-0'
                            : '-translate-x-full'
                        : 'translate-x-0'
                }`}
                style={{ width: colapsado ? 72 : 260 }}
            >
                <div className="flex items-center gap-3 px-4 pt-5 pb-4">
                    <img
                        src="/favicon.svg"
                        alt=""
                        aria-hidden="true"
                        className="sidebar-logo size-9 shrink-0"
                    />
                    {!colapsado && (
                        <span className="sidebar-entrance text-sm font-semibold tracking-tight text-foreground">
                            NubeCart
                        </span>
                    )}
                </div>

                <div className="flex-1 space-y-1 px-3">
                    {NAV_PRINCIPAL.map((item) => {
                        const Icono = item.icono
                        return (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.end}
                                className={({ isActive }) =>
                                    [
                                        'sidebar-nav-item sidebar-entrance group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-[var(--dur-fast)]',
                                        isActive
                                            ? 'bg-brand/10 text-brand'
                                            : 'text-ink-2 hover:bg-paper-2 hover:text-foreground',
                                        colapsado ? 'justify-center' : '',
                                    ].join(' ')
                                }
                            >
                                <Icono aria-hidden="true" className="size-[18px] shrink-0" />
                                {!colapsado && (
                                    <>
                                        <span className="flex-1">{item.titulo}</span>
                                        {item.to === '/tickets' && conteoAbiertos > 0 && (
                                            <Badge
                                                variant="outline"
                                                className="ml-auto h-5 min-w-5 rounded-full px-1.5 text-[10px] tabular-nums"
                                            >
                                                {conteoAbiertos}
                                            </Badge>
                                        )}
                                    </>
                                )}
                                {colapsado && item.to === '/tickets' && conteoAbiertos > 0 && (
                                    <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-brand text-[8px] font-bold text-primary-foreground">
                                        {conteoAbiertos}
                                    </span>
                                )}
                            </NavLink>
                        )
                    })}
                </div>

                <div className="px-3 pb-3">
                    <NuevoTicketDialog colapsado={colapsado} />
                </div>

                <div className="border-t border-border px-3 py-3">
                    <Link
                        to="/perfil"
                        className={`sidebar-entrance flex items-center gap-3 rounded-xl px-2 py-1.5 transition-colors hover:bg-paper-2 ${colapsado ? 'justify-center' : ''}`}
                    >
                        <Avatar size="sm">
                            <AvatarFallback>
                                <User className="size-3.5" />
                            </AvatarFallback>
                        </Avatar>
                        {!colapsado && (
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-xs font-medium text-foreground">
                                    {USUARIO.nombre}
                                </p>
                                <p className="truncate text-[10px] text-ink-2">{USUARIO.rol}</p>
                            </div>
                        )}
                        {!colapsado && (
                            <button
                                type="button"
                                className="rounded-lg p-1.5 text-ink-3 transition-colors hover:bg-paper-2 hover:text-foreground"
                                aria-label="Cerrar sesión"
                            >
                                <LogOut className="size-3.5" />
                            </button>
                        )}
                    </Link>
                </div>
            </nav>

            {!isMobile && (
                <button
                    type="button"
                    onClick={toggleColapsado}
                    className="fixed z-50 flex size-6 items-center justify-center rounded-full border border-border bg-paper-0 text-ink-3 shadow-sm transition-colors hover:bg-paper-2 hover:text-foreground"
                    style={{ top: 44, left: colapsado ? 63 : 251 }}
                    aria-label={colapsado ? 'Expandir sidebar' : 'Colapsar sidebar'}
                >
                    {colapsado ? (
                        <ChevronRight className="size-3" />
                    ) : (
                        <ChevronLeft className="size-3" />
                    )}
                </button>
            )}
        </div>
    )
}
