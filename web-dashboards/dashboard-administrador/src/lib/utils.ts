import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Combina clases de Tailwind resolviendo conflictos; lo usa toda la UI.
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
