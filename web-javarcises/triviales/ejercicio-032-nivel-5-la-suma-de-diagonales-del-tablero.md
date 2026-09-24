# Ejercicio 032 - La suma de diagonales del tablero

**Nivel:** 5 - Intermedio II
**Tema(s):** arrays bidimensionales, llenado por filas, diagonal principal y secundaria, intersección de diagonales
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

El taller de electrónica distribuye cargas en un **tablero cuadrado** de `N x N` celdas (cada valor es la carga, en watts, de esa celda). Para el balance energético necesitan la carga total de las **dos diagonales**: la que baja de la esquina superior izquierda a la inferior derecha (diagonal principal) y la que baja de la superior derecha a la inferior izquierda.

**Detalle importante:** en tableros de tamaño impar, la celda central pertenece a **ambas diagonales**; sólo debe contarse **una vez**.

El programa lee `N` (mayor a 0) y luego los `N x N` valores fila por fila, y muestra:

```
Suma de ambas diagonales: X
```

## Instrucciones

- Usa la clase `Scanner`.
- Guarda los valores en `int[][] tablero` (dimensión `N x N`), llenándolo fila por fila con bucles **anidados**.
- Calcula la suma en un **único recorrido** por las celdas de las diagonales, usando los índices `[i][i]` y `[i][N - 1 - i]`.
- Si `N` es impar, evita sumar **dos veces** la celda central (la intersección de ambas diagonales).
- No uses colecciones ni librerías.
- No asumas el uso de `Math.pow` ni fórmulas de simultaneidad: se recorre la estructura con bucles.
- La salida es exactamente una línea.

## Firma sugerida

```java
import java.util.Scanner;

public class SumaDeDiagonales {
    public static void main(String[] args) {
        // Tu código aquí
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1 (N par):**
```
Entrada: 2
Entrada: 1
Entrada: 2
Entrada: 3
Entrada: 4
Salida: Suma de ambas diagonales: 10
```

**Ejemplo 2 (la trampa del centro):**
```
Entrada: 3
Entrada: 1
Entrada: 2
Entrada: 3
Entrada: 4
Entrada: 5
Entrada: 6
Entrada: 7
Entrada: 8
Entrada: 9
Salida: Suma de ambas diagonales: 25
```

**Ejemplo 3 (caso borde, una sola celda):**
```
Entrada: 1
Entrada: 7
Salida: Suma de ambas diagonales: 7
```

## Casos límite a considerar

- **La celda central en `N` impar:** con `N = 3`, la diagonal principal suma `1 + 5 + 9 = 15`, la secundaria `3 + 5 + 7 = 15`, pero el total correcto es **25**, no 30: el `5` no debe sumarse dos veces.
- **Índices:** la secundaria usa `N - 1 - i`; olvidar el `- 1` accede fuera de los límites de la matriz.
- **Llenado por filas:** el bucle exterior recorre las filas y el interior las columnas; leer al revés desordena los valores de entrada.
- `N = 1`: ambas diagonales coinciden en la única celda; debe contar solo una vez (7, no 14).
- Matriz con valores negativos o 0 se suman normalmente.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

`int suma = 0; for (int i = 0; i < N; i++) { suma += tablero[i][i]; if (i != N - 1 - i) suma += tablero[i][N - 1 - i]; }`. El `if` interior descuenta el caso en que ambas celdas son la misma (solo ocurre con `N` impar, en el centro).

</details>
