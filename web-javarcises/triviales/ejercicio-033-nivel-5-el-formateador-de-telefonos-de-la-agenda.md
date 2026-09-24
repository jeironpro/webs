# Ejercicio 033 - El formateador de teléfonos de la agenda

**Nivel:** 5 - Intermedio II
**Tema(s):** métodos de `String` (`substring`, `length`), separación de texto, validación de entrada, ceros a la izquierda
**Dificultad estimada:** ⭐⭐☆☆☆

## Enunciado

La agenda de clientes de la inmobiliaria guarda los teléfonos como un solo bloque de **10 dígitos** (ej. `8123456789`). Para imprimir tarjetas, el programa debe reescribirlos en el formato amigable:

```
(812) 345-6789
```

Los diez dígitos se separan así: los primeros **3** van entre paréntesis, los siguientes **3** después, y los últimos **4** separados con un guion.

El programa lee el número como un bloque de 10 caracteres y muestra el formato. Si el bloque no tiene exactamente 10 caracteres, avisa:

```
Número inválido
```

**Problema especial:** algunos clientes tienen el teléfono empezando en `0` (ej. `0912345678`). Si el número se leyera como entero, ese `0` inicial se perdería. Por eso debe tratarse como **texto**.

## Instrucciones

- Usa `Scanner.nextLine()` para leer el bloque (no `nextInt()`).
- Revisa con `length()` que tenga exactamente 10 caracteres; si no, imprime `Número inválido`.
- Separa el texto con `substring(...)`: grupo área (0-2), grupo medio (3-5) y grupo final (6-9), teniendo en cuenta que `substring` excluye el índice final.
- La salida es una sola línea: el número formateado o `Número inválido`.
- No conviertas el texto a número ni uses librerías de formato.

## Firma sugerida

```java
import java.util.Scanner;

public class FormateadorDeTelefonos {
    public static void main(String[] args) {
        // Tu código aquí
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1:**
```
Entrada: 8123456789
Salida: (812) 345-6789
```

**Ejemplo 2 (la trampa del cero inicial):**
```
Entrada: 0912345678
Salida: (091) 234-5678
```

**Ejemplo 3 (número de largo incorrecto):**
```
Entrada: 12345
Salida: Número inválido
```

**Ejemplo 4 (caso borde, con ceros en el medio):**
```
Entrada: 0000000000
Salida: (000) 000-0000
```

## Casos límite a considerar

- **El cero inicial se pierde si usas `nextInt()`:** un teléfono como `0912345678` entraría como `912345678` (9 dígitos), y el `substring` se saldría de rango. Lee como texto y verifica con `length()`.
- **`substring` es extremo-derecho exclusivo:** `substring(3, 6)` toma las posiciones 3, 4 y 5. Confundirlo genera grupos de largos incorrectos.
- Largo distinto de 10 (más o menos): nunca debe lanzar `StringIndexOutOfBoundsException`, sino avisar `Número inválido`.
- Un bloque de exactamente 10 caracteres pero con letras o símbolos, aceptado tal cual (la validación de caracteres es tema de niveles posteriores).
- Todos los ceros formatean bien (`(000) 000-0000`).

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

`if (num.length() != 10) { System.out.println("Número inválido"); } else { String a = num.substring(0, 3); String b = num.substring(3, 6); String c = num.substring(6, 10); System.out.println("(" + a + ") " + b + "-" + c); }` — todo con concatenación, sin `printf`.

</details>
