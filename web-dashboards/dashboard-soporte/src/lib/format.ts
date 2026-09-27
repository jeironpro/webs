/**
 * Utilidades de formateo de fechas y números.
 * Usa Intl.DateTimeFormat para localización en español (Argentina).
 */
const ZONA_HORARIA = 'America/Argentina/Buenos_Aires'

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

function descomponerFecha(iso: string): Record<string, string> {
    const partes = new Intl.DateTimeFormat('es-AR', {
        timeZone: ZONA_HORARIA,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
    }).formatToParts(new Date(iso))

    const resultado: Record<string, string> = {}
    for (const parte of partes) {
        if (parte.type !== 'literal') resultado[parte.type] = parte.value
    }
    return resultado
}

export function formatearDuracionHoras(horas: number | null): string {
    if (horas === null) return '—'

    if (horas < 1) {
        const minutos = Math.round(horas * 60)
        return `${minutos} min`
    }

    const horasEnteras = Math.floor(horas)
    const minutos = Math.round((horas - horasEnteras) * 60)
    return minutos === 0 ? `${horasEnteras} h` : `${horasEnteras} h ${minutos} min`
}

export function formatearFecha(iso: string | null): string {
    if (!iso) return '—'
    const partes = descomponerFecha(iso)
    return `${partes.day} ${MESES[Number(partes.month) - 1]} ${partes.year}`
}

export function formatearFechaHora(iso: string | null): string {
    if (!iso) return '—'
    const partes = descomponerFecha(iso)
    const hora = partes.hour
    return `${formatearFecha(iso)}, ${hora}:${partes.minute}`
}

export function formatearIniciales(nombre: string): string {
    return nombre
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((parte) => parte[0])
        .join('')
        .toUpperCase()
}
