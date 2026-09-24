# Ejercicio 045 - El checksum recursivo de la oficina de control

**Nivel:** 6 - Intermedio III
**Tema(s):** recursividad aplicada a la descomposición de dígitos, caso base, trazado de llamadas
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

La oficina de control fiscal valida los números de factura con un checksum: la **suma de los dígitos** del número (recuerda el ejercicio 018, pero esta vez resuelto **con recursión**). Para números negativos se usa el **valor absoluto**.

El programa lee un entero y muestra:

```
Suma de dígitos: X
```

Ejemplo: `328` → `3 + 2 + 8 = 13`.

## Instrucciones

- Define un método **recursivo** `static int sumaDigitos(int n)`:
  - **Caso base:** si `n` es `0`, devuelve `0`.
  - **Caso recursivo:** `(n % 10) + sumaDigitos(n / 10)` — el último dígito más la suma del resto.
- Normaliza el número con `Math.abs(...)` (en `main`, o al inicio del método) para que los negativos den el mismo checksum.
- El método **no debe** usar bucles.
- `main` lee el número, llama al método y muestra el resultado.
- La salida es exactamente una línea con el formato indicado.

## Firma sugerida

```java
import java.util.Scanner;

public class ChecksumRecursivo {
    public static void main(String[] args) {
        // Tu código aquí
    }

    static int sumaDigitos(int n) {
        return 0; // reemplaza
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1:**
```
Entrada: 328
Salida: Suma de dígitos: 13
```

**Ejemplo 2 (valor negativo):**
```
Entrada: -328
Salida: Suma de dígitos: 13
```

**Ejemplo 3 (la trampa del 0):**
```
Entrada: 0
Salida: Suma de dígitos: 0
```

**Ejemplo 4 (números con ceros):**
```
Entrada: 100
Salida: Suma de dígitos: 1
```

## Casos límite a considerar

- **Caso base con `0`:** si el caso base es `n < 10` y devuelve `n`, funciona también; pero debes decidir una sola definición y ser consistente. Con `n == 0 → 0`, el número `0` entra directo y devuelve `0` sin llamadas.
- **Negativos:** `-328 % 10` es `-8` en Java; sin `Math.abs`, el resultado se distorsiona. Normaliza antes de partir.
- **Reducción hacia el caso base:** `n / 10` reduce el número; cada llamada "come" un dígito. Con `n` de hasta ~10 dígitos, la profundidad de la pila es pequeña (no hay riesgo de desbordar la pila).
- Compara mentalmente con el ejercicio 018: mismo algoritmo, ahora "el bucle es la recursión".
- `100` suma solo `1` (los dos ceros aportan 0).

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

`if (n == 0) return 0; return n % 10 + sumaDigitos(n / 10);` (normaliza con `Math.abs` antes). Traza `sumaDigitos(328)`: `328 % 10` es `8`, así que queda `8 + sumaDigitos(32)` → `8 + (2 + sumaDigitos(3))` → `8 + 2 + 3` = **13**. El último dígito es el resto (`%`), no el primero.

</details>
