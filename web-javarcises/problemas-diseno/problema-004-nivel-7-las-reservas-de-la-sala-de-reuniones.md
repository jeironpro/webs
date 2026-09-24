# Problema 004 - Las reservas de la sala de reuniones del coworking

**Nivel:** 7 - Algoritmos aplicados
**Categoría:** Algoritmos con contexto
**Enfoque POO:** Ninguno (problema algorítmico: la dificultad está en la estrategia, no en el modelado)
**Dificultad estimada:** ⭐⭐⭐⭐☆

## Contexto del problema

El coworking "La Nave" tiene una sola sala de reuniones y cada día recibe por correo las solicitudes de los equipos que quieren usarla. Cada solicitud indica la hora de inicio, la hora de fin y el nombre del equipo. El problema: llegan más solicitudes de las que caben en el día, así que el administrador debe elegir **cuáles aceptar** y cuáles rechazar.

Hasta ahora el administrador las acepta por orden de llegada, y cuando dos se pisan se queja la otra persona. Al final del mes reina el caos: días con la sala ocupada desde la mañana por una junta larguísima mientras dos reuniones de 1 hora quedaron fuera.

El administrador quiere un programa que, dado el conjunto de solicitudes del día, le devuelva **la mayor cantidad posible de reuniones que no se solapen**, listas en orden cronológico. No le interesa maximizar el tiempo de uso: le interesa servir al mayor número de equipos. El programa debe decidir sola qué reuniones aceptar, y el administrador solo revisa la propuesta.

## Requisitos funcionales

- Recibir el conjunto de solicitudes del día (equipo, hora de inicio, hora de fin), en cualquier orden.
- Seleccionar un subconjunto de reuniones que **no se solapen** maximizando la **cantidad** de reuniones aceptadas.
- Mostrar las reuniones aceptadas en orden cronológico por hora de inicio.
- Mostrar también cuántas solicitudes quedaron rechazadas.

## Reglas de negocio / restricciones

- Las horas se manejan como números enteros de la jornada (8 a 18). Por ejemplo, la reunión 9-11 ocupa los bloques 9, 10 y 11.
- Una reunión que termina a la misma hora en que otra comienza **no se solapa**: `9-11` y `11-12` son compatibles y ambas se pueden aceptar.
- No se admiten solicitudes donde inicio ≥ fin, ni horas fuera de la jornada.
- Cuando la selección maximiza la cantidad, puede haber varias soluciones válidas; cualquiera que tenga la cantidad máxima es correcta.
- No se puede modificar el orden de las horas dentro de una solicitud (inicio siempre es la hora menor).

## Lo que se espera que diseñes

- Elige la estructura para representar cada solicitud (¿una clase mínima, o arreglos paralelos?) y justifica.
- Decide el criterio para ordenar las solicitudes antes de seleccionar: este es el corazón del problema.
- Define el orden de decisión: ¿qué haces cuando dos reuniones compiten por la misma franja?
- Argumenta por qué tu estrategia garante la mayor cantidad posible y no solo una solución "razonable".

*(No se entrega una firma de clases predefinida: el diseño es parte del ejercicio.)*

## Ejemplos de comportamiento esperado

**Escenario 1 (selección clara):**
```
Entrada / acción:
  "Alfa" 9-11
  "Beta" 10-12
  "Gamma" 11-13
  "Delta" 13-14
Resultado esperado: se aceptan Alfa, Gamma y Delta (3 reuniones) o Beta y Delta (2 no, porque 3 es el máximo)
```

**Escenario 2 (empate de criterios):**
```
Entrada / acción:
  "Alfa" 9-17
  "Beta" 9-10
  "Gamma" 10-11
Resultado esperado: el máximo es 2; se aceptan Beta y Gamma (la junta larga se rechaza aunque llegue primero)
```

**Escenario 3 (solicitud inválida):**
```
Entrada / acción: "Omega" 12-9
Resultado esperado: se rechaza esa solicitud por inválida y el programa sigue con el resto
```

**Escenario 4 (todas caben):**
```
Entrada / acción: reuniones consecutivas sin solape (9-10, 10-11, 11-12)
Resultado esperado: se aceptan todas; rechazadas: 0
```

## Preguntas de análisis previo (responder antes de programar)

1. ¿Qué información necesitas de cada solicitud para decidir? ¿Qué atributos identificas en el mundo real?
2. Si ordenas de una manera, ¿cambia lo que puedes aceptar? ¿Cómo sabes qué orden ayuda y cuál perjudica?
3. ¿Cómo compruebas que dos reuniones no se solapan sin casos borde?
4. ¿Qué podría salir mal? (rangos mal formados, empates, horas en los extremos de la jornada)

## Pistas de diseño (opcional, ocultables)

<details>
<summary>Ver pista de diseño</summary>

Prueba distintos criterios de ordenamiento (por inicio, por duración, por fin) con el escenario 2 y observa cuál te permite siempre "dejar hueco" para la mayor cantidad. La reunión que termina pronto suele dejar más espacio a las siguientes.

</details>

## Criterios de una buena solución

- La cantidad de reuniones aceptadas es siempre la máxima posible (no solo una selección "que sirva").
- Las reuniones compatibles por contigüidad (misma hora de fin e inicio) se aceptan sin confundirse con un solape.
- Las solicitudes inválidas se descartan sin romper el algoritmo ni falsear el conteo.
- El código separa claramente la validación de entrada, la selección y la presentación de resultados.
- Cambiar los horarios de la jornada (ej. abrir a las 7) no exige reescribir la estrategia.
