# Ejercicio 013 - El topógrafo y los terrenos triangulares

**Nivel:** 2 - Básico II
**Tema(s):** condiciones anidadas (`if` dentro de `if`), comparaciones entre variables, operadores relacionales, validación lógica
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

Un topógrafo mide lotes triangulares y necesita un programa que, dadas las **tres distancias entre mojones** (sus lados), le diga si realmente forman un triángulo y, de ser así, de qué tipo es.

**Regla de existencia:** tres segmentos forman un triángulo solo si **cada lado es estrictamente menor que la suma de los otros dos** (por ejemplo, `2, 2, 4` no lo forman).

Si forman triángulo, se clasifican así:
- **Equilátero:** los tres lados iguales.
- **Isósceles:** exactamente dos lados iguales.
- **Escaleno:** los tres lados distintos.

## Instrucciones

- Usa la clase `Scanner` para leer los tres lados (enteros).
- **Primero** resuelve si es un triángulo válido; **solo después** clasifica sus lados (usa condiciones anidadas).
- La clasificación de "equilátero" debe comprobarse **antes** que la de "isósceles": un triángulo con tres lados iguales también tiene dos iguales, y no debe clasificar mal.
- La salida debe ser una sola línea: `No es un triángulo`, `Triángulo equilátero`, `Triángulo isósceles` o `Triángulo escaleno`.

## Firma sugerida

```java
import java.util.Scanner;

public class TopografoTriangular {
    public static void main(String[] args) {
        // Tu código aquí
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1:**
```
Entrada: 3
Entrada: 4
Entrada: 5
Salida: Triángulo escaleno
```

**Ejemplo 2 (la trampa del caso degenerado):**
```
Entrada: 2
Entrada: 2
Entrada: 4
Salida: No es un triángulo
```

**Ejemplo 3 (tres lados iguales):**
```
Entrada: 5
Entrada: 5
Entrada: 5
Salida: Triángulo equilátero
```

**Ejemplo 4 (caso borde de orden):**
```
Entrada: 4
Entrada: 4
Entrada: 6
Salida: Triángulo isósceles
```

## Casos límite a considerar

- **2, 2, 4:** la resta/suma da justo cero de margen (`2 + 2 == 4`): no forma triángulo por ser un caso degenerado. La comparación debe ser **estrictamente menor**, no menor o igual.
- Orden de las comprobaciones: si evalúas "isósceles" antes de "equilátero", los tres lados iguales caerían en la rama equivocada.
- Lados con `0` o negativos: la regla de existencia debería rechazarlos (ej. `0, 0, 0` no pasa porque `0 + 0 > 0` es falso).
- Importa que la validación de existencia use las **tres** comparaciones (`a+b>c`, `a+c>b`, `b+c>a`), no solo una: si pides los lados en distinto orden, la condición debe seguir funcionando.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

Comprueba primero: `if (a + b > c && a + c > b && b + c > a)`. Dentro de esa rama, anida el chequeo `a == b && b == c` antes de mirar si hay solo dos lados iguales (`a == b || a == c || b == c`).

</details>
