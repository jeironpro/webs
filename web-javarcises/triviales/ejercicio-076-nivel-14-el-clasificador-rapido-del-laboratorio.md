# Ejercicio 076 - El clasificador rápido del laboratorio

**Nivel:** 14 - Experto I
**Tema(s):** **ordenamiento recursivo en el lugar** (partición de Lomuto), pivote, dividir y conquistar, índices `i`/`j`
**Dificultad estimada:** ⭐⭐⭐⭐⭐

## Enunciado

El laboratorio guarda las muestras con códigos numéricos desordenados. Hay que ordenarlos con **quicksort** recursivo, que es el ordenamiento "divide y vencerás" por excelencia: se elige un **pivote**, se **particiona** el arreglo para que los menores queden a la izquierda y los mayores a la derecha, y se ordena recursivamente cada lado.

El programa lee `N` (mayor a 0), los `N` códigos desordenados y los imprime **ordenados de menor a mayor**, separados por espacio, en una sola línea.

La partición trabaja **sobre el mismo arreglo** (nada de arreglos auxiliares): solo intercambios (`swap`) entre posiciones.

## Instrucciones

- Implementa **`static void quickSort(int[] a, int ini, int fin)`**:
  - Caso base: si `ini >= fin`, no hay nada que ordenar (0 o 1 elemento) → `return`.
  - `int p = particion(a, ini, fin);`
  - `quickSort(a, ini, p - 1);` y `quickSort(a, p + 1, fin);`
- Implementa **`static int particion(int[] a, int ini, int fin)`** (partición de Lomuto, pivote = el último elemento):
  ```java
  int pivote = a[fin];
  int i = ini - 1;
  for (int j = ini; j < fin; j++) {
      if (a[j] < pivote) {
          i++;
          intercambia(a, i, j);
      }
  }
  intercambia(a, i + 1, fin);
  return i + 1;
  ```
- El pivote queda en su posición final: **se excluye de las recursiones** (`p - 1` y `p + 1`). Sin eso, el pivote se volvería a procesar y la recursión no termina.
- `main` llama `quickSort(a, 0, a.length - 1)` y luego imprime.

## Firma sugerida

```java
import java.util.Scanner;

public class ClasificadorRapido {
    public static void main(String[] args) {
        // Tu código aquí
    }

    static void quickSort(int[] a, int ini, int fin) {
        // Tu código aquí
    }

    static int particion(int[] a, int ini, int fin) {
        // Tu código aquí
        return 0;
    }

    static void intercambia(int[] a, int x, int y) {
        int t = a[x];
        a[x] = a[y];
        a[y] = t;
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1 (caso general):**
```
Entrada: N = 7
Entrada: 33 5 90 12 45 8 21
Salida: 5 8 12 21 33 45 90
```

**Ejemplo 2 (repetidos):**
```
Entrada: N = 5
Entrada: 5 5 5 5 5
Salida: 5 5 5 5 5
```

**Ejemplo 3 (un solo elemento):**
```
Entrada: N = 1
Entrada: 42
Salida: 42
```

**Ejemplo 4 (ya ordenado, peor caso del quicksort):**
```
Entrada: N = 5
Entrada: 1 2 3 4 5
Salida: 1 2 3 4 5
```

## Casos límite a considerar

- **Caso base `ini >= fin`:** con un elemento (`ini == fin`) ya está ordenado; con todos ordenados o repetidos, la recursión debe cortar igual. Sin este caso base, `StackOverflowError`.
- **Excluir el pivote de la recursión (`p - 1` y `p + 1`):** el pivote ya está en su sitio definitivo tras la partición. Volver a incluirlo (`p`) lo reprocesa para siempre: en el caso de todos repetidos (ejemplo 2), la partición devuelve `p = 0` y llamar `quickSort(a, 0, 0)` en bucle no reduce nada → recursión infinita.
- **`i` arranca en `ini - 1`:** la primera vez que `a[j] < pivote`, el `i++` la convierte en `ini` antes del `swap`; si arranca en `ini`, el primer swap se hace antes de tiempo y la partición queda corrida.
- **El pivote ordena pero no es la comparación del `if`:** el `if (a[j] < pivote)` decide el lado. Usar `<=` también funciona aquí; lo importante es que el pivote termine en `i + 1` (su posición final).
- **Solo `swap`, sin pérdida de datos:** el clásico `int t = a[x]; a[x] = a[y]; a[y] = t;`. El swap del pivote con `a[i + 1]` es lo que deja el pivote en su lugar.
- **Recursión sobre segmentos:** cada llamada trabaja un **rango** `[ini, fin]`, no todo el arreglo. Confundir `fin` con `a.length - 1` en las llamadas recursivas rompería los límites.
- **Ordenado de entrada = sin swap:** el ejemplo 4 sigue siendo válido; el quicksort lo procesa igual (su "peor caso" de tiempo no se observa con estos datos chicos).

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

```
static void quickSort(int[] a, int ini, int fin) {
    if (ini >= fin) return;
    int p = particion(a, ini, fin);
    quickSort(a, ini, p - 1);
    quickSort(a, p + 1, fin);
}
```
Rastrea `particion` del ejemplo 1 a mano: pivote final `21`, `i` crece con cada valor menor que `21` (`5`, `12`, `8`), al cerrar el pivote se coloca en su posición y vuelve separando `izquierda`/`derecha`. Cada lado se ordena solo.

</details>
