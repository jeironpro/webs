# Ejercicio 022 - La cesta más pesada del mercado

**Nivel:** 3 - Básico III
**Tema(s):** búsqueda de máximo y mínimo en una pasada, inicialización con el primer valor, seguimiento de posición (índice)
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

En el mercado mayorista descargan en un solo día varias cestas de fruta y el supervisor registra el peso de cada una en el orden de llegada. Al final necesita saber **cuál cesta pesó más** y **cuál pesó menos**, indicando también en qué número de llegada estaban.

El programa lee `N` (la cantidad de cestas, mayor a 0) y luego los `N` pesos en orden, y muestra:

```
Más pesada: cesta #X con Y kg
Más liviana: cesta #Z con W kg
```

Las posiciones se cuentan desde 1 (la primera cesta leída es la `#1`). Si hay empate, vale la **primera** cesta que alcanzó ese peso.

## Instrucciones

- Usa la clase `Scanner`.
- Lee `N` y luego los `N` pesos dentro de un bucle `for`.
- **Inicializa el máximo y el mínimo con el peso de la primera cesta** (léela fuera del bucle o resuélvelo dentro; pero no los inicialices con `0`, porque esa solución falla si todos los pesos fuesen negativos).
- Mantén también dos variables con el **número de llegada** (posición) del máximo y del mínimo; actualízalas con `=` solo en caso de superar el valor (para que en empate gane la primera).
- No uses arreglos ni listas.
- Considera que `N` es mayor a 0 (la validación de entrada es tema de niveles posteriores).
- La salida tiene exactamente dos líneas con el formato indicado.

## Firma sugerida

```java
import java.util.Scanner;

public class CestaMasPesada {
    public static void main(String[] args) {
        // Tu código aquí
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1:**
```
Entrada: 5
Entrada: 20
Entrada: 45
Entrada: 12
Entrada: 45
Entrada: 33
Salida: Más pesada: cesta #2 con 45 kg
        Más liviana: cesta #3 con 12 kg
```

**Ejemplo 2 (una sola cesta):**
```
Entrada: 1
Entrada: 30
Salida: Más pesada: cesta #1 con 30 kg
        Más liviana: cesta #1 con 30 kg
```

**Ejemplo 3 (todas iguales):**
```
Entrada: 3
Entrada: 10
Entrada: 10
Entrada: 10
Salida: Más pesada: cesta #1 con 10 kg
        Más liviana: cesta #1 con 10 kg
```

## Casos límite a considerar

- **Inicializar con `0`:** si un día todas las cargas negativas (supervisor con báscula mal calibrada), `max = 0` nunca se supera y todo reporta la cesta #1 con 0 kg. La semilla debe ser el **primer peso real**.
- **Empates:** con dos cestas de 45 kg, gana la primera que alcanzó ese peso (usa `>` y `<`, no `>=` ni `<=`, al actualizar el récord).
- **`N = 1`:** la misma cesta es máximo y mínimo a la vez.
- Recordar la posición: si solo guardas el peso, no sabrás qué cesta fue. Un par `peso`/`posicion` por cada récord.
- Todas las cestas iguales: máximo y mínimo coinciden en la #1.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

Lée el primer peso antes de entrar al bucle: `int peso = sc.nextInt(); int max = peso; int min = peso; int posMax = 1; int posMin = 1;` y luego compara los restantes (de la 2 a la N) actualizando cada récord solo con `<` o `>` estricto. Para `N = 1` ese bucle (de 2 a 1) no llega a ejecutarse, y todo queda en la primera cesta.

</details>
