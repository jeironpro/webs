# Problema 014 - La cotización de pisos laminados de la constructora

**Nivel:** 4 - Herencia y polimorfismo
**Categoría:** Sistemas con jerarquías
**Enfoque POO:** Herencia y polimorfismo (`Figura` → `Rectangulo`, `Circulo`, `Triangulo`, cada una con un `calcularArea()` propio)
**Dificultad estimada:** ⭐⭐⭐☆☆

## Contexto del problema

La constructora "Ávila y Cía." cotiza los acabados de los apartamentos que termina. Para el laminado de pisos cobra **$95.000 por metro cuadrado**, pero no todos los espacios son rectángulos: hay pasillos redondos alrededor de columnas, balcones trapezoidales y zonas triangulares en las esquinas.

El jefe de obras pide hoy cotizaciones "a ojo" y el gerente se queja de que las cuentas nunca cuadran al final. Necesitan un programa donde el cotizador registre cada pieza del inmueble con su forma y sus medidas, y el sistema calcule el área exacta de cada una, el área total del inmueble y el costo del laminado. De paso, para validar el presupuesto, quieren saber cuál fue la **pieza de mayor área** de la obra.

Las formas que maneja la constructora son tres: rectángulos (largo y ancho), círculos (radio) y triángulos (base y altura). El cotizador se equivoca a veces con las medidas (anota cero, o negativos, o datos de más), así que el sistema debe rechazar piezas mal medidas sin desordenar las que ya están bien cotizadas.

## Requisitos funcionales

- Registrar piezas con una referencia (ej. "pasillo norte") y su forma con las medidas correspondientes.
- Calcular el área de cada pieza según su forma.
- Mostrar la cotización: área por pieza, área total del inmueble y costo total al precio de $95.000/m².
- Identificar la pieza de mayor área.
- Rechazar piezas con medidas inválidas (valores negativos o cero) manteniendo las válidas.

## Reglas de negocio / restricciones

- Áreas: rectángulo `largo × ancho`; círculo `π × radio²`; triángulo `(base × altura) / 2`.
- Toda medida debe ser **mayor a 0**; un 0 o un negativo rechaza la pieza con un mensaje.
- Las áreas se reportan con **dos decimales**; el costo total = área total × $95.000.
- La referencia de cada pieza es única; dos piezas no pueden llamarse igual.
- La constructora usará `π` con al menos 6 decimales para el círculo (el puesto no tolera errores por redondeo en la cotización).
- El reporte debe poder incluir muchas piezas del mismo inmueble sin que el acumulado se descuadre.

## Lo que se espera que diseñes

- Identifica la jerarquía de figuras y qué atributos son comunes (referencia, área) frente a los específicos de cada forma.
- Decide si `calcularArea()` vive en una clase base compartida o en cada subclase, y por qué.
- Decida cómo guardar la colección de piezas y cómo hallar después la de mayor área sin recalcular dos veces.
- Argumenta qué ganaría el sistema si la empresa agrega una cuarta forma (ej. hexágono) sin tocar la cotización.

*(No se entrega una firma de clases predefinida: el diseño es parte del ejercicio.)*

## Ejemplos de comportamiento esperado

**Escenario 1 (cotización completa):**
```
Entrada / acción:
  "sala" (rectángulo) 6.5 × 4.0
  "rincón" (triángulo) 3.0 × 2.0
Resultado esperado:
  sala: 26.00 m²; rincón: 3.00 m²; total 29.00 m²; costo $2.755.000
  (29.00 × 95.000 = 2.755.000)
```

**Escenario 2 (pieza de mayor área):**
```
Entrada / acción: un círculo de radio 2.0 (área ≈ 12.57) y un rectángulo 5.0 × 3.0 (15.00)
Resultado esperado: la pieza de mayor área es el rectángulo (15.00 m²)
```

**Escenario 3 (medida inválida):**
```
Entrada / acción: intentar registrar un rectángulo de 4.0 × 0
Resultado esperado: la pieza se rechaza con mensaje y no entra en la cotización ni en el total
```

**Escenario 4 (referencia duplicada):**
```
Entrada / acción: registrar dos piezas con la referencia "pasillo norte"
Resultado esperado: la segunda se rechaza y la primera permanece en la cotización
```

## Preguntas de análisis previo (responder antes de programar)

1. ¿Qué atributos comparten las tres figuras y cuáles son exclusivos de cada una?
2. ¿Cómo evitas que la cotización dependa de saber el tipo de cada pieza al momento de sumar y reportar?
3. ¿Cuándo validas las medidas: al registrar o al calcular? ¿Qué consecuencias tiene cada opción?
4. ¿Qué podría salir mal? (medidas negativas, área de un círculo mal redondeado, pieza duplicada, sumas con muchos decimales)

## Pistas de diseño (opcional, ocultables)

<details>
<summary>Ver pista de diseño</summary>

Si cada subclase implementa su propia `calcularArea()`, la cotización puede recorrer la colección llamando al mismo método sin saber con qué figura trata. La validación de medidas conviene hacerla en el constructor de cada figura, para que ningún objeto inválido llegue a la colección.

</details>

## Criterios de una buena solución

- El costo total y el área total se calculan sin redondeos acumulados que descuadren.
- Las piezas rechazadas nunca aparecen en la cotización ni en la selección de mayor área.
- Agregar una nueva forma (ej. hexágono regular) no exige modificar la lógica de cotización ni la del reporte.
- El polimorfismo evita `if` por tipo dentro de los cálculos.
- El reporte es correcto con una sola pieza, con muchas y con mezclas de las tres formas.
