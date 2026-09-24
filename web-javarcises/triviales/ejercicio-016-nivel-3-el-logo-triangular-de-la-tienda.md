# Ejercicio 016 - El logo triangular de la tienda

**Nivel:** 3 - Básico III
**Tema(s):** bucles anidados (`for` dentro de `for`), relación fila↔columna, impresión con espacios, salto de línea
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

Una imprenta prepara el logo de una tienda: un triángulo rectángulo formado por asteriscos, **alineado a la derecha**. El gerente solo elige la altura `N` (número de filas) y el sistema dibuja la figura. Por ejemplo, con `N = 4`:

```
   *
  **
 ***
****
```

Cada fila tiene espacios al inicio (que van disminuyendo de arriba hacia abajo) y asteriscos al final (que van aumentando). La fila de arriba tiene `1` asterisco y la de abajo `N`.

## Instrucciones

- Usa la clase `Scanner` para leer `N` (se asume un valor entre 3 y 20; la validación es tema de niveles posteriores).
- Usa un bucle **anidado**: un `for` por cada fila y, dentro, los bucles para los espacios y para los asteriscos.
- Escribe los espacios con `System.out.print(" ")` y los asteriscos con `System.out.print("*")` (sin `println`), y cierra cada fila con `System.out.println()`.
- No uses `System.out.printf` ni `String.repeat`.
- En la última fila no debe haber espacios: el triángulo debe quedar pegado al borde derecho.

## Firma sugerida

```java
import java.util.Scanner;

public class LogoTriangular {
    public static void main(String[] args) {
        // Tu código aquí
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1 (N = 4):**
```
Entrada: 4
Salida:    *
          **
         ***
        ****
```

**Ejemplo 2 (N = 3):**
```
Entrada: 3
Salida:   *
         **
        ***
```

**Ejemplo 3 (case borde, N = 1... se asume N >= 3):**
```
Entrada: 5
Salida:     *
           **
          ***
         ****
        *****
```

## Casos límite a considerar

- **La regla de cada fila:** en la fila `i` (empezando en 1) hay `N - i` espacios y `i` asteriscos. El error clásico es invertir los dos conteos (el triángulo sale alineado a la izquierda o con la punta hacia abajo).
- **`off-by-one`:** si la fila de abajo no termina pegada al borde derecho, los conteos de espacios/asteriscos están corridos en 1.
- El salto de línea de cada fila: si olvidas el `println()` final, toda la figura sale en una sola línea.
- `N` mínimo de la figura (3) y su valor máximo esperado (20): para valores grandes, las filas siguen creciendo de 1 en 1.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

Prueba pensar en la fila `i` empezando desde 1 (`for (int i = 1; i <= N; i++)`): primero imprime `N - i` espacios con un `for` interno, luego `i` asteriscos con otro `for`, y después `System.out.println()`. Cuenta a mano la fila 1 con `N = 4` para validar tu fórmula.

</details>
