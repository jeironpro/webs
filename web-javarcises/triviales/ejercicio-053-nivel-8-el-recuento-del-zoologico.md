# Ejercicio 053 - El recuento del zoológico

**Nivel:** 8 - POO II
**Tema(s):** sobrescritura de **`toString()`** (método de la clase `Object`), método abstracto, polimorfismo dentro de `toString`
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

El zoológico registra a sus animales en una jerarquía: todos tienen un **nombre** y un **sonido** característico. Para imprimir la ficha de cada uno, el programa sobrescribe el método **`toString()`** (heredado de la clase `Object`), que armará la línea: nombre, la palabra "hace" y el sonido de ese animal. Como `sonido()` es **abstracto** en la base y cada animal lo implementa, el `toString` de la base queda polimórfico.

El programa lee `N` (mayor a 0) animales: la letra `P` (perro), `G` (gato) o `J` (pájaro) y el **nombre**. Guarda en `Animal[]` y muestra una ficha por animal:

```
Rex hace guau
Misifú hace miau
Piolín hace pío
```

## Instrucciones

- Crea la jerarquía:
  - `abstract class Animal`: atributo `protected String nombre`; constructor `Animal(String nombre)`; **método abstracto** `abstract String sonido();`; y **`@Override public String toString()`** que devuelve `nombre + " hace " + sonido()`.
  - Subclases `Perro`, `Gato`, `Pajaro` que llaman `super(nombre)` e implementan `sonido()` con `"guau"`, `"miau"` y `"pío"` respectivamente (todas con `@Override`).
- `main` guarda los objetos en `Animal[] animales` y los imprime con `System.out.println(animales[i]);` — **sin llamar explícitamente a `toString()`**: `println` ya lo invoca automáticamente.
- **No sobrescribas** nada más que lo pedido: el truco es que una sola implementación de `toString` sirve para los tres tipos (polimorfismo).

## Firma sugerida

```java
import java.util.Scanner;

public class RecuentoDelZoologico {
    public static void main(String[] args) {
        // Tu código aquí
    }
}

abstract class Animal {
    protected String nombre;

    public Animal(String nombre) {
        this.nombre = nombre;
    }

    public abstract String sonido();

    @Override
    public String toString() {
        return "0"; // reemplaza
    }
}

class Perro extends Animal {
    public Perro(String nombre) {
        super(nombre);
    }

    @Override
    public String sonido() {
        return "guau";
    }
}

class Gato extends Animal {
    public Gato(String nombre) {
        super(nombre);
    }

    @Override
    public String sonido() {
        return "miau";
    }
}

class Pajaro extends Animal {
    public Pajaro(String nombre) {
        super(nombre);
    }

    @Override
    public String sonido() {
        return "pío";
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1:**
```
Entrada: 3
Entrada: P
Entrada: Rex
Entrada: G
Entrada: Misifú
Entrada: J
Entrada: Piolín
Salida: Rex hace guau
        Misifú hace miau
        Piolín hace pío
```

**Ejemplo 2 (de la misma letra):**
```
Entrada: 2
Entrada: P
Entrada: Firulais
Entrada: P
Entrada: Lucas
Salida: Firulais hace guau
        Lucas hace guau
```

**Ejemplo 3 (un animal):**
```
Entrada: 1
Entrada: J
Entrada: Piolín
Salida: Piolín hace pío
```

## Casos límite a considerar

- **La trampa del `hashCode`:** sin sobrescribir `toString`, `System.out.println(animal)` imprime `Perro@4e50df2e` (clase + posición de memoria). Sobrescribirlo es lo único que cambia eso.
- **La firma de `toString`:** debe ser **`public String toString()`** (es un override de `Object`); un modificador distinto o un retorno distinto no sobrescriben y el compilador no lo detecta como override del que esperabas.
- **`sonido()` abstracto:** subclases que no lo implementen no serían `abstract` válidas (deberían declararse `abstract` también).
- **Polimorfismo en `toString`:** el método vive una sola vez en la base, pero al ejecutarse llama al `sonido()` de la subclase real (perro→guau, gato→miau). Esa es la esencia del diseño.
- El orden de impresión es el orden de entrada (no alfabético).

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

En `Animal`: `return nombre + " hace " + sonido();`. Ese único método basta para los tres tipos: cuando el objeto real es un `Gato`, `sonido()` responde `"miau"`, aunque el código viva en la clase base. `main` solo hace `new` del tipo correcto según la letra y un solo `println`.

</details>
