# Ejercicio 057 - La depuración de la fila de envíos

**Nivel:** 9 - Colecciones
**Tema(s):** iteradores explícitos (`Iterator`, `hasNext`, `next`, `remove`), eliminación durante el recorrido, excepción `ConcurrentModificationException`
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

La bodega de paquetería tiene una fila de envíos (números de guía) y debe **sacar de la fila** a todos los que fallaron el control de calidad: las guías **divisibles entre 7**. El problema es que **no se puede modificar una lista mientras se la recorre con un `for-each`**: Java lanza `ConcurrentModificationException`. La forma correcta es usar un **iterador explícito**, que permite eliminar el elemento actual con `remove()` sin romper el recorrido.

El programa lee `N` (mayor a 0) guías, elimina las divisibles entre 7 y muestra:

```
Fuera de la fila: guías eliminadas separadas por espacio
Quedan X envíos: guías restantes separadas por espacio
```

## Instrucciones

- Importa `java.util.Iterator`, `java.util.ArrayList` y crea `ArrayList<Integer> fila` con las `N` guías.
- Recorre con un **`Iterator<Integer>` explícito** (no `for-each`):
  - `while (it.hasNext()) { int g = it.next(); if (g % 7 == 0) { /* imprime; it.remove(); */ } }`
- Imprime las guías eliminadas conforme las sacas, y al final imprime `fila.size()` y las restantes.
- **No** uses `fila.remove(...)` desde dentro de un `for-each`, ni borres por índice ajustando a ciegas (se te escaparían elementos).
- La salida respeta el formato indicado (si no hay eliminadas ni restantes, se imprimen líneas vacías tras el rótulo).

## Firma sugerida

```java
import java.util.ArrayList;
import java.util.Iterator;
import java.util.Scanner;

public class DepuracionDeLaFila {
    public static void main(String[] args) {
        // Tu código aquí
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1:**
```
Entrada: 5
Entrada: 3
Entrada: 7
Entrada: 14
Entrada: 5
Entrada: 9
Salida: Fuera de la fila: 7 14
        Quedan 3 envíos: 3 5 9
```

**Ejemplo 2 (no hay ninguna quitada):**
```
Entrada: 3
Entrada: 1
Entrada: 2
Entrada: 4
Salida: Fuera de la fila:
        Quedan 3 envíos: 1 2 4
```

**Ejemplo 3 (todas quitadas):**
```
Entrada: 2
Entrada: 7
Entrada: 21
Salida: Fuera de la fila: 7 21
        Quedan 0 envíos:
```

## Casos límite a considerar

- **La trampa del `for-each`:** borrar con `fila.remove(...)` dentro de un `for (int g : fila)` lanza `ConcurrentModificationException` en tiempo de ejecución (el iterador interno detecta la modificación externa). El `Iterator` explícito es la solución, porque su `remove()` avisa al propio recorrido.
- **Orden de `next` y `remove`:** primero `next()` (que avanza y devuelve el elemento), **después** `remove()` (elimina el último devuelto). Llamar `remove()` sin `next()` previo lanza `IllegalStateException`.
- **El borrado no salta elementos:** como `remove()` del iterador elimina el elemento actual sin descolocar el próximo, no necesitas retroceder el índice (a diferencia de un bucle por índice, donde `list.remove(i)` con `i` creciente te saltaría elementos).
- Sin guías divisibles entre 7: la línea de eliminadas sale vacía tras el rótulo.
- `N = 0` no aplica (asumimos `N > 0`); si llegara, ambas líneas saldrían vacías sin errores.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

```
Iterator<Integer> it = fila.iterator();
while (it.hasNext()) {
    int g = it.next();
    if (g % 7 == 0) {
        System.out.print(g + " ");
        it.remove();
    }
}
```
Al final `System.out.println(); System.out.println("Quedan " + fila.size() + " envíos: ");` y otro recorrido (o `for-each`, ya sin modificar) para las restantes.

</details>
