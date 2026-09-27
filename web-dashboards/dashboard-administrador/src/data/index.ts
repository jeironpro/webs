import raw from "./mock.json";
import type { MockData } from "./types";

// El MOCK se valida en compilación contra la interfaz MockData.
export const data = raw as MockData;

export type {
    ActivityPoint,
    Alert,
    Article,
    AuditLog,
    DatabaseHealth,
    EnvVar,
    FailedLogin,
    FeatureFlag,
    HealthState,
    Integration,
    LogLevel,
    MetricSeries,
    MockData,
    Order,
    OrderStatus,
    OverviewStats,
    Product,
    PublishStatus,
    QueueHealth,
    ResourceHealth,
    Role,
    Severity,
    ScheduledReport,
    ServiceHealth,
    SystemError,
    User,
    UserStatus,
} from "./types";
