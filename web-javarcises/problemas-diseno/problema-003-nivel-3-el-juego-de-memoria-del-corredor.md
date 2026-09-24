# Problema 003 - El juego de memoria del corredor

**Nivel:** 3 - Colecciones + lógica de negocio
**Categoría:** Juegos y lógica
**Enfoque POO:** Composición (`JuegoDeMemoria` gestiona un tablero de objetos `Carta`)
**Dificultad estimada:** ⭐⭐⭐☆☆

## Contexto del problema

En la ludoteca de un centro cultural quieren un juego de memoria para el pasillo de espera, que funcione en las pantallas táctiles de la recepción. El juego clásico: un tablero de cartas boca abajo, el jugador voltea de a dos y gana quien encuentre todas las parejas. Nada raro hasta ahí.

Pero la diseñadora de la ludoteca propuso una vuelta de tuerca que la hace más interesante y a la vez útil para los niños que están aprendiendo palabras en inglés: en cada pareja, las dos cartas **no muestran la misma palabra**. Una carta dice `GATO` y su pareja dice `CAT`, por ejemplo. El niño debe entender que "GATO" y "CAT" representan el mismo objeto para poder hacer la pareja.

Necesitan que este juego se programe en un terminal simple (filas y columnas visibles), controlado solo con números, para que cualquier pantalla táctil o teclado simple pueda usarlo sin ratón.

## Requisitos funcionales

- Crear un tablero de **4x4 (16 cartas)** con 8 parejas de palabras: cada pareja está formada por la palabra en español y su equivalente en inglés y representan el mismo objeto.
- Mostrar el tablero en consola: posiciones numeradas, con `?` para las cartas aún boca abajo o ya pareadas, y la palabra visible cuando la carta está levantada.
- Permitir que el jugador voltee **dos cartas por turno** indicando la posición (número de la carta).
- Si las dos cartas volteadas forman pareja (mismo objeto), quedan descubiertas y cuenta como pareja encontrada.
- Si no forman pareja, ambas vuelven a quedar boca abajo al terminar el turno.
- Cuando se encuentren las 8 parejas, mostrar el mensaje de victoria con el total de turnos usados.

## Reglas de negocio / restricciones

- Cada pareja la forman una palabra en español y una en inglés que representan el mismo objeto; las palabras **nunca son idénticas** entre sí dentro de la pareja.
- Un jugador no puede voltear una posición inválida (fuera de 0 a 15), ya descubierta, ni ya pareada.
- Un jugador no puede voltear la misma carta dos veces dentro del mismo turno.
- Voltear una carta la deja visible hasta que se elija la segunda del turno: solo se decide si es pareja cuando hay dos cartas levantadas.
- El tablero siempre se muestra con la misma cantidad de columnas (4), con las posiciones en orden comprensible.
- El reparto de parejas en el tablero debe ser aleatorio en cada partida nueva (no se puede predecir dónde queda cada pareja).

## Lo que se espera que diseñes

- Identifica las clases necesarias y sus responsabilidades: ¿`Carta` es una clase propia con estado, o basta con estructuras simples?
- Decide cómo modelar el **estado** de cada carta (boca abajo, visible, ya pareada): ¿un atributo, varios, o algo más expresivo?
- Decide qué estructura usar para el tablero y cómo generar el reparto aleatorio sin duplicar parejas.
- Argumenta qué gana el diseño al representar cartas como objetos, aunque el juego sea de consola.

*(No se entrega una firma de clases predefinida: el diseño es parte del ejercicio.)*

## Ejemplos de comportamiento esperado

**Escenario 1 (pareja encontrada):**
```
Entrada / acción: los pares 4 y 10 están ocultos y son GATO / CAT; el jugador voltea 4 y luego 10
Resultado esperado: ambas cartas quedan visibles (pareada), turnos = 1, conteo de parejas = 1
```

**Escenario 2 (pareja no encontrada):**
```
Entrada / acción: voltea 2 (SOL) y luego 7 (AGUA); no son pareja
Resultado esperado: al confirmar el turno ambas vuelven a `?` y los turnos aumentan
```

**Escenario 3 (posición inválida):**
```
Entrada / acción: intentar voltear la posición 15 cuando ya fue pareada, o la posición 20
Resultado esperado: se rechaza el movimiento con un mensaje y no se consume ni voltea nada
```

**Escenario 4 (dos palabras distintas, un mismo objeto):**
```
Entrada / acción: GATO (posición 4) y CAT (posición 10)
Resultado esperado: se reconocen como pareja aunque las cadenas mostradas sean distintas
```

## Preguntas de análisis previo (responder antes de programar)

1. ¿Qué entidades del mundo real identificas? ¿Qué atributos y comportamientos tiene cada una?
2. ¿Cómo modelas que las dos cartas de la pareja "representan lo mismo" sin que sus palabras sean iguales?
3. ¿Cuándo exactamente decide el juego si un turno fue exitoso? ¿Qué pasa con las cartas levantadas si el jugador se detiene a mitad del turno?
4. ¿Qué podría salir mal? (posiciones repetidas, parejas mal repartidas, cartas que quedan volteadas para siempre)

## Pistas de diseño (opcional, ocultables)

<details>
<summary>Ver pista de diseño</summary>

Como cada pareja comparte un "objeto" pero muestra textos distintos, conviene separar el **concepto** (qué objeto es) del **texto que se muestra**. Puedes dar a cada pareja un identificador común y dos textos: pensar en "GATO y CAT son la pareja #1" hace la comparación trivial sin comparar cadenas.

</details>

## Criterios de una buena solución

- El reparto aleatorio garantiza exactamente 8 parejas y nunca dos cartas con el mismo texto visible.
- Todas las reglas de rechazo (posición inválida, repetida, ya pareada) se cumplen sin provocar errores.
- El estado del tablero siempre es consistente: una carta nunca queda levantada y pareada a la vez ni visible en un turno siguiente.
- El diseño permite cambiar el tamaño del tablero o agregar más parejas sin reescribir la lógica central.
- El conteo de turnos es correcto aunque el jugador haga movimientos inválidos.
