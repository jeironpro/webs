# Ejercicio 072 - La búsqueda binaria recursiva del catálogo

**Nivel:** 14 - Experto I
**Tema(s):** **recursión**, búsqueda binaria, dividir y conquistar, casos base y reducción de intervalo
**Dificultad estimada:** ⭐⭐⭐⭐☆

## Enunciado

El catálogo del almacén guarda sus códigos **ordenados** (de menor a mayor). Para encontrar un código, se usa **búsqueda binaria recursiva**: mirar el elemento del medio; si es el buscado, listo; si el buscado es menor, buscar en la **mitad izquierda**; si es mayor, en la **mitad derecha**; repetir hasta reducirse a nada.

El programa lee `N` (mayor a 0), los `N` códigos ya ordenados, y luego un código `X` a buscar. Imprime `Posición: P` (empezando en 1) o `No encontrado`.

La búsqueda binaria es el ejemplo canónico de **"dividir y conquistar"** recursivo: cada llamada trabaja sobre la mitad del intervalo anterior, sin necesidad de recursión lineal sobre todo el arreglo.

## Instrucciones

- Implementa **`static int busquedaBinaria(int[] a, int ini, int fin, int x)`**:
  - **Caso base:** si `ini > fin`, no queda nada donde buscar → devuelve `-1`.
  - `int mid = (ini + fin) / 2;`
  - Si `a[mid] == x` → devuelve `mid`.
  - Si `x < a[mid]` → devuelve `busquedaBinaria(a, ini, mid - 1, x)`.
  - Si no → devuelve `busquedaBinaria(a, mid + 1, fin, x)`.
- `main` llama con `ini = 0` y `fin = a.length - 1`, y guarda el resultado en una variable.
- El arreglo **ya viene ordenado**: la búsqueda binaria supone ese requisito; no se ordena dentro del programa.
- Al imprimir la posición, recuerda que el arreglo indexa desde `0` y la salida pide posiciones desde `1`.
- No uses `Arrays.binarySearch` ni `while`/`for`: el recorrido es **recursivo**.

## Firma sugerida

```java
import java.util.Scanner;

public class BuscadorBinario {
    public static void main(String[] args) {
        // Tu código aquí
    }

    static int busquedaBinaria(int[] a, int ini, int fin, int x) {
        // Tu código aquí
        return -1;
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1 (encontrar en la mitad):**
```
Entrada: N = 7
Entrada: 10 20 30 40 50 60 70
Entrada: X = 40
Salida: Posición: 4
```

**Ejemplo 2 (encontrar al inicio):**
```
Entrada: N = 7
Entrada: 10 20 30 40 50 60 70
Entrada: X = 10
Salida: Posición: 1
```

**Ejemplo 3 (no existe):**
```
Entrada: N = 7
Entrada: 10 20 30 40 50 60 70
Entrada: X = 45
Salida: No encontrado
```

**Ejemplo 4 (un solo elemento):**
```
Entrada: N = 1
Entrada: 99
Entrada: X = 99
Salida: Posición: 1
```

## Casos límite a considerar

- **Caso base `ini > fin`:** es el que corta la recursión cuando el elemento no existe (ejemplo 3). Sin él, el método recursiona para siempre.
- **`mid - 1` y `mid + 1`:** la mitad ya fue revisada, así que se excluye del siguiente intervalo. Usar `ini, mid` o `mid, fin` vuelve a incluir el centro y puede entrar en recursión infinita.
- **La recursión debe «devolver» el resultado:** cada llamada hace `return busquedaBinaria(...)`. Si el `return` falta, la llamada recursiva calcula bien pero el resultado se pierde y siempre devuelve el `-1` de cierre.
- **Posición desde 1:** el índice `mid` está en base 0; la salida pide `mid + 1`. Olvidar el `+1` da una posición desfasada (ejemplo 1 saldría `3`).
- **Requiere arreglo ordenado:** sobre datos desordenados la búsqueda binaria puede "no encontrar" lo que sí está. Es una precondición del problema, no un error del algoritmo.
- **`N = 1`:** `mid` coincide con el único elemento: funciona con el mismo código (ejemplo 4), sin casos especiales.
- La comparación usa `<` en dos ramas (menor/mayor) y `==` para igualdad; el orden de las tres ramas debe ser completo.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

```
static int busquedaBinaria(int[] a, int ini, int fin, int x) {
    if (ini > fin) return -1;
    int mid = (ini + fin) / 2;
    if (a[mid] == x) return mid;
    if (x < a[mid]) return busquedaBinaria(a, ini, mid - 1, x);
    return busquedaBinaria(a, mid + 1, fin, x);
}
```
En `main`: `int r = busquedaBinaria(codigos, 0, codigos.length - 1, x);` y luego `if (r == -1) ... else ... (r + 1)`.

</details>
