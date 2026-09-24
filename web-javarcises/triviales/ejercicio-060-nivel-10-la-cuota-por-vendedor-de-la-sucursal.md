# Ejercicio 060 - La cuota por vendedor de la sucursal

**Nivel:** 10 - Manejo de errores
**Tema(s):** `try`/`catch` dentro de un bucle, `ArithmeticException` (dividir por cero), dependencia del tipo en la división
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

La gerencia divide las **ventas** de cada sucursal entre su número de **vendedores** para obtener la "cuota por vendedor". El problema: hay sucursales registradas con 0 vendedores (dato pendiente de cargar). El programa **no debe detenerse** cuando encuentre una: esa sucursal se reporta como sin cuota y se sigue con las demás.

El programa lee `N` (mayor a 0) sucursales, y por cada una las **ventas** y los **vendedores** (enteros). Por cada sucursal muestra:

```
Sucursal K: cuota V
```
o, si no hay vendedores:
```
Sucursal K: sin vendedores, no hay cuota
```

## Instrucciones

- Usa la clase `Scanner` y lee ventas y vendedores con `nextInt()`.
- Calcula la cuota con **división de enteros**: `int cuota = ventas / vendedores;`.
- Envuelve el cálculo **dentro de un `try`/`catch` ubicado dentro del bucle** (para poder continuar con la siguiente sucursal): captura **`ArithmeticException`** y en el `catch` imprime el aviso de "sin vendedores".
- Si no hay excepción, imprime la línea de cuota.
- No uses `if` para comprobar `vendedores == 0` antes de dividir: la práctica pedida es capturar la excepción.

## Firma sugerida

```java
import java.util.Scanner;

public class CuotaPorVendedor {
    public static void main(String[] args) {
        // Tu código aquí
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1 (una sucursal sin vendedores en medio):**
```
Entrada: 3
Entrada: 5000
Entrada: 4
Entrada: 9000
Entrada: 0
Entrada: 7000
Entrada: 2
Salida: Sucursal 1: cuota 1250
        Sucursal 2: sin vendedores, no hay cuota
        Sucursal 3: cuota 3500
```

**Ejemplo 2 (solo una):**
```
Entrada: 1
Entrada: 1000
Entrada: 1
Salida: Sucursal 1: cuota 1000
```

**Ejemplo 3 (empieza sin vendedores):**
```
Entrada: 2
Entrada: 8000
Entrada: 0
Entrada: 10000
Entrada: 5
Salida: Sucursal 1: sin vendedores, no hay cuota
        Sucursal 2: cuota 2000
```

## Casos límite a considerar

- **`ArithmeticException` es de enteros:** dividir `9000 / 0` con `int` lanza la excepción y ahí la capturas. Si en cambio usaras `double` (ej. `9000.0 / 0`), Java **no lanza** nada: devuelve `Infinity`. El tipo cambia el comportamiento por completo: esta es la lección clave.
- **El `catch` dentro del bucle:** si el `try` envolviera todo el `for`, la primera sucursal sin vendedores cortaría a todas las siguientes. El `try`/`catch` va **dentro** de la iteración para poder continuar.
- La lectura no falla: `nextInt()` para `0` es válido; la excepción solo ocurre al dividir.
- Sucursal con 0 ventas pero vendedores > 0: cuota `0` normalmente (sin excepción).
- El mensaje de la excepción por defecto (`/ by zero`) no debe imprimirse: captura y muestra tu propio aviso.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

```
for (int i = 1; i <= N; i++) {
    int ventas = sc.nextInt();
    int vendedores = sc.nextInt();
    try {
        int cuota = ventas / vendedores;
        System.out.println("Sucursal " + i + ": cuota " + cuota);
    } catch (ArithmeticException e) {
        System.out.println("Sucursal " + i + ": sin vendedores, no hay cuota");
    }
}
```
Las posiciones se numeran desde 1 en la salida.

</details>
