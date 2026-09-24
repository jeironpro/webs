# Ejercicio 071 - El registro de precios del almacén (árbol binario)

**Nivel:** 13 - Avanzado III
**Tema(s):** **estructura de datos a mano** (nodo con ramas), árbol binario de búsqueda, inserción y recorrido **recursivos**, extremos por ramas
**Dificultad estimada:** ⭐⭐⭐⭐☆

## Enunciado

El almacén mantiene sus precios en un **árbol binario de búsqueda** hecho a mano: cada nodo tiene un valor, una rama `izquierdo` con los menores y una rama `derecho` con los mayores. El programa lee operaciones hasta `FIN`:

- **`I`** + entero → **inserta** el precio respetando la regla (menores a la izquierda, mayores a la derecha).
- **`R`** → recorre **en orden** (izquierda, nodo, derecha). Imprime `Recorrido: v1 v2 ...`.
- **`MX`** → imprime `Maximo: v`.
- **`MN`** → imprime `Minimo: v`.

Con el recorrido en orden, los precios salen **ordenados de menor a mayor**: el árbol es justamente lo que hace posible ese orden.

## Instrucciones

- Crea **`NodoArbol`** con `int dato; NodoArbol izquierdo; NodoArbol derecho;` y constructor que recibe el dato.
- **Insertar** con un método recursivo que devuelve el nodo (o raíz) actualizado:

  ```java
  NodoArbol insertar(NodoArbol n, int v) {
      if (n == null) return new NodoArbol(v);
      if (v < n.dato) n.izquierdo = insertar(n.izquierdo, v);
      else if (v > n.dato) n.derecho = insertar(n.derecho, v);
      return n;
  }
  ```

  Se llama con `raiz = insertar(raiz, v)`. La rama actualizada se "devuelve hacia arriba" para no perder el árbol.
- **Recorrer en orden** recursivo: visitar `izquierdo`, imprimir el nodo, visitar `derecho`. El caso base es `n == null` (no hacer nada).
- **Máximo** = el nodo más a la derecha (bajar por `derecho` hasta `null`). **Mínimo** = el más a la izquierda (bajar por `izquierdo` hasta `null`).
- **`raiz` inicialmente `null`:** el árbol vacío se detecta con `raiz == null`.

## Firma sugerida

```java
import java.util.Scanner;

public class RegistroDePrecios {
    public static void main(String[] args) {
        NodoArbol raiz = null;
        // Tu código aquí
    }

    static NodoArbol insertar(NodoArbol n, int v) {
        // Tu código aquí
        return n;
    }

    static void enOrden(NodoArbol n) {
        // Tu código aquí
    }

    static int maximo(NodoArbol n) {
        // Tu código aquí
        return 0;
    }

    static int minimo(NodoArbol n) {
        // Tu código aquí
        return 0;
    }
}

class NodoArbol {
    int dato;
    NodoArbol izquierdo;
    NodoArbol derecho;

    public NodoArbol(int dato) {
        this.dato = dato;
        this.izquierdo = null;
        this.derecho = null;
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1 (insertar desordenado, leer ordenado):**
```
Entrada: I 50
Entrada: I 30
Entrada: I 70
Entrada: I 20
Entrada: I 40
Entrada: R
Entrada: MX
Entrada: MN
Entrada: FIN
Salida: Recorrido: 20 30 40 50 70
        Maximo: 70
        Minimo: 20
```

**Ejemplo 2 (un solo valor):**
```
Entrada: I 15
Entrada: R
Entrada: MX
Entrada: MN
Entrada: FIN
Salida: Recorrido: 15
        Maximo: 15
        Minimo: 15
```

**Ejemplo 3 (árbol desbalanceado, solo por la derecha):**
```
Entrada: I 5
Entrada: I 6
Entrada: I 7
Entrada: R
Entrada: MX
Entrada: FIN
Salida: Recorrido: 5 6 7
        Maximo: 7
```

## Casos límite a considerar

- **La regla del árbol:** menores van a la izquierda, mayores a la derecha, siempre a partir de la raíz. Insertar `7` tras `6` tras `5` forma una cadena a la derecha; el árbol NO se auto-balancea aquí (no es un AVL), y el recorrido en orden igual sale `5 6 7`.
- **La devolución recursiva:** en `insertar`, `n.izquierdo = insertar(n.izquierdo, v)` es la línea que conecta el nodo nuevo al árbol. Si el método no devolviera el nodo, la rama nueva quedaría perdida.
- **Caso base `n == null`:** es el fin de toda recursión. Sin él, `enOrden` se desbordaría (`StackOverflowError`).
- **In-order = ordenado:** izquierda → nodo → derecha entrega los valores de menor a mayor. Confundir el orden (imprimir el nodo antes de bajar por la izquierda) partiría la salida.
- **`raiz == null` en `R`:** debe imprimir `Recorrido:` vacío (o `Arbol vacio`) sin romper la recursión. `MX`/`MN` sobre árbol vacío no tienen respuesta: el enunciado asume al menos un `I` antes.
- **Repetidos (duplicados):** nuestro `insertar` ignora un valor igual (no baja a ninguna rama); anótalo como decisión del enunciado.
- Los extremos no necesitan recursión: el máximo es el **más a la derecha** y el mínimo el **más a la izquierda**; la regla del árbol lo garantiza.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

```
static void enOrden(NodoArbol n) {
    if (n == null) return;
    enOrden(n.izquierdo);
    System.out.print(n.dato + " ");
    enOrden(n.derecho);
}

static int maximo(NodoArbol n) {
    while (n.derecho != null) n = n.derecho;
    return n.dato;
}
```
Para `MN`, el mismo bucle pero bajando por `n.izquierdo`. El máximo no necesita recursión: en un BST, la rama derecha siempre lleva a valores mayores.

</details>
