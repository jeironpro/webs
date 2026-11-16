import { describe, expect, test } from "vitest";
import {
    STATUS_ORDER,
    adjacentStatus,
    buildDemoTasks,
    matchesTask,
    normalizeTags,
    sanitizeImportedTasks,
} from "../../web-lexaro/js/modules/board.js";

const task = {
    title: "Revisar la landing",
    description: "Comprobar textos y enlaces",
    priority: "high",
    status: "review",
    tags: ["Frontend", "diseño"],
    taskId: "PROJ-002",
};

describe("movimiento de columnas", () => {
    test("mueve una tarea al estado anterior y al siguiente", () => {
        expect(adjacentStatus("todo", 1)).toBe("in-progress");
        expect(adjacentStatus("review", 1)).toBe("done");
        expect(adjacentStatus("review", -1)).toBe("in-progress");
    });

    test("no mueve fuera del tablero", () => {
        expect(adjacentStatus("todo", -1)).toBeNull();
        expect(adjacentStatus("done", 1)).toBeNull();
        expect(adjacentStatus("desconocido", 1)).toBeNull();
    });
});

describe("búsqueda y filtros", () => {
    test("combina prioridad y texto", () => {
        expect(matchesTask(task, { priority: "high", query: "landing" })).toBe(true);
        expect(matchesTask(task, { priority: "low", query: "landing" })).toBe(false);
        expect(matchesTask(task, { priority: "high", query: "inexistente" })).toBe(false);
    });

    test("ignora mayúsculas y acentos en texto y etiquetas", () => {
        expect(matchesTask(task, { query: "DISEÑO" })).toBe(true);
        expect(matchesTask(task, { query: "revision" })).toBe(true);
        expect(matchesTask(task, { query: "PROJ-002" })).toBe(true);
    });
});

describe("etiquetas", () => {
    test("recorta, separa y elimina duplicados", () => {
        expect(normalizeTags(" frontend, diseño, frontend, ")).toEqual(["frontend", "diseño"]);
        expect(normalizeTags(["uno", " uno ", ""])).toEqual(["uno"]);
        expect(normalizeTags(null)).toEqual([]);
    });
});

describe("tablero de ejemplo", () => {
    test("cubre los cuatro estados con identificadores únicos", () => {
        const demo = buildDemoTasks(new Date("2026-11-16T12:00:00Z"));
        expect(demo).toHaveLength(4);
        expect(new Set(demo.map((item) => item.status))).toEqual(new Set(STATUS_ORDER));
        expect(new Set(demo.map((item) => item.id)).size).toBe(demo.length);
        expect(demo.every((item) => item.taskId.startsWith("PROJ-"))).toBe(true);
    });

    test("genera fechas ISO relativas al día recibido", () => {
        const demo = buildDemoTasks(new Date("2026-11-16T12:00:00Z"));
        expect(demo[0].endDate).toBe("2026-11-18");
        expect(demo[3].endDate).toBe("2026-11-15");
    });
});

describe("importación", () => {
    test("rechaza valores que no son listas", () => {
        expect(sanitizeImportedTasks(null)).toEqual([]);
        expect(sanitizeImportedTasks({ title: "x" })).toEqual([]);
    });

    test("asigna identificadores nuevos y descarta títulos vacíos", () => {
        const imported = sanitizeImportedTasks(
            [
                { title: " Uno ", priority: "urgente", status: "inventado", tags: "a, b" },
                { title: "   " },
                { title: "Dos", description: 42, tags: ["x"] },
            ],
            7
        );

        expect(imported).toHaveLength(2);
        expect(imported[0]).toMatchObject({
            id: "7",
            taskId: "PROJ-007",
            title: "Uno",
            priority: "medium",
            status: "todo",
            tags: ["a", "b"],
        });
        expect(imported[1]).toMatchObject({ id: "8", taskId: "PROJ-008", title: "Dos" });
    });

    test("solo conserva fechas ISO válidas", () => {
        const imported = sanitizeImportedTasks([
            { title: "Fecha", startDate: "2026-01-01", endDate: "mañana" },
        ]);
        expect(imported[0].startDate).toBe("2026-01-01");
        expect(imported[0].endDate).toBe("");
    });
});
