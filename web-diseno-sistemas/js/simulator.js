export const DEFAULTS = Object.freeze({
    traffic: 36,
    cache: 60,
    regions: 2,
    db: 2,
});

const DB_FACTOR = {
    1: 1,
    2: 1.6,
    3: 2.6,
};

const STATUS_LABELS = {
    ok: "Holgado",
    warn: "Vigilar",
    limit: "Al límite",
    bad: "Saturado",
};

function clamp(value, min, max) {
    return Math.min(Math.max(Number(value), min), max);
}

export function simulate(config = {}) {
    const traffic = clamp(config.traffic ?? DEFAULTS.traffic, 2, 120);
    const cache = clamp(config.cache ?? DEFAULTS.cache, 0, 95);
    const regions = Math.round(clamp(config.regions ?? DEFAULTS.regions, 1, 3));
    const db = Math.round(clamp(config.db ?? DEFAULTS.db, 1, 3));
    const factor = DB_FACTOR[db];

    const capacity = Math.min(regions * 60, 50 * factor);
    const utilization = traffic / capacity;

    const network = 26 + 36 / regions + (traffic / regions) * 0.08;
    const app = 22 + traffic * 0.18;
    const database = (24 + traffic * (1 - cache / 100) * 0.75) / factor;
    const queue = utilization > 0.65 ? Math.pow((utilization - 0.65) / 0.35, 2) * 40 : 0;

    const rawTotal = network + app + database + queue;
    const total = Math.round(Math.min(rawTotal, 999));
    const dominant = [
        ["network", network],
        ["app", app],
        ["database", database],
        ["queue", queue],
    ].sort((a, b) => b[1] - a[1])[0][0];

    let status = "ok";
    if (utilization >= 1) status = "bad";
    else if (utilization >= 0.8) status = "limit";
    else if (utilization >= 0.55) status = "warn";

    let diagnosis =
        "La red pesa más que el servidor. Acercar la aplicación a los usuarios suele dar más margen que optimizar código.";

    if (utilization >= 1) {
        diagnosis =
            "La demanda ya supera la capacidad. La cola crece más rápido que el tráfico: añade margen o reparte la entrada antes de seguir optimizando.";
    } else if (dominant === "queue") {
        diagnosis =
            "La cola domina la latencia. El sistema está cerca de su límite; una petición más rápida no evita la espera.";
    } else if (dominant === "database" && cache < 70) {
        diagnosis =
            "La base de datos es el cuello y la caché aún tiene margen. Cada diez puntos de acierto quitan consultas reales al origen.";
    } else if (dominant === "database") {
        diagnosis =
            "La base de datos sigue siendo lo más caro. Revisa la consulta, el índice y si las lecturas pueden salir de una réplica.";
    } else if (dominant === "app") {
        diagnosis =
            "La API dedica demasiado tiempo por petición. Antes de añadir máquinas, mide qué parte es trabajo útil y qué parte es espera.";
    }

    return {
        traffic,
        cache,
        regions,
        db,
        capacity,
        utilization,
        network,
        app,
        database,
        queue,
        rawTotal,
        total,
        dominant,
        status,
        statusLabel: STATUS_LABELS[status],
        diagnosis,
    };
}

export function curveFor(config = {}) {
    const points = [];
    const totalPoints = 30;

    for (let index = 0; index < totalPoints; index += 1) {
        const traffic = 2 + ((120 - 2) * index) / (totalPoints - 1);
        const result = simulate({ ...config, traffic });
        points.push({ traffic, total: result.total });
    }

    return points;
}
