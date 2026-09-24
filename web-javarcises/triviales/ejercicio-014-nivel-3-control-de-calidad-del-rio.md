# Ejercicio 014 - Control de calidad del río

**Nivel:** 3 - Básico III
**Tema(s):** bucle `for`, acumuladores, contadores, promedio con decimales, entrada por consola
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

La autoridad ambiental monitorea la contaminación de un río midiendo la cantidad de sedimentos en varias muestras tomadas durante la semana. El límite seguro es de **100 mg/L** y una muestra la "supera" si es **estrictamente mayor** a ese valor.

El técnico tiene un archivo de `N` mediciones y necesita tres datos del reporte semanal:

- El **total** de sedimentos medidos.
- El **promedio** de las muestras (con dos decimales).
- Cuántas muestras **superaron el límite**.

El programa primero lee cuántas muestras hay (`N`, mayor a 0) y luego lee cada una de las `N` mediciones.

## Instrucciones

- Usa la clase `Scanner`.
- Primero lee `N`; después lee exactamente **`N` valores** (usa un bucle **`for`** con un contador).
- Mantén un **acumulador** para el total y un **contador** para las muestras que superan el límite (comparación estrictamente `> 100`).
- El promedio se muestra con dos decimales: `Promedio: Y.YY`.
- Considera que `N` siempre es mayor a 0 (la validación de entrada es tema de niveles posteriores).
- La salida tiene exactamente tres líneas:

```
Total: X
Promedio: Y.YY
Sobre el límite: Z
```

## Firma sugerida

```java
import java.util.Scanner;

public class ControlDeCalidadRio {
    public static void main(String[] args) {
        // Tu código aquí
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1:**
```
Entrada: 4
Entrada: 90
Entrada: 110
Entrada: 100
Entrada: 120
Salida: Total: 420
        Promedio: 105.00
        Sobre el límite: 2
```

**Ejemplo 2 (solo una muestra):**
```
Entrada: 1
Entrada: 99
Salida: Total: 99
        Promedio: 99.00
        Sobre el límite: 0
```

**Ejemplo 3 (caso borde del límite):**
```
Entrada: 3
Entrada: 100
Entrada: 99
Entrada: 101
Salida: Total: 300
        Promedio: 100.00
        Sobre el límite: 1
```

## Casos límite a considerar

- **El límite exacto `100`:** una muestra de 100 mg/L **no** supera el límite (solo las estrictamente mayores). En el ejemplo 3 hay una de 100 y solo cuenta 1.
- **Bordes del bucle (`off-by-one`):** si el `for` va de `0` a `N` (o de `1` a `N + 1`), leerás una muestra de más o te faltará una. Debe recorrer exactamente `N` veces.
- **Promedio con decimales:** `total / N` con enteros descarta el decimal. Convierte uno de los operadores a `double`.
- Una sola muestra: el promedio es el valor mismo.
- Si `total` es 0 (todas las muestras valen 0), el promedio debe ser `0.00` sin errores.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

Un patrón típico: `int suma = 0; int contaminadas = 0; for (int i = 0; i < N; i++) { int valor = sc.nextInt(); suma += valor; if (valor > 100) contaminadas++; }`. El promedio se obtiene con `suma / (double) N` y se imprime con `String.format("%.2f", promedio)`.

</details>
