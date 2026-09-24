# Ejercicio 008 - Lectura de los medidores de agua

**Nivel:** 1 - Básico I
**Tema(s):** conversión `String` → `int` (`Integer.parseInt`), `nextLine`, separación de texto (`split`), operadores aritméticos
**Dificultad estimada:** ⭐⭐☆☆☆

## Enunciado

La empresa de acueducto registra cada mes dos lecturas por medidor: la del **mes anterior** y la del **mes actual**. El técnico las digita en un solo campo, separadas por un espacio (ej. `1200 1350`), y el sistema debe calcular el **consumo** (lectura actual menos lectura anterior).

Escribe un programa que lea **una sola línea** con dos números enteros separados por un espacio, los convierta a números enteros y muestre el consumo:

```
Consumo: X
```

Si el consumo sale negativo, el programa debe mostrarlo igual: eso indica una lectura anómala que un supervisor revisará después (la validación es tema de niveles posteriores).

## Instrucciones

- Usa `Scanner.nextLine()` para leer la línea completa (los dos números vienen juntos, no uses `nextInt()` dos veces).
- Convierte los textos a enteros con **`Integer.parseInt(...)`**.
- Antes de separar, normaliza la línea con `trim()` para quitar espacios sobrantes al inicio y al final.
- Separa los dos números con `String.split(" ")`.
- No uses `if` ni `else`.

## Firma sugerida

```java
import java.util.Scanner;

public class LecturaDeMedidores {
    public static void main(String[] args) {
        // Tu código aquí
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1:**
```
Entrada: 1200 1350
Salida: Consumo: 150
```

**Ejemplo 2 (lectura anómala):**
```
Entrada: 1350 1200
Salida: Consumo: -150
```

**Ejemplo 3 (caso borde, sin consumo):**
```
Entrada: 500 500
Salida: Consumo: 0
```

## Casos límite a considerar

- Espacios extra al inicio o al final de la línea (ej. `" 1200 1350 "`): si no haces `trim()`, `parseInt` de un texto con espacios falla.
- Dos espacios seguidos entre los números (`"1200  1350"`): `split(" ")` genera un pedazo vacío que `parseInt` no puede convertir. No es necesario resolverlo, pero reconócelo como limitación.
- Lecturas iguales (consumo 0).
- Números negativos pasan bien por `parseInt`, pero en una lectura real no deberían existir (anótalo).

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

`nextLine()` devuelve un solo `String` con todo: `"1200 1350"`. Sepáralo con `split(" ")` para obtener un arreglo de dos textos, `trim()` antes de separar, y convierte cada uno con `Integer.parseInt` antes de restar.

</details>
