# Ejercicio 001 - Convertidor de tiempo de carrera

**Nivel:** 1 - Básico I
**Tema(s):** variables, operadores aritméticos, división entera y módulo, entrada por consola
**Dificultad estimada:** ⭐⭐☆☆☆

## Enunciado

El entrenador de un equipo de atletismo cronometra a sus corredores en **segundos** con un cronómetro digital, pero necesita reportar los tiempos en formato de horas, minutos y segundos separados para la tabla de resultados.

Escribe un programa que solicite por consola el tiempo total en segundos de una carrera y lo muestre descompuesto en horas, minutos y segundos, con el formato:

```
Tiempo: Xh Ymin Zs
```

El programa debe funcionar para cualquier cantidad de segundos mayor o igual a 0.

## Instrucciones

- Usa la clase `Scanner` para leer el valor.
- Resuelve el problema usando solo variables y operadores aritméticos (`/`, `%`).
- No uses `if` ni `else`.
- No uses `String.format`, `printf` ni clases tipo `java.time`.
- La salida debe ser exactamente una línea con el formato indicado.

## Firma sugerida

```java
import java.util.Scanner;

public class ConvertidorDeTiempo {
    public static void main(String[] args) {
        // Tu código aquí
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1:**
```
Entrada: 8130
Salida: Tiempo: 2h 15min 30s
```

**Ejemplo 2 (caso borde):**
```
Entrada: 0
Salida: Tiempo: 0h 0min 0s
```

**Ejemplo 3 (solo segundos):**
```
Entrada: 59
Salida: Tiempo: 0h 0min 59s
```

## Casos límite a considerar

- 0 segundos (resultado de todo ceros).
- Valores menores a 60 (no deben aparecer horas ni minutos).
- Múltiplos exactos de 60 y de 3600 (ej. 7200 → `0h` no debe "desaparecer"; cada parte debe mostrarse siempre).
- Valores grandes (ej. 100000 segundos).

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

Las horas son el resultado de dividir el total entre 3600, y el sobrante de esa división (`%`) son los segundos que quedan por descomponer. Aplica el mismo razonamiento una vez más para los minutos.

</details>
