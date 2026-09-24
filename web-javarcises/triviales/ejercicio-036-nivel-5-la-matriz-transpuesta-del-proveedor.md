# Ejercicio 036 - La matriz transpuesta del proveedor

**Nivel:** 5 - Intermedio II
**Tema(s):** arrays bidimensionales, transposición de matrices, creación de una segunda tabla, índices intercambiados
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

El proveedor entrega un reporte en forma de tabla de `F` filas (días) por `C` columnas (productos), donde cada celda es el stock de ese producto ese día. El supermercado quiere girar la tabla: **transponerla**, es decir, que las filas pasen a ser los productos y las columnas los días.

Para una tabla `2 x 3`:

```
1  2  3
4  5  6
```

la transpuesta es `3 x 2`:

```
1  4
2  5
3  6
```

El programa lee `F` y `C` (ambos mayores a 0), llena la tabla y muestra la transpuesta.

## Instrucciones

- Usa la clase `Scanner`.
- Lee `F` y `C`, y guarda en `int[][] tabla` de dimensión `F` por `C`.
- Crea una **segunda matriz** `int[][] transpuesta` de dimensión `C` por `F` (dimensiones invertidas).
- Llénala con bucles anidados intercambiando los índices: `transpuesta[j][i] = tabla[i][j]`.
- Imprime la transpuesta **fila por fila**, cada fila en una línea, con valores separados por espacios.
- No uses colecciones ni métodos de librerías (`Arrays` a mano, sin `equals` ni clones).

## Firma sugerida

```java
import java.util.Scanner;

public class MatrizTranspuesta {
    public static void main(String[] args) {
        // Tu código aquí
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1 (rectangular):**
```
Entrada: 2
Entrada: 3
Entrada: 1
Entrada: 2
Entrada: 3
Entrada: 4
Entrada: 5
Entrada: 6
Salida: 1 4
        2 5
        3 6
```

**Ejemplo 2 (cuadrada):**
```
Entrada: 3
Entrada: 3
Entrada: 1
Entrada: 2
Entrada: 3
Entrada: 4
Entrada: 5
Entrada: 6
Entrada: 7
Entrada: 8
Entrada: 9
Salida: 1 4 7
        2 5 8
        3 6 9
```

**Ejemplo 3 (caso borde, una fila):**
```
Entrada: 1
Entrada: 4
Entrada: 9
Entrada: 8
Entrada: 7
Entrada: 6
Salida: 9
        8
        7
        6
```

## Casos límite a considerar

- **Dimensiones invertidas:** la transpuesta de `F x C` es `C x F`. Si creas `transpuesta` con las mismas dimensiones de la original, en una rectangular no cabrá todo el contenido.
- **Índices cruzados:** en el llenado se escribe `transpuesta[j][i] = tabla[i][j]`; confundir el orden desordena o lanza `ArrayIndexOutOfBoundsException`.
- **La matriz cuadrada engaña:** solo en `F == C` el intercambio "en el lugar" funcionaría (y aún así hay que recorrer solo la mitad). Con dimensiones rectangulares es obligatorio la segunda matriz.
- **Impresión:** la transpuesta se imprime recorriendo sus filas (`C` filas, cada una de `F` valores), no quedarte en las filas de la original.
- `F = 1` o `C = 1`: la tabla queda columna o fila, la transpuesta la gira sin errores.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

`int[][] t = new int[C][F]; for (int i = 0; i < F; i++) for (int j = 0; j < C; j++) t[j][i] = tabla[i][j];` y luego imprime con `for` exterior sobre las `C` filas de `t`. Simula el `2 x 3` del enunciado en papel.

</details>
