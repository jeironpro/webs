// Tipos del dominio de Nexo. El MOCK (mock.json) se valida contra estas formas.

export type Role = "admin" | "editor" | "soporte" | "miembro";
export type UserStatus = "activo" | "suspendido" | "pendiente";
export type PublishStatus = "activo" | "borrador" | "archivado";
export type OrderStatus = "completado" | "pendiente" | "fallido" | "reembolsado";
export type LogLevel = "info" | "warning" | "error" | "critical";
export type HealthState = "operativo" | "degradado" | "caido";
export type Severity = "alta" | "media" | "baja";

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    status: UserStatus;
    plan: string;
    createdAt: string;
    lastLogin: string;
    location: string;
    verified: boolean;
}

export interface Product {
    id: string;
    name: string;
    sku: string;
    category: string;
    price: number;
    stock: number;
    status: PublishStatus;
    updatedAt: string;
}

export interface Article {
    id: string;
    title: string;
    author: string;
    category: string;
    status: PublishStatus;
    publishedAt: string;
    views: number;
}

export interface Order {
    id: string;
    customer: string;
    email: string;
    amount: number;
    items: number;
    status: OrderStatus;
    paymentMethod: string;
    date: string;
}

export interface AuditLog {
    id: string;
    actor: string;
    role: Role;
    action: string;
    entity: string;
    detail: string;
    ip: string;
    level: LogLevel;
    timestamp: string;
}

export interface SystemError {
    id: string;
    service: string;
    message: string;
    stack: string;
    occurrences: number;
    level: LogLevel;
    lastSeen: string;
}

export interface FailedLogin {
    id: string;
    email: string;
    ip: string;
    reason: string;
    location: string;
    timestamp: string;
}

export interface ActivityPoint {
    date: string;
    users: number;
    orders: number;
    sessions: number;
    revenue: number;
}

export interface Alert {
    id: string;
    title: string;
    description: string;
    severity: Severity;
    category: string;
    createdAt: string;
}

export interface OverviewStats {
    totalUsers: number;
    newToday: number;
    newWeek: number;
    newMonth: number;
    totalOrders: number;
    totalRevenue: number;
    conversionRate: number;
    openAlerts: number;
}

export interface Integration {
    id: string;
    name: string;
    kind: string;
    status: HealthState;
    connected: boolean;
    lastSync: string;
    description: string;
}

export interface FeatureFlag {
    key: string;
    name: string;
    description: string;
    enabled: boolean;
    rollout: number;
}

export interface EnvVar {
    key: string;
    value: string;
    masked: boolean;
    scope: string;
    description: string;
    editable: boolean;
}

export interface DatabaseHealth {
    status: HealthState;
    engine: string;
    latencyMs: number;
    connections: number;
    maxConnections: number;
    uptimePct: number;
    sizeGb: number;
}

export interface MetricSeries {
    labels: string[];
    values: number[];
}

export interface ResourceHealth {
    cpu: MetricSeries;
    memory: MetricSeries;
    disk: MetricSeries;
}

export interface ServiceHealth {
    id: string;
    name: string;
    kind: string;
    status: HealthState;
    latencyMs: number;
    region: string;
}

export interface QueueHealth {
    id: string;
    name: string;
    pending: number;
    failed: number;
    processed: number;
    status: HealthState;
}

export interface ScheduledReport {
    id: string;
    name: string;
    type: "diario" | "semanal" | "mensual";
    format: "csv" | "excel";
    recipients: string[];
    lastRun: string;
    nextRun: string;
    enabled: boolean;
}

export interface MockData {
    meta: {
        brand: string;
        product: string;
        environment: string;
        version: string;
        generatedAt: string;
    };
    overview: OverviewStats;
    activity: ActivityPoint[];
    alerts: Alert[];
    users: User[];
    products: Product[];
    articles: Article[];
    orders: Order[];
    auditLogs: AuditLog[];
    systemErrors: SystemError[];
    failedLogins: FailedLogin[];
    integrations: Integration[];
    featureFlags: FeatureFlag[];
    envVars: EnvVar[];
    health: {
        database: DatabaseHealth;
        resources: ResourceHealth;
        services: ServiceHealth[];
        queues: QueueHealth[];
    };
    reports: ScheduledReport[];
}
