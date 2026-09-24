# Ejercicio 079 - Los conejos a prueba de explosión

**Nivel:** 14 - Experto I
**Tema(s):** **memoización (recursión óptima)**, `long[]` como caché, subproblemas repetidos, conteo de cálculos
**Dificultad estimada:** ⭐⭐⭐⭐☆

## Enunciado

La granja de conejos del ejercicio 021 ahora se modela con la forma **recursiva** clásica: `conejos(n) = conejos(n - 1) + conejos(n - 2)`. Pero ese `return conejos(n-1) + conejos(n-2)` puro **explota exponencialmente**: recalcula `conejos(0)` y `conejos(1)` cientos de veces.

La **memoización** lo arregla: se guarda cada valor calculado en una tabla y, antes de volver a calcular, se mira si ya está. El programa lee `N` (entre 0 y 92), calcula `conejos(N)` **guardando los resultados intermedios** e imprime:

```
Fibonacci(N) = R
Cálculos: C
```

donde `C` es el número de valores realmente calculados (**no** reutilizados del caché). Verás que `C` queda en `N - 1`, mientras que la versión ingenua haría un número astronómico.

## Instrucciones

- Crea un `long[] memo` de tamaño `N + 1`, inicializado todo en `0` (un `0` aquí significa "aún no calculado", ya que todo `Fibonacci >= 1`).
- Implementa **`static long conejos(int n, long[] memo)`**:
  - Caso base: `if (n <= 1) return n;`.
  - Caché: `if (memo[n] > 0) return memo[n];` → ya está, reutilízalo.
  - Cálculo: incrementa un contador estático, `memo[n] = conejos(n - 1, memo) + conejos(n - 2, memo);` (ambos llamados **antes** de devolver) y `return memo[n]`.
- La clave está en **el orden**: leer el caché **antes** de calcular. Si el `if (memo[n] > 0)` va después de la recursión, no ahorra nada.
- Imprime `Fibonacci(N) = valor` y `Cálculos: contador`.
- `long`, no `int`: `Fibonacci(46)` ya supera `2^31`. A partir de `N = 93` se desborda el `long` (anótalo como límite).

## Firma sugerida

```java
import java.util.Scanner;

public class ConejosMemoizados {
    static int calculos = 0;

    public static void main(String[] args) {
        // Tu código aquí
    }

    static long conejos(int n, long[] memo) {
        // Tu código aquí
        return 0;
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1:**
```
Entrada: N = 10
Salida: Fibonacci(10) = 55
        Cálculos: 9
```
(La versión ingenua haría **177** cálculos: el mismo subproblema se recalcula una y otra vez por ramas distintas del árbol. Con memo, cada valor `2..10` se calcula una sola vez: 9 cálculos.)

**Ejemplo 2 (caso base derecho):**
```
Entrada: N = 0
Salida: Fibonacci(0) = 0
        Cálculos: 0
```

**Ejemplo 3:**
```
Entrada: N = 1
Salida: Fibonacci(1) = 1
        Cálculos: 0
```

**Ejemplo 4 (número grande):**
```
Entrada: N = 40
Salida: Fibonacci(40) = 102334155
        Cálculos: 39
```

## Casos límite a considerar

- **El orden caché-antes-de-recursión:** `if (memo[n] > 0) return memo[n];` debe ir **antes** de la suma. Si va después, cada llamada igual baja por el árbol y la memoización no sirve de nada (mismo tiempo que el ingenuo).
- **`memo` con `0` como "no calculado":** funciona porque ningún `Fibonacci` con `n >= 1` vale `0`. `memo[0]` nunca se escribe (el caso base la devuelve directo), así que no hay ambigüedad.
- **La tabla usa `long` y el contador `calculos` no:** `calculos` es un `int` pequeño (`N - 1`), pero `memo` debe ser `long[]` o los valores > 2^31 se desbordan al guardarse.
- **Llamar ambos lados en la misma línea:** `memo[n] = conejos(n - 1, memo) + conejos(n - 2, memo);`. Si calcularas primero `n - 2` y luego `n - 1`, no importa para el resultado pero el caché se llena igual; lo importante es **no** repetir las llamadas base más de lo necesario.
- **Sin memo es insostenible:** con `N = 92`, el ingenuo haría ~2^90 operaciones; con memo, 91 cálculos (la lección del ejercicio es "optimizar la recursión", no solo reescribir 021 con recursión).
- **`N` fuera de rango:** `N > 92` desborda `long`; anótalo como limitación.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

```
static long conejos(int n, long[] memo) {
    if (n <= 1) return n;
    if (memo[n] > 0) return memo[n];
    calculos++;
    memo[n] = conejos(n - 1, memo) + conejos(n - 2, memo);
    return memo[n];
}
```
Prueba `N = 5`: se calculan `memo[5]`, `memo[4]`, `memo[3]`, `memo[2]` (4 cálculos = `N - 1`); cuando `memo[3]` hace falta para `memo[4]`... ya está en la tabla y se reutiliza. El caché convierte el árbol exponencial en una escalera lineal.

</details>
