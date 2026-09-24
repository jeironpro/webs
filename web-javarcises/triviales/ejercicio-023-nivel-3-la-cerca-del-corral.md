# Ejercicio 023 - La cerca del corral

**Nivel:** 3 - Básico III
**Tema(s):** bucles anidados, condición sobre los índices de fila/columna, dibujo por consola
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

Un ganadero quiere pintar la cerca de su corral en forma de **rectángulo hueco** sobre la pared del galpón: un borde de asteriscos y el interior vacío. Él elige las dimensiones (`Filas` x `Columnas`) y el programa dibuja la figura.

Por ejemplo, con 4 filas y 5 columnas:

```
*****
*   *
*   *
*****
```

El borde son los asteriscos; todo lo demás son espacios.

## Instrucciones

- Usa la clase `Scanner` para leer las **filas** y luego las **columnas** (se asume que ambos son mayores o iguales a 3; la validación es tema de niveles posteriores).
- Dibuja con un bucle **anidado**: el `for` exterior recorre las filas y el interior las columnas.
- Dentro del bucle interior decide carácter por carácter (asterisco si es fila/columna en el borde, espacio si no), e imprime con `System.out.print`.
- Cierra cada fila con `System.out.println()`.
- No uses `printf` ni `String.repeat`.
- La salida debe ser exactamente la figura: un asterisco en cada esquina y a lo largo de todo el borde.

## Firma sugerida

```java
import java.util.Scanner;

public class CercaDelCorral {
    public static void main(String[] args) {
        // Tu código aquí
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1:**
```
Entrada: 4
Entrada: 5
Salida: *****
        *   *
        *   *
        *****
```

**Ejemplo 2:**
```
Entrada: 3
Entrada: 3
Salida: ***
        * *
        ***
```

**Ejemplo 3 (caso borde, ambas dimensiones iguales):**
```
Entrada: 5
Entrada: 4
Salida: ****
        *  *
        *  *
        *  *
        ****
```

## Casos límite a considerar

- **La fila afuera:** la primera fila (`i == 0`) y la última (`i == filas - 1`) van llenas de asteriscos; lo mismo la primera y última columna (`j == 0`, `j == columnas - 1`).
- **El error clásico de `&&`:** algunos escriben `if (i == 0 && j == 0) print("*")`, lo que dibuja solo una cruz en las esquinas, no un borde. La condición correcta es un `||` entre los cuatro casos.
- **`off-by-one`:** con `filas - 1` y `columnas - 1` (las posiciones empiezan en 0). Una fila mal delimitada deja el borde abierto por un lado.
- Filas o columnas de 1 o 2 producirían figuras degeneradas (todo asterisco o bordes dobles): anótalo, aunque asumimos dimensiones >= 3.
- El `println()` final de cada fila: si falta, la figura se encola en una sola línea.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

Dentro del bucle interior escribe `if (i == 0 || i == filas - 1 || j == 0 || j == columnas - 1)` para imprimir `*`, y `else` un espacio. Prueba a mano con 4x5 antes de teclear código.

</details>
