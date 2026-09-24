# Ejercicio 055 - El escrutinio de la votación

**Nivel:** 9 - Colecciones
**Tema(s):** `HashMap<String, Integer>`, acumulación de frecuencias, `getOrDefault`, recorrido con `entrySet`, búsqueda del máximo en el mapa
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

En las elecciones de la junta, el jurado teclea el **nombre del candidato** por cada voto contado (pueden votar varias veces al mismo). El sistema debe acumular los votos y, al terminar, saber cuántos **candidatos distintos** hubo y quién **ganó** (más votos).

El programa lee nombres uno por uno (con `nextLine()`) hasta la palabra `FIN`, y muestra:

```
Candidatos registrados: N
Votos por candidato:
CANDIDATO (Y votos)
...
Ganador: CANDIDATO con Z votos
```

## Instrucciones

- Importa `java.util.HashMap` (puedes declarar el mapa también como `Map`).
- Lee nombres hasta `FIN` y acumula en `Integer`:
  - **La primera aparición debe crear la entrada** con valor 1; las siguientes, sumarle 1.
  - Usa `mapa.getOrDefault(candidato, 0) + 1` y vuelve a `put` ese valor.
- Al terminar:
  - Muestra cuántas **claves** hay (`mapa.size()`).
  - Recorre con `for (Map.Entry<String, Integer> e : mapa.entrySet())` imprimiendo cada par.
  - Busca el máximo de los valores con `>` estricto y guarda también su clave.
- En la impresión usa singular cuando el conteo es 1: `"voto"` vs `"votos"` (puedes resolverlo con un operador ternario).
- Considera que hay al menos un voto (la validación de entrada vacía es tema de niveles posteriores).

## Firma sugerida

```java
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

public class EscrutinioDeLaVotacion {
    public static void main(String[] args) {
        // Tu código aquí
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1:**
```
Entrada: Ana
Entrada: Luis
Entrada: Ana
Entrada: Ro
Entrada: Ana
Entrada: FIN
Salida: Candidatos registrados: 3
        Votos por candidato:
        Ana (3 votos)
        Luis (1 voto)
        Ro (1 voto)
        Ganador: Ana con 3 votos
```

**Ejemplo 2 (empate):**
```
Entrada: Ema
Entrada: Ivo
Entrada: FIN
Salida: Candidatos registrados: 2
        Votos por candidato:
        Ema (1 voto)
        Ivo (1 voto)
        Ganador: Ema con 1 voto
```

**Ejemplo 3 (un solo candidato):**
```
Entrada: Sol
Entrada: FIN
Salida: Candidatos registrados: 1
        Votos por candidato:
        Sol (1 voto)
        Ganador: Sol con 1 voto
```

## Casos límite a considerar

- **La primera aparición:** sin `getOrDefault`, tendrías que consultar `containsKey` y ramificar; el `getOrDefault` hace ese chequeo en una línea, pero necesitas reescribir el valor con `put` (el mapa no "se actualiza solo").
- **Contar con `Integer`:** sumas con `+ 1` y asignas un `Integer` nuevo; el empaquetado (autoboxing) lo maneja Java, pero recuerda que el valor de la entrada no se modifica en el lugar: hay `put` de vuelta.
- **`entrySet` y tipos:** en el `for`, los tipos son `Map.Entry<String, Integer>`; a partir del valor (`getValue()`) puedes usar `int` para facilitar la comparación del máximo.
- **Empates:** con `>` estricto queda el primero que encuentres; el orden interno de un `HashMap` no está garantizado, por eso no asumas un nombre específico en empate (documenta ese detalle en código).
- El centinela `FIN` no se cuenta como voto.
- Claves repetidas: la misma persona suma sobre su entrada existente, no duplica la clave.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

Para cada voto: `votos.put(c, votos.getOrDefault(c, 0) + 1);`. Para el máximo: `String ganador = ""; int max = -1; for (Map.Entry<String, Integer> e : votos.entrySet()) { if (e.getValue() > max) { max = e.getValue(); ganador = e.getKey(); } }`. El `getOrDefault` hace que `null` se trate como `0`.

</details>
