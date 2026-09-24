# Problema 015 - El control de medicamentos del dispensario

**Nivel:** 3 - Colecciones + lógica de negocio
**Categoría:** Gestión / CRUD conceptual
**Enfoque POO:** Composición (`Dispensario` gestiona una colección de `Medicamento`; cada medicamento agrupa sus lotes)
**Dificultad estimada:** ⭐⭐⭐☆☆

## Contexto del problema

El dispensario de la ESE comenzó a recibir medicamentos con su **lote** y su **fecha de vencimiento**, pero lleva el inventario en un cuaderno de apuntes: anota la entrada de un lote sobre la línea de un medicamento y tacha al ir entregando. El problema que le costó un llamado de atención a la directora es que en el anaquel aparecieron medicamentos **vencidos**, y otros que vencían **en menos de 30 días** seguían en la estantería como si fueran nuevos.

El dispensario registra cada lote con el día del año en que vence (1 al 365) y la cantidad de unidades recibidas. Necesitan un sistema de consola que, dado el **día actual**, les diga: qué hay en el anaquel por medicamento (agrupando sus lotes), qué se vence en los próximos 30 días, qué ya venció (se debe retirar), qué está con stock bajo, y que registre la **dispensa** de unidades descontando del lote correcto. La auxiliar quiere parar de adivinar con el cuaderno.

## Requisitos funcionales

- Registrar un medicamento con su lote, cantidad y día de vencimiento.
- Agrupar el inventario por nombre de medicamento, mostrando sus lotes con cantidades.
- Reportar: medicamentos **vencidos** (retirar), **próximos a vencer** (en 30 días o menos), y **stock bajo** (10 unidades o menos en total).
- Permitir dispensar unidades de un medicamento (descontando del lote que vence primero).
- Mostrar el inventario completo con totales por medicamento.

## Reglas de negocio / restricciones

- El número de lote es único en todo el inventario: no se pueden registrar dos lotes con el mismo identificador.
- Un medicamento puede tener **varios lotes** (con vencimientos distintos); al dispensar, se descuenta primero del lote que vence antes — en farmacia no se puede "guardar lo que vence pronto".
- Un medicamento **vencido** (vencimiento < día actual) no se puede dispensar: se reporta para retirar.
- "Próximo a vencer" es cuando faltan **30 días o menos** para vencer (incluido el mismo día, pero excluido lo ya vencido).
- No se puede dispensar más unidades de las disponibles (suma de todos los lotes); si se rechaza, ningún lote se toca.
- No se registran medicamentos con cantidad menor o igual a 0 ni con vencimiento fuera del 1 al 365.

## Lo que se espera que diseñes

- Identifica las clases: qué es un medicamento, qué es un lote y qué agrupa al sistema completo.
- Decide cómo guardar los lotes de un medicamento para saber cuál vence primero.
- Define dónde vive la lógica de "retirar vencidos", "próximos a vencer" y "stock bajo" para no repetirla en cada reporte.
- Argumenta qué gana el modelo al distinguir `Medicamento` de `Lote` en vez de guardar solo líneas de texto.

*(No se entrega una firma de clases predefinida: el diseño es parte del ejercicio.)*

## Ejemplos de comportamiento esperado

**Escenario 1 (dispensa por orden de vencimiento):**
```
Entrada / acción: medicamento "Acetaminofén" con lote L1 vence día 100 (cantidad 50) y lote L2 vence día 180 (cantidad 40); día actual 90; dispensar 60
Resultado esperado: se descuentan 50 del lote L1 y 10 del lote L2 (primero el que vence antes)
```

**Escenario 2 (medicamento vencido no se dispensa):**
```
Entrada / acción: lote con vencimiento día 80, día actual 90, intentar dispensar
Resultado esperado: se rechaza la dispensa; el medicamento aparece en el reporte de "vencidos"
```

**Escenario 3 (reportes de alerta):**
```
Entrada / acción: día actual 150, inventario base (según lotes registrados)
Resultado esperado: se marca "próximo a vencer" todo lote con vencimiento entre 151 y 180, y "stock bajo" si el total del medicamento es ≤ 10
```

**Escenario 4 (lote duplicado):**
```
Entrada / acción: intentar registrar el lote L1 que ya existe en otro medicamento
Resultado esperado: se rechaza el registro; el inventario queda intacto
```

## Preguntas de análisis previo (responder antes de programar)

1. ¿Qué entidades del mundo real identificas y qué atributos y comportamientos tiene cada una?
2. ¿Cómo se comporta la dispensa cuando un medicamento tiene lotes con vencimientos distintos?
3. ¿Dónde y cuándo haces los límites de las alertas (30 días, 10 unidades) para que sean fáciles de cambiar?
4. ¿Qué podría salir mal? (lote duplicado, dispensar de más, vencimiento mal ingresado, reporte que mezcla lotes)

## Pistas de diseño (opcional, ocultables)

<details>
<summary>Ver pista de diseño</summary>

Si cada `Medicamento` guarda sus lotes en una estructura que se pueda recorrer ordenada por vencimiento, la dispensa "primero lo que vence antes" se vuelve un recorrido simple. Las alertas (vencido, próximo, stock bajo) se pueden calcular a partir del día actual sin necesidad de un reloj interno.

</details>

## Criterios de una buena solución

- La dispensa descuenta siempre del lote que vence antes por cada medicamento, y nunca excede el total disponible.
- Los límites de alerta (30 días, 10 unidades) y la exclusión de lo ya vencido son exactos en los bordes.
- Un mismo medicamento con varios lotes se reporta agrupado sin confundir sus cantidades.
- Los rechazos (lote duplicado, cantidad inválida, vencimiento fuera de rango) no dejan residuos en el inventario.
- Agregar un medicamento nuevo o un reporte nuevo no obliga a tocar la lógica de dispensa.
