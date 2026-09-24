# Problema 001 - El termómetro del cuarto de servidores

**Nivel:** 1 - Modelado simple
**Categoría:** Procesamiento de datos
**Enfoque POO:** Ninguno (problema procedural: el diseño de clases no aporta valor aquí)
**Dificultad estimada:** ⭐⭐☆☆☆

## Contexto del problema

El cuarto de servidores de una universidad aloja los equipos que dan servicio a toda la sede. El personal de infraestructura instaló un sensor que toma una lectura de temperatura cada hora (a las 0:00, 1:00, ... hasta las 23:00) y almacena las 24 lecturas del día.

El jefe del equipo leyó el manual del fabricante: cuando la temperatura se mantiene en **28°C o más durante tres horas consecutivas o más**, existe riesgo de sobrecalentamiento y deben activarse los ventiladores auxiliares. Hasta ahora el personal revisaba las lecturas "a ojo", pero eso es lento y propenso a errores con días largos de muchas horas de calor.

Necesitan un programa que reciba las 24 lecturas del día y **detecte automáticamente todas las rachas de riesgo**, indicando en qué horas comenzó y terminó cada una y cuál fue la temperatura más alta registrada en la racha. Nadie quiere revisar el listado completo con la vista cada día.

## Requisitos funcionales

- Recibir las 24 lecturas del día, una por cada hora de 0 a 23, en orden.
- Detectar toda racha de **3 o más horas consecutivas** con temperatura **mayor o igual a 28.0°C**.
- Reportar cada racha con su hora de inicio, hora de fin y temperatura máxima dentro de la racha.
- Si no hay ninguna racha, informar que el día estuvo sin riesgo.

## Reglas de negocio / restricciones

- El umbral es **inclusivo**: una lectura de exactamente 28.0°C cuenta como riesgo.
- Una lectura se registra en **una sola hora**; las horas van de 0 a 23 y el día termina en la hora 23 (no hay continuidad con la medianoche siguiente).
- Una racha de 4 o más horas **no** debe partirse en varias rachas de 3: se reporta como una sola racha larga.
- Cualquier lectura inválida (negativa o mayor a 50.0°C) hace que el proceso se **detenga con un mensaje de error**; no se debe intentar continuar con datos corruptos.
- La cantidad de lecturas debe ser exactamente 24; si no, el programa debe rechazar la entrada.

## Lo que se espera que diseñes

- Estructura para almacenar las lecturas en memoria respetando el orden de las horas.
- Lógica para recorrer las lecturas, agrupar horas consecutivas de riesgo y cortar la racha correctamente.
- Manera de validar la entrada antes de procesar.
- Decisión consciente: ¿creas una clase para representar una racha o basta con llevar el cálculo con variables? Argumenta por qué en tu respuesta.

*(No se entrega una firma de clases predefinida: el diseño es parte del ejercicio.)*

## Ejemplos de comportamiento esperado

**Escenario 1 (un día con dos rachas):**
```
Entrada / acción: 24.5 25.0 29.0 30.0 31.5 27.0 26.0 26.5 28.0 28.5 29.0 29.5 27.0 ... (23.0 al final)
Resultado esperado:
  Racha de riesgo: hora 2 a hora 4 (máx 31.5°C)
  Racha de riesgo: hora 8 a hora 11 (máx 29.5°C)
  Total de rachas de riesgo: 2
```

**Escenario 2 (día sin riesgo):**
```
Entrada / acción: 22.0 23.5 24.0 25.0 26.5 27.9 26.0 ... (todas bajo el umbral)
Resultado esperado: Sin rachas de riesgo térmico en el día.
```

**Escenario 3 (racha exacta de 3 horas al inicio):**
```
Entrada / acción: 28.0 28.5 29.0 25.0 ...
Resultado esperado: Racha de riesgo: hora 0 a hora 2 (máx 29.0°C)
```

**Escenario 4 (dato inválido):**
```
Entrada / acción: 24.0 55.0 27.0 ... (una lectura supera 50.0)
Resultado esperado: El proceso se detiene con un mensaje de error indicando la hora del dato inválido.
```

## Preguntas de análisis previo (responder antes de programar)

1. ¿Qué entidades del mundo real identificas en este problema? ¿Alguna amerita ser una clase con estado?
2. ¿Cómo sabes cuándo "termina" una racha de riesgo? ¿Cuándo se "pega" una hora nueva a la racha?
3. ¿Qué pasa si las horas de riesgo empiezan en la hora 0 o terminan en la hora 23?
4. ¿Qué podría salir mal? (cantidad de datos, valores fuera de rango, umbral exacto)

## Pistas de diseño (opcional, ocultables)

<details>
<summary>Ver pista de diseño</summary>

Llevar un contador de horas consecutivas en riesgo: cuando la lectura actual está por debajo del umbral y el contador ya llegó a 3 o más, esa racha terminó y debes cerrarla. Considera qué hacer cuando la racha queda "abierta" hasta la hora 23, al salir del bucle.

</details>

## Criterios de una buena solución

- El umbral 28.0°C se maneja con la in igualdad correcta (≥), sin errores por límites.
- Las rachas largas se reportan completas, no partidas en segmentos de 3.
- La validación de entrada ocurre antes del procesamiento y detiene el programa con un mensaje claro.
- La lectura del código no depende de conocer "el truco": las variables tienen nombres que describen lo que almacenan.
- El programa funciona con día sin riesgo, rachas al borde del día y racha máxima de 24 horas.
