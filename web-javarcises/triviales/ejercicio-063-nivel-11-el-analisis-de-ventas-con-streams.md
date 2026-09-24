# Ejercicio 063 - El análisis de ventas con streams

**Nivel:** 11 - Avanzado I
**Tema(s):** **streams** de Java, operaciones intermedias (`filter`, `distinct`) y terminales (`count`, `sum`, `max`), `Optional`, expresiones lambda
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

La tienda procesa las ventas diarias del semestre (enteros positivos) y quiere varios resúmenes usando la API de **streams**, sin `for` manuales de recorrido. Los datos viven en una lista y cada pregunta se responde con una **tubería de operaciones**:

- Cuántas ventas **superaron** `100` (`filter` + `count`).
- La **suma** de todas (`mapToInt` + `sum`).
- Cuántos **valores distintos** hay (`distinct` + `count`).
- El **máximo** (`mapToInt` + `max`).

El programa lee `N` (mayor a 0) ventas y muestra:

```
Ventas altas (> 100): X
Suma: Y
Valores distintos: Z
Máximo: W
```

## Instrucciones

- Guarda las ventas en `ArrayList<Integer> ventas`.
- Responde cada pregunta con su propia **tubería de streams** (una por línea de salida), usando lambdas.
- `count()` devuelve **`long`** (imprímelo tal cual).
- `sum()` devuelve `int` (`mapToInt`).
- `max()` devuelve un **`OptionalInt`**: lo consumes con `.orElse(0)` (o `getAsInt()` si sabes que hay valores).
- Para `distinct`, opera sobre el stream de enteros (compara `diferencias` con `>=` si quieres, pero el máximo se pide con `max()`).
- No uses bucles `for`/`while` para recorrer la lista: el recorrido es responsabilidad del stream.

## Firma sugerida

```java
import java.util.ArrayList;
import java.util.Scanner;

public class AnalisisConStreams {
    public static void main(String[] args) {
        // Tu código aquí
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1:**
```
Entrada: 6
Entrada: 120
Entrada: 80
Entrada: 120
Entrada: 90
Entrada: 200
Entrada: 45
Salida: Ventas altas (> 100): 3
        Suma: 655
        Valores distintos: 5
        Máximo: 200
```

**Ejemplo 2 (un solo valor):**
```
Entrada: 1
Entrada: 300
Salida: Ventas altas (> 100): 1
        Suma: 300
        Valores distintos: 1
        Máximo: 300
```

**Ejemplo 3 (nada supera 100):**
```
Entrada: 3
Entrada: 50
Entrada: 50
Entrada: 60
Salida: Ventas altas (> 100): 0
        Suma: 160
        Valores distintos: 2
        Máximo: 60
```

## Casos límite a considerar

- **Los streams no se reutilizan:** tras una operación terminal, el stream queda "consumido". Por eso cada línea de salida abre una tubería nueva desde `ventas.stream()`; compartir un stream entre preguntas no funciona.
- **`count()` es `long`:** el resultado no es `int`; encadenar `.mapToInt(::intValue)` no aplica aquí.
- **`OptionalInt` del `max()`:** Java no da el máximo "a secas": te entrega un `Optional`. Usa `.orElse(0)` para aplanarlo; olvidarlo deja el código sin el valor.
- **`filter` con lambda:** `v -> v > 100` — el `Integer` se desempaqueta a `int` para comparar.
- **`distinct` quita duplicados antes de contar:** en el ejemplo 1, `120` aparece dos veces y solo cuenta una.
- `null` en la lista rompería el stream: asumimos que no los hay (o filtra antes).

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

```
long altas = ventas.stream().filter(v -> v > 100).count();
int suma  = ventas.stream().mapToInt(Integer::intValue).sum();
long dis  = ventas.stream().distinct().count();
int max   = ventas.stream().mapToInt(Integer::intValue).max().orElse(0);
```
Cada tubería es independiente; nota que el máximo y la suma necesitan `mapToInt` porque operan con primitivos.

</details>
