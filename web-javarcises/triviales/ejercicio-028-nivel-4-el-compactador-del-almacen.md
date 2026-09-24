# Ejercicio 028 - El compactador del almacén

**Nivel:** 4 - Intermedio I
**Tema(s):** arrays, filtrado en el lugar (puntero de escritura), preservación del orden, conteo
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

En el almacén, la fila de cajas está representada en un array donde cada `0` significa un hueco (caja retirada). El jefe quiere **compactar** la fila: que todas las cajas restantes (valores distintos de 0) queden **juntas al principio, conservando su orden relativo**, y que los huecos queden al final. No se permite sacar cajas a otra fila: el arreglo se reorganiza "en el lugar".

El programa lee `N` (mayor a 0) valores de la fila, los compacta y responde cuántas cajas quedaron:

```
Quedan K cajas
```

Y luego imprime la fila resultante (los `N` valores) separados por espacios en una sola línea.

## Instrucciones

- Usa la clase `Scanner`.
- Guarda los `N` valores en `int[] fila`.
- Compacta **en el lugar**, **sin** crear un segundo array, **sin** `Arrays.sort` y **sin** colecciones.
- Conserva el **orden relativo** de las cajas (no las ordenes).
- Puedes usar dos índices (uno que recorre la fila y otro que marca dónde va la siguiente caja), o el método que prefieras, siempre que no requiera otro array.
- Después de compactar, cuenta las cajas y rellena con `0` los huecos restantes del final.
- La salida es:

```
Quedan K cajas
valores separados por espacio
```

## Firma sugerida

```java
import java.util.Scanner;

public class CompactadorDelAlmacen {
    public static void main(String[] args) {
        // Tu código aquí
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1:**
```
Entrada: 6
Entrada: 5
Entrada: 0
Entrada: 3
Entrada: 0
Entrada: 0
Entrada: 9
Salida: Quedan 3 cajas
        5 3 9 0 0 0
```

**Ejemplo 2 (todas vacías):**
```
Entrada: 4
Entrada: 0
Entrada: 0
Entrada: 0
Entrada: 0
Salida: Quedan 0 cajas
        0 0 0 0
```

**Ejemplo 3 (sin huecos):**
```
Entrada: 3
Entrada: 4
Entrada: 7
Entrada: 2
Salida: Quedan 3 cajas
        4 7 2
```

## Casos límite a considerar

- **Conservar el orden:** la fila `[7, 0, 2, 0, 5]` debe quedar `[7, 2, 5, 0, 0]`, no `[2, 5, 7, ...]` ni nada ordenado: los valores se desplazan, no se reordenan.
- **Escritura con lectura:** para no perder un valor antes de copiarlo, el índice de "dónde va la siguiente caja" avanza solo cuando colocas una caja. Si la misma posición ya es un valor != 0, no lo pises con un `0` antes de haberlo movido.
- **Huecos al final:** los `0` de los extremos elegidos deben llenarse hasta completar `N` posiciones.
- Todos cajas o todas huecos: fila sin cambios en el primer caso; **conteo 0** en el segundo.
- `N = 1`, tanto con `0` como con caja: el resultado no debe salirse del tamaño del array.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

Usa un puntero de escritura: `int escribir = 0; for (int i = 0; i < fila.length; i++) { if (fila[i] != 0) { fila[escribir] = fila[i]; if (escribir != i) fila[i] = 0; escribir++; } }`. Al terminar, `escribir` es la cantidad de cajas. Simula con `[7, 0, 2, 0, 5]` en papel.

</details>
