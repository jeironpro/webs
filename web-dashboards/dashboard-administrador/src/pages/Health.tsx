import {
    Activity,
    Cpu,
    Database,
    HardDrive,
    MemoryStick,
    Server,
    Timer,
} from "lucide-react";

import { data } from "@/data";
import type { MetricSeries } from "@/data";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/ui/status-badge";
import { healthStateStyles } from "@/lib/status";

function ResourceSeries({
    series,
    label,
    icon: Icon,
}: {
    series: MetricSeries;
    label: string;
    icon: typeof Cpu;
}) {
    const width = 320;
    const height = 72;
    const max = Math.max(...series.values, 100);
    const points = series.values
        .map((value, index) => {
            const x = (index / (series.values.length - 1)) * width;
            const y = height - 8 - (value / max) * (height - 16);
            return `${x.toFixed(1)},${y.toFixed(1)}`;
        })
        .join(" ");
    const areaPoints = `0,${height} ${points} ${width},${height}`;

    return (
        <div className="surface-hairline rounded-lg p-5">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <p className="text-sm font-semibold">{label}</p>
                </div>
                <span className="tabular text-sm font-medium">
                    {series.values[series.values.length - 1]} %
                </span>
            </div>
            <svg
                viewBox={`0 0 ${width} ${height}`}
                className="mt-3 h-16 w-full"
                aria-hidden="true"
                preserveAspectRatio="none"
            >
                <polygon points={areaPoints} fill="var(--color-accent)" opacity="0.08" />
                <polyline
                    points={points}
                    fill="none"
                    stroke="var(--color-accent)"
                    strokeWidth="1.5"
                    vectorEffect="non-scaling-stroke"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                />
            </svg>
            <div className="mt-1 flex justify-between">
                <span className="mono-label text-[10px] text-muted-foreground">
                    {series.labels[0]}
                </span>
                <span className="mono-label text-[10px] text-muted-foreground">
                    {series.labels[series.labels.length - 1]}
                </span>
            </div>
        </div>
    );
}

export function Health() {
    const { database, resources, services, queues } = data.health;
    const connectionPct = Math.round(
        (database.connections / database.maxConnections) * 100,
    );

    return (
        <div className="space-y-6">
            <header>
                <h2 className="text-xl font-semibold">Salud del sistema</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    Estado de la base de datos, recursos, servicios y colas de trabajo.
                </p>
            </header>

            {/* Base de datos */}
            <Card className="surface-hairline rounded-lg">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Database
                                className="h-4 w-4 text-muted-foreground"
                                aria-hidden="true"
                            />
                            Base de datos
                        </CardTitle>
                        <StatusBadge {...healthStateStyles[database.status]} />
                    </div>
                    <CardDescription>{database.engine}</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div>
                        <p className="mono-label text-muted-foreground">latencia</p>
                        <p className="tabular mt-1 text-lg font-semibold">
                            {database.latencyMs} ms
                        </p>
                    </div>
                    <div>
                        <p className="mono-label text-muted-foreground">uptime</p>
                        <p className="tabular mt-1 text-lg font-semibold">
                            {database.uptimePct} %
                        </p>
                    </div>
                    <div>
                        <p className="mono-label text-muted-foreground">tamaño</p>
                        <p className="tabular mt-1 text-lg font-semibold">
                            {database.sizeGb} GB
                        </p>
                    </div>
                    <div>
                        <p className="mono-label text-muted-foreground">conexiones</p>
                        <p className="tabular mt-1 text-lg font-semibold">
                            {database.connections}
                            <span className="text-sm text-muted-foreground">
                                {" "}
                                / {database.maxConnections}
                            </span>
                        </p>
                        <Progress value={connectionPct} className="mt-2 h-1.5" />
                    </div>
                </CardContent>
            </Card>

            {/* Recursos */}
            <section>
                <h3 className="mb-3 flex items-center gap-2 text-base font-semibold">
                    <Activity
                        className="h-4 w-4 text-muted-foreground"
                        aria-hidden="true"
                    />
                    Uso de recursos
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <ResourceSeries series={resources.cpu} label="CPU" icon={Cpu} />
                    <ResourceSeries
                        series={resources.memory}
                        label="Memoria"
                        icon={MemoryStick}
                    />
                    <ResourceSeries
                        series={resources.disk}
                        label="Disco"
                        icon={HardDrive}
                    />
                </div>
            </section>

            {/* Servicios */}
            <section>
                <h3 className="mb-3 flex items-center gap-2 text-base font-semibold">
                    <Server
                        className="h-4 w-4 text-muted-foreground"
                        aria-hidden="true"
                    />
                    Servicios externos
                </h3>
                <div className="surface-hairline overflow-hidden">
                    <div className="divide-y">
                        {services.map((service) => (
                            <div
                                key={service.id}
                                className="grid grid-cols-1 gap-2 p-4 md:grid-cols-[1fr_auto_auto] md:items-center md:gap-4"
                            >
                                <div className="leading-tight">
                                    <p className="text-sm font-medium">{service.name}</p>
                                    <p className="mono-label text-[10px] text-muted-foreground">
                                        {service.kind} · {service.region}
                                    </p>
                                </div>
                                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                    <Timer className="h-3.5 w-3.5" aria-hidden="true" />
                                    {service.latencyMs} ms
                                </span>
                                <StatusBadge {...healthStateStyles[service.status]} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Colas */}
            <section>
                <h3 className="mb-3 text-base font-semibold">Colas de trabajo</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {queues.map((queue) => (
                        <div key={queue.id} className="surface-hairline rounded-lg p-5">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold">{queue.name}</p>
                                <StatusBadge {...healthStateStyles[queue.status]} />
                            </div>
                            <div className="mt-4 grid grid-cols-3 gap-2">
                                <div>
                                    <p className="mono-label text-[10px] text-muted-foreground">
                                        pendientes
                                    </p>
                                    <p className="tabular text-lg font-semibold">
                                        {queue.pending}
                                    </p>
                                </div>
                                <div>
                                    <p className="mono-label text-[10px] text-muted-foreground">
                                        fallidos
                                    </p>
                                    <p
                                        className={`tabular text-lg font-semibold ${queue.failed > 0 ? "text-destructive" : ""}`}
                                    >
                                        {queue.failed}
                                    </p>
                                </div>
                                <div>
                                    <p className="mono-label text-[10px] text-muted-foreground">
                                        procesados
                                    </p>
                                    <p className="tabular text-lg font-semibold">
                                        {queue.processed}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default Health;
