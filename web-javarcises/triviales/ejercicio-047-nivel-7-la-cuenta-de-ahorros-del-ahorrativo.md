# Ejercicio 047 - La cuenta de ahorros del ahorrativo

**Nivel:** 7 - POO I
**Tema(s):** clases, atributos privados, **estado mutable** (el atributo cambia), métodos que validan reglas de negocio, encapsulamiento
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

El cliente "el Ahorrativo" abre una cuenta de ahorros cuyo saldo vive dentro de un objeto. Todas las operaciones pasan por métodos del objeto, que aplican **reglas de negocio**:

- **Depositar** un monto mayor a 0: suma al saldo. Monto `<= 0` se rechaza en silencio.
- **Retirar** un monto mayor a 0 **y menor o igual al saldo**: resta del saldo. Si no alcanza (o el monto es inválido), la operación **se rechaza** y el programa avisa.
- El saldo solo puede **leerse** mediante un getter (nadie modifica la cuenta por fuera).

El programa lee `N` (mayor a 0) y luego `N` pares de operación en una misma línea: la **letra** (`D` = depositar, `R` = retirar) y el **monto**. Al final muestra el saldo:

```
Saldo final: X.XX
```

## Instrucciones

- Crea una clase **`CuentaAhorros`** con:
  - Atributo privado `double saldo`.
  - Constructor `CuentaAhorros(double saldoInicial)`.
  - `void depositar(double monto)` que solo suma si `monto > 0`.
  - `boolean retirar(double monto)` que retorna `true` si retira (valida `monto > 0` y `monto <= saldo`), o `false` si rechaza (no modifica el saldo en ese caso).
  - `double getSaldo()`.
- `main` lee la letra con `next()` (toma el `char` en su posición `0`) y el monto con `nextDouble()`.
- Por cada retiro rechazado imprime: `Retiro rechazado: X.XX`.
- No accedas al saldo desde `main` directamente.
- La salida final es `Saldo final: S.SS` (dos decimales).

## Firma sugerida

```java
import java.util.Scanner;

public class CuentaDelAhorrativo {

    public static void main(String[] args) {
        // Tu código aquí
    }
}

class CuentaAhorros {
    private double saldo;

    public CuentaAhorros(double saldoInicial) {
        saldo = saldoInicial;
    }

    public void depositar(double monto) {
        // Tu código aquí
    }

    public boolean retirar(double monto) {
        return false; // reemplaza
    }

    public double getSaldo() {
        return saldo;
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1 (con rechazo por saldo):**
```
Entrada: 4
Entrada: D 100
Entrada: R 150
Entrada: D 200
Entrada: R 50
Salida: Retiro rechazado: 150.0
        Saldo final: 250.00
```

**Ejemplo 2 (depósitos inválidos ignorados):**
```
Entrada: 2
Entrada: D -50
Entrada: D 30
Salida: Saldo final: 30.00
```

**Ejemplo 3 (saldo inicial y retiro rechazado):**
```
Entrada: 1
Entrada: R 10
Salida: Retiro rechazado: 10.0
        Saldo final: 0.00
```

## Casos límite a considerar

- **Regla del retiro:** `monto <= saldo` es indispensable; sin esa validación el saldo queda negativo y la cuenta "inventa" dinero.
- **Monto `<= 0`:** un depósito de `-50` o un retiro de `0`/negativo deben rechazarse (ejemplo 2: el `-50` no suma).
- **El rechazo no cambia el estado:** en `retirar`, el `false` debe salir **antes** de tocar `saldo` (no restes y luego "arrepientas").
- **Leer el `char`:** `sc.next().charAt(0)` para la letra; `== 'D'` / `== 'R'`. Cualquier otra letra no hace nada.
- El `main` solo conversa con métodos públicos; `producto.saldo` sería un error de compilación.
- Acumulaciones repetidas: varias operaciones seguidas modifican el mismo atributo del objeto; es la primera vez que un objeto **cambia de estado**.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

En `retirar`: `if (monto <= 0 || monto > saldo) return false; saldo -= monto; return true;`. En `main`, cuando `retirar(...)` devuelve `false`, imprime el aviso con el monto. Prueba a llenar la tabla del ejemplo 1 paso a paso explorando cómo cambia `saldo` en cada llamada.

</details>
