# Ejercicio 049 - El peaje del parqueadero

**Nivel:** 7 - POO I
**Tema(s):** atributos y métodos **`static`**, contador de instancias creadas, miembro compartido entre todos los objetos, lectura con centinela
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

Cada auto que entra al parqueadero se modela como un objeto `Vehiculo`. El sistema debe **contar cuántos vehículos ingresaron** en total, y ese contador no pertenece a un auto en particular: es un dato **compartido por todos los objetos de la clase** (un atributo `static` que crece en cada constructor ejecutado).

Además, a cada auto se le asigna un **número correlativo** de ingreso (1, 2, 3…) según el orden en que entró.

El programa lee **placas** una por una hasta que llega la palabra `FIN` (ningún auto se llama FIN). Por cada placa:

```
Vehiculo #k: PLACA
```

Y al terminar:

```
Total de vehículos: X
```

## Instrucciones

- Crea la clase **`Vehiculo`** con:
  - Atributos privados `String placa` e `int numero` (el correlativo de este objeto).
  - Un atributo **`private static int totalVehiculos`** compartido.
  - Constructor `Vehiculo(String placa)` que: guarda la placa, **incrementa** `totalVehiculos` y asigna a `numero` el valor recién incrementado (así el primer auto es `1`, el segundo `2`, …).
  - Getters `getPlaca()`, `getNumero()`.
  - Un método **`static int totalIngresados()`** que devuelve el valor compartido.
- `main` lee con `nextLine()` hasta el centinela `FIN` (sin procesar el FIN como placa), crea un objeto por placa y, al salir, imprime con `Vehiculo.totalIngresados()`.
- Referénciate al estático con el **nombre de la clase** (`Vehiculo.totalIngresados()`), no con una instancia.
- Considera que las placas no llegan vacías y que `FIN` es la única palabra de corte.

## Firma sugerida

```java
import java.util.Scanner;

public class PeajeDelParqueadero {
    public static void main(String[] args) {
        // Tu código aquí
    }
}

class Vehiculo {
    private String placa;
    private int numero;
    private static int totalVehiculos = 0;

    public Vehiculo(String placa) {
        // Tu código aquí
    }

    public String getPlaca() { return placa; }
    public int getNumero() { return numero; }

    public static int totalIngresados() {
        return 0; // reemplaza
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1:**
```
Entrada: ABC123
Entrada: DEF456
Entrada: FIN
Salida: Vehiculo #1: ABC123
        Vehiculo #2: DEF456
        Total de vehículos: 2
```

**Ejemplo 2 (tres vehículos):**
```
Entrada: X
Entrada: Y
Entrada: Z
Entrada: FIN
Salida: Vehiculo #1: X
        Vehiculo #2: Y
        Vehiculo #3: Z
        Total de vehículos: 3
```

**Ejemplo 3 (caso borde, ninguno):**
```
Entrada: FIN
Salida: Total de vehículos: 0
```

## Casos límite a considerar

- **El contador es compartido:** `totalVehiculos` es **uno solo para la clase**, no uno por objeto. Cada constructor lo incrementa, así que al final refleja cuántos vehículos se crearon en toda la ejecución.
- **No incrementarlo desde `main`:** el conteo debe vivir **dentro del constructor** (es la única forma garantizada de no olvidar un ingreso).
- **Acceso al estático:** usa `Vehiculo.totalIngresados()`; aunque `objeto.totalIngresados()` también compila, la convención es por la clase.
- **El centinela no es un vehículo:** `FIN` debe cortar el bucle antes de crear el objeto; si no, terminaría contado dentro del total.
- **Orden de asignación:** `numero = ++totalVehiculos` asigna el valor ya crecido; `numero = totalVehiculos++` asignaría `0` al primero y luego crecería el contador (error clásico de pre/post-incremento).
- Sin ningún vehículo (primera lectura `FIN`): total 0, y el bucle no imprime ninguna línea de vehículos.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

En el constructor: `this.placa = placa; totalVehiculos++; numero = totalVehiculos;`. En `main`: `while (true) { String p = sc.nextLine(); if (p.equals("FIN")) break; Vehiculo v = new Vehiculo(p); System.out.println("Vehiculo #" + v.getNumero() + ": " + v.getPlaca()); }` y al final `System.out.println("Total de vehículos: " + Vehiculo.totalIngresados());`. Simula mentalmente el ejemplo 2 y observa qué valor toma `totalVehiculos` tras cada `new`.

</details>
