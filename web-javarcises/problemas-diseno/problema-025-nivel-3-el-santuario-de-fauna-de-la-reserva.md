# Problema 025 - El santuario de fauna de la reserva

**Nivel:** 3 - Colecciones + lógica de negocio
**Categoría:** Sistemas con jerarquías
**Enfoque POO:** Composición (`Santuario` gestiona `Recinto`, `Especie` y `Animal`; las reglas de convivencia viven en el santuario y cada recinto conoce su propia carga)
**Dificultad estimada:** ⭐⭐⭐☆☆

## Contexto del problema

La reserva ecológica del municipio rehabilitó animales en peligro y quinnienen un **santuario** con recintos para que vivan en semilibertad. Cada especie tiene una **dieta** (carnívora, herbívora u omnívora) y una **ración diaria** de comida por animal; cada recinto tiene una capacidad máxima de animales.

Las reglas de convivencia las puso la veterinaria y no se violan: dos especies comparten recinto **solo si tienen la misma dieta** (un carnívoro nunca con un herbívoro ni con un omnívoro), y si una especie está **en peligro de extinción**, su recinto admite **únicamente a esa especie**, sin excepciones.

Necesitan un sistema que registre especies, animales y recintos; asigne cada animal a un recinto validando dieta, peligro y capacidad; y calcule al final del día **cuánta comida necesita el santuario en total**. El cuidador quiere también un reporte por recinto (qué hay y cuántos) y la lista de especies en peligro, para priorizar inspecciones. Hasta ahora todo se sabe "por la memoria del cuidador mayor", y eso ya hizo volar un siniestro par de especies que no debían compartir.

## Requisitos funcionales

- Registrar especies (nombre, dieta, ración diaria por animal y si está en peligro). El nombre de especie es único.
- Registrar recintos (número único y capacidad máxima de animales).
- Registrar animales (nombre único global y su especie) y asignarlos a un recinto.
- Alimentar el recinto: mostrar la ración total diaria que consume cada recinto.
- Mostrar el total de comida diaria de todo el santuario, el inventario por recinto y las especies en peligro.

## Reglas de negocio / restricciones

- **Dieta:** un recinto solo admite animales de una única dieta (todas las especies que comparten el recinto deben tener la misma dieta).
- **En peligro:** si el recinto ya tiene una especie **en peligro**, solo admite a esa especie, aunque otra tenga la misma dieta.
- **Capacidad:** el número de animales de un recinto no puede superar su capacidad.
- Cada animal pertenece a una sola especie y ninguna especie distinta puede "invadir" un recinto con reglas incompatibles.
- Los nombres (especie, animal y número de recinto) son identificadores únicos; un duplicado se rechaza.
- Rechazos: si una asignación viola dieta, peligro o capacidad, se comunica con claridad y el santuario queda intacto.

## Lo que se espera que diseñes

- Identifica las clases (especie, animal, recinto, santuario) y qué responsabilidades repartes.
- Decide qué regla de convivencia valida el santuario al momento de asignar y qué datos necesita el recinto para confirmarla.
- Define cómo calcular la ración diaria de un recinto y del santuario sin repetir recorridos.
- Argumenta dónde vive la regla "en peligro no comparte" para que no se escape en ninguna asignación nueva.

*(No se entrega una firma de clases predefinida: el diseño es parte del ejercicio.)*

## Ejemplos de comportamiento esperado

**Escenario 1 (comparten misma dieta):**
```
Entrada / acción: recinto 1 (cap. 4) con 2 loros (omnívoros) y 1 mono (omnívoro)
Resultado esperado: asignación válida; el recinto queda con 3 de 4 cupos
```

**Escenario 2 (dieta distinta se rechaza):**
```
Entrada / acción: intentar meter un puma (carnívoro) al recinto 1 que ya tiene loros (omnívoros)
Resultado esperado: se rechaza por dieta incompatible; el recinto queda como estaba
```

**Escenario 3 (especie en peligro no comparte):**
```
Entrada / acción: el recinto 2 es el único hogar del tigrillo (en peligro); intentar meter otro omnívoro
Resultado esperado: se rechaza (el recinto de una especie en peligro solo admite esa especie)
```

**Escenario 4 (capacidad excedida):**
```
Entrada / acción: recinto 1 tiene 4 animales y su capacidad es 4; asignar el quinto
Resultado esperado: rechazo por capacidad; el inventario del recinto no cambia
```

**Escenario 5 (razón diaria total):**
```
Entrada / acción: el santuario tiene 2 recintos: uno con 3 loros (0,4 kg c/u) y otro con 2 pumas (2,5 kg c/u)
Resultado esperado: total diario = 1,2 + 5,0 = 6,2 kg
```

**Escenario 6 (identificador duplicado):**
```
Entrada / acción: registrar a "Misu" cuando ya existe un animal "Misu"
Resultado esperado: rechazo del duplicado; el animal original permanece
```

## Preguntas de análisis previo (responder antes de programar)

1. ¿Qué entidades del mundo real identificas y qué atributos y comportamientos tiene cada una?
2. ¿Cuál es la condición exacta para que dos especies puedan convivir en un recinto (dieta + peligro)?
3. ¿Cómo evitas que una asignación fallida deje datos a medias en el recinto?
4. ¿Qué podría salir mal? (especie sin asignación, recinto vacío, nombres duplicados, ración por especie vs por animal, cambios de dieta)

## Pistas de diseño (opcional, ocultables)

<details>
<summary>Ver pista de diseño</summary>

Haz que el recinto sea quien "diga" si puede recibir a un animal: él conoce su dieta actual, si tiene especie en peligro y cuánto cupo le queda. El santuario solo pregunta y registra si la respuesta fue sí, y guarda los rechazos como mensajes claros sin tocar el estado.

</details>

## Criterios de una buena solución

- Las tres reglas (dieta, peligro, capacidad) se respetan en todas las asignaciones, incluyendo las que llegan al límite exacto de capacidad.
- Un rechazo nunca deja al recinto con cupos o animales duplicados.
- La ración diaria por recinto y del santuario se calcula con el conteo real de animales de cada especie.
- El reporte por recinto y la lista de especies en peligro salen siempre consistentes.
- Agregar una especie, animal o recinto nuevo no obliga a repetir las validaciones en otro lado del código.
