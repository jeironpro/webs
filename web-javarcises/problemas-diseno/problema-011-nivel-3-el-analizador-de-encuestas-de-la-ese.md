# Problema 011 - El analizador de encuestas de la ESE

**Nivel:** 3 - Colecciones + lógica de negocio
**Categoría:** Procesamiento de datos
**Enfoque POO:** Ninguno (problema de parseo y agregación de datos: la calidad está en manejar bien el texto y las reglas, no en las clases)
**Dificultad estimada:** ⭐⭐⭐☆☆

## Contexto del problema

El gerente de una Empresa Social del Estado (ESE) quiere medir la satisfacción de los usuarios de su centro de salud. Al salir, cada usuario responde una encuesta breve en un terminal: elige una de las **cuatro dimensiones** (Atencion, Instalaciones, Tiempos, Comunicacion) y la califica con una nota entera de 1 a 5.

Las respuestas llegan al sistema como líneas de texto, una por usuario, con el formato `Dimension:Nota` (por ejemplo `Atencion:4`). El gerente quiere un resumen mensual: el promedio por dimensión, cuántas respuestas recibió cada una, un **semáforo** que marque en riesgo a toda dimensión con promedio menor a 3.0, y el promedio general del mes. También quiere saber cuál fue la dimensión que salió peor calificada, para priorizar el plan de mejora.

El problema de hoy es que las respuestas llegan a mano y a veces vienen mal digitadas (`atencio:n4`, `Atencion : 4`, `Instalaciones:9`, una dimensión inventada...). El sistema debe tolerar esos errores por línea sin tirar todo el mes: reportar la línea defectuosa con su número y seguir procesando el resto.

## Requisitos funcionales

- Leer las líneas de respuesta en formato `Dimension:Nota`.
- Agrupar y promediar las notas por dimensión (con un decimal).
- Mostrar: promedio y número de respuestas de cada dimensión, semáforo en riesgo (promedio < 3.0), promedio general y dimensión peor calificada.
- Reportar las líneas inválidas indicando el número de línea y el motivo, sin detener el resto del proceso.

## Reglas de negocio / restricciones

- Dimensiones válidas: `Atencion`, `Instalaciones`, `Tiempos`, `Comunicacion`; se aceptan en cualquier combinación de mayúsculas/minúsculas (`ATENCION`, `atencion`).
- La nota debe ser un entero del 1 al 5. Cualquier otro número (0, 9, 3.5) invalida la línea.
- El formato debe ser exactamente `Dimension:Nota`, sin espacios extra, otros separadores ni texto de más.
- Una dimensión desconocida invalida la línea.
- Si no hay ninguna línea válida en todo el mes, el sistema lo dice y no intenta calcular promedios.
- Una dimensión con promedio menor a 3.0 queda marcada **EN RIESGO** y debe resaltarse en el reporte.

## Lo que se espera que diseñes

- Elige la estructura para acumular (notas) y (conteo) por dimensión, de modo que al final puedas calcular promedios sin una segunda pasada.
- Decide cómo separar y validar cada línea de forma que el formato, la dimensión y la nota se revisen en orden claro.
- Define qué hace el proceso ante una línea inválida (qué guarda, qué reporta, cómo sigue).
- Argumenta si el dominio amerita clases propias o si una función bien organizada por pasos (validar → acumular → reportar) alcanza.

*(No se entrega una firma de clases predefinida: el diseño es parte del ejercicio.)*

## Ejemplos de comportamiento esperado

**Escenario 1 (mes normal):**
```
Entrada / acción:
  Atencion:4
  Instalaciones:3
  Atencion:2
  Tiempos:5
  Comunicacion:1
Resultado esperado:
  Atencion: 2 respuestas, promedio 3.0 — EN RIESGO
  Instalaciones: 1 respuesta, promedio 3.0 — EN RIESGO
  Tiempos: 1 respuesta, promedio 5.0 — OK
  Comunicacion: 1 respuesta, promedio 1.0 — EN RIESGO
  Promedio general: 3.0
  Peor dimensión: Comunicacion
```

**Escenario 2 (líneas defectuosas):**
```
Entrada / acción:
  Atencion:4
  atencio:n4
  Instalaciones : 3
  Instalaciones:9
Resultado esperado: el promedio usa solo la línea válida (Atencion:4) e Instalaciones queda sin respuestas válidas (0 respuestas, sin promedio); las líneas 2, 3 y 4 se reportan con su causa
```

**Escenario 3 (mes sin respuestas válidas):**
```
Entrada / acción: todas las líneas con formato incorrecto
Resultado esperado: mensaje de "no hay respuestas válidas" y no se muestra ningún promedio
```

## Preguntas de análisis previo (responder antes de programar)

1. ¿Qué piezas de información necesitas de cada línea válida y cómo las corriges o rechazas en conjunto?
2. ¿Cómo manejas que una línea inválida no contamine los promedios de la misma dimensión?
3. ¿Qué pasa con las dimensiones que no reciben ninguna respuesta válida? ¿Deben aparecer en el reporte?
4. ¿Qué podría salir mal? (números con punto decimal, letras en la nota, espacios, líneas vacías, dimensión duplicada en línea)

## Pistas de diseño (opcional, ocultables)

<details>
<summary>Ver pista de diseño</summary>

Guardar dos acumuladores por dimensión —suma de notas y cantidad— permite calcular promedios al final sin repasar las líneas. Para validar una línea, divide el problema: primero el formato (que haya exactamente un `:` y sin sobras), luego la dimensión (normaliza mayúsculas a comparar contra la lista fija), y por último la nota.

</details>

## Criterios de una buena solución

- Las cuatro dimensiones se promedian con sus propios datos y el semáforo marca correctamente el límite en 3.0 (3.0 sí es riesgo).
- Las líneas inválidas se reportan con número de línea y causa, y nunca entran a los promedios.
- Una dimensión sin respuestas válidas no fabrica un promedio falso.
- El promedio general y el peor dimensión se calculan solo sobre respuestas válidas.
- El formato del reporte es estable aunque cambie la cantidad de líneas del mes.
