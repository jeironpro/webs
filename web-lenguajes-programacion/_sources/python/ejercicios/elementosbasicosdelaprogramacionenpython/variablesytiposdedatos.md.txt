# Ejercicios — Variables y tipos de datos

## variables_y_tipos_de_datos1

**Solución**

```python
# Escribir un programa que muestre por pantalla la cadena "¡Hola Mundo!"

print("¡Hola Mundo!")
```

## variables_y_tipos_de_datos2

**Solución**

```python
# Escribir un programa que almacena la cadena "¡Hola Mundo!" en una variable y muestre su contenido por pantalla

cadena = "¡Hola Mundo!"

print(cadena)
```

## variables_y_tipos_de_datos3

Escribir un programa que pregunte el nombre del usuario en la consola y, después de que el usuario lo introduzca, muestre por pantalla la cadena "¡Hola <nombre>!", donde <nombre> es el nombre que el usuario haya introducido.

**Solución**

```python
nombre = input("Introduzca su nombre: ")

print("¡Hola" + nombre + "!")
```

## variables_y_tipos_de_datos4

**Solución**

```python
# Escribir un programa que muestre por pantalla el resultado de la siguiente operación aritmética: ((3 + 2) / (2 * 5)) ** 2

operacion = ((3 + 2) / (2 * 5)) ** 2
print("El resultado de la operación aritmética es", operacion)
```

## variables_y_tipos_de_datos5

Escribir un programa que pregunte al usuario el número de horas trabajadas y el coste por hora. Después, debe mostrar por pantalla la paga que le corresponde.

**Solución**

```python
horas = int(input("Introduzca el número de hora trabajadas: "))
coste_hora = int(input("Introduzca el coste de la hora: $"))

paga = horas * coste_hora

print("RD$", paga)
```

## variables_y_tipos_de_datos6

Escribir un programa que lea un entero positivo, n, introducido por el usuario y, después, muestre por pantalla la suma de todos los enteros desde 1 hasta n.

**Solución**

```python
numero = int(input("Introduzca un número entero positivo: "))

suma = int((numero * (numero + 1) / 2))

'''
Esta fórmula es una manera compacta de calcular la suma de los primeros n números enteros, donde n es el valor de numero en este caso.

La fórmula general para la suma de los primeros n números naturales es:
    Sn = n · (n + 1) / 2

· n es el número hasta el que deseas sumar (en este caso, numero).

· La multiplicación n · (n + 1) corresponde a la multiplicación de un número por su siguente número.

· El divisor 2 es para "dividir" la cantidad total, ya que se trata de la suma de una secuencia simétrica (es una progresión aritmética con una diferencia constante de 1).

¿Por qué funciona esta fórmula?
Esta formula se deriva de la propiedad de la serie aritmética. Si tienes una secuencia de números que comienza en 1 y aumenta en 1 de forma constante, puedes agrupar el primer número con el último, el segundo con el penúltimo, y así sucesivamente. Esto siempre te dará un total de n pares, y cada par suma n + 1.

Por ejemplo, si n = 5, la secuencia es:
    1 + 2 + 3 + 4 + 5

Agrupándolos en pares:
    (1 + 5), (2 + 4), 3

Cada uno de los pares da como resultado 6, y hay 2 pares completos, más el número 3 que queda sin pareja. Entonces la suma es 5 · 6/2 = 15, que es el resultado correcto.

Este método es mucho más eficiente que sumar los números de uno en uno, y también es la forma estándar de obtener la suma de los primeros n números naturales.
'''

print("La suma es:",suma)
```

## variables_y_tipos_de_datos7

Escribir un programa que pida al usuario su peso en kg y estatura en metros, calcule el índice de masa corporal (IMC), lo almacene en una variable y muestre por pantalla la frase: "Tu índice de masa corporal es <IMC>", donde <IMC> es el índice de masa corporal calculado, redondeado a dos decimales.

**Solución**

```python
peso_kg = int(input("Introduce tu peso en kg: "))
estatura_mt = float(input("Introduce tu estatura en metros: "))

# Otra forma de redondear usando la función round()
# imc = round(peso_kg/estatura_mt**2)
# print(f"Tu indice de masa corporal es {imc}")

imc = peso_kg/estatura_mt**2

'''
La formula estándar para calcular el Índice de Masa Corporal (IMC), que se utiliza para evaluar la cantidad de tejido corporal en una persona, en función de su peso y altura. Se expresa de la siguiente forma:

Fórmula del IMC:
    imc = peso (kg) / estatura (m)²

¿Cómo funciona esta fórmula?
· peso (kg): el peso de la persona en kilogramos.
· estatura (m): la altura de la persona en metros. En esta fórmula, se debe elevar al cuadrado (esto significa multiplicar la estatura por sí misma).

¿Qué significa el IMC?
El IMC es una medida estándar que clasifica el peso de una persona en categorías, según el valor obtenido:

· IMC < 18.5: Bajo peso
· IMC entre 18.5 y 24.9: peso normal
· IMC entre 25 y 29.9: sobrepeso
· IMC >= 30: obesidad

¿Por qué se usa esta fórmula?
El IMC es útil porque proporciona una estimación general de la cantidad de tejido corporal en relación con la altura y peso. Sin embargo tener en cuenta que el IMC no distingue entre masa muscular y grasa corporal, por lo que una persona con mucha mosculatura (como un atleta) podría tener un IMC alto pero estar en buena forma física.
'''
print(f"Tu índice de masa corporal es {imc:.2f}")
```

