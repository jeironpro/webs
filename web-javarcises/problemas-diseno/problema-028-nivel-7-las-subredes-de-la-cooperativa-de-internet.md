# Problema 028 - Las subredes de la cooperativa de internet

**Nivel:** 7 - Algoritmos aplicados
**Categoría:** Procesamiento de datos
**Enfoque POO:** Ninguno (problema de cálculo sobre enteros: la dificultad está en la máscara, los límites y el formato, no en las clases)
**Dificultad estimada:** ⭐⭐⭐☆☆

## Contexto del problema

La cooperativa de internet del barrio instala routers en los hogares y debe calcular la configuración de cada red a mano: dado un equipo con su IP y su prefijo, el técnico anota la **dirección de red**, la **dirección de broadcast** y cuántos **hosts se pueden conectar**. Con tantos domicilios, se equivoca seguido con las cuentas de un octeto y hay casas que dejan de navegar.

Pide un programa de consola donde cada instalación se registre como `IP/prefix` (por ejemplo `192.168.1.34/24`) y el programa devuelva, calculados, los tres datos: red, broadcast y cantidad de hosts utilizables. También debe **rechazar** las direcciones mal digitadas —octetos mayores a 255, prefijo fuera de 0 a 32, formato con puntos de más— sin tumbar el resto del día de instalaciones.

## Requisitos funcionales

- Recibir una dirección `IP/prefix` con formato `192.168.1.34/24`.
- Validar la IP (4 octetos de 0 a 255) y el prefijo (0 a 32).
- Calcular la dirección de red (IP con los bits de host en 0).
- Calcular la dirección de broadcast (IP con los bits de host en 1).
- Calcular la cantidad de hosts utilizables, con sus casos especiales.

## Reglas de negocio / restricciones

- Formato estricto: 4 octetos decimales de 0 a 255 y el prefijo separado por `/`, en ese orden; sin letras ni puntos extra.
- Un octeto con ceros a la izquierda (`010`) es válido y vale 10. Un octeto que pase de 255 (o un prefijo fuera de 0 a 32) invalida la entrada.
- La máscara se construye con el prefijo: `P` unos a la izquierda (por ejemplo `/24` → `255.255.255.0`).
- Red = `IP AND máscara`; broadcast = `IP OR (inversa de la máscara en 32 bits)`.
- Hosts utilizables = `2^(32 − P) − 2`, salvo:
  - `/31`: 0 hosts utilizables (enlace punto a punto, RFC 3021) — se informa con una nota.
  - `/32`: 0 hosts utilizables (dirección de un solo host) — con nota.
- La salida siempre presenta red, broadcast y hosts (incluida la nota para `/31` y `/32`).

## Lo que se espera que diseñes

- Decide cómo representar la IP (¿cuatro números separados? ¿un entero de 32 bits?) según las operaciones que debes hacer.
- Define el parseo en un solo paso: octetos, prefijo y validación de cada componente.
- Elige cómo construir la máscara desde el prefijo y la inversa para el broadcast.
- Argumenta si conviene una función "máscara desde prefijo" reutilizable para red y broadcast.

*(No se entrega una firma de clases predefinida: el diseño es parte del ejercicio.)*

## Ejemplos de comportamiento esperado

**Escenario 1 (red domiciliaria /24):**
```
Entrada / acción: 192.168.1.34/24
Resultado esperado: red 192.168.1.0, broadcast 192.168.1.255, hosts 254
```

**Escenario 2 (red grande /8):**
```
Entrada / acción: 10.0.0.5/8
Resultado esperado: red 10.0.0.0, broadcast 10.255.255.255, hosts 16.777.214
```

**Escenario 3 (/31 punto a punto):**
```
Entrada / acción: 192.168.0.1/31
Resultado esperado: red 192.168.0.0, broadcast 192.168.0.1, hosts 0 (nota: enlace punto a punto)
```

**Escenario 4 (octeto inválido):**
```
Entrada / acción: 192.168.1.256/24 o 192.168.1.10/33
Resultado esperado: rechazo indicando el componente inválido; no se calcula nada
```

**Escenario 5 (ceros a la izquierda):**
```
Entrada / acción: 010.0.0.1/24  (010 es 10)
Resultado esperado: el octeto vale 10; se calculan red y broadcast de 10.0.0.0/24
```

## Preguntas de análisis previo (responder antes de programar)

1. ¿Cómo separas la entrada en octetos y prefijo sin confundirte con puntos y slash?
2. ¿Qué operación bit a bit produce la red y cuál el broadcast, y cómo reconoces "poner los bits de host en 0 o 1"?
3. ¿Cómo manejas el caso de máscaras no alineadas a octeto (por ejemplo `/17`)?
4. ¿Qué podría salir mal? (prefijo 0, prefijo 32, octeto con más de 3 dígitos, ceros de más, diseños con letras o espacios)

## Pistas de diseño (opcional, ocultables)

<details>
<summary>Ver pista de diseño</summary>

Trabajar la IP como un solo entero de 32 bits simplifica todo: armas la máscara desplazando `1` a la izquierda `prefijo` veces y restando 1, la red con `AND`, y la inversa con `~` para el broadcast. Presentar ese entero de vuelta como cuatro octetos es una sola función de formato.

</details>

## Criterios de una buena solución

- La red y el broadcast se calculan correctamente para cualquier prefijo de 0 a 32, incluidos los no alineados a octeto.
- Los casos `/31` y `/32` se informan con su nota y no generan hosts negativos.
- La validación rechaza octetos fuera de rango, prefijos fuera de rango y formato incorrecto, con su motivo.
- Los ceros a la izquierda se interpretan correctamente.
- La salida formatea de nuevo los octetos sin errores de rango.
