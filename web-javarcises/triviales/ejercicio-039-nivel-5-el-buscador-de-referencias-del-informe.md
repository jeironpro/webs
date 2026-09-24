# Ejercicio 039 - El buscador de referencias del informe

**Nivel:** 5 - Intermedio II
**Tema(s):** métodos de `String` (`indexOf`, `length`, `substring`), búsqueda repetitiva con desplazamiento, posiciones en texto
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

El tribunal revisa un informe auditando cuántas veces aparece una palabra clave en el texto (las referencias legales suelen repetir términos como "cláusula"). El sistema debe contar, para el texto y la palabra que ingresa el usuario (la búsqueda es **sensible a mayúsculas**: "Cláusula" es distinta de "cláusula"), cuántas veces aparece **como subcadena** y en qué posiciones (contando desde 1, la primera letra del texto es la posición 1).

Muestra:

```
Ocurrencias: X
Posiciones: p1 p2 ...
```

## Instrucciones

- Lee el **texto** (con `nextLine()`) y la **palabra buscada** (también con `nextLine()`).
- Usa `indexOf` dentro de un bucle para ir a la siguiente aparición: cada vez buscas a partir de la posición **después del final** de la coincidencia anterior (para no contar la misma superpuesta).
- Detente cuando `indexOf` devuelva `-1` (no hay más).
- Guarda —o imprime directamente— las **posiciones en base 1** (a `indexOf`, que es base 0, súmale 1).
- No uses `split`, expresiones regulares ni colecciones.
- Se considera palabra/texto de al menos un carácter (la validación es tema de niveles posteriores).

## Firma sugerida

```java
import java.util.Scanner;

public class BuscadorDeReferencias {
    public static void main(String[] args) {
        // Tu código aquí
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1:**
```
Entrada: la cláusula dos dice y la cláusula tres repite
Entrada: cláusula
Salida: Ocurrencias: 2
        Posiciones: 4 27
```

**Ejemplo 2 (la trampa de `-1`):**
```
Entrada: hoy no hay coincidencia
Entrada: zeta
Salida: Ocurrencias: 0
        Posiciones:
```

**Ejemplo 3 (mayúsculas importan):**
```
Entrada: Ana y ana no son lo mismo
Entrada: ana
Salida: Ocurrencias: 1
        Posiciones: 7
```

**Ejemplo 4 (coincidencia pegada al inicio):**
```
Entrada: ananá en la pieza
Entrada: ana
Salida: Ocurrencias: 1
        Posiciones: 1
```

## Casos límite a considerar

- **Terminar con `-1`:** `indexOf` devuelve `-1` cuando no encuentra más; sin esa condición de corte, el bucle repite la misma posición infinitamente.
- **Desplazamiento correcto:** para no re-descubrir la misma coincidencia, la siguiente búsqueda empieza en `posicion + buscada.length()` (no en `posicion + 1`). El reto del `substring` no aparece aquí, pero el desplazamiento es esencial.
- **Base 1 vs base 0:** `indexOf` es base 0; al imprimir posiciones se suma 1. Un error clásico reporta posiciones corridas en 1.
- **Mayúsculas:** la búsqueda es sensible; "Ana" y "ana" son distintas (mira el ejemplo 3).
- **Coincidencia pegada:** "ananá" contiene "ana" al inicio (posición 1). Fíjate que con `posición + longitud` saltas a la posición 4 y el segundo "ana" solapado no se cuenta (regla de no superposición).
- Texto o palabra vacíos: anótalos como limitación (con palabra vacía, `indexOf("")` devuelve 0 y el bucle nunca termina).

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

`int desde = 0; int contador = 0; while (true) { int pos = texto.indexOf(buscada, desde); if (pos == -1) break; contador++; System.out.print((pos + 1) + " "); desde = pos + buscada.length(); }`. La segunda aparición de "cláusula" en el ejemplo 1 empieza en la posición 27 (base 1) porque el texto avanza desde el final de la primera.

</details>
