import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

import { useActiveSection } from '@/hooks/useActiveSection'
import { useReveal } from '@/hooks/useReveal'

import { NAV_SECTION_IDS, navIdFor } from './nav'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { Footer } from './Footer'

interface AppShellProps {
    children: ReactNode
}

/**
 * Shell del dashboard: navegación lateral (N3) en escritorio,
 * drawer en móvil, barra superior y footer con marquee.
 * Resalta el ítem del panel según la ruta (/perfil) o la sección visible.
 */
export function AppShell({ children }: AppShellProps) {
    const { pathname } = useLocation()
    const visibleSection = useActiveSection(NAV_SECTION_IDS)
    const activeId = navIdFor(visibleSection, pathname)
    useReveal([pathname])

    return (
        <div className="flex min-h-svh">
            <Sidebar activeId={activeId} />
            <div className="flex min-w-0 flex-1 flex-col">
                <Topbar activeId={activeId} />
                <main className="flex-1">{children}</main>
                <Footer />
            </div>
        </div>
    )
}
