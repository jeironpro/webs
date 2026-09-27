import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
    flexRender,
    stockFeatures,
    useTable,
    type Column,
    type ColumnDef,
} from '@tanstack/react-table'
import {
    ArrowUpDown,
    ChevronDown,
    ChevronUp,
    Download,
    FileSpreadsheet,
    Inbox,
    Search,
} from 'lucide-react'
import { animate, createScope, stagger } from 'animejs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
    ETIQUETAS_CATEGORIA,
    ETIQUETAS_ESTADO,
    ETIQUETAS_PRIORIDAD,
    PriorityBadge,
    StatusBadge,
} from '@/components/tickets/badges'
import { getAgentePorId, getClientePorId, TICKETS } from '@/lib/mock'
import { formatearFecha, formatearIniciales } from '@/lib/format'
import type { Categoria, Prioridad, Ticket, TicketEstado } from '@/lib/types'

const OPCIONES_ESTADO: [TicketEstado, string][] = Object.entries(ETIQUETAS_ESTADO) as [
    TicketEstado,
    string,
][]

const OPCIONES_PRIORIDAD: [Prioridad, string][] = Object.entries(ETIQUETAS_PRIORIDAD) as [
    Prioridad,
    string,
][]

const OPCIONES_CATEGORIA: [Categoria, string][] = Object.entries(ETIQUETAS_CATEGORIA) as [
    Categoria,
    string,
][]

