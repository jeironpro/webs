# Ejercicio 005 - El cambio de bodegas

**Nivel:** 1 - Básico I
**Tema(s):** variables, asignación, orden de evaluación, operadores aritméticos
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

Un almacén tiene dos bodegas, A y B, con stock distinto. Por una reorganización, el jefe pide **intercambiar** el contenido entre ambas, pero —detalle del jefe— el sistema de gestión está saturado y solo permite hacer cambios de valor, no mover etiquetas: no hay forma de anotar un valor aparte.

Escribe un programa que lea el stock de la bodega A y el de la bodega B (dos números enteros) y los intercambie **sin usar una tercera variable auxiliar**, usando únicamente operaciones aritméticas sobre las dos variables.

## Instrucciones

- Usa la clase `Scanner` para leer los dos valores.
- El intercambio debe hacerse **sin declarar ninguna variable adicional**, solo reasignando `a` y `b`.
- No uses arreglos, listas ni estructuras auxiliares.
- No uses `if` ni `else` (la validación es tema de niveles posteriores).
- Tras el intercambio, muestra los valores finales de ambas variables con el formato:

```
Stock A: X
Stock B: Y
```

## Firma sugerida

```java
import java.util.Scanner;

public class CambioDeBodegas {
    public static void main(String[] args) {
        // Tu código aquí
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1:**
```
Entrada: 15
Entrada: 8
Salida: Stock A: 8
        Stock B: 15
```

**Ejemplo 2 (caso borde):**
```
Entrada: -5
Entrada: 3
Salida: Stock A: 3
        Stock B: -5
```

**Ejemplo 3 (un valor cero):**
```
Entrada: 0
Entrada: 42
Salida: Stock A: 42
        Stock B: 0
```

## Casos límite a considerar

- El error clásico es encadenar asignaciones (`a = b; b = a;`): la segunda asignación ya pierde el valor original de `a`. El orden en que reasignas importa.
- Valores negativos o cero deben intercambiarse correctamente.
- *Trampa de desborde:* la técnica clásica `a = a + b; b = a - b; a = a - b;` funciona, pero si `a + b` excede el rango de un `int`, el resultado se desborda y el intercambio se corrompe. Documéntalo en tus notas mentales, aunque los valores de prueba no lo disparen.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

Puedes sumar ambos valores en una sola variable: si guardas `a + b` en `a`, entonces el valor original de `a` queda expresable como `nuevo_a - b`. Usa esa relación para despejar cada variable una a la vez.

</details>