## variables_y_tipos_de_datos8

Escribir un programa que pida al usuario dos números enteros y muestre por pantalla: "<n> entre <m> da un cociente de <c> y un resto <r>", donde <n> y <m> son los números introducidos por el usuario, y <c> y <r> son el cociente y el resto de la división entera respectivamente.

**Solución**

```python
n = int(input("Escriba el primer número: "))
m = int(input("Escriba el segundo número: "))

cociente = n / m
resto = n % m

print("{0} entre {1} da un cociente de {2} y un resto {3}".format(n, m, cociente, resto))
```

## variables_y_tipos_de_datos9

Escribir un programa que pregunte al usuario una cantidad a invertir, la tasa de interés anual y el número de años, y muestre por pantalla el capital obtenido en la inversión.

**Solución**

```python
cantidad_invertir = float(input("Cuál és la cantidad a invertir? RD$ "))
interes_anual = float(input("Cuál és el interés anual que desea? % "))
numero_años = float(input("Cuál és la cantidad de años?: "))

capital_obtenido = cantidad_invertir / 100 * interes_anual
ganancia_total = capital_obtenido * numero_años
# gananciaTotal = round(capital_obtenido * numero_años, 2) # Otra forma de redondear usando la función round()

print(f"El capital obtenido es: RD${ganancia_total:.2f}")
# print(f"El capital obtenido es: RD$", gananciaTotal) # Imprimir sin decimales
```

## variables_y_tipos_de_datos10

Una juguetería tiene éxito en dos de sus productos: payasos y muñecas. Suele hacer ventas por correo y la empresa de logística les cobra por el peso de cada paquete, así que deben calcular el peso de los payasos y muñecas que saldrán en cada paquete a demanda. Cada payaso pesa 112g y cada muñeca 75g. Escribir un programa que lea el número de payasos y muñecas vendidos en el último pedido y calcule el peso total del paquete que será enviado.

**Solución**

```python
payasos = int(input("Número de payasos en el pedido: "))
muñecas = int(input("Número de muñecas en el pedido: "))

peso_payasos = payasos * 112
peso_muñecas = muñecas * 75

peso_total = peso_payasos + peso_muñecas
peso_paquete = peso_total / 1000

print(f"El peso total del paquete es {peso_paquete}kg")
```

## variables_y_tipos_de_datos11

Imagina que acabas de abrir una nueva cuenta de ahorros que te ofrece el 4% de interés al año. Estos ahorros, debido a intereses, que no se cobran hasta finales de año, se te añaden al balance final de tu cuenta de ahorros. Escribir un programa que comience leyendo la cantidad de dinero depositada en la cuenta de ahorros, introducida por el usuario. Después, el programa debe calcular y mostrar por pantalla la cantidad de ahorros tras el primer, segundo y tercer año. Redondear cada cantidad a dos decimales.

**Solución**

```python
depositos = float(input("Cantidad de dinero a depositar: RD$ "))

interes_anual1 = depositos / 100 * 4
#interes_anual1 = round(depositos / 100 * 4, 2)
interes_anual2 = interes_anual1 * 2
#interes_anual2 = round(interes_anual1 * 2, 2)
interes_anual3 = interes_anual1 * 3
#interes_anual3 = round(interes_anual1 * 3, 2)

print(f"cantidad primer año RD${interes_anual1:.2f}\nCantidad segundo año RD${interes_anual2:.2f}\nCantidad tercer año RD${interes_anual3:.2f}")
#print("cantidad primer año RD$" + str(interes_anual1) + "Cantidad segundo año RD$" + str(interes_anual2) + "Cantidad tercer año RD$" + str(interes_anual3))
```

## variables_y_tipos_de_datos12

Una panadería vende barras de pan a 3.49$ cada una. El pan que no es del día tiene un descuento del 60%. Escribir un programa que comience leyendo el número de barras vendidas que no son del día. Después, el programa debe mostrar el precio habitual de una barra de pan, el descuento que se le hace por no ser fresca y el costo final total.

**Solución**

```python
pan = int(input("Por favor, introduzca el número de barras vendidas que no son del día: "))

print("precio habitual: 3.49$")
descuento = 3.49 / 100 * 60
print(f"El descuento es:{descuento:.2f}")
precio_final = 3.49 - descuento
total =  pan * precio_final
print(f"El precio total es:{total:.2f}")
```
