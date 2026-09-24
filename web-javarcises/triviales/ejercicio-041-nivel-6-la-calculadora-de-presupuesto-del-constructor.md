# Ejercicio 041 - La calculadora de presupuesto del constructor

**Nivel:** 6 - Intermedio III
**Tema(s):** sobrecarga de métodos (mismo nombre, distintas firmas), resolución de sobrecargas, `switch`, aritmética de figuras
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

El constructor estima presupuestos calculando el área de tres tipos de superficie: **cuadrado** (un lado), **rectángulo** (lado y otro lado) y **círculo** (radio, que puede ser decimal). Para no multiplicar nombres de funciones, el programa usa **el mismo método `area` con firmas distintas** (sobrecarga):

- `area(int lado)` → lado al cuadrado.
- `area(int ancho, int alto)` → producto de ambos.
- `area(double radio)` → π·radio² con `Math.PI` y `Math.pow`.

El programa lee un selector (`1`, `2` o `3`), luego los datos que pida cada figura y llama a la sobrecarga correspondiente:

```
Área: X.XX
```

## Instrucciones

- Define el método **sobrecargado** `static double area(...)` con las tres firmas indicadas (**no pueden diferir solo en el tipo de retorno**: eso no está permitido en Java; deben diferir en los parámetros).
- `main` lee el selector con `switch` (o `if` encadenado), lee los datos necesarios de esa figura y llama a la sobrecarga correcta.
- El resultado siempre se muestra con dos decimales: `Área: X.XX`.
- Si el selector no es 1, 2 o 3, muestra `Figura no válida` (sin calcular nada).
- No uses colecciones ni librerías externas.

## Firma sugerida

```java
import java.util.Scanner;

public class PresupuestoDelConstructor {
    public static void main(String[] args) {
        // Tu código aquí
    }

    static double area(int lado) {
        return 0; // reemplaza
    }

    static double area(int ancho, int alto) {
        return 0; // reemplaza
    }

    static double area(double radio) {
        return 0; // reemplaza
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1 (cuadrado):**
```
Entrada: 1
Entrada: 5
Salida: Área: 25.00
```

**Ejemplo 2 (rectángulo):**
```
Entrada: 2
Entrada: 4
Entrada: 6
Salida: Área: 24.00
```

**Ejemplo 3 (círculo):**
```
Entrada: 3
Entrada: 2.5
Salida: Área: 19.63
```

**Ejemplo 4 (caso borde, selector inválido):**
```
Entrada: 9
Salida: Figura no válida
```

## Casos límite a considerar

- **Firmas distintas:** los tres métodos comparten nombre `area` pero varían en la **cantidad** o **tipo** de parámetros. Dos firmas iguales que difieran solo en el tipo de retorno no compilan.
- **Resolución de la sobrecarga:** `area(2.5)` elige la versión `double`; `area(2, 3)` elige la versión `int`, `int` (Java prefiere la coincidencia más específica antes que convertir). Llamar `area(2)` sin versión propia rompería la ambigüedad… aquí sí existe `area(int)`, que es la correcta.
- **Selector de círculo:** el radio entra como `double`; si lo lees con `nextInt()` no podrás ingresar 2.5.
- Lado o ancho `0` o negativos: el área sale `0` o positiva (el cálculo funciona aunque no sea un valor realista: anótalo como limitación).
- π usa `Math.PI` (no inventar un valor propio) y `Math.pow(radio, 2)`.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

Dentro de cada método solo hay una operación sencilla: `return lado * lado;`, `return ancho * alto;` y `return Math.PI * Math.pow(radio, 2);`. Java decide cuál usar según los argumentos que le pases desde el `main`; asegúrate de que cada rama del `switch` pase los tipos correctos.

</details>
