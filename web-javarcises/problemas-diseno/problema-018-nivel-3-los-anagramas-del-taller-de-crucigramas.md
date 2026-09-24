# Problema 018 - Los anagramas del taller de crucigramas

**Nivel:** 3 - Colecciones + lógica de negocio
**Categoría:** Juegos y lógica
**Enfoque POO:** Ninguno (problema de manipulación de texto y agrupación: la precisión está en normalizar letras y comparar, no en crear clases)
**Dificultad estimada:** ⭐⭐⭐☆☆

## Contexto del problema

La editorial del barrio publica crucigramas y sopas de letras. Para la sección de **anagramas**, el diseñador necesita que un programa le diga si dos palabras o frases usan exactamente las mismas letras (no importa el orden), para no publicar un anagrama malo y recibir cartas de los lectores.

Además, para el concurso semanal, guarda listas de palabras candidatas y quiere que el programa le **agrupe todas las que son anagramas entre sí**, así arma los retos con un solo vistazo. Hoy lo hace marcando letras en papel y se le escapan los casos con espacios o mayúsculas (`NIEVE` frente a `Viene` se ve distinto en papel pero son lo mismo).

El programa debe comparar ignorando espacios, signos de puntuación y mayúsculas/minúsculas. Lo único que **no** se ignora son las **tildes**: `café` y `cafe` no son anagramas, porque la tilde es parte de la palabra editorial. La regla vale para el concurso y para la corrección del taller.

## Requisitos funcionales

- Recibir dos textos y responder si son anagramas (mismas letras, mismo conteo por letra).
- Recibir una lista de palabras y mostrar todas las **parejas o grupos** de anagramas (grupos con 2 o más palabras que lo son entre sí).
- Reportar en la lista los textos que quedan sin pareja (no forman ningún grupo).

## Reglas de negocio / restricciones

- Se ignoran **espacios, puntuación** (coma, punto, guion, apóstrofo, etc.) y **mayúsculas**.
- Las **tildes no se ignoran**: `á` y `a` son letras distintas para el taller.
- Dos textos son anagramas si, tras normalizarlos, tienen exactamente la misma cantidad de cada letra.
- Un texto normalizado **vacío** (solo espacios o signos) es inválido y se rechaza.
- En la agrupación, un grupo solo se reporta si tiene **2 o más** palabras; las palabras solitarias se listan aparte.
- Comparar un texto consigo mismo no forma un grupo: cada palabra de la lista debe ser única.

## Lo que se espera que diseñes

- Decide cómo normalizar un texto (quitar espacios y signos, unificar mayúsculas) en un solo paso reutilizable.
- Elige la representación para saber si dos textos tienen el mismo conteo de letras sin reordenarlas palabra por palabra. (Pista de enfoque: un "patrón" que describa a cualquier anagrama del grupo.)
- Decide cómo agrupar la lista usando ese patrón y cómo separar los grupos válidos de los solitarios.
- Argumenta si el dominio exige clases propias o basta con funciones bien nombradas.

*(No se entrega una firma de clases predefinida: el diseño es parte del ejercicio.)*

## Ejemplos de comportamiento esperado

**Escenario 1 (anagrama simple):**
```
Entrada / acción: comparar "amor" con "Roma"
Resultado esperado: son anagramas (las mismas 4 letras)
```

**Escenario 2 (anagrama con espacios y mayúsculas):**
```
Entrada / acción: comparar "El Gato" con "Lego Ta!"
Resultado esperado: son anagramas (tras quitar espacios, signo y mayúsculas: E L G A T O vs L E G O T A)
```

**Escenario 3 (no anagrama por cantidad):**
```
Entrada / acción: comparar "amor" con "amo"
Resultado esperado: no son anagramas (distinta cantidad de letras)
```

**Escenario 4 (la tilde importa):**
```
Entrada / acción: comparar "café" con "cafe"
Resultado esperado: no son anagramas (la é y la e son letras distintas)
```

**Escenario 5 (agrupación):**
```
Entrada / acción: lista = [amor, Roma, mora, casa, saca, perro]
Resultado esperado: grupo {amor, Roma, mora} y grupo {casa, saca}; "perro" queda sin pareja
```

**Escenario 6 (texto vacío tras normalizar):**
```
Entrada / acción: comparar "!!" con "a"  (o usar un texto de solo signos)
Resultado esperado: se rechaza la entrada vacía normalizada como inválida
```

## Preguntas de análisis previo (responder antes de programar)

1. ¿Qué pasos ejecuta la normalización y en qué orden para que nunca sobreviva un signo o espacio?
2. Si comparas montón de "a" contra "á", ¿qué dice tu regla y por qué es coherente con la editorial?
3. ¿Cómo haces que dos anagramas lleven al mismo patrón y dos que no lo son lleven a patrones distintos?
4. ¿Qué podría salir mal? (textos con solo símbolos, palabras repetidas en la lista, tildes, letras ñ/ñ simples, frases largas)

## Pistas de diseño (opcional, ocultables)

<details>
<summary>Ver pista de diseño</summary>

Un patrón útil: ordenar las letras normalizadas de un texto, o guardar el conteo de cada letra en un mapa. Dos textos son anagramas ⇔ producen el mismo patrón. Si calculas el patrón una sola vez por palabra, agrupar la lista es separar las que tienen la misma firma.

</details>

## Criterios de una buena solución

- La normalización elimina espacios, signos y mayúsculas en cualquier combinación, y respeta las tildes.
- La comparación no depende del orden de las letras ni se confunde con textos de distinta longitud.
- En la agrupación, cada palabra aparece en un solo grupo o en "sin pareja", y solo cuentan los grupos de 2+.
- El texto vacío normalizado (solo signos) se maneja como inválido sin romper la lista.
- Agregar un regla nueva (por ejemplo, ignorar tildes) no obliga a reescribir la agrupación.
