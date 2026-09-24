# Ejercicio 068 - El verificador de paréntesis del editor

**Nivel:** 13 - Avanzado III
**Tema(s):** **estructura de datos a mano** (pila con un arreglo), operaciones `push`/`pop`/`peek`/`isEmpty`, semántica LIFO
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

El editor de texto revisa que las **expresiones con paréntesis** estén bien formadas: cada `(` debe tener su `)` de cierre y los cierres no pueden adelantarse. La estructura natural para esto es una **pila**: se empujan los `(` al abrir y se sacan al cerrar. Si al final no quedó nada en la pila, la expresión está balanceada.

El programa lee **una línea** (solo contiene paréntesis, nada más) y muestra `Balanceado` o `No balanceado`.

El reto de este nivel es **implementar la pila a mano**: un arreglo de `char` (o `int`) con capacidad fija, un índice `tope` y los métodos `push`, `pop`, `peek` e `isEmpty`.

## Instrucciones

- Crea tu propia clase **`Pila`** con:
  - `char[] datos` (capacidad dada en el constructor) e `int tope = -1`.
  - `void push(char c)`: si hay espacio, `datos[++tope] = c`.
  - `char pop()`: devuelve `datos[tope--]` (previamente verificar que no esté vacía).
  - `char peek()`: mira el tope sin sacarlo.
  - `boolean isEmpty()`: `tope == -1`.
  - `boolean isFull()`: `tope == datos.length - 1`.
- En `main`, recorre la línea carácter a carácter: `(` → `push`; `)` → si está vacía la pila, **no balanceado**; si no, `pop`. Al final, balanceado **solo si** la pila quedó vacía.
- No uses `java.util.Stack` ni `Deque`: la pila es tuya.
- Si una `push` se hiciera con la pila llena (capacidad insuficiente), avisa `Error: pila llena` (el enunciado asume entradas cortas, pero anótalo).

## Firma sugerida

```java
import java.util.Scanner;

public class VerificadorDeParentesis {
    public static void main(String[] args) {
        // Tu código aquí
    }
}

class Pila {
    private char[] datos;
    private int tope;

    public Pila(int capacidad) {
        datos = new char[capacidad];
        tope = -1;
    }

    public void push(char c) {
        // Tu código aquí
    }

    public char pop() {
        return datos[tope--];
    }

    public boolean isEmpty() {
        return tope == -1;
    }

    public boolean isFull() {
        return tope == datos.length - 1;
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1 (balanceado):**
```
Entrada: (()(()))
Salida: Balanceado
```

**Ejemplo 2 (la trampa del cierre adelantado):**
```
Entrada: ())(
Salida: No balanceado
```

**Ejemplo 3 (quedó algo en la pila):**
```
Entrada: ((
Salida: No balanceado
```

**Ejemplo 4 (vacío):**
```
Entrada:
Salida: Balanceado
```

## Casos límite a considerar

- **El cierre adelantado `)` antes de un `(`:** al encontrar `)` con la pila vacía, ya no hay par que cerrar → `No balanceado` al instante (ejemplo 2). Es la comprobación que olvidan las soluciones que solo cuentan ocurrencias.
- **Quedaron sin cerrar:** después del recorrido, una pila **no vacía** significa `(` sin par (ejemplo 3).
- **El índice `tope`:** inicia en `-1` (pila vacía). Empujar es `datos[++tope] = c`; sacar es `datos[tope--]`. Pre/post-incremento aquí es la fuente de errores por desfase de 1 (un `topo` corrido rompe `isEmpty`/`isFull`).
- **`pop` sobre una pila vacía:** tu algoritmo debe evitarlo con `isEmpty()` antes de llamar; si igual se llama, el índice sale de rango del arreglo (crash).
- **Capacidad:** si la pila se llena (`isFull`), un `push` adicional escribiría fuera del arreglo. Avísalo y termina con elegancia.
- Línea vacía: no se empuja nada; al final la pila está vacía → `Balanceado` (correcto).

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

```
Pila p = new Pila(s.length());
boolean ok = true;
for (int i = 0; i < s.length(); i++) {
    char c = s.charAt(i);
    if (c == '(') { p.push(c); continue; }
    if (p.isEmpty()) { ok = false; break; }
    p.pop();
}
if (ok && p.isEmpty()) System.out.println("Balanceado");
else System.out.println("No balanceado");
```
La capacidad del primer arreglo (`s.length()`) nunca se excede con solo paréntesis.

</details>
