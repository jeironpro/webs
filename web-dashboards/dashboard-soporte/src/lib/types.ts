/**
 * Definiciones de tipos para el dominio de soporte.
 * Incluye tipos para tickets, agentes, clientes y conversaciones.
 */
export type TicketEstado = 'abierto' | 'en_progreso' | 'cerrado'
export type Prioridad = 'baja' | 'media' | 'alta' | 'critica'
export type Categoria = 'acceso' | 'bug' | 'consulta' | 'facturacion' | 'mejora'
export type Canal = 'chat' | 'email' | 'telefono' | 'web'
export type AutorTipo = 'agente' | 'cliente' | 'sistema'
export type MensajeTipo = 'cambio_estado' | 'mensaje' | 'nota_interna' | 'respuesta'

export interface Agente {
    id: string
    nombre: string
    email: string
    rol: string
    especialidad: string
    tickets_resueltos: number
    satisfaccion_promedio: number
    disponible: boolean
}

export interface Cliente {
    id: string
    nombre: string
    empresa: string
    email: string
    plan: 'Básico' | 'Pro' | 'Empresa'
    ciudad: string
}

export interface Ticket {
    id: string
    titulo: string
    descripcion: string
    estado: TicketEstado
    prioridad: Prioridad
    categoria: Categoria
    canal: Canal
    cliente_id: string
    agente_id: string | null
    creado_el: string
    primera_respuesta_el: string | null
    cerrado_el: string | null
    satisfaccion: number | null
}

export interface Conversacion {
    id: string
    ticket_id: string
    autor_tipo: AutorTipo
    autor_id: string | null
    tipo: MensajeTipo
    contenido: string
    creado_el: string
}
