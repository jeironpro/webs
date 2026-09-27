/** Dimensiones del negocio. */

export interface Category {
    id: string
    name: string
}

export interface Region {
    id: string
    name: string
}

export interface Channel {
    id: string
    name: string
}

/**
 * Venta diaria a nivel (fecha, categoría, región, canal).
 * Campos compactos por tamaño del archivo (igual que una API real).
 */
export interface DailySale {
    /** fecha ISO (YYYY-MM-DD) */
    d: string
    /** id de categoría */
    c: string
    /** id de región */
    r: string
    /** id de canal */
    ch: string
    /** ingresos (MXN) */
    rev: number
    /** pedidos */
    ord: number
    /** unidades vendidas */
    uni: number
    /** visitas (o tráfico a tienda) */
    vis: number
    /** clientes nuevos */
    nc: number
    /** clientes recurrentes */
    rc: number
    /** reembolsos */
    ref: number
}

export interface WeeklySeries {
    /** lunes de la semana (ISO) */
    week: string
    start: string
    end: string
    revenue: number
    orders: number
    units: number
    visitors: number
    newCustomers: number
    returningCustomers: number
    refunds: number
}

export interface MonthlySeries {
    month: string
    revenue: number
    orders: number
    units: number
    visitors: number
    newCustomers: number
    returningCustomers: number
    refunds: number
    margin: number
}

export interface CustomerMonth {
    month: string
    acquired: number
    retained30: number
    retained60: number
    retained90: number
    churnRate: number
    nps: number
}

/** Datos de la persona propietaria del dashboard (perfil). */
export interface UserProfile {
    name: string
    initials: string
    role: string
    company: string
    email: string
    phone: string
    location: string
    timezone: string
    team: string
    joined: string
    bio: string
    skills: string[]
    languages: string[]
    stats: Array<{ id: string; label: string; value: number; format: 'number' | 'percent' }>
    activity: Array<{ id: string; type: string; title: string; date: string }>
}

export type OrderStatus = 'completado' | 'enviado' | 'procesando' | 'cancelado'

export interface Order {
    id: string
    date: string
    customer: string
    category: string
    region: string
    channel: string
    items: number
    revenue: number
    status: OrderStatus
}
