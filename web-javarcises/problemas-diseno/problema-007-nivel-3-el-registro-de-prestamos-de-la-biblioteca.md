# Problema 007 - El registro de préstamos de la biblioteca comunitaria

**Nivel:** 3 - Colecciones + lógica de negocio
**Categoría:** Gestión / CRUD conceptual
**Enfoque POO:** Ninguno (problema de gestión de registros y reglas: la dificultad está en las reglas de préstamo, no en el modelado)
**Dificultad estimada:** ⭐⭐⭐☆☆

## Contexto del problema

La biblioteca comunitaria del barrio presta libros a los vecinos. Hasta ahora el préstamo funciona con un cuaderno: se anota quién se llevó qué libro, más o menos cuándo, y cuando lo devuelven se tacha la línea. Con ese método ya hubo dos libros "perdidos" que nadie pudo reclamar porque no se sabía en manos de quién estaban, y la multa de $500 por día de atraso se cobra "de buena fe", según lo que recuerde la bibliotecaria.

La presidenta de la junta consiguió un computador reacondicionado para la biblioteca y pide un programa simple de consola para reemplazar el cuaderno. Los préstamos quedan con una **fecha numérica del año** (día 1 al 365; la bibliotecaria escribe el número del día en que ocurre cada evento) y el sistema se encarga de las cuentas: qué libros están prestados, quién está en mora, cuántos días de atraso y cuánta multa corresponde.

Las reglas de préstamo ya existen en un reglamento: cada libro se presta por **14 días**, nadie puede tener más de **3 préstamos activos**, y un libro prestado no se presta de nuevo hasta que regrese.

## Requisitos funcionales

- Registrar un préstamo: libro, usuario y el día del año en que se presta.
- Registrar una devolución: libro, usuario y el día en que regresa.
- Reportar los préstamos activos (libros en manos de quién y en qué día vencen).
- Reportar las devoluciones vencidas (día en que debió regresar, días de atraso y multa).
- Mostrar el total de multas acumuladas en lo que va del año.

## Reglas de negocio / restricciones

- Cada préstamo vence **exactamente 14 días** después de prestarse: si se presta el día 100, vence el día 114.
- Un usuario no puede tener más de **3 préstamos activos** a la vez.
- Un libro **no se puede prestar** si ya está prestado y sin devolver.
- La multa es **$500 por cada día de atraso**, pero nunca puede superar el valor del libro (si el libro vale $15.000 y la cuenta da $20.000, la multa es $15.000).
- Si la devolución llega el día del vencimiento o antes, no hay multa.
- No se puede registrar una devolución de un préstamo que no está activo (o porque no existe o porque ya fue devuelto).
- Un libro y un usuario se identifican por un código entero; no puede haber dos libros ni dos usuarios con el mismo código.

## Lo que se espera que diseñes

- Elige la estructura para guardar los préstamos activos y poder consultarlos rápido por libro y por usuario.
- Decide cómo registrar el historial de devoluciones vencidas para el reporte de multas.
- Define dónde vive cada regla (devolver, multa, límites) para que no se repita en cada menú del programa.
- Argumenta si la complejidad del dominio amerita clases propias o si un programa organizado en funciones basta.

*(No se entrega una firma de clases predefinida: el diseño es parte del ejercicio.)*

## Ejemplos de comportamiento esperado

**Escenario 1 (devolución a tiempo):**
```
Entrada / acción: préstamo del día 100 (vence 114); devolución el día 113
Resultado esperado: sin multa, el préstamo queda cerrado y no aparece en activos ni en vencidos
```

**Escenario 2 (devolución vencida con tope):**
```
Entrada / acción: libro valor $15.000, prestado el día 50, devuelto el día 100 (50 días de atraso → $25.000)
Resultado esperado: multa de $15.000 (tope del valor del libro), no $25.000
```

**Escenario 3 (libro ya prestado):**
```
Entrada / acción: intentar prestar el libro 12 cuando ya está prestado y sin devolver
Resultado esperado: se rechaza el préstamo; el préstamo original sigue activo
```

**Escenario 4 (usuario con 3 préstamos):**
```
Entrada / acción: un usuario ya tiene 3 préstamos activos y pide un cuarto libro
Resultado esperado: se rechaza el préstamo con el motivo (cupo de 3 alcanzado)
```

## Preguntas de análisis previo (responder antes de programar)

1. ¿Qué información necesita un préstamo para ser consultado y cancelado sin ambigüedad?
2. ¿Cómo verificas en una misma operación el cupo del usuario y la disponibilidad del libro?
3. ¿Qué pasa con la multa si el libro se prestó el día 360 y se devuelve el día 5 del año siguiente? ¿Cómo habla el reglamento de eso?
4. ¿Qué podría salir mal? (devoluciones de préstamos inexistentes, libro prestado dos veces, días invertidos en la devolución)

## Pistas de diseño (opcional, ocultables)

<details>
<summary>Ver pista de diseño</summary>

Si los préstamos vigentes se guardan de forma que se pueda consultar "¿está prestado este libro?" y "¿cuántos activos tiene este usuario?", las reglas de rechazo se vuelven consultas simples. Llevar las cuentas de multa por separado del préstamo activo (una vez devuelto) evita borrar información que el reporte del año necesita.

</details>

## Criterios de una buena solución

- Las tres reglas de negocio (vencimiento, cupo de 3, libro no repetido) se aplican siempre y en el orden correcto.
- La multa nunca supera el valor del libro, ni por debajo de lo que le corresponde en días.
- Un mismo préstamo no puede aparecer a la vez como activo y como vencido.
- Las consultas pedidas (activos, vencidos, total de multas) se pueden responder sin recorrer todo el historial cada vez.
- El registro de un préstamo que se rechaza no deja residuos en ninguna estructura.
