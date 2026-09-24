# Ejercicio 081 - El turnero único del aeropuerto

**Nivel:** 14 - Experto I
**Tema(s):** **patrón de diseño Singleton**, constructor privado, campo y método `static`, inicialización perezosa, identidad del objeto
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

El aeropuerto necesita **una sola** central de turnos en todo el edificio: cada mostrador debe pedir el siguiente turno a la **misma** instancia, para que los números nunca se reinicien ni se repitan.

El **patrón Singleton** garantiza una única instancia de una clase: el constructor es **`private`** (nadie puede llamar `new TurneroCentral()`), y el único camino para obtener el objeto es el método estático `getInstancia()`, que **lo crea la primera vez** y desde ahí **devuelve siempre el mismo**.

El programa lee `N` (mayor a 0) y simula `N` mostradores pidiendo turno. Cada vez se obtiene la instancia con `getInstancia()` y se llama `tomarTurno()`. Imprime:

```
Mostrador i -> Turno X
```

y al final:

```
Objetos creados: 1
```

## Instrucciones

- Crea **`TurneroCentral`** con:
  - `private static TurneroCentral unica;` y `private int siguienteTurno = 0;`.
  - `private TurneroCentral() { ... }` → **el constructor privado es la fábrica del patrón**.
  - `public static TurneroCentral getInstancia() { if (unica == null) unica = new TurneroCentral(); return unica; }` → **inicialización perezosa** (se crea al primer uso).
  - `public int tomarTurno() { siguienteTurno++; return siguienteTurno; }`.
  - Un `private static int creadas` que sume en el constructor y un `public static int getCreadas()` para el conteo final.
- `main` **no puede hacer `new TurneroCentral()`** (ni compilaría): solo `TurneroCentral.getInstancia()`.
- El estado vive **en la instancia única**: `siguienteTurno` avanza con cada mostrador porque todos tocan el mismo objeto. Si alguien "recreara" (usando un constructor público), el conteo se reiniciaría.

## Firma sugerida

```java
import java.util.Scanner;

public class TurneroDelAeropuerto {
    public static void main(String[] args) {
        // Tu código aquí
        System.out.println("Objetos creados: " + TurneroCentral.getCreadas());
    }
}

class TurneroCentral {
    private static TurneroCentral unica;
    private static int creadas = 0;
    private int siguienteTurno = 0;

    private TurneroCentral() {
        creadas++;
    }

    public static TurneroCentral getInstancia() {
        if (unica == null) unica = new TurneroCentral();
        return unica;
    }

    public int tomarTurno() {
        siguienteTurno++;
        return siguienteTurno;
    }

    public static int getCreadas() {
        return creadas;
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1:**
```
Entrada: N = 5
Salida: Mostrador 1 -> Turno 1
        Mostrador 2 -> Turno 2
        Mostrador 3 -> Turno 3
        Mostrador 4 -> Turno 4
        Mostrador 5 -> Turno 5
        Objetos creados: 1
```

**Ejemplo 2 (N = 3):**
```
Entrada: N = 3
Salida: Mostrador 1 -> Turno 1
        Mostrador 2 -> Turno 2
        Mostrador 3 -> Turno 3
        Objetos creados: 1
```

## Casos límite a considerar

- **El constructor `private` es lo que impide el `new`:** si se declara `public` (o se omite, dejando el predeterminado), cualquiera puede crear instancias nuevas y el patrón se rompe: `creadas` sube a 2... y el compilador no avisaría; sería un error de diseño detectado solo por el contador.
- **`getInstancia()` comprueba `unica == null` antes de crear:** la "inicialización perezosa" crea solo al primer uso. Si en `main` la primera acción fuera `crear()` de verdad (con un `new`), estarías rompiendo el patrón.
- **El campo `unica` debe ser `static`:** estático = uno por clase, no uno por objeto; ahí vive la unicidad. Con una referencia de instancia, cada llamada devolvería `null`.
- **`getInstancia` devuelve `TurneroCentral` y el estado se conserva entre llamadas:** dos `getInstancia()` consecutivos son el **mismo objeto**; por eso los turnos siguen el conteo (ejemplos 1 y 2) aunque cada línea pida la instancia de nuevo.
- **Concurrencia (nivel 12):** si varios hilos llamaran `getInstancia()` a la vez, dos podrían crear sendos objetos. El enunciado asume un solo hilo; la protección con `synchronized` sería el refinamiento.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

```
for (int i = 1; i <= N; i++) {
    TurneroCentral t = TurneroCentral.getInstancia();
    System.out.println("Mostrador " + i + " -> Turno " + t.tomarTurno());
}
```
La variable `t` se declara y "descarta" en cada vuelta... pero `getInstancia()` devuelve el mismo único objeto, así que `siguienteTurno` acumula. Ese es el sentido del patrón: nadie controla el ciclo de vida excepto `getInstancia`.

</details>
