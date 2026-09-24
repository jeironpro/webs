# Ejercicio 066 - La doble estación de las máquinas

**Nivel:** 12 - Avanzado II
**Tema(s):** **concurrencia básica**, `Runnable`, `Thread`, `start()` vs `run()`, `join()`, `Thread.sleep` e `InterruptedException`
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

La planta tiene dos máquinas de empaque que trabajan **al mismo tiempo**: cada una "produce" varias piezas numeradas. Como el computador tiene varios núcleos (y aunque no los tuviera, el *time-sharing* intercala), las dos tareas se lanzan como **hilos independientes** y sus salidas pueden **entremezclarse** en un orden que **varía entre ejecuciones**.

El programa crea dos hilos (máquina `A` y máquina `B`); cada uno imprime 5 piezas (`Pieza k de MAQUINA`). El hilo `main` debe **esperar a que ambos terminen** antes de imprimir el cierre:

```
Todas las máquinas terminaron
```

## Instrucciones

- Crea la tarea como una clase que **implemente `Runnable`** (atributo con el nombre), con el método `run()` (aquí no se declara `throws`; es `public void run()`).
- Dentro de `run()`: un `for` de 1 a 5 que imprima `Pieza k de X` y luego `Thread.sleep(50)` **con su `try/catch` de `InterruptedException`** (es checked).
- En `main`:
  - Crea dos `Thread` con la tarea: `new Thread(new Maquina("A"))` y `new Thread(new Maquina("B"))`.
  - Lánzalos con **`.start()`** (no `.run()`: `run()` se ejecutaría en el mismo hilo, secuencial).
  - Espera a cada uno con **`.join()`** (para que `main` no imprima el cierre antes de tiempo).
- Imprime `Todas las máquinas terminaron` solo después de ambos `join`.
- **El orden exacto de las piezas no está fijado:** al prueba con `sleep` hace que las interlecciones varíen; no "arregles" el programa para que salga un orden dado.

## Firma sugerida

```java
public class DobleEstacionDeMaquinas {
    public static void main(String[] args) throws InterruptedException {
        // Tu código aquí
    }
}

class Maquina implements Runnable {
    private String nombre;

    public Maquina(String nombre) {
        this.nombre = nombre;
    }

    @Override
    public void run() {
        // Tu código aquí
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1 (una posible interlección; puede variar):**
```
Pieza 1 de A
Pieza 1 de B
Pieza 2 de A
Pieza 2 de B
Pieza 3 de A
Pieza 3 de B
Pieza 4 de A
Pieza 4 de B
Pieza 5 de A
Pieza 5 de B
Todas las máquinas terminaron
```

**Ejemplo 2 (otra ejecución posible):**
```
Pieza 1 de B
Pieza 1 de A
Pieza 2 de B
Pieza 2 de A
Pieza 3 de B
Pieza 3 de A
Pieza 4 de B
Pieza 4 de A
Pieza 5 de B
Pieza 5 de A
Todas las máquinas terminaron
```

## Casos límite a considerar

- **`run()` vs `start()`:** llamar `maquina.run()` **no crea un hilo**: ejecuta la tarea en el hilo actual y todo termina secuencial (y antes verías "Todas las máquinas terminaron" al final en orden). Solo `start()` lanza la ejecución paralela.
- **`InterruptedException` es checked:** `Thread.sleep(50)` la lanza; sin `try/catch` (o `throws` en `main`) no compila. Es una excepción "de interrupción", distinta de las de datos.
- **`.join()`** para la coordinación: sin él, `main` podría imprimir el cierre **antes** de que las máquinas terminen (los hilos aún trabajan en segundo plano).
- **Salidas entremezcladas:** el orden puede diferir entre corridas (interleaving). No programes asumiendo un orden.
- `sleep` con 0 o negativo no tira (0 es válido); valores altos hacen el programa más lento.
- Cuidado con la impresión: si dos hilos imprimen a la vez, la consola **puede** mezclar caracteres; imprimir una línea por `println` reduce el riesgo (anótalo).

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

Dentro de `run()`: `for (int k = 1; k <= 5; k++) { System.out.println("Pieza " + k + " de " + nombre); try { Thread.sleep(50); } catch (InterruptedException e) { return; } }`. En `main`: `Thread a = new Thread(new Maquina("A")); Thread b = new Thread(new Maquina("B")); a.start(); b.start(); a.join(); b.join(); System.out.println("Todas las máquinas terminaron");`.

</details>
