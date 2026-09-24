# Problema 020 - La boletería del teatro municipal

**Nivel:** 3 - Colecciones + lógica de negocio
**Categoría:** Gestión / CRUD conceptual
**Enfoque POO:** Ninguno (problema de gestión de un tablero y búsqueda por rango: la dificultad está en las reglas de ocupación y agrupación, no en el modelado de clases)
**Dificultad estimada:** ⭐⭐⭐☆☆

## Contexto del problema

La boletería del teatro municipal vende boletas para la temporada. La sala es un rectángulo de **F filas y C butacas por fila**. Hasta ahora las ventas se apuntan en un plano impreso con un lápiz, y cuando una familia pide "busque cuatro butacas juntas", la taquillera cuenta asientos a ojo y a veces separa familias porque no vio un bloque contiguo en la fila siguiente.

El teatro consiguió una pantalla para la taquilla y pide un programa que maneje la venta y la búsqueda de butacas contiguas:
- Vender una butaca específica (fila y número), rechazando las ocupadas y las que no existen.
- Sugerir la **primera butaca** donde quepa un grupo de **k personas contiguas** en una sola fila (buscando de la fila 1 hacia abajo, y en cada fila de la posición más a la izquierda hacia la derecha).
- Mostrar el mapa de ocupación del teatro y el total de boletas vendidas, con el porcentaje de ocupación.

La taquillera quiere ver un solo mapa al final del turno, y el administrador necesita el porcentaje de ocupación para decidir si abren otra función.

## Requisitos funcionales

- Vender una butaca (`fila` y `columna`) validando que exista y esté libre.
- Sugerir butaca de inicio para un grupo de tamaño k (contiguos en una misma fila), sin reservarla todavía.
- Mostrar el mapa de la sala: cada butaca libre señalada con `O` y cada ocupada con `X`.
- Mostrar el total vendido y el porcentaje de ocupación (con un decimal).

## Reglas de negocio / restricciones

- La sala es rectangular: filas 1 a F y columnas 1 a C; cualquier coordenada fuera de rango se rechaza.
- Una butaca ocupada **no se puede vender**, con un mensaje claro.
- La búsqueda de grupo busca la **primera** posición que cumpla (fila más baja, y en la fila, la posición de inicio más a la izquierda), y **no reserva** nada: es solo una sugerencia.
- Un grupo de tamaño k solo cabe si hay k butacas consecutivas libres en una misma fila; si k supera C, nunca cabe.
- Si no existe ningún bloque contiguo para k, el programa lo dice (y de paso puede informar el bloque libre más grande disponible).
- El mapa muestra la disposición exacta; la ocupación es `vendidos / (F × C) × 100`.

## Lo que se espera que diseñes

- Elige la estructura para representar la sala (¿matriz? ¿conjunto de ocupadas?) y justifica según las operaciones (venta, mapa, búsqueda contigua).
- Define cómo escanear cada fila para encontrar el primer bloque de k libres consecutivos sin contar doble.
- Decide dónde valida la venta (ámbito y orden) para que un rechazo no deje marcas residuales.
- Argumenta si la sala merece una clase propia o basta con una estructura de datos con funciones.

*(No se entrega una firma de clases predefinida: el diseño es parte del ejercicio.)*

## Ejemplos de comportamiento esperado

**Escenario 1 (venta normal):**
```
Entrada / acción: vender fila 2, columna 3
Resultado esperado: la butaca pasa a ocupada; vendidos +1; el mapa la muestra con X
```

**Escenario 2 (butaca ocupada):**
```
Entrada / acción: vender de nuevo la butaca vendida en el escenario 1
Resultado esperado: se rechaza con "butaca ocupada"; vendidos no cambia
```

**Escenario 3 (búsqueda de bloque contiguo):**
```
Entrada / acción: fila 1 libre en 1,2 y ocupada en 3; fila 2 totalmente libre; k = 2
Resultado esperado: sugerencia fila 1, columna 1 (primer bloque: 1-2 en la fila más baja que cabe)
```

**Escenario 4 (sin bloque para el grupo):**
```
Entrada / acción: sala donde ningún bloque libre supera 2 butacas seguidas; k = 4
Resultado esperado: no hay bloque; el mensaje lo informa (y puede señalar el bloque libre más grande)
```

**Escenario 5 (coordenada inexistente):**
```
Entrada / acción: vender fila F+1, columna 1
Resultado esperado: rechazo por fuera de rango; nada cambia
```

## Preguntas de análisis previo (responder antes de programar)

1. ¿Qué operaciones usan la sala y cuál es la representación más natural para cada una?
2. ¿Cómo recorres una fila para detectar un bloque de k libres sin equivocarte en los extremos (inicio o fin de fila)?
3. ¿La sugerencia y la venta comparten validación? ¿Dónde conviene que vivan?
4. ¿Qué podría salir mal? (k = 0, k > C, sala vacía, coordenadas desordenadas de entrada, bloque que se sugiere pero ya no existe al confirmar)

## Pistas de diseño (opcional, ocultables)

<details>
<summary>Ver pista de diseño</summary>

Para la búsqueda, recorre fila por fila llevando el tamaño del bloque libre actual: cuando encuentras una ocupada el bloque se corta, y si el acumulado llega a k, esa es la respuesta. La sala se puede guardar como una cuadrícula de estados donde "libre" y "ocupada" son los únicos valores.

</details>

## Criterios de una buena solución

- La venta exige siempre que la butaca exista y esté libre, sin dejar marcas cuando se rechaza.
- La búsqueda de grupo da la primera posición determinista (fila arriba-izquierda) y no reserva nada.
- El mapa coincide exactamente con las ventas realizadas, y el porcentaje usa el total de butacas.
- La búsqueda reporta correctamente cuando no cabe el grupo, incluso en los extremos de fila.
- Cambiar el tamaño de la sala (otras F y C) no obliga a tocar la lógica de búsqueda.
