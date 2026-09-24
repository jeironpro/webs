# Ejercicio 025 - El tablero de calificaciones de la academia

**Nivel:** 4 - Intermedio I
**Tema(s):** arrays unidimensionales, llenado por consola, recorridos (multipase), búsqueda del máximo con empates
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

Una academia de idiomas quiere publicar en su tablero el resultado de un examen. El profesor ingresa las notas de todos los estudiantes en el **orden de la lista** y el sistema debe reportar:

- El **promedio** del curso (dos decimales).
- La **nota máxima** obtenida.
- Los **números de lista** de todos los estudiantes que obtuvieron esa nota máxima (puede haber **empates**).

El programa lee primero cuántos estudiantes hay (`N`, mayor a 0) y luego las `N` notas (enteros entre 0 y 100).

## Instrucciones

- Usa la clase `Scanner`.
- Guarda las notas en un **array unidimensional** `int[] notas` del tamaño `N`, llenándolo con un bucle.
- Usa la propiedad `length` del array para recorrerlo.
- **Primera pasada:** suma para el promedio y encuentra la nota máxima.
- **Segunda pasada:** recorre de nuevo para imprimir **todas** las posiciones (números de lista, empezando en 1) cuyo valor coincida con el máximo.
- No uses colecciones (`ArrayList`, `List`, etc.).
- La salida tiene tres líneas:

```
Promedio: P.PP
Nota máxima: M
Máxima obtenida por: posiciones separadas por espacio
```

## Firma sugerida

```java
import java.util.Scanner;

public class TableroDeCalificaciones {
    public static void main(String[] args) {
        // Tu código aquí
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1 (con empates):**
```
Entrada: 5
Entrada: 70
Entrada: 95
Entrada: 60
Entrada: 95
Entrada: 85
Salida: Promedio: 81.00
        Nota máxima: 95
        Máxima obtenida por: 2 4
```

**Ejemplo 2 (un solo estudiante):**
```
Entrada: 1
Entrada: 82
Salida: Promedio: 82.00
        Nota máxima: 82
        Máxima obtenida por: 1
```

**Ejemplo 3 (todos iguales):**
```
Entrada: 3
Entrada: 75
Entrada: 75
Entrada: 75
Salida: Promedio: 75.00
        Nota máxima: 75
        Máxima obtenida por: 1 2 3
```

## Casos límite a considerar

- **Empates:** si imprimes los máximos mientras buscas en la primera pasada, el primero que alcance un valor que *luego* sería superado se imprime por error. La única forma robusta es **dos pasadas**: primero fijar el máximo, después comparar contra él.
- **El promedio con `double`:** `suma / notas.length` con enteros descarta el decimal. Convierte uno de los operadores (ej. `suma / (double) notas.length`).
- `N = 1`: el único es máximo y su posición es 1.
- Posiciones: la lista empieza en **1**, pero el array empieza en 0 — al imprimir suma 1 al índice.
- Nota máxima repetida al inicio (`95, 95, 70`): ambas posiciones deben imprimirse.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

Primera pasada: `int max = notas[0];` y, para `i` desde 1, `if (notas[i] > max) max = notas[i];` (fíjate que se puede usar la misma pasada para sumar). Segunda pasada: `for (int i = 0; i < notas.length; i++) if (notas[i] == max) System.out.print((i + 1) + " ");` — los usos estrictos `>` garantizan que los empates no "roban" la posición del máximo.

</details>
