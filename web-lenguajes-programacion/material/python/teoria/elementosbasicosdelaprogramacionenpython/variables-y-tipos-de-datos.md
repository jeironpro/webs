# variables y tipos de datos

**Variables**
Una variable es un nombre que se usa para referirse a un valor o dato en el programa. Es como una "caja" donde puedes almacenar información para usarla más tarde. En python, no necesitas declarar el tipo de la variable antes de asignarle un valor, lo que hace que Python sea muy flexible y fácil de usar.

```python
''' Asignar valores a una variable
En python, asignar un valor a una variable es muy simple. Usamos el operador de asignación =
'''
numero = 10 # Variable con valor entero (int)
nota = 10.22 # Variable con valor decimal (float)
nombre = "jeiron" # Variable con cadena de carecteres (string | str)
es_estudiante = True # Variable con datos booleanos (bool)

#Imprimir Valores en pantalla
print(numero)
print(nota)
print(nombre)
print(es_estudiante)

''' Tipos de datos
Los tipos de datos son las categorías de valores que puedes usar y manipular. Estos tipos permiten almacenar diferentes formas de información, como numero, texto o valores booleanos.

Las varaible en Python pueden almacenar diferentes tipos de datos, como:
· Enteros (int): números enteros, como 10, -3, 42.
· Flotantes (float): números decimales, como 3.14, -1.5, 2.0.
· Cadenas de texto (str): texto, como "Hola", "Python".
· Booleanos (bool): valores True o False.
'''

''' Función type
La función type() se usa para obtener el tipo de dato de una variable o de cualquier objecto en Python. Esto te permite saber qué tipo de valor está almacenado en una variable.
'''

# Mostrar el tipo de dato de una variable
print(type(numero))
print(type(nota))
print(type(nombre))
print(type(es_estudiante))

''' Usar variables
Una vez que has asignado valores a las variables, puedes usarlas en tu programa. Por ejemplo, puedes hacer operaciones matemáticas con las variables numéricas o combinar cadenas de texto.
'''
# Realizar cálculos con variables
num1 = 10
num2 = 6.7

suma = num1 + num2
print("El Resultado de la suma es",suma)

# Combinar cadenas de textos
nombre = "Jeiron"

mensaje = "Hola, " + nombre + "!"
print(mensaje)

''' Reglas para nombrar variables
· Los nombres de las variables deben comenzar con una letra (a-z, A-Z) o un guión bajo (_).

· Después de la primera letra, pueden ir números.

· Los nombres de las variables son sensibles a mayúsculas y minúsculas, es decir, edad y Edad son dos variables diferentes.

· No puedes usar palabras reservadas de Python como class, for, if, True, False, etc., como nombres de variables. 
'''

# Ejemplos válidos:
variable1 = 10
_mensaje = "Hola"
edad_usuario = 30

# Ejemplos invalidos:
# 1variable = 10 # No puede empezar con un número
# if = 5 # 'if' es una palabra reservada

''' Tipado dinamico
En python, las variables son dinámicas, lo que permite que el tipo de dato sea cambiado en cualquier momento del programa.
'''

nombre = 10
print(nombre)
print(type(nombre))

''' La funcion round()
En python, la función round() se utiliza para rendodear un número decimal a un número de decimales especificado. Esta función es útil cuando necesitas controlar la cantidad de decimales que se muestran o almacenan en una variable.
'''

# Redondear números decimales a decimales específicos
radio = 3.14159
redondeado = round(radio, 2)
print(redondeado)

# Redondear decimales de un dígito a un número entero
radio = 3.7
redondeado = round(radio)
print(redondeado)

'''
El redondeo hacia abajo o hacia arriba: Python usa la regla de redondeo de "redondeo hacia el par más cercano" (o "redondeo bancario"), lo que significa que si el número està justo a mitad de camino, se redondea al número par más cercano.
'''

round(2.5) # Redondea hacia abajo (numero par más cercano 2)

round(3.5) # Redondea hacia arriba (numero par más cercano 4)

''' El formato .2f
El .2f es una especificación de formato utilizada en Python para controlar cómo se imprime un número decimal (de tipo float) con una cantidad específica de decimales.

· f se refiere a "float" (número de punto flotante).

· .2 indica que quieres mostrar dos decimales

Esto es una forma de especificar el formato de presentación de un número flotante.

Sintaxis de formato:
"{:.2f}".format(numero)

El número se imprimirá con dos decimales después del punto decimal.
'''

numero = 3.14159
formato = "{:.2f}".format(numero)
print(formato) # Imprime "3.14"

''' .format()
La función .format() es un método de las cadenas de texto en Python que te permite insertar valores dentro de una cadena de manera muy flexible. puedes usarlo para formatear los valores antes de mostrarlos.

Sintaxis de .format():
cadena = "Texto con un valor: {}".format(valor)

· El {} dentro de la cadena es un marcador de posición que será reemplazado por el valor que se pase a .format().

· Puedes pasar uno o más valores a .format(), y estos serán insertados en el orden de aparición de los {} en la cadena.
'''

# Ejemplo sustituyendo un valor
nombre = "Junior"
edad = 21

# Usamos .format() para insertar los valores en la cadena
saludo = "Hola, mi nombre es {} y tengo {} años".format(nombre, edad)
print(saludo)

# Ejemplo especificando el orden de los valores
# Puedes usar índices dentro de los {} para especificar el orden en el que se deben insertar los valores
nombre = "JeyJey"
edad = 21

# Usamos índices para dar el orden explícito
saludo = "Hola, mi nombre es {0} y tengo {1} años. {0} es un buen nombre.".format(nombre, edad)
print(saludo)

# Ejemplo usando nombres en lugar de índices
saludo = "Hola, mi nombre es {nombre} y tengo {edad} años.".format(nombre="Jeiron", edad=21)
print(saludo)

# Ejemplo especificando formato de números
precio = 19.99
mensaje = "El precio es {:.2f}".format(precio)
print(mensaje)

''' F-strings (f"")
Introducidas en Python 3.6, las f-strings son una forma más moderna y directa de formatear cadenas. Las f-strings permiten insertar expresiones dentro de una cadena de manera más sencilla y legible. Se prefieren a menudo por su simplicidad y eficiencia.

Sintaxis de f-strings
cadena = f"Texto con un valor: {valor}"

· El prefijo f antes de las comillas indica que es una f-string.

· Dentro de las llaves {}, puedes insertar cualquier expresión de Python, no solo variables.
'''

# Ejemplo sustituyendo valores
nombre = "Jeiron"
edad = 21

# Usamos f-string para insertar los valores directamente
saludo = f"Hola, mi nombre es {nombre} y tengo {edad} años."
print(saludo)

# Ejemplo realizando operaciones dentro de las llaves {}
a = 5
b = 10
resultado = f"La suma de {a} y {b} es {a + b}."
print(resultado)

# Ejemplo formateando números
precio = 19.999
mensaje = f"El precio es {precio:.2f}"
print(mensaje)

'''
Comparación de .format() vs f-strings
Característica	                  .format()	                                                              f-strings (f"")
Sintaxis	                      "{}.format(valor)`	                                                  f"{}" con variables dentro de llaves
Introducción	                  Introducido en Python 2.7 y 3.x	                                      Introducido en Python 3.6
Legibilidad	                      Menos legible cuando se tienen muchos valores o expresiones complejas   Más legible y directo, especialmente con expresiones complejas
Velocidad 	                      Lento en comparación con f-strings	                                  Más rápido, especialmente con muchas variables o expresiones
Flexibilidad	                  Muy flexible, con formatos avanzados de alineación, relleno, etc.	      También flexible, pero más simple y directo
Operaciones dentro de la cadena	  No se pueden hacer operaciones dentro de los {}	                      Se pueden hacer operaciones directamente dentro de los {}
'''

''' \n
En python, \n es un carácter de escape que representa un salto de línea o una nueva línea. Esto significa que cuando se encuentra en una cadena de texto, indica al programa que debe empezar una nueva línea en ese punto.

¿Cómo funciona?
· El carácter de escape \ le dice a Python que lo que sigue tiene un significado especial.

· La letra n significa "nueva línea" (new line).
'''
```
