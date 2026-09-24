# Ejercicio 003 - El número de la suerte

**Nivel:** 1 - Básico I
**Tema(s):** variables, operadores aritméticos, descomposición de dígitos, orden de operaciones
**Dificultad estimada:** ⭐⭐☆☆☆

## Enunciado

Un bazar de barrio vende boletos de rifa numerados con tres dígitos. El dueño, supersticioso, regala un dulce a quien le diga, de memoria y sin calculadora, su **número espejo** (el número formado al invertir los dígitos) y la **suma de sus dígitos**. Como no quiere que nadie le gane el dulce, quiere automatizarlo.

Escribe un programa que lea un número entero de tres dígitos (entre 100 y 999) y muestre:

```
Número espejo: XYZ
Suma de dígitos: S
```

## Instrucciones

- Usa la clase `Scanner` para leer el número.
- Debes **descomponer el número en sus dígitos** usando solo `%` y `/` (centenas, decenas y unidades), guardándolos en variables.
- No uses bucles (aún no toca ese tema).
- No uses `String`, `Math` ni conversiones a texto para invertir el número.
- Considera que el número siempre es positivo y de tres dígitos (la validación de entrada es tema de niveles posteriores; puedes anotarlo en los casos límite, pero no lo implementes).

## Firma sugerida

```java
import java.util.Scanner;

public class NumeroDeLaSuerte {
    public static void main(String[] args) {
        // Tu código aquí
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1:**
```
Entrada: 745
Salida: Número espejo: 547
        Suma de dígitos: 16
```

**Ejemplo 2 (caso borde):**
```
Entrada: 100
Salida: Número espejo: 1
        Suma de dígitos: 1
```

**Ejemplo 3 (dígito cero en las unidades):**
```
Entrada: 120
Salida: Número espejo: 21
        Suma de dígitos: 3
```

## Casos límite a considerar

- Números con cero en alguna posición (ej. `100`, `120`): el espejo pierde los ceros al frente.
- Dígitos repetidos (ej. `111` → espejo `111`, suma `3`).
- Extremos del rango: `100` y `999`.
- Número con unidades 0: al armar el espejo `unidades * 100 + ...`, presta atención a que el cero no se "cae" en el cálculo, aunque la salida lo oculte.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

Para sacar las unidades usa `n % 10`; para las decenas, primero divide entre 10 y usa `% 10` de nuevo; para las centenas, divide entre 100. Luego arma el espejo combinando los dígitos en orden inverso.

</details>
