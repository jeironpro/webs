/**
 * Tooltip personalizado para gráficos de Recharts.
 * Muestra el nombre del serie, valor y color en formato consistente.
 */
interface ItemTooltip {
    name?: string
    value?: number | string
    color?: string
}

interface ChartTooltipProps {
    active?: boolean
    label?: string
    payload?: ItemTooltip[]
}

export function ChartTooltip({ active, label, payload }: ChartTooltipProps) {
    if (!active || !payload || payload.length === 0) return null

    return (
        <div className="rounded-[var(--radius-md)] border border-border bg-background/90 px-3 py-2 text-sm backdrop-blur">
            {label && <p className="mb-1 font-medium text-foreground">{label}</p>}
            <ul className="flex flex-col gap-1">
                {payload.map((item, indice) => (
                    <li
                        key={indice}
                        className="flex items-center justify-between gap-4 text-muted-foreground"
                    >
                        <span className="flex items-center gap-1.5">
                            <span
                                aria-hidden="true"
                                className="size-2 rounded-full"
                                style={{ backgroundColor: item.color }}
                            />
                            {item.name}
                        </span>
                        <span className="font-medium tabular-nums text-foreground">
                            {item.value}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    )
}
