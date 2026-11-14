import { readFile } from "node:fs/promises";
import { describe, expect, test } from "vitest";
import {
    buildBlocks,
    countStars,
    parseFile,
    splitTopics,
} from "../../web-javarcises/tools/extract-data.js";

const EXERCISE_001 = `# Ejercicio 001 - Convertidor de tiempo de carrera

**Nivel:** 1 - Básico I
**Tema(s):** variables, operadores aritméticos
**Dificultad estimada:** ⭐⭐☆☆☆

## Enunciado

El entrenador cronometra a sus corredores en **segundos** con un cronómetro digital.

## Instrucciones

- Usa la clase \`Scanner\` para leer el valor.
- No uses \`if\` ni \`else\`.

## Firma sugerida

\`\`\`java
public class ConvertidorDeTiempo {
    public static void main(String[] args) {
    }
}
\`\`\`

## Ejemplos de ejecución

**Ejemplo 1:**
\`\`\`
Entrada: 8130
Salida: Tiempo: 2h 15min 30s
\`\`\`

**Ejemplo 2 (caso borde):**
\`\`\`
Entrada: 0
Salida: Tiempo: 0h 0min 0s
\`\`\`

## Casos límite a considerar

- Valores menores a 60.
- Múltiplos exactos de 3600.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

Las horas son el resultado de dividir el total entre 3600.

</details>
`;

const PROBLEM_001 = `# Problema 001 - El termómetro del cuarto de servidores

**Nivel:** 1 - Modelado simple
**Categoría:** Procesamiento de datos
**Enfoque POO:** Ninguno (problema procedural: el diseño de clases no aporta valor aquí)
**Dificultad estimada:** ⭐⭐☆☆☆

## Contexto del problema

Un sensor toma una lectura de temperatura cada hora.

## Preguntas de análisis previo (responder antes de programar)

1. ¿Qué entidades del mundo real identificas?
2. ¿Cómo sabes cuándo "termina" una racha de riesgo?

## Criterios de una buena solución

- El umbral se maneja con la desigualdad correcta.
- Las rachas largas se reportan completas.
`;

describe("extract-data", () => {
    test("counts the difficulty stars", () => {
        expect(countStars("⭐⭐☆☆☆")).toBe(2);
        expect(countStars("⭐☆☆☆☆")).toBe(1);
        expect(countStars(undefined)).toBe(0);
    });

    test("splits topics without breaking commas inside parentheses", () => {
        expect(
            splitTopics("operadores lógicos combinados (&&, ||), rangos, condicionales")
        ).toEqual(["operadores lógicos combinados (&&, ||)", "rangos", "condicionales"]);
        expect(splitTopics("clase Math (Math.PI, Math.pow), variables")).toEqual([
            "clase Math (Math.PI, Math.pow)",
            "variables",
        ]);
        expect(splitTopics("tema único")).toEqual(["tema único"]);
        expect(splitTopics(undefined)).toEqual([]);
    });

    test("groups numbered and bulleted lists", () => {
        const blocks = buildBlocks([
            "1. Primer punto",
            "2. Segundo punto",
            "",
            "- Con viñeta",
            "- Otra viñeta",
        ]);
        expect(blocks).toHaveLength(2);
        expect(blocks[0].type).toBe("list");
        expect(blocks[0].ordered).toBe(true);
        expect(blocks[0].items).toEqual(["Primer punto", "Segundo punto"]);
        expect(blocks[1].ordered).toBe(false);
        expect(blocks[1].items).toEqual(["Con viñeta", "Otra viñeta"]);
    });

    test("structures a trivial exercise", () => {
        const item = parseFile(
            "ejercicio-001-nivel-1-convertidor-de-tiempo-de-carrera.md",
            EXERCISE_001
        );

        expect(item.number).toBe(1);
        expect(item.collection).toBe("exercises");
        expect(item.title).toBe("Convertidor de tiempo de carrera");
        expect(item.level).toBe(1);
        expect(item.levelName).toBe("Básico I");
        expect(item.topics).toEqual(["variables", "operadores aritméticos"]);
        expect(item.difficulty).toBe(2);
        expect(item.category).toBeNull();
        expect(item.sections.map((section) => section.title)).toEqual([
            "Enunciado",
            "Instrucciones",
            "Firma sugerida",
            "Ejemplos de ejecución",
            "Casos límite a considerar",
            "Pistas (opcional, ocultables)",
        ]);

        const signature = item.sections.find((section) => section.title === "Firma sugerida");
        expect(signature.blocks[0].type).toBe("code");
        expect(signature.blocks[0].code).toMatch(/public class ConvertidorDeTiempo/);

        const examples = item.sections.find((section) => section.title === "Ejemplos de ejecución");
        expect(examples.blocks).toHaveLength(2);
        expect(examples.blocks[0].type).toBe("example");
        expect(examples.blocks[0].title).toBe("Ejemplo 1:");
        expect(examples.blocks[0].code).toMatch(/Salida: Tiempo: 2h 15min 30s/);

        const hints = item.sections.find((section) => section.title.startsWith("Pistas"));
        expect(hints.blocks[0].type).toBe("hint");
        expect(hints.blocks[0].summary).toBe("Ver pista");
        expect(hints.blocks[0].content[0].type).toBe("paragraph");
    });

    test("structures a design problem", () => {
        const item = parseFile(
            "problema-001-nivel-1-monitoreo-de-temperatura-del-servidor.md",
            PROBLEM_001
        );

        expect(item.number).toBe(1);
        expect(item.collection).toBe("problems");
        expect(item.title).toBe("El termómetro del cuarto de servidores");
        expect(item.levelName).toBe("Modelado simple");
        expect(item.category).toBe("Procesamiento de datos");
        expect(item.oopFocus).toBe(
            "Ninguno (problema procedural: el diseño de clases no aporta valor aquí)"
        );

        const questions = item.sections.find((section) =>
            section.title.startsWith("Preguntas de análisis")
        );
        expect(questions.blocks[0].type).toBe("list");
        expect(questions.blocks[0].ordered).toBe(true);
        expect(questions.blocks[0].items).toHaveLength(2);
    });

    test("matches the generated catalog", async () => {
        const path = new URL("../../web-javarcises/data/exercises.json", import.meta.url);
        const catalog = JSON.parse(await readFile(path, "utf8"));
        const collections = catalog.collections;
        expect(collections).toHaveLength(2);

        const exercises = collections.find((collection) => collection.key === "exercises");
        const problems = collections.find((collection) => collection.key === "problems");
        expect(exercises.items).toHaveLength(81);
        expect(problems.items).toHaveLength(30);

        const assertNoInternalFields = (blocks) => {
            for (const block of blocks) {
                expect("insideFence" in block).toBe(false);
                if (block.content) {
                    assertNoInternalFields(block.content);
                }
            }
        };

        for (const item of [...exercises.items, ...problems.items]) {
            expect(item.title.length).toBeGreaterThan(0);
            expect(item.level).toBeGreaterThanOrEqual(1);
            expect(item.sections.length).toBeGreaterThan(0);
            for (const section of item.sections) {
                assertNoInternalFields(section.blocks);
            }
        }
    });
});
