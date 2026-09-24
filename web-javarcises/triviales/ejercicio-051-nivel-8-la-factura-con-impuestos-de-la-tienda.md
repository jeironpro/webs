# Ejercicio 051 - La factura con impuestos de la tienda

**Nivel:** 8 - POO II
**Tema(s):** **interfaces** (`interface`/`implements`), contrato entre clases no relacionadas, polimorfismo a través de la referencia de la interfaz
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

La tienda vende dos cosas muy distintas: **productos** y **servicios técnicos**. No comparten herencia (un servicio no "es un" producto), pero ambos deben cotizar en una factura. Para unificarlos, el programa define un **contrato**: la interfaz `Facturable`, con un método `double precioFinal()`. Cada clase lo implementa a su manera:

- `Producto`: `precioFinal()` = precio × 1.19 (IVA 19%).
- `ServicioTecnico`: `precioFinal()` = valor × 1.05 (IVA 5%).

El programa lee `N` (mayor a 0) ítems: la letra `P` o `S`, y luego el subtítulo y el monto de cada uno. Los guarda en un arreglo **declarado como la interfaz** y suma los `precioFinal()`:

```
Total a cobrar: X.XX
```

## Instrucciones

- Define la interfaz:
  ```java
  interface Facturable {
      double precioFinal();
  }
  ```
- Crea dos clases **no relacionadas entre sí** que la implementen:
  - `class Producto implements Facturable` — atributo `double precio`; `@Override public double precioFinal()` devuelve `precio * 1.19`.
  - `class ServicioTecnico implements Facturable` — atributo `double valor`; `precioFinal()` devuelve `valor * 1.05`.
- **Importante:** los métodos de interfaz son `public` por definición; las implementaciones deben ser `public` y con la **misma firma**.
- `main` guarda todos los ítems en `Facturable[] carrito` y al final suma `carrito[i].precioFinal()`.
- **No uses `instanceof` ni `casting`**: el polimorfismo vía interfaz debe bastar.
- Montos y total con dos decimales.

## Firma sugerida

```java
import java.util.Scanner;

public class FacturaDeLaTienda {
    public static void main(String[] args) {
        // Tu código aquí
    }
}

interface Facturable {
    double precioFinal();
}

class Producto implements Facturable {
    private double precio;

    public Producto(double precio) { this.precio = precio; }

    @Override
    public double precioFinal() {
        return 0; // reemplaza
    }
}

class ServicioTecnico implements Facturable {
    private double valor;

    public ServicioTecnico(double valor) { this.valor = valor; }

    @Override
    public double precioFinal() {
        return 0; // reemplaza
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1 (mezclando letras):**
```
Entrada: 2
Entrada: P
Entrada: 10000
Entrada: S
Entrada: 40000
Salida: Total a cobrar: 53900.00
```

**Ejemplo 2 (un solo servicio):**
```
Entrada: 1
Entrada: S
Entrada: 200000
Salida: Total a cobrar: 210000.00
```

**Ejemplo 3 (todos productos):**
```
Entrada: 3
Entrada: P
Entrada: 5000
Entrada: P
Entrada: 15000
Entrada: P
Entrada: 3000
Salida: Total a cobrar: 27370.00
```

## Casos límite a considerar

- **Las interfaces no se instancian:** `new Facturable()` no compila; la interfaz solo se usa como **tipo de referencia** para guardar objetos de sus implementaciones.
- **Firma pública y exacta:** la implementación debe ser `public` y coincidir con `double precioFinal()`; un `private` o un tipo de retorno distinto no implementaría el contrato.
- **Implementar TODOS los métodos de la interfaz:** si `Producto` omitiese `precioFinal()`, no compilaría al ser declarada concreta.
- **Polimorfismo vía interfaz:** `Facturable[] carrito` puede contener productos y servicios; `carrito[i].precioFinal()` ejecuta la versión correcta sin saber el tipo real.
- **`instanceof` innecesario:** las tasas distintas (19% vs 5%) ya están resueltas dentro de cada clase; no "despaches" según el tipo en `main`.
- Montos `0` o negativos no producen errores (el cálculo sigue), aunque son datos irreales (anótalo como limitación).

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

La suma final es idéntica a la del ejercicio 050: `double total = 0; for (Facturable f : carrito) total += f.precioFinal();`. La diferencia es que aquí los objetos no tienen parientes: la interfaz es la única "promesa" común. Verifica el ejemplo 1: `10000 × 1.19 + 40000 × 1.05 = 11900 + 42000 = 53900`.

</details>
