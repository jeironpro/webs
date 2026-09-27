import { Link } from 'react-router-dom'
import { UserRoundIcon } from 'lucide-react'

import { formatDate } from '@/lib/formatters'

import { MobileNav } from './MobileNav'
import { Logo } from './Logo'

interface TopbarProps {
    /** id del ítem de navegación activo */
    activeId: string
}

/** Barra superior fija: saludo del equipo, fecha y acceso al perfil. */
export function Topbar({ activeId }: TopbarProps) {
    const today = new Date()
    const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
        today.getDate(),
    ).padStart(2, '0')}`

    return (
        <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                    <MobileNav activeId={activeId} />
                    <Logo size={28} className="lg:hidden" />
                    <div className="min-w-0">
                        <h1 className="truncate text-base font-semibold tracking-tight sm:text-lg">
                            Buenas tardes, equipo
                        </h1>
                        <p className="truncate text-sm text-muted-foreground">
                            {formatDate(todayIso)} · Nébula
                        </p>
                    </div>
                </div>

                <Link
                    to="/perfil"
                    aria-label="Abrir perfil"
                    title="Ver perfil"
                    className="flex size-8 shrink-0 items-center justify-center rounded-full bg-cyan text-sm font-semibold text-background transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                    <UserRoundIcon className="size-4" aria-hidden="true" />
                </Link>
            </div>
        </header>
    )
}
