# Ejercicio 038 - El mejor mes del depósito

**Nivel:** 5 - Intermedio II
**Tema(s):** arrays bidimensionales, recorrido por **columnas**, acumuladores por grupo, búsqueda del máximo entre totales
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

El depósito lleva una tabla de **`F` productos** (filas) × **`C` meses** (columnas), con las ventas de cada producto en cada mes. La gerencia quiere saber cuál es el **mes con mayor venta total** (sumando todos los productos ese mes).

El programa lee `F` y `C` (mayores a 0), llena la tabla fila por fila y muestra:

```
Mayor mes: M con ventas totales de Y
```

Las columnas se numeran desde 1. Si dos meses empatan, gana el **primer mes** que alcanzó el máximo.

## Instrucciones

- Usa la clase `Scanner`.
- Lee `F` y `C`, y guarda en `int[][] ventas`.
- Para calcular el total de un mes, debes recorrer la **columna** correspondiente (sumar `ventas[i][mes]` sobre todas las filas `i`).
- Usa un bucle exterior sobre las `C` columnas y un bucle interior sobre las `F` filas.
- Reinicia el acumulador en **cada** columna y compara contra el mejor mes visto (usa `>` estricto, para que en empate gane el primero).
- No uses colecciones ni métodos de librerías.
- La salida es exactamente una línea con el formato indicado.

## Firma sugerida

```java
import java.util.Scanner;

public class MejorMesDelDeposito {
    public static void main(String[] args) {
        // Tu código aquí
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1:**
```
Entrada: 2
Entrada: 3
Entrada: 100
Entrada: 50
Entrada: 200
Entrada: 30
Entrada: 90
Entrada: 0
Salida: Mayor mes: 3 con ventas totales de 200
```

**Ejemplo 2 (empate entre meses):**
```
Entrada: 2
Entrada: 2
Entrada: 5
Entrada: 5
Entrada: 7
Entrada: 7
Salida: Mayor mes: 1 con ventas totales de 12
```

**Ejemplo 3 (un solo mes):**
```
Entrada: 3
Entrada: 1
Entrada: 4
Entrada: 9
Entrada: 2
Salida: Mayor mes: 1 con ventas totales de 15
```

## Casos límite a considerar

- **Recorrido por columnas:** para el mes `m` (columna) sumas `ventas[0][m] + ventas[1][m] + ...`. Si lo recorres por filas (`ventas[fila][columna]` de la fila completa), mezclas meses y el total sale mal.
- **El acumulador por columna:** debe **reiniciarse a 0** al empezar cada columna; si lo acumulas a lo largo de todo el recorrido, cada total arrastra el anterior.
- **Empates:** dos meses con el mismo total ganan el primero; usa `>` estricto al comparar con el mejor.
- **Índices a base 1:** al imprimir, `mes + 1`.
- `C = 1`: solo hay un mes; `F = 1`: cada columna tiene un solo valor, y el mejor mes es el de la celda más alta.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

`int mejor = -1; int mesMejor = -1; for (int j = 0; j < C; j++) { int total = 0; for (int i = 0; i < F; i++) total += ventas[i][j]; if (total > mejor) { mejor = total; mesMejor = j; } }` y luego imprime `mesMejor + 1` y `mejor`.

</details>
