# Ejercicio 027 - El informe invertido de los sensores

**Nivel:** 4 - Intermedio I
**Tema(s):** arrays, intercambio de elementos en un solo array (en el lugar), índice simétrico, doble recorrido
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

Una estación meteorológica guarda en un array las temperaturas horarias **en orden cronológico** (las 00:00 primero, la última hora al final). Para el reporte impreso quieren mostrar la **misma información en orden inverso** (la hora más reciente primero), pero el software operativo exige que el propio array quede modificado: no pueden usar un segundo array ni solo imprimir al revés; los datos deben quedar **invertidos físicamente** en el array.

El programa lee `N` (mayor a 0) temperaturas y las invierte en el lugar, para luego imprimir el array resultante separado por espacios.

## Instrucciones

- Usa la clase `Scanner`.
- Guarda las `N` temperaturas en `int[] horas`.
- **Invierte el array en el lugar**: intercambia el elemento `[0]` con el último, `[1]` con el penúltimo, etc., usando **una variable temporal** para el intercambio.
- El bucle de intercambio debe recorrer solo hasta la **mitad** del array.
- Después de invertir, imprime todos los elementos separados por un espacio en una sola línea.
- No uses un segundo array ni `Arrays.toString` ni colecciones.
- Considera que `N` es mayor a 0 (la validación de entrada es tema de niveles posteriores).

## Firma sugerida

```java
import java.util.Scanner;

public class InformeInvertido {
    public static void main(String[] args) {
        // Tu código aquí
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1:**
```
Entrada: 4
Entrada: 12
Entrada: 15
Entrada: 14
Entrada: 18
Salida: 18 14 15 12
```

**Ejemplo 2 (cantidad impar):**
```
Entrada: 5
Entrada: 1
Entrada: 2
Entrada: 3
Entrada: 4
Entrada: 5
Salida: 5 4 3 2 1
```

**Ejemplo 3 (caso borde, un solo valor):**
```
Entrada: 1
Entrada: 7
Salida: 7
```

## Casos límite a considerar

- **La doble inversión:** si el bucle recorre de `0` a `N` completo, cada pareja se intercambia **dos veces** y el array vuelve a quedar como estaba (los mismos valores de entrada otra vez). El bucle debe llegar solo a `N / 2`.
- **El índice simétrico:** el par de `i` es `a.length - 1 - i`. Olvidar el `- 1` accede fuera de rango.
- **La cuestión de la temporal:** intercambiar `a[i] = a[j]; a[j] = a[i];` sin temporal pierde el valor original (retoma la lección del ejercicio 005).
- Cantidad impar: el elemento central no se intercambia con nadie y queda en su sitio (eso está bien).
- `N = 1`: el bucle `for (i = 0; i < 1 / 2; i++)` no se ejecuta y la salida es el único valor.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

`for (int i = 0; i < horas.length / 2; i++) { int temp = horas[i]; horas[i] = horas[horas.length - 1 - i]; horas[horas.length - 1 - i] = temp; }`. Prueba simular con el array `[1, 2, 3, 4, 5]` en papel: los pasos generan `[5, 2, 3, 4, 1]` → `[5, 4, 3, 2, 1]`.

</details>
