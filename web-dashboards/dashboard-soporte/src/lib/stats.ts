/**
 * Funciones de agregación y estadísticas de tickets.
 * Calcula métricas como tiempos de respuesta, satisfacción y distribuciones.
 */
import type { Categoria, Prioridad, Ticket } from './types'

export interface ConteoPorEstado {
    abierto: number
    en_progreso: number
    cerrado: number
}

export interface SerieDia {
    fecha: string
    abierto: number
    en_progreso: number
    cerrado: number
    total: number
}

const MILISEGUNDOS_HORA = 3_600_000

function horasEntre(inicio: string, fin: string): number {
    return (new Date(fin).getTime() - new Date(inicio).getTime()) / MILISEGUNDOS_HORA
}

export function aYyyyMmDd(fecha: Date): string {
    const anio = fecha.getFullYear()
    const mes = String(fecha.getMonth() + 1).padStart(2, '0')
    const dia = String(fecha.getDate()).padStart(2, '0')
    return `${anio}-${mes}-${dia}`
}

export function getConteoPorEstado(tickets: Ticket[]): ConteoPorEstado {
    const conteo: ConteoPorEstado = { abierto: 0, en_progreso: 0, cerrado: 0 }
    for (const ticket of tickets) {
        conteo[ticket.estado] += 1
    }
    return conteo
}

export function getTiempoRespuestaPromedioHoras(tickets: Ticket[]): number | null {
    const tiempos = tickets
        .filter((ticket) => ticket.primera_respuesta_el !== null)
        .map((ticket) => horasEntre(ticket.creado_el, ticket.primera_respuesta_el as string))

    if (tiempos.length === 0) return null
    const promedio = tiempos.reduce((suma, tiempo) => suma + tiempo, 0) / tiempos.length
    return Math.round(promedio * 100) / 100
}

export function getTiempoResolucionPromedioHoras(tickets: Ticket[]): number | null {
    const tiempos = tickets
        .filter((ticket) => ticket.cerrado_el !== null)
        .map((ticket) => horasEntre(ticket.creado_el, ticket.cerrado_el as string))

    if (tiempos.length === 0) return null
    const promedio = tiempos.reduce((suma, tiempo) => suma + tiempo, 0) / tiempos.length
    return Math.round(promedio * 100) / 100
}

export function getSatisfaccionPromedio(tickets: Ticket[]): number | null {
    const puntajes = tickets
        .filter((ticket) => ticket.satisfaccion !== null)
        .map((ticket) => ticket.satisfaccion as number)

    if (puntajes.length === 0) return null
    const promedio = puntajes.reduce((suma, puntaje) => suma + puntaje, 0) / puntajes.length
    return Math.round(promedio * 10) / 10
}

export function getDistribucionPorPrioridad(tickets: Ticket[]): Record<Prioridad, number> {
    const distribucion = { baja: 0, media: 0, alta: 0, critica: 0 }
    for (const ticket of tickets) {
        distribucion[ticket.prioridad] += 1
    }
    return distribucion
}

export function getDistribucionPorCategoria(tickets: Ticket[]): Record<Categoria, number> {
    const distribucion = { acceso: 0, bug: 0, consulta: 0, facturacion: 0, mejora: 0 }
    for (const ticket of tickets) {
        distribucion[ticket.categoria] += 1
    }
    return distribucion
}

export function getTicketsPorDia(
    tickets: Ticket[],
    dias = 30,
    referencia = new Date(),
): SerieDia[] {
    const serie: SerieDia[] = []
    const porDia = new Map<string, SerieDia>()

    for (let offset = dias - 1; offset >= 0; offset -= 1) {
        const fecha = new Date(referencia)
        fecha.setHours(0, 0, 0, 0)
        fecha.setDate(referencia.getDate() - offset)
        const clave = aYyyyMmDd(fecha)
        serie.push({ fecha: clave, abierto: 0, en_progreso: 0, cerrado: 0, total: 0 })
        porDia.set(clave, serie[serie.length - 1])
    }

    for (const ticket of tickets) {
        const dia = porDia.get(aYyyyMmDd(new Date(ticket.creado_el)))
        if (!dia) continue
        dia[ticket.estado] += 1
        dia.total += 1
    }

    return serie
}

export function getTicketsRecientes(tickets: Ticket[], limite = 5): Ticket[] {
    return [...tickets]
        .sort((a, b) => new Date(b.creado_el).getTime() - new Date(a.creado_el).getTime())
        .slice(0, limite)
}
