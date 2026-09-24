# Problema 002 - La máquina expendedora de la terminal

**Nivel:** 2 - Composición básica
**Categoría:** Modelado de negocio
**Enfoque POO:** Composición (`MaquinaExpendedora` gestiona su propio inventario y caja)
**Dificultad estimada:** ⭐⭐⭐☆☆

## Contexto del problema

En la terminal de buses instalaron una máquina expendedora de snacks para los pasajeros de larga distancia. La máquina tiene varios compartimientos (galletica, café en lata, agua, papas), cada uno con un producto, un precio y una cantidad disponible. La máquina acepta monedas en tres denominaciones fijas: **$2.000, $1.000 y $500**.

El problema de la máquina: la persona encargada de la terminal debe regresar cada dos días a ajustarla a mano, porque los usuarios reportan que a veces compran un producto y la máquina "no devuelve el vuelto que debería", o cobra un producto que ya no hay en stock. Justo cuando hay una fila de pasajeros apurados, nadie quiere pensar: la máquina debe decidir sola.

Necesitan un programa que modele la operación de una compra: el usuario elige un compartimiento, inserta monedas (una a una, o un monto total) y recibe su producto y el vuelto correcto. Todo lo demás (reponer stock, consultar existencias) también debe resolverse dentro del mismo sistema.

## Requisitos funcionales

- Modelar la máquina con sus compartimientos (cada uno tiene nombre de producto, precio y cantidad disponible).
- Permitir que el usuario seleccione un compartimiento y pague con una cantidad en monedas de las denominaciones aceptadas.
- Si el pago cubre el precio, entregar el producto, descontar uno del stock y calcular el vuelto.
- Permitir consultar qué productos tienen existencia disponible.
- Permitir reponer stock de un compartimiento.

## Reglas de negocio / restricciones

- No se puede vender un producto agotado: si la cantidad es 0, la compra se rechaza.
- No se puede vender si el dinero insertado es menor al precio: la compra se rechaza y se indica cuánto falta.
- El vuelto se entrega intentando usar primero la moneda de mayor denominación: **$2.000, luego $1.000, luego $500**.
- Si el vuelto no puede expresarse exactamente con las denominaciones disponibles (por ejemplo, vuelto de $300), la compra **no debe realizarse** y se devuelve el dinero insertado: es mejor no vender que regalar una operación que no se puede completar.
- Los precios y montos se manejan en pesos colombianos (enteros) y los precios pueden tener cualquier valor entero, pero solo se aceptan monedas de las tres denominaciones indicadas para pagar.
- El reponer stock solo no nace can valores negativos.

## Lo que se espera que diseñes

- Identifica la(s) clase(s) necesarias y sus responsabilidades.
- Decide cómo representar un compartimiento: ¿es un `Map` dentro de la máquina, una lista de objetos propios, o algo más? Justifica.
- Define dónde vive la lógica del vuelto: ¿en la máquina, en una clase de respaldo aparte, o en el programa principal?
- Decisión consciente: la regla del vuelto con denominaciones en orden es un **algoritmo** dentro de un mundo de objetos. Argumenta qué gana el modelo al encapsularlo.

*(No se entrega una firma de clases predefinida: el diseño es parte del ejercicio.)*

## Ejemplos de comportamiento esperado

**Escenario 1 (compra con vuelto simple):**
```
Entrada / acción: producto de $3.500, paga con $2.000 + $2.000 (total $4.000)
Resultado esperado: entrega el producto y devuelve $500 (una moneda de $500), stock descontado en 1
```

**Escenario 2 (vuelto que necesita mezcla):**
```
Entrada / acción: producto de $2.500, paga con $2.000 + $1.000 + $1.000 (total $4.000)
Resultado esperado: entrega el producto y devuelve $1.000 + $500 (primeras la de mayor tamaño posible)
```

**Escenario 3 (vuelto imposible):**
```
Entrada / acción: producto de $3.200, paga con $3.500 (monedas de $2.000 + $1.000 + $500)
Resultado esperado: vuelto de $300 no es representable; la compra se rechaza y se devuelve el dinero
```

**Escenario 4 (producto agotado):**
```
Entrada / acción: compartimiento con 0 unidades, el usuario intenta comprar
Resultado esperado: compra rechazada con mensaje de agotado; no se acepta el dinero
```

## Preguntas de análisis previo (responder antes de programar)

1. ¿Qué entidades del mundo real identificas? ¿Qué atributos y comportamientos tiene cada una?
2. ¿Una máquina "tiene" compartimientos o "es" una colección de compartimientos? ¿Cómo cambia eso el diseño?
3. ¿Cómo garantizas que la regla del vuelto (mayor denominación primero) y la regla de vuelto inexacto se cumplan siempre?
4. ¿Qué podría salir mal? (pago insuficiente, moneda no válida, stock en 0, precio de 0)

## Pistas de diseño (opcional, ocultables)

<details>
<summary>Ver pista de diseño</summary>

El vuelto se calcula recorriendo las denominaciones de mayor a menor y restando tantas monedas como se pueda, pero antes de aceptar la compra debes verificar que la diferencia (vuelto) se puede cubrir por completo con las denominaciones. Pensar el vuelto como una **responsabilidad separable** puede ayudarte a probarlo en aislamiento.

</details>

## Criterios de una buena solución

- El vuelto siempre usa la mayor denominación posible y es exacto, o la compra se rechaza sin efectos secundarios.
- No se vende algo sin stock y no se descuenta stock en compras rechazadas.
- El estado de la máquina (stock, dinero insertado) queda consistente después de cada operación.
- La lógica del vuelto es fácil de probar por separado y no está repetida en cada método.
- Agregar una nueva denominación de moneda no exige reescribir toda la clase
