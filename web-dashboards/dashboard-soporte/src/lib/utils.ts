/**
 * Utilidades para fusionar clases de Tailwind CSS.
 * Combina clsx para condicionales con tailwind-merge para deduplicación.
 */
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
