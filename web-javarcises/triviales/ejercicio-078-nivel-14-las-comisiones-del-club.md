# Ejercicio 078 - Las comisiones del club

**Nivel:** 14 - Experto I
**Tema(s):** **backtracking de enumeración**, combinaciones de `K` entre `N`, orden ascendente y lexicográfico, bucle dentro de la recursión
**Dificultad estimada:** ⭐⭐⭐⭐☆

## Enunciado

El club tiene `N` socios numerados de `1` a `N` y arma una comisión de **exactamente `K` miembros**. El programa lee `N` y `K` (con `1 <= K <= N`) e imprime **todas** las comisiones posibles, cada una con sus socios en orden ascendente dentro de la línea, y las líneas en **orden lexicográfico**. Al final, el total:

```
Total: T
```

El truco para generar sin repetir es que en cada posición se prueban los candidatos **empezando del número siguiente al elegido antes**: así nunca sale `2 1` ni se repite una combi en otro orden.

## Instrucciones

- Implementa **`static void combinar(int[] grupo, int pos)`**:
  - **Caso base:** si `pos == K`, imprime el grupo (los primeros `K` de `grupo`) y devuelve.
  - Si `pos == 0`, los candidatos van de `1` a `N`; si no, de `grupo[pos - 1] + 1` a `N` (para que cada combo quede ascendente).
  - Caso recursivo: `for (int c = desde; c <= N; c++) { grupo[pos] = c; combinar(grupo, pos + 1); }`.
- `main` llama `combinar(grupo, 0)` y cuenta las líneas impresas para el total.
- El "desmarcar" del backtracking aquí es **implícito**: la siguiente iteración del `for` sobreescribe `grupo[pos]`, no hace falta volver a `null`/`0`.
- El orden lexicográfico sale solo: probar candidatos de menor a mayor y la base ascendente lo garantizan.
- Verifica el total con la fórmula: `N! / (K! * (N-K)!)`.

## Firma sugerida

```java
import java.util.Scanner;

public class ComisionesDelClub {
    static int N, K;
    static int total = 0;

    public static void main(String[] args) {
        // Tu código aquí
    }

    static void combinar(int[] grupo, int pos) {
        // Tu código aquí
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1 (N = 4, K = 2):**
```
Entrada: N = 4, K = 2
Salida: 1 2
        1 3
        1 4
        2 3
        2 4
        3 4
        Total: 6
```

**Ejemplo 2 (N = 4, K = 3):**
```
Entrada: N = 4, K = 3
Salida: 1 2 3
        1 2 4
        1 3 4
        2 3 4
        Total: 4
```

**Ejemplo 3 (K = 1, solo uno a la vez):**
```
Entrada: N = 3, K = 1
Salida: 1
        2
        3
        Total: 3
```

**Ejemplo 4 (K = N, una sola comisión):**
```
Entrada: N = 3, K = 3
Salida: 1 2 3
        Total: 1
```

## Casos límite a considerar

- **La regla `desde = grupo[pos - 1] + 1`:** es la que evita combinaciones repetidas y desordenadas. Sin ella (probando siempre desde `1`), saldrían también `2 1` y cada combo duplicado; es el corazón de "combinación" vs "permutación".
- **El caso base es `pos == K`, no `pos == N`:** el grupo se completa cuando llevas `K` miembros; `N` solo acota los candidatos.
- **Los candidatos en `pos == 0` van de `1` a `N`:** si en la primera posición también empezaras en `grupo[-1] + 1`, tratarías de leer el índice `-1`.
- **El "desmarcar" es sobrescribir:** al volver de la recursión y avanzar `c`, `grupo[pos] = c` pisa el valor anterior. El `for` en sí es el retroceso; no necesita un paso de limpieza explícito (contraste con el laberinto del 077, donde se marcaba la casilla).
- **El total autoverifica:** para el ejemplo 2, `4!/(3!·1!) = 4`. Si tu contador no coincide, hay combos de más (repetidos) o de menos (candidatos saltados).
- **El arreglo `grupo` necesita tamaño `K`, no `N`:** cada posición guarda un candidato; con `K` celdas alcanza y el `if (pos == K)` no toca más allá.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

```
static void combinar(int[] grupo, int pos) {
    if (pos == K) {
        for (int i = 0; i < K; i++) System.out.print(grupo[i] + " ");
        System.out.println();
        total++;
        return;
    }
    int desde = (pos == 0) ? 1 : grupo[pos - 1] + 1;
    for (int c = desde; c <= N; c++) {
        grupo[pos] = c;
        combinar(grupo, pos + 1);
    }
}
```
Rastrea el ejemplo 1: primera posición prueba `1`, genera `1 2`, `1 3`, `1 4`; luego `grupo[0] = 2` y desde `3` salen `2 3`, `2 4`; etc. Nunca aparece `2 1`.

</details>
