# Problema 012 - El bingo de la feria del pueblo

**Nivel:** 3 - Colecciones + lógica de negocio
**Categoría:** Juegos y lógica
**Enfoque POO:** Composición (`JuegoDeBingo` gestiona una `Carta` de 5x5 y el recorrido de las bolas)
**Dificultad estimada:** ⭐⭐⭐☆☆

## Contexto del problema

En la feria del pueblo montaron un bingo para recaudar fondos, y la persona encargada de cantar las bolas se enfermó. El comité quiere reemplazarla por un programa en los computadores prestados de la alcaldía: el programa genera una carta para el jugador, "canta" las bolas una a una y avisa el instante exacto en que la carta completa una línea.

La carta de bingo es un tablero de **5×5**. Cada columna tiene un rango fijo de números: la columna B lleva del 1 al 15, la I del 16 al 30, la N del 31 al 45, la G del 46 al 60 y la O del 61 al 75; el centro del tablero es una casilla libre (ya cuenta como marcada). Las bolas se extraen sin repetición del 1 al 75.

Lo que el comité necesita es el programa les diga, tras cada bola, si la carta ya ganó. Gana quien complete **una línea completa**: una fila, una columna o una de las dos diagonales. Y para la tarima quieren saber también **cuántas bolas hizo falta para ganar** y qué líneas fueron las que cerraron el juego.

## Requisitos funcionales

- Generar una carta de 5×5 con números únicos dentro de los rangos por columna y la casilla central libre.
- Simular la extracción de bolas del 1 al 75, sin repetir bolas, hasta que la carta complete al menos una línea.
- Tras cada bola, marcar los números de la carta y evaluar si completó líneas.
- Mostrar la carta en consola tras cada jugada (o al menos en el momento de la victoria), con los números marcados señalados.
- Al ganar, mostrar: cuántas bolas se necesitaron, qué líneas se completaron y cuáles fueron las bolas cantadas.

## Reglas de negocio / restricciones

- El tablero respeta los rangos por columna: en la columna B solo hay números del 1 al 15, en la I del 16 al 30, etc.
- Los números de la carta **no se repiten** dentro de ella.
- La casilla central (fila 3, columna N) es **LIBRE**: cuenta como marcada desde que se genera la carta.
- Las bolas se extraen del 1 al 75 **sin repetir**; una bola repetida no puede volver a salir.
- Una línea se considera completa cuando los 5 números de esa fila, columna o diagonal —incluida la LIBRE si está en la línea— quedaron marcados.
- El juego termina en cuanto hay al menos una línea completa, aunque queden bolas por cantar.

## Lo que se espera que diseñes

- Identifica las clases: qué representa la carta y qué representa el juego (extracción de bolas y evaluación).
- Decide cómo guardar los números de la carta (arreglo, lista de listas) y cómo registrar cuáles están marcados.
- Decide cómo recorrer y verificar las líneas al evaluar la victoria: filas, columnas y diagonales.
- Define cómo asegurar la ausencia de repeticiones tanto en la generación de la carta como en la extracción de bolas.

*(No se entrega una firma de clases predefinida: el diseño es parte del ejercicio.)*

## Ejemplos de comportamiento esperado

**Escenario 1 (victoria por fila):**
```
Entrada / acción: la carta tiene la fila 0 con {2, 17, 33, 49, 65}; las bolas cantadas incluyen esos 5 números
Resultado esperado: al caer el quinto de ellos se declara victoria; reporta "fila 0", las bolas usadas y el total contado
```

**Escenario 2 (victoria por diagonal con casilla libre):**
```
Entrada / acción: la diagonal principal se completa con 4 bolas porque el centro ya estaba LIBRE
Resultado esperado: victoria con 4 bolas en esa diagonal; la casilla LIBRE no exige bola extra
```

**Escenario 3 (misma carta, dos líneas a la vez):**
```
Entrada / acción: una bola completa una fila y una columna simultáneamente
Resultado esperado: ambas líneas se reportan como cerradas y el juego termina igual el mismo turno
```

**Escenario 4 (bola repetida):**
```
Entrada / acción: la simulación intenta extraer un número que ya salió
Resultado esperado: se ignora y se extrae otra bola; nunca se cuenta la misma bola dos veces
```

## Preguntas de análisis previo (responder antes de programar)

1. ¿Qué entidades del mundo real identificas y qué atributos y comportamientos tiene cada una?
2. ¿Cómo representar una carta de bingo de forma que las filas, columnas y diagonales sean fáciles de recorrer?
3. ¿Cómo evitas duplicados en la carta (rangos por columna) y en las bolas (1 al 75)?
4. ¿Qué podría salir mal? (números fuera de rango en una columna, cartas que nunca ganan, más de una línea al mismo tiempo)

## Pistas de diseño (opcional, ocultables)

<details>
<summary>Ver pista de diseño</summary>

Separar "qué número tiene la carta" de "si ya fue marcado" te libra de borrar datos al marcar. Para verificar la victoria, revisa las 5 filas, las 5 columnas y las 2 diagonales con la misma idea de "¿todos completos?"; la casilla central puede manejarse ya marcada desde el inicio.

</details>

## Criterios de una buena solución

- La carta cumple siempre los rangos por columna y no repite números; la casilla central es LIBRE.
- Las bolas nunca se repiten y el juego no puede quedarse sin bolas antes de declarar un resultado.
- La victoria detecta filas, columnas y las dos diagonales, incluso varias a la vez en el mismo turno.
- El reporte de victoria incluye bolas usadas y las líneas exactas que cerraron.
- Regenerar una carta nueva o cambiar la cantidad de bolas extraídas no exige reescribir la lógica de verificación.
