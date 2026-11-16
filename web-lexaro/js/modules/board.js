export const STATUS_ORDER = Object.freeze(["todo", "in-progress", "review", "done"]);

export const STATUS_LABELS = Object.freeze({
    todo: "To Do",
    "in-progress": "En Progreso",
    review: "En Revisión",
    done: "Completado",
});

export const PRIORITIES = Object.freeze(["high", "medium", "low"]);

export function adjacentStatus(status, direction) {
    const index = STATUS_ORDER.indexOf(status);
    if (index === -1) return null;
    return STATUS_ORDER[index + direction] ?? null;
}

export function normalizeTags(value) {
    const list = Array.isArray(value) ? value : String(value ?? "").split(",");
    return [...new Set(list.map((tag) => String(tag).trim()).filter(Boolean))];
}

function normalizeText(value) {
    return String(value ?? "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

export function matchesTask(task, { priority = "all", query = "" } = {}) {
    if (priority !== "all" && task.priority !== priority) return false;

    const term = normalizeText(query).trim();
    if (!term) return true;

    const searchable = [
        task.title,
        task.description,
        task.taskId,
        STATUS_LABELS[task.status],
        ...(Array.isArray(task.tags) ? task.tags : []),
    ];

    return searchable.some((value) => normalizeText(value).includes(term));
}

function isoDay(baseDate, offset) {
    const date = new Date(baseDate);
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + offset);
    return date.toISOString().slice(0, 10);
}

export function buildDemoTasks(today = new Date()) {
    return [
        {
            id: "1",
            title: "Preparar el lanzamiento",
            description: "Cerrar el plan de salida y revisar los últimos detalles del producto.",
            priority: "high",
            status: "in-progress",
            tags: ["producto", "revisión"],
            taskId: "PROJ-001",
            startDate: isoDay(today, -2),
            endDate: isoDay(today, 2),
        },
        {
            id: "2",
            title: "Revisar la landing",
            description: "Comprobar textos, enlaces y el comportamiento en móvil.",
            priority: "medium",
            status: "review",
            tags: ["frontend", "diseño"],
            taskId: "PROJ-002",
            startDate: isoDay(today, -1),
            endDate: isoDay(today, 4),
        },
        {
            id: "3",
            title: "Ordenar el backlog",
            description: "Agrupar las ideas pendientes y dejar las siguientes tres priorizadas.",
            priority: "low",
            status: "todo",
            tags: ["producto"],
            taskId: "PROJ-003",
            startDate: "",
            endDate: isoDay(today, 7),
        },
        {
            id: "4",
            title: "Configurar el tablero",
            description: "Columnas, prioridades y guardado local listos para empezar.",
            priority: "high",
            status: "done",
            tags: ["setup"],
            taskId: "PROJ-004",
            startDate: isoDay(today, -4),
            endDate: isoDay(today, -1),
        },
    ];
}

function safeDate(value) {
    return /^\d{4}-\d{2}-\d{2}$/.test(String(value ?? "")) ? String(value) : "";
}

export function sanitizeImportedTasks(value, startId = 1) {
    if (!Array.isArray(value)) return [];

    const firstId = Number.isInteger(startId) && startId > 0 ? startId : 1;

    return value
        .filter((task) => task && typeof task.title === "string" && task.title.trim() !== "")
        .map((task, index) => {
            const id = String(firstId + index);
            return {
                id,
                taskId: `PROJ-${String(firstId + index).padStart(3, "0")}`,
                title: task.title.trim(),
                description: typeof task.description === "string" ? task.description : "",
                priority: PRIORITIES.includes(task.priority) ? task.priority : "medium",
                status: STATUS_ORDER.includes(task.status) ? task.status : "todo",
                tags: normalizeTags(task.tags),
                startDate: safeDate(task.startDate),
                endDate: safeDate(task.endDate),
            };
        });
}
