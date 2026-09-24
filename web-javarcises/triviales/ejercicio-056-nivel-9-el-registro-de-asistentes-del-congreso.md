# Ejercicio 056 - El registro de asistentes del congreso

**Nivel:** 9 - Colecciones
**Tema(s):** `Set` (`TreeSet`), unicidad automática, el retorno booleano de `add`, ordenación natural
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

El congreso registra la entrada de asistentes en su sistema central: cada persona se **marca una sola vez**, aunque pase por varias puertas. La colección ideal es un `Set`, que **no admite duplicados** por diseño: si un nombre ya está, el sistema avisa y lo ignora. Además se usa una variante **ordenada** (`TreeSet`) para generar la lista del boletín en orden alfabético, sin necesidad de ordenar a mano.

El programa lee nombres uno por uno (con `nextLine()`) hasta la palabra `FIN`:

```
Duplicado ignorado: NOMBRE
```
cada vez que un ya-registrado intenta entrar, y al final:

```
Asistentes únicos: N
Lista alfabética: NOMBRE1 NOMBRE2 ...
```

## Instrucciones

- Importa `java.util.TreeSet`.
- Crea `TreeSet<String> asistentes`.
- Para cada nombre leído (hasta `FIN`):
  - Recoge el **retorno booleano** de `asistentes.add(nombre)`: devuelve `true` si se agregó (era nuevo) o `false` si ya existía (duplicado).
  - Si devolvió `false`, imprime `Duplicado ignorado: ` + nombre.
- El centinela `FIN` no se agrega.
- Al final muestra `asistentes.size()` y todos los elementos (los imprime en **orden alfabético**, que el `TreeSet` ya garantiza).
- No ordenes manualmente ni uses `ArrayList`: la unicidad y el orden son la responsabilidad de la colección.

## Firma sugerida

```java
import java.util.Scanner;
import java.util.TreeSet;

public class RegistroDelCongreso {
    public static void main(String[] args) {
        // Tu código aquí
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1 (con duplicados):**
```
Entrada: Ana
Entrada: Luis
Entrada: Ana
Entrada: Ro
Entrada: Ana
Entrada: FIN
Salida: Duplicado ignorado: Ana
        Duplicado ignorado: Ana
        Asistentes únicos: 3
        Lista alfabética: Ana Luis Ro
```

**Ejemplo 2 (¡mayúsculas cuentan como distintos!):**
```
Entrada: Ana
Entrada: ana
Entrada: FIN
Salida: Asistentes únicos: 2
        Lista alfabética: Ana ana
```

**Ejemplo 3 (un solo asistente):**
```
Entrada: Solo
Entrada: FIN
Salida: Asistentes únicos: 1
        Lista alfabética: Solo
```

## Casos límite a considerar

- **El retorno de `add`:** `TreeSet.add` devuelve `true`/`false` según haya insertado; es la forma de detectar duplicados sin buscar por separado. Si ignoras ese valor, no podrás avisar el "Duplicado ignorado".
- **Unicidad por diseño:** no hay `contains` previo ni filtrado manual; el `Set` se encarga (el `add` ya devuelve `false` en el duplicado).
- **Orden del `TreeSet`:** usa el orden **natural** de `String` (alfabético); no hace falta `Collections.sort`.
- **Mayúsculas vs minúsculas:** `"Ana"` y `"ana"` son elementos distintos (compáranse con `compareTo`, sensible a caso). Si quisieras ignorar mayúsculas necesitarías otro enfoque (anótalo como limitación).
- Asistentes únicos 0 (primera lectura `FIN`): imprime `Asistentes únicos: 0` y una lista vacía, sin errores.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

El núcleo es: `if (!asistentes.add(nombre)) System.out.println("Duplicado ignorado: " + nombre);`. Para imprimir la lista, un `for (String n : asistentes) System.out.print(n + " ");` ya sale en orden alfabético: el `TreeSet` mantiene los elementos ordenados internamente en cada inserción.

</details>
