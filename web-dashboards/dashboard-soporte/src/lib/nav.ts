/**
 * Navegación principal del sidebar.
 * Compartido entre floating-sidebar y otros componentes que necesiten
 * acceder a las rutas de navegación.
 */
import { LayoutDashboard, Ticket } from 'lucide-react'

export const NAV_PRINCIPAL = [
    { titulo: 'Panel', icono: LayoutDashboard, to: '/', end: true },
    { titulo: 'Tickets', icono: Ticket, to: '/tickets', end: false },
]
