# Problema 022 - El control de horas del vigilante del conjunto

**Nivel:** 3 - Colecciones + lógica de negocio
**Categoría:** Procesamiento de datos
**Enfoque POO:** Ninguno (problema de parseo y cálculo de tiempos: la dificultad está en los casos borde de las horas, no en el modelado de clases)
**Dificultad estimada:** ⭐⭐⭐☆☆

## Contexto del problema

El administrador del conjunto residencial paga al vigilante por horas y hasta ahora lleva las cuentas en una libreta: "entró a las 8:30, salió a las 17:45". Cada semana suma "más o menos" y le sobra o falta plata para el salario. Dos domingos al mes el vigilante hace el **turno que cruza la medianoche**: entra a las 22:00 y sale a las 02:30, y a mano ese cálculo siempre se enreda.

El administrador quiere un programa donde se anote por cada día la hora de entrada y de salida (formato 24 horas, `HH:MM`) y el sistema devuelva la duración de cada turno (en horas y minutos) y el **total semanal** en horas y minutos, para pedirle plata al tesorero con la cifra exacta.

Además, debe **rechazar las horas mal digitadas** —`25:00`, `08:70`, `8:30`, `abc`— sin romper la planilla del resto de la semana.

## Requisitos funcionales

- Recibir por cada registro la hora de entrada y la de salida en formato `HH:MM` de 24 horas.
- Calcular la duración del turno en horas y minutos, incluyendo los turnos que cruzan la medianoche.
- Mostrar cada registro con su duración (`Xh Ym`).
- Sumar todos los registros y mostrar el total semanal en horas y minutos.
- Rechazar registros con formato o rango inválido, sin contarlar en el total ni detener la semana.

## Reglas de negocio / restricciones

- Formato estricto `HH:MM`: hora de 00 a 23 y minutos de 00 a 59, siempre con dos dígitos (se rechaza `8:30`, `8.30`, letras, etc.).
- Si la hora de salida es **menor** que la de entrada, el turno **cruzó la medianoche**: la duración se calcula sumando 24 horas a la salida (ej. 22:00 → 02:30 son 4h 30m).
- Si la hora de salida **es igual** a la de entrada, se interpreta como un **turno de 24 horas** completas (el vigilante queda un día entero).
- Cada día solo puede tener un registro; registrar dos veces el mismo día se rechaza (se debe corregir el primero).
- Una duración nunca puede superar 24 horas.
- El total semanal es la suma de las duraciones válidas, presentada también en horas y minutos (los minutos se acumulan correctamente, sin "90 m" raros).

## Lo que se espera que diseñes

- Decide cómo parsear `HH:MM` a minutos totales y cómo validar en el mismo paso (formato y rango por dígito).
- Define la regla de la diferencia que cruza la medianoche sin ambigüedad (salida ≤ entrada).
- Elige cómo guardar los registros válidos de la semana y cómo evitar el duplicado del mismo día.
- Argumenta si conviene una función de "minutos a Xh Ym" única, reutilizada por el registro y por el total.

*(No se entrega una firma de clases predefinida: el diseño es parte del ejercicio.)*

## Ejemplos de comportamiento esperado

**Escenario 1 (turno diurno):**
```
Entrada / acción: entrada 08:30, salida 17:45
Resultado esperado: duración 9h 15m
```

**Escenario 2 (turno que cruza la medianoche):**
```
Entrada / acción: entrada 22:00, salida 02:30
Resultado esperado: duración 4h 30m (se suma la medianoche)
```

**Escenario 3 (turno de día completo):**
```
Entrada / acción: entrada 00:00, salida 00:00
Resultado esperado: duración 24h 0m
```

**Escenario 4 (hora inválida):**
```
Entrada / acción: entrada 08:30, salida 12:75 (o "25:00", o "8:30")
Resultado esperado: el registro se rechaza con su causa y el resto de la semana sigue
```

**Escenario 5 (total semanal):**
```
Entrada / acción: registros de 9h15m, 4h30m y 24h00m (todos válidos en días distintos)
Resultado esperado: total 37h 45m (no 36h 45m por errores de acarreo)
```

## Preguntas de análisis previo (responder antes de programar)

1. ¿Qué pasos necesitas para pasar `HH:MM` a minutos y volver a presentarlos como `Xh Ym` sin errores de acarreo?
2. ¿Cómo decides, con solo comparar horas, cuándo un turno cruzó la medianoche?
3. ¿Qué haces con un registro duplicado del mismo día y con uno mal formateado para no contaminar el total?
4. ¿Qué podría salir mal? (minutos que superan 59, hora 24, medianoche exacta, total que pasa de 48h en la semana, datos con espacios)

## Pistas de diseño (opcional, ocultables)

<details>
<summary>Ver pista de diseño</summary>

Trabaja todo en **minutos** (entrada → minutos desde 00:00, salida → minutos desde 00:00). La resta, con el ajuste de +1440 cuando salida ≤ entrada, te da la duración y elimina los casos raros de la medianoche; solo al final conviertes a horas y minutos con división entera y módulo.

</details>

## Criterios de una buena solución

- El formato se valida carácter a carácter: dos dígitos de hora (00–23), dos de minutos (00–59) y los dos puntos exactos.
- El turno que cruza la medianoche y el de 24 horas exactas se calculan sin ambigüedad.
- Los registros inválidos o duplicados del día se rechazan, no se duplican en el total y no detienen la semana.
- El total semanal acumula minutos correctamente (60 min = 1 h) en cualquier combinación.
- Cambiar la presentación (ej. "09:15" en vez de "9h 15m") no obliga a tocar los cálculos.
