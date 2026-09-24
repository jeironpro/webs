# Ejercicio 037 - El cifrador César del regimiento

**Nivel:** 5 - Intermedio II
**Tema(s):** métodos de `String` (`charAt`, `length`, concatenación), aritmética de caracteres, módulo para envolver el alfabeto, lectura mixta con `Scanner`
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

El regimiento de señales cifra sus mensajes con el **cifrado César**: cada letra se desplaza un número fijo de posiciones en el alfabeto, dando la vuelta cuando se termina. Por ejemplo, con un salto de `3`, `hola` se convierte en `krod` (la `x` se convierte en `a`, porque se da la vuelta).

El operador ingresa primero el **salto** (entero de 0 a 25) y luego una **línea de mensaje** (puede contener espacios, números y signos de puntuación). El programa muestra:

```
Mensaje cifrado: X
```

**Reglas:** las letras minúsculas se desplazan sobre `a–z`, las mayúsculas sobre `A–Z` (conservando su caso), y cualquier otro carácter (espacio, dígito, símbolo) se deja tal cual.

## Instrucciones

- Usa `Scanner`: lee el salto con `nextInt()` y el mensaje con `nextLine()`.
- **Ojo con la lectura mixta:** tras un `nextInt()` queda un salto de línea pendiente que el `nextLine()` se "traga" (lección del ejercicio 006). Asegúrate de consumirlo antes de leer el mensaje, o el mensaje saldrá vacío.
- Recorre el mensaje carácter por carácter con `charAt(i)`.
- Para las letras, aplica el desplazamiento con **módulo 26** para que la vuelta del alfabeto quede bien: `letra = (char) ('a' + ((letra - 'a') + salto) % 26)`, y el equivalente para mayúsculas.
- Los caracteres que no son letras se copian sin cambios.
- Arma el resultado concatenando en una variable `String`.
- No uses librerías de criptografía ni `StringBuilder` si prefieres mantenerlo simple: la concatenación basta.
- Considera que el salto está entre 0 y 25 (la validación es tema de niveles posteriores).

## Firma sugerida

```java
import java.util.Scanner;

public class CifradorCesar {
    public static void main(String[] args) {
        // Tu código aquí
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1:**
```
Entrada: 3
Entrada: hola mundo
Salida: Mensaje cifrado: krod pxqgr
```

**Ejemplo 2 (la vuelta del alfabeto):**
```
Entrada: 3
Entrada: xyz ABC
Salida: Mensaje cifrado: abc DEF
```

**Ejemplo 3 (salto 0):**
```
Entrada: 0
Entrada: Sin cambios
Salida: Mensaje cifrado: Sin cambios
```

**Ejemplo 4 (caracteres que no son letras):**
```
Entrada: 3
Entrada: hola, 123!
Salida: Mensaje cifrado: krod, 123!
```

## Casos límite a considerar

- **La vuelta del alfabeto:** sin el `% 26`, `x` + 3 daría una letra fuera del abecedario (un carácter raro). El módulo mantiene el resultado dentro del rango.
- **Caso de cada letra:** `A` y `a` deben desplazarse sobre rangos distintos (`'A' + ...` con límite en `'Z'`). Mezclar una letra mayúscula en la fórmula de minúsculas distorsiona el resultado.
- **No letras sin tocar:** `,`, `!`, dígitos y espacios pasan iguales.
- **La lectura mixta:** si no consumes el `\n` de después de `nextInt()`, el mensaje se queda vacío (transparencia del ejercicio 006).
- Letra justo en el borde: `z` con salto 1 → `a`; `a` con salto 25 → `z`.
- Salto `0`: el mensaje queda idéntico.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

Tras `int salto = sc.nextInt();` haz un `sc.nextLine();` para absorber el salto de línea antes de leer el mensaje. Para cada carácter, pregunta si `c >= 'a' && c <= 'z'` (o el rango de mayúsculas) y entonces `c = (char) ('a' + (c - 'a' + salto) % 26);`. El `c - 'a'` convierte la letra a un número 0-25, el `% 26` da la vuelta, y `+ 'a'` regresa al alfabeto.

</details>
