# Ejercicio 031 - Los bonos duplicados de la rifa

**Nivel:** 4 - Intermedio I
**Tema(s):** arrays, bucles anidados sobre un mismo array, detección y conteo de duplicados, orden de primera aparición
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

En una rifa se emiten `N` bonos numerados. El auditor quiere detectar si algún bono se **repitió** (la misma numeración impresa más de una vez es señal de manipulación). Para cada código que aparezca más de una vez, el sistema debe reportarlo **una sola vez**, en el orden de su **primera aparición**, junto con cuántas veces aparece.

El programa lee `N` (mayor a 0) y luego los `N` códigos, y muestra:

- Si no hay repetidos:
```
No hay duplicados
```
- Si los hay, una línea por cada código repetido:
```
Código X: Y veces
```

## Instrucciones

- Usa la clase `Scanner`.
- Guarda los `N` códigos en `int[] bonos`.
- Usa **bucles anidados** sobre el mismo array para contar apariciones: para cada posición `i` puedes contar cuántas veces aparece su valor en todo el array.
- Para no reportar el mismo código varias veces, asegúrate de reportarlo **solo desde su primera aparición** (por ejemplo, verificando primero que ese valor no aparezca en posiciones anteriores).
- Conteo y reporte en el orden de primera aparición.
- No uses colecciones (`HashMap`, `HashSet`, etc.) ni métodos de librerías.
- Cualquier código puede repetirse varias veces (más de 2), aunque el problema no lo prohíba.

## Firma sugerida

```java
import java.util.Scanner;

public class BonosDuplicados {
    public static void main(String[] args) {
        // Tu código aquí
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1 (un repetido):**
```
Entrada: 5
Entrada: 101
Entrada: 202
Entrada: 101
Entrada: 303
Entrada: 101
Salida: Código 101: 3 veces
```

**Ejemplo 2 (ninguno repetido):**
```
Entrada: 4
Entrada: 7
Entrada: 8
Entrada: 9
Entrada: 10
Salida: No hay duplicados
```

**Ejemplo 3 (varios repetidos):**
```
Entrada: 6
Entrada: 5
Entrada: 5
Entrada: 6
Entrada: 5
Entrada: 7
Entrada: 6
Salida: Código 5: 3 veces
        Código 6: 2 veces
```

**Ejemplo 4 (caso borde, todos iguales):**
```
Entrada: 3
Entrada: 9
Entrada: 9
Entrada: 9
Salida: Código 9: 3 veces
```

## Casos límite a considerar

- **El conteo de la primera pasada:** al contar también cuenta la posición `i` misma, pero eso es correcto porque el valor aparece al menos una vez.
- **No reportar duplicado tras duplicado:** una solución que por cada `i` cuente apariciones reportará el mismo código por cada una de sus copias. Debes reportar solo en la **primera aparición** (guardo un paso previo que examine las posiciones anteriores a `i`).
- **Conteo con bucles anidados:** el bucle interior recorre todo el array; no olvides usar `<=`/`<` del `length` correctamente.
- El **orden de reporte** sigue el de la primera aparición (5 antes que 6 en el ejemplo 3).
- `N = 1`: nunca hay duplicados.
- Códigos con valores negativos o `0` se comportan igual que cualquier otro número.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

Para cada `i`, primero comprueba si el valor ya apareció antes: `boolean primera = true; for (int j = 0; j < i; j++) if (bonos[j] == bonos[i]) primera = false;`. Esto se usa para que solo el primer 5 reporte y los `5` posteriores se omitan. Solo si es la primera aparición, cuenta todas las ocurrencias con otro `for` y reporta si el conteo supera 1.

</details>
