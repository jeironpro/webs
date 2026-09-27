import type { Order, OrderStatus } from '@/types'
import type { DashboardFilters } from './filters'

/** Pedidos visibles por página en el detalle. */
export const ORDERS_PER_PAGE = 10

export interface OrderQuery {
    /** texto libre (id, cliente o categoría) */
    search: string
    /** estado o null = todos */
    status: OrderStatus | null
}

/** Aplica los filtros globales del dashboard (fecha, categoría, región, canal). */
export function applyDashboardFilters(orders: Order[], filters: DashboardFilters): Order[] {
    return orders.filter((order) => {
        if (filters.category !== null && order.category !== filters.category) return false
        if (filters.region !== null && order.region !== filters.region) return false
        if (filters.channel !== null && order.channel !== filters.channel) return false
        if (filters.dateRange !== null) {
            if (order.date < filters.dateRange.from || order.date > filters.dateRange.to)
                return false
        }
        return true
    })
}

/** Filtra pedidos por texto libre y estado (normaliza tildes). */
export function filterOrders(orders: Order[], query: OrderQuery): Order[] {
    const needle = normalize(query.search.trim().toLowerCase())
    return orders.filter((order) => {
        if (query.status !== null && order.status !== query.status) return false
        if (needle === '') return true
        return (
            normalize(order.id.toLowerCase()).includes(needle) ||
            normalize(order.customer.toLowerCase()).includes(needle) ||
            normalize(order.category.toLowerCase()).includes(needle)
        )
    })
}

/** Elimina tildes y diéresis para que "electrónica" matchee "electronica". */
export function normalize(value: string): string {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

/** Pagina una lista ya filtrada (índice base 1, clamps fuera de rango). */
export function paginate<T>(items: T[], page: number, perPage = ORDERS_PER_PAGE): T[] {
    const totalPages = Math.max(1, Math.ceil(items.length / perPage))
    const safePage = Math.min(Math.max(1, page), totalPages)
    const start = (safePage - 1) * perPage
    return items.slice(start, start + perPage)
}

/** Número total de páginas para una lista (mínimo 1). */
export function totalPages(itemsLength: number, perPage = ORDERS_PER_PAGE): number {
    return Math.max(1, Math.ceil(itemsLength / perPage))
}
