# Problema 013 - El fixture del campeonato del barrio

**Nivel:** 7 - Algoritmos aplicados
**Categoría:** Algoritmos con contexto
**Enfoque POO:** Ninguno (problema combinatorio de organización: la dificultad está en el algoritmo para armar el calendario, no en las clases)
**Dificultad estimada:** ⭐⭐⭐☆☆

## Contexto del problema

El campeonato de fútbol del barrio reúne a los equipos de la vereda. Son pares: 4, 6, 8, 10 o 12 equipos. Todos juegan contra todos **una sola vez** (formato todos contra todos) y la liga quiere armar el calendario completo: dividir la temporada en **jornadas**, y en cada jornada cada equipo juega exactamente un partido (salvo que el número de equipos sea impar, cosa que la liga no admite).

El problema: armar el calendario a mano es un dolor de cabeza. Si no se cuida el orden, se repiten partidos, un equipo queda jugando dos veces en la misma jornada, o al final faltan cruces. El presidente de la liga pide un programa que, con la lista de equipos, genere el calendario completo: todas las jornadas con sus partidos, de modo que **cada par de equipos se enfrente exactamente una vez** y en cada jornada ningún equipo juegue más de un partido.

Además, para imprimir el cartel de la temporada, quiere ver cada jornada numerada y los partidos que la componen, y que el programa **verifique solo** al final que el calendario quedó correcto (que no haya cruces repetidos ni faltantes).

## Requisitos funcionales

- Recibir una lista de equipos. La cantidad debe ser un número par entre 4 y 12 (inclusive); si no lo es, el programa lo rechaza con un mensaje.
- Generar todas las jornadas: en cada una, cada equipo participa en exactamente un partido.
- Asegurar que cada pareja de equipos se enfrente exactamente una vez a lo largo de la temporada.
- Mostrar las jornadas numeradas con sus partidos.
- Autoverificar el calendario al final y reportar si algún cruce quedó repetido o faltante.

## Reglas de negocio / restricciones

- Cantidad de equipos: par, entre 4 y 12. Los equipos tienen nombres únicos.
- Un equipo **no puede** jugar dos partidos en la misma jornada.
- Cada pareja de equipos juega **exactamente** un partido; no hay partidos de vuelta.
- Cada jornada tiene exactamente `N/2` partidos.
- En una jornada pueden cruzarse cualquier par, siempre que se respete la regla de uno por equipo.
- El nombre de los equipos no afecta el algoritmo: lo que importa es la posición de cada uno en la lista.

## Lo que se espera que diseñes

- Decide la estructura para representar un partido (una pareja de equipos) y el calendario (conjunto de jornadas).
- Decide cómo garantizar, mientras armar las jornadas, que un equipo ya jugó en esa jornada y que el cruce no se repitió antes.
- Piensa en el total de partidos de la temporada (`N×(N-1)/2`) y de jornadas (`N-1`): úsalo como objetivo de la verificación final.
- Argumenta si conviene ir armando las jornadas por tandas o probar una estrategia de rotación de equipos.

*(No se entrega una firma de clases predefinida: el diseño es parte del ejercicio.)*

## Ejemplos de comportamiento esperado

**Escenario 1 (4 equipos):**
```
Entrada / acción: equipos = [A, B, C, D]
Resultado esperado: 3 jornadas; por ejemplo
  J1: A-B, C-D
  J2: A-C, B-D
  J3: A-D, B-C
  (cada pareja aparece una vez y cada jornada tiene 2 partidos)
```

**Escenario 2 (cantidad impar):**
```
Entrada / acción: 5 equipos
Resultado esperado: se rechaza la entrada con un mensaje (el formato no admite cantidades impares)
```

**Escenario 3 (verificación correcta):**
```
Entrada / acción: un calendario generado de 6 equipos
Resultado esperado: el programa confirma que hay 15 partidos, 5 jornadas y que no hay cruces repetidos ni faltantes
```

**Escenario 4 (duplicado ficticio):**
```
Entrada / acción: (caso de prueba) un calendario al que se le duplicó un cruce
Resultado esperado: la verificación lo detecta y lo reporta con los equipos implicados
```

## Preguntas de análisis previo (responder antes de programar)

1. ¿Cuál es el total de partidos de la temporada y cuántas jornadas debe haber? ¿Cómo lo compruebas?
2. ¿Qué condición debe cumplirse en cada jornada para que ningún equipo juegue dos veces?
3. ¿Cómo registras los cruces ya armados para no repetirlos ni olvidar alguno?
4. ¿Qué podría salir mal? (equipos impares, nombres repetidos, jornadas con partidos de más o de menos, cruces duplicados)

## Pistas de diseño (opcional, ocultables)

<details>
<summary>Ver pista de diseño</summary>

Un truco clásico: fija un equipo y "rota" los demás en círculo; en cada vuelta, empareja el fijo con un rival distinto y a los demás entre sí por posición. Así cada cruce sale exactamente una vez y en cada jornada todos juegan. La verificación final (pares nunca repetidos y total exacto `N×(N-1)/2`) te permite detectar errores sin inspeccionar a mano.

</details>

## Criterios de una buena solución

- El calendario respeta: cada par juega exactamente una vez y ningún equipo juega dos veces en la misma jornada.
- La cantidad de jornadas y de partidos coincide con las fórmulas esperadas para el tamaño dado.
- Las entradas inválidas (cantidad impar o fuera de rango, nombres repetidos) se rechazan al inicio.
- La autoverificación detecta cruces repetidos, faltantes y jornadas mal formadas.
- El algoritmo funciona igual para 4 que para 12 equipos sin reescribir la lógica central.
