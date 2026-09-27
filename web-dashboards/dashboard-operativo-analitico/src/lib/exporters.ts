import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

import type { DailySale } from '@/types'
import { CATEGORY_MARGIN_RATES } from './aggregations'

/** Fila de un reporte por categoría (agregada desde ventas diarias). */
export interface CategoryReportRow {
    categoryId: string
    category: string
    revenue: number
    orders: number
    units: number
    /** % de los ingresos del periodo */
    share: number
    /** margen bruto estimado en % */
    margin: number
}

export interface CategoryReport {
    rows: CategoryReportRow[]
    totals: { revenue: number; orders: number; units: number }
}

/**
 * Agrega ventas diarias filtradas por categoría y calcula participación
 * y margen bruto estimado. `categories` es el catálogo id → nombre.
 */
export function buildCategoryReport(
    records: DailySale[],
    categories: Array<{ id: string; name: string }>,
): CategoryReport {
    const byCategory = new Map<string, { revenue: number; orders: number; units: number }>()

    for (const record of records) {
        const bucket = byCategory.get(record.c) ?? { revenue: 0, orders: 0, units: 0 }
        bucket.revenue += record.rev
        bucket.orders += record.ord
        bucket.units += record.uni
        byCategory.set(record.c, bucket)
    }

    const totalRevenue = [...byCategory.values()].reduce((sum, b) => sum + b.revenue, 0)
    const totalOrders = [...byCategory.values()].reduce((sum, b) => sum + b.orders, 0)
    const totalUnits = [...byCategory.values()].reduce((sum, b) => sum + b.units, 0)

    const rows: CategoryReportRow[] = [...byCategory.entries()]
        .map(([categoryId, bucket]) => ({
            categoryId,
            category: categories.find((category) => category.id === categoryId)?.name ?? categoryId,
            revenue: bucket.revenue,
            orders: bucket.orders,
            units: bucket.units,
            share: totalRevenue > 0 ? (bucket.revenue / totalRevenue) * 100 : 0,
            margin:
                bucket.revenue > 0
                    ? ((CATEGORY_MARGIN_RATES[categoryId] ?? 0.3) * bucket.revenue * 100) /
                      bucket.revenue
                    : 0,
        }))
        .sort((a, b) => b.revenue - a.revenue)

    return { rows, totals: { revenue: totalRevenue, orders: totalOrders, units: totalUnits } }
}

/** Escape de un valor para CSV (RFC 4180). */
export function csvEscape(value: string | number): string {
    const text = String(value)
    return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

/** Serializa filas a CSV con BOM UTF-8 (compatible con Excel en español). */
export function toCsv(headers: string[], rows: Array<Array<string | number>>): string {
    const lines = [headers, ...rows].map((row) => row.map(csvEscape).join(','))
    return `\uFEFF${lines.join('\r\n')}\r\n`
}

/** Dispara la descarga de un archivo en el navegador. */
export function downloadBlob(filename: string, blob: Blob): void {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
}

/** Exporta filas a CSV descargable. */
export function exportCsv(
    filename: string,
    headers: string[],
    rows: Array<Array<string | number>>,
): void {
    const csv = toCsv(headers, rows)
    downloadBlob(filename, new Blob([csv], { type: 'text/csv;charset=utf-8' }))
}

/** Exporta filas a Excel (.xlsx) con una sola hoja. */
export function exportExcel(
    filename: string,
    sheetName: string,
    headers: string[],
    rows: Array<Array<string | number>>,
): void {
    const sheet = XLSX.utils.aoa_to_sheet([headers, ...rows])
    const book = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(book, sheet, sheetName.slice(0, 31))
    XLSX.writeFile(book, filename, { compression: true })
}

/** Colores del tema Hum aplicados al PDF. */
const PDF_COLORS: Record<string, [number, number, number]> = {
    ink: [38, 34, 30],
    muted: [108, 99, 90],
    cream: [252, 248, 239],
    pear: [157, 196, 84],
    coral: [240, 100, 76],
}

/**
 * Exporta un reporte por categoría a PDF con la marca del dashboard.
 * Usa jspdf + jspdf-autotable con la paleta Hum.
 */
export function exportCategoryPdf(
    filename: string,
    report: CategoryReport,
    periodLabel: string,
): void {
    const doc = new jsPDF()
    const marginX = 14

    doc.setFillColor(...PDF_COLORS.ink)
    doc.rect(0, 0, 210, 22, 'F')
    doc.setFillColor(...PDF_COLORS.pear)
    doc.rect(0, 22, 210, 2, 'F')

    doc.setTextColor(...PDF_COLORS.cream)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(13)
    doc.text('Pulso · Dashboard operativo', marginX, 12)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text('Reporte de ventas por categoría', marginX, 18)
    doc.text(periodLabel, 196, 18, { align: 'right' })

    autoTable(doc, {
        startY: 30,
        head: [['Categoría', 'Ingresos (MXN)', 'Pedidos', 'Unidades', 'Participación', 'Margen']],
        body: report.rows.map((row) => [
            row.category,
            row.revenue.toLocaleString('es-MX', { maximumFractionDigits: 0 }),
            row.orders.toLocaleString('es-MX'),
            row.units.toLocaleString('es-MX'),
            `${row.share.toLocaleString('es-MX', { maximumFractionDigits: 1 })} %`,
            `${row.margin.toLocaleString('es-MX', { maximumFractionDigits: 1 })} %`,
        ]),
        foot: [
            [
                'Total',
                report.totals.revenue.toLocaleString('es-MX', { maximumFractionDigits: 0 }),
                report.totals.orders.toLocaleString('es-MX'),
                report.totals.units.toLocaleString('es-MX'),
                '100 %',
                '—',
            ],
        ],
        theme: 'grid',
        styles: {
            font: 'helvetica',
            fontSize: 9,
            textColor: PDF_COLORS.ink,
            cellPadding: 3,
        },
        headStyles: {
            fillColor: PDF_COLORS.pear,
            textColor: PDF_COLORS.ink,
            fontStyle: 'bold',
        },
        footStyles: {
            fillColor: PDF_COLORS.cream,
            textColor: PDF_COLORS.ink,
            fontStyle: 'bold',
        },
        alternateRowStyles: { fillColor: PDF_COLORS.cream },
    })

    const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY
    doc.setTextColor(...PDF_COLORS.muted)
    doc.setFontSize(8)
    doc.text('Datos de demostración · Generado por Pulso', marginX, Math.min(finalY + 10, 290))

    doc.save(filename)
}
