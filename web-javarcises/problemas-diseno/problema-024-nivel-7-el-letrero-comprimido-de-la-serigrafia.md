# Problema 024 - El letrero comprimido de la serigrafía

**Nivel:** 7 - Algoritmos aplicados
**Categoría:** Procesamiento de datos
**Enfoque POO:** Ninguno (problema de codificación y decodificación de texto: la precisión está en el parseo y los casos borde, no en las clases)
**Dificultad estimada:** ⭐⭐⭐☆☆

## Contexto del problema

El taller de serigrafía arma letreros con letras repetidas (por ejemplo, un pasacalle que dice `AAAAAATTTTTTTEEE`). El cliente manda el texto por un canal de datos muy lento (el teléfono de la vereda), así que para ganar tiempo decidieron **comprimir el texto por rachas**: una letra que se repite **n** veces se escribe como `n` seguido de la letra. El texto `aaabbc` se manda como `3a2b1c`.

Como no es muy compilado, hay que escribir de a dos funciones: una que **comprima** un texto original (letras de la `a` a la `z`) y otra que **descomprima** lo que llega de vuelta, verificando que el resultado sea exactamente el texto original. El canal es rudo y a veces llegan textos mal formados (un `3` sin letra, un `0a`, un número con cero de sobra como `01a`, una letra sola sin contar), y el programa debe **rechazarlos con el motivo**, no fallar a la mitad.

## Requisitos funcionales

- Comprimir un texto en minúsculas de la `a` a la `z`: convertir cada racha en `cantidad + letra`.
- Descomprimir un texto codificado (`cantidad + letra` repetidas veces) a su original.
- Verificar en la descompresión que el resultado reconstruye un texto esperado sin pérdida.
- Rechazar entradas inválidas (caracteres fuera de rango, códigos mal formados o incompletos) indicando la causa.

## Reglas de negocio / restricciones

- El texto original solo contiene letras minúsculas de la `a` a la `z`; cualquier otro carácter invalida la entrada.
- Compresión por rachas: cada racha de una letra se escribe como `cantidad` (en decimal, sin ceros a la izquierda) seguida de la letra. Una letra que no se repite se escribe `1letra`.
- Los **conteos pueden tener varios dígitos** (una racha de 21 letras iguales se escribe `21x`).
- Descompresión: cada par es un conteo (≥ 1, sin ceros a la izquierda) y una letra; un conteo 0, un conteo con cero de sobra, un par sin letra, o una letra sin conteo, se rechazan con el motivo.
- Una entrada vacía (sin letras) se rechaza: el taller no manda letreros vacíos.
- El "viaje redondo" es la prueba de calidad: comprimir y descomprimir siempre debe regresar el texto original.

## Lo que se espera que diseñes

- Decide cómo recorrer el texto original para juntar rachas sin perder la última.
- Define el parseo de la descompresión como un pequeño analizador: primero dígitos del conteo, después la letra, sin estados raros.
- Argumenta por qué tu codificación es **descomprensible de forma única** (por qué `3ab` no puede tener dos lecturas).
- Separa bien las responsabilidades (validar, comprimir, descomprimir, verificar) para reusarlas.

*(No se entrega una firma de clases predefinida: el diseño es parte del ejercicio.)*

## Ejemplos de comportamiento esperado

**Escenario 1 (compresión):**
```
Entrada / acción: "aaabbc"
Resultado esperado: "3a2b1c" (letra única sí lleva su 1)
```

**Escenario 2 (racha larga con varios dígitos):**
```
Entrada / acción: 21 veces la letra "g"
Resultado esperado: "21g"; al descomprimir regresan las 21 g
```

**Escenario 3 (descompresión):**
```
Entrada / acción: "3a2b1c"
Resultado esperado: "aaabbc" (y la verificación confirma el viaje redondo)
```

**Escenario 4 (código mal formado):**
```
Entrada / acción: "3", "0a", "01a", "5" sin letra, o una letra sola "a"
Resultado esperado: rechazo indicando el motivo (par incompleto, conteo inválido, etc.); nada se produce
```

**Escenario 5 (carácter fuera de rango):**
```
Entrada / acción: "aÁ" o "a b" en el texto original
Resultado esperado: rechazo por carácter no permitido
```

## Preguntas de análisis previo (responder antes de programar)

1. ¿Qué necesitas llevar mientras recorres el texto para cortar cada racha en el lugar correcto?
2. ¿Cómo distingues, al leer dígitos, cuándo termina el conteo y empieza la letra?
3. ¿Qué condiciones hacen que un código descompreso sea ambiguo o incompleto, y cómo las detectas?
4. ¿Qué podría salir mal? (rachas al final del texto, conteos de un dígito, conteos de muchos dígitos, texto que mezcla números y letras)

## Pistas de diseño (opcional, ocultables)

<details>
<summary>Ver pista de diseño</summary>

Para comprimir, recorre de corrido y cuenta cuántas letras iguales siguen; al cambiar de letra (o al terminar) emites `cantidad + letra`. Para descomprimir, acumula los dígitos en un número mientras sean dígitos, y al topar con una letra usas ese número para repetir la letra; un conteo sin letra después, o un cero/cero de sobra, es inválido.

</details>

## Criterios de una buena solución

- La compresión es exacta y reversible: descomprimir(comprimir(t)) retorna t para todo texto válido.
- Los conteos de varios dígitos y las rachas de una sola letra se manejan sin ambigüedad.
- Los códigos mal formados se rechazan con su causa, sin dejar salidas a medias.
- El verificador solo valida el viaje redondo (comprimir→descomprimir), sin resultados falsos.
- El código separa validación, compresión y descompresión para que cada paso se pruebe por separado.
