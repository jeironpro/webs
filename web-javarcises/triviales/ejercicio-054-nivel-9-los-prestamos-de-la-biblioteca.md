# Ejercicio 054 - Los préstamos de la biblioteca

**Nivel:** 9 - Colecciones
**Tema(s):** `ArrayList<String>`, adición dinámica, `size`, `indexOf`/`contains`, `remove`, iteración con `for-each`
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

La biblioteca lleva un registro dinámico de títulos prestados. A diferencia de un arreglo fijo, la lista **crece** a medida que se agregan préstamos, sin conocer la cantidad de antemano.

El programa lee títulos (uno por línea, con `nextLine()`), **agregándolos** a un `ArrayList`, hasta que llega la palabra `FIN`. Después lee un **título a buscar** y responde:

```
Total de préstamos: X
El buscado está en la posición K
```

(o `No está`). Luego debe **devolver** (quitar) **una sola ocurrencia** del buscado si existe, y mostrar:

```
Tras devolver uno, quedan Y títulos
lista actual (títulos restantes separados por espacios)
```

## Instrucciones

- Importa `java.util.ArrayList` (y opcionalmente declara como `List`).
- Lee títulos con `sc.nextLine()` en un bucle hasta el centinela `FIN`, agregando cada uno con `lista.add(titulo)`.
- Busca con `lista.indexOf(buscado)` (devuelve el índice o **`-1`** si no existe; la comparación interna ya usa `equals`, no `==`).
- Si está, quita **una sola** ocurrencia con `lista.remove(indice)` (o `remove(buscado)`).
- Imprime la posición en **base 1** (`indice + 1`).
- Recorre la lista final con un `for-each` para imprimir los títulos restantes.
- Considera que puede haber **títulos repetidos** en la lista.

## Firma sugerida

```java
import java.util.ArrayList;
import java.util.Scanner;

public class PrestamosDeLaBiblioteca {
    public static void main(String[] args) {
        // Tu código aquí
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1 (título encontrado):**
```
Entrada: Cien años de soledad
Entrada: La ciudad y los perros
Entrada: Rayuela
Entrada: FIN
Entrada: Rayuela
Salida: Total de préstamos: 3
        El buscado está en la posición 3
        Tras devolver uno, quedan 2 títulos
        Cien años de soledad La ciudad y los perros
```

**Ejemplo 2 (no está):**
```
Entrada: Hamlet
Entrada: FIN
Entrada: Otelo
Salida: Total de préstamos: 1
        No está
        Tras devolver uno, quedan 1 títulos
        Hamlet
```

**Ejemplo 3 (repetidos):**
```
Entrada: Don Quijote
Entrada: Don Quijote
Entrada: FIN
Entrada: Don Quijote
Salida: Total de préstamos: 2
        El buscado está en la posición 1
        Tras devolver uno, quedan 1 títulos
        Don Quijote
```

## Casos límite a considerar

- **`add` sin tamaño fijo:** a diferencia de un arreglo, no reservas capacidad; `ArrayList` crece solo. La lectura hasta `FIN` puede agregar 0, 1 o muchos elementos.
- **`==` vs `equals`:** `lista.indexOf()` usa `equals` internamente, así que no tienes que comparar manualmente; pero si compararas títulos con `==`, fallarían las coincidencias (objetos `String` distintos en memoria).
- **`-1` de `indexOf`:** si no está, `indexOf` devuelve `-1`; usarlo como índice para `remove` lanzaría `IndexOutOfBoundsException`. Guárdate por esa señal antes de quitar.
- **Repetidos:** `remove(buscado)` elimina la **primera** ocurrencia (ver ejemplo 3: queda un `Don Quijote`).
- **Base 1:** la posición se imprime como `indice + 1`.
- Si la lista queda vacía tras devolver, se imprime una línea sin títulos (sin errores).

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

`int idx = lista.indexOf(buscado); if (idx >= 0) { System.out.println("El buscado está en la posición " + (idx + 1)); lista.remove(idx); } else { System.out.println("No está"); }`. Para los títulos restantes: `for (String t : lista) System.out.print(t + " ");` seguido de un salto de línea.

</details>
