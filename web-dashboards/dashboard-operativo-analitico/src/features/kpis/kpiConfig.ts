import {
    DollarSignIcon,
    MousePointerClickIcon,
    ShoppingBagIcon,
    ReceiptIcon,
    RepeatIcon,
    UserPlusIcon,
    type LucideIcon,
} from 'lucide-react'

import type { KpiSet } from '@/lib/aggregations'
import {
    formatCompactCurrency,
    formatCompactNumber,
    formatCurrency,
    formatNumber,
    formatPercent,
} from '@/lib/formatters'

export interface KpiDefinition {
    /** clave en KpiSet */
    id: keyof KpiSet
    label: string
    hint: string
    /** token de acento Hum (pera, cian, coral, lavanda, mint) */
    accent: string
    icon: LucideIcon
    format: (value: number) => string
    /** la tarjeta principal (ventas) ocupa más espacio en desktop */
    featured?: boolean
}

/**
 * Configuración de las tarjetas KPI. Cada acento del tema Hum es dueño
 * de su propia superficie (regla de los tres acentos + mint/lavanda).
 */
export const KPI_DEFINITIONS: readonly KpiDefinition[] = [
    {
        id: 'revenue',
        label: 'Ventas',
        hint: 'Ingresos del periodo',
        accent: 'var(--color-pear)',
        icon: DollarSignIcon,
        format: formatCompactCurrency,
        featured: true,
    },
    {
        id: 'conversion',
        label: 'Conversión',
        hint: 'Pedidos sobre visitas',
        accent: 'var(--color-coral)',
        icon: MousePointerClickIcon,
        format: (value) => formatPercent(value),
    },
    {
        id: 'orders',
        label: 'Pedidos',
        hint: 'Órdenes del periodo',
        accent: 'var(--color-cyan)',
        icon: ShoppingBagIcon,
        format: formatNumber,
    },
    {
        id: 'ticket',
        label: 'Ticket promedio',
        hint: 'Ingreso por pedido',
        accent: 'var(--color-lavender)',
        icon: ReceiptIcon,
        format: formatCurrency,
    },
    {
        id: 'retention',
        label: 'Retención',
        hint: 'Clientes que repiten',
        accent: 'var(--color-mint)',
        icon: RepeatIcon,
        format: (value) => formatPercent(value),
    },
    {
        id: 'newCustomers',
        label: 'Clientes nuevos',
        hint: 'Primera compra',
        accent: 'var(--color-cyan)',
        icon: UserPlusIcon,
        format: formatCompactNumber,
    },
]
