import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Bell, CheckCheck, ChevronRight } from "lucide-react";

import { data } from "@/data";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/ui/status-badge";
import { timeAgo } from "@/lib/format";
import { severityStyles } from "@/lib/status";
import { cn } from "@/lib/utils";

// Panel de notificaciones: muestra las alertas abiertas y permite marcarlas
// como leídas. El estado de lectura es local (demo sin backend).
export function NotificationsPanel() {
    const [open, setOpen] = useState(false);
    const [readIds, setReadIds] = useState<Set<string>>(new Set());
    const navigate = useNavigate();

    const unreadCount = data.alerts.length - readIds.size;

    function markRead(id: string) {
        setReadIds((current) => new Set(current).add(id));
    }

    function markAllRead() {
        setReadIds(new Set(data.alerts.map((alert) => alert.id)));
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                    aria-label={`Notificaciones${unreadCount > 0 ? ` (${unreadCount} sin leer)` : ""}`}
                >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-none text-primary-foreground tabular">
                            {unreadCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[min(92vw,22rem)] p-0">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="leading-tight">
                        <p className="text-sm font-semibold">Notificaciones</p>
                        <p className="mono-label text-[10px] text-muted-foreground">
                            {unreadCount} sin leer
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={markAllRead}
                        disabled={unreadCount === 0}
                        className="h-8 px-2"
                    >
                        <CheckCheck className="h-4 w-4" aria-hidden="true" />
                        Leer todas
                    </Button>
                </div>
                <Separator />
                <ul
                    className="max-h-80 overflow-y-auto p-2"
                    aria-label="Lista de notificaciones"
                >
                    {data.alerts.length === 0 ? (
                        <li className="px-3 py-8 text-center text-sm text-muted-foreground">
                            No hay notificaciones.
                        </li>
                    ) : (
                        data.alerts.map((alert) => {
                            const read = readIds.has(alert.id);
                            return (
                                <li key={alert.id}>
                                    <button
                                        type="button"
                                        onClick={() => markRead(alert.id)}
                                        className={cn(
                                            "flex w-full gap-3 rounded-md p-3 text-left transition-colors hover:bg-muted",
                                            !read && "bg-accent/40",
                                        )}
                                    >
                                        <AlertTriangle
                                            className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
                                            aria-hidden="true"
                                        />
                                        <span className="min-w-0 flex-1">
                                            <span className="flex items-center justify-between gap-2">
                                                <span className="truncate text-sm font-medium">
                                                    {alert.title}
                                                </span>
                                                <StatusBadge
                                                    {...severityStyles[alert.severity]}
                                                    className="shrink-0"
                                                />
                                            </span>
                                            <span className="mt-0.5 line-clamp-2 block text-xs text-muted-foreground">
                                                {alert.description}
                                            </span>
                                            <span className="mono-label mt-1 block text-[10px] text-muted-foreground">
                                                {timeAgo(alert.createdAt)}
                                            </span>
                                        </span>
                                        {!read && (
                                            <span
                                                className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary"
                                                aria-hidden="true"
                                            />
                                        )}
                                    </button>
                                </li>
                            );
                        })
                    )}
                </ul>
                <Separator />
                <div className="p-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-between"
                        onClick={() => {
                            setOpen(false);
                            navigate("/");
                        }}
                    >
                        Ver todas las alertas
                        <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
