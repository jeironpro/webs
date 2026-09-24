# Problema 008 - La pasarela de pagos del gimnasio

**Nivel:** 5 - Interfaces y contratos
**Categoría:** Modelado de negocio
**Enfoque POO:** Interfaz (`Pagable`) con implementaciones intercambiables (efectivo, tarjeta, puntos)
**Dificultad estimada:** ⭐⭐⭐☆☆

## Contexto del problema

El gimnasio del barrio cobra una mensualidad fija de **$120.000** a sus socios. Hasta ahora recibía los pagos solo en efectivo en recepción, hasta que la administradora decidió ampliar las opciones: aceptar tarjeta de crédito y dejar que los socios canjeen los puntos que acumulan con cada visita.

El problema: cada método de pago tiene condiciones distintas. La tarjeta cobra un **recargo del 3%** cuando el socio la usa en más de 3 cuotas, y hay tarjetas rechazadas que pasan igual porque "la cajera no se fija". Los puntos valen **$50 cada uno**, pero por reglamento de la fidelización solo pueden cubrir hasta el **50% de la mensualidad**; el resto debe completarse en efectivo. El efectivo no tiene condiciones.

La administradora quiere un sistema único que procese el cobro sin importar cómo pague el socio, que genere el recibo correspondiente y que ella revise al final del día el total recaudado por método y cuántos pagos se rechazaron. Hoy cada método se cobra "a mano" y el arqueo de caja nunca cuadra con el reporte de la cooperativa.

## Requisitos funcionales

- Registrar el pago de la mensualidad de un socio por cualquiera de los tres métodos.
- Validar que el pago por el método elegido sea posible antes de cobrar (tarjeta válida, saldo de puntos suficiente + complemento en efectivo).
- Calcular el valor final del cobro aplicando recargos cuando corresponda (solo tarjeta a más de 3 cuotas).
- Emitir un recibo: socio, método, desglose (base, recargo si aplica, puntos usados si aplica) y total cobrado.
- Reportar al cierre del día: total recaudado, total por método y pagos rechazados con su motivo.

## Reglas de negocio / restricciones

- Mensualidad fija: **$120.000**, igual para todos. No hay descuentos.
- **Efectivo:** sin condiciones; se cobra el valor base.
- **Tarjeta:** el número debe tener **exactamente 16 dígitos** y no terminar en `0000` (tarjetas con esa terminación están en la lista de rechazo). Si el socio elige **4 cuotas o más**, se aplica **3% de recargo** sobre la mensualidad. Las cuotas de 1 a 3 no generan recargo.
- **Puntos:** cada punto vale **$50**. Los puntos solo cubren hasta el **50% de la mensualidad** ($60.000); el resto debe cubrirse con el dinero en efectivo disponible que el socio declara tener. Si puntos + efectivo declarado no alcanzan para el total, el pago se rechaza.
- **Ningún método**: un pago rechazado no se registra como cobrado, no emite recibo y no descuenta puntos ni plata.
- Los montos se manejan en pesos enteros; el recargo del 3% se redondea al peso más cercano y los puntos usados se descuentan solo en cobros exitosos.

## Lo que se espera que diseñes

- Define el **contrato común** que todos los métodos deben cumplir para que el sistema los procese sin importar cuál sea (¿qué métodos pide ese contrato?).
- Decide cómo se pide la "misma" operación a cada método sin llenar el programa de `if` por tipo.
- Decide cómo el recibo de unos y otros se llena con información distinta (recargo, puntos) manteniendo un formato único.
- Argumenta qué ganaría el sistema si mañana aparece un cuarto método (ej. billetera virtual).

*(No se entrega una firma de clases predefinida: el diseño es parte del ejercicio.)*

## Ejemplos de comportamiento esperado

**Escenario 1 (tarjeta sin recargo):**
```
Entrada / acción: pagar con tarjeta 4567 8901 2345 6789 en 3 cuotas
Resultado esperado: cobro de $120.000, recibo con base $120.000, sin recargo
```

**Escenario 2 (tarjeta con recargo):**
```
Entrada / acción: la misma tarjeta en 5 cuotas
Resultado esperado: recargo 3% de $120.000 = $3.600 → total $123.600
```

**Escenario 3 (tarjeta rechazada):**
```
Entrada / acción: tarjeta número 1234 5678 9012 0000
Resultado esperado: pago rechazado (tarjeta en lista de rechazo); no se cobra ni se emite recibo
```

**Escenario 4 (puntos + efectivo):**
```
Entrada / acción: socio con 800 puntos quiere pagar la mensualidad, declara $80.000 en efectivo
Resultado esperado: 800 puntos × $50 = $40.000, dentro del tope del 50%; cubre con puntos $40.000 + efectivo $80.000 → total $120.000; se descuentan los 800 puntos
```

**Escenario 5 (puntos que no alcanzan):**
```
Entrada / acción: socio con 200 puntos y $20.000 en efectivo
Resultado esperado: puntos $10.000 + efectivo $20.000 = $30.000 < $120.000 → rechazado; no se gastan puntos
```

## Preguntas de análisis previo (responder antes de programar)

1. ¿Qué operaciones son comunes a los tres métodos de pago? ¿Qué operaciones son exclusivas de cada uno?
2. ¿Cómo evitas que el programa principal conozca los detalles de cada método?
3. ¿Qué debe comprobarse antes de descartar puntos o registrar un cobro?
4. ¿Qué podría salir mal? (tarjeta con longitud incorrecta, límite exacto de cuotas 3/4, puntos que superan el tope del 50%)

## Pistas de diseño (opcional, ocultables)

<details>
<summary>Ver pista de diseño</summary>

Si defines un contrato con la validación, el procesamiento y la descripción del recibo, cada método lo implementa a su manera. El sistema solo conoce el contrato: la "verificación de estar pagando con algo válido" y el "cuánto se cobra" viven dentro de cada método, no afuera.

</details>

## Criterios de una buena solución

- Agregar un cuarto método de pago no obliga a tocar el código que recauda ni el que hace el reporte del día.
- Los puntos se descuentan solo en cobros exitosos y el recibo muestra los puntos usados.
- El límite de cuotas (3/4) marca exactamente el inicio del recargo, y el redondeo del recargo es consistente.
- El reporte del día separa recaudo por método y cuenta cada rechazo con su motivo.
- No hay validaciones de tarjeta ni de puntos repartidas fuera del método que les corresponde.
