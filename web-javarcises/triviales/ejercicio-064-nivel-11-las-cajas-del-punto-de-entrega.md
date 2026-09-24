# Ejercicio 064 - Las cajas del punto de entrega

**Nivel:** 11 - Avanzado I
**Tema(s):** **genéricos** (`<T>`), clases genéricas, métodos genéricos, `Integer` en vez de `int`, autoboxing
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

El punto de entrega de paquetes guarda el contenido en **cajas reutilizables**: cada caja puede contener cualquier tipo de dato (un título de libro, un código numérico…), pero **su tipo se decide al crearla**. Con genéricos, una sola clase `Caja` sirve para todos los contenidos sin perder el chequeo de tipos en compilación.

Además, el sistema imprime listas de pares (códigos o palabras) con un **método genérico único** que sirve para cualquier arreglo.

El programa lee un **título** (texto) y un **código** (entero), y muestra:

```
Primera caja: TITULO
Segunda caja: CODIGO
Numeros: C C*2 C*3
Palabras: TITULO TITULO (copia)
```

## Instrucciones

- Crea la clase genérica:
  ```java
  class Caja<T> {
      private T contenido;
      public Caja(T contenido) { this.contenido = contenido; }
      public T getContenido() { return contenido; }
      public void setContenido(T contenido) { this.contenido = contenido; }
  }
  ```
- En `main`, crea `Caja<String> cajaTitulo = new Caja<>(titulo);` y `Caja<Integer> cajaCodigo = new Caja<>(codigo);` (usa `Integer`, **no** `int`: los parámetros de tipo no admiten primitivos).
- Define además un **método genérico**:
  ```java
  static <T> void imprimirElementos(T[] arreglo) {
      for (T e : arreglo) System.out.print(e + " ");
      System.out.println();
  }
  ```
  y úsalo con un `Integer[]` (código, código×2, código×3) y con un `String[]`.
- `main` imprime los contenidos con los getters y las dos listas con el método genérico.
- No uses `var` ni tipos brutos: declara los tipos explícitamente para fijar el concepto.

## Firma sugerida

```java
import java.util.Scanner;

public class PuntoDeEntrega {
    public static void main(String[] args) {
        // Tu código aquí
    }

    static <T> void imprimirElementos(T[] arreglo) {
        // Tu código aquí
    }
}

class Caja<T> {
    private T contenido;

    public Caja(T contenido) {
        this.contenido = contenido;
    }

    public T getContenido() {
        return contenido;
    }

    public void setContenido(T contenido) {
        this.contenido = contenido;
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1:**
```
Entrada: La Ilíada
Entrada: 7
Salida: Primera caja: La Ilíada
        Segunda caja: 7
        Numeros: 7 14 21
        Palabras: La Ilíada La Ilíada (copia)
```

**Ejemplo 2 (código 0 y título corto):**
```
Entrada: PQR
Entrada: 0
Salida: Primera caja: PQR
        Segunda caja: 0
        Numeros: 0 0 0
        Palabras: PQR PQR (copia)
```

## Casos límite a considerar

- **Nada de primitivos:** `Caja<int>` no compila; el parámetro de tipo debe ser una clase envolvente (`Integer`). El autoboxing convierte el `int` que lees en `Integer` automáticamente.
- **`<T>` del método es independiente del `<T>` de la clase:** la clase declara `Caja<T>` en su definición; el método genérico declara su **propio** `<T>` en la firma (`static <T> void ...`). Confundirlos es un error clásico de sintaxis.
- **Sin tipos brutos:** `new Caja(titulo)` (sin `<String>`) funciona por el diamante, pero aquí se pide declarar explícito para aprender; omite el contenido de `<>` si es típicamente correcto: `new Caja<>(titulo)`.
- **`getContenido()` devuelve `T`:** la caja de frases devuelve `String`, la de códigos devuelve `Integer`; no hace falta casting al imprimir.
- El método genérico acepta **arreglos** (no listas ni primitivos): `int[]` no vale; se usa `Integer[]`.
- `null` como contenido imprimiría `"null"`: válido, pero dato irreal.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

`Integer[] numeros = { codigo, codigo * 2, codigo * 3 }; String[] palabras = { titulo, titulo + " (copia)" };` y luego `imprimirElementos(numeros); imprimirElementos(palabras);`. Observa cómo **el mismo método** sirve para dos tipos distintos: eso es el genérico.

</details>
