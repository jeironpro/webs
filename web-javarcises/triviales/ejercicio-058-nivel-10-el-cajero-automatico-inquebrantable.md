# Ejercicio 058 - El cajero automático inquebrantable

**Nivel:** 10 - Manejo de errores
**Tema(s):** `try`/`catch`, `InputMismatchException`, validación de entrada en bucle, limpieza del token inválido
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

El cajero automático pide un PIN numérico (`1234`). Los usuarios de la vida real escriben letras, decimales o quedan en el teclado; y el cajero **nunca debe cerrarse**: cada entrada inválida muestra un aviso y vuelve a preguntar, indefinidamente, hasta que el PIN sea correcto.

- Si lo escrito **no es un entero** → imprime `PIN inválido` y vuelve a preguntar.
- Si es un entero **distinto de 1234** → `PIN incorrecto` y vuelve a preguntar.
- Si es **1234** → `Acceso concedido` y termina.

## Instrucciones

- Usa la clase `Scanner`.
- Lee el PIN numérico con `nextInt()` **dentro de un `try`**, y captura **`InputMismatchException`** en el `catch`:
  - Al capturar, **limpia el token inválido** llamando a `sc.next()` (el `Scanner` deja el texto malo sin consumir; sin ese limpiado, el bucle se repetiría con el mismo valor **para siempre**).
- Envuelve la lectura en un bucle `while` que solo termina con el PIN correcto.
- **No uses `hasNextInt()` ni `nextLine() + parseInt`**: la práctica pedida es el manejo de la excepción.
- Considera que el programa puede recibir cualquier texto, incluidas líneas vacías.

## Firma sugerida

```java
import java.util.InputMismatchException;
import java.util.Scanner;

public class CajeroInquebrantable {
    public static void main(String[] args) {
        // Tu código aquí
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1 (cartas mixtas):**
```
Entrada: hola
Entrada: 3.14
Entrada: 1234
Salida: PIN inválido
        PIN inválido
        Acceso concedido
```

**Ejemplo 2 (PIN equivocado):**
```
Entrada: 9999
Entrada: abcd
Entrada: 1234
Salida: PIN incorrecto
        PIN inválido
        Acceso concedido
```

**Ejemplo 3 (directo):**
```
Entrada: 1234
Salida: Acceso concedido
```

## Casos límite a considerar

- **El token inválido no se consume solo:** `sc.nextInt()` ante `"hola"` lanza la excepción y **deja `"hola"` en el buffer**. Si no haces `sc.next()` en el `catch`, la siguiente iteración vuelve a intentar el mismo `"hola"` → bucle infinito de `PIN inválido`.
- **`nextInt` solo acepta enteros:** un `3.14` también dispara `InputMismatchException` (no aguanta el punto), así que cae en "PIN inválido".
- No confundas "PIN incorrecto" (es un entero válido, pero no coincide) con "PIN inválido" (ni siquiera es un entero): son dos ramas distintas.
- Líneas vacías o signos raros: igual que cualquier texto no numérico → "PIN inválido".
- El `catch` debe agarrar **solo** la lectura; si el bloque `try` abarcara también la comparación de un valor no asignado, el compilador reclamaría "variable may not have been initialized".

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

```
int pin = -1;
while (pin != 1234) {
    try {
        pin = sc.nextInt();
        if (pin != 1234) System.out.println("PIN incorrecto");
    } catch (InputMismatchException e) {
        sc.next();                // descarta el token inválido
        System.out.println("PIN inválido");
    }
}
System.out.println("Acceso concedido");
```
Inicializar `pin` en `-1` evita el error de variable no inicializada.

</details>
