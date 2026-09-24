# Ejercicio 030 - La rotación del turno de reparto

**Nivel:** 4 - Intermedio I
**Tema(s):** arrays, desplazamiento de elementos, orden de escritura (de atrás hacia adelante), valor guardado antes de sobreescribir
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

Una empresa de mensajería tiene la lista de repartidores en un array en el orden de su ruta. Cada día **rota** la lista así: el repartidor **de la última posición pasa al primer puesto** y todos los demás se corren **una posición a la derecha**. Es un turno circular: la ruta nunca pierde repartidores.

Por ejemplo, con `[Ana, Luis, Ro, My]` el día siguiente queda `[My, Ana, Luis, Ro]`.

El programa lee `N` (mayor a 0) repartidores (nombres de una sola palabra) y muestra la lista rotada una vez.

## Instrucciones

- Usa la clase `Scanner`.
- Guarda los nombres en `String[] repartidores`.
- Realiza la rotación **en el lugar** (sin un segundo array, sin `System.arraycopy`, sin colecciones).
- **Guarda primero el último elemento** en una variable temporal.
- Mueve los elementos de atrás hacia adelante: `repartidores[i] = repartidores[i - 1]` recorriendo en **orden descendente**, y al final coloca el guardado en la posición `0`.
- No uses un `for` que recorra de adelante hacia atrás para mover (analiza por qué fallaría).
- Imprime la lista resultante en una sola línea, separada por espacios.

## Firma sugerida

```java
import java.util.Scanner;

public class RotacionDelTurno {
    public static void main(String[] args) {
        // Tu código aquí
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1:**
```
Entrada: 4
Entrada: Ana
Entrada: Luis
Entrada: Ro
Entrada: My
Salida: My Ana Luis Ro
```

**Ejemplo 2:**
```
Entrada: 3
Entrada: Pe
Entrada: Si
Entrada: Ka
Salida: Ka Pe Si
```

**Ejemplo 3 (caso borde, un solo repartidor):**
```
Entrada: 1
Entrada: Uno
Salida: Uno
```

## Casos límite a considerar

- **La trampa del orden de escritura:** si copias de adelante hacia atrás (`repartidores[i] = repartidores[i - 1]` con `i` creciente), el valor de `repartidores[0]` ya fue sobreescrito antes de usarse y el array se llena de copias del mismo nombre. El desplazamiento debe hacerse de atrás hacia adelante.
- **El último elemento:** si no lo guardas antes de empezar a mover, lo pierdes al sobreescribirlo con `repartidores[N - 2]`.
- `N = 1`: `for (int i = repartidores.length - 1; i >= 1; i--)` no se ejecuta y el array queda igual.
- `off-by-one`: el último índice es `length - 1`; la posición final a escribir es `0`.
- Nombres de más de una palabra quedan fuera de alcance (entrada asumida de `next()`): anótalo.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

`String aux = repartidores[repartidores.length - 1]; for (int i = repartidores.length - 1; i >= 1; i--) { repartidores[i] = repartidores[i - 1]; } repartidores[0] = aux;`. La clave es que al ir hacia atrás, el valor que se sobreescribe aún no se necesita porque ya fue copiado.

</details>
