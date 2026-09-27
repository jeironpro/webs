// Etiqueta de estado compartida: aplica la variante semántica y el estilo
// mono-label que usan todas las vistas (usuarios, contenido, salud, …).

import { Badge } from "@/components/ui/badge";
import type { BadgeVariant } from "@/lib/status";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
    label: string;
    variant: BadgeVariant;
    className?: string;
}

export function StatusBadge({ label, variant, className }: StatusBadgeProps) {
    return (
        <Badge variant={variant} className={cn("mono-label text-[10px]", className)}>
            {label}
        </Badge>
    );
}
