# Ejercicio 017 - El ascensor de la bodega

**Nivel:** 3 - Básico III
**Tema(s):** bucle `while`, condición sobre un acumulador, salida con `break`, validación de regla de negocio
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

Una bodega tiene un ascensor de carga con capacidad máxima de **400 kg**. Para evitar accidentes, el ascensor solo arranca si el peso total de quien sube no lo sobrecarga. El operador va ingresando el peso de cada persona en el orden en que llega (enteros positivos), y el sistema decide quién sube.

Cuando la **siguiente** persona haga que el total supere 400 kg, esa persona **no sube** y el ascensor queda lleno: se corta la carga y se muestra el resumen.

Regla exacta: una persona sube solo si `peso_total + peso_persona <= 400`.

## Instrucciones

- Usa la clase `Scanner`.
- Lee los pesos dentro de un bucle **`while`**; el bucle termina cuando la persona que llega superaría el límite.
- **No agregues** el peso de esa persona al total ni la cuentes (se queda abajo).
- Al terminar, muestra exactamente dos líneas:

```
Subieron X personas. Peso total: Y kg
El ascensor está lleno
```

## Firma sugerida

```java
import java.util.Scanner;

public class AscensorDeLaBodega {
    public static void main(String[] args) {
        // Tu código aquí
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1:**
```
Entrada: 100
Entrada: 100
Entrada: 100
Entrada: 100
Entrada: 50
Salida: Subieron 4 personas. Peso total: 400 kg
        El ascensor está lleno
```

**Ejemplo 2 (la última no sube):**
```
Entrada: 250
Entrada: 200
Salida: Subieron 1 personas. Peso total: 250 kg
        El ascensor está lleno
```

**Ejemplo 3 (caso borde, una sola persona excede el límite):**
```
Entrada: 500
Salida: Subieron 0 personas. Peso total: 0 kg
        El ascensor está lleno
```

## Casos límite a considerar

- **La última persona no se cuenta:** es el error clásico sumar el peso antes de validar y luego verificar; así, quien debía quedar abajo termina contado.
- **Límite exacto:** si el total queda en 400 y llega una persona de 100, `400 + 100 > 400` → no sube. Si pesara 0, `400 + 0 <= 400` → subiría (un peso 0 es dato inválido del mundo real, pero la comparación lo dejaría pasar).
- Una persona de 500 kg sola no sube jamás: total 0, no se cuenta, el ascensor se llena al instante.
- **Riesgo de bucle infinito:** si llega un valor `<= 0`, nunca superará 400 y el bucle seguirá leyendo para siempre. Anótalo como limitación: la validación de datos es tema de niveles posteriores.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

Dentro del `while`, lee el peso y evalúa ANTES de acumular: `if (total + peso > 400) { break; } total += peso; contador++;`. Así quien excede nunca entra al total ni al conteo.

</details>
