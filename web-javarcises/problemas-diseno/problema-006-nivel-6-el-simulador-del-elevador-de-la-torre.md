# Problema 006 - El simulador del elevador de la torre de oficinas

**Nivel:** 6 - Manejo de errores realista
**Categoría:** Simulación
**Enfoque POO:** Composición + excepciones personalizadas (`Elevador` contiene lista de `Pasajero`; las operaciones inválidas se comunican con excepciones propias)
**Dificultad estimada:** ⭐⭐⭐☆☆

## Contexto del problema

En una torre de oficinas de 8 pisos (0 a 7) se mueven miles de empleados entre la recepción y sus pisos a diario. La gerencia compró un simulador del edificio para estudiar el flujo de personas y decidir si el elevador actual —de 600 kg de carga máxima y capacidad de 10 personas— aguanta la presión o deben comprar otro antes de la temporada alta.

El simulador debe permitir "jugar" un turno del elevador: las personas suben con su peso, piden ir a un piso, el elevador se mueve y la gente baja cuando llega a su destino. Lo importante para la gerencia no es el juguete sino el reporte final: cuántas personas se transportaron, cuántos viajes se hicieron y cuál fue la carga máxima simultánea (en personas y en kilos) que soportó el elevador.

El simulador tiene que comportarse como un elevador real: si algo no se puede hacer, **debe decirlo con claridad y mantenerse estable**, sin quedarse bloqueado ni con el estado a medias. En un simulador nadie está al lado del equipo para reiniciarlo cuando se equivoca con un comando.

## Requisitos funcionales

- Modelar el edificio, el elevador y a las personas que van subiendo (cada una con nombre y peso).
- Permitir operaciones: subir una persona (indicando su piso de destino), mover el elevador a un piso y bajar a las personas que llegan a su destino.
- Mantener el estado del elevador: piso actual, lista de pasajeros a bordo y carga total en kilos.
- Rechazar con un mensaje claro toda operación inválida, sin romper la simulación.
- Al terminar, mostrar el reporte: personas transportadas, viajes realizados, pico de pasajeros simultáneos y pico de carga en kilos.

## Reglas de negocio / restricciones

- El edificio tiene pisos del 0 al 7; no existe otro piso.
- Capacidad: máximo **10 personas** y máximo **600 kg** a la vez. Ambas son límites duros y se evalúan siempre juntas.
- No se puede pedir mover el elevador al piso en el que ya está.
- Ninguna persona puede tener peso menor o igual a 0, ni subir sin un piso de destino válido.
- Una operación rechazada **no altera el estado**: si la persona no puede subir, no queda "a medias" dentro del elevador ni se pierde la lista de pasajeros existente.
- El reporte final debe reflejar los máximos realmente alcanzados, aunque la simulación termine con el elevador vacío.

## Lo que se espera que diseñes

- Identifica las clases necesarias: `Elevador`, `Pasajero` y lo que haga falta para el edificio.
- Decide cómo modelar los límites (capacidad y peso) y cómo garantizar que se evalúan juntos antes de aceptar a alguien a bordo.
- Define cómo expresar los errores: ¿retornar un valor, imprimir un mensaje y seguir, o lanzar y capturar excepciones propias con nombre? Justifica por qué tu opción es la adecuada en un simulador.
- Decide cómo llevar el registro de los picos (personas y kilos) a lo largo de toda la simulación.

*(No se entrega una firma de clases predefinida: el diseño es parte del ejercicio.)*

## Ejemplos de comportamiento esperado

**Escenario 1 (viaje normal):**
```
Entrada / acción: sube "Ana" (58 kg, destino piso 3); mover a 3
Resultado esperado: el elevador llega al piso 3, Ana baja, reporte parcial: 1 persona transportada, 1 viaje, pico 1 persona / 58 kg
```

**Escenario 2 (sobrecarga por peso):**
```
Entrada / acción: hay 5 personas a bordo (total 590 kg) y sube una de 40 kg
Resultado esperado: se rechaza por exceder los 600 kg; las 5 personas siguen a bordo y el reporte no cambia
```

**Escenario 3 (piso inexistente):**
```
Entrada / acción: mover el elevador al piso 9
Resultado esperado: mensaje de rechazo (piso inválido); el elevador conserva su piso y sus pasajeros
```

**Escenario 4 (capacidad de personas):**
```
Entrada / acción: ya hay 10 personas a bordo (todas livianas) y sube otra de 45 kg
Resultado esperado: se rechaza por capacidad; el estado del elevador queda intacto
```

## Preguntas de análisis previo (responder antes de programar)

1. ¿Qué entidades del mundo real identificas? ¿Qué atributos y comportamientos tiene cada una?
2. ¿Cuáles son los estados por los que pasa el elevador y qué operaciones son válidas en cada uno?
3. ¿Cómo decides cuándo una operación es inválida: al validarla en el momento o dejando que el cálculo falle? ¿Qué consecuencias tiene cada enfoque?
4. ¿Qué podría salir mal? (personas que se quedan para siempre a bordo, picos mal registrados, elevador que se mueve "de mentira")

## Pistas de diseño (opcional, ocultables)

<details>
<summary>Ver pista de diseño</summary>

Un simulador recibe muchos comandos seguidos de un usuario humano que se equivoca. Comunicar el error lanzando una excepción propia con nombre (ej. `SobrecargaException`) y capturarla en el lazo principal te deja centralizar el mensaje al usuario sin ensuciar la lógica del elevador ni dejarlo en un estado inconsistente.

</details>

## Criterios de una buena solución

- Tras una operación rechazada, el elevador queda exactamente igual que antes (misma piso, mismos pasajeros, misma carga).
- Los límites de personas y kilos se evalúan juntos, y ninguno se puede evadir alternando el orden de las operaciones.
- El reporte final acumula los picos reales, no solo el último estado.
- El mensaje de error identifica con claridad qué regla se violó (peso, personas, piso, destino).
- El diseño permite cambiar los límites (otro edificio, otro elevador) sin reescribir las operaciones.
