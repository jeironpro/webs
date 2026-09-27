import { useMemo, useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, PackageSearchIcon, SearchIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { useDashboardStore } from '@/store/useDashboardStore'
import { formatCurrency, formatShortDate } from '@/lib/formatters'
import {
    applyDashboardFilters,
    filterOrders,
    paginate,
    totalPages,
    type OrderQuery,
} from '@/lib/orders'
import type { OrderStatus } from '@/types'

const STATUS_OPTIONS: Array<{ value: OrderStatus; label: string; className: string }> = [
    { value: 'completado', label: 'Completado', className: 'bg-mint/30 text-foreground' },
    { value: 'enviado', label: 'Enviado', className: 'bg-cyan/20 text-foreground' },
    { value: 'procesando', label: 'Procesando', className: 'bg-amber-100 text-foreground' },
    { value: 'cancelado', label: 'Cancelado', className: 'bg-coral/15 text-foreground' },
]

function OrdersSkeleton() {
    return (
        <Card className="mt-8">
            <CardContent className="space-y-4 p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Skeleton className="h-9 w-64" />
                    <Skeleton className="h-9 w-40" />
                </div>
                <Skeleton className="h-72 w-full" />
            </CardContent>
        </Card>
    )
}

/**
 * Detalle de pedidos: tabla con los últimos pedidos, búsqueda por id,
 * cliente o categoría, filtro por estado y paginación. Respeta los
 * filtros globales del dashboard (fecha, categoría, región, canal).
 */
export function OrdersSection() {
    const status = useDashboardStore((state) => state.status)
    const data = useDashboardStore((state) => state.data)
    const filters = useDashboardStore((state) => state.filters)

    const [query, setQuery] = useState<OrderQuery>({ search: '', status: null })
    const [page, setPage] = useState(1)

    // Al cambiar los filtros globales o la búsqueda volvemos a la primera página.
    const results = useMemo(() => {
        if (!data) return []
        const dashboardFiltered = applyDashboardFilters(data.orders, filters)
        return filterOrders(dashboardFiltered, query)
    }, [data, filters, query])

    const pages = totalPages(results.length)
    const safePage = Math.min(page, pages)
    const pageItems = useMemo(() => paginate(results, safePage), [results, safePage])

    if (status !== 'ready' || !data) return <OrdersSkeleton />

    return (
        <section id="detalle" aria-label="Detalle de pedidos" className="scroll-mt-24 py-12">
            <div className="reveal">
                <p className="mono-label">Detalle de pedidos</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">Últimos pedidos</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    {results.length} pedido{results.length === 1 ? '' : 's'} en el periodo filtrado
                </p>
            </div>

            <Card className="mt-6">
                <CardContent className="space-y-4 p-5">
                    {/* Búsqueda + filtro por estado */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative w-full sm:max-w-xs">
                            <SearchIcon
                                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                                aria-hidden="true"
                            />
                            <Input
                                value={query.search}
                                onChange={(event) => {
                                    setQuery((prev) => ({ ...prev, search: event.target.value }))
                                    setPage(1)
                                }}
                                placeholder="Buscar por id, cliente o categoría…"
                                aria-label="Buscar pedidos"
                                className="h-9 rounded-full pl-9"
                            />
                        </div>

                        <Select
                            value={query.status ?? 'all'}
                            onValueChange={(value) => {
                                setQuery((prev) => ({
                                    ...prev,
                                    status: value === 'all' ? null : (value as OrderStatus),
                                }))
                                setPage(1)
                            }}
                        >
                            <SelectTrigger
                                className="h-9 w-full rounded-full sm:w-44"
                                aria-label="Filtrar por estado"
                            >
                                <SelectValue placeholder="Todos los estados" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los estados</SelectItem>
                                {STATUS_OPTIONS.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Tabla de pedidos */}
                    {pageItems.length === 0 ? (
                        <div className="flex flex-col items-center gap-2 py-14 text-center">
                            <PackageSearchIcon
                                className="size-8 text-muted-foreground"
                                aria-hidden="true"
                            />
                            <p className="text-sm font-medium">Sin pedidos para mostrar</p>
                            <p className="text-xs text-muted-foreground">
                                Prueba con otra búsqueda o limpia los filtros.
                            </p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Pedido</TableHead>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Categoría
                                    </TableHead>
                                    <TableHead className="hidden lg:table-cell">Región</TableHead>
                                    <TableHead className="hidden lg:table-cell">Canal</TableHead>
                                    <TableHead className="text-right">Importe</TableHead>
                                    <TableHead>Estado</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pageItems.map((order) => {
                                    const statusOption = STATUS_OPTIONS.find(
                                        (option) => option.value === order.status,
                                    )
                                    return (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-medium tabular">
                                                {order.id}
                                            </TableCell>
                                            <TableCell className="tabular">
                                                {formatShortDate(order.date)}
                                            </TableCell>
                                            <TableCell>{order.customer}</TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {order.category}
                                            </TableCell>
                                            <TableCell className="hidden capitalize lg:table-cell">
                                                {order.region}
                                            </TableCell>
                                            <TableCell className="hidden capitalize lg:table-cell">
                                                {order.channel}
                                            </TableCell>
                                            <TableCell className="text-right font-semibold tabular">
                                                {formatCurrency(order.revenue)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="secondary"
                                                    className={statusOption?.className}
                                                >
                                                    {statusOption?.label ?? order.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    )}

                    {/* Paginación */}
                    <div className="flex items-center justify-between gap-3">
                        <p className="text-xs text-muted-foreground tabular">
                            Página {safePage} de {pages}
                        </p>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="gap-1 rounded-full"
                                disabled={safePage <= 1}
                                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                            >
                                <ChevronLeftIcon className="size-4" aria-hidden="true" />
                                Anterior
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="gap-1 rounded-full"
                                disabled={safePage >= pages}
                                onClick={() => setPage((prev) => Math.min(pages, prev + 1))}
                            >
                                Siguiente
                                <ChevronRightIcon className="size-4" aria-hidden="true" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </section>
    )
}
