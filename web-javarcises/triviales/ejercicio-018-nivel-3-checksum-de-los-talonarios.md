# Ejercicio 018 - El checksum de los talonarios

**Nivel:** 3 - Básico III
**Tema(s):** bucle `while` con descomposición de dígitos (`%` y `/`), contador, valor absoluto (`Math.abs`)
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

Una papelería imprime talonarios numerados y, como control interno contra falsificaciones, calcula un **checksum**: la suma de los dígitos del número del talón, impresa al pie. Además imprime cuántos dígitos tiene el número.

El cajero teclea el número del talón (puede ser un entero positivo o negativo; para el checksum se usa su **valor absoluto**) y el sistema responde:

```
Checksum: S - Dígitos: C
```

Por ejemplo, para `328` la suma es `3 + 2 + 8 = 13` y tiene `3` dígitos.

## Instrucciones

- Usa la clase `Scanner`.
- Descompón el número **dígito a dígito dentro de un bucle `while`**, usando `% 10` para extraer el último dígito y `/ 10` para descartarlo, hasta que el número sea `0`.
- Convierte el número a positivo con `Math.abs(...)` antes de empezar, para que los valores negativos den el mismo checksum (ej. `-328` → también 13).
- Lleva un **acumulador** para la suma y un **contador** para los dígitos.
- No uses `String`, conversiones a texto ni `Math.log10` para contar los dígitos.
- La salida es exactamente una línea con el formato indicado.

## Firma sugerida

```java
import java.util.Scanner;

public class ChecksumTalonarios {
    public static void main(String[] args) {
        // Tu código aquí
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1:**
```
Entrada: 328
Salida: Checksum: 13 - Dígitos: 3
```

**Ejemplo 2 (número negativo):**
```
Entrada: -328
Salida: Checksum: 13 - Dígitos: 3
```

**Ejemplo 3 (ceros en el número):**
```
Entrada: 100
Salida: Checksum: 1 - Dígitos: 3
```

**Ejemplo 4 (caso borde):**
```
Entrada: 0
Salida: Checksum: 0 - Dígitos: 0
```

## Casos límite a considerar

- **Entrada `0`:** el bucle `while (num != 0)` no entra nunca, así que suma y conteo quedan en `0`. Es un resultado válido, pero piensa: ¿debería el 0 contar como "un dígito"? Anótalo como caso discutible en la vida real.
- **Negativos:** sin `Math.abs`, `-328 % 10` da `-8` y el checksum sale mal. Normaliza antes de descomponer.
- **Ceros intermedios y finales** (`100`, `205`): se procesan solos gracias a `%` y `/`; no hay que tratarlos aparte.
- Número máximo de un `int`: la descomposición con `/` lo reduce hasta 0 sin desbordes.
- Cómo modifica la variable original: al final del bucle el número vale `0`; si lo necesitas después, guárdalo en una copia antes.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

Patrón estándar: `int num = Math.abs(leido); while (num != 0) { suma += num % 10; digitos++; num /= 10; }`. Prueba con `100` a mano: entra con 100, suma 0, dígito 0; luego 10, luego 1 — los dos ceros se suman sin problema.

</details>
