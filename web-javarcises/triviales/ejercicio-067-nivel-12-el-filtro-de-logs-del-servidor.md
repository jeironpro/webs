# Ejercicio 067 - El filtro de logs del servidor

**Nivel:** 12 - Avanzado II
**Tema(s):** **E/S de archivos** combinada (leer + filtrar + escribir), recorrido línea a línea, `String.contains`, conteo
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

El servidor de la empresa vuelca su bitácora de eventos en `servidor.log`, una línea por evento (mensajes de información, advertencias y errores). Para la operación diaria solo interesan los **errores**: el programa debe leer el archivo completo, **conservar únicamente las líneas que contengan la palabra `ERROR`** y escribirlas en `errores.log`, dejando el archivo original intacto.

Al terminar muestra por consola:

```
Líneas de error: X
```

y deja en `errores.log` exactamente esas líneas (una por línea, en el mismo orden en que aparecen en el log).

## Instrucciones

- **Lee** `servidor.log` con `BufferedReader` + `FileReader` en `try-with-resources` (o con `try/catch` de `IOException`): el `readLine()` devuelve `null` al final del archivo.
- Para decidir si una línea es un error usa **`linea.contains("ERROR")`** (la búsqueda es sensible a mayúsculas).
- **Escribe** solo las líneas de error en `errores.log` con `PrintWriter` (crea el archivo si no existe; lo sobreescribe si existía).
- Lleva un **contador** e imprime la cantidad al final de la consola.
- Maneja las **excepciones checked** de E/S (el programa no compila sin `try/catch` o `throws`).
- Considera que `servidor.log` existe y tiene al menos una línea (el archivo vacío se anota en casos límite; no es necesario resolverlo).

## Firma sugerida

```java
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;

public class FiltroDeLogs {
    public static void main(String[] args) {
        // Tu código aquí
    }
}
```

## Ejemplos de ejecución

**Contenido de `servidor.log`:**
```
[INFO] Inicio del arranque
[ERROR] No se pudo conectar a la base de datos
[WARN] Uso alto de memoria
[ERROR] Tiempo de respuesta excedido
[INFO] Apagado normal
```

**Salida por consola:**
```
Líneas de error: 2
```

**Contenido de `errores.log` tras ejecutar:**
```
[ERROR] No se pudo conectar a la base de datos
[ERROR] Tiempo de respuesta excedido
```

## Casos límite a considerar

- **`contains` es sensible a mayúsculas:** `error` en minúscula **no** se captura como `ERROR`. Si el log usara otras variantes, habría que normalizar (anótalo como limitación, o baja las líneas con `toLowerCase` y busca `"error"`).
- **Líneas en blanco:** no contienen `ERROR` → no se copian; no rompen la lectura.
- **`readLine()` y `null`:** el `null` marca el fin; no lo trates como una línea más ni lo conviertas.
- **Cerrar el escritor:** sin `close()` (o `try-with-resources`), el buffer puede quedarse sin volcar todo a `errores.log`, y el archivo quede incompleto en disco (lección del ejercicio 065).
- **Orden estable:** las líneas de salida conservan el orden del archivo original (se recorre de arriba abajo y se escribe al vuelo).
- Si ninguna línea es error: `errores.log` queda vacío y la consola muestra `Líneas de error: 0`.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

```
int contador = 0;
try (BufferedReader in = new BufferedReader(new FileReader("servidor.log"));
     PrintWriter out = new PrintWriter("errores.log")) {
    String linea;
    while ((linea = in.readLine()) != null) {
        if (linea.contains("ERROR")) {
            out.println(linea);
            contador++;
        }
    }
}
System.out.println("Líneas de error: " + contador);
```
Un solo `try-with-resources` con los dos recursos: se cierran ambos al terminar.

</details>
