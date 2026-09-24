# Problema 027 - El costeo de recetas del restaurante de barrio

**Nivel:** 3 - Colecciones + lógica de negocio
**Categoría:** Modelado de negocio
**Enfoque POO:** Composición (`Receta` contiene una lista de `Ingrediente` con cantidades; el costeo vive en la receta unificando las unidades)
**Dificultad estimada:** ⭐⭐⭐☆☆

## Contexto del problema

El restaurante de la esquina sirve platos caseros, pero la dueña cobra "lo que le parece" porque no sabe cuánto gastan en cada receta. Compró sus ingredientes a granel y quiere un programa que le diga **cuánto cuesta hacer cada plato** para ponerle precio sin perder plata.

Cada ingrediente se compra en una **unidad base**: la harina se compra por **kilo** ($4.000/kg), el aceite por **litro** ($9.000/L), los huevos por **unidad** ($500/u). Pero en las recetas las cantidades se escriben como viene en el libro: 500 gramos de harina, 150 mililitros de aceite, 2 huevos. El programa debe **unificar las unidades** (gramos→kilo, mililitros→litro) para costear cada receta y saber el **costo por porción**, que es lo que la dueña necesita para cobrar.

Las recetas se guardan con su nombre (único) y su número de porciones. La dueña quiere también saber cuál es la **receta más costosa** del menú, para cobrarla distinto, y que las cantidades mal digitadas (unidades que no corresponden al ingrediente, precios o cantidades negativas) se rechacen sin tumbar el menú.

## Requisitos funcionales

- Registrar ingredientes con su nombre (único), unidad base (`kg`, `litro` o `u`) y precio por unidad base.
- Registrar una receta con su número de porciones y sus ingredientes con (cantidad, unidad).
- Calcular el costo de cada receta unificando gramos/kilos y mililitros/litros.
- Mostrar costo total por receta y **costo por porción** (con dos decimales).
- Mostrar el menú y destacar la receta más costosa; rechazar registros inválidos con su motivo.

## Reglas de negocio / restricciones

- Unidades: de masa `kg` y `g` (1 kg = 1000 g); de volumen `litro` y `mL` (1 litro = 1000 mL); y `u` (unidad), que solo acepta cantidades en `u`.
- Un ingrediente de base `kg` acepta cantidades en `kg` o `g`; uno de base `litro` acepta `litro` o `mL`; uno de base `u` acepta solo `u`. **Mezclar unidades de masa con volumen se rechaza.**
- El costo de cada línea = `cantidad (unificada a la unidad base) × precio por unidad base`.
- El número de porciones debe ser un entero `≥ 1`; los precios y cantidades deben ser `> 0`.
- Nombres de ingredientes y de recetas únicos; duplicados se rechazan.
- El costo total y el por porción se presentan con **dos decimales**, sin errores por acumulación.

## Lo que se espera que diseñes

- Identifica las clases (`Ingrediente`, `Receta`, y lo que haga falta para el menú) y sus responsabilidades.
- Decide cómo convertir gramos→kg y mililitros→litro sin repetir la tabla de conversión por línea.
- Define dónde se valida que la unidad de la receta corresponde a la del ingrediente (y la rechaza si no).
- Argumenta qué gana el diseño si mañana la receta usa otra unidad nueva (ej. `onza`).

*(No se entrega una firma de clases predefinida: el diseño es parte del ejercicio.)*

## Ejemplos de comportamiento esperado

**Escenario 1 (conversión gramos → kg):**
```
Entrada / acción: harina ($4.000/kg), receta con 500 g de harina
Resultado esperado: 500 g = 0,5 kg → línea de $2.000
```

**Escenario 2 (conversión mL → litro):**
```
Entrada / acción: aceite ($9.000/litro), receta con 150 mL
Resultado esperado: 150 mL = 0,15 L → línea de $1.350
```

**Escenario 3 (costo por porción):**
```
Entrada / acción: receta "torta" (4 porciones), costo total $8.520
Resultado esperado: costo por porción = $2.130,00
```

**Escenario 4 (unidad incompatible):**
```
Entrada / acción: agregar 2 kg de "aceite" (que es de base litro) en una receta
Resultado esperado: rechazo por unidad incompatible; la receta queda igual
```

**Escenario 5 (receta más costosa):**
```
Entrada / acción: menú con "torta" ($8.520) y "jugo" ($1.350)
Resultado esperado: el menú destaca "torta" como la más costosa
```

**Escenario 6 (registro inválido):**
```
Entrada / acción: precio negativo de un ingrediente, o porciones en 0
Resultado esperado: rechazo con el motivo; el menú existente permanece intacto
```

## Preguntas de análisis previo (responder antes de programar)

1. ¿Qué atributos tiene un ingrediente y qué necesita una receta para costearlo sin ambigüedad?
2. ¿Cómo conviertes cualquier cantidad a la unidad base del ingrediente en un solo punto del código?
3. ¿Cuándo sabes que mezclaste unidades incompatibles y cómo lo distingues de una cantidad válida en otra unidad?
4. ¿Qué podría salir mal? (receta sin ingredientes, conversión mal aplicada, decimales que se pierden, nombres duplicados)

## Pistas de diseño (opcional, ocultables)

<details>
<summary>Ver pista de diseño</summary>

Guarda en el ingrediente el factor que convierte su unidad base a gramos/litros/unidades (por ejemplo, `1 g = 0,001 kg`). Cuando la receta agrega una línea, usa el factor correspondiente para dejar cada cantidad "en casa base" y ahí multiplicar por el precio. Así la tabla de conversión vive en un solo lugar.

</details>

## Criterios de una buena solución

- Todas las conversiones (g→kg, mL→litro y las directas en `u`) son correctas y sin acumular errores de redondeo.
- Las unidades incompatibles (masa con volumen) se rechazan y las válidas en la misma familia se aceptan en cualquiera de sus formas.
- El costo total y el por porción usan dos decimales consistentes a lo largo del menú.
- La receta más costosa se detecta según el costo total (no por porción), como pide la dueña.
- Agregar una unidad nueva o un ingrediente nuevo no exige reescribir el costeo.
