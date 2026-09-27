/**
 * Badges para estado, prioridad y categoría de tickets.
 * Incluye constantes de etiquetas y componentes de badge con estilos específicos.
 */
import type { Canal, Categoria, Prioridad, TicketEstado } from '@/lib/types'
import { Badge } from '@/components/ui/badge'

export const ETIQUETAS_ESTADO: Record<TicketEstado, string> = {
    abierto: 'Abierto',
    en_progreso: 'En progreso',
    cerrado: 'Cerrado',
}

export const ETIQUETAS_CATEGORIA: Record<Categoria, string> = {
    acceso: 'Acceso',
    bug: 'Bug',
    consulta: 'Consulta',
    facturacion: 'Facturación',
    mejora: 'Mejora',
}

export const ETIQUETAS_CANAL: Record<Canal, string> = {
    chat: 'Chat',
    email: 'Email',
    telefono: 'Teléfono',
    web: 'Formulario web',
}

export const ETIQUETAS_PRIORIDAD: Record<Prioridad, string> = {
    baja: 'Baja',
    media: 'Media',
    alta: 'Alta',
    critica: 'Crítica',
}

const PUNTO_ESTADO: Record<TicketEstado, string> = {
    abierto: 'bg-warning',
    en_progreso: 'bg-brand',
    cerrado: 'bg-success',
}

const COLORES_PRIORIDAD: Record<Prioridad, string> = {
    baja: 'border-border bg-muted text-ink-2',
    media: 'border-[color-mix(in_oklch,var(--warning)_35%,transparent)] bg-[color-mix(in_oklch,var(--warning)_15%,transparent)] text-ink-1',
    alta: 'border-[color-mix(in_oklch,var(--warning)_55%,transparent)] bg-[color-mix(in_oklch,var(--warning)_25%,transparent)] text-ink-0',
    critica:
        'border-[color-mix(in_oklch,var(--critical)_45%,transparent)] bg-[color-mix(in_oklch,var(--critical)_15%,transparent)] text-ink-0',
}

export function StatusBadge({ estado }: { estado: TicketEstado }) {
    return (
        <Badge
            variant="outline"
            className="h-6 gap-1.5 rounded-full px-2.5 font-mono text-[10px] tracking-[0.12em] uppercase"
        >
            <span aria-hidden="true" className={`size-1.5 rounded-full ${PUNTO_ESTADO[estado]}`} />
            {ETIQUETAS_ESTADO[estado]}
        </Badge>
    )
}

export function PriorityBadge({ prioridad }: { prioridad: Prioridad }) {
    return (
        <Badge
            variant="outline"
            className={`h-6 rounded-full px-2.5 font-mono text-[10px] tracking-[0.12em] uppercase ${COLORES_PRIORIDAD[prioridad]}`}
        >
            {ETIQUETAS_PRIORIDAD[prioridad]}
        </Badge>
    )
}
