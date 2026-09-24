# Ejercicio 007 - Valla y malla para el lago del parque

**Nivel:** 1 - Básico I
**Tema(s):** clase `Math` (`Math.PI`, `Math.pow`), variables decimales, redondeo, formato de salida
**Dificultad estimada:** ⭐⭐☆☆☆

## Enunciado

La alcaldía quiere acondicionar un lago circular en el parque central. Para presupuestar, necesita la **superficie** (para el mantenimiento del agua) y el **perímetro** (para saber cuánta malla cercar necesita). El único dato de campo que tienen es el **diámetro** del lago en metros.

Escribe un programa que lea el diámetro del lago (en metros, número entero) y muestre:

```
Superficie: X.XX m2
Perímetro: Y.YY m
```

**Importante:** los cálculos deben usar el **radio** (la mitad del diámetro), no el diámetro directamente.

## Instrucciones

- Usa la clase `Scanner` para leer el diámetro.
- Usa las constantes y métodos de la clase `Math`: `Math.PI` y `Math.pow` (para elevar el radio al cuadrado).
- Muestra los resultados con **dos decimales**, usando `String.format("%.2f", valor)`.
- No uses `if` ni `else` (la validación de entrada es tema de niveles posteriores).
- No inventes una constante propia para π: usa `Math.PI`.

## Firma sugerida

```java
import java.util.Scanner;

public class VallaYMallaParaElLago {
    public static void main(String[] args) {
        // Tu código aquí
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1:**
```
Entrada: 20
Salida: Superficie: 314.16 m2
        Perímetro: 62.83 m
```

**Ejemplo 2 (caso borde):**
```
Entrada: 1
Salida: Superficie: 0.79 m2
        Perímetro: 3.14 m
```

**Ejemplo 3 (diámetro cero):**
```
Entrada: 0
Salida: Superficie: 0.00 m2
        Perímetro: 0.00 m
```

## Casos límite a considerar

- Al dividir el diámetro entre 2, recuerda usar `2.0` (o convertir a `double`): dividir enteros descarta el decimal y un diámetro impar (ej. `5`) daría radio `2` en vez de `2.5`.
- Diámetro 0: ambas magnitudes deben resultar `0.00`, sin errores ni resultados fantasma.
- Precisión: con diámetros muy grandes el redondeo a dos decimales sigue siendo correcto; compáralo usando una calculadora.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

El radio se obtiene con `double radio = diametro / 2.0;`. Luego `Math.PI * Math.pow(radio, 2)` para la superficie y `2 * Math.PI * radio` para el perímetro.

</details>
