# Ejercicio 040 - El centro de cálculos de la contaduría

**Nivel:** 6 - Intermedio III
**Tema(s):** métodos (`static`, parámetros, valor de retorno), descomposición de problemas, arreglos como parámetros
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

La contaduría central procesa varias tablas de ventas diarias y, para cada tabla, la gerencia pide el **promedio**, el **máximo** y el **mínimo**. Para mantener el código ordenado y reutilizable, cada cálculo debe vivir en un **método propio** que reciba el arreglo de datos y **devuelva** el resultado: el método `main` solo lee la entrada, llama a los métodos e imprime.

El programa lee `N` (mayor a 0) y las `N` ventas, y muestra:

```
Promedio: P.PP
Máximo: M
Mínimo: m
```

## Instrucciones

- Define **tres métodos** `static` con una única responsabilidad cada uno:
  - `static double promedio(int[] ventas)`
  - `static int maximo(int[] ventas)`
  - `static int minimo(int[] ventas)`
- Los métodos **reciben el arreglo como parámetro** y **devuelven** el resultado con `return` (no imprimen dentro: la impresión queda en `main`).
- `main` solo lee `N`, llena el arreglo, llama a los tres métodos y muestra las tres líneas.
- No uses colecciones ni librerías de estadísticas.
- El promedio se muestra con dos decimales (`String.format("%.2f", ...)`).
- Aún no uses sobrecarga de métodos (es el siguiente tema).

## Firma sugerida

```java
import java.util.Scanner;

public class CentroDeCalculos {
    public static void main(String[] args) {
        // Tu código aquí
    }

    static double promedio(int[] ventas) {
        return 0; // reemplaza
    }

    static int maximo(int[] ventas) {
        return 0; // reemplaza
    }

    static int minimo(int[] ventas) {
        return 0; // reemplaza
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1:**
```
Entrada: 5
Entrada: 10
Entrada: 20
Entrada: 30
Entrada: 40
Entrada: 50
Salida: Promedio: 30.00
        Máximo: 50
        Mínimo: 10
```

**Ejemplo 2 (incluye negativas):**
```
Entrada: 3
Entrada: -5
Entrada: 0
Entrada: 12
Salida: Promedio: 2.33
        Máximo: 12
        Mínimo: -5
```

**Ejemplo 3 (un solo valor):**
```
Entrada: 1
Entrada: 77
Salida: Promedio: 77.00
        Máximo: 77
        Mínimo: 77
```

## Casos límite a considerar

- **`static` en cada método:** sin él, no puedes llamarlos desde `main` (que es `static`).
- **Devolver con `return`** en todos los caminos: si un método no termina en `return` (o el compilador no puede probarlo), Java marca error.
- **La semilla del máximo/mínimo:** en `maximo` y `minimo` inicializa con el primer valor del arreglo (no con `0`), o no funcionará con negativos (lección del ejercicio 022, ahora dentro de un método).
- En `promedio`, la división `suma / ventas.length` con enteros pierde decimales: usa `(double)` en un operando (lección del ejercicio 014).
- `N = 1`: máximo, mínimo y promedio coinciden con el único valor.
- Los métodos no deben consultar un `Scanner`: solo reciben y calculan (separación de responsabilidades).

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

Dentro de `promedio` suma en un `for` y devuelve `(double) suma / ventas.length`. En `maximo` haz `int max = ventas[0]; for (int i = 1; i < ventas.length; i++) if (ventas[i] > max) max = ventas[i]; return max;` (y el análogo para mínimo). Reutiliza los patrones de los ejercicios 014 y 022 dentro de los métodos.

</details>
