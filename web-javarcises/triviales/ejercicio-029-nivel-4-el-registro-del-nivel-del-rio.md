# Ejercicio 029 - El vigilante del nivel del río

**Nivel:** 4 - Intermedio I
**Tema(s):** arrays, comparación de elementos **consecutivos**, diferencias entre vecinos, contador y máximo de una magnitud derivada
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

La defensa civil monitorea un río y guarda, hora a hora, el nivel medido en centímetros en un array cronológico. Para el informe diario necesitan dos datos:

- Cuántas horas el nivel **subió** respecto a la hora anterior.
- La **mayor subida en una sola hora** (la mayor diferencia positiva entre dos horas consecutivas).

Si el nivel bajó o se mantuvo igual, esa hora no es una subida. Si en todo el día nunca subió, la mayor subida es `0 cm` (nadie sube).

El programa lee `N` (mayor a 0) niveles y reporta ambos valores.

## Instrucciones

- Usa la clase `Scanner`.
- Guarda los `N` niveles en `int[] niveles`.
- Recorre el array **comparando cada elemento con el anterior** (`niveles[i]` contra `niveles[i - 1]`), empezando desde la segunda posición.
- Cuenta como subida solo las diferencias **estrictamente positivas**.
- Lleva una variable con la **mayor subida** vista (inicializada y actualizada en `0` si no quieres complicaciones con negativos).
- No uses colecciones ni métodos de librerías para estas estadísticas.
- La salida tiene dos líneas:

```
Subidas: X
Mayor subida en una hora: Y cm
```

## Firma sugerida

```java
import java.util.Scanner;

public class VigilanteDelRio {
    public static void main(String[] args) {
        // Tu código aquí
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1:**
```
Entrada: 5
Entrada: 120
Entrada: 135
Entrada: 130
Entrada: 158
Entrada: 158
Salida: Subidas: 2
        Mayor subida en una hora: 28 cm
```

**Ejemplo 2 (nunca sube):**
```
Entrada: 4
Entrada: 90
Entrada: 85
Entrada: 85
Entrada: 70
Salida: Subidas: 0
        Mayor subida en una hora: 0 cm
```

**Ejemplo 3 (caso borde, una sola medición):**
```
Entrada: 1
Entrada: 100
Salida: Subidas: 0
        Mayor subida en una hora: 0 cm
```

## Casos límite a considerar

- **El bucle empieza en 1:** la primera medición no tiene "hora anterior"; si empiezas el recorrido en `0`, `niveles[-1]` no existe (error de índice).
- **`off-by-one` del máximo:** la mayor subida se calcula con `niveles[i] - niveles[i - 1]`, considerando sólo cuando la diferencia es positiva y supera a la mayor vista.
- **Subidas contiguas vs. gran salto:** dos subidas pequeñas seguidas y una grande; el contador suma las tres, el máximo se queda con la grande.
- Nivel igual (`158`, `158`): no es subida (`>` estricto).
- **`N = 1`:** no hay parejas; ambas cifras en 0, sin errores de índice.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

`for (int i = 1; i < niveles.length; i++) { int dif = niveles[i] - niveles[i - 1]; if (dif > 0) { subidas++; if (dif > mayorSubida) mayorSubida = dif; } }`. Con `int mayorSubida = 0;` el caso "nunca sube" queda resuelto sin condiciones extra.

</details>
