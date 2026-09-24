# Ejercicio 020 - ¿El socio tiene número primo?

**Nivel:** 3 - Básico III
**Tema(s):** bucle `for` con búsqueda de divisores, módulo dentro del bucle, optimización con `Math.sqrt`, banderas (`boolean`)
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

Un club deportivo sortea su suscripción anual con un truco: los socios cuyo **número de carnet es primo** entran en una categoría especial con bebidas gratis. El recepcionista teclea el número y el sistema decide si es primo.

Un número es **primo** si solo es divisible entre 1 y entre sí mismo. Para identificarlo, se buscan divisores entre `2` y la **raíz cuadrada del número**: si existe alguno, no es primo.

## Instrucciones

- Usa la clase `Scanner` para leer el número.
- Recorre los posibles divisores con un bucle `for` desde `2` hasta `Math.sqrt(n)` (**inclusive**).
- Vigila el resultado con una variable `boolean` (ej. `boolean esPrimo = true;`) y un `break` si encuentras un divisor.
- Considera que los números **menores o iguales a 1 no son primos** (incluye 0, 1 y negativos) — resuélvelo antes de entrar al bucle.
- No uses arreglos ni listas.
- La salida es exactamente una línea: `El número X es primo` o `El número X no es primo`.

## Firma sugerida

```java
import java.util.Scanner;

public class NumeroPrimoDelClub {
    public static void main(String[] args) {
        // Tu código aquí
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1:**
```
Entrada: 17
Salida: El número 17 es primo
```

**Ejemplo 2 (la trampa del 1):**
```
Entrada: 1
Salida: El número 1 no es primo
```

**Ejemplo 3 (el único par):**
```
Entrada: 2
Salida: El número 2 es primo
```

**Ejemplo 4 (cuadrado perfecto):**
```
Entrada: 25
Salida: El número 25 no es primo
```

**Ejemplo 5 (caso borde):**
```
Entrada: 0
Salida: El número 0 no es primo
```

## Casos límite a considerar

- **El `1` no es primo**, aunque "solo es divisible entre 1 y entre sí mismo" lo sugiera: la convención matemática lo excluye. Debe salir "no es primo" sin pasar por el bucle.
- **El `2` es primo:** el bucle va de `2` a `Math.sqrt(2) ≈ 1.41`, que no se recorre, y la bandera queda en `true`. Fíjate que esto funciona por accidente si el bucle está bien delimitado.
- **Cuadrados perfectos** (25, 49): el divisor está exactamente en `sqrt(n)`, por eso el bucle debe llegar **hasta** la raíz inclusive; si usas `<`, un 25 sería mal clasificado como primo.
- 0 y negativos: caer en "no es primo" antes del bucle.
- Números grandes: recorrer hasta `n` completa tardaría muchísimo; la raíz cuadrada lo limita a ~46.000 pasos para el `int` máximo.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

Patrón: `if (n <= 1) esPrimo = false;` y luego `for (int d = 2; d <= Math.sqrt(n); d++) { if (n % d == 0) { esPrimo = false; break; } }`. Prueba a mano con 25 (recorre 2, 3, 4, 5) y con 2 (no recorre nada).

</details>
