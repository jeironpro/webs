# Ejercicio 042 - Las permutaciones del pódium

**Nivel:** 6 - Intermedio III
**Tema(s):** recursividad básica, caso base, caso recursivo, factorial como modelado de conteo
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

En un torneo, `N` atletas llegan a la premiación y se ordenan en el pódium. La cantidad de **formas distintas** de ordenarlos es `N!` (factorial). El organizador quiere un método recursivo: un método que se llame a sí mismo para resolver el problema en función de uno más pequeño.

La definición recursiva clásica:

```
0! = 1
1! = 1
n! = n × (n-1)!
```

El programa lee `N` (entero entre 0 y 20) y muestra:

```
Permutaciones: X
```

## Instrucciones

- Define un método **recursivo** `static long permutaciones(int n)` que siga exactamente la definición de arriba: un **caso base** (`n <= 1` → devuelve `1`) y un **caso recursivo** (`n * permutaciones(n - 1)`).
- El método **no debe** usar bucles (`for`/`while`): la repetición la hace la propia recursión.
- `main` lee `N`, llama al método y muestra el resultado.
- Usa `long` para el resultado (con `int`, arriba de 12! se desborda).
- Considera que `N` está entre 0 y 20 (20! cabe en `long`; la validación es tema de niveles posteriores).

## Firma sugerida

```java
import java.util.Scanner;

public class PermutacionesDelPodium {
    public static void main(String[] args) {
        // Tu código aquí
    }

    static long permutaciones(int n) {
        return 0; // reemplaza
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1:**
```
Entrada: 3
Salida: Permutaciones: 6
```

**Ejemplo 2 (la trampa del 0):**
```
Entrada: 0
Salida: Permutaciones: 1
```

**Ejemplo 3 (caso borde):**
```
Entrada: 20
Salida: Permutaciones: 2432902008176640000
```

## Casos límite a considerar

- **El caso base del 0:** el factorial de `0` es `1` (convención matemática), no `0`. El caso base `n <= 1` debe cubrirlo, o `0!` dará un resultado incorrecto.
- **La recursión siempre debe acercarse al caso base:** aquí `n - 1` la reduce; si sumaras en el argumento, la recursión no terminaría.
- **Desborde:** `13!` ya supera el rango de un `int` (6227020800 > 2147483647); por eso el método devuelve `long`. Con `long`, el límite válido superior es `20!`; `21!` se desborda.
- Traza a mano `permutaciones(3)`: → `3 * permutaciones(2)` → `3 * (2 * permutaciones(1))` → `3 * (2 * 1)` = 6.
- `N = 1`: también devuelve 1 (un solo orden posible).

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

`if (n <= 1) { return 1; } return n * permutaciones(n - 1);` — primero el caso base, después el caso recursivo. Escribe en papel `permutaciones(3)` paso a paso antes de codificar para verificar que entiendes la descomposición.

</details>
