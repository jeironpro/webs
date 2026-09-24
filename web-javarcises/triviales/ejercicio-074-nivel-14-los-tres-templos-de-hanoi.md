# Ejercicio 074 - Los tres templos de Hanoi

**Nivel:** 14 - Experto I
**Tema(s):** **recursión múltiple** (tres llamadas), torres de Hanoi, intercambio de roles de las torres, explosión combinatoria
**Dificultad estimada:** ⭐⭐⭐⭐☆

## Enunciado

En los tres templos de Hanoi hay **`N` discos** apilados en la torre **`A`** (el más grande abajo) y dos torres vacías (`B` y `C`). Hay que mover **toda** la pila de `A` a `C`, moviendo **un disco a la vez** y sin poner nunca un disco grande sobre uno pequeño.

El programa lee `N` (entre 1 y 6) y **imprime cada movimiento** con el formato:

```
Mover disco D de X a Y
```

Al final imprime:

```
Total de movimientos: T
```

El truco recursivo es una sola frase: para mover `N` discos de `A` a `C`, primero mueve los `N - 1` de arriba de `A` a `B` (usando `C` como auxiliar), luego mueve el disco `N` de `A` a `C`, y por último mueve los `N - 1` de `B` a `C` (usando `A` como auxiliar). Cada parte es la misma función con **otros roles**.

## Instrucciones

- Implementa **`static void hanoi(int n, char origen, char destino, char auxiliar)`**:
  - **Caso base:** `n == 1` → imprime `Mover disco 1 de origen a destino` y devuelve.
  - Caso recursivo:
    1. `hanoi(n - 1, origen, auxiliar, destino)` — pasa los de arriba a la torre auxiliar.
    2. imprime `Mover disco n de origen a destino` — el grande va directo.
    3. `hanoi(n - 1, auxiliar, destino, origen)` — pasan a la final.
- Con la **numeración de discos desde 1** (el más chico) hasta `N` (el más grande). El disco que imprime el caso recursivo (paso 2) es siempre el más grande del subproblema: el parámetro `n`.
- Lleva un **contador de movimientos** que incrementes cada vez que imprimes uno, e imprime el total al final.
- `main` llama `hanoi(N, 'A', 'C', 'B')`.
- Sin bucles: la resolución entera son llamadas recursivas.

## Firma sugerida

```java
import java.util.Scanner;

public class TorresDeHanoi {
    static int movimientos = 0;

    public static void main(String[] args) {
        // Tu código aquí
    }

    static void hanoi(int n, char origen, char destino, char auxiliar) {
        // Tu código aquí
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1 (N = 3):**
```
Entrada: N = 3
Salida: Mover disco 1 de A a C
        Mover disco 2 de A a B
        Mover disco 1 de C a B
        Mover disco 3 de A a C
        Mover disco 1 de B a A
        Mover disco 2 de B a C
        Mover disco 1 de A a C
        Total de movimientos: 7
```

**Ejemplo 2 (N = 1):**
```
Entrada: N = 1
Salida: Mover disco 1 de A a C
        Total de movimientos: 1
```

**Ejemplo 3 (N = 2):**
```
Entrada: N = 2
Salida: Mover disco 1 de A a B
        Mover disco 2 de A a C
        Mover disco 1 de B a C
        Total de movimientos: 3
```

## Casos límite a considerar

- **El caso base es `n == 1`, no `n == 0`:** con `n == 1` el último disco se mueve directo y la cadena corta. Usar `n == 0` obligaría a manejarlo "vacío" e imprime un movimiento de más o de menos.
- **Qué torre es cada rol en cada llamada:** el paso 1 usa `destino` como auxiliar y el paso 3 usa `origen` como auxiliar. Confundir los argumentos produce movimientos ilegales (disco grande encima de chico).
- **El disco grande del subproblema es `n`, no `1`:** en el paso 2, al mover los `n - 1` de arriba, queda expuesto el disco `n`; imprimirlo como disco `n` es lo correcto.
- **Solo cambia el problema en `n - 1`:** cada nivel reduce la pila en un disco. Como cada llamada vuelve a llamar dos veces, el número de llamadas crece exponencialmente: `2^N - 1` movimientos. Por eso el enunciado limita `N` a 6 (con `N = 40` serían un billón de líneas).
- **Contador acumulado, no impreso por recursión `return`:** el total `2^N - 1` es la trampa de verificación: si tu contador no termina en `2^N - 1`, hay un paso duplicado o perdido.
- **`N` fuera del rango:** `N = 0` no imprime nada (total 0); se asume `N >= 1`.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

```
static void hanoi(int n, char origen, char destino, char auxiliar) {
    if (n == 1) {
        System.out.println("Mover disco 1 de " + origen + " a " + destino);
        movimientos++;
        return;
    }
    hanoi(n - 1, origen, auxiliar, destino);
    System.out.println("Mover disco " + n + " de " + origen + " a " + destino);
    movimientos++;
    hanoi(n - 1, auxiliar, origen, destino);
}
```
Observa el paso 3: `auxiliar` pasa a ser el nuevo origen y `origen` el nuevo auxiliar. Los tres primeros movimientos del ejemplo 1 son exactamente `hanoi(2, 'A', 'B', 'C')` corriendo por dentro antes de que el disco 3 se mueva.

</details>
