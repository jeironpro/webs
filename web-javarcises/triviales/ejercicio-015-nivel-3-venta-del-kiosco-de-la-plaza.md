# Ejercicio 015 - La venta del kiosco de la plaza

**Nivel:** 3 - Básico III
**Tema(s):** bucle `do-while`, valor centinela, `switch` como acumulador, entrada por consola
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

El kiosco de la plaza atiende mientras el dueño registra cada venta al final del día, así queda la caja cuadrada. El programa debe ir **sumando el monto** de cada venta y contar cuántos artículos se vendieron. Cuando el dueño ya no tiene más ventas, teclea **0** para cerrar la caja y ver el resumen.

Los productos y sus precios:

| Código | Producto | Precio |
|---|---|---|
| 1 | Café tinto | $2.500 |
| 2 | Plato del día | $6.000 |
| 3 | Refresco | $2.000 |
| 4 | Empanada | $1.500 |
| 5 | Postre casero | $3.000 |

Al terminar (código 0), el programa muestra:

```
Resumen: X artículos vendidos. Total: $Y
```

## Instrucciones

- Usa la clase `Scanner` y lee los códigos uno por uno.
- Resuelve el bucle con un **`do-while`**: el kiosco siempre procesa al menos una vez, y termina cuando el código es **0**.
- Usa un **`switch`** para buscar el precio de cada producto y acumularlo (el `switch` y los bucles juntos).
- El código **0 no es un producto**: debe terminar la caja **sin** agregar nada al total **ni** incrementar los artículos.
- Cualquier otro código distinto de 0-5 no debe sumar nada (puede imprimir un aviso, pero no debe romper ni terminar la caja).
- La salida final es exactamente una línea con el formato indicado.

## Firma sugerida

```java
import java.util.Scanner;

public class VentaDelKiosco {
    public static void main(String[] args) {
        // Tu código aquí
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1:**
```
Entrada: 1
Entrada: 3
Entrada: 2
Entrada: 0
Salida: Resumen: 3 artículos vendidos. Total: $10500
```

**Ejemplo 2 (cerrar sin comprar):**
```
Entrada: 0
Salida: Resumen: 0 artículos vendidos. Total: $0
```

**Ejemplo 3 (código desconocido):**
```
Entrada: 1
Entrada: 9
Entrada: 4
Entrada: 0
Salida: Resumen: 2 artículos vendidos. Total: $4000
```

## Casos límite a considerar

- **Semántica del `do-while`:** la caja se procesa aunque la primera entrada sea `0`. Ese 0 debe interpretarse como "cerrar", no como venta: al final no debe sumar y debe imprimir `0 artículos vendidos`.
- **El 0 no debe caer en el acumulador:** muchos errores comunes conciben el centinela como un producto más. Verifica que `Total: $0` y `0 artículos` salgan igual de bien que el ejemplo 2.
- Códigos negativos o > 5 (ej. `9`, `-2`): no suman, pero el `switch` no debe lanzar excepciones ni cortar la caja.
- El bucle debe terminar **solo** con 0: ningún código inválido debe cerrar la caja antes de tiempo.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

Alternativa limpia: dentro del `do` lee el código y, `if (codigo == 0) break;`, y después deja que el `switch` haga la suma vía `total += precio`. Así el 0 nunca llega a los casos de producto y el `do-while` se apoya en la condición de salida `codigo != 0`.

</details>
