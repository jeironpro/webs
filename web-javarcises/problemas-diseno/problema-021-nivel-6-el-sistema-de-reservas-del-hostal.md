# Problema 021 - El sistema de reservas del hostal de la montaña

**Nivel:** 6 - Manejo de errores realista
**Categoría:** Gestión / CRUD conceptual
**Enfoque POO:** Composición + excepciones personalizadas (`Hostal` gestiona `Habitacion` y `Reserva`; las violaciones de reglas se comunican con excepciones propias)
**Dificultad estimada:** ⭐⭐⭐☆☆

## Contexto del problema

El hostal de la montaña tiene habitaciones de distinta capacidad; cada una con su número y su tarifa por noche. El administrador recibe reservas por teléfono y las anota en una agenda de papel. Los problemas se repiten: se reservan dos grupos en la misma habitación para las mismas fechas (porque nadie revisa la agenda), llega una familia de 6 a una habitación de 4, y cuando un huésped cancela nadie tacha la página.

Quiere un programa de consola donde cada reserva quede con su rango de fechas (entrada y salida, como días del año 1 a 365), el número de personas, y se **rechace con claridad** lo que no se puede hacer: cruce de fechas en la misma habitación, personas de más para la capacidad, fechas de salida antes que la entrada, o fechas fuera del año.

También necesita: **disponibilidad** (qué habitaciones quedan libres para un rango dado, y cuánto costarían), **cancelación** que libere la habitación de inmediato, y un reporte de **ocupación por fecha** para saber si suena a lleno o a vacío.

## Requisitos funcionales

- Registrar habitaciones (número único, capacidad, tarifa por noche).
- Crear una reserva: habitación, fecha de entrada, fecha de salida y número de personas.
- Cancelar una reserva por su identificador, liberando la habitación.
- Consultar disponibilidad para un rango de fechas y una cantidad de personas: habitaciones libres y costo por noches.
- Mostrar la ocupación por fecha (habitaciones ocupadas de las totales) y el total recaudado con las reservas vigentes.

## Reglas de negocio / restricciones

- Rango válido: `1 ≤ entrada < salida ≤ 365`; fuera de eso, la reserva se rechaza.
- Personas: deben ser **> 0** y no superar la capacidad de la habitación.
- **Sin cruce** en la misma habitación: dos reservas no pueden tener fechas que se intersequen. (Una que termina el día X y otra que empieza el día X no se cruzan.)
- El identificador de reserva es único; cancelar un id inexistente se rechaza.
- Costo = `(salida − entrada) × tarifa por noche`, con la tarifa de la habitación.
- Una cancelación libera el rango de inmediato (la habitación vuelve a estar disponible para ese rango).
- La ocupación por fecha cuenta solo reservas **vigentes** (no canceladas).

## Lo que se espera que diseñes

- Identifica las clases: qué es una habitación, qué es una reserva y qué las relaciona.
- Decide cómo verificar el cruce de fechas sin recorrer indebidamente (¿qué compara una reserva nueva con las existentes?).
- Elige cómo expresar cada rechazo (excepciones propias con nombre, o resultado de validación) y justifica para un programa manejado por teclado.
- Decide cómo responder disponibilidad y ocupación por fecha aprovechando la misma estructura de reservas.

*(No se entrega una firma de clases predefinida: el diseño es parte del ejercicio.)*

## Ejemplos de comportamiento esperado

**Escenario 1 (reserva normal):**
```
Entrada / acción: habitación 3 (capacidad 2, $60.000/noche), entrada día 10, salida día 12, 2 personas
Resultado esperado: se crea la reserva; costo = 2 noches × $60.000 = $120.000
```

**Escenario 2 (cruce de fechas rechazado):**
```
Entrada / acción: la misma habitación 3 ya está reservada del 10 al 12; se intenta reservar del 11 al 14
Resultado esperado: rechazo por cruce de fechas; la reserva original permanece intacta
```

**Escenario 3 (fechas contiguas permitidas):**
```
Entrada / acción: habitación 3 está reservada del 10 al 12; se reserva del 12 al 15
Resultado esperado: se acepta (el día 12 es salida de una y entrada de la otra, no se cruzan)
```

**Escenario 4 (capacidad excedida):**
```
Entrada / acción: reservar la habitación 3 (capacidad 2) para 4 personas
Resultado esperado: rechazo por capacidad; no se crea la reserva
```

**Escenario 5 (cancelación libera):**
```
Entrada / acción: cancelar la reserva del 10 al 12 de la habitación 3
Resultado esperado: la habitación 3 queda libre para ese rango; una nueva reserva del 10 al 12 vuelve a ser posible
```

**Escenario 6 (rango inválido):**
```
Entrada / acción: entrada día 15 y salida día 10 (salida < entrada)
Resultado esperado: rechazo por rango inválido
```

## Preguntas de análisis previo (responder antes de programar)

1. ¿Qué entidades del mundo real identificas y qué atributos y comportamientos tiene cada una?
2. ¿Cuál es la condición exacta para que dos intervalos de fechas se crucen?
3. ¿Cómo hace la cancelación para "devolver" el rango sin dejar reservas fantasma?
4. ¿Qué podría salir mal? (fechas de entrada=salida, reserva doble en el mismo instante, persona con días contiguos, tarifas o capacidades inválidas al registrar habitaciones)

## Pistas de diseño (opcional, ocultables)

<details>
<summary>Ver pista de diseño</summary>

Un hostal "tiene" habitaciones y cada habitación "tiene" su lista de reservas: puedes preguntarle a la habitación si un rango cruza alguna reserva suya, en lugar de recorrer todo el hostal. La validación de rangos, capacidad y cruces conviene agruparla en un solo punto de entrada de creación de reservas.

</details>

## Criterios de una buena solución

- La regla de cruce es exacta: contiguos se permiten, intersección real se rechaza.
- Los rechazos (rango, capacidad, cruce, id inexistente) no dejan reservas a medias ni liberan fechas sin querer.
- La cancelación devuelve la habitación al estado disponible de inmediato.
- Disponibilidad, costo y ocupación por fecha se calculan solo sobre reservas vigentes.
- Agregar una habitación nueva o cambiar su tarifa no obliga a reescribir la lógica de reservas.
