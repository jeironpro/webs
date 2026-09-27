import {
    AlertTriangle,
    ArrowUpRight,
    Banknote,
    Percent,
    ShoppingCart,
    Users,
    type LucideIcon,
} from "lucide-react";

import { data } from "@/data";
import type { User } from "@/data";
import { useCountUp } from "@/hooks/use-count-up";
import { useReveal } from "@/hooks/use-reveal";
import { ActivityChart } from "@/components/charts/ActivityChart";
import { Sparkline } from "@/components/charts/Sparkline";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency, formatNumber, initials, timeAgo } from "@/lib/format";
import { orderStatusStyles, severityStyles } from "@/lib/status";

function StatCard({
    label,
    value,
    format,
    icon: Icon,
    sparkline,
    footnote,
}: {
    label: string;
    value: number;
    format: (value: number) => string;
    icon: LucideIcon;
    sparkline: number[];
    footnote: string;
}) {
    const count = useCountUp(value, 900);

    return (
        <Card className="surface-hairline rounded-lg">
            <CardContent className="p-5">
                <div className="flex items-start justify-between">
                    <p className="mono-label text-muted-foreground">{label}</p>
                    <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                </div>
                <p className="tabular mt-2 text-2xl font-semibold tracking-tight">
                    {format(count)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{footnote}</p>
                <Sparkline values={sparkline} className="mt-3" />
            </CardContent>
        </Card>
    );
}

function AlertsPanel() {
    return (
        <Card className="surface-hairline rounded-lg">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Alertas pendientes</CardTitle>
                    <Badge variant="outline" className="mono-label">
                        {data.alerts.length}
                    </Badge>
                </div>
                <CardDescription>Requieren tu atención</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {data.alerts.slice(0, 5).map((alert) => (
                    <div key={alert.id} className="flex gap-3 rounded-md border p-3">
                        <AlertTriangle
                            className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
                            aria-hidden="true"
                        />
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                                <p className="truncate text-sm font-medium">
                                    {alert.title}
                                </p>
                                <StatusBadge
                                    {...severityStyles[alert.severity]}
                                    className="shrink-0"
                                />
                            </div>
                            <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                                {alert.description}
                            </p>
                            <p className="mono-label mt-1 text-[10px] text-muted-foreground">
                                {alert.id} · {timeAgo(alert.createdAt)}
                            </p>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

function RecentUsers() {
    const users = [...data.users]
        .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
        .slice(0, 5);

    return (
        <Card className="surface-hairline rounded-lg">
            <CardHeader className="pb-3">
                <CardTitle className="text-base">Usuarios recientes</CardTitle>
                <CardDescription>Últimos registros</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                {users.map((user: User) => (
                    <div key={user.id} className="flex items-center gap-3 rounded-md p-2">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-accent text-xs text-accent-foreground">
                                {initials(user.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1 leading-tight">
                            <p className="truncate text-sm font-medium">{user.name}</p>
                            <p className="truncate text-xs text-muted-foreground">
                                {user.email}
                            </p>
                        </div>
                        <span className="mono-label shrink-0 text-[10px] text-muted-foreground">
                            {timeAgo(user.createdAt)}
                        </span>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

function RecentOrders() {
    return (
        <Card className="surface-hairline rounded-lg">
            <CardHeader className="pb-3">
                <CardTitle className="text-base">Últimos pedidos</CardTitle>
                <CardDescription>Transacciones recientes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                {data.orders.slice(0, 6).map((order) => (
                    <div
                        key={order.id}
                        className="flex items-center gap-3 rounded-md p-2"
                    >
                        <div className="min-w-0 flex-1 leading-tight">
                            <p className="truncate text-sm font-medium">
                                {order.customer}
                            </p>
                            <p className="mono-label text-[10px] text-muted-foreground">
                                {order.id} · {timeAgo(order.date)}
                            </p>
                        </div>
                        <span className="tabular shrink-0 text-sm font-medium">
                            {formatCurrency(order.amount)}
                        </span>
                        <StatusBadge
                            {...orderStatusStyles[order.status]}
                            className="shrink-0"
                        />
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

export function Overview() {
    const reveal = useReveal<HTMLDivElement>(80);
    const { overview, activity } = data;
    const revenue = activity.map((point) => point.revenue);
    const sessions = activity.map((point) => point.sessions);
    const users = activity.map((point) => point.users);

    return (
        <div className="space-y-6">
            <header className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h2 className="text-xl font-semibold">Resumen general</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Estado de la plataforma a{" "}
                        {new Date(data.meta.generatedAt).toLocaleString("es-ES")}.
                    </p>
                </div>
                <p className="mono-label text-muted-foreground">últimos 30 días</p>
            </header>

            <div
                ref={reveal}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
            >
                <StatCard
                    label="Usuarios"
                    value={overview.totalUsers}
                    format={formatNumber}
                    icon={Users}
                    sparkline={users}
                    footnote={`hoy +${overview.newToday} · semana +${overview.newWeek}`}
                />
                <StatCard
                    label="Pedidos"
                    value={overview.totalOrders}
                    format={formatNumber}
                    icon={ShoppingCart}
                    sparkline={activity.map((point) => point.orders)}
                    footnote={`hoy +${formatNumber(activity[activity.length - 1]?.orders ?? 0)} pedidos`}
                />
                <StatCard
                    label="Ingresos"
                    value={overview.totalRevenue}
                    format={formatCurrency}
                    icon={Banknote}
                    sparkline={revenue}
                    footnote="acumulado del periodo"
                />
                <StatCard
                    label="Conversión"
                    value={overview.conversionRate}
                    format={(value) => `${value.toFixed(1)} %`}
                    icon={Percent}
                    sparkline={sessions.map(
                        (v, i) => v / Math.max(activity[i]?.orders ?? 1, 1),
                    )}
                    footnote={`${formatNumber(overview.openAlerts)} alertas abiertas`}
                />
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <Card className="surface-hairline rounded-lg xl:col-span-2">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-base">
                                    Actividad reciente
                                </CardTitle>
                                <CardDescription>Pedidos por día</CardDescription>
                            </div>
                            <span className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span
                                    className="inline-block h-2 w-2 rounded-sm bg-accent"
                                    aria-hidden="true"
                                />
                                hoy
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ActivityChart
                            data={activity.map((point) => ({
                                label: point.date,
                                value: point.orders,
                            }))}
                        />
                    </CardContent>
                </Card>

                <AlertsPanel />
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <RecentOrders />
                <RecentUsers />
            </div>

            <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                Datos simulados del entorno {data.meta.environment} · v{data.meta.version}
            </div>
        </div>
    );
}

export default Overview;
