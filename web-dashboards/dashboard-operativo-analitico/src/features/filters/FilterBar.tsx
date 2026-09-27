import { EraserIcon, MapPinIcon, ShapesIcon, StoreIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { activeFilterCount } from '@/lib/filters'
import { useDashboardStore } from '@/store/useDashboardStore'

import { DateRangePicker } from './DateRangePicker'

interface DatePreset {
    id: string
    label: string
    from: string | null
    to: string | null
}

/** Presets de rango de fechas relativos a hoy (los datos terminan el 18 ago 2026). */
function buildPresets(): DatePreset[] {
    const today = new Date()
    const toIso = (date: Date) =>
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
            date.getDate(),
        ).padStart(2, '0')}`

    const addDays = (days: number) => {
        const date = new Date(today)
        date.setDate(date.getDate() + days)
        return date
    }

    return [
        { id: '7d', label: 'Últimos 7 días', from: toIso(addDays(-6)), to: toIso(today) },
        { id: '30d', label: 'Últimos 30 días', from: toIso(addDays(-29)), to: toIso(today) },
        { id: '90d', label: 'Últimos 90 días', from: toIso(addDays(-89)), to: toIso(today) },
        { id: 'ytd', label: 'Este año', from: `${today.getFullYear()}-01-01`, to: toIso(today) },
        { id: 'all', label: 'Todo el periodo', from: null, to: null },
    ]
}

interface FilterSelectProps {
    label: string
    value: string
    placeholder: string
    options: Array<{ id: string; name: string }>
    onChange: (value: string) => void
    icon: typeof ShapesIcon
}

function FilterSelect({
    label,
    value,
    placeholder,
    options,
    onChange,
    icon: Icon,
}: FilterSelectProps) {
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="h-9 w-full rounded-full sm:w-auto" aria-label={label}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">{placeholder}</SelectItem>
                {options.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                        <span className="inline-flex items-center gap-2">
                            <Icon className="size-3.5 text-muted-foreground" aria-hidden="true" />
                            {option.name}
                        </span>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

/**
 * Barra de filtros del dashboard: rango de fechas (presets + calendario),
 * categoría, región y canal. Todos los consumidores (KPIs, gráficos y
 * reportes) se actualizan al cambiar cualquier filtro.
 */
export function FilterBar() {
    const status = useDashboardStore((state) => state.status)
    const data = useDashboardStore((state) => state.data)
    const filters = useDashboardStore((state) => state.filters)
    const setFilters = useDashboardStore((state) => state.setFilters)
    const resetFilters = useDashboardStore((state) => state.resetFilters)

    if (status !== 'ready' || !data) return null

    const presets = buildPresets()
    const selectedPreset =
        presets.find(
            (preset) =>
                preset.from !== null &&
                filters.dateRange !== null &&
                preset.from === filters.dateRange.from &&
                preset.to === filters.dateRange.to,
        )?.id ?? (filters.dateRange !== null ? 'custom' : 'all')

    const activeCount = activeFilterCount(filters)

    return (
        <div className="reveal">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="mono-label">Filtros</p>
                {activeCount > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetFilters}
                        className="gap-1.5 rounded-full text-xs"
                    >
                        <EraserIcon className="size-3.5" aria-hidden="true" />
                        Limpiar ({activeCount})
                    </Button>
                )}
            </div>

            <div className="mt-3 flex flex-col gap-2 lg:flex-row lg:flex-wrap lg:items-center">
                <Select
                    value={selectedPreset}
                    onValueChange={(value) => {
                        if (value === 'all' || value === 'custom') {
                            setFilters({ dateRange: null })
                            return
                        }
                        const preset = presets.find((item) => item.id === value)
                        if (preset?.from && preset.to)
                            setFilters({ dateRange: { from: preset.from, to: preset.to } })
                    }}
                >
                    <SelectTrigger
                        className="h-9 w-full rounded-full sm:w-auto"
                        aria-label="Rango de fechas"
                    >
                        <SelectValue placeholder="Rango de fechas" />
                    </SelectTrigger>
                    <SelectContent>
                        {presets.map((preset) => (
                            <SelectItem key={preset.id} value={preset.id}>
                                {preset.label}
                            </SelectItem>
                        ))}
                        {selectedPreset === 'custom' && (
                            <SelectItem value="custom">Rango personalizado</SelectItem>
                        )}
                    </SelectContent>
                </Select>

                <DateRangePicker
                    value={filters.dateRange}
                    onChange={(dateRange) => setFilters({ dateRange })}
                />

                <FilterSelect
                    label="Categoría"
                    value={filters.category ?? 'all'}
                    placeholder="Todas las categorías"
                    options={data.categories}
                    icon={ShapesIcon}
                    onChange={(category) =>
                        setFilters({ category: category === 'all' ? null : category })
                    }
                />
                <FilterSelect
                    label="Región"
                    value={filters.region ?? 'all'}
                    placeholder="Todas las regiones"
                    options={data.regions}
                    icon={MapPinIcon}
                    onChange={(region) => setFilters({ region: region === 'all' ? null : region })}
                />
                <FilterSelect
                    label="Canal"
                    value={filters.channel ?? 'all'}
                    placeholder="Todos los canales"
                    options={data.channels}
                    icon={StoreIcon}
                    onChange={(channel) =>
                        setFilters({ channel: channel === 'all' ? null : channel })
                    }
                />
            </div>
        </div>
    )
}
