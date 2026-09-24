# Ejercicio 050 - La nómina de la fábrica

**Nivel:** 8 - POO II
**Tema(s):** herencia (`extends`, `super`), clases abstractas y métodos abstractos, **sobrescritura** (`@Override`), polimorfismo con arreglo de la clase base
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

La fábrica paga a su personal de dos formas: los **fijos** reciben un **salario mensual**, y los **por horas** reciben **tarifa × horas trabajadas**. Ambos comparten el dato de su nombre, así que se modelan con una **clase base común** y dos **subclases** que calculan su pago distinto.

El programa lee `N` (mayor a 0) empleados y, por cada uno, la letra `F` (fijo) o `P` (por horas), el nombre y sus datos de pago. Guarda todos en un **arreglo de la clase base** (polimorfismo) y al final muestra la nómina total:

```
Nómina total: X.XX
```

## Instrucciones

- Crea la jerarquía:
  - `abstract class Empleado`: atributo `protected String nombre`; constructor `Empleado(String nombre)`; getter `getNombre()`; y **método abstracto** `abstract double calcularPago();`.
  - `class EmpleadoFijo extends Empleado`: añade `double salario`; constructor que llama **`super(nombre)`**; implementa `calcularPago()` devolviendo el salario.
  - `class EmpleadoPorHoras extends Empleado`: añade `double tarifa` y `double horas`; llama `super(nombre)`; `calcularPago()` devuelve `tarifa * horas`.
- En cada subclase marca el método con **`@Override`**.
- `main` lee la letra con `next()`, el nombre con `nextLine()` (limpia el `\n` previo), y crea el objeto correspondiente; guárdalo en `Empleado[] personal`.
- Al final recorre el arreglo sumando `personal[i].calcularPago()` y muestra el total (dos decimales).
- **No uses `instanceof`:** la jerarquía y el polimorfismo deben resolverlo por sí solos.
- Los totales y valores se muestran con dos decimales donde aplique.

## Firma sugerida

```java
import java.util.Scanner;

public class NominaDeLaFabrica {
    public static void main(String[] args) {
        // Tu código aquí
    }
}

abstract class Empleado {
    protected String nombre;

    public Empleado(String nombre) {
        this.nombre = nombre;
    }

    public String getNombre() { return nombre; }

    public abstract double calcularPago();
}

class EmpleadoFijo extends Empleado {
    private double salario;

    public EmpleadoFijo(String nombre, double salario) {
        super(nombre);
        this.salario = salario;
    }

    @Override
    public double calcularPago() {
        return 0; // reemplaza
    }
}

class EmpleadoPorHoras extends Empleado {
    private double tarifa;
    private double horas;

    public EmpleadoPorHoras(String nombre, double tarifa, double horas) {
        super(nombre);
        this.tarifa = tarifa;
        this.horas = horas;
    }

    @Override
    public double calcularPago() {
        return 0; // reemplaza
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1:**
```
Entrada: 2
Entrada: F
Entrada: Ana
Entrada: 1500000
Entrada: P
Entrada: Luis
Entrada: 12000
Entrada: 160
Salida: Nómina total: 3420000.00
```

**Ejemplo 2 (un solo empleado):**
```
Entrada: 1
Entrada: P
Entrada: Ro
Entrada: 8000
Entrada: 80
Salida: Nómina total: 640000.00
```

**Ejemplo 3 (todos fijos):**
```
Entrada: 3
Entrada: F
Entrada: Ema
Entrada: 2000000
Entrada: F
Entrada: Ivo
Entrada: 1800000
Entrada: F
Entrada: Sol
Entrada: 1500000
Salida: Nómina total: 5300000.00
```

## Casos límite a considerar

- **`super(nombre)` debe ir primero:** la primera línea de cada constructor de subclase debe llamar al constructor padre; cualquier instrucción antes no compila.
- **Implementar todos los métodos abstractos:** `Empleado` declara `calcularPago()` como abstracto; si una subclase no lo implementa, ella misma tendría que ser `abstract`.
- **La firma del `@Override` debe coincidir exactamente:** mismo nombre, mismos parámetros y mismo tipo de retorno (`double`). Un tipo distinto no sobrescribe, sobrecarga o no compila.
- **Polimorfismo:** `Empleado[] personal` puede contener objetos de ambas subclases; la llamada `personal[i].calcularPago()` ejecuta la versión correcta según el tipo real del objeto.
- **`instanceof` es señal de diseño pobre:** no debes preguntar "¿es fijo?" para decidir la suma; el método polimórfico ya lo resuelve.
- Horas o tarifa `0` dan pago `0`: la nómina permanece consistente.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

En `main`, para cada empleado: `char tipo = sc.next().charAt(0); sc.nextLine(); String nombre = sc.nextLine();` y luego, según el tipo, lee los datos restantes, crea la subclase concreta y la guardas como `Empleado`. Los métodos de pago son de una línea: `return salario;` y `return tarifa * horas;`. La suma final solo necesita `total += personal[i].calcularPago();` — el polimorfismo hace el resto.

</details>
