import { CalendarRangeIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { formatShortDate } from '@/lib/formatters'

interface DateRangePickerProps {
    /** rango seleccionado en ISO, o null */
    value: { from: string; to: string } | null
    onChange: (value: { from: string; to: string } | null) => void
    /** fecha máxima seleccionable (hoy, por defecto) */
    maxDate?: Date
}

function toIso(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
        date.getDate(),
    ).padStart(2, '0')}`
}

/**
 * Popover con calendario en modo rango. Solo permite rangos hacia atrás
 * desde `maxDate` (los datos mock terminan el 18 ago 2026).
 */
export function DateRangePicker({ value, onChange, maxDate }: DateRangePickerProps) {
    const selected = value
        ? { from: new Date(`${value.from}T00:00:00`), to: new Date(`${value.to}T00:00:00`) }
        : undefined

    const label = value
        ? `${formatShortDate(value.from)} – ${formatShortDate(value.to)}`
        : 'Rango personalizado'

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="justify-start gap-2 rounded-full px-3"
                >
                    <CalendarRangeIcon
                        className="size-4 text-muted-foreground"
                        aria-hidden="true"
                    />
                    <span className="tabular">{label}</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="range"
                    selected={selected}
                    onSelect={(range) => {
                        if (!range?.from || !range.to) {
                            onChange(null)
                            return
                        }
                        onChange({ from: toIso(range.from), to: toIso(range.to) })
                    }}
                    numberOfMonths={2}
                    disabled={{ after: maxDate ?? new Date() }}
                />
            </PopoverContent>
        </Popover>
    )
}
