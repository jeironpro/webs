# Ejercicio 073 - El taller de matemáticas recursivas

**Nivel:** 14 - Experto I
**Tema(s):** **recursión**, exponenciación (caso base `exp == 0`), mcd por Euclides (caso base `b == 0`), la parada del caso base
**Dificultad estimada:** ⭐⭐⭐⭐☆

## Enunciado

El taller de matemáticas pide dos cálculos clásicos e **irreductiblemente recursivos**:

- **Potencia:** `n^m` = `n * n^(m-1)`, con `n^0 = 1`.
- **Máximo común divisor** (algoritmo de Euclides): `mcd(a, b)` = `mcd(b, a % b)`, con base `mcd(a, 0) = a`.

El programa lee `N` (mayor a 0) y luego `N` líneas con una **operación** (`P` = potencia, `G` = mcd) y **dos enteros**: para `P` son `base` y `exponente` (este último mayor o igual a 0); para `G` son los dos números del mcd. Para cada línea imprime:

```
Potencia: R
MCD: R
```

En `mcd`, fíjate: la recursión **intercambia y reduce** en una sola llamada (`b` pasa a ser el primer argumento y `a % b` el segundo). Es la forma más corta y elegante del algoritmo.

## Instrucciones

- Implementa **`static int potencia(int base, int exp)`**:
  - Caso base: `exp == 0` → `return 1`.
  - Caso recursivo: `return base * potencia(base, exp - 1)`.
- Implementa **`static int mcd(int a, int b)`**:
  - Caso base: `b == 0` → `return a`.
  - Caso recursivo: `return mcd(b, a % b)`.
- Ambos métodos son **recursivos**: nada de bucles `for`/`while` ni `Math.pow`.
- Cada recursión tiene **exactamente un caso base** que corta la cadena; sin él, `StackOverflowError`.
- El exponente nunca es negativo (se asume `>= 0`); anota esa restricción.
- `main` lee la letra con `next()` (toma su carácter `0`) y los dos enteros con `nextInt()`.

## Firma sugerida

```java
import java.util.Scanner;

public class TallerDeMatematicas {
    public static void main(String[] args) {
        // Tu código aquí
    }

    static int potencia(int base, int exp) {
        // Tu código aquí
        return 0;
    }

    static int mcd(int a, int b) {
        // Tu código aquí
        return 0;
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1:**
```
Entrada: N = 4
Entrada: P 2 10
Entrada: G 48 36
Entrada: G 17 5
Entrada: P 5 0
Salida: Potencia: 1024
        MCD: 12
        MCD: 1
        Potencia: 1
```

**Ejemplo 2 (mcd con el mayor primero o después):**
```
Entrada: N = 2
Entrada: G 36 48
Entrada: G 21 14
Salida: MCD: 12
        MCD: 7
```

**Ejemplo 3 (un paso de Euclides resuelve todo):**
```
Entrada: N = 1
Entrada: G 7 0
Salida: MCD: 7
```

## Casos límite a considerar

- **El caso base de la potencia es `exp == 0` (`→ 1`), no `exp == 1`:** aunque ambos "funcionan" para exponentes positivos, `exp == 0` es el correcto: con `P 5 0` la respuesta es `1`, y con base `exp == 1` se rompería en exponente 0.
- **Euclides se auto-ordena:** con `MCD 36 48` no hace falta ordenar de antemano: en el primer paso la recursión llama `mcd(48, 36 % 48)` = `mcd(48, 36)`, y a partir de ahí el primer argumento es siempre el mayor.
- **`mcd(b, a % b)`, no `mcd(a % b, b)`:** el orden los argumentos importa. La forma con `mcd(b, a % b)` garantiza que el resto va achicándose hasta llegar a `0`.
- **`mcd(a, 0)` y `MCD 7 0`:** si un argumento es `0`, el mcd del otro, y el caso base lo devuelve directo (ejemplo 3). `MCD 0 0` no tiene respuesta (quedaría división por cero en el paso recursivo); anótalo como restricción.
- **Desbordamiento del `int`:** `P 2 31` supera el rango. El enunciado asume resultados dentro del `int` (o usa `long`, como variante).
- **El `return` en cada rama vuelve a estar en juego:** una rama sin `return` devuelve lo que toque por defecto y corrompe el resultado (misma lección que el ejercicio 072).

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

```
static int potencia(int base, int exp) {
    if (exp == 0) return 1;
    return base * potencia(base, exp - 1);
}
```
Prueba `potencia(2, 3)`: `2 * potencia(2, 2)` → `2 * (2 * potencia(2, 1))` → `2 * (2 * (2 * 1))` = `8`. Los `return` se "desenrollan" de abajo hacia arriba.

```
static int mcd(int a, int b) {
    if (b == 0) return a;
    return mcd(b, a % b);
}
```
Prueba `mcd(48, 36)`: `mcd(36, 12)` → `mcd(12, 0)` → `12`.

</details>
