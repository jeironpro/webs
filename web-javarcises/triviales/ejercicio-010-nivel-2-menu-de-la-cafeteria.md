# Ejercicio 010 - El menú de la cafetería

**Nivel:** 2 - Básico II
**Tema(s):** `switch`, casos (`case`/`break`/`default`), entrada por consola
**Dificultad estimada:** ⭐⭐☆☆☆

## Enunciado

Una cafetería universitaria tiene un menú semanal fijo que cambia de lunes a viernes. El cajero, en vez de memorizar el menú, teclea el **número del día** (del 1 al 5) y el sistema le muestra el plato que corresponde. Los fines de semana no hay servicio, y cualquier otro valor es un error de tipeo.

El sistema debe mostrar el plato del día:

- **1** → Milanesa con puré
- **2** → Ensalada de pollo
- **3** → Guiso de lentejas
- **4** → Pasta con salsa roja
- **5** → Cazuela de carne

Cualquier otro valor (0, 6, 7, negativos…) debe mostrar el aviso `Fin de semana, no hay servicio`.

## Instrucciones

- Usa la clase `Scanner` para leer el número del día.
- Resuelve la selección con una estructura **`switch`**, no con `if` encadenados.
- Incluye `break` en cada caso y un caso **`default`** para todo lo demás.
- La salida debe ser una sola línea: `Hoy toca: X` o `Fin de semana, no hay servicio`.

## Firma sugerida

```java
import java.util.Scanner;

public class MenuDeLaCafeteria {
    public static void main(String[] args) {
        // Tu código aquí
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1:**
```
Entrada: 3
Salida: Hoy toca: Guiso de lentejas
```

**Ejemplo 2 (fin de semana):**
```
Entrada: 6
Salida: Fin de semana, no hay servicio
```

**Ejemplo 3 (caso borde):**
```
Entrada: 0
Salida: Fin de semana, no hay servicio
```

## Casos límite a considerar

- **La trampa del `fall-through`:** si olvidas un `break`, el programa sigue ejecutando los casos siguientes y puede imprimir varios platos (o el `default`) a la vez. En Java los casos caen hacia abajo si no se cortan.
- `default` debe cubrir 0, 6, 7, números negativos y cualquier otro entero no contemplado.
- El día 5 debe mostrar únicamente su plato, sin arrastrar el `default`.
- Entradas negativas (`-1`) deben caer en `default`.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

Después del `break` del último caso (día 5), agrega `default`. Recuerda que `switch` evalúa un entero y cada `case` es un valor concreto; el `default` atrapa todo lo que no coincida.

</details>
