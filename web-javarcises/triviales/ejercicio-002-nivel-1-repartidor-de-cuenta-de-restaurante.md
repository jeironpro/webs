# Ejercicio 002 - Repartidor de cuenta en el restaurante

**Nivel:** 1 - Básico I
**Tema(s):** variables decimales (`double`), operadores aritméticos, porcentajes, formateo de salida
**Dificultad estimada:** ⭐⭐☆☆☆

## Enunciado

Un grupo de amigos cenó en un restaurante y quiere dividir la cuenta en partes iguales, incluyendo la propina. Elige a uno del grupo como tesorero: ese único programa debe hacer el cálculo por todos.

Escribe un programa que solicite por consola el **total de la cuenta**, el **número de comensales** y el **porcentaje de propina** (como número entero, ej. `10` para 10%), y muestre cuánto debe pagar cada persona, con dos decimales.

## Instrucciones

- Usa la clase `Scanner` para leer los tres valores.
- Usa tipo `double` para los montos (los porcentajes pueden generar decimales).
- El resultado debe mostrarse con dos decimales: `Cada persona paga: $X.XX`.
- Para formatear puedes usar `String.format("%.2f", valor)`.
- Considera que el número de comensales siempre es mayor que 0 (la validación de la división por cero es tema de niveles posteriores: puedes plantearlo en los casos límite, pero no lo implementes todavía).
- No uses librerías externas.

## Firma sugerida

```java
import java.util.Scanner;

public class RepartidorDeCuenta {
    public static void main(String[] args) {
        // Tu código aquí
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1:**
```
Entrada: 120.50
Entrada: 4
Entrada: 10
Salida: Cada persona paga: $33.14
```

**Ejemplo 2 (caso borde):**
```
Entrada: 0.00
Entrada: 3
Entrada: 15
Salida: Cada persona paga: $0.00
```

**Ejemplo 3 (propina 0%):**
```
Entrada: 100
Entrada: 2
Entrada: 0
Salida: Cada persona paga: $50.00
```

## Casos límite a considerar

- Comensales = 1 (la propina la paga una sola persona).
- Propina = 0%.
- Cuenta con decimales que generan muchos dígitos (ej. 95.99 / 7).
- Cuenta sin decimales (ej. `100` no es lo mismo que `100.0` a nivel de tipo: presta atención a cómo lee `Scanner` un entero vs un decimal).
- *Trampa de precisión:* sumas de decimales como `0.1 + 0.2` no dan exactamente `0.3` en `double`; por eso se usa el redondeo con dos decimales en la salida.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

Primero calcula el total con propina: `total = cuenta + cuenta * (propina / 100.0)`. Cuidado: si divides el porcentaje entre `100` (entero) obtienes 0. Usa `100.0` o convierte el porcentaje a `double`.

</details>
