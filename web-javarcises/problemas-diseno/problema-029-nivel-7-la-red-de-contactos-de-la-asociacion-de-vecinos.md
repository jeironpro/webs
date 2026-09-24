# Problema 029 - La red de contactos de la asociación de vecinos

**Nivel:** 7 - Algoritmos aplicados
**Categoría:** Gestión / CRUD conceptual
**Enfoque POO:** Composición (`Red` gestiona los `Miembro` y sus enlaces de amistad; las consultas de vecinos y de amigos en común viven en la estructura)
**Dificultad estimada:** ⭐⭐⭐☆☆

## Contexto del problema

La asociación de vecinos del barrio quiere fomentar la comunidad y armó un **directorio de contactos**: cada vecino con su nombre y cédula, y los que se conocen quedan "enlazados". La idea es que, con los enlaces, se detecten vecinos que **tienen varios amigos en común** y se les sugiera conocerse, para integrar al que está llegando al barrio.

Hoy manejan papelitos con flechas que nadie entiende. Piden un programa de consola que registre a los vecinos, registre las **amistades** (si A conoce a B, B conoce a A, siempre), y responda:
- cuántos amigos tiene cada vecino,
- quién es el **mejor conectado**,
- cuántos **amigos en común** tienen dos vecinos, y
- qué **sugerencias de amistad** salen (pares de vecinos que **no se conocen aún** pero tienen 2 o más amigos en común).

La secretaria de la asociación entra los datos un sábado y quiere que los duplicados (misma amistad dos veces, o un vecino "amigo" de sí mismo) se rechacen sin tumbar el directorio.

## Requisitos funcionales

- Registrar vecinos (cédula única y nombre).
- Registrar amistades simétricas entre dos vecinos.
- Mostrar el número de amigos de un vecino y quién tiene el **mayor número de amigos**.
- Calcular los **amigos en común** entre dos vecinos.
- Listar las **sugerencias de amistad**: pares de vecinos no enlazados que tienen 2 o más amigos en común.

## Reglas de negocio / restricciones

- La cédula es el identificador único; no se registran dos vecinos con la misma.
- La amistad es simétrica: enlazar a A y B deja a ambos como amigos entre sí.
- **No** se permite enlazar a un vecino consigo mismo.
- Enlazar una amistad ya registrada (A–B otra vez) se rechaza (no duplica).
- Los enlaces solo son válidos entre vecinos ya registrados; una cédula inexistente se rechaza.
- Amigos en común entre A y B = cantidad de vecinos que son amigos de A **y** de B a la vez.
- Una sugerencia es un par (A, B) distinto, sin enlace previo, con **2 o más** amigos en común; se listan en orden de cédula.

## Lo que se espera que diseñes

- Identifica las clases: qué representa un vecino y qué representa la red de enlaces.
- Decide cómo guardar los enlaces para que la simetría se mantenga al registrar (y no se rompa al consultar).
- Define cómo calcula los amigos en común sin contrar dos veces ni confundir direcciones.
- Argumenta qué estructura usas para que "amigos de X" sea una consulta rápida e inequívoca.

*(No se entrega una firma de clases predefinida: el diseño es parte del ejercicio.)*

## Ejemplos de comportamiento esperado

**Escenario 1 (registro de amistad):**
```
Entrada / acción: enlazar A(101) y B(102)
Resultado esperado: A tiene 1 amigo (B) y B tiene 1 amigo (A)
```

**Escenario 2 (amistad repetida):**
```
Entrada / acción: enlazar A(101) y B(102) dos veces
Resultado esperado: el segundo intento se rechaza y el número de amigos no cambia
```

**Escenario 3 (auto-amistad):**
```
Entrada / acción: enlazar A(101) consigo mismo
Resultado esperado: rechazo; el directo de A sigue igual
```

**Escenario 4 (amigos en común):**
```
Entrada / acción: A–B, A–C, B–C enlazados
Resultado esperado: amigos en común de A y C = 1 (solo B)
```

**Escenario 5 (sugerencias):**
```
Entrada / acción: A(101)–C(103) y B(102)–C(103), con A y B sin enlazarse entre sí
Resultado esperado: sugerencia (101, 102) porque comparten a C (1 en común) — se requiere 2+; si hubiera un D(104) amigo de ambos, sí se sugiere
```

**Escenario 6 (vecino inexistente):**
```
Entrada / acción: enlazar A(101) con 999 (que no está registrado)
Resultado esperado: rechazo por cédula inexistente; nada cambia
```

## Preguntas de análisis previo (responder antes de programar)

1. ¿Qué información necesita la red para saber "quién es amigo de quién" y respetar la simetría?
2. ¿Cómo calculas la intersección de los amigos de A y los de B sin contarla dos veces?
3. ¿Cómo evitas que la lista de sugerencias repita el par invertido (A,B) y (B,A)?
4. ¿Qué podría salir mal? (vecino sin amigos, red vacía, enlaces a cédulas inexistentes, dos vecinos con el mismo nombre pero distinta cédula)

## Pistas de diseño (opcional, ocultables)

<details>
<summary>Ver pista de diseño</summary>

Guarda los amigos de cada vecino en un conjunto (`Set`) y mantén la simetría agregando a ambos al enlazar; así "amigos en común" es la intersección de dos conjuntos. Para las sugerencias, recorre pares ordenados (cédula menor, cédula mayor) para no duplicar.

</details>

## Criterios de una buena solución

- La simetría se respeta en el registro y al consultar, y los enlaces duplicados no cuentan.
- La auto-amistad y los enlaces a vecinos inexistentes se rechazan sin alterar la red.
- Las sugerencias solo incluyen pares correctos (distintos, sin enlace, con 2+ amigos en común), sin repetidos invertidos.
- El "mejor conectado" se calcula con el conteo de amigos real, y el empate se resuelve de forma determinista (menor cédula).
- Agregar operaciones nuevas (buscar por nombre, borrar vecino) no exige romper la estructura de enlaces.
