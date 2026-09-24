# Ejercicio 044 - El duplicador de inventario del sótano

**Nivel:** 6 - Intermedio III
**Tema(s):** métodos que **devuelven un arreglo**, creación de arreglos dentro de métodos, no mutar el parámetro de entrada
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

El sótano guarda un registro de inventario (`N` conteos de cajas, un entero por caja) en un arreglo. La gerencia necesita una **segunda tabla** con cada conteo **duplicado** para la auditoría, pero **sin tocar el registro original** (el archivo original se conserva intacto para el balance).

El programa lee `N` (mayor a 0) y los `N` conteos, llama a un método que **construye y devuelve** un arreglo nuevo con cada valor × 2, y muestra ambas tablas:

```
Original: 3 5 2
Doblada:  6 10 4
```

## Instrucciones

- Define `static int[] duplicar(int[] cajas)`:
  - Crea un **arreglo nuevo** del mismo tamaño dentro del método (`new int[cajas.length]`).
  - Lo llena con `cajas[i] * 2` y **lo devuelve con `return`**.
  - **No modifica el arreglo original** (a diferencia de un método `void` que muta en el lugar, este entrega una copia).
- `main` llama al método y luego imprime las dos líneas (`Original: ...` y `Doblada: ...`), valores separados por espacios.
- No uses `Arrays.copyOf` ni colecciones: se copia con un `for`.
- Considera que `N` es mayor a 0 (la validación es tema de niveles posteriores).

## Firma sugerida

```java
import java.util.Scanner;

public class DuplicadorDeInventario {
    public static void main(String[] args) {
        // Tu código aquí
    }

    static int[] duplicar(int[] cajas) {
        return new int[0]; // reemplaza
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1:**
```
Entrada: 4
Entrada: 3
Entrada: 5
Entrada: 2
Entrada: 0
Salida: Original: 3 5 2 0
        Doblada: 6 10 4 0
```

**Ejemplo 2 (valores simples):**
```
Entrada: 3
Entrada: 1
Entrada: 2
Entrada: 7
Salida: Original: 1 2 7
        Doblada: 2 4 14
```

**Ejemplo 3 (un solo valor):**
```
Entrada: 1
Entrada: 9
Salida: Original: 9
        Doblada: 18
```

## Casos límite a considerar

- **El arreglo nuevo:** el método debe hacer `new int[cajas.length]` (mismo tamaño) y copiar con un `for`. Si reutilizas el mismo arreglo (`cajas[i] *= 2`), estarías mutando la tabla original y la salida "Original" ya no coincidiría.
- **Devolver con `return`:** sin el return al final, el compilador marca que el método no devuelve la referencia prometida.
- **El tamaño se usa dos veces:** al crear el arreglo (para reservar espacio) y al copiar (como límite del `for`).
- Multiplicar por 2 puede desbordar con valores grandes cercanos al límite de `int`: anótalo como limitación.
- `N = 1`: una sola caja; ambas líneas tienen un único valor.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

`int[] resultado = new int[cajas.length]; for (int i = 0; i < cajas.length; i++) resultado[i] = cajas[i] * 2; return resultado;`. La clave frente al ejercicio 043: aquí generas una **copia** (con `new`) y la devuelves, en vez de modificar los elementos del parámetro.

</details>
