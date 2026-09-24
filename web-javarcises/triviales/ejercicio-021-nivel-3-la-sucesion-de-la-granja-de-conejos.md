# Ejercicio 021 - La sucesión de la granja de conejos

**Nivel:** 3 - Básico III
**Tema(s):** bucle `for`, variables de estado (guardar el valor anterior), generación de secuencias, acumulación en una línea
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

Un biólogo modela el crecimiento de una granja de conejos con la famosa sucesión de Fibonacci: cada valor es la **suma de los dos anteriores**, comenzando la serie en `0, 1, 1, 2, 3, 5, 8, 13…`.

El investigador ingresa cuántos términos quiere (N) y el programa debe imprimir la serie:

```
Serie: 0 1 1 2 3 5
```

## Instrucciones

- Usa la clase `Scanner` para leer `N` (mayor o igual a 0; la validación es tema de niveles posteriores).
- Genera la serie con un bucle `for`, manteniendo **dos variables** con el estado de los dos términos anteriores y una auxiliar para desplazarlos.
- **Sin recursión** (es tema de niveles avanzados) y **sin arreglos**: solo variables dentro del bucle.
- No uses fórmulas ni `Math` para calcular los términos.
- Imprime los términos separados por un espacio en una sola línea, con el prefijo `Serie: `. No debe sobrar un espacio al final.
- Considera que para `N` muy grande la serie supera el rango de un `int`: anótalo, no es necesario evitarlo.

## Firma sugerida

```java
import java.util.Scanner;

public class SucesionDeLaGranja {
    public static void main(String[] args) {
        // Tu código aquí
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1:**
```
Entrada: 6
Salida: Serie: 0 1 1 2 3 5
```

**Ejemplo 2 (la trampa de N pequeño):**
```
Entrada: 2
Salida: Serie: 0 1
```

**Ejemplo 3 (un solo término):**
```
Entrada: 1
Salida: Serie: 0
```

**Ejemplo 4 (caso borde, cero términos):**
```
Entrada: 0
Salida: Serie:
```

## Casos límite a considerar

- **`N = 1` y `N = 2`:** al imprimir los dos primeros términos como "caso especial" antes del bucle, soluciones puestas solo para N grandes se rompen en este punto. Prueba tu programa con N = 1 y N = 2 antes de dar el ejercicio por resuelto.
- **La reasignación:** para avanzar de `a, b` a `b, a + b` necesitas guardar el valor previo en una auxiliar ANTES de sobreescribir (recuerda la lección del intercambio de variables del ejercicio 005).
- **N = 0:** la línea sale sin ningún número: `Serie: ` (el prefijo se imprime, el bucle no se ejecuta) — sin errores.
- Desborde: desde un `N` cercano a 46 los valores ya no caben en `int`. Es una limitación natural, solo reconócela.
- Formato: el primer término es `0` (la serie empieza en 0, no en 1).

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

Con `int a = 0; int b = 1;` imprime el primer término y, en cada paso del bucle, usa una auxiliar: `int aux = a + b; a = b; b = aux;` (el `aux` es imprescindible para no perder el valor de `a`, igual que en el ejercicio 005). Prueba a simular N = 6 en papel.

</details>
