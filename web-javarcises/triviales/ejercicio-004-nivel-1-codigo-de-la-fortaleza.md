# Ejercicio 004 - Código de la fortaleza

**Nivel:** 1 - Básico I
**Tema(s):** tipo `char`, casting (`int`/`char`), operadores aritméticos, entrada por consola
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

Una fortaleza medieval guarda sus secretos con un cifrado sencillo: cada letra de la documentación interna se representa por su **código numérico** (su valor Unicode). Para el archivo secreto, además, el guardián desplaza cada letra **3 posiciones** en el alfabeto antes de imprimirla. El guardián quiere automatizar la conversión: ya tiene la letra en mente y el programa debe mostrar su código y la versión desplazada.

Escribe un programa que lea **una letra** del abecedario y muestre:

```
Código de la letra: XXX
Letra desplazada: Y
```

Donde `XXX` es el valor numérico de la letra y `Y` es la letra que está 3 posiciones más adelante en el alfabeto.

## Instrucciones

- Usa la clase `Scanner` para leer la letra (entrada de un solo carácter).
- Debes **convertir** entre el carácter y su número usando casting: `(int)` y `(char)`.
- No uses `if` ni `else` (la validación de entrada es tema de niveles posteriores; anótala en casos límite pero no la implementes).
- No uses `HashMap`, tablas ni estructuras de datos.
- Considera que la letra ingresada siempre está dentro del alfabeto y que la letra desplazada no sale del rango de letras (ej. la entrada `z` no será desplazada).

## Firma sugerida

```java
import java.util.Scanner;

public class CodigoDeLaFortaleza {
    public static void main(String[] args) {
        // Tu código aquí
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1 (minúscula):**
```
Entrada: h
Salida: Código de la letra: 104
        Letra desplazada: k
```

**Ejemplo 2 (mayúscula):**
```
Entrada: A
Salida: Código de la letra: 65
        Letra desplazada: D
```

**Ejemplo 3 (caso borde):**
```
Entrada: j
Salida: Código de la letra: 106
        Letra desplazada: m
```

## Casos límite a considerar

- Distintas categorías de letras tienen códigos continuos pero separados: las minúsculas empiezan en `97` (`'a'`) y las mayúsculas en `65` (`'A'`).
- Cómo lee `Scanner` un solo carácter: `next()` devuelve una `String`, no un `char` — presta atención a cómo obtener el carácter (por ejemplo, tomando la primera posición).
- Entrada `'x'`, `'y'`, `'z'`: su desplazamiento saldría del alfabeto, por lo que asumimos que no ocurren (tema de validación para niveles siguientes).
- La letra impresa debe ser un `char`, no su número.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

Sumar un `int` a un `char` produce un `int`: primero convierte la letra a número con `(int)`, súmale 3, y vuelve a convertir a carácter con `(char)`.

</details>
