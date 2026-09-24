# Ejercicio 061 - El ranking de los atletas

**Nivel:** 11 - Avanzado I
**Tema(s):** implementación de **`Comparable<T>`**, sobrescritura de `compareTo`, ordenación con `Collections.sort`, orden natural y desempate
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

En el torneo municipal de atletismo, cada corredor tiene un nombre y un **mejor tiempo** en segundos (decimal). Para armar la tabla de posiciones, los atletas deben saber **ordenarse a sí mismos**: implementan la interfaz `Comparable<Atleta>` definiendo qué significa que uno "vaya antes" que otro. El orden natural es **por tiempo ascendente** (menos tiempo = mejor puesto) y, **en caso de empate de tiempo**, se desempata **alfabéticamente por nombre**.

El programa lee `N` (mayor a 0) y por cada atleta el nombre (puede tener espacios) y el tiempo. Ordena con `Collections.sort(lista)` y muestra el podio numerado:

```
1. Ana - 9.81 s
2. ...
```

## Instrucciones

- Crea `class Atleta implements Comparable<Atleta>` con:
  - Atributos privados `String nombre` y `double tiempo`.
  - Constructor, getters.
  - **`public int compareTo(Atleta otro)`** que:
    - Devuelve negativo si `this` va **antes** que `otro` (tiempo menor).
    - Devuelve `0` si son iguales (mismo tiempo).
    - Devuelve positivo si `this` va **después**.
    - Cuando los tiempos coinciden, desempata con `String.compareTo` sobre los nombres (orden alfabético) dentro del `compareTo`.
- `main` guarda los atletas en un `ArrayList<Atleta>`, los ordena con `Collections.sort(atletas)` (que usa tu `compareTo`), e imprime el ranking con posiciones desde 1.
- No implementes tu propio algoritmo de ordenamiento: `Collections.sort` hace el trabajo usando tu `compareTo`.
- Los tiempos se muestran con dos decimales.

## Firma sugerida

```java
import java.util.ArrayList;
import java.util.Collections;
import java.util.Scanner;

public class RankingDeAtletas {
    public static void main(String[] args) {
        // Tu código aquí
    }
}

class Atleta implements Comparable<Atleta> {
    private String nombre;
    private double tiempo;

    public Atleta(String nombre, double tiempo) {
        this.nombre = nombre;
        this.tiempo = tiempo;
    }

    public String getNombre() { return nombre; }
    public double getTiempo() { return tiempo; }

    @Override
    public int compareTo(Atleta otro) {
        return 0; // reemplaza
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1 (con empate):**
```
Entrada: 3
Entrada: Luis
Entrada: 10.02
Entrada: Ana
Entrada: 9.81
Entrada: Ro
Entrada: 9.81
Salida: 1. Ana - 9.81 s
        2. Ro - 9.81 s
        3. Luis - 10.02 s
```

**Ejemplo 2 (sin empates):**
```
Entrada: 2
Entrada: Ema
Entrada: 12.5
Entrada: Ivo
Entrada: 11.25
Salida: 1. Ivo - 11.25 s
        2. Ema - 12.50 s
```

**Ejemplo 3 (un solo atleta):**
```
Entrada: 1
Entrada: Solo
Entrada: 9
Salida: 1. Solo - 9.00 s
```

## Casos límite a considerar

- **La semántica del signo:** `compareTo` debe devolver **negativo/cero/positivo** según "this va antes / es igual / va después". Un criterio invertido ordenaría al revés (el más lento primero).
- **El desempate dentro de `compareTo`:** no basta devolver la comparación de tiempos; si tiempos iguales y devuelves `0`, el orden entre Ana y Ro quedaría "estable" (como vinieron), no alfabético. Compara también `nombre.compareTo(otro.nombre)` en ese caso.
- **Comparar `double`:** para tiempos puedes usar `Double.compare(tiempo, otro.tiempo)` u obtener la resta y devolver su signo; evita comparaciones con `==` (precisiones) y ten cuidado con `NaN`.
- **`Collections.sort` pide una lista mutable:** un `ArrayList` sirve; un arreglo usaría `Arrays.sort`. La clave es que tu clase **declara** `implements Comparable<Atleta>` para que sort funcione.
- La firma debe ser `public int compareTo(Atleta otro)` (no extrañamente con `Object`): con tipos genéricos, este es el patrón.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

```
int porTiempo = Double.compare(tiempo, otro.tiempo);
if (porTiempo != 0) return porTiempo;
return nombre.compareTo(otro.nombre);
```
`Double.compare` ya devuelve un entero con la semántica de orden correcta y te ahorra decidir el signo a mano.

</details>
