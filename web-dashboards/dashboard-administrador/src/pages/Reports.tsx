import { useState } from "react";
import { CalendarClock, Download, FileSpreadsheet, FileText, Play } from "lucide-react";

import { data } from "@/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { downloadCsv, downloadExcel, type Cell } from "@/lib/export";
import { formatDateTime } from "@/lib/format";

interface Dataset {
    id: string;
    name: string;
    description: string;
    headers: string[];
    rows: Cell[][];
}

const datasets: Dataset[] = [
    {
        id: "usuarios",
        name: "Usuarios",
        description: "Directorio completo de usuarios registrados.",
        headers: [
            "id",
            "nombre",
            "correo",
            "rol",
            "estado",
            "plan",
            "creado",
            "último acceso",
        ],
        rows: data.users.map((user) => [
            user.id,
            user.name,
            user.email,
            user.role,
            user.status,
            user.plan,
            user.createdAt,
            user.lastLogin,
        ]),
    },
    {
        id: "productos",
        name: "Productos",
        description: "Catálogo de productos con precios y stock.",
        headers: ["id", "nombre", "sku", "categoría", "precio", "stock", "estado"],
        rows: data.products.map((product) => [
            product.id,
            product.name,
            product.sku,
            product.category,
            product.price,
            product.stock,
            product.status,
        ]),
    },
    {
        id: "pedidos",
        name: "Pedidos",
        description: "Transacciones recientes de la plataforma.",
        headers: [
            "id",
            "cliente",
            "correo",
            "importe",
            "artículos",
            "estado",
            "método",
            "fecha",
        ],
        rows: data.orders.map((order) => [
            order.id,
            order.customer,
            order.email,
            order.amount,
            order.items,
            order.status,
            order.paymentMethod,
            order.date,
        ]),
    },
    {
        id: "auditoria",
        name: "Auditoría",
        description: "Registro de acciones administrativas.",
        headers: ["id", "actor", "acción", "entidad", "nivel", "ip", "fecha"],
        rows: data.auditLogs.map((log) => [
            log.id,
            log.actor,
            log.action,
            log.entity,
            log.level,
            log.ip,
            log.timestamp,
        ]),
    },
];

const typeLabel: Record<string, string> = {
    diario: "Diario",
    semanal: "Semanal",
    mensual: "Mensual",
};

export function Reports() {
    const [reports, setReports] = useState(data.reports);

    return (
        <div className="space-y-6">
            <header>
                <h2 className="text-xl font-semibold">Reportes y exportación</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    Exporta datos a CSV o Excel y gestiona los reportes programados.
                </p>
            </header>

            {/* Exportación */}
            <section>
                <h3 className="mb-3 flex items-center gap-2 text-base font-semibold">
                    <Download
                        className="h-4 w-4 text-muted-foreground"
                        aria-hidden="true"
                    />
                    Exportar datos
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {datasets.map((dataset) => (
                        <div key={dataset.id} className="surface-hairline rounded-lg p-5">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-sm font-semibold">
                                        {dataset.name}
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {dataset.description}
                                    </p>
                                    <p className="mono-label mt-2 text-[10px] text-muted-foreground">
                                        {dataset.rows.length} registros
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2 border-t pt-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        downloadCsv(
                                            `${dataset.id}.csv`,
                                            dataset.headers,
                                            dataset.rows,
                                        )
                                    }
                                >
                                    <FileText
                                        className="h-3.5 w-3.5"
                                        aria-hidden="true"
                                    />{" "}
                                    CSV
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        downloadExcel(
                                            `${dataset.id}.xls`,
                                            dataset.name,
                                            dataset.headers,
                                            dataset.rows,
                                        )
                                    }
                                >
                                    <FileSpreadsheet
                                        className="h-3.5 w-3.5"
                                        aria-hidden="true"
                                    />{" "}
                                    Excel
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Programados */}
            <section>
                <h3 className="mb-3 flex items-center gap-2 text-base font-semibold">
                    <CalendarClock
                        className="h-4 w-4 text-muted-foreground"
                        aria-hidden="true"
                    />
                    Reportes programados
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {reports.map((report) => (
                        <Card key={report.id} className="surface-hairline rounded-lg">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <CardTitle className="text-sm">
                                            {report.name}
                                        </CardTitle>
                                        <CardDescription className="mt-1">
                                            {typeLabel[report.type]} ·{" "}
                                            {report.format.toUpperCase()}
                                        </CardDescription>
                                    </div>
                                    <Switch
                                        checked={report.enabled}
                                        onCheckedChange={(checked) =>
                                            setReports((current) =>
                                                current.map((item) =>
                                                    item.id === report.id
                                                        ? { ...item, enabled: checked }
                                                        : item,
                                                ),
                                            )
                                        }
                                        aria-label={`Activar ${report.name}`}
                                    />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-1.5 text-xs text-muted-foreground">
                                    <p>
                                        <span className="mono-label text-[10px]">
                                            última ejecución
                                        </span>{" "}
                                        · {formatDateTime(report.lastRun)}
                                    </p>
                                    <p>
                                        <span className="mono-label text-[10px]">
                                            próxima
                                        </span>{" "}
                                        · {formatDateTime(report.nextRun)}
                                    </p>
                                    <p className="truncate">
                                        <span className="mono-label text-[10px]">
                                            destinatarios
                                        </span>{" "}
                                        · {report.recipients.join(", ")}
                                    </p>
                                </div>
                                <div className="mt-4 flex items-center justify-between border-t pt-4">
                                    <Badge
                                        variant={report.enabled ? "success" : "secondary"}
                                        className="mono-label text-[10px]"
                                    >
                                        {report.enabled ? "activo" : "pausado"}
                                    </Badge>
                                    <Button variant="ghost" size="sm">
                                        <Play
                                            className="h-3.5 w-3.5"
                                            aria-hidden="true"
                                        />{" "}
                                        Generar ahora
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default Reports;
