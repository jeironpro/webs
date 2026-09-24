# Ejercicio 034 - El mapa de calor de la tienda

**Nivel:** 5 - Intermedio II
**Tema(s):** arrays bidimensionales, recorrido completo, búsqueda del máximo con posición (fila y columna), semilla con el primer valor
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

Una cadena de tiendas registra, por cada **almacén** (filas) y por cada **mes** (columnas), las ventas de una línea de productos (los valores pueden ser negativos si hubo devoluciones). El gerente quiere saber la **mejor celda**: el máxima venta de la tabla y en qué almacén y mes ocurrió.

El programa lee el número de almacenes `F` y de meses `C` (ambos mayores a 0), luego llena la tabla `F x C` fila por fila, y muestra:

```
Máximo: X en almacén A, mes M
```

Las posiciones se cuentan desde 1. Si hay empate, gana la **primera celda** que alcanzó el valor (recorriendo por filas).

## Instrucciones

- Usa la clase `Scanner`.
- Lee `F` y `C`, y guarda la tabla en `int[][] ventas`.
- Recorre la tabla con **bucles anidados** (exterior: filas; interior: columnas).
- Inicializa el máximo con la **primera celda de la tabla** (`ventas[0][0]`) y actualiza solo con `>` estricto (para que en empate gane la primera).
- Guarda también la **fila y la columna** del máximo (posiciones en base 1 al imprimir).
- No uses colecciones ni métodos de librerías.
- La salida es exactamente una línea con el formato indicado.

## Firma sugerida

```java
import java.util.Scanner;

public class MapaDeCalor {
    public static void main(String[] args) {
        // Tu código aquí
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1 (con empates):**
```
Entrada: 2
Entrada: 3
Entrada: 100
Entrada: 50
Entrada: 200
Entrada: 200
Entrada: 0
Entrada: -10
Salida: Máximo: 200 en almacén 1, mes 3
```

**Ejemplo 2 (todo negativo — la trampa de la semilla):**
```
Entrada: 2
Entrada: 2
Entrada: -5
Entrada: -8
Entrada: -2
Entrada: -7
Salida: Máximo: -2 en almacén 2, mes 1
```

**Ejemplo 3 (caso borde, una sola celda):**
```
Entrada: 1
Entrada: 1
Entrada: 42
Salida: Máximo: 42 en almacén 1, mes 1
```

## Casos límite a considerar

- **Semilla con `0`:** si todas las ventas son negativas (mes de devoluciones masivas), `max = 0` nunca se supera y el reporte da 0 en un almacén inexistente. La semilla debe ser `ventas[0][0]`.
- **Empates:** con dos celdas de 200, gana la del almacén 1 (la primera en el recorrido por filas). No uses `>=` al actualizar.
- **Índices a base 1:** las posiciones se imprimen con `+ 1`.
- **Llenado por filas:** el bucle exterior es el de almacenes (`F`) y el interior el de meses (`C`); invertirlo desordena la lectura de entrada.
- `F = 1` o `C = 1`: el recorrido sigue funcionando igual.
- Recordar que en empate la celda siguiente al máximo actual, si es igual, **no** debe ganar.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

`int max = ventas[0][0]; int filaMax = 0; int colMax = 0; for (int i = 0; i < F; i++) for (int j = 0; j < C; j++) if (ventas[i][j] > max) { max = ventas[i][j]; filaMax = i; colMax = j; }` y al final imprime `filaMax + 1`, `colMax + 1`. Recuerda leer y guardar toda la tabla antes de buscar.

</details>
