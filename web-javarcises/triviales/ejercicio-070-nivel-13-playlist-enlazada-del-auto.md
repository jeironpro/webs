# Ejercicio 070 - La playlist enlazada del auto

**Nivel:** 13 - Avanzado III
**Tema(s):** **estructura de datos a mano** (nodo + puntero), lista enlazada, inserción al inicio, eliminación, recorrido con `null`
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

El auto reproduce canciones en orden con una **lista enlazada**: cada nodo tiene una canción y un puntero a la siguiente. El programa lee operaciones hasta `FIN`:

- **`A`** + título → agrega la canción **al inicio** de la lista. Imprime `Agregada: X`.
- **`E`** + título → busca y **elimina** la primera aparición. Imprime `Eliminada: X` o `No encontrada`.
- **`M`** → muestra la playlist actual, **una canción por línea** en el orden del enlazado, o `Lista vacía` si no hay canciones.

Las operaciones se trabajan **manualmente**: nodos creados en `main`, puntero `siguiente` actualizado a mano.

## Instrucciones

- Crea la clase **`Nodo`** con `String dato; Nodo siguiente;` y constructor que recibe el dato.
- Guarda el **primer** nodo en una variable `Nodo cabeza` (inicialmente `null`). La referencia a la cabeza es toda la lista; si se pierde, se pierden los nodos.
- **Agregar al inicio:** nuevo nodo → su `siguiente` es la `cabeza` actual, y luego la `cabeza` pasa a ser el nuevo nodo.
- **Recorrer:** `for (Nodo n = cabeza; n != null; n = n.siguiente)`.
- **Eliminar:** hay dos casos: si el dato está en **la cabeza**, la cabeza pasa a ser su `siguiente`; si está en el medio, el nodo **anterior** debe enlazar con el `siguiente` del eliminado. Lleva siempre una variable `anterior`.
- **Contar/reconocer vacío:** `cabeza == null` → lista vacía.
- **Comparar canciones con `equals`**, no con `==`.

## Firma sugerida

```java
import java.util.Scanner;

public class PlaylistEnlazada {
    public static void main(String[] args) {
        Nodo cabeza = null;
        // Tu código aquí
    }
}

class Nodo {
    String dato;
    Nodo siguiente;

    public Nodo(String dato) {
        this.dato = dato;
        this.siguiente = null;
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1 (agregar al inicio invierte el orden):**
```
Entrada: A Ana
Entrada: A Luis
Entrada: A Ro
Entrada: M
Entrada: FIN
Salida: Agregada: Ana
        Agregada: Luis
        Agregada: Ro
        Ro
        Luis
        Ana
```

**Ejemplo 2 (eliminar del medio):**
```
Entrada: A Ana
Entrada: A Luis
Entrada: A Ro
Entrada: E Luis
Entrada: M
Entrada: FIN
Salida: Agregada: Ana
        Agregada: Luis
        Agregada: Ro
        Eliminada: Luis
        Ro
        Ana
```

**Ejemplo 3 (eliminar la cabeza, que es la última agregada):**
```
Entrada: A Ana
Entrada: A Luis
Entrada: E Luis
Entrada: M
Entrada: FIN
Salida: Agregada: Ana
        Agregada: Luis
        Eliminada: Luis
        Ana
```

**Ejemplo 4 (eliminar algo que no existe):**
```
Entrada: A Ana
Entrada: E Ro
Entrada: FIN
Salida: Agregada: Ana
        No encontrada
```

**Ejemplo 5 (nada recorrido):**
```
Entrada: M
Entrada: FIN
Salida: Lista vacía
```

## Casos límite a considerar

- **Cabeza `null`:** toda la lista se define por la referencia `cabeza`. Al agregar el primer nodo, su `siguiente` es `null` y luego `cabeza` toma el nodo nuevo. Al eliminar el último, `cabeza` vuelve a quedar `null`.
- **Eliminar la cabeza vs. el medio:** si el dato está en el primer nodo, NO hace falta `anterior`; si está en el medio, `anterior.siguiente` debe apuntar a `n.siguiente` (el eliminado se "salta"). Olvidar este reenlace deja la lista partida en dos.
- **La variable `anterior`:** se actualiza al avanzar (`anterior = n`) **después** de comprobar el nodo actual, no antes, o perderías el nodo previo.
- **`equals`, no `==`:** las cadenas se comparan con `dato.equals(buscada)`; con `==` nunca encontrarías canciones iguales escritas en distintas variables.
- **Orden invertido:** agregar al inicio significa que al mostrar, la última agregada sale primero (ejemplo 1). No confundirlo con FIFO.
- **Fin de recorrido con `null`:** la condición del `for` es `n != null`. Recorrer hasta que el puntero quede `null` termina sin salirse de la lista.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

```
// Agregar al inicio
Nodo nuevo = new Nodo(titulo);
nuevo.siguiente = cabeza;
cabeza = nuevo;

// Eliminar primera aparición
boolean encontrado = false;
if (cabeza != null && cabeza.dato.equals(titulo)) {
    cabeza = cabeza.siguiente;
    encontrado = true;
} else {
    Nodo anterior = cabeza;
    for (Nodo n = (cabeza != null ? cabeza.siguiente : null); n != null; n = n.siguiente) {
        if (n.dato.equals(titulo)) {
            anterior.siguiente = n.siguiente;
            encontrado = true;
            break;
        }
        anterior = n;
    }
}
```
La cabeza es el caso especial; el resto del recorrido solo necesita reenlazar con `anterior`.

</details>
