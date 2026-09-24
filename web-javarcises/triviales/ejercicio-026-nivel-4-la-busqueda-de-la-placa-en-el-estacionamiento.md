# Ejercicio 026 - La búsqueda de la placa en el estacionamiento

**Nivel:** 4 - Intermedio I
**Tema(s):** arrays, búsqueda lineal, conteo de ocurrencias, marcador "no encontrado" (`-1`), entrada por consola
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

El estacionamiento del centro cívico registra, en orden de entrada, el número de placa de cada vehículo (un entero por vehículo). Cuando un guardia quiere localizar un auto, teclea el número de placa y el sistema responde **cuántas veces** aparece esa placa en el registro y **en qué posición** entró la primera vez.

El programa lee primero cuántos registros hay (`N`, mayor a 0), luego los `N` números de placa del día, y por último la **placa buscada**. Muestra:

```
Ocurrencias: C
```
Y, si `C` es mayor a 0, además:
```
Primera vez en la posición: K
```

Las posiciones se cuentan desde 1 (el primer registro es la posición 1). Una misma placa puede aparecer varias veces (el mismo auto entra varias veces al día).

## Instrucciones

- Usa la clase `Scanner`.
- Guarda los `N` registros en un array `int[] placas`.
- Lee la **placa buscada después** de llenar el array.
- Recorre el array **una sola vez**: cuenta todas las coincidencias y recuerda la **primera** posición en la que apareció.
- Para representar "aún no encontrado" usa el marcador `-1` en una variable (la posición nunca es 0 en la convención de este problema).
- No uses colecciones ni métodos de búsqueda de librerías.
- Si `C == 0`, solo imprime la línea de ocurrencias (sin la de posición).

## Firma sugerida

```java
import java.util.Scanner;

public class BusquedaDePlaca {
    public static void main(String[] args) {
        // Tu código aquí
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1 (sin coincidencias):**
```
Entrada: 4
Entrada: 4512
Entrada: 7889
Entrada: 1234
Entrada: 9001
Entrada: 5555
Salida: Ocurrencias: 0
```

**Ejemplo 2 (placa repetida):**
```
Entrada: 5
Entrada: 4512
Entrada: 7889
Entrada: 4512
Entrada: 9001
Entrada: 4512
Entrada: 4512
Salida: Ocurrencias: 3
        Primera vez en la posición: 1
```

**Ejemplo 3 (un solo registro):**
```
Entrada: 1
Entrada: 1234
Entrada: 1234
Salida: Ocurrencias: 1
        Primera vez en la posición: 1
```

## Casos límite a considerar

- **El marcador `-1`:** inicializa la primera posición en `-1` y actualízala solo cuando el contador pase de `0` a `1`. Imprimir un `-1` en el aviso de "no encontrado" es un error clásico.
- **Orden de lectura:** la placa buscada se lee **al final**; si se lee antes de llenar el array, los valores de entrada se desordenan.
- **Repetidos:** la primera coincidencia no debe sobrescribirse con las siguientes (usa un `if` que solo actualice cuando todavía valga `-1`).
- `N = 1` con o sin coincidencia.
- La condición para imprimir la segunda línea es `C > 0`, no "posición != -1" (ambas deberían equivaler, pero guárdate de la inconsistencia).

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

En una sola pasada: `int ocurrencias = 0; int primera = -1; for (int i = 0; i < placas.length; i++) { if (placas[i] == buscada) { ocurrencias++; if (primera == -1) primera = i + 1; } }`. Al final, `if (ocurrencias > 0)` imprime la posición.

</details>
