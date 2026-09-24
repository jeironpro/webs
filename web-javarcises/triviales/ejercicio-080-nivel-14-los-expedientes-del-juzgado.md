# Ejercicio 080 - Los expedientes del juzgado

**Nivel:** 14 - Experto I
**Tema(s):** **ordenamiento por mezcla (mergesort) recursivo**, división en mitades, intercalado con dos punteros, arreglo auxiliar temporal
**Dificultad estimada:** ⭐⭐⭐⭐☆

## Enunciado

El juzgado tiene `N` expedientes sin ordenar y quiere ordenarlos por folio con **mergesort**: se divide el arreglo en dos mitades, se ordena cada mitad recursivamente y al final se **intercalan** (`merge`) las dos mitades ya ordenadas en un solo bloque ordenado.

El programa lee `N` (mayor a 0), los `N` folios desordenados y los imprime **de menor a mayor** separados por espacio.

A diferencia del quicksort (ejercicio 076), mergesort **no ordena en el lugar**: usa un **arreglo auxiliar** para intercalar, y su división siempre es por la mitad exacta (no depende del pivote).

## Instrucciones

- Implementa **`static void mergeSort(int[] a, int ini, int fin)`**:
  - Caso base: `if (ini >= fin) return;`
  - `int mid = (ini + fin) / 2;`
  - `mergeSort(a, ini, mid);` y `mergeSort(a, mid + 1, fin);`
  - Y luego `merge(a, ini, mid, fin);`.
- Implementa **`static void merge(int[] a, int ini, int mid, int fin)`**:
  1. `int[] temp = new int[fin - ini + 1];`
  2. Tres índices: `i = ini` (mitad izquierda), `j = mid + 1` (mitad derecha), `k = 0` (en `temp`).
  3. Mientras `i <= mid && j <= fin`: copia el menor de los dos, avanzando ese índice.
  4. Cuando una mitad se agota, **copia el resto** de la otra con dos `while` sueltos.
  5. Copia `temp` de vuelta a `a[ini ... fin]`.
- `main` llama `mergeSort(a, 0, a.length - 1)` e imprime.

## Firma sugerida

```java
import java.util.Scanner;

public class ExpedientesDelJuzgado {
    public static void main(String[] args) {
        // Tu código aquí
    }

    static void mergeSort(int[] a, int ini, int fin) {
        // Tu código aquí
    }

    static void merge(int[] a, int ini, int mid, int fin) {
        // Tu código aquí
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
Entrada: 77
Salida: 77
```

**Ejemplo 4 (la mezcla es el corazón):**
```
Entrada: N = 6
Entrada: 3 1 4 1 5 9
Salida: 1 1 3 4 5 9
```

## Casos límite a considerar

- **`merge` parte de una** **posición de inicio `ini` que no es 0:** al copiar `temp` de vuelta, el índice del arreglo es `ini + k`, no `k` a secas (para tramos medios del arreglo). Es el desfase más típico de mergesort.
- **Los límites del bucle principal:** izq llega solo hasta `mid`; der solo hasta `fin`. Si uno usa `i < mid` o `j < fin`, se pierde un elemento en cada mezcla.
- **El resto que queda después del bucle:** cuando una mitad se agota, la otra puede tener elementos sin copiar; son los dos `while` extra (`i <= mid` y `j <= fin`). Olvidarlos "pierde" elementos en cada merge — la salida queda incompleta.
- **El menor con `<=` (no `<`):** con solo `<`, los iguales del lado derecho pasarían "antes" que los del izquierdo; con `<=` el intercalado es **estable** (los iguales conservan el orden en que vinieron, como en el ejercicio 062).
- **Caso base `ini >= fin`:** un segmento de un solo elemento ya está ordenado. Sin él, la división recursiva nunca corta.
- **El arreglo auxiliar se crea dentro de `merge`:** su largo es `fin - ini + 1`. Reutilizar uno global funcionaría, pero el fabricado por invocación es el más claro y evita índices contaminados entre niveles de recursión.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

```
static void mergeSort(int[] a, int ini, int fin) {
    if (ini >= fin) return;
    int mid = (ini + fin) / 2;
    mergeSort(a, ini, mid);
    mergeSort(a, mid + 1, fin);
    merge(a, ini, mid, fin);
}

static void merge(int[] a, int ini, int mid, int fin) {
    int[] temp = new int[fin - ini + 1];
    int i = ini, j = mid + 1, k = 0;
    while (i <= mid && j <= fin) {
        if (a[i] <= a[j]) temp[k++] = a[i++];
        else temp[k++] = a[j++];
    }
    while (i <= mid) temp[k++] = a[i++];
    while (j <= fin) temp[k++] = a[j++];
    for (int p = 0; p < temp.length; p++) a[ini + p] = temp[p];
}
```
Observa `a[ini + p]`: es el contrapeso del `ini` que no empieza en 0. Prueba `merge(a, 0, 0, 1)` sobre `[33, 5]`: empuja `5` primero y luego `33`.

</details>
