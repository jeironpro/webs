// Tests del parser de markdown (scripts/extract-data.js) con node --test.
// Se ejecutan con: npm test

import assert from "node:assert/strict";
import test from "node:test";
import { buildBlocks, countStars, parseFile, splitTopics } from "./extract-data.js";

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
        // Tu código aquí
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

test("countStars counts the difficulty", () => {
    assert.equal(countStars("⭐⭐☆☆☆"), 2);
    assert.equal(countStars("⭐☆☆☆☆"), 1);
    assert.equal(countStars(undefined), 0);
});

test("splitTopics respects commas inside parentheses", () => {
    assert.deepEqual(splitTopics("operadores lógicos combinados (&&, ||), rangos, condicionales"), [
        "operadores lógicos combinados (&&, ||)",
        "rangos",
        "condicionales",
    ]);
    assert.deepEqual(splitTopics("clase Math (Math.PI, Math.pow), variables"), [
        "clase Math (Math.PI, Math.pow)",
        "variables",
    ]);
    assert.deepEqual(splitTopics("tema único"), ["tema único"]);
    assert.deepEqual(splitTopics(undefined), []);
});

test("buildBlocks groups numbered and bulleted lists", () => {
    const blocks = buildBlocks([
        "1. Primer punto",
        "2. Segundo punto",
        "",
        "- Con viñeta",
        "- Otra viñeta",
    ]);
    assert.equal(blocks.length, 2);
    assert.equal(blocks[0].type, "list");
    assert.equal(blocks[0].ordered, true);
    assert.deepEqual(blocks[0].items, ["Primer punto", "Segundo punto"]);
    assert.equal(blocks[1].ordered, false);
    assert.deepEqual(blocks[1].items, ["Con viñeta", "Otra viñeta"]);
});

test("parseFile structures a trivial exercise", () => {
    const item = parseFile(
        "ejercicio-001-nivel-1-convertidor-de-tiempo-de-carrera.md",
        EXERCISE_001
    );

    assert.equal(item.number, 1);
    assert.equal(item.collection, "exercises");
    assert.equal(item.title, "Convertidor de tiempo de carrera");
    assert.equal(item.level, 1);
    assert.equal(item.levelName, "Básico I");
    assert.deepEqual(item.topics, ["variables", "operadores aritméticos"]);
    assert.equal(item.difficulty, 2);
    assert.equal(item.category, null);

    assert.deepEqual(
        item.sections.map((section) => section.title),
        [
            "Enunciado",
            "Instrucciones",
            "Firma sugerida",
            "Ejemplos de ejecución",
            "Casos límite a considerar",
            "Pistas (opcional, ocultables)",
        ]
    );

    const firma = item.sections.find((section) => section.title === "Firma sugerida");
    assert.equal(firma.blocks[0].type, "code");
    assert.match(firma.blocks[0].code, /public class ConvertidorDeTiempo/);

    const ejemplos = item.sections.find((section) => section.title === "Ejemplos de ejecución");
    assert.equal(ejemplos.blocks.length, 2);
    assert.equal(ejemplos.blocks[0].type, "example");
    assert.equal(ejemplos.blocks[0].title, "Ejemplo 1:");
    assert.match(ejemplos.blocks[0].code, /Salida: Tiempo: 2h 15min 30s/);

    const pistas = item.sections.find((section) => section.title.startsWith("Pistas"));
    assert.equal(pistas.blocks[0].type, "hint");
    assert.equal(pistas.blocks[0].summary, "Ver pista");
    assert.equal(pistas.blocks[0].content[0].type, "paragraph");
});

test("parseFile structures a design problem", () => {
    const item = parseFile(
        "problema-001-nivel-1-monitoreo-de-temperatura-del-servidor.md",
        PROBLEM_001
    );

    assert.equal(item.number, 1);
    assert.equal(item.collection, "problems");
    assert.equal(item.title, "El termómetro del cuarto de servidores");
    assert.equal(item.levelName, "Modelado simple");
    assert.equal(item.category, "Procesamiento de datos");
    assert.equal(
        item.oopFocus,
        "Ninguno (problema procedural: el diseño de clases no aporta valor aquí)"
    );

    const preguntas = item.sections.find((section) =>
        section.title.startsWith("Preguntas de análisis")
    );
    assert.equal(preguntas.blocks[0].type, "list");
    assert.equal(preguntas.blocks[0].ordered, true);
    assert.equal(preguntas.blocks[0].items.length, 2);
});

// Integración: los datos generados deben coincidir con el catálogo real.
test("data/exercises.js contains the expected collections", async () => {
    const { JAVARCISES } = await import("../data/exercises.js");
    const collections = JAVARCISES.collections;
    assert.equal(collections.length, 2);

    const exercises = collections.find((collection) => collection.key === "exercises");
    const problems = collections.find((collection) => collection.key === "problems");
    assert.equal(exercises.items.length, 81);
    assert.equal(problems.items.length, 30);

    const assertNoInternalFields = (blocks) => {
        for (const block of blocks) {
            assert.equal("insideFence" in block, false, "no se filtran campos internos");
            if (block.content) {
                assertNoInternalFields(block.content);
            }
        }
    };

    for (const item of [...exercises.items, ...problems.items]) {
        assert.ok(item.title.length > 0, "todo ítem tiene título");
        assert.ok(item.level >= 1, "todo ítem tiene nivel");
        assert.ok(item.sections.length > 0, "todo ítem tiene al menos una sección");
        for (const section of item.sections) {
            assertNoInternalFields(section.blocks);
        }
    }
});
