import { useMemo, useState } from "react";
import { AlertOctagon, KeyRound, ScrollText, Search, ShieldAlert } from "lucide-react";

import { data } from "@/data";
import type { LogLevel } from "@/data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDateTime, initials, timeAgo } from "@/lib/format";
import { logLevelStyles } from "@/lib/status";

function AuditTab() {
    const [query, setQuery] = useState("");
    const [level, setLevel] = useState<"todos" | LogLevel>("todos");

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return data.auditLogs.filter((log) => {
            const matchesQuery =
                !q ||
                log.actor.toLowerCase().includes(q) ||
                log.action.toLowerCase().includes(q) ||
                log.entity.toLowerCase().includes(q) ||
                log.detail.toLowerCase().includes(q);
            const matchesLevel = level === "todos" || log.level === level;
            return matchesQuery && matchesLevel;
        });
    }, [query, level]);

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <div className="relative flex-1">
                    <Search
                        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                        aria-hidden="true"
                    />
                    <Input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Buscar por actor, acción o entidad…"
                        className="pl-9"
                        aria-label="Buscar en auditoría"
                    />
                </div>
                <Select
                    value={level}
                    onValueChange={(value) => setLevel(value as "todos" | LogLevel)}
                >
                    <SelectTrigger
                        className="w-full md:w-44"
                        aria-label="Filtrar por nivel"
                    >
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="todos">Todos los niveles</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="warning">Aviso</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                        <SelectItem value="critical">Crítico</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="surface-hairline overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Acción</TableHead>
                            <TableHead className="hidden md:table-cell">Actor</TableHead>
                            <TableHead className="hidden lg:table-cell">
                                Entidad
                            </TableHead>
                            <TableHead>Nivel</TableHead>
                            <TableHead className="hidden xl:table-cell">Fecha</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="py-10 text-center text-sm text-muted-foreground"
                                >
                                    Sin registros para los filtros actuales.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filtered.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell>
                                        <div className="leading-tight">
                                            <p className="text-sm font-medium">
                                                {log.action}
                                            </p>
                                            <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                                                {log.detail}
                                            </p>
                                            <p className="mono-label mt-1 text-[10px] text-muted-foreground">
                                                {log.ip}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-6 w-6">
                                                <AvatarFallback className="bg-accent text-[10px] text-accent-foreground">
                                                    {initials(log.actor)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm">{log.actor}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden lg:table-cell">
                                        <span className="text-sm text-muted-foreground">
                                            {log.entity}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge {...logLevelStyles[log.level]} />
                                    </TableCell>
                                    <TableCell className="hidden xl:table-cell">
                                        <span className="text-sm text-muted-foreground">
                                            {timeAgo(log.timestamp)}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

function ErrorsTab() {
    return (
        <div className="space-y-3">
            {data.systemErrors.map((error) => (
                <div key={error.id} className="surface-hairline rounded-lg p-4">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <p className="text-sm font-medium">{error.message}</p>
                            <p className="mono-label mt-1 text-[10px] text-muted-foreground">
                                {error.service} · {formatDateTime(error.lastSeen)} ·{" "}
                                {error.occurrences} ocurrencias
                            </p>
                        </div>
                        <StatusBadge {...logLevelStyles[error.level]} />
                    </div>
                    <pre className="mt-3 overflow-x-auto rounded-md bg-muted p-3 font-mono text-xs text-muted-foreground">
                        {error.stack}
                    </pre>
                </div>
            ))}
        </div>
    );
}

function FailedLoginsTab() {
    return (
        <div className="surface-hairline overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Correo</TableHead>
                        <TableHead>IP</TableHead>
                        <TableHead className="hidden md:table-cell">Motivo</TableHead>
                        <TableHead className="hidden lg:table-cell">Ubicación</TableHead>
                        <TableHead>Fecha</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.failedLogins.map((attempt) => (
                        <TableRow key={attempt.id}>
                            <TableCell>
                                <span className="text-sm font-medium">
                                    {attempt.email}
                                </span>
                            </TableCell>
                            <TableCell>
                                <span className="mono-label text-muted-foreground">
                                    {attempt.ip}
                                </span>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                <span className="text-sm">{attempt.reason}</span>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                                <span className="text-sm text-muted-foreground">
                                    {attempt.location}
                                </span>
                            </TableCell>
                            <TableCell>
                                <span className="text-sm text-muted-foreground">
                                    {timeAgo(attempt.timestamp)}
                                </span>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export function Logs() {
    return (
        <div className="space-y-6">
            <header>
                <h2 className="text-xl font-semibold">Logs y auditoría</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    Quién hizo qué y cuándo, errores del sistema e intentos de acceso
                    fallidos.
                </p>
            </header>

            <Tabs defaultValue="auditoria">
                <TabsList className="flex-wrap">
                    <TabsTrigger value="auditoria">
                        <ScrollText className="h-4 w-4" aria-hidden="true" /> Acciones
                    </TabsTrigger>
                    <TabsTrigger value="errores">
                        <AlertOctagon className="h-4 w-4" aria-hidden="true" /> Errores
                    </TabsTrigger>
                    <TabsTrigger value="accesos">
                        <ShieldAlert className="h-4 w-4" aria-hidden="true" /> Accesos
                        fallidos
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="auditoria">
                    <AuditTab />
                </TabsContent>
                <TabsContent value="errores">
                    <ErrorsTab />
                </TabsContent>
                <TabsContent value="accesos">
                    <FailedLoginsTab />
                </TabsContent>
            </Tabs>

            <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <KeyRound className="h-3.5 w-3.5" aria-hidden="true" />
                Los registros se conservan 90 días y son de solo lectura.
            </p>
        </div>
    );
}

export default Logs;
