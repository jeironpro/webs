// Mapeos de estados del dominio a etiquetas y variantes de Badge.
// Centraliza el estilo de los badges para que todas las vistas compartan
// el mismo vocabulario visual (success / warning / destructive / …).

import type {
    HealthState,
    LogLevel,
    OrderStatus,
    PublishStatus,
    Severity,
    UserStatus,
} from "@/data";

// Variantes de Badge disponibles para estados semánticos.
export type BadgeVariant =
    "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info";

export interface StatusStyle {
    label: string;
    variant: BadgeVariant;
}

export const severityStyles: Record<Severity, StatusStyle> = {
    alta: { label: "Alta", variant: "destructive" },
    media: { label: "Media", variant: "warning" },
    baja: { label: "Baja", variant: "info" },
};

export const userStatusStyles: Record<UserStatus, StatusStyle> = {
    activo: { label: "Activo", variant: "success" },
    suspendido: { label: "Suspendido", variant: "destructive" },
    pendiente: { label: "Pendiente", variant: "warning" },
};

export const publishStatusStyles: Record<PublishStatus, StatusStyle> = {
    activo: { label: "Activo", variant: "success" },
    borrador: { label: "Borrador", variant: "warning" },
    archivado: { label: "Archivado", variant: "secondary" },
};

export const healthStateStyles: Record<HealthState, StatusStyle> = {
    operativo: { label: "Operativo", variant: "success" },
    degradado: { label: "Degradado", variant: "warning" },
    caido: { label: "Caído", variant: "destructive" },
};

export const logLevelStyles: Record<LogLevel, StatusStyle> = {
    info: { label: "Info", variant: "info" },
    warning: { label: "Aviso", variant: "warning" },
    error: { label: "Error", variant: "destructive" },
    critical: { label: "Crítico", variant: "destructive" },
};

export const orderStatusStyles: Record<OrderStatus, StatusStyle> = {
    completado: { label: "Completado", variant: "success" },
    pendiente: { label: "Pendiente", variant: "warning" },
    fallido: { label: "Fallido", variant: "destructive" },
    reembolsado: { label: "Reembolsado", variant: "warning" },
};
