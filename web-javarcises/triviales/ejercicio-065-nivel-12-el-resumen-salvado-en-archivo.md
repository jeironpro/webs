# Ejercicio 065 - El resumen salvado en archivo

**Nivel:** 12 - Avanzado II
**Tema(s):** **E/S de archivos** (lectura y escritura), `FileReader`/`BufferedReader`, `PrintWriter`, excepciones de entrada/salida, cierre de recursos
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

El departamento de almacén guarda las ventas del día en un archivo de texto `ventas.txt`: **una venta por línea** (números enteros, pueden ser decimales en el futuro, pero aquí enteros). El programa debe **leer** ese archivo y, con los datos, **escribir un resumen** en otro archivo `resumen.txt`:

```
Cantidad: N
Total: T
Promedio: P.PP
```

Además, el mismo resumen se **muestra por consola** (mismas tres líneas).

## Instrucciones

- **Lee** con `BufferedReader` y `FileReader` (o `Scanner` sobre un `File`): recorre `readLine()` hasta que devuelva `null`, sumando y contando. Convierte cada línea con `Integer.parseInt(...)`.
- Maneja las **excepciones de entrada/salida** (son checked: el compilador no suelta el programa si no las declarás o capturás). Usa `try ... catch (IOException e)` (o `try-with-resources`, que cierra solo).
- **Escribe** con `PrintWriter` (o `BufferedWriter` + `FileWriter`) las tres líneas en `resumen.txt`, con el promedio a dos decimales (`String.format("%.2f", promedio)`).
- Considera que `ventas.txt` **existe** y tiene al menos una línea (la validación de archivo vacío se anota en casos límite; no es necesaria para aprobar).
- Cierra los recursos que abras a mano (o usa `try-with-resources` para cerrarlos automáticamente).
- La salida por consola es idéntica al archivo escrito.

## Firma sugerida

```java
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;

public class ResumenEnArchivo {
    public static void main(String[] args) {
        // Tu código aquí
    }
}
```

## Ejemplos de ejecución

**Contenido de `ventas.txt`:**
```
150
80
220
95
310
```

**Salida por consola (y contenido de `resumen.txt`):**
```
Cantidad: 5
Total: 855
Promedio: 171.00
```

## Casos límite a considerar

- **Excepciones checked:** `FileReader`, `BufferedReader` y `PrintWriter` lanzan `IOException`/`FileNotFoundException` (checked). Si no el `try/catch` o `throws`, el programa no compila — es una de las pocas veces que el compilador te obliga a pensar en los errores.
- **`readLine` devuelve `null` al final:** ese es tu marcador para salir del bucle (`while ((linea = lector.readLine()) != null)`).
- **Líneas en blanco:** `Integer.parseInt("")` lanzaría `NumberFormatException`; filtra las líneas vacías antes de convertir (o anótalo como limitación para un archivo bien formado).
- **Cerrar recursos:** sin cerrar, el archivo `resumen.txt` puede quedar sin volcar todo el contenido al disco (el buffer no se ha vaciado). `try-with-resources` o `close()` explícito.
- **El `PrintWriter` crea/sobrescribe** el archivo de salida si no existe; no es error.
- Promedio con decimales: `total / cantidad` con enteros pierde el decimal (lección del ejercicio 014), así que convierte uno de los operandos a `double`.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

```
int suma = 0; int n = 0;
try (BufferedReader in = new BufferedReader(new FileReader("ventas.txt"))) {
    String linea;
    while ((linea = in.readLine()) != null) {
        suma += Integer.parseInt(linea.trim());
        n++;
    }
}
try (PrintWriter out = new PrintWriter("resumen.txt")) {
    out.println("Cantidad: " + n);
    out.println("Total: " + suma);
    out.println("Promedio: " + String.format("%.2f", (double) suma / n));
}
```
El `try ( ... )` es `try-with-resources`: cierra el archivo solo, aunque falle en medio.

</details>
