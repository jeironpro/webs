# Problema 016 - El validador de códigos de barra de la tienda

**Nivel:** 3 - Colecciones + lógica de negocio
**Categoría:** Procesamiento de datos
**Enfoque POO:** Ninguno (problema de validación normalizada: la calidad está en aplicar bien el algoritmo y manejar entradas sucias, no en crear clases)
**Dificultad estimada:** ⭐⭐⭐☆☆

## Contexto del problema

La tienda nueva del centro compró una impresora de códigos de barra usada por internet. El problema: **imprime algunos códigos con el dígito de verificación equivocado** y el escáner de la caja registradora rechaza la venta frente al cliente. Como es una impresora usada, no hay forma de "arreglarla": hay que detectar cada código malo antes de pegarlo en el empaque.

Los códigos que usa la tienda son **EAN-13**: 13 dígitos, donde el último es de verificación y se calcula a partir de los 12 primeros. El cajero digita el código tal como lo imprimió la máquina (a veces mete espacios o guiones por la forma en que quedó pegado al empaque) y el programa debe responder: ¿el código de barra es válido o no? Y si la máquina sacó un código de **12 dígitos** (le faltó el último), el programa debe **generar el dígito de verificación** y entregar el código completo para pegarlo en el anaquel.

El dueño quiere que el programa también le diga, para un código inválido, **cuál dígito de verificación era el correcto**: así sabe si fue la impresora o un error de digitación en caja.

## Requisitos funcionales

- Recibir un código de barra como texto, con o sin espacios y guiones intermedios.
- Si tiene 13 dígitos: validar el dígito de verificación y reportar válido/inválido; si es inválido, indicar cuál dígito era el correcto.
- Si tiene 12 dígitos: calcular y adjuntar el dígito de verificación, mostrando el código completo de 13 dígitos.
- Cualquier otro caso (longitud distinta, caracteres que no son dígitos) se rechaza con un mensaje claro.

## Reglas de negocio / restricciones

- Solo se aceptan dígitos (0-9) y, como separadores, espacios o guiones: todo lo demás invalida la entrada.
- El dígito de verificación (EAN-13) se calcula así, con los 12 dígitos en orden:
  1. Suma los dígitos en posiciones pares (2.º, 4.º, ... contando desde la izquierda) y multiplícala por **3**.
  2. Suma los dígitos en posiciones impares (1.º, 3.º, ...).
  3. Suma ambos resultados; el dígito de verificación es `(10 − (suma % 10)) % 10`.
- El código es válido cuando el 13.º dígito coincide con el de verificación calculado.
- La entrada normalizada debe tener exactamente 12 o 13 dígitos; si es 12, se genera; si es 13, se valida.
- Los espacios y guiones de entrada no forman parte del análisis: se limpian antes de contar.

## Lo que se espera que diseñes

- Decide cómo limpiar la entrada (normalizar espacios y guiones) y cómo validar que el resto sean solo dígitos.
- Elige la estructura para manipular los dígitos (recorrido por posición) de modo que pares e impares se traten sin confusión.
- Define cómo separar la **validación** de la **generación** del dígito para no duplicar el cálculo.
- Argumenta si el problema amerita clases propias o basta con un par de funciones bien delimitadas.

*(No se entrega una firma de clases predefinida: el diseño es parte del ejercicio.)*

## Ejemplos de comportamiento esperado

**Escenario 1 (código válido):**
```
Entrada / acción: "4006381333931"
Resultado esperado: código válido (el 13.º dígito "1" coincide con el de verificación)
```

**Escenario 2 (código inválido):**
```
Entrada / acción: "4006381333937"
Resultado esperado: código inválido; el dígito correcto era "1", no "7"
```

**Escenario 3 (generar dígito faltante):**
```
Entrada / acción: "400 638 133 393" (12 dígitos con espacios)
Resultado esperado: se genera el dígito 1 → código completo "4006381333931"
```

**Escenario 4 (entrada inaceptable):**
```
Entrada / acción: "40A6381333931", o una cadena de 11 dígitos
Resultado esperado: se rechaza con el motivo (carácter no numérico / longitud no admitida)
```

## Preguntas de análisis previo (responder antes de programar)

1. ¿Qué pasos sigue la limpieza y validación de una entrada antes de poder analizarla?
2. ¿Cómo identificas correctamente las posiciones pares e impares sin equivocarte en los extremos?
3. ¿Qué pasa con códigos que empiezan en cero o traen separadores en posiciones raras (ej. "4--00…")?
4. ¿Qué podría salir mal? (código de 13 dígitos con separadores, dígito de verificación de un 12 que es inválido al validarlo, letras mezcladas)

## Pistas de diseño (opcional, ocultables)

<details>
<summary>Ver pista de diseño</summary>

Si limpias la entrada a una sola cadena de dígitos antes de todo, la longitud (12 o 13) decide de inmediato si generas o validas. Para el cálculo, conviene recorrer solo los 12 dígitos base y tratar el 13.º como un dato distinto.

</details>

## Criterios de una buena solución

- La limpieza acepta separadores en cualquier posición y rechaza cualquier carácter no numérico restante.
- El dígito de verificación se calcula y aplica exactamente o la validación falla en el límite correcto.
- Generar y validar comparten el mismo cálculo sin duplicarlo.
- El reporte del código inválido indica la cifra correcta, no solo "no válido".
- No hay errores con códigos que empiezan en cero ni con entradas con separadores múltiples.
