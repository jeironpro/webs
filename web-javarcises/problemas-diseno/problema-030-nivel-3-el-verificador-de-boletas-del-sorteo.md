# Problema 030 - El verificador de boletas del sorteo

**Nivel:** 3 - Colecciones + lógica de negocio
**Categoría:** Juegos y lógica
**Enfoque POO:** Ninguno (problema de conteo de coincidencias y validación: la dificultad está en las reglas, no en el modelado de clases)
**Dificultad estimada:** ⭐⭐⭐☆☆

## Contexto del problema

La feria del pueblo vuelve a hacer su sorteo insignia: cada boleto trae **6 números del 1 al 45**, distintos entre sí, y al final de la noche se sortean los **6 ganadores**. La persona que revisa las boletas a mano tarda una eternidad y, para animar el juego, la tarima promete premios por cantidad de aciertos: 4 aciertos dan un premio bajo, 5 un premio alto y 6 el gran premio.

Como el dueño de la feria ya perdió plata una vez por una boleta mal revisada, quiere un programa donde se carguen las boletas vendidas (cada una con 6 números) y, tras el sorteo, salga para cada una **cuántos aciertos tuvo** (no importa el orden) y **qué premio le corresponde**. Las boletas mal impresas duelen: con números repetidos, fuera del rango del 1 al 45 o con cantidad distinta a 6, se deben **rechazar** antes de revisarse, para no entregar premios de boletas inválidas.

## Requisitos funcionales

- Registrar boletas con 6 números del 1 al 45 (sin repetir).
- Cargar el sorteo: 6 números ganadores (del 1 al 45, sin repetir).
- Contar los aciertos de cada boleta frente al sorteo (sin importar el orden).
- Asignar el premio por aciertos (4, 5 o 6) o "sin premio".
- Mostrar por boleta su resultado y el total pagado en premios; rechazar boletas inválidas.

## Reglas de negocio / restricciones

- Un boleto válido tiene **exactamente 6 números**, todos del **1 al 45**, **sin repetir**.
- Una boleta que repite números, saca un número fuera de rango o trae otra cantidad se **rechaza** y no participa.
- El sorteo también trae 6 números del 1 al 45 sin repetir; un sorteo mal formado se rechaza antes de revisar.
- Los aciertos cuentan coincidencias sin importar el orden: si el boleto y el sorteo comparten el 7, es un acierto sin importar la posición.
- Premios por aciertos: **6 → gran premio**, **5 → premio alto**, **4 → premio bajo**, **3 o menos → sin premio**.
- El total pagado suma solo las boletas válidas con premio.

## Lo que se espera que diseñes

- Elige la estructura para guardar los números de una boleta y poder consultar coincidencias sin revisar posición por posición.
- Decide cómo validar cada boleta en un solo paso (cantidad, rango y duplicados).
- Define la clasificación premio/aciertos en un solo lugar reutilizable.
- Argumenta si merece una clase `Boleto` o basta con una estructura de datos con funciones.

*(No se entrega una firma de clases predefinida: el diseño es parte del ejercicio.)*

## Ejemplos de comportamiento esperado

**Escenario 1 (boleta con aciertos):**
```
Entrada / acción: sorteo = {7, 13, 22, 30, 35, 44}; boleto = {13, 5, 44, 27, 1, 30}
Resultado esperado: 3 aciertos (13, 44, 30) → sin premio
```

**Escenario 2 (gran premio):**
```
Entrada / acción: boleto con los mismos 6 números del sorteo
Resultado esperado: 6 aciertos → gran premio
```

**Escenario 3 (premios por escalones):**
```
Entrada / acción: 4, 5 y 6 aciertos en boletas distintas
Resultado esperado: premio bajo, premio alto y gran premio respectivamente
```

**Escenario 4 (boleta inválida):**
```
Entrada / acción: boleto con un número repetido, o uno fuera de 1-45, o 5 números
Resultado esperado: boleta rechazada con el motivo; no participa ni gana premio
```

**Escenario 5 (total de premios):**
```
Entrada / acción: dos boletas válidas: una de premio bajo y otra de premio alto
Resultado esperado: el total pagado es la suma de los dos premios correspondientes
```

## Preguntas de análisis previo (responder antes de programar)

1. ¿Cómo verificas que una boleta no repite números y que todos están en el rango?
2. ¿Cómo cuentas las coincidencias con el sorteo ignorando el orden de las posiciones?
3. ¿Qué pasa si el sorteo y una boleta comparten los mismos valores pero en posiciones distintas?
4. ¿Qué podría salir mal? (sorteo con duplicados, boletas "vacías", números que se tocan el límite 1 o 45, más de 6 coincidencias por boleto)

## Pistas de diseño (opcional, ocultables)

<details>
<summary>Ver pista de diseño</summary>

Si guardas los números de cada boleta y del sorteo en estructuras que permitan consultar "¿está este número?", los aciertos son contar cuántos números del boleto están en el sorteo, en una sola pasada y sin importar el orden. La validación de cada boleta (cantidad exacta 6, rango, sin repetidos) se hace antes de guardarla.

</details>

## Criterios de una buena solución

- La validación de boleto (6 números, 1–45, sin repetir) se aplica siempre antes de revisar premios.
- Los aciertos se cuentan sin importar el orden y sin contar dos veces el mismo número.
- Los escalones de premio (4, 5, 6) se aplican exactamente en sus límites.
- El total pagado solo considera boletas válidas con premio, y el sorteo inválido se rechaza antes.
- Cambiar el rango (ej. del 1 al 49) no obliga a reescribir el conteo.
