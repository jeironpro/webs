# Ejercicio 009 - ¿El año es bisiesto?

**Nivel:** 2 - Básico II
**Tema(s):** condicionales (`if`/`else`), operadores lógicos (`&&`, `||`, `!`), operador módulo, precedencia
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

Un sistema de calendario deportivo debe saber si un año tiene 29 de febrero, porque eso cambia las fechas de varios torneos. La regla del calendario gregoriano es:

Un año es **bisiesto** si es divisible entre 4, **a menos que** sea divisible entre 100; **pero** si es divisible entre 400, sí es bisiesto.

En términos precisos: divisible entre 4 **y** (no divisible entre 100 **o** divisible entre 400).

Escribe un programa que lea un año (entero positivo) y muestre:

```
El año X es bisiesto
```
o
```
El año X no es bisiesto
```

## Instrucciones

- Usa la clase `Scanner` para leer el año.
- Escribe la condición completa en **una sola expresión booleana**, combinando `%`, `&&`, `||` y `!`.
- Usa únicamente una estructura `if`/`else`.
- No uses métodos de `Math` ni tablas precalculadas.
- Considera que el año ingresado siempre es positivo (la validación es tema de niveles posteriores).

## Firma sugerida

```java
import java.util.Scanner;

public class AnioBisiesto {
    public static void main(String[] args) {
        // Tu código aquí
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1:**
```
Entrada: 2024
Salida: El año 2024 es bisiesto
```

**Ejemplo 2 (la trampa clásica):**
```
Entrada: 1900
Salida: El año 1900 no es bisiesto
```

**Ejemplo 3 (caso borde de la excepción):**
```
Entrada: 2000
Salida: El año 2000 es bisiesto
```

## Casos límite a considerar

- **1900** se divide entre 4 **y** entre 100, pero **no** entre 400 → no es bisiesto. Es el caso que rompe la solución ingenua "divisible entre 4".
- **2000** se divide entre 100 pero también entre 400 → sí es bisiesto (la excepción del 400).
- Años como 2023 (no divisible entre 4).
- La precedencia: `&&` se evalúa antes que `||`, así que la condición puede escribirse sin paréntesis; pero si prefieres añadirlos, hazlo bien para no cambiar el significado.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

Fíjate que la regla tiene una excepción anidada: "(divisible entre 4) Y (no divisible entre 100) O (divisible entre 400)". El `!` se aplica solo a la parte de "divisible entre 100".

</details>
