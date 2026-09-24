# Problema 005 - La nómina de la startup de software

**Nivel:** 4 - Herencia y polimorfismo
**Categoría:** Sistemas con jerarquías
**Enfoque POO:** Herencia y polimorfismo (`Empleado` → `EmpleadoTiempoCompleto`, `EmpleadoMedioTiempo`, `EmpleadoPorComision`)
**Dificultad estimada:** ⭐⭐⭐☆☆

## Contexto del problema

La startup de software "Bitácora" tiene tres tipos de empleados: programadores de tiempo completo (salario fijo mensual), estudiantes que trabajan medio tiempo pagados por hora, y vendedores comerciales que reciben una base mensual más un porcentaje de las ventas que cierran.

El tesorero lleva la nómina en una hoja de cálculo, pero cada mes debe recalcular todo a mano y se le olvida aplicar una regla nueva: la ley exige que los empleados por horas **no superen 192 horas al mes** y que ningún salario mensual quede por debajo del salario mínimo legal ($1.300.000). Además, pasó el fin de año y la retención en la fuente cambió: desde enero, quien gane **$5.200.000 o más** sufre una retención del 4%.

El tesorero quiere un programa que, con la lista de empleados cargada, calcule la nómina del mes: cuánto recibe cada uno (con o sin retención), el total a pagar, y un reporte ordenado de mayor a menor sueldo neto para que el gerente vea de un vistazo la estructura salarial. La hoja de cálculo ya no da abasto.

## Requisitos funcionales

- Cargar empleados con su identificador único, nombre y su esquema de pago según el tipo.
- Calcular el salario bruto de cada empleado según su tipo y sus datos propios.
- Aplicar la retención del 4% cuando el salario bruto alcanza el umbral.
- Mostrar el listado con nombre, tipo, salario bruto, retención (si aplica) y salario neto.
- Mostrar el total de la nómina y el listado ordenado de mayor a menor salario neto.
- Detectar y reportar empleados en situación irregular (que no cumplen las reglas legales) sin que el cálculo del resto se detenga.

## Reglas de negocio / restricciones

- **Tiempo completo:** salario mensual fijo. No puede ser menor al salario mínimo ($1.300.000) ni negativo.
- **Medio tiempo:** se paga `tarifa por hora × horas del mes`. Las horas deben estar entre 1 y 192, y la tarifa debe ser positiva.
- **Por comisión:** base mensual **más** un porcentaje (0 a 100) de las ventas del mes. Las ventas no pueden ser negativas.
- Retención del 4% cuando el salario **bruto** es ≥ $5.200.000.
- El identificador es único: no puede haber dos empleados con la misma cédula.
- Ningún salario neto puede dar negativo; si un empleado es irregular, se lista con su motivo pero no se incluye en el total.

## Lo que se espera que diseñes

- Identifica la jerarquía de clases: qué es común a todos y qué cambia entre tipos, y cómo lo capturas para no repetir código.
- Decide dónde vive el cálculo de salario: ¿un método compartido y sobrescrito, o lógica duplicada?
- Decide cómo almacenar la lista de empleados y cómo garantizar la unicidad del identificador.
- Argumenta qué gana el diseño al erar con la clase base y no conocer el tipo concreto de cada empleado.

*(No se entrega una firma de clases predefinida: el diseño es parte del ejercicio.)*

## Ejemplos de comportamiento esperado

**Escenario 1 (tres tipos diferentes):**
```
Entrada / acción:
  María, tiempo completo, salario $3.000.000
  Juan, medio tiempo, 80 horas a $15.000/hora → bruto $1.200.000
  Luis, por comisión, base $1.000.000, ventas $10.000.000 al 10%
Resultado esperado: brutos $3.000.000, $1.200.000 y $2.000.000; el listado se ordena María → Luis → Juan
```

**Escenario 2 (retención aplica):**
```
Entrada / acción: un tiempo completo con salario $6.000.000
Resultado esperado: bruto $6.000.000, retención $240.000, neto $5.760.000
```

**Escenario 3 (empleado irregular):**
```
Entrada / acción: un medio tiempo con 210 horas en el mes
Resultado esperado: el empleado se reporta como irregular ("horas superan el límite legal") y no entra al total
```

**Escenario 4 (identificador duplicado):**
```
Entrada / acción: intentar cargar dos empleados con la misma cédula
Resultado esperado: el segundo se rechaza con un mensaje y el primero permanece
```

## Preguntas de análisis previo (responder antes de programar)

1. ¿Qué atributos y comportamientos comparten todos los empleados? ¿Cuáles son exclusivos de cada tipo?
2. ¿Dónde conviene declarar el atributo común y dónde declarar los específicos?
3. ¿Cómo evitas que la lista de empleados tenga dos objetos con la misma cédula?
4. ¿Qué podría salir mal? (horas fuera de rango, salario bajo el mínimo, retención mal aplicada en el límite exacto, ventas negativas)

## Pistas de diseño (opcional, ocultables)

<details>
<summary>Ver pista de diseño</summary>

Un método `calcularSalario()` en la clase base que cada subtipo sobrescribe evita tener `if` por tipo en el código del tesorero. Asegúrate de que cada subtipo valide sus propios datos en su propia inicialización, antes de que el cálculo lo use.

</details>

## Criterios de una buena solución

- Agregar un cuarto tipo de empleado (ej. pasantes) no exige tocar el código que calcula la nómina ni el que la ordena.
- La retención se aplica sobre el bruto y en el límite exacto ($5.200.000) sí aplica.
- Los empleados irregulares se reportan con su motivo sin romper el resto de la nómina.
- No hay lógica duplicada entre los tres tipos más de la estrictamente distinta.
- El ordenamiento de mayor a menor neto es estable y no altera los valores calculados.
