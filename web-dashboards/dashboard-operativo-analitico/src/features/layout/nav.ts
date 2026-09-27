import {
    FileTextIcon,
    LayoutDashboardIcon,
    ShoppingCartIcon,
    TrendingUpIcon,
    UserRoundIcon,
    type LucideIcon,
} from 'lucide-react'

export interface NavItem {
    /** id estable del elemento de navegación */
    id: string
    label: string
    icon: LucideIcon
    /** id de la sección del dashboard a la que ancla (si es sección) */
    sectionId?: string
    /** ruta de la página a la que navega (si es una página propia) */
    path?: string
}

export const NAV_ITEMS: readonly NavItem[] = [
    { id: 'resumen', label: 'Resumen', sectionId: 'resumen', icon: LayoutDashboardIcon },
    { id: 'tendencias', label: 'Tendencias', sectionId: 'tendencias', icon: TrendingUpIcon },
    { id: 'detalle', label: 'Detalle de pedidos', sectionId: 'detalle', icon: ShoppingCartIcon },
    { id: 'reportes', label: 'Reportes', sectionId: 'reportes', icon: FileTextIcon },
    { id: 'perfil', label: 'Perfil', path: '/perfil', icon: UserRoundIcon },
]

export const NAV_SECTION_IDS: readonly string[] = NAV_ITEMS.flatMap((item) =>
    item.sectionId ? [item.sectionId] : [],
)

/** Devuelve la id del ítem activo según la ruta o la sección visible. */
export function navIdFor(sectionId: string, pathname: string): string {
    const pageItem = NAV_ITEMS.find((item) => item.path === pathname)
    if (pageItem) return pageItem.id
    const sectionItem = NAV_ITEMS.find((item) => item.sectionId === sectionId)
    return sectionItem?.id ?? NAV_ITEMS[0].id
}
