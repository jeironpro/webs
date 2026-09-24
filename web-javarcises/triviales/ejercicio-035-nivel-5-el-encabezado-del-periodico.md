# Ejercicio 035 - El encabezado del periódico

**Nivel:** 5 - Intermedio II
**Tema(s):** métodos de `String` (`trim`, `length`, `split`, `charAt`...), tokens vacíos, conteo de palabras, búsqueda de máximo de longitud con empates
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

El redactor jefe del periódico pega un titular en un solo campo de texto, y los titulares llegan con **espacios erráticos**: extras al inicio, al final y entre palabras. Antes de publicarlo, el sistema debe reportar cuántas **palabras** tiene y cuál es la **más larga**.

Palabra = cualquier grupo de caracteres que no contenga espacios. Los espacios vacíos "entre espacios" no cuentan como palabras ni las separan dos veces.

El programa lee una línea (con `nextLine()`) y muestra:

```
Palabras: X
Palabra más larga: Y
```

## Instrucciones

- Usa `Scanner.nextLine()` para leer el titular completo.
- **Limpia los bordes** con `trim()` antes de procesar.
- Separa con `split(" ")` (un espacio simple como carácter literal, no una expresión regular de "uno o más").
- Recorre los trozos resultantes con un `for` y **salta los vacíos** (`trozo.isEmpty()`), porque un doble espacio genera un trozo vacío que no es una palabra.
- Cuenta las palabras y busca la de **mayor longitud**; en empate, gana la **primera** que apareció en el titular.
- No uses colecciones (`ArrayList`, etc.) ni otras librerías.
- Si no hay palabras, la segunda línea será `Palabra más larga: -`.

## Firma sugerida

```java
import java.util.Scanner;

public class EncabezadoDelPeriodico {
    public static void main(String[] args) {
        // Tu código aquí
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1 (la trampa de los espacios):**
```
Entrada:   El gran  día   del   campeonato
Salida: Palabras: 5
        Palabra más larga: campeonato
```

**Ejemplo 2 (sin palabras):**
```
Entrada:
Salida: Palabras: 0
        Palabra más larga: -
```

**Ejemplo 3 (empate de longitud):**
```
Entrada: ana casa mesa
Salida: Palabras: 3
        Palabra más larga: casa
```

## Casos límite a considerar

- **Trozos vacíos:** `"  El   gran"` separado con `split(" ")` produce `["", "", "El", "", "", "gran", ...]`. Sin filtrar `isEmpty()`, contarías "palabras" que no existen.
- **Espacios al borde:** `trim()` los quita; sin él, un titular con espacio inicial genera un trozo vacío al principio.
- **Empate de largos:** en `"ana casa mesa"` (todas de 4 letras) gana `casa`, la primera. Usa `>` estricto, no `>=`.
- El `-` como marcador cuando no hay palabras (evita que imprimas una variable vacía que confunda).
- `split(" ")` con comilla/espacio es literal: no uses `split(" +")` ni regex (queda para niveles avanzados).

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

`String[] partes = titular.split(" "); int contar = 0; String masLarga = ""; for (String p : partes) { if (p.isEmpty()) continue; contar++; if (p.length() > masLarga.length()) masLarga = p; }`. Con `trim()` al inicio y `masLarga` inicializado con `""`, el empate y el caso "sin palabras" quedan resueltos.

</details>
