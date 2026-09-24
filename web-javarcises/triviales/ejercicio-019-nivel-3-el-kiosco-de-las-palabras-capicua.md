# Ejercicio 019 - El kiosco de las palabras capicúa

**Nivel:** 3 - Básico III
**Tema(s):** bucle sobre caracteres de un `String` (`charAt`, `length`), comparación desde ambos extremos, normalización de mayúsculas
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

En la feria hay un kiosco que regala un premio si dictas una **palabra capicúa** (palíndromo): una palabra que se lee igual de izquierda a derecha que de derecha a izquierda, sin importar mayúsculas. Por ejemplo, "Radar" es capicúa (ignorando que R es mayúscula), pero "Casa" no lo es.

El operador teclea una palabra (una sola, sin espacios) y el programa decide:

```
Es capicúa
```
o
```
No es capicúa
```

## Instrucciones

- Usa `Scanner.nextLine()` para leer la palabra (puede venir con mayúsculas).
- Normaliza primero con `toLowerCase()` para que "Radar" y "radar" se comparen igual.
- Recorre la palabra con un bucle y compara **desde ambos extremos**: `charAt(i)` contra `charAt(longitud - 1 - i)`.
- **No uses** `StringBuilder`, `.reverse()`, recursión ni arreglos para invertir el texto: la comparación se hace directamente por índices.
- Una palabra de un solo carácter siempre es capicúa.
- Asume que la entrada es una sola palabra (puedes anotar el caso de frases con espacios como limitación).
- La salida es exactamente una línea con uno de los dos mensajes.

## Firma sugerida

```java
import java.util.Scanner;

public class KioscoCapicua {
    public static void main(String[] args) {
        // Tu código aquí
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1 (mayúscula al inicio):**
```
Entrada: Radar
Salida: Es capicúa
```

**Ejemplo 2 (no capicúa):**
```
Entrada: Casa
Salida: No es capicúa
```

**Ejemplo 3 (caso borde, un solo carácter):**
```
Entrada: a
Salida: Es capicúa
```

**Ejemplo 4 (todo minúsculas):**
```
Entrada: reconocer
Salida: Es capicúa
```

## Casos límite a considerar

- **La trampa del índice:** al comparar usas `longitud - 1 - i` (el `- 1` por las posiciones que empiezan en 0). Sin él, el primer `charAt` lanza `StringIndexOutOfBoundsException`.
- **Centro de la palabra:** con longitud impar el carácter del medio se compara consigo mismo; el bucle debe detenerse justo a la mitad (ej. `i < longitud / 2`), sin reprocesar.
- **Mayúsculas:** "Radar" sin `toLowerCase()` daría "No es capicúa" (la `R` y la `r` no son iguales).
- Un solo carácter (`i < 1/2`) no entra al bucle y debe salir "Es capicúa" por sí solo.
- Palabras con caracteres acentuados o con espacio quedarían fuera de la regla de "una sola palabra": anótalo como limitación.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

Guarda `int longitud = palabra.length();` y usa `for (int i = 0; i < longitud / 2; i++)` comparando `palabra.charAt(i) != palabra.charAt(longitud - 1 - i)`. Si alguna comparación `!=` es verdadera, deja de comparar y decretas "No es capicúa" (puedes usar un `boolean` y `break`).

</details>
