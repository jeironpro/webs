# Problema 017 - La facturación con impuestos de la ferretería

**Nivel:** 2 - Composición básica
**Categoría:** Modelado de negocio
**Enfoque POO:** Composición (`Factura` contiene varias líneas de `Producto` con cantidad y precio; el total se calcula dentro de la factura)
**Dificultad estimada:** ⭐⭐⭐☆☆

## Contexto del problema

La ferretería de la esquina factura a mano y su cajera tiene que calcular a lápiz cada total, aplicarle el IVA cuando corresponde y restar el descuento por volumen que ofrece el dueño. A la salida del mes, la contadora se queja de que las facturas nunca cuadran con las ventas.

Las reglas de la ferretería son: cada línea lleva un producto con cantidad y precio unitario; si se compran **3 o más unidades del mismo producto** se descuenta el **5%** y si son **10 o más** se descuenta el **10%** (el mayor descuento, nunca ambos); el **IVA del 19%** se cobra solo sobre los productos **gravables** (los exentos no lo pagan); y cada línea se redondea al peso más cercano para que el total no arrastre centavos.

El dueño quiere un programita donde se levante una venta línea a línea y al final salgan claros: el subtotal, el total de descuentos, el IVA y el total a pagar. Al cierre, quiere también un **resumen del día**: cuántas facturas se hicieron, cuánto se vendió en total y cuánto IVA se recaudó, para entregarlo a la contadora sin volver a sumar nada.

## Requisitos funcionales

- Registrar una factura agregando productos (nombre, categoría gravable o exenta, cantidad, precio unitario).
- Calcular cada línea: neto bruto, descuento por volumen, IVA si es gravable y redondeo al peso.
- Mostrar la factura: líneas, subtotal, total de descuentos, IVA total y total a pagar.
- Registrar varias facturas y mostrar al cierre: número de facturas, total vendido y total de IVA recaudado.

## Reglas de negocio / restricciones

- Cantidad y precio deben ser **mayores a 0**; una línea inválida se rechaza sin modificar la factura.
- Descuento por cantidad en cada línea: **3 a 9 unidades → 5%**, **10 o más → 10%**; se aplica el mayor y nunca se acumulan.
- IVA del **19%** solo sobre productos gravables; los exentos no generan IVA.
- Cada línea se **redondea al peso más cercano** antes de sumarse a la factura.
- Una factura debe tener al menos una línea; el sistema no emite facturas sin artículos.
- Un producto en una factura vendida no puede modificarse una vez agregado: para corregir, se quita y se agrega de nuevo.

## Lo que se espera que diseñes

- Identifica las clases y su relación: qué es una factura y qué es una línea de producto.
- Decide si el descuento y el IVA viven en la línea o en la factura, y en qué orden se aplican.
- Define cómo llevar el acumulado del día sin depender de facturas ya cerradas.
- Argumenta qué gana el diseño si el dueño cambia el IVA o agrega un descuento nuevo, sin reescribir la factura.

*(No se entrega una firma de clases predefinida: el diseño es parte del ejercicio.)*

## Ejemplos de comportamiento esperado

**Escenario 1 (línea gravable con 2 unidades, sin descuento):**
```
Entrada / acción: "clavo en C" gravable, 2 × $2.000
Resultado esperado: neto $4.000 sin descuento; IVA 19% = $760; total de la línea $4.760
```

**Escenario 2 (descuento por volumen en 3 unidades):**
```
Entrada / acción: "pintura" gravable, 3 × $10.000
Resultado esperado: neto $30.000 − 5% = $28.500; IVA 19% = $5.415; total de la línea $33.915
```

**Escenario 3 (límite exacto de descuento):**
```
Entrada / acción: "malla" exenta, 9 unidades vs 10 unidades al mismo precio
Resultado esperado: con 9 → descuento 5%; con 10 → descuento 10% (nunca 5% + 10%)
```

**Escenario 4 (producto exento no paga IVA):**
```
Entrada / acción: "masilla" exenta, 2 × $5.000
Resultado esperado: neto $10.000, sin descuento, IVA $0 → total de la línea $10.000
```

**Escenario 5 (línea rechazada):**
```
Entrada / acción: intentar agregar una línea con cantidad 0 o precio negativo
Resultado esperado: se rechaza la línea y la factura queda como estaba
```

**Escenario 6 (resumen del día):**
```
Entrada / acción: dos facturas registradas (una de $47.675 y otra de $10.000)
Resultado esperado: resumen con 2 facturas, total vendido $57.675 y IVA acumulado según lo efectivamente facturado
```

## Preguntas de análisis previo (responder antes de programar)

1. ¿Qué entidades del mundo real identificas y qué atributos y comportamientos tiene cada una?
2. ¿En qué orden se aplican descuento, IVA y redondeo dentro de una línea para que el total sea determinista?
3. ¿Cómo acumulas el resumen del día sin que una factura cerrada vuelva a contar?
4. ¿Qué podría salir mal? (cantidades y precios inválidos, mezcla gravable/exento, redondeo que descuadra la suma, facturas sin artículos)

## Pistas de diseño (opcional, ocultables)

<details>
<summary>Ver pista de diseño</summary>

Si la línea de producto calcula su propio neto, descuento e IVA, la factura solo suma resultados ya listos. El orden importa: primero el descuento sobre el neto, luego el IVA sobre ese neto descontado, y por último el redondeo de la línea antes de acumular.

</details>

## Criterios de una buena solución

- El descuento se elige por el escalón correcto (5% de 3 a 9, 10% desde 10) sin acumularse.
- El IVA se aplica solo a lo gravable y después del descuento, y el redondeo por línea no descuadra el total.
- El total a pagar es la suma exacta de las líneas mostradas en la factura.
- El resumen del día solo suma facturas cerradas y cuadra con los totales de cada una.
- Cambiar el porcentaje de IVA o los escalones de descuento no obliga a reescribir la estructura de la factura.
