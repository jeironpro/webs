# Ejercicio 006 - Ficha de inscripción deportiva

**Nivel:** 1 - Básico I
**Tema(s):** `Scanner` (`nextInt` vs `nextLine`), tipos de datos, salto de línea pendiente, entrada por consola
**Dificultad estimada:** ⭐⭐☆☆☆

## Enunciado

Un club deportivo registra a sus atletas el día de la inscripción con un programa de escritorio. Cada atleta presenta su documento, y el encargado teclea tres datos en este orden:

1. **Número de documento** (entero).
2. **Nombre completo** (que puede contener espacios, ej. "Ana María Pérez").
3. **Edad** (entero).

El programa debe mostrar el carné impreso con una sola línea:

```
Ficha: Doc X - Nombre: Y - Edad: Z
```

## Instrucciones

- Usa la clase `Scanner`.
- Lee el **documento y la edad con `nextInt()`** y el **nombre con `nextLine()`**, respetando el orden de entrada indicado.
- La salida debe ser exactamente una línea con el formato indicado.
- No uses `if` ni `else` (la validación de entrada es tema de niveles posteriores).
- Prueba tu programa con el ejemplo 1: si la salida no coincide, revisa la sección de casos límite antes de cambiar código.

## Firma sugerida

```java
import java.util.Scanner;

public class FichaDeInscripcion {
    public static void main(String[] args) {
        // Tu código aquí
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1:**
```
Entrada: 1001
Entrada: Ana María Pérez
Entrada: 25
Salida: Ficha: Doc 1001 - Nombre: Ana María Pérez - Edad: 25
```

**Ejemplo 2 (nombre de una sola palabra):**
```
Entrada: 2048
Entrada: Luis
Entrada: 31
Salida: Ficha: Doc 2048 - Nombre: Luis - Edad: 31
```

**Ejemplo 3 (caso borde):**
```
Entrada: 7
Entrada: María de los Ángeles del Pino
Entrada: 42
Salida: Ficha: Doc 7 - Nombre: María de los Ángeles del Pino - Edad: 42
```

## Casos límite a considerar

- *La trampa del salto de línea:* `nextInt()` solo consume el número y **deja el `Enter` sin leer** en el buffer. Si justo después llamas a `nextLine()` para el nombre, esa línea lee el salto de línea sobrante y devuelve un texto vacío. Compara con el ejemplo 1: ¿tu nombre sale en blanco?
- Nombres con muchos espacios o tildes (ej. "María de los Ángeles del Pino") se deben conservar tal cual.
- Edad 0 o documento 0 no deberían "romper" la lectura (la validación de rango se verá en niveles siguientes).

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

Cuando mezclas `nextInt()` con `nextLine()`, el orden importa y hay un carácter `\n` que queda pendiente. Prueba leer el nombre justo después del documento: si sale vacío, añade una lectura extra de `nextLine()` para absorber el salto de línea antes del nombre.

</details>
