# Ejercicio 043 - El revelado del rollo de fotografías

**Nivel:** 6 - Intermedio III
**Tema(s):** métodos `void` con efecto sobre un arreglo, paso de arreglos por referencia, inversión en el lugar
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

El laboratorio fotográfico recibe un rollo: las fotos están encargadas en el orden en que se tomaron, pero para imprimir se procesan de la más reciente a la más antigua. El revelador llama a una función que **invierte el órdigo dentro del propio arreglo** (en el lugar), y el programa principal imprime el resultado.

`main` lee `N` (mayor a 0) tamaños de foto (enteros), llama a un método `static void invertir(int[] fotos)` que deja el arreglo invertido **dentro de la misma variable**, y luego `main` imprime el arreglo final.

## Instrucciones

- Define `static void invertir(int[] fotos)`:
  - **No devuelve nada** (`void`).
  - Intercambia parejas simétricas usando una variable temporal, recorriendo solo hasta la mitad (`fotos.length / 2`).
- **Importante (el reto de Java):** el método **no debe** intentar "poner un arreglo nuevo" en el parámetro (ej. `fotos = otroArreglo;`), porque reasignar el parámetro **no afecta al arreglo del llamador**. Los cambios deben hacerse **elemento a elemento** (`fotos[i] = ...`), que sí son visibles fuera.
- `main` imprime el arreglo invertido en una sola línea, valores separados por espacios.
- No uses colecciones, `System.arraycopy` ni métodos de librerías.

## Firma sugerida

```java
import java.util.Scanner;

public class ReveladoDelRollo {
    public static void main(String[] args) {
        // Tu código aquí
    }

    static void invertir(int[] fotos) {
        // Tu código aquí
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1:**
```
Entrada: 5
Entrada: 1
Entrada: 2
Entrada: 3
Entrada: 4
Entrada: 5
Salida: 5 4 3 2 1
```

**Ejemplo 2 (cantidad par):**
```
Entrada: 4
Entrada: 8
Entrada: 9
Entrada: 10
Entrada: 11
Salida: 11 10 9 8
```

**Ejemplo 3 (un solo valor):**
```
Entrada: 1
Entrada: 7
Salida: 7
```

## Casos límite a considerar

- **La reasignación no funciona:** `fotos = unArregloInvertido;` dentro del método solo cambia la copia local de la referencia; `main` seguiría viendo el arreglo original. La única forma visible es mutar los **elementos** (`fotos[0]`, `fotos[1]`, …).
- **La doble inversión:** recorrer hasta `fotos.length` (en vez de `length / 2`) intercambia cada pareja dos veces y deja el arreglo como estaba (lección del ejercicio 027).
- **La temporal:** sin ella, `fotos[i] = fotos[j]; fotos[j] = fotos[i];` pierde el valor original.
- `N = 1`: el bucle `for (i = 0; i < 1 / 2; i++)` no se ejecuta y el arreglo queda igual.
- Imprimir **después** de llamar al método (no dentro): `main` es quien muestra el resultado.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

`for (int i = 0; i < fotos.length / 2; i++) { int temp = fotos[i]; fotos[i] = fotos[fotos.length - 1 - i]; fotos[fotos.length - 1 - i] = temp; }`. Es el mismo algoritmo del ejercicio 027, pero ahora dentro de un método `void`. En `main`, después de llamar a `invertir(...)`, imprime el arreglo del `0` al `fotos.length` normalmente: ya quedó invertido.

</details>
