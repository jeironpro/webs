# Ejercicio 075 - El detector de palíndromos recursivo

**Nivel:** 14 - Experto I
**Tema(s):** **recursión sobre cadenas**, reducción de frecuencia con `substring`, caso base por longitud, `charAt`
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

El museo quiere catalogar si una palabra es **palíndromo** (se lee igual al derecho y al revés: `reconocer`, `ana`, `ala`). La definición es naturalmente **recursiva**: una palabra es palíndromo si su primera y su última letra son iguales **y** la palabra interna (la de en medio) también lo es. Las palabras de **longitud 0 o 1** lo son por definición.

El programa lee **una palabra** (una sola, sin espacios) y muestra `Es palíndromo` o `No es palíndromo`.

La recursión aquí **reduce la cadena por los extremos**: cada llamada recibe la subcadena `substring(1, longitud - 1)`, hasta que queda una letra sola (o nada).

## Instrucciones

- Implementa **`static boolean esPalindromo(String s)`**:
  - Caso base: `s.length() <= 1` → `return true`.
  - Si `s.charAt(0) != s.charAt(s.length() - 1)` → `return false`.
  - Si no → `return esPalindromo(s.substring(1, s.length() - 1))`.
- `main` lee la palabra con `next()`, llama al método y decide el mensaje.
- Nada de invertir la palabra con bucles ni `StringBuilder.reverse()`: el chequeo es **recursivo**.
- `substring(1, n - 1)` retira la primera letra y la última; para una palabra de 2 letras eso deja `""` (longitud 0), que el caso base maneja.
- El texto de entrada se asume **sin mayúsculas** (o compara con `Character.toLowerCase` si quieres aceptar "Ana").

## Firma sugerida

```java
import java.util.Scanner;

public class DetectorDePalindromos {
    public static void main(String[] args) {
        // Tu código aquí
    }

    static boolean esPalindromo(String s) {
        // Tu código aquí
        return false;
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1:**
```
Entrada: ana
Salida: Es palíndromo
```

**Ejemplo 2:**
```
Entrada: reconocer
Salida: Es palíndromo
```

**Ejemplo 3 (choca en la primera comparación):**
```
Entrada: hola
Salida: No es palíndromo
```

**Ejemplo 4 (longitud 1, caso base directo):**
```
Entrada: x
Salida: Es palíndromo
```

## Casos límite a considerar

- **`charAt(0)` contra `charAt(s.length() - 1)`:** el último carácter está en `length - 1`, no en `length()`. Confundirlo lanza `StringIndexOutOfBoundsException`.
- **Caso base `length() <= 1`, no `== 1`:** tras varias reducciones puede quedar `""` (palabra de longitud par); con `== 1` se desbordaría la recursión al intentar `charAt(0)` sobre la cadena vacía.
- **`substring(1, length() - 1)` y el índice final exclusivo:** `substring` recorre hasta el índice `length() - 1` **sin incluirlo**. Para `"aa"` da `substring(1, 1)` = `""`, que es el caso base. Recuerda el detalle del ejercicio 039.
- **El `return` que se propaga:** si el paso recursivo no hace `return esPalindromo(...)`, la cadena baja bien pero el resultado `true/false` se pierde (la misma lección del 072 y 073).
- **Mayúsculas:** `"Ana"` con comparación estricta fallaría en `A` vs `a`. Si el enunciado lo permite, normaliza con `Character.toLowerCase(a) != Character.toLowerCase(b)`.
- **La recursión corta temprano:** si la primera y última letra no coinciden, devuelve `false` sin explorar el resto; no hay que "terminar de revisar".

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

```
static boolean esPalindromo(String s) {
    if (s.length() <= 1) return true;
    if (s.charAt(0) != s.charAt(s.length() - 1)) return false;
    return esPalindromo(s.substring(1, s.length() - 1));
}
```
Prueba `esPalindromo("ana")`: `s.charAt(0)=='a'`, `s.charAt(2)=='a'` → llama con `"n"` → caso base `true` → `true`. Para `"ola"`: `'o'` vs `'a'` → `false` directo, sin más llamadas.

</details>
