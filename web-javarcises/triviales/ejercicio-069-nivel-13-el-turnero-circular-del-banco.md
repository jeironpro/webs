# Ejercicio 069 - El turnero circular del banco

**Nivel:** 13 - Avanzado III
**Tema(s):** **estructura de datos a mano** (cola con arreglo **circular**), operaciones `encolar`/`desencolar`/`frente`, índice `cabeza` y `frente`, módulo
**Dificultad estimada:** ⭐⭐⭐⭐☆

## Enunciado

El banco atiende con un **turnero FIFO** (el que llega primero se atiende primero). La cola se implementa **a mano** con un arreglo **circular**: cuando el final llega al borde, da la vuelta y vuelve por el principio, reutilizando los huecos que dejaron los clientes ya atendidos.

El programa lee operaciones hasta la palabra `FIN`:
- **`L`** seguido de un número → llega un cliente con ese turno (se **encola**). Imprime `Llega el cliente X`.
- **`A`** → se **atiende** al frente. Imprime `Atendido: X`, o `No hay clientes` si la cola está vacía.

Al terminar:

```
Quedan N en la cola
```

## Instrucciones

- Crea tu propia clase **`ColaCircular`** con:
  - `int[] datos` (capacidad fija, ej. 10), e índices `int frente`, `int finalCola` y `int tamano` (sin ñ, como identificador Java).
  - `boolean isEmpty()` → `tamano == 0`; `boolean isFull()` → `tamano == datos.length`.
  - `void encolar(int v)`: si hay espacio, `datos[finalCola] = v; finalCola = (finalCola + 1) % datos.length; tamano++;`.
  - `int desencolar()`: `int v = datos[frente]; frente = (frente + 1) % datos.length; tamano--; return v;`.
  - `int frenteValor()` (peek).
- En `main`, lee las operaciones con `next()`/`nextInt()` hasta `FIN` y usa la cola.
- No uses `java.util.Queue` ni `LinkedList`.
- El **módulo** (`%`) da la vuelta al arreglo; un arreglo con índices lineales no circular se desbordaría al llegar al borde.

## Firma sugerida

```java
import java.util.Scanner;

public class TurneroCircular {
    public static void main(String[] args) {
        // Tu código aquí
    }
}

class ColaCircular {
    private int[] datos;
    private int frente;
    private int finalCola;
    private int tamano;

    public ColaCircular(int capacidad) {
        datos = new int[capacidad];
        frente = 0;
        finalCola = 0;
        tamano = 0;
    }

    public boolean isEmpty() { return tamano == 0; }
    public boolean isFull() { return tamano == datos.length; }

    public void encolar(int v) {
        // Tu código aquí
    }

    public int desencolar() {
        // Tu código aquí
        return 0;
    }

    public int frenteValor() {
        return datos[frente];
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1 (llenar, atender, y dar la vuelta):**
```
Entrada: L 1
Entrada: L 2
Entrada: A
Entrada: L 3
Entrada: A
Entrada: A
Entrada: A
Entrada: FIN
Salida: Llega el cliente 1
        Llega el cliente 2
        Atendido: 1
        Llega el cliente 3
        Atendido: 2
        Atendido: 3
        No hay clientes
        Quedan 0 en la cola
```

**Ejemplo 2 (solo llegan):**
```
Entrada: L 5
Entrada: L 7
Entrada: L 9
Entrada: FIN
Salida: Llega el cliente 5
        Llega el cliente 7
        Llega el cliente 9
        Quedan 3 en la cola
```

**Ejemplo 3 (atender de entrada):**
```
Entrada: A
Entrada: FIN
Salida: No hay clientes
        Quedan 0 en la cola
```

## Casos límite a considerar

- **El arreglo circular:** `finalCola` y `frente` avanzan con `(índice + 1) % capacidad`. Cuando alguno llega al último índice, el `%` lo regresa a `0`: así el hueco que dejó un cliente atendido se reutiliza (de ahí "circular").
- **Distinguir "vacía" de "llena":** con el contador `tamano`, vacía es `tamano == 0` y llena `tamano == datos.length`, sin ambigüedades (el truco del "hueco de un slot" es otra técnica, pero aquí usamos el contador).
- **`desencolar` sobre cola vacía:** tu `main` debe comprobar `isEmpty()` antes de llamar; si no, leería una posición sin sentido.
- **FIFO estricto:** el que llega primero se atiende primero; `desencolar` saca de `frente`, `encolar` mete en `finalCola` (al revés de la pila del ejercicio 068).
- **Capacidad fija:** si se llega a la llena y se intenta `encolar`, avisa (ej. `Cola llena`) sin sobreescribir.
- No atender a nadie pero sí llegar clientes: al final quedan todos en cola.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

```
public void encolar(int v) {
    if (isFull()) { System.out.println("Cola llena"); return; }
    datos[finalCola] = v;
    finalCola = (finalCola + 1) % datos.length;
    tamano++;
}
public int desencolar() {
    int v = datos[frente];
    frente = (frente + 1) % datos.length;
    tamano--;
    return v;
}
```
En `main`, al leer `A`: `if (cola.isEmpty()) System.out.println("No hay clientes"); else System.out.println("Atendido: " + cola.desencolar());`.

</details>
