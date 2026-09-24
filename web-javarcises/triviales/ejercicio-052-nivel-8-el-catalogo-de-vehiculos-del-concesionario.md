# Ejercicio 052 - El catálogo de vehículos del concesionario

**Nivel:** 8 - POO II
**Tema(s):** herencia y sobrescritura que **reutiliza la versión del padre** (`super.verbo()`), cadenas de constructores, polimorfismo
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

El concesionario arma su catálogo a partir de una jerarquía: todos los vehículos tienen una **marca** (clase base), y cada tipo agrega sus datos y extiende la descripción. Lo interesante es que cada subclase, al sobrescribir el método de descripción, **aprovecha la versión del padre** con `super.descripcion()` y le agrega su parte, en vez de reescribir todo.

El programa lee `N` (mayor a 0) vehículos: la letra `A` (auto) o `M` (moto), la **marca** y su dato extra (puertas o cilindrada). Guarda todos en `Vehiculo[]` y muestra el catálogo de cada uno:

```
Auto marca MARCA - 4 puertas
Moto marca MARCA - 250 cc
```

## Instrucciones

- Crea la jerarquía:
  - `class Vehiculo`: atributo `protected String marca`; constructor `Vehiculo(String marca)`; método `String descripcion()` que devuelve `"Vehículo marca " + marca`.
  - `class Auto extends Vehiculo`: añade `int puertas`; constructor llama `super(marca)` y asigna las puertas; **sobrescribe** `descripcion()` como `super.descripcion() + " - Auto de " + puertas + " puertas"`.
  - `class Moto extends Vehiculo`: añade `int cilindrada`; `super(marca)`; `descripcion()` = `super.descripcion() + " - Moto de " + cilindrada + " cc"`.
- Marca cada sobrescritura con **`@Override`**.
- `main` guarda los objetos en un arreglo de tipo `Vehiculo` y los imprime con `System.out.println(v.descripcion())` (una línea por vehículo).
- Sigue la lectura: letra con `next()`, marca con `nextLine()` después de limpiar el salto de línea.

## Firma sugerida

```java
import java.util.Scanner;

public class CatalogoVehiculos {
    public static void main(String[] args) {
        // Tu código aquí
    }
}

class Vehiculo {
    protected String marca;

    public Vehiculo(String marca) {
        this.marca = marca;
    }

    public String descripcion() {
        return "Vehículo marca " + marca;
    }
}

class Auto extends Vehiculo {
    private int puertas;

    public Auto(String marca, int puertas) {
        super(marca);
        this.puertas = puertas;
    }

    @Override
    public String descripcion() {
        return super.descripcion() + " - Auto de " + puertas + " puertas";
    }
}

class Moto extends Vehiculo {
    private int cilindrada;

    public Moto(String marca, int cilindrada) {
        super(marca);
        this.cilindrada = cilindrada;
    }

    @Override
    public String descripcion() {
        return super.descripcion() + " - Moto de " + cilindrada + " cc";
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1:**
```
Entrada: 2
Entrada: A
Entrada: Toyota
Entrada: 4
Entrada: M
Entrada: Yamaha
Entrada: 250
Salida: Vehículo marca Toyota - Auto de 4 puertas
        Vehículo marca Yamaha - Moto de 250 cc
```

**Ejemplo 2 (un vehículo):**
```
Entrada: 1
Entrada: A
Entrada: Ford
Entrada: 2
Salida: Vehículo marca Ford - Auto de 2 puertas
```

**Ejemplo 3 (motores de mayor cilindrada):**
```
Entrada: 2
Entrada: M
Entrada: Kawasaki
Entrada: 1000
Entrada: M
Entrada: Honda
Entrada: 125
Salida: Vehículo marca Kawasaki - Moto de 1000 cc
        Vehículo marca Honda - Moto de 125 cc
```

## Casos límite a considerar

- **La sobrescritura con `super`:** cada subclase **reemite** la parte del padre (`super.descripcion()`) y concatena su extra. Si omitieras el `super`, perderías la marca en la salida (y el polimorfismo `Vehiculo[]` imprimiría descripciones incompletas).
- **`super()` en el constructor:** sigue siendo obligatoria como primera línea (lección del ejercicio 050), distinta de `super.método()` usada aquí dentro de un método.
- **Firmas `@Override` idénticas:** `descripcion()` en ambas subclases; cualquier variación de tipos rompe el contrato.
- **Polimorfismo de impresión:** `v.descripcion()` ejecuta la versión de la subclase correcta aunque `v` esté declarado como `Vehiculo`.
- Puertas o cilindrada `0`: la descripción igual se compone (dato irreal, anótalo como limitación).

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

El patrón en cada subclase es: `return super.descripcion() + " - Auto de " + puertas + " puertas";`. Fíjate que `super.descripcion()` es una **llamada al método del padre**, mientras `super(marca)` (en el constructor) es la **llamada al constructor del padre**: es fácil confundirlas.

</details>
