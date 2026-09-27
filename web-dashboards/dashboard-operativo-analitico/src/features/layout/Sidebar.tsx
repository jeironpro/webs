import { Link } from 'react-router-dom'

import { cn } from '@/lib/utils'

import { NAV_ITEMS } from './nav'
import { Logo } from './Logo'

interface SidebarProps {
    /** id del ítem de navegación activo */
    activeId: string
}

/**
 * Navegación lateral de escritorio (arquetipo N3 side-rail adaptado a app).
 * En móvil se sustituye por el drawer de `MobileNav`.
 */
export function Sidebar({ activeId }: SidebarProps) {
    return (
        <aside className="sticky top-0 hidden h-svh w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar px-4 py-6 lg:flex">
            <Link
                to="/"
                className="flex items-center gap-3 rounded-full px-2"
                aria-label="Ir al resumen"
            >
                <Logo size={34} />
                <span className="flex flex-col">
                    <span className="text-lg leading-tight font-semibold tracking-tight">
                        Pulso
                    </span>
                    <span className="mono-label">Dashboard operativo</span>
                </span>
            </Link>

            <nav aria-label="Navegación principal" className="mt-8 flex flex-col gap-1">
                {NAV_ITEMS.map((item) => {
                    const isActive = activeId === item.id
                    const Icon = item.icon
                    const className = cn(
                        'flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium transition-colors',
                        isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                    )
                    return (
                        <Link
                            key={item.id}
                            to={item.path ?? `/#${item.sectionId}`}
                            aria-current={isActive ? 'true' : undefined}
                            className={className}
                        >
                            <Icon className="size-4 shrink-0" aria-hidden="true" />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>

            <div className="mt-auto flex flex-col items-center gap-3 px-2">
                <p className="mono-label opacity-50">Nébula · 2026</p>
            </div>
        </aside>
    )
}
