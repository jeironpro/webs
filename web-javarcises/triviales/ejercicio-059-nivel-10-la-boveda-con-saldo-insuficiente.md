# Ejercicio 059 - La bóveda con `SaldoInsuficienteException`

**Nivel:** 10 - Manejo de errores
**Tema(s):** **excepciones personalizadas** (`extends Exception`), `throw` y `throws`, excepción checked vs unchecked, múltiples `catch`
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

La bóveda del banco permite retirar, pero con una regla irrompible: **no se puede retirar más de lo que hay**. En vez de rechazar "en silencio" (como en el ejercicio 047), ahora el método de retiro **lanza una excepción propia** cuando el saldo no alcanza, y el programa que la llama la **captura** y avisa.

Se usa además una segunda regla: retirar un monto **`<= 0`** lanza una `IllegalArgumentException` (la excepción estándar para "argumento inválido"). El cajero captura cada una con su propio `catch`, muestra su mensaje y sigue con la siguiente operación.

El programa lee el **saldo inicial**, luego `N` (cantidad de retiros) y los `N` montos. Por cada retiro capturado imprime el mensaje de la excepción, y al final:

```
Saldo final: X.XX
```

## Instrucciones

- Crea una **excepción personalizada** en su propia clase:
  ```java
  class SaldoInsuficienteException extends Exception {
      public SaldoInsuficienteException(String mensaje) {
          super(mensaje);
      }
  }
  ```
- En la clase de la cuenta, el método `void retirar(double monto)` debe declarar **`throws SaldoInsuficienteException`** y:
  - `if (monto <= 0)` → lanza `IllegalArgumentException` (no se declara en `throws`: es unchecked).
  - `if (monto > saldo)` → lanza `throw new SaldoInsuficienteException("Saldo insuficiente para retirar " + monto)`.
  - Si pasa ambas validaciones, resta al saldo.
- En `main`, cada retiro se hace dentro de un `try` con **dos `catch`**: uno para `SaldoInsuficienteException` y otro para `IllegalArgumentException`; imprime `excepcion.getMessage()`.
- Al final muestra el saldo con dos decimales.

## Firma sugerida

```java
import java.util.Scanner;

public class BovedaConExcepcion {
    public static void main(String[] args) {
        // Tu código aquí
    }
}

class CuentaConExcepcion {
    private double saldo;

    public CuentaConExcepcion(double saldoInicial) {
        saldo = saldoInicial;
    }

    public double getSaldo() {
        return saldo;
    }

    public void retirar(double monto) throws SaldoInsuficienteException {
        // Tu código aquí
    }
}

class SaldoInsuficienteException extends Exception {
    public SaldoInsuficienteException(String mensaje) {
        super(mensaje);
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1 (múltiples capturas):**
```
Entrada: 100
Entrada: 4
Entrada: 60
Entrada: 150
Entrada: -5
Entrada: 40
Salida: Saldo insuficiente para retirar 150.0
        monto inválido: -5.0
        Saldo final: 0.00
```

**Ejemplo 2 (todo correcto):**
```
Entrada: 1000
Entrada: 2
Entrada: 200
Entrada: 100
Salida: Saldo final: 700.00
```

**Ejemplo 3 (sin retiros):**
```
Entrada: 500
Entrada: 0
Salida: Saldo final: 500.00
```

## Casos límite a considerar

- **Checked vs unchecked:** `SaldoInsuficienteException` (extends `Exception`) es **checked**: el método debe declararla con `throws` y quien la invoca debe `catch`-arla o declararla, o no compila. `IllegalArgumentException` es **unchecked** (extiende `RuntimeException`): no requiere `throws`, solo se lanza.
- **El `throw` ocurre antes de tocar el saldo:** al retirar de más, la excepción sale antes del `saldo -= monto`, así la cuenta no queda en negativo.
- **Múltiples `catch`:** Java intenta cada bloque según el tipo; son excepciones distintas, así que el orden entre ellas no importa (sí importaría si una fuera superclase de la otra).
- **`getMessage()`:** el mensaje que imprimes es el `String` que le pasaste al construir la excepción (via `super(mensaje)`).
- Monto límite exacto: retirar **exactamente** el saldo es válido (solo lanza si `monto > saldo`).
- Sin retiros (`N = 0`): solo sale el saldo final.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

En `retirar`: `if (monto <= 0) throw new IllegalArgumentException("monto inválido: " + monto); if (monto > saldo) throw new SaldoInsuficienteException("Saldo insuficiente para retirar " + monto); saldo -= monto;`. En `main`: `try { cuenta.retirar(x); } catch (SaldoInsuficienteException e) { System.out.println(e.getMessage()); } catch (IllegalArgumentException e) { System.out.println(e.getMessage()); }`.

</details>
