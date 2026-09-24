# Ejercicio 046 - El registro de la juguetería

**Nivel:** 7 - POO I
**Tema(s):** clases, objetos, atributos privados, constructor, encapsulamiento, getters, métodos
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

La juguetería necesita registrar sus productos con un programa orientado a objetos. Cada **Producto** tiene un **nombre** (texto) y un **precio** (decimal) que no deben modificarse desde fuera de la clase: el acceso se hace por métodos (encapsulamiento). Además, al vender se aplica un **IVA del 19%**, calculado por un método de la propia clase.

El programa lee `N` (mayor a 0), y por cada producto el **nombre** (puede tener espacios) y el **precio**. Al final muestra cada producto con su precio y su precio con IVA, y el **total con IVA** de toda la compra:

```
Producto: X - Precio: Y.YY - Con IVA: Z.ZZ
...
Total con IVA: T.TT
```

## Instrucciones

- Crea una clase **`Producto`** (en su propio bloque, puede ir en el mismo archivo) con:
  - Atributos **privados** `String nombre` y `double precio`.
  - Un **constructor** `Producto(String nombre, double precio)` que asigne ambos (cuidado con el parámetro del mismo nombre que el atributo: usa `this`).
  - Getters `getNombre()` y `getPrecio()`.
  - Un método `double precioConIva()` que devuelve `precio * 1.19`.
- **No** accedas a los atributos desde `main` directamente (deben ser privados).
- `main` lee los datos, crea un objeto por producto, y usa solo métodos públicos.
- Recuerda consumir el salto de línea tras leer un entero (`nextInt()`) antes de usar `nextLine()` para los nombres (ejercicio 006).
- Precios y totales se muestran con dos decimales.

## Firma sugerida

```java
import java.util.Scanner;

public class RegistroDeLaJugueteria {

    public static void main(String[] args) {
        // Tu código aquí
    }
}

class Producto {
    private String nombre;
    private double precio;

    public Producto(String nombre, double precio) {
        // Tu código aquí
    }

    public String getNombre() {
        return nombre;
    }

    public double getPrecio() {
        return precio;
    }

    public double precioConIva() {
        return 0; // reemplaza
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1:**
```
Entrada: 2
Entrada: Pelota
Entrada: 25000.50
Entrada: Muñeca
Entrada: 15000.00
Salida: Producto: Pelota - Precio: 25000.50 - Con IVA: 29750.59
        Producto: Muñeca - Precio: 15000.00 - Con IVA: 17850.00
        Total con IVA: 47600.60
```

**Ejemplo 2 (un solo producto):**
```
Entrada: 1
Entrada: Ajedrez de viaje
Entrada: 0
Salida: Producto: Ajedrez de viaje - Precio: 0.00 - Con IVA: 0.00
        Total con IVA: 0.00
```

**Ejemplo 3 (nombre con espacios):**
```
Entrada: 1
Entrada: Caja de bloques grande
Entrada: 30000
Salida: Producto: Caja de bloques grande - Precio: 30000.00 - Con IVA: 35700.00
        Total con IVA: 35700.00
```

## Casos límite a considerar

- **`this`:** en el constructor, `this.nombre = nombre;` distingue el atributo del parámetro. Sin `this`, asignas el parámetro sobre sí mismo y el atributo queda sin valor.
- **Encapsulamiento:** los atributos son `private`; si en `main` escribes `producto.nombre`, no compila. Todo el acceso pasa por los getters y métodos.
- **La lectura mixta:** tras `sc.nextInt()` para `N`, un `sc.nextLine()` "continúa"... para el nombre hay que absorber el `\n` que dejó pendiente (ejercicio 006). El precio se lee con `nextDouble()`.
- **Redondeo a dos decimales:** usa `String.format("%.2f", valor)` en la salida.
- Precio `0`: el producto vale 0 y el IVA es 0.00; el total se mantiene consistente.
- El total con IVA acumula `producto.precioConIva()` de **cada** objeto.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

En `main`: lee `N` con `nextInt()`, haz un `sc.nextLine();` para limpiar el salto de línea, y en cada producto `String n = sc.nextLine(); double p = sc.nextDouble(); sc.nextLine();`. En el constructor recuerda `this.nombre = nombre;` — es la primera vez que ves atributos copiar los parámetros.

</details>
