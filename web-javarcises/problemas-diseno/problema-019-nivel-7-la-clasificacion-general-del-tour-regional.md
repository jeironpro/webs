# Problema 019 - La clasificación general del tour regional de ciclismo

**Nivel:** 7 - Algoritmos aplicados
**Categoría:** Procesamiento de datos
**Enfoque POO:** Composición (`Campeonato` gestiona `Ciclista` y las `Etapa` con resultados)
**Dificultad estimada:** ⭐⭐⭐☆

## Contexto del problema

El comité organizador del tour regional de ciclismo registra a mano los tiempos de cada etapa en planillas de papel y calcula la clasificación general "sumando" con calculadora. Con 30 corredores y 8 etapas, cada etapa rehacen las cuentas desde cero, y cuando dos corredores empatan en tiempo nadie sabe cómo desempatar.

El comité compró un computador de segunda mano y quiere un programa que lleve el campeonato completo: registrar a los corredores con su **dorsal** único, cargar los resultados por etapa (tiempo en segundos, o marca de **retiro** para quien abandona la carrera), y calcular dos cosas: la **clasificación de cada etapa** (tiempos de menor a mayor) y la **clasificación general** (suma de tiempos de todas las etapas). Cuando alguien se retira, su nombre y su etapa de retiro se guardan aparte: en la general no puede seguir sumando tiempos de etapas que no corrió.

Tiene que quedar clarísimo el **desempate**: si dos o más corredores suman el mismo tiempo total, se ordena primero el de **menor dorsal**.

## Requisitos funcionales

- Registrar corredores con dorsal (entero único), nombre y equipo.
- Registrar una etapa con los resultados de sus corredores: tiempo en segundos o retiro.
- Mostrar la clasificación de una etapa (de menor a mayor tiempo).
- Mostrar la clasificación general (suma de tiempos por corredor) con el desempate por dorsal.
- Listar los retirados, indicando en qué etapa se retiraron.

## Reglas de negocio / restricciones

- El dorsal es único; no se puede repetir entre corredores.
- Un corredor no puede registrar **dos tiempos en la misma etapa** (ni un tiempo y luego un retiro).
- Quien se retira en una etapa **no puede** registrar tiempos en etapas siguientes: su general queda congelada y se muestra aparte.
- La clasificación general solo suma a los corredores que siguen en carrera; los tiempos de las etapas ya corridas por un retirado no se suman en general.
- Empate en el tiempo total de la general: ordena por **menor dorsal**.
- Un corredor sin resultado en una etapa no aparece en la clasificación de esa etapa, pero sigue apareciendo en la general con lo que lleva sumado.
- Los tiempos son enteros no negativos (segundos); un tiempo negativo o un dorsal inexistente se rechaza.

## Lo que se espera que diseñes

- Identifica las clases necesarias (`Ciclista`, `Etapa`, `Campeonato`) y qué responsabilidades repartes.
- Decide cómo guardar los tiempos por corredor y por etapa para poder sumar la general sin recalcular desde cero.
- Define cómo representar el estado "retirado" sin confundirlo con una etapa no corrida.
- Argumenta dónde debe vivir la lógica de ordenamiento y desempate para que etapa y general la compartan sin duplicarla.

*(No se entrega una firma de clases predefinida: el diseño es parte del ejercicio.)*

## Ejemplos de comportamiento esperado

**Escenario 1 (clasificación de etapa):**
```
Entrada / acción: etapa 1 con (dorsal 10: 3600), (dorsal 5: 3550), (dorsal 8: 3620)
Resultado esperado: orden 5 (3550), 10 (3600), 8 (3620)
```

**Escenario 2 (general acumulada):**
```
Entrada / acción: etapa 1: 5→3550, 10→3600; etapa 2: 10→3400, 5→3700
Resultado esperado: general: 10 con 7000 (3600+3400) delante de 5 con 7250 (3550+3700)
```

**Escenario 3 (desempate por dorsal):**
```
Entrada / acción: 5 y 10 suman ambos 7000
Resultado esperado: en la general aparece primero el dorsal 5 (menor dorsal), sin importar el equipo
```

**Escenario 4 (retiro):**
```
Entrada / acción: dorsal 8 se retira en la etapa 2
Resultado esperado: 8 se lista en retirados (etapa 2); en la general de la etapa 3 en adelante no aparece, y en la etapa 2 no puede registrar tiempo
```

**Escenario 5 (dorsal inexistente):**
```
Entrada / acción: registrar tiempo para el dorsal 99 que no existe
Resultado esperado: se rechaza el resultado y la etapa queda como estaba
```

## Preguntas de análisis previo (responder antes de programar)

1. ¿Qué información necesita el campeonato para responder la general sin reprocesar planillas desde cero?
2. ¿Cómo distingues "no corrió esta etapa" de "se retiró" sin borrar su historial?
3. ¿Cuándo vales el dorsal: al registrar el corredor, al cargar resultados, o en ambos?
4. ¿Qué podría salir mal? (tiempos duplicados en una etapa, retiro que sigue sumando, empates con tres corredores, corredor sin ni una etapa)

## Pistas de diseño (opcional, ocultables)

<details>
<summary>Ver pista de diseño</summary>

Guarda por cada corredor su suma acumulada y su estado (activo/retirado) como parte de `Ciclista`; la etapa solo recopila los tiempos del día. Así, la general recorre la lista de corredores y ordena por (suma, dorsal) sin volver a leer historial. El retiro se registra como un único estado que anula los resultados futuros.

</details>

## Criterios de una buena solución

- La clasificación de etapa y la general usan la misma regla de orden: tiempo menor primero, dorsal menor en empate.
- Un retirado no suma más en general y queda reportado con su etapa de retiro.
- No se puede duplicar un resultado en la misma etapa ni registrar tiempo para un dorsal que no existe.
- La general se mantiene consistente aunque falten resultados de algunos corredores en una etapa.
- Agregar una etapa nueva o más corredores no exige reescribir la lógica de clasificación.
