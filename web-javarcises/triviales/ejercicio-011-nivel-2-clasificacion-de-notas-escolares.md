# Ejercicio 011 - Clasificación de notas escolares

**Nivel:** 2 - Básico II
**Tema(s):** cadenas `if`/`else if`/`else`, operadores relacionales, rangos, entrada por consola
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

Una escuela necesita un programa para procesar las actas de calificaciones. El profesor ingresa una **nota numérica** (de 0 a 100) y el programa debe convertirla a la clasificación oficial:

| Rango | Clasificación |
|---|---|
| 90 – 100 | Sobresaliente |
| 80 – 89 | Notable |
| 70 – 79 | Bien |
| 60 – 69 | Suficiente |
| 0 – 59 | Insuficiente |

Si la nota está fuera del rango 0–100, el programa debe responder `Nota inválida`. Los extremos del rango pertenecen a la clasificación (un `89` es Notable, un `90` es Sobresaliente).

## Instrucciones

- Usa la clase `Scanner` para leer la nota.
- Resuelve la clasificación con una cadena **`if` / `else if` / `else`**, en orden descendente o usando rangos con `&&` (el `switch` queda para otro tema).
- Presta especial atención al **orden** de las condiciones: una nota de 85 debe clasificar como Notable, no caer en una rama anterior.
- Usa los límites inclusivos correctos (`>=` y `<=`).
- No uses librerías externas.

## Firma sugerida

```java
import java.util.Scanner;

public class ClasificacionDeNotas {
    public static void main(String[] args) {
        // Tu código aquí
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1:**
```
Entrada: 92
Salida: Clasificación: Sobresaliente
```

**Ejemplo 2 (límite exacto):**
```
Entrada: 85
Salida: Clasificación: Notable
```

**Ejemplo 3 (caso borde de rango):**
```
Entrada: 100
Salida: Clasificación: Sobresaliente
```

**Ejemplo 4 (nota inválida):**
```
Entrada: 101
Salida: Nota inválida
```

## Casos límite a considerar

- **El orden importa:** si pones `if (nota >= 60)` antes de `if (nota >= 80)`, una nota de 85 caerá en el rango de "Suficiente". Ordena de mayor a menor (o usa rangos con `&&`).
- Límites exactos: `59`, `60`, `69`, `70`, `79`, `80`, `89`, `90`, `99`, `100`: cada uno debe caer en **exactamente una** clasificación.
- Nota 0 → Insuficiente (no inválida).
- Notas fuera de rango: `101`, `-3` → `Nota inválida`.
- La rama final debe cubrir la invalidez, no las notas bajas.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

Ordénalo de mayor a menor: `if (nota >= 90)` primero, luego `>= 80`, luego `>= 70`, luego `>= 60`, y `else` para la Insuficiente e inválida resuelta con un `&&` dentro de los límites o una validación previa.

</details>
