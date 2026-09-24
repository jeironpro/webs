# Ejercicio 062 - El catálogo ordenable del supermercado

**Nivel:** 11 - Avanzado I
**Tema(s):** **`Comparator`**, expresiones lambda, `Comparator.comparing` / `comparingDouble`, `.reversed()`, ordenación sin modificar la clase
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

El supermercado quiere imprimir su catálogo (nombre + precio) en **tres órdenes distintos**: alfabético por nombre, por precio de menor a mayor, y por precio de mayor a menor. Para no tocar la clase `Producto` (que en el ejercicio anterior usaba `Comparable`, y aquí no lo hace), los criterios de orden viven **por fuera**, como objetos `Comparator` construidos con **lambdas**.

El programa lee `N` (mayor a 0) y por cada producto nombre (puede tener espacios) y precio. Luego imprime el catálogo tres veces:

```
=== Por nombre ===
Nombre: X - Precio: Y.YY
...
=== Por precio (de menor a mayor) ===
...
=== Por precio (de mayor a menor) ===
...
```

## Instrucciones

- Crea `class Producto` **sin** `Comparable`: atributos privados, constructor y getters.
- En `main`, guarda los productos en `ArrayList<Producto>`.
- Para ordenar usa `lista.sort(comparador)` con comparadores lambda:
  - Por nombre: `Comparator.comparing(p -> p.getNombre())`.
  - Por precio ascendente: `Comparator.comparingDouble(p -> p.getPrecio())`.
  - Por precio descendente: al comparador de precio aplicarle **`.reversed()`**.
- **Cuidado con la mutación:** `sort` modifica la lista. Para poder imprimir los tres órdenes, crea una **copia** de la lista por cada criterio (`new ArrayList<>(original)`), o vuelve a ordenar con criterios distintos sobre una copia nueva.
- Precios con dos decimales en la salida.
- No modifiques la clase `Producto` para el orden: todo se resuelve desde fuera.

## Firma sugerida

```java
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Scanner;

public class CatalogoOrdenable {
    public static void main(String[] args) {
        // Tu código aquí
    }
}

class Producto {
    private String nombre;
    private double precio;

    public Producto(String nombre, double precio) {
        this.nombre = nombre;
        this.precio = precio;
    }

    public String getNombre() { return nombre; }
    public double getPrecio() { return precio; }
}
```

## Ejemplos de ejecución

**Ejemplo 1:**
```
Entrada: 3
Entrada: Manzana
Entrada: 1200
Entrada: Mango
Entrada: 2500
Entrada: Avellana
Entrada: 900
Salida: === Por nombre ===
        Nombre: Avellana - Precio: 900.00
        Nombre: Mango - Precio: 2500.00
        Nombre: Manzana - Precio: 1200.00
        === Por precio (de menor a mayor) ===
        Nombre: Avellana - Precio: 900.00
        Nombre: Manzana - Precio: 1200.00
        Nombre: Mango - Precio: 2500.00
        === Por precio (de mayor a menor) ===
        Nombre: Mango - Precio: 2500.00
        Nombre: Manzana - Precio: 1200.00
        Nombre: Avellana - Precio: 900.00
```

**Ejemplo 2 (un solo producto):**
```
Entrada: 1
Entrada: Pan
Entrada: 3500
Salida: === Por nombre ===
        Nombre: Pan - Precio: 3500.00
        === Por precio (de menor a mayor) ===
        Nombre: Pan - Precio: 3500.00
        === Por precio (de mayor a menor) ===
        Nombre: Pan - Precio: 3500.00
```

## Casos límite a considerar

- **La mutación de `sort`:** `ArrayList.sort` reordena **la misma lista**; si imprimes el "por nombre" y luego el "por precio" sobre la misma, el primer orden ya no estará disponible. Copia antes (`new ArrayList<>(original)`) por cada criterio.
- **Lambda sobre getters:** en `Comparator.comparing(p -> p.getNombre())`, `p` es un `Producto`; `Producto` debe exponer getters (sin ellos no hay nada que comparar desde fuera).
- **`comparingDouble` para primitivos:** con `double` evita un autoboxing innecesario frente a `comparing(Double)`.
- **`.reversed()` no da vuelta la lista:** devuelve un comparador nuevo con el orden inverso; es un detalle de API, no una operación sobre la colección.
- Empates en alguno de los campos: el orden entre iguales queda "estable" (como vinieron); si quisieras desempate por el otro campo, se compondrían comparadores (anótalo como siguiente nivel).
- Precio 0 o negativo: el orden funciona igual (datos irreales, anótalo).

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

```
ArrayList<Producto> porNombre = new ArrayList<>(porNombre);
porNombre.sort(Comparator.comparing(p -> p.getNombre()));
ArrayList<Producto> asc = new ArrayList<>(original);
asc.sort(Comparator.comparingDouble(p -> p.getPrecio()));
ArrayList<Producto> desc = new ArrayList<>(original);
desc.sort(Comparator.comparingDouble(p -> p.getPrecio()).reversed());
```
Fíjate en los paréntesis de `.reversed()`, que se aplican sobre el comparador completo.

</details>
