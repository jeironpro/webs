import { useMemo, useRef } from 'react'
import { toast } from 'sonner'
import { FileDownIcon, FileSpreadsheetIcon, FileTextIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useDashboardStore, useFilteredDaily } from '@/store/useDashboardStore'
import { formatCurrency, formatPercent } from '@/lib/formatters'
import { buildCategoryReport, exportCsv, exportExcel, exportCategoryPdf } from '@/lib/exporters'

function ReportsSkeleton() {
    return (
        <Card className="mt-8">
            <CardContent className="space-y-4 p-5">
                <Skeleton className="h-8 w-72" />
                <Skeleton className="h-10 w-full sm:w-96" />
                <Skeleton className="h-72 w-full" />
            </CardContent>
        </Card>
    )
}

function periodLabel(): string {
    const today = new Date()
    return `Generado el ${today.toLocaleDateString('es-MX', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })}`
}

function fileStamp(): string {
    const now = new Date()
    const pad = (value: number) => String(value).padStart(2, '0')
    return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`
}

/**
 * Reportes exportables: desglose de ventas por categoría del periodo
 * filtrado con exportación a CSV, Excel y PDF (tema Hum). Dispara un
 * star-burst del personaje y un toast de éxito al exportar.
 */
export function ReportsSection() {
    const status = useDashboardStore((state) => state.status)
    const data = useDashboardStore((state) => state.data)
    const filteredDaily = useFilteredDaily()

    const report = useMemo(() => {
        if (!data) return null
        return buildCategoryReport(filteredDaily, data.categories)
    }, [data, filteredDaily])

    const burstRef = useRef<HTMLSpanElement>(null)

    function celebrate() {
        const element = burstRef.current
        if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        const burst = document.createElement('span')
        burst.className = 'star-burst'
        element.appendChild(burst)
        window.setTimeout(() => burst.remove(), 450)
    }

    function handleExport(format: 'csv' | 'xlsx' | 'pdf') {
        if (!report || report.rows.length === 0) {
            toast.error('No hay datos para exportar', {
                description: 'Amplía el rango de fechas o limpia los filtros.',
            })
            return
        }

        const stamp = fileStamp()
        const headers = [
            'Categoría',
            'Ingresos (MXN)',
            'Pedidos',
            'Unidades',
            'Participación',
            'Margen',
        ]
        const rows = report.rows.map((row) => [
            row.category,
            row.revenue,
            row.orders,
            row.units,
            `${row.share.toLocaleString('es-MX', { maximumFractionDigits: 1 })} %`,
            `${row.margin.toLocaleString('es-MX', { maximumFractionDigits: 1 })} %`,
        ])

        if (format === 'csv') {
            exportCsv(`pulso-reporte-categorias-${stamp}.csv`, headers, rows)
            toast.success('Reporte CSV exportado', { description: 'Listo para abrir en Excel.' })
        } else if (format === 'xlsx') {
            exportExcel(`pulso-reporte-categorias-${stamp}.xlsx`, 'Por categoría', headers, rows)
            toast.success('Reporte Excel exportado', { description: 'Archivo .xlsx descargado.' })
        } else {
            exportCategoryPdf(`pulso-reporte-categorias-${stamp}.pdf`, report, periodLabel())
            toast.success('Reporte PDF exportado', { description: 'Archivo .pdf descargado.' })
        }

        celebrate()
    }

    if (status !== 'ready' || !report) return <ReportsSkeleton />

    return (
        <section id="reportes" aria-label="Reportes" className="scroll-mt-24 py-12">
            <div className="reveal">
                <p className="mono-label">Reportes</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">Exporta tus datos</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    Desglose por categoría del periodo filtrado, listo para compartir.
                </p>
            </div>

            <Card className="mt-6">
                <CardContent className="space-y-5 p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold">Ventas por categoría</p>
                            <p className="text-xs text-muted-foreground">
                                {report.rows.length} categorías ·{' '}
                                {formatCurrency(report.totals.revenue)} en total
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <span ref={burstRef} className="relative inline-flex">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-1.5 rounded-full"
                                    onClick={() => handleExport('csv')}
                                >
                                    <FileDownIcon className="size-4" aria-hidden="true" />
                                    CSV
                                </Button>
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-1.5 rounded-full"
                                onClick={() => handleExport('xlsx')}
                            >
                                <FileSpreadsheetIcon className="size-4" aria-hidden="true" />
                                Excel
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-1.5 rounded-full"
                                onClick={() => handleExport('pdf')}
                            >
                                <FileTextIcon className="size-4" aria-hidden="true" />
                                PDF
                            </Button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                                    <th className="pb-2 pr-4 font-medium">Categoría</th>
                                    <th className="pb-2 pr-4 text-right font-medium">Ingresos</th>
                                    <th className="pb-2 pr-4 text-right font-medium">Pedidos</th>
                                    <th className="pb-2 pr-4 text-right font-medium">Unidades</th>
                                    <th className="pb-2 pr-4 text-right font-medium">
                                        Participación
                                    </th>
                                    <th className="pb-2 text-right font-medium">Margen</th>
                                </tr>
                            </thead>
                            <tbody>
                                {report.rows.map((row, index) => (
                                    <tr key={row.categoryId} className="border-b last:border-0">
                                        <td className="py-2.5 pr-4 font-medium">{row.category}</td>
                                        <td className="py-2.5 pr-4 text-right tabular">
                                            {formatCurrency(row.revenue)}
                                        </td>
                                        <td className="py-2.5 pr-4 text-right tabular">
                                            {row.orders}
                                        </td>
                                        <td className="py-2.5 pr-4 text-right tabular">
                                            {row.units}
                                        </td>
                                        <td className="py-2.5 pr-4 text-right tabular">
                                            {formatPercent(row.share / 100)}
                                        </td>
                                        <td className="py-2.5 text-right tabular">
                                            <Badge
                                                variant="secondary"
                                                className={index === 0 ? 'bg-mint/30' : undefined}
                                            >
                                                {formatPercent(row.margin / 100)}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </section>
    )
}
