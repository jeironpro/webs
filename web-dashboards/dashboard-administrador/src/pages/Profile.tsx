import { useState } from "react";
import {
    BadgeCheck,
    Check,
    KeyRound,
    Laptop,
    MapPin,
    MonitorSmartphone,
    ShieldCheck,
    Smartphone,
} from "lucide-react";

import { data } from "@/data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { formatDate, formatDateTime, initials } from "@/lib/format";

const sessions = [
    {
        id: "s1",
        device: "MacBook Pro · Chrome",
        icon: Laptop,
        location: "Madrid, ES",
        lastActive: "2026-08-18T08:55:00Z",
        current: true,
    },
    {
        id: "s2",
        device: "iPhone 16 · Safari",
        icon: Smartphone,
        location: "Madrid, ES",
        lastActive: "2026-08-17T21:04:00Z",
        current: false,
    },
    {
        id: "s3",
        device: "PC · Firefox",
        icon: MonitorSmartphone,
        location: "Barcelona, ES",
        lastActive: "2026-08-14T10:31:00Z",
        current: false,
    },
];

export function Profile() {
    const currentUser = data.users[0];
    const [form, setForm] = useState({
        name: currentUser.name,
        email: currentUser.email,
        location: currentUser.location,
    });
    const [saved, setSaved] = useState(false);
    const [password, setPassword] = useState({ current: "", next: "", confirm: "" });
    const [passwordState, setPasswordState] = useState<"idle" | "error" | "success">(
        "idle",
    );
    const [prefs, setPrefs] = useState({
        emailNotifications: true,
        weeklyDigest: true,
        compactMode: false,
        twoFactor: true,
    });

    const myActivity = data.auditLogs
        .filter((log) => log.actor === currentUser.name)
        .slice(0, 6);

    function saveProfile() {
        setSaved(true);
        window.setTimeout(() => setSaved(false), 2000);
    }

    function changePassword() {
        if (!password.current || !password.next) {
            setPasswordState("error");
            return;
        }
        if (password.next.length < 8) {
            setPasswordState("error");
            return;
        }
        if (password.next !== password.confirm) {
            setPasswordState("error");
            return;
        }
        setPasswordState("success");
        setPassword({ current: "", next: "", confirm: "" });
        window.setTimeout(() => setPasswordState("idle"), 2500);
    }

    return (
        <div className="space-y-6">
            <header>
                <h2 className="text-xl font-semibold">Perfil</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    Tu cuenta, seguridad y preferencias personales.
                </p>
            </header>

            {/* Identidad */}
            <Card className="surface-hairline rounded-lg">
                <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarFallback className="bg-accent text-lg text-accent-foreground">
                                {initials(currentUser.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="leading-tight">
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold">
                                    {currentUser.name}
                                </h3>
                                {currentUser.verified && (
                                    <BadgeCheck
                                        className="h-4 w-4 text-accent"
                                        aria-label="Cuenta verificada"
                                    />
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {currentUser.email}
                            </p>
                            <div className="mt-1.5 flex flex-wrap items-center gap-2">
                                <Badge
                                    variant="outline"
                                    className="mono-label text-[10px]"
                                >
                                    {currentUser.role}
                                </Badge>
                                <Badge
                                    variant="success"
                                    className="mono-label text-[10px]"
                                >
                                    {currentUser.status}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                    {currentUser.plan}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center sm:text-right">
                        <div>
                            <p className="mono-label text-[10px] text-muted-foreground">
                                desde
                            </p>
                            <p className="mt-0.5 text-sm font-medium">
                                {formatDate(currentUser.createdAt)}
                            </p>
                        </div>
                        <div>
                            <p className="mono-label text-[10px] text-muted-foreground">
                                último acceso
                            </p>
                            <p className="mt-0.5 text-sm font-medium">
                                {formatDateTime(currentUser.lastLogin)}
                            </p>
                        </div>
                        <div>
                            <p className="mono-label text-[10px] text-muted-foreground">
                                ubicación
                            </p>
                            <p className="mt-0.5 flex items-center justify-center gap-1 text-sm font-medium sm:justify-end">
                                <MapPin
                                    className="h-3.5 w-3.5 text-muted-foreground"
                                    aria-hidden="true"
                                />
                                {currentUser.location.split(",")[0]}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="space-y-6 xl:col-span-2">
                    {/* Información personal */}
                    <Card className="surface-hairline rounded-lg">
                        <CardHeader>
                            <CardTitle className="text-base">
                                Información personal
                            </CardTitle>
                            <CardDescription>
                                Datos visibles para tu equipo.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="profile-name">Nombre</Label>
                                <Input
                                    id="profile-name"
                                    value={form.name}
                                    onChange={(event) =>
                                        setForm({ ...form, name: event.target.value })
                                    }
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="profile-email">Correo</Label>
                                <Input
                                    id="profile-email"
                                    type="email"
                                    value={form.email}
                                    onChange={(event) =>
                                        setForm({ ...form, email: event.target.value })
                                    }
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="profile-location">Ubicación</Label>
                                <Input
                                    id="profile-location"
                                    value={form.location}
                                    onChange={(event) =>
                                        setForm({ ...form, location: event.target.value })
                                    }
                                />
                            </div>
                            <div className="flex justify-end">
                                <Button
                                    onClick={saveProfile}
                                    data-state={saved ? "success" : undefined}
                                >
                                    {saved ? (
                                        <>
                                            <Check
                                                className="h-4 w-4"
                                                aria-hidden="true"
                                            />{" "}
                                            Guardado
                                        </>
                                    ) : (
                                        "Guardar cambios"
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actividad */}
                    <Card className="surface-hairline rounded-lg">
                        <CardHeader>
                            <CardTitle className="text-base">
                                Tu actividad reciente
                            </CardTitle>
                            <CardDescription>
                                Acciones registradas en auditoría.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {myActivity.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    Sin actividad reciente.
                                </p>
                            ) : (
                                myActivity.map((log) => (
                                    <div key={log.id}>
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="leading-tight">
                                                <p className="text-sm font-medium">
                                                    {log.action}
                                                </p>
                                                <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                                                    {log.detail}
                                                </p>
                                            </div>
                                            <span className="mono-label shrink-0 text-[10px] text-muted-foreground">
                                                {formatDateTime(log.timestamp)}
                                            </span>
                                        </div>
                                        <Separator className="mt-3" />
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    {/* Seguridad */}
                    <Card className="surface-hairline rounded-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <KeyRound
                                    className="h-4 w-4 text-muted-foreground"
                                    aria-hidden="true"
                                />
                                Seguridad
                            </CardTitle>
                            <CardDescription>Cambia tu contraseña.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-3">
                            <div className="grid gap-2">
                                <Label htmlFor="pw-current">Contraseña actual</Label>
                                <Input
                                    id="pw-current"
                                    type="password"
                                    value={password.current}
                                    onChange={(event) =>
                                        setPassword({
                                            ...password,
                                            current: event.target.value,
                                        })
                                    }
                                    autoComplete="current-password"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="pw-next">Nueva contraseña</Label>
                                <Input
                                    id="pw-next"
                                    type="password"
                                    value={password.next}
                                    onChange={(event) =>
                                        setPassword({
                                            ...password,
                                            next: event.target.value,
                                        })
                                    }
                                    autoComplete="new-password"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="pw-confirm">Confirmar contraseña</Label>
                                <Input
                                    id="pw-confirm"
                                    type="password"
                                    value={password.confirm}
                                    onChange={(event) =>
                                        setPassword({
                                            ...password,
                                            confirm: event.target.value,
                                        })
                                    }
                                    autoComplete="new-password"
                                />
                            </div>
                            {passwordState === "error" && (
                                <p className="text-sm text-destructive" role="alert">
                                    Revisa los campos: la contraseña debe tener al menos 8
                                    caracteres y coincidir.
                                </p>
                            )}
                            {passwordState === "success" && (
                                <p className="flex items-center gap-1.5 text-sm text-success">
                                    <Check className="h-4 w-4" aria-hidden="true" />{" "}
                                    Contraseña actualizada.
                                </p>
                            )}
                            <Button variant="outline" onClick={changePassword}>
                                Actualizar contraseña
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Preferencias */}
                    <Card className="surface-hairline rounded-lg">
                        <CardHeader>
                            <CardTitle className="text-base">Preferencias</CardTitle>
                            <CardDescription>
                                Notificaciones y apariencia.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                {
                                    key: "emailNotifications",
                                    label: "Notificaciones por correo",
                                    hint: "Alertas y avisos importantes.",
                                },
                                {
                                    key: "weeklyDigest",
                                    label: "Resumen semanal",
                                    hint: "Métricas de tu espacio cada lunes.",
                                },
                                {
                                    key: "compactMode",
                                    label: "Modo compacto",
                                    hint: "Reduce el espacio entre elementos.",
                                },
                                {
                                    key: "twoFactor",
                                    label: "Verificación en dos pasos",
                                    hint: "Código adicional al iniciar sesión.",
                                },
                            ].map((item) => (
                                <div
                                    key={item.key}
                                    className="flex items-center justify-between gap-3"
                                >
                                    <div className="leading-tight">
                                        <p className="text-sm font-medium">
                                            {item.label}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {item.hint}
                                        </p>
                                    </div>
                                    <Switch
                                        checked={prefs[item.key as keyof typeof prefs]}
                                        onCheckedChange={(checked) =>
                                            setPrefs({ ...prefs, [item.key]: checked })
                                        }
                                        aria-label={item.label}
                                    />
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Sesiones */}
                    <Card className="surface-hairline rounded-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <ShieldCheck
                                    className="h-4 w-4 text-muted-foreground"
                                    aria-hidden="true"
                                />
                                Sesiones activas
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {sessions.map((session) => (
                                <div key={session.id} className="flex items-center gap-3">
                                    <session.icon
                                        className="h-4 w-4 shrink-0 text-muted-foreground"
                                        aria-hidden="true"
                                    />
                                    <div className="min-w-0 flex-1 leading-tight">
                                        <p className="truncate text-sm font-medium">
                                            {session.device}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {session.location} ·{" "}
                                            {formatDateTime(session.lastActive)}
                                        </p>
                                    </div>
                                    {session.current ? (
                                        <Badge
                                            variant="outline"
                                            className="mono-label shrink-0 text-[10px]"
                                        >
                                            actual
                                        </Badge>
                                    ) : (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="shrink-0"
                                        >
                                            Cerrar
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default Profile;
