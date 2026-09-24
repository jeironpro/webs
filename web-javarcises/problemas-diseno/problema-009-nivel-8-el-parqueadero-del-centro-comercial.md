# Problema 009 - El administrador del parqueadero del centro comercial

**Nivel:** 8 - Sistemas completos
**Categoría:** Gestión / CRUD conceptual
**Enfoque POO:** Herencia + excepciones + colecciones (`Parqueadero` gestiona `Vehiculo` de varios tipos con tarifa propia; las operaciones inválidas se comunican con excepciones propias)
**Dificultad estimada:** ⭐⭐⭐⭐☆

## Contexto del problema

El centro comercial del barrio tiene un único parqueadero con **20 cupos** que funciona de 0 a 23 horas (dentro del mismo día). Los vehículos son de tres tipos —moto, carro y camión— y cada uno tiene una tarifa por hora distinta: **$1.000, $2.500 y $4.000** respectivamente.

Hasta ahora el control se hace con un talonario donde se anota placa, tipo y hora de entrada, y al salir se cobra "lo que se recuerde". Resultado: hay discusiones por cobros, se pierden talonarios y a veces no hay cupo pero igual dejan entrar. La administradora encargó un sistema de consola que maneje el parqueadero completo: registrar entrada, registrar salida con su cobro, y mostrar a cualquier hora cómo está el parqueadero y cuánto se ha recaudado en el día.

El sistema debe comportarse como un admin real: rechazar con claridad lo que no es posible (parqueadero lleno, placa duplicada dentro, salida de un vehículo que no está, horas inválidas) y, pase lo que pase, quedar siempre en un estado consistente para la siguiente operación. La administradora va a estar pendiente del reporte de cierre del día para el arqueo.

## Requisitos funcionales

- Registrar la entrada de un vehículo: placa, tipo y hora de entrada.
- Registrar la salida de un vehículo por placa, con su hora de salida, calculando el tiempo y el cobro correspondiente.
- Mostrar el estado actual: cupos ocupados/libres y la lista de vehículos dentro con su hora de entrada.
- Mostrar el reporte del día: total recaudado, desglose por tipo de vehículo y cantidad de cada tipo que ingresó.
- Rechazar con un mensaje claro y sin efectos secundarios toda operación inválida.

## Reglas de negocio / restricciones

- Capacidad máxima: **20 vehículos**. Si el parqueadero está lleno, ninguna entrada es aceptada.
- Una placa no puede estar **dos veces dentro** a la vez: si ya hay un vehículo con esa placa, la nueva entrada se rechaza.
- Una **salida exige que el vehículo exista dentro**: no se puede sacar uno que no está o que ya salió.
- Las horas van de 0 a 23 y el parqueadero opera dentro del mismo día: la hora de salida no puede ser menor a la hora de entrada.
- El cobro es **por hora o fracción**: 1h10min se cobra como 2 horas. Una operación redonda exacta cobra esa cantidad exacta de horas.
- Tarifas: moto $1.000/h, carro $2.500/h, camión $4.000/h. No hay tarifa mínima ni tope.
- Un vehículo cuya salida no se registra queda ocupando su cupo para todo lo que resta del día.

## Lo que se espera que diseñes

- Identifica las clases necesarias: parqueadero, vehículo y sus tipos.
- Decide si los tipos de vehículo son una jerarquía de clases o un dato (enum): evalúa qué cambia entre tipos (la tarifa) y qué es común (placa, horas).
- Decide cómo garantizar la unicidad de placas dentro y cómo rastrear el cupo en tiempo real.
- Elige cómo comunicar los rechazos (excepciones propias con nombre, o retorno de resultado) y justifica.
- Decide cómo acumular los datos del reporte del día sin depender de vehículos que ya salieron.

*(No se entrega una firma de clases predefinida: el diseño es parte del ejercicio.)*

## Ejemplos de comportamiento esperado

**Escenario 1 (entrada y salida normales):**
```
Entrada / acción: entra carro placa XYZ-123 a las 8; sale a las 10 (2 horas exactas)
Resultado esperado: cobro $5.000 (2 × $2.500); el reporte del día suma $5.000 en carros
```

**Escenario 2 (fracción cobra hora completa):**
```
Entrada / acción: entra moto a las 9:00 (hora 9) y sale a las 10:10 (hora 10 + fracción)
Resultado esperado: se cobra como 2 horas → $2.000
```

**Escenario 3 (parqueadero lleno):**
```
Entrada / acción: hay 20 vehículos dentro y llega uno más
Resultado esperado: entrada rechazada (cupo lleno) y el estado no cambia
```

**Escenario 4 (placa duplicada dentro):**
```
Entrada / acción: intentar entrar nuevamente un vehículo cuya placa ya está dentro
Resultado esperado: entrada rechazada y el vehículo original permanece
```

**Escenario 5 (salida de vehículo inexistente):**
```
Entrada / acción: intentar registrar la salida de una placa que no está dentro
Resultado esperado: salida rechazada; no se descuenta ningún cupo ni se suma nada al reporte
```

**Escenario 6 (hora inválida):**
```
Entrada / acción: intentar registrar una entrada a la hora 27, o una salida a una hora menor que la de entrada
Resultado esperado: operación rechazada con el motivo; el parqueadero queda igual
```

## Preguntas de análisis previo (responder antes de programar)

1. ¿Qué entidades del mundo real identificas y qué atributos y comportamientos tiene cada una?
2. ¿Qué es común entre los tres tipos de vehículo y qué los diferencia? ¿Cómo decides tu modelado a partir de eso?
3. ¿Cuándo y cómo verificas que una operación es válida antes de modificar el estado?
4. ¿Qué podría salir mal? (cupo desbordado, placa duplicada, salidas sin entrada, horas cruzadas de día, arqueo que no cuadra)

## Pistas de diseño (opcional, ocultables)

<details>
<summary>Ver pista de diseño</summary>

Todas las reglas de rechazo se pueden validar de forma centralizada: la unicidad de placas y el cupo se miran antes de agregar; la existencia del vehículo antes de sacarlo. Si cada operación muta el estado solo cuando la validación pasó, el parqueadero nunca queda "a medias"; y el reporte del día se puede alimentar en la salida, cuando el cobro se confirma.

</details>

## Criterios de una buena solución

- Las seis reglas de negocio se aplican siempre, en el orden correcto y sin efectos secundarios ante el rechazo.
- El cobro por fracción redondea hacia arriba sólo cuando hay minutos, no cuando es hora exacta.
- El cupo ocupado coincide siempre con el número de vehículos dentro: nunca hay "cupos fantasma".
- El reporte de cierre cuadra con los cobros realizados y está desglosado por tipo.
- Agregar un nuevo tipo de vehículo (ej. bicicleta) no obliga a reescribir las operaciones del parqueadero.
