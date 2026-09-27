import {
    CalendarDaysIcon,
    ClockIcon,
    FileDownIcon,
    FilterIcon,
    LanguagesIcon,
    MailIcon,
    MapPinIcon,
    PhoneIcon,
    ShoppingCartIcon,
    SparklesIcon,
    TrendingUpIcon,
} from 'lucide-react'

import type { CSSProperties } from 'react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useAnimatedNumber } from '@/hooks/useAnimatedNumber'
import { useReveal } from '@/hooks/useReveal'
import { formatDate, formatNumber } from '@/lib/formatters'
import profile from '@/data/profile.json'
import type { UserProfile } from '@/types'

const ACTIVITY_ICONS: Record<string, typeof FileDownIcon> = {
    export: FileDownIcon,
    filter: FilterIcon,
    order: ShoppingCartIcon,
    kpi: TrendingUpIcon,
}

const STAT_ACCENTS: Record<string, string> = {
    pedidos: 'var(--color-pear)',
    reportes: 'var(--color-cyan)',
    horas: 'var(--color-coral)',
    satisfaccion: 'var(--color-mint)',
}

function formatRelativeDate(iso: string): string {
    const then = new Date(iso)
    const now = new Date()
    const diffMs = now.getTime() - then.getTime()
    const hours = Math.floor(diffMs / 3_600_000)

    if (hours < 1) return 'hace un momento'
    if (hours < 24) return `hace ${hours} h`
    const days = Math.floor(hours / 24)
    return days === 1 ? 'ayer' : `hace ${days} días`
}

function StatCard({ stat, accent }: { stat: UserProfile['stats'][number]; accent: string }) {
    const value = useAnimatedNumber(stat.value)
    const formatted = stat.format === 'percent' ? `${formatNumber(value)} %` : formatNumber(value)

    return (
        <Card
            style={{ '--card-accent': accent } as CSSProperties}
            className="kpi-card reveal border-0"
        >
            <CardContent className="flex h-full flex-col justify-center gap-1 p-5">
                <p className="kpi-card__value text-2xl sm:text-3xl">{formatted}</p>
                <p className="text-sm font-medium">{stat.label}</p>
            </CardContent>
        </Card>
    )
}

/**
 * Página de perfil de la persona: identidad, contacto, estadísticas
 * animadas (animejs), habilidades, idiomas y actividad reciente.
 * Sigue la macrostructure Stat-Led y el tema Hum del resto de la app.
 */
export function ProfilePage() {
    const data = profile as UserProfile
    useReveal([data.name])

    return (
        <div className="mx-auto w-full max-w-(--shell) px-4 py-10 sm:px-6 lg:px-8">
            {/* Cabecera del perfil */}
            <section aria-label="Perfil" className="reveal">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                    <Avatar size="lg" className="size-20 sm:size-24">
                        <AvatarFallback className="bg-cyan text-xl font-semibold text-background sm:text-2xl">
                            {data.initials}
                        </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                                {data.name.split(' ')[0]}{' '}
                                <span className="hl">
                                    {data.name.split(' ').slice(1).join(' ')}
                                </span>
                            </h1>
                        </div>
                        <p className="mt-1 text-base font-medium text-muted-foreground">
                            {data.role} · {data.company}
                        </p>
                        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                            {data.bio}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                            <Badge variant="outline" className="gap-1.5 rounded-full py-1">
                                <MailIcon className="size-3.5" aria-hidden="true" />
                                {data.email}
                            </Badge>
                            <Badge variant="outline" className="gap-1.5 rounded-full py-1">
                                <PhoneIcon className="size-3.5" aria-hidden="true" />
                                {data.phone}
                            </Badge>
                            <Badge variant="outline" className="gap-1.5 rounded-full py-1">
                                <MapPinIcon className="size-3.5" aria-hidden="true" />
                                {data.location}
                            </Badge>
                        </div>
                    </div>
                </div>
            </section>

            {/* Estadísticas animadas */}
            <section
                aria-label="Estadísticas del perfil"
                className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
                {data.stats.map((stat) => (
                    <StatCard
                        key={stat.id}
                        stat={stat}
                        accent={STAT_ACCENTS[stat.id] ?? 'var(--color-pear)'}
                    />
                ))}
            </section>

            {/* Detalles + habilidades */}
            <div className="mt-8 grid gap-4 lg:grid-cols-2">
                <Card className="reveal border-0">
                    <CardContent className="p-5">
                        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                            <SparklesIcon className="size-4" aria-hidden="true" />
                            En la empresa
                        </h2>
                        <Separator className="my-4" />
                        <dl className="space-y-3 text-sm">
                            <div className="flex items-center justify-between gap-4">
                                <dt className="flex items-center gap-2 text-muted-foreground">
                                    <CalendarDaysIcon className="size-4" aria-hidden="true" />
                                    Ingreso
                                </dt>
                                <dd className="font-medium tabular">{formatDate(data.joined)}</dd>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <dt className="flex items-center gap-2 text-muted-foreground">
                                    <SparklesIcon className="size-4" aria-hidden="true" />
                                    Equipo
                                </dt>
                                <dd className="font-medium">{data.team}</dd>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <dt className="flex items-center gap-2 text-muted-foreground">
                                    <ClockIcon className="size-4" aria-hidden="true" />
                                    Zona horaria
                                </dt>
                                <dd className="font-medium tabular">{data.timezone}</dd>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <dt className="flex items-center gap-2 text-muted-foreground">
                                    <LanguagesIcon className="size-4" aria-hidden="true" />
                                    Idiomas
                                </dt>
                                <dd className="font-medium">{data.languages.join(' · ')}</dd>
                            </div>
                        </dl>
                    </CardContent>
                </Card>

                <Card className="reveal border-0">
                    <CardContent className="p-5">
                        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                            <TrendingUpIcon className="size-4" aria-hidden="true" />
                            Habilidades
                        </h2>
                        <Separator className="my-4" />
                        <div className="flex flex-wrap gap-2">
                            {data.skills.map((skill) => (
                                <Badge
                                    key={skill}
                                    className="rounded-full bg-mint/30 px-3 py-1 text-foreground"
                                >
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                        <p className="mt-5 text-xs text-muted-foreground">
                            Herramientas y metodologías que uso a diario para mantener el dashboard
                            al día.
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Actividad reciente */}
            <Card className="reveal mt-4 border-0">
                <CardContent className="p-5">
                    <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                        <ClockIcon className="size-4" aria-hidden="true" />
                        Actividad reciente
                    </h2>
                    <Separator className="my-4" />
                    <ul className="space-y-1">
                        {data.activity.map((item) => {
                            const Icon = ACTIVITY_ICONS[item.type] ?? SparklesIcon
                            return (
                                <li
                                    key={item.id}
                                    className="flex items-center gap-3 rounded-2xl px-2 py-2.5 transition-colors hover:bg-muted/60"
                                >
                                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-cyan/15 text-foreground">
                                        <Icon className="size-4" aria-hidden="true" />
                                    </span>
                                    <p className="min-w-0 flex-1 truncate text-sm font-medium">
                                        {item.title}
                                    </p>
                                    <p className="shrink-0 text-xs text-muted-foreground tabular">
                                        {formatRelativeDate(item.date)}
                                    </p>
                                </li>
                            )
                        })}
                    </ul>
                </CardContent>
            </Card>
        </div>
    )
}
