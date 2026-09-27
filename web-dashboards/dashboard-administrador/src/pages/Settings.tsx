import { useState } from "react";
import {
    Eye,
    EyeOff,
    Flag,
    Pencil,
    Plug,
    Settings2,
    ShieldAlert,
    TriangleAlert,
} from "lucide-react";

import { data } from "@/data";
import type { EnvVar } from "@/data";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDateTime } from "@/lib/format";
import { healthStateStyles } from "@/lib/status";

function EnvVarsTab() {
    const [vars, setVars] = useState<EnvVar[]>(data.envVars);
    const [visible, setVisible] = useState<Record<string, boolean>>({});
    const [editing, setEditing] = useState<EnvVar | null>(null);
    const [draft, setDraft] = useState("");

    function save() {
        if (!editing) return;
        setVars((current) =>
            current.map((item) =>
                item.key === editing.key ? { ...item, value: draft } : item,
            ),
        );
        setEditing(null);
    }

    return (
        <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-md border border-warning/40 bg-warning/10 p-4">
                <TriangleAlert
                    className="mt-0.5 h-4 w-4 shrink-0 text-warning"
                    aria-hidden="true"
                />
                <p className="text-sm text-foreground">
                    Los valores secretos se guardan encriptados y se registran en la
                    auditoría. Edita con cuidado: un cambio inválido puede afectar a
                    producción.
                </p>
            </div>

            <div className="surface-hairline overflow-hidden">
                <div className="divide-y">
                    {vars.map((item) => {
                        const revealed = visible[item.key];
                        return (
                            <div
                                key={item.key}
                                className="grid grid-cols-1 gap-2 p-4 md:grid-cols-[240px_1fr_auto] md:items-center md:gap-4"
                            >
                                <div className="leading-tight">
                                    <p className="mono-label text-primary">{item.key}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {item.scope}
                                    </p>
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate font-mono text-sm">
                                        {revealed
                                            ? item.value
                                            : item.masked
                                              ? "••••••••••••"
                                              : item.value}
                                    </p>
                                    <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                                        {item.description}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    {item.masked && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            aria-label={
                                                revealed
                                                    ? "Ocultar valor"
                                                    : "Mostrar valor"
                                            }
                                            onClick={() =>
                                                setVisible((c) => ({
                                                    ...c,
                                                    [item.key]: !c[item.key],
                                                }))
                                            }
                                        >
                                            {revealed ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </Button>
                                    )}
                                    {item.editable ? (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setEditing(item);
                                                setDraft(item.value);
                                            }}
                                        >
                                            <Pencil
                                                className="h-3.5 w-3.5"
                                                aria-hidden="true"
                                            />{" "}
                                            Editar
                                        </Button>
                                    ) : (
                                        <span className="mono-label text-[10px] text-muted-foreground">
                                            solo lectura
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <Dialog
                open={editing !== null}
                onOpenChange={(open) => !open && setEditing(null)}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Editar variable</DialogTitle>
                        <DialogDescription>
                            <span className="mono-label">{editing?.key}</span> ·{" "}
                            {editing?.scope}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-2">
                        <Label htmlFor="env-value">Valor</Label>
                        <Input
                            id="env-value"
                            value={draft}
                            onChange={(event) => setDraft(event.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditing(null)}>
                            Cancelar
                        </Button>
                        <Button onClick={save}>Guardar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function IntegrationsTab() {
    const [integrations, setIntegrations] = useState(data.integrations);

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {integrations.map((integration) => (
                <div key={integration.id} className="surface-hairline rounded-lg p-5">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
                                <Plug
                                    className="h-4 w-4 text-muted-foreground"
                                    aria-hidden="true"
                                />
                            </span>
                            <div className="leading-tight">
                                <p className="text-sm font-semibold">
                                    {integration.name}
                                </p>
                                <p className="mono-label text-[10px] text-muted-foreground">
                                    {integration.kind}
                                </p>
                            </div>
                        </div>
                        <StatusBadge {...healthStateStyles[integration.status]} />
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">
                        {integration.description}
                    </p>
                    <p className="mono-label mt-2 text-[10px] text-muted-foreground">
                        última sincronización · {formatDateTime(integration.lastSync)}
                    </p>
                    <div className="mt-4 flex items-center justify-between border-t pt-4">
                        <span className="text-sm">
                            {integration.connected ? "Conectada" : "Desconectada"}
                        </span>
                        <Switch
                            checked={integration.connected}
                            onCheckedChange={(checked) =>
                                setIntegrations((current) =>
                                    current.map((item) =>
                                        item.id === integration.id
                                            ? { ...item, connected: checked }
                                            : item,
                                    ),
                                )
                            }
                            aria-label={`Conectar ${integration.name}`}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

function FeatureFlagsTab() {
    const [flags, setFlags] = useState(data.featureFlags);

    return (
        <div className="surface-hairline overflow-hidden">
            <div className="divide-y">
                {flags.map((flag) => (
                    <div
                        key={flag.key}
                        className="grid grid-cols-1 gap-3 p-4 md:grid-cols-[1fr_auto] md:items-center md:gap-6"
                    >
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <Flag
                                    className="h-4 w-4 text-muted-foreground"
                                    aria-hidden="true"
                                />
                                <p className="text-sm font-medium">{flag.name}</p>
                                <span className="mono-label text-[10px] text-muted-foreground">
                                    {flag.key}
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                {flag.description}
                            </p>
                            {flag.enabled && (
                                <div className="mt-3 flex items-center gap-3">
                                    <Progress
                                        value={flag.rollout}
                                        className="h-1.5 max-w-48"
                                    />
                                    <span className="tabular text-xs text-muted-foreground">
                                        {flag.rollout} %
                                    </span>
                                </div>
                            )}
                        </div>
                        <Switch
                            checked={flag.enabled}
                            onCheckedChange={(checked) =>
                                setFlags((current) =>
                                    current.map((item) =>
                                        item.key === flag.key
                                            ? { ...item, enabled: checked }
                                            : item,
                                    ),
                                )
                            }
                            aria-label={`Activar ${flag.name}`}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export function Settings() {
    return (
        <div className="space-y-6">
            <header>
                <h2 className="text-xl font-semibold">Configuración del sistema</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    Variables de entorno, integraciones externas y feature flags.
                </p>
            </header>

            <Tabs defaultValue="variables">
                <TabsList className="flex-wrap">
                    <TabsTrigger value="variables">
                        <Settings2 className="h-4 w-4" aria-hidden="true" /> Variables
                    </TabsTrigger>
                    <TabsTrigger value="integraciones">
                        <Plug className="h-4 w-4" aria-hidden="true" /> Integraciones
                    </TabsTrigger>
                    <TabsTrigger value="flags">
                        <Flag className="h-4 w-4" aria-hidden="true" /> Feature flags
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="variables">
                    <EnvVarsTab />
                </TabsContent>
                <TabsContent value="integraciones">
                    <IntegrationsTab />
                </TabsContent>
                <TabsContent value="flags">
                    <FeatureFlagsTab />
                </TabsContent>
            </Tabs>

            <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />
                Todo cambio queda registrado en auditoría y se aplica en el siguiente
                despliegue.
            </p>
        </div>
    );
}

export default Settings;
