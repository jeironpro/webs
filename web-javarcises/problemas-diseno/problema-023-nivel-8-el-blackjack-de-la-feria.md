# Problema 023 - El blackjack de la feria

**Nivel:** 8 - Sistemas completos
**Categoría:** Juegos y lógica
**Enfoque POO:** Composición `Baraja` contiene `Carta`; `Mano` evalúa y suma; `Juego` orquesta turnos y apuestas
**Dificultad estimada:** ⭐⭐⭐⭐☆

## Contexto del problema

En la feria del pueblo montaron una mesa de blackjack para caridad. La persona que reparte las cartas es un familiar que se equivoca con las cuentas, sobre todo cuando salen **ases**: un as vale 11, pero si la mano pasa de 21 el as pasa a valer 1, y eso nadie lo lleva al día con cartas físicas. El comité quiere reemplazar al repartidor con un programa de consola, bien apuntado: se juega contra el programa (la "banca"), que juega con reglas fijas y debe decidir solo cuándo pedir o plantarse.

Cada jugador empieza con **$10.000** y hace una apuesta por mano. Gana quien llegue más cerca de **21** sin pasarse; si la banca y el jugador empatan en total, la apuesta se devuelve (empate). Si uno se pasa de 21, pierde al momento. La banca juega con una sola regla pública: **pide carta hasta tener 17 o más y entonces se planta**.

Como es feria y hay cola, el repartidor (el programa) debe aceptar apuestas válidas, mostrar lo que corresponde ver en cada momento, y nunca dejar el saldo o las cuentas "a medias".

## Requisitos funcionales

- Manejar un mazo de 52 cartas (4 palos × 13 valores) barajado por partida.
- Repartir 2 cartas al jugador y 2 a la banca (de la banca solo se muestra una hasta que el jugador termine).
- Turno del jugador: pedir (`P`) o plantarse (`T`), evaluando pase de 21 en cada carta.
- Turno de la banca: pide mientras tenga menos de 17 y se planta al llegar a 17 o más; si se pasa de 21, pierde.
- Evaluar carta alta (mayor total ≤ 21), empate (push) o banca/ganador, y mover la apuesta (paga 1:1, devuelve en empate).
- Llevar el saldo y terminar cuando llega a 0 o el jugador decide salir.

## Reglas de negocio / restricciones

- Valores de las cartas: `A` vale 1 o 11; `J`, `Q`, `K` valen 10; las demás su número.
- Regla del as: cada vez que se agrega una carta se recalcula, y si el total pasa de 21 **con un as valiendo 11**, ese as pasa a valer 1 (varios ases se ajustan de a uno).
- Pase de 21: la mano termina al instante y quien se pasó pierde (sin que la banca juegue).
- La banca: menos de 17 pide; 17 o más se planta (valora sus ases con la misma regla).
- La apuesta es un entero positivo **entre 1 y el saldo actual**; una apuesta inválida se rechaza y se vuelve a pedir sin efectos.
- Empate exacto de totales → la apuesta se devuelve (el saldo no cambia).
- Saldo inicial: $10.000. Si el saldo llega a 0, el juego termina inevitablemente.

## Lo que se espera que diseñes

- Identifica las clases: carta, mazo, mano y juego; decide qué responsabilidad le toca a cada una.
- Decide dónde vive el cálculo de la mano (con la regla de los ases) para que jugador y banca lo compartan.
- Decide cómo el mazo baraja y reparte sin repetir cartas dentro de la partida.
- Estructura el flujo de turnos (jugador → banca) sin que las validaciones se repitan.
- Argumenta qué gana el diseño si la feria cambia el pago (ej. blackjack natural paga 3:2).

*(No se entrega una firma de clases predefinida: el diseño es parte del ejercicio.)*

## Ejemplos de comportamiento esperado

**Escenario 1 (ajuste de ases):**
```
Entrada / acción: el jugador tiene A y 5 (16); pide (P) y le llega un 6
Resultado esperado: 11+5+6 = 22 → el as pasa a 1 → total 12; la mano sigue viva
```

**Escenario 2 (pase de 21):**
```
Entrada / acción: el jugador tiene 15, pide y recibe un 10
Resultado esperado: total 25 → pase; el jugador pierde la apuesta y la banca no juega
```

**Escenario 3 (banca se planta en 17):**
```
Entrada / acción: la banca tiene 16 y pide; recibe A (vale 1 → 17)
Resultado esperado: la banca se planta en 17 (la regla del as la evita tener 17 con riesgo de 27)
```

**Escenario 4 (empate):**
```
Entrada / acción: jugador y banca terminan ambos en 20
Resultado esperado: empate; la apuesta se devuelve y el saldo no cambia
```

**Escenario 5 (apuesta inválida):**
```
Entrada / acción: apostar 0, o 15.000 si el saldo es 10.000
Resultado esperado: se rechaza la apuesta (fuera de rango) y se pide otra sin perder saldo
```

## Preguntas de análisis previo (responder antes de programar)

1. ¿Qué entidades del mundo real identificas y qué atributos y comportamientos tiene cada una?
2. ¿Cómo recalibra una mano su valor ante cada carta nueva para que los ases nunca "pogan a la mano a pasarse"?
3. ¿Quién imprime qué en cada momento (qué ve el jugador de la banca y cuándo) para que el juego sea justo?
4. ¿Qué podría salir mal? (mazo sin cartas, apuestas fuera de rango, saldo de 0, empates en el límite, ases múltiples en la misma mano)

## Pistas de diseño (opcional, ocultables)

<details>
<summary>Ver pista de diseño</summary>

Para la mano: suma todas las cartas contando cada as como 11; si el total pasa de 21, baja cada as a 1 mientras el objeto `Mano` guarde cuántos ases tiene. Así la evaluación de jugador y banca es la misma función. El mazo reparte desde el final y evita reutilizar cartas barajando al inicio de cada partida.

</details>

## Criterios de una buena solución

- La regla de los ases funciona con uno o varios ases en la misma mano y para jugador y banca por igual.
- El pase de 21 interrumpe el turno al instante y sin dejar estados raros.
- La banca se planta en 17 (mínimo) y siempre juega su mano completa con la misma regla.
- Las apuestas se validan contra el saldo y los empates no alteran el saldo.
- El flujo de turnos y la impresión de lo que se ve en cada momento son consistentes de partida en partida.
