/**
 * Shell de la aplicación.
 * Contiene el sidebar, header y el contenido principal.
 * Maneja el layout responsive con padding variable según dispositivo.
 */
import { Outlet } from 'react-router-dom'
import { FloatingSidebar } from '@/components/layout/floating-sidebar'
import { Header } from '@/components/layout/header'
import { useIsMobile } from '@/hooks/use-mobile'

export function AppShell() {
    const isMobile = useIsMobile()

    return (
        <div className="min-h-svh">
            <a
                href="#contenido-principal"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground focus:ring-2 focus:ring-ring"
            >
                Saltar al contenido
            </a>
            <FloatingSidebar />
            <div
                className={isMobile ? 'pl-0' : 'pl-[276px]'}
                style={{ transition: 'padding 300ms' }}
            >
                <Header />
                <main id="contenido-principal" className="flex-1 px-4 pb-16 sm:px-6 lg:px-8">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