function FiltroSelect({
    etiqueta,
    opciones,
    valor,
    alCambiar,
}: {
    etiqueta: string
    opciones: [string, string][]
    valor: string
    alCambiar: (valor: string) => void
}) {
    return (
        <Select value={valor} onValueChange={(nuevo) => alCambiar(nuevo ?? 'todos')}>
            <SelectTrigger aria-label={etiqueta} className="w-full sm:w-auto">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                {opciones.map(([valorItem, etiquetaItem]) => (
                    <SelectItem key={valorItem} value={valorItem}>
                        {etiquetaItem}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

function CabeceraOrdenable({
    etiqueta,
    columna,
}: {
    etiqueta: string
    columna: Column<typeof stockFeatures, Ticket>
}) {
    const orden = columna.getIsSorted()
    return (
        <button
            type="button"
            onClick={columna.getToggleSortingHandler()}
            className="inline-flex items-center gap-1 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
            {etiqueta}
            {orden === 'asc' ? (
                <ChevronUp aria-hidden="true" className="size-3.5" />
            ) : orden === 'desc' ? (
                <ChevronDown aria-hidden="true" className="size-3.5" />
            ) : (
                <ArrowUpDown aria-hidden="true" className="size-3.5 opacity-50" />
            )}
        </button>
    )
}

const COLUMNAS: ColumnDef<typeof stockFeatures, Ticket>[] = [
    {
        accessorKey: 'titulo',
        id: 'titulo',
        enableSorting: false,
        header: ({ column }) => <CabeceraOrdenable etiqueta="Ticket" columna={column} />,
        cell({ row }) {
            const ticket = row.original
            return (
                <div className="min-w-0">
                    <p className="text-xs font-medium text-muted-foreground tabular-nums">
                        {ticket.id}
                    </p>
                    <Link
                        to={`/tickets/${ticket.id}`}
                        className="line-clamp-2 font-medium text-foreground hover:underline focus-visible:underline focus-visible:outline-none"
                    >
                        {ticket.titulo}
                    </Link>
                </div>
            )
        },
    },
    {
        accessorKey: 'cliente_id',
        id: 'cliente_id',
        enableSorting: false,
        header: 'Cliente',
        cell({ row }) {
            const cliente = getClientePorId(row.original.cliente_id)
            if (!cliente) return <span className="text-muted-foreground">—</span>
            return (
                <div>
                    <p className="text-sm font-medium text-foreground">{cliente.nombre}</p>
                    <p className="text-xs text-muted-foreground">{cliente.empresa}</p>
                </div>
            )
        },
    },
    {
        accessorKey: 'estado',
        id: 'estado',
        enableSorting: false,
        header: 'Estado',
        cell({ row }) {
            return <StatusBadge estado={row.original.estado} />
        },
    },
    {
        accessorKey: 'prioridad',
        id: 'prioridad',
        enableSorting: false,
        header: 'Prioridad',
        cell({ row }) {
            return <PriorityBadge prioridad={row.original.prioridad} />
        },
    },
    {
        accessorKey: 'categoria',
        id: 'categoria',
        enableSorting: false,
        header: 'Categoría',
        cell({ row }) {
            return (
                <span className="text-sm text-muted-foreground">
                    {ETIQUETAS_CATEGORIA[row.original.categoria]}
                </span>
            )
        },
    },
    {
        accessorFn: (ticket) => getAgentePorId(ticket.agente_id)?.nombre ?? '',
        id: 'asignado_a',
        enableSorting: false,
        header: 'Asignado',
        cell({ row }) {
            const agente = getAgentePorId(row.original.agente_id)
            if (!agente) {
                return <span className="text-sm text-muted-foreground">Sin asignar</span>
            }
            return (
                <span className="flex items-center gap-2">
                    <Avatar size="sm">
                        <AvatarFallback>{formatearIniciales(agente.nombre)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">{agente.nombre}</span>
                </span>
            )
        },
    },
    {
        accessorKey: 'creado_el',
        id: 'creado_el',
        header: ({ column }) => <CabeceraOrdenable etiqueta="Creado" columna={column} />,
        cell({ row }) {
            return (
                <span className="text-sm whitespace-nowrap text-muted-foreground">
                    {formatearFecha(row.original.creado_el)}
                </span>
            )
        },
    },
]

export function TicketsPage() {
    const [busqueda, setBusqueda] = useState('')
    const [estado, setEstado] = useState('todos')
    const [prioridad, setPrioridad] = useState('todos')
    const [categoria, setCategoria] = useState('todos')
    const tableRef = useRef<HTMLDivElement>(null)
    const scopeRef = useRef<ReturnType<typeof createScope> | null>(null)

    const hayFiltros =
        busqueda.trim() !== '' ||
        estado !== 'todos' ||
        prioridad !== 'todos' ||
        categoria !== 'todos'

    const limpiarFiltros = () => {
        setBusqueda('')
        setEstado('todos')
        setPrioridad('todos')
        setCategoria('todos')
    }

    const ticketsFiltrados = useMemo(() => {
        const consulta = busqueda.trim().toLowerCase()
        return TICKETS.filter((ticket) => {
            if (estado !== 'todos' && ticket.estado !== estado) return false
            if (prioridad !== 'todos' && ticket.prioridad !== prioridad) return false
            if (categoria !== 'todos' && ticket.categoria !== categoria) return false
            if (consulta === '') return true

            const cliente = getClientePorId(ticket.cliente_id)
            const candidatos = [
                ticket.id,
                ticket.titulo,
                ticket.descripcion,
                ETIQUETAS_CATEGORIA[ticket.categoria],
                ETIQUETAS_ESTADO[ticket.estado],
                ETIQUETAS_PRIORIDAD[ticket.prioridad],
                ticket.canal,
                cliente?.nombre,
                cliente?.empresa,
                cliente?.email,
            ]
            return candidatos.some((valor) =>
                String(valor ?? '')
                    .toLowerCase()
                    .includes(consulta),
            )
        })
    }, [busqueda, estado, prioridad, categoria])

    const tabla = useTable({
        features: stockFeatures,
        data: ticketsFiltrados,
        columns: COLUMNAS,
        initialState: {
            sorting: [{ id: 'creado_el', desc: true }],
        },
    })

    const filas = tabla.getRowModel().rows

    useEffect(() => {
        if (!tableRef.current) return
        scopeRef.current = createScope({ root: tableRef }).add(() => {
            animate('.table-entrance', {
                opacity: [0, 1],
                translateY: [8, 0],
                duration: 350,
                delay: stagger(30, { start: 80 }),
                ease: 'out(3)',
            })
        })
        return () => scopeRef.current?.revert()
    }, [filas.length, busqueda, estado, prioridad, categoria])

    return (
        <section className="flex flex-col gap-4">
            <header className="flex flex-wrap items-center gap-3">
                <div className="relative min-w-0 flex-1 basis-64">
                    <Search
                        aria-hidden="true"
                        className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                        type="search"
                        value={busqueda}
                        onChange={(evento) => setBusqueda(evento.target.value)}
                        placeholder="Buscar por cliente, título o descripción…"
                        className="pl-8"
                        aria-label="Buscar tickets"
                    />
                </div>
                <FiltroSelect
                    etiqueta="Estado"
                    opciones={OPCIONES_ESTADO}
                    valor={estado}
                    alCambiar={setEstado}
                />
                <FiltroSelect
                    etiqueta="Prioridad"
                    opciones={OPCIONES_PRIORIDAD}
                    valor={prioridad}
                    alCambiar={setPrioridad}
                />
                <FiltroSelect
                    etiqueta="Categoría"
                    opciones={OPCIONES_CATEGORIA}
                    valor={categoria}
                    alCambiar={setCategoria}
                />
            </header>

            <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground" aria-live="polite">
                    {filas.length === 1
                        ? '1 ticket'
                        : `${filas.length} de ${TICKETS.length} tickets`}
                </p>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled title="Próximamente">
                        <Download aria-hidden="true" className="size-3.5" />
                        CSV
                    </Button>
                    <Button variant="outline" size="sm" disabled title="Próximamente">
                        <FileSpreadsheet aria-hidden="true" className="size-3.5" />
                        Excel
                    </Button>
                    {hayFiltros && (
                        <Button variant="ghost" size="sm" onClick={limpiarFiltros}>
                            Limpiar filtros
                        </Button>
                    )}
                </div>
            </div>

            {filas.length === 0 ? (
                <div className="relative flex flex-col items-center gap-3 overflow-hidden rounded-[var(--radius-lg)] border border-dashed border-border bg-card px-6 py-16 text-center">
                    <span className="flex size-12 items-center justify-center rounded-full border border-border bg-paper-1">
                        <Inbox aria-hidden="true" className="size-6 text-ink-2" />
                    </span>
                    <p className="eyebrow">Sin coincidencias</p>
                    <p className="text-lg font-semibold text-foreground">
                        No se encontraron tickets
                    </p>
                    <p className="max-w-sm text-sm text-muted-foreground">
                        Probá con otros términos de búsqueda o ajustá los filtros para ver más
                        resultados.
                    </p>
                    <Button variant="outline" onClick={limpiarFiltros}>
                        Limpiar filtros
                    </Button>
                </div>
            ) : (
                <div
                    ref={tableRef}
                    className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card"
                >
                    <Table>
                        <TableHeader>
                            {tabla.getHeaderGroups().map((grupo) => (
                                <TableRow key={grupo.id} className="hover:bg-transparent">
                                    {grupo.headers.map((cabecera) => {
                                        const orden = cabecera.column.getIsSorted()
                                        return (
                                            <TableHead
                                                key={cabecera.id}
                                                aria-sort={
                                                    orden === 'asc'
                                                        ? 'ascending'
                                                        : orden === 'desc'
                                                          ? 'descending'
                                                          : undefined
                                                }
                                            >
                                                {flexRender(
                                                    cabecera.column.columnDef.header,
                                                    cabecera.getContext(),
                                                )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {filas.map((fila) => (
                                <TableRow
                                    key={fila.id}
                                    className="table-entrance"
                                    style={{ opacity: 0 }}
                                >
                                    {fila.getVisibleCells().map((celda) => (
                                        <TableCell key={celda.id}>
                                            {flexRender(
                                                celda.column.columnDef.cell,
                                                celda.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </section>
    )
}
