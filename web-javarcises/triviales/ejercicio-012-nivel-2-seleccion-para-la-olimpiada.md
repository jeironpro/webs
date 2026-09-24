# Ejercicio 012 - Selección para la olimpiada de matemáticas

**Nivel:** 2 - Básico II
**Tema(s):** operadores lógicos combinados (`&&`, `||`), rangos con límites inclusivos, condicionales, entrada por consola
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

Un colegio debe seleccionar candidatos para la olimpiada de matemáticas. El reglamento dice que un estudiante clasifica si cumple **todas** estas condiciones:

1. Tener entre **11 y 17 años**, ambos inclusive.
2. Tener un promedio escolar **mayor o igual a 8.0** **o** contar con una **recomendación escrita** del profesor jefe.

El programa recibe los tres datos (edad, promedio, y si hay recomendación) y debe decidir si el estudiante clasifica o no.

## Instrucciones

- Usa la clase `Scanner` para leer **edad** (entero), **promedio** (decimal) y **recomendación** (un `true` o `false`).
- Construye la decisión en **una sola expresión booleana** que combine `&&` y `||`.
- Los límites de edad son inclusivos: `11` y `17` clasifican.
- La recomendación se lee como `true`/`false` directamente (tipo `boolean`).
- La salida debe ser una sola línea: `Clasifica` o `No clasifica`.

## Firma sugerida

```java
import java.util.Scanner;

public class SeleccionOlimpiada {
    public static void main(String[] args) {
        // Tu código aquí
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1 (clasifica por promedio):**
```
Entrada: 14
Entrada: 8.5
Entrada: false
Salida: Clasifica
```

**Ejemplo 2 (clasifica solo por recomendación):**
```
Entrada: 13
Entrada: 6.9
Entrada: true
Salida: Clasifica
```

**Ejemplo 3 (caso borde de edad):**
```
Entrada: 17
Entrada: 7.5
Entrada: false
Salida: No clasifica
```

**Ejemplo 4 (rechazado):**
```
Entrada: 18
Entrada: 9.0
Entrada: true
Salida: No clasifica
```

## Casos límite a considerar

- **El orden lógico:** `&&` se evalúa antes que `||`, pero conviene que la expresión refleje la estructura: `(edad ok) && (promedio ok || recomendación)`.
- Límites de edad inclusivos: `11` y `17` deben clasificar si cumplen el resto; `10` y `18` jamás.
- Promedio justo en `8.0` clasifica; `7.9` no (salvo recomendación).
- Si la recomendación es `false` pero el promedio supera 8, clasifica igual (la `||` no debe "esconderse").
- Un `18` con recomendación sigue sin clasificar: la edad es requisito independiente.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

Escribe los dos requisitos por separado: `boolean edadOk = edad >= 11 && edad <= 17;` y luego combina `edadOk && (promedio >= 8.0 || recomendacion)`. Eso facilita ver el efecto de la `||` sin mezclar rangos por error.

</details>
