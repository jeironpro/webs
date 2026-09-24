# Ejercicio 024 - El conteo de vocales del trabalenguas

**Nivel:** 3 - Básico III
**Tema(s):** bucle sobre caracteres de un `String`, clasificación de caracteres (`charAt`), acumulador/contador, mayúsculas
**Dificultad estimada:** ⭐⭐☆☆☆

## Enunciado

En el concurso anual de trabalenguas de la escuela, el jurado dicta una frase y la consola debe contar cuántas **vocales** tiene, para asignar una dificultad oficial (las frases con más vocales valen más puntos).

Las vocales cuentan sin importar si son mayúsculas o minúsculas y sin importar los espacios: solo entran `a, e, i, o, u`. La `y` **no** es vocal.

El programa lee una línea completa (puede ser una frase con espacios) y muestra:

```
Vocales: X
```

## Instrucciones

- Usa `Scanner.nextLine()` para leer la frase completa (incluye los espacios).
- Recorre la frase carácter por carácter con un bucle `for` y `charAt(i)`.
- Cuenta si cada carácter es una vocal, **ignorando mayúsculas** (normaliza cada carácter con un `toLowerCase()` o compara ambas variantes).
- No cuentes la `y` ni los acentos (las vocales acentuadas quedan fuera de alcance; anótalo como limitación).
- No uses arreglos, expresiones regulares ni `count` de librerías: el conteo se hace a mano.
- La salida es exactamente una línea con el formato indicado.

## Firma sugerida

```java
import java.util.Scanner;

public class ConteoDeVocales {
    public static void main(String[] args) {
        // Tu código aquí
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1:**
```
Entrada: Como como se come el coco
Salida: Vocales: 10
```

**Ejemplo 2 (mayúsculas):**
```
Entrada: El Trabalenguas ESTRENO
Salida: Vocales: 9
```

**Ejemplo 3 (caso borde, una sola vocal):**
```
Entrada: a
Salida: Vocales: 1
```

**Ejemplo 4 (sin vocales):**
```
Entrada: sky
Salida: Vocales: 0
```

## Casos límite a considerar

- **La `y` no es vocal:** en español solo `a e i o u`. Una frase como "sky" o "y" debe dar `0`.
- **Mayúsculas:** "ESTRENO" tiene la `E` y `O` mayúsculas; sin normalizar, el conteo las pierde.
- **La trampa del carácter:** `toLowerCase()` no existe sobre un `char`; o lo conviertes a `String` (ej. `String.valueOf(letra).toLowerCase().charAt(0)`) o comparas dos variantes (`letra == 'a' || letra == 'A'`). Elige una y sé consistente.
- Frase vacía o solo espacios → `0` vocales.
- Acentos (`á`, `é`…) quedan fuera del alcance: documéntalo en el código/enunciado como limitación.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

Un contador `int vocales = 0;` y, dentro del `for`, algo como: `if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u' || c == 'A' || c == 'E' || c == 'I' || c == 'O' || c == 'U') vocales++;` (o normaliza el carácter primero). Cuenta a mano el ejemplo 1 para validar los 10.

</details>
