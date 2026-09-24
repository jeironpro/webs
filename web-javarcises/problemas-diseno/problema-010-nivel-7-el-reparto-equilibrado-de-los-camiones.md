# Problema 010 - El reparto equilibrado de los dos camiones

**Nivel:** 7 - Algoritmos aplicados
**Categoría:** Algoritmos con contexto
**Enfoque POO:** Ninguno (problema de optimización: la dificultad está en la estrategia de reparto, no en el modelado)
**Dificultad estimada:** ⭐⭐⭐⭐☆

## Contexto del problema

La bodega de distribución de una cooperativa despacha las cajas del día en **dos camiones** que parten a destinos distintos. Cada camión tiene la misma capacidad **C kilogramos**, y el conductor más experimentado cobra por el peso que lleva. Como el pago a los conductores es por "carga por fuera", en la bodega inventaron hace años un truco: a la misma plata la reparten entre los dos camiones **lo más parejo posible**, para que ningún conductor se queje de que el otro "se llevó el camión pesado".

Hoy deciden el reparto a mano, y cuando el pedido trae 12 o 15 cajas, la disputa por llegar a un reparto balanceado alarga el turno. El jefe de bodega pide un programa que reciba el peso de cada caja del lote (en orden de la planilla) y la capacidad C, y devuelva **qué cajas van en cada camión** de modo que la diferencia de peso entre ambos sea la **mínima posible** dentro de la capacidad de cada uno.

Si una caja sola pesa más que C, o si el total del lote supera la capacidad conjunta de los dos camiones, ningún reparto es válido y el programa debe decirlo antes de perder tiempo moviendo cajas.

## Requisitos funcionales

- Recibir la capacidad C del camión y el peso de cada caja del lote.
- Encontrar un reparto en dos grupos (uno por camión) donde la diferencia de peso total entre los dos camiones sea la mínima alcanzable, respetando que ningún camión exceda C.
- Mostrar el contenido de cada camión (cajas asignadas, peso total de cada uno y la diferencia final).
- Rechazar el lote con un mensaje claro si no existe reparto válido (caja mayor a C, o total del lote mayor a 2×C).

## Reglas de negocio / restricciones

- Un camión no puede recibir un peso total mayor a **C**.
- Cada caja va entera a **un solo camión**; no se puede partir una caja.
- La cantidad de cajas no supera **15** en un lote, y los pesos son enteros positivos.
- Si dos repartos diferentes logran la misma mínima diferencia, cualquiera es correcto; la prioridad absoluta es la diferencia mínima.
- Un lote se rechaza completo si pesa más de **2×C** o si alguna caja pesa más de **C**: no tiene sentido repartir lo imposible.
- Todo el lote debe despacharse: ninguna caja puede quedar sin camión.

## Lo que se espera que diseñes

- Decide cómo representar una caja y cómo probar los repartos candidatos sin repetir trabajo.
- Piensa en la cantidad de combinaciones posibles con 15 cajas: ¿cuántas son posibles y cómo las exploras sin revolver todo el lote en cada intento?
- Decide cómo verificar la restricción de capacidad mientras buscas la combinación más balanceada.
- Argumenta si vale la pena empezar por el peso total del lote (que es fijo) para orientar la búsqueda de la diferencia mínima.

*(No se entrega una firma de clases predefinida: el diseño es parte del ejercicio.)*

## Ejemplos de comportamiento esperado

**Escenario 1 (reparto equilibrado):**
```
Entrada / acción: C = 1000, cajas de 400, 350, 300, 250
Resultado esperado: un camión con 400+300 (700) y otro con 350+250 (600), diferencia 100; existen otras particiones pero ninguna baja de 100
```

**Escenario 2 (empate al medio):**
```
Entrada / acción: C = 500, cajas de 100, 200, 300 (total 600)
Resultado esperado: reparto 300 en un camión y 100+200 (300) en el otro → diferencia 0
```

**Escenario 3 (lote imposible por caja):**
```
Entrada / acción: C = 500, cajas de 520 y 200
Resultado esperado: se rechaza el lote (una caja excede la capacidad) sin proponer reparto
```

**Escenario 4 (lote imposible por total):**
```
Entrada / acción: C = 500, cajas de 450, 400, 300 (total 1150 > 1000)
Resultado esperado: se rechaza el lote (total supera la capacidad conjunta)
```

## Preguntas de análisis previo (responder antes de programar)

1. Dado el peso total fijo, ¿cómo se relaciona "repartir lo más parejo posible" con "encontrar el subconjunto más cercano a la mitad del total"?
2. ¿Qué garantiza que el reparto elegido no exceda la capacidad de ninguno de los dos camiones?
3. ¿Cómo evitas contar dos veces la misma partición (camión A/B vs B/A)?
4. ¿Qué podría salir mal? (cajas repetidas, lote vacío, capacidad menor a toda caja, total par/impar)

## Pistas de diseño (opcional, ocultables)

<details>
<summary>Ver pista de diseño</summary>

Si el lote pesa `T` en total, dos camiones balanceados buscan que uno lleve lo más cercano posible a `T/2` sin pasarse de `C`. Puedes explorar subconjuntos de cajas sumando pesos y quedándote con la suma válida más cercana a la mitad; con pocas cajas, enumerarlas es viable si vas acumulando los totales en lugar de recalcular todo.

</details>

## Criterios de una buena solución

- La solución siempre reporta la diferencia mínima alcanzable, no solo "una repartición razonable".
- La restricción de capacidad de cada camión se verifica, y los lotes imposibles se rechazan antes de buscar.
- Con el lote vacío o con una sola caja el programa responde sin errores.
- El algoritmo no repite trabajo: cada subconjunto se considera una sola vez.
- Cambiar la capacidad C no obliga a reescribir la búsqueda.
