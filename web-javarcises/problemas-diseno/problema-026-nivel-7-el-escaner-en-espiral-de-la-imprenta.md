# Problema 026 - El escáner en espiral de la imprenta

**Nivel:** 7 - Algoritmos aplicados
**Categoría:** Procesamiento de datos
**Enfoque POO:** Ninguno (problema de recorrido de una matriz: la dificultad está en las vueltas y los extremos, no en el modelado de clases)
**Dificultad estimada:** ⭐⭐⭐☆☆

## Contexto del problema

La imprenta digital escanea las planchas de los letreros con un brazo móvil. El brazo tarda lo mismo en recorrer cada celda, pero **volverte a devolver cuesta**: cada vez que el brazo sube o baja de fila debe frenar y cambiar de dirección. Para minimizar esos cambios, el técnico descubrió que conviene **recorrer la plancha en espiral desde la esquina superior izquierda**: derecha, abajo, izquierda, arriba, y otra vez hacia adentro, hasta el centro de la plancha.

La plancha es una matriz rectangular de números (cada celda almacena un valor, por ejemplo el tono de tinta). El programa debe leer esa matriz y entregar la **secuencia de celdas en orden de recorrido espiral**, comenzando en la celda de arriba a la izquierda y girando en sentido de las agujas del reloj.

El control de calidad además necesita validar la plancha antes de escanearla: la matriz no puede estar vacía y **todas las filas deben tener la misma cantidad de columnas**; una plancha mal formateada se rechaza antes de gastar tinta.

## Requisitos funcionales

- Recibir una matriz rectangular de valores enteros (filas × columnas).
- Recorrerla en espiral (derecha → abajo → izquierda → arriba → ...) desde la esquina superior izquierda.
- Mostrar la secuencia de valores en el orden del recorrido.
- Rechazar matrices vacías o con filas de largo desigual, con un mensaje claro.

## Reglas de negocio / restricciones

- La matriz tiene **al menos 1 fila y 1 columna**; una matriz vacía se rechaza.
- Todas las filas tienen **exactamente la misma cantidad** de columnas; cualquier fila de distinto largo invalida la matriz completa.
- El recorrido empieza en la celda `(fila 0, columna 0)` y gira en sentido horario.
- Cada celda se lee **una sola vez**, sin repetir y sin saltarse ninguna.
- El recorrido debe funcionar para matrices cuadradas y rectangulares (incluidas las de una sola fila, una sola columna y las de 1×1).
- El orden de los valores depende de la geometría de la matriz, no de lo que valgan las celdas.

## Lo que se espera que diseñes

- Decide cómo representar la matriz (lista de listas, arreglo 2D) y cómo validar sus dimensiones antes de recorrerla.
- Elige la estrategia de control del recorrido: ¿cambios de dirección por capas/límites, o marcando celdas ya visitadas? Justifica.
- Define las condiciones exactas de giro (cuándo bajas en la última columna, cuándo subes, cuándo llegas al centro).
- Argumenta si una clase "Matriz" conviene aquí o si basta con funciones sobre la estructura elegida.

*(No se entrega una firma de clases predefinida: el diseño es parte del ejercicio.)*

## Ejemplos de comportamiento esperado

**Escenario 1 (matriz 3×4):**
```
Entrada / acción:
  1  2  3  4
  5  6  7  8
  9 10 11 12
Resultado esperado: 1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7
```

**Escenario 2 (una sola fila):**
```
Entrada / acción: 1 × 4 → [10, 20, 30, 40]
Resultado esperado: 10, 20, 30, 40 (sin vueltas innecesarias)
```

**Escenario 3 (matriz 2×2 en espiral):**
```
Entrada / acción:
  1 2
  3 4
Resultado esperado: 1, 2, 4, 3
```

**Escenario 4 (matriz 1×1):**
```
Entrada / acción: [[7]]
Resultado esperado: 7
```

**Escenario 5 (plancha mal formada):**
```
Entrada / acción: fila 1 con 3 valores y fila 2 con 2 valores
Resultado esperado: rechazo por filas de largo desigual; no se produce recorrido
```

## Preguntas de análisis previo (responder antes de programar)

1. ¿Qué información necesita tu recorrido para saber cuándo girar y cuándo terminar?
2. ¿Qué pasa con el último tramo de la espiral en una matriz rectangular (por ejemplo 3×4) frente a una cuadrada?
3. ¿Cómo evitas visitar dos veces una celda del centro o de los extremos?
4. ¿Qué podría salir mal? (matriz vacía, filas desiguales, matrices muy angostas o muy fisgadas, la doble lectura del pivote del centro)

## Pistas de diseño (opcional, ocultables)

<details>
<summary>Ver pista de diseño</summary>

Lleva cuatro límites (superior, inferior, izquierdo y derecho) en vez de mirar celdas adyacentes: cuando terminas una pasada (por ejemplo, toda la fila de arriba), el límite superior desciende, y la espiral se corta cuando los límites se cruzan. Te serviría recorrer por tramos completos en vez de celda por celda con giros a cada paso.

</details>

## Criterios de una buena solución

- Cada celda se emite exactamente una vez; la secuencia es correcta en matrices cuadradas y rectangulares.
- Los casos extremos (1×N, N×1, 2×2, 1×1) salen sin errores y en el orden esperado.
- La validación de dimensiones sucede antes del recorrido y rechaza con el motivo (vacía, filas desiguales).
- El código no repite el movimiento "girar y avanzar" en cada paso si usa la estrategia por límites.
- Cambiar el contenido de las celdas no altera el recorrido, y viceversa.
