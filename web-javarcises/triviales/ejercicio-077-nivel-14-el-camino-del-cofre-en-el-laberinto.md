# Ejercicio 077 - El camino del cofre en el laberinto

**Nivel:** 14 - Experto I
**Tema(s):** **backtracking/exploración recursiva**, matriz de 2D como mapa, límites, marcado de visitados, propagación del `boolean`
**Dificultad estimada:** ⭐⭐⭐⭐☆

## Enunciado

Un cofre espera en la **esquina inferior derecha** de un laberinto rectangular. El programa lee las dimensiones `R` y `C` (mayores a 0), luego `R` líneas con `C` caracteres cada una:

- `.` → celda libre.
- `#` → muro (no se puede pisar).

Se parte de la casilla `(0,0)` y hay que determinar si existe un camino hasta `(R-1, C-1)` moviéndose **arriba, abajo, izquierda o derecha** (no en diagonal). Imprime `Existe camino` o `No existe camino`.

La solución es una **recursión que explora**: desde la casilla actual se intenta cada uno de los 4 movimientos; cualquiera que llegue al cofre hace que toda la cadena devuelva `true`. Las celdas ya probadas se **marcan** para no dar vueltas en círculo.

## Instrucciones

- Lee `R` y `C`, y guarda el laberinto en `char[][] mapa` (o `String[] lineas` con `charAt`).
- Implementa **`static boolean buscar(char[][] mapa, int f, int c)`**:
  1. Si `f` o `c` **sale de los límites** → `return false`.
  2. Si `mapa[f][c] == '#'` → muro, `return false`.
  3. Si `f == filas - 1 && c == columnas - 1` → llegaste al cofre, `return true`.
  4. **Marca** la celda como visitada (ej. `mapa[f][c] = '#'`).
  5. Prueba las 4 direcciones con OR: `if (buscar(f, c + 1)) return true;` derecho → `buscar(f, c - 1)` izquierdo → `buscar(f + 1, c)` abajo → `buscar(f - 1, c)` arriba. (El orden no importa para "existe o no".)
  6. Si ninguna funcionó → `false`.
- `main` llama `buscar(mapa, 0, 0)` y decide el mensaje.
- No uses bucles para explorar el camino: es **recursión pura**. El marcado de visitados evita el bucle infinito sin necesidad de un arreglo aparte.

## Firma sugerida

```java
import java.util.Scanner;

public class CaminoDelCofre {
    static int filas, columnas;

    public static void main(String[] args) {
        // Tu código aquí
    }

    static boolean buscar(char[][] mapa, int f, int c) {
        // Tu código aquí
        return false;
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1 (hay camino en forma de "S"):**
```
Entrada: R = 4, C = 4
Entrada: .#..
Entrada: .#..
Entrada: ....
Entrada: .##.
Salida: Existe camino
```
(Se pasa por `(0,0)`→`(1,0)`→`(2,0)`→`(3,0)`→`(3,1)`→`(2,1)`→`(2,2)`→`(2,3)`→`(3,3)`; los muros son `(0,1)`, `(1,1)`, `(3,2)`.)

**Ejemplo 2 (bloqueado):**
```
Entrada: R = 2, C = 2
Entrada: .#
Entrada: #.
Salida: No existe camino
```

**Ejemplo 3 (1×1, el cofre es el inicio):**
```
Entrada: R = 1, C = 1
Entrada: .
Salida: Existe camino
```

**Ejemplo 4 (inicio en muro):**
```
Entrada: R = 2, C = 2
Entrada: ##
Entrada: ..
Salida: No existe camino
```

## Casos límite a considerar

- **El orden de las comprobaciones importa:** límites **antes** que `mapa[f][c]`: con `f` desbordado no existe `mapa[f]`. El muro antes que la meta: la meta tiene que ser `.`.
- **El marcado de visitados es lo que evita el infinito:** sin marcar `(0,0)`, la recursión salta a `(0,1)` y de vuelta a `(0,0)` en un ciclo eterno. Convertir la celda en `'#'` corta ese ciclo.
- **La meta sí se revisa antes de marcar:** en `(R-1, C-1)` debes devolver `true` al llegar, no marcarla y seguir explorando (sería ilógico explorar "desde" la meta).
- **`(0,0)` muro o `(R-1,C-1)` muro:** el chequeo de muro los rechaza (ejemplo 4) sin exploración extra.
- **El `boolean` se propaga por OR:** cada rama hace `if (buscar(...)) return true;`. Si el `return` falta o se usa `buscar(...);` a secas, el resultado de la rama se pierde (lección repetida desde el 072).
- **No desmarcar (aquí conviene no hacerlo):** en un problema de "existe camino" basta marcar; desmarcar se usa en backtracking de *enumeración* (contar recorridos distintos), que es tema del siguiente ejercicio.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

```
static boolean buscar(char[][] mapa, int f, int c) {
    if (f < 0 || f >= filas || c < 0 || c >= columnas) return false;
    if (mapa[f][c] == '#') return false;
    if (f == filas - 1 && c == columnas - 1) return true;
    mapa[f][c] = '#';
    return buscar(mapa, f, c + 1)
        || buscar(mapa, f, c - 1)
        || buscar(mapa, f + 1, c)
        || buscar(mapa, f - 1, c);
}
```
El `||` encadena las 4 ramas y corta apenas alguna llegue: si derecha funciona, ni se exploran las demás. Prueba el ejemplo 1 y ve cómo el retroceso ("backtracking") vuelve a intentar otra casilla cuando una dirección no lleva al cofre.

</details>
