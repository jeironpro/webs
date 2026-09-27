# Ejercicios — Funciones

## funciones1

**Solución**

```python
# Escribir una función que muestre por pantalla el saludo "¡Hola, usuario!" cada vez que se invoque.

def saludar():
    print("¡Hola, usuario!")

saludar()
```

## funciones2

**Solución**

```python
# Escribir una función a la que se le pase una cadena <nombre> y muestre por pantalla el saludo "¡Hola <nombre>!".

def saludar(nombre):
    print(f"¡Hola, {nombre}!")

saludar("Jeiron")
```

## funciones3

**Solución**

```python
# Escribir una función que reciba un número entero positivo y devuelva su factorial.

def factorial(numero):
    multiplicacion = 1
    for i in range(numero):
        multiplicacion *= i + 1
    print(f"El factorial de {numero} es: {multiplicacion}")

numero = int(input("Ingrese el número entero positivo del cual quiere obtener el factorial: "))
if numero < 0:
    print("No se permiten números negativos")
else:
    factorial(numero)
```

## funciones4

Escribir una función que calcule el total de una factura tras aplicarle el ITBIS. La función debe recibir la cantidad sin ITBIS y el porcentaje de ITBIS a aplicar, y devolver el total de la factura. Si se invoca la función sin pasarle el porcentaje de ITBIS, deberá aplicar un 18%.

**Solución**

```python
def facturar(cantidad, itbis):
    return ((cantidad / 100) * itbis) + cantidad

cantidad = int(input("Ingrese la cantidad a pagar: "))
itbis = input("Ingrese el itbis a pagar: ")

if not itbis:
    itbis = 18

print(facturar(cantidad, int(itbis)))
```

## funciones5

**Solución**

```python
# Escribir una función que calcule el área de un círculo y otra que calcule el volumen de un cilindro usando la primera función.

import math

radio = int(input("Ingrese el radio del círculo: "))

def calcular_area_circulo(radio):
    return round(math.pi * radio**2, 2)
    
def calcular_volumen_cilindro(altura):
    return round(calcular_area_circulo(radio) * altura, 2)

opciones = int(input("(1) para calcular el área de un círculo o (2) para calcular el volumen de un cilindro: "))

if opciones == 1:
    print("El área del círculo es:", calcular_area_circulo(radio))
elif opciones == 2:
    altura = int(input("Ingrese la altura del cilindro: "))
    print(calcular_volumen_cilindro(altura))
```

## funciones6

**Solución**

```python
# Escribir una función que reciba una muestra de números en una lista y devuelva su media.

muestra = []

numeros = input("Ingrese una lista de números separados por coma: ")

for i in numeros.split(","):
    muestra.append(int(i))

def media(muestra):
    return sum(muestra) / len(muestra)

print(f"La media de la muestra es: {media(muestra)}")
```

## funciones7

**Solución**

```python
# Escribir una función que reciba una muestra de números en una lista y devuelva otra lista con sus cuadrados.

muestra = [45, 33, 68, 2, 4, 16, 5, 3, 8, 9, 200]

cuadrado = map(lambda num: num*num, muestra)

print("Los cuadrados de la muestra son:", list(cuadrado))
```

## funciones8

**Solución**

```python
# Escribir una función que reciba una muestra de números en una lista y devuelva un diccionario con su media, varianza y desviación típica.

import math

def calcular_estadisticas(numeros):
    x = 0
    if not numeros:
        return {"media": None, "varianza": None, "desviación_tipica": None}
    
    num = len(numeros)
    media = sum(numeros) / num

    for i in numeros:
        x += (i - media) ** 2

    varianza = x / num

    desviacion_tipica = math.sqrt(varianza)

    return {
        "media": media,
        "varianza": varianza,
        "desviacion_tipica": desviacion_tipica
    }

muestra = []

numeros_usuario = input("Ingrese una lista de números separados por coma: ")

for i in numeros_usuario.split(","):
    muestra.append(int(i))
    
resultado = calcular_estadisticas(muestra)
print(resultado)
```

## funciones_adicionales1

**Solución**

```python
# Crea una función que reciba dos números y devuelva su suma.

def sumar(a, b):
    return a + b

num1 = int(input("Ingrese el primer número: "))
num2 = int(input("Ingrese el segundo número: "))

print(f"El resultado de la suma es: {sumar(num1, num2)}")
```

## funciones_adicionales2

**Solución**

```python
# Define una función que reciba un número y determine si es par o impar.

def numero_par_impar(numero):
    if numero % 2 == 0:
        return f"El número {numero} es par"
    else:
        return f"El número {numero} es impar"
    
numero = int(input("Ingrese un número entero positivo: "))
print(numero_par_impar(numero))
```

## funciones_adicionales3

**Solución**

```python
# Crea una función que reciba una lista de números y devuelva el mayor de ellos.
```

## funciones_adicionales4

**Solución**

```python
# Escribe una función que reciba un nombre y lo imprima en mayúsculas.

def nombre_mayuscula(nombre):
    return nombre.upper()

nombre = input("Escriba su nombre: ")
print(nombre_mayuscula(nombre))
```

## funciones_adicionales5

**Solución**

```python
# Define una función que reciba un número y determine si es un número primo.

def numero_primo(numero):
    contador = 0
    for i in range(1, numero+1):
        if numero % i == 0:
            print(f"{numero} / {i} = {numero / i}")
            contador += 1
    if contador == 2:
        print("El número es primo")
    else:
        print("El número no es primo")

numero = int(input("Ingrese un número: "))
numero_primo(numero)
```

## funciones_adicionales6

**Solución**

```python
# Crea una variable global y una variable local dentro de una función. Imprime ambas desde la función.

nombre = "Jeiron"

def variable_global_local():
    edad = 21
    global nombre

    return f"Hola {nombre}, tienes {edad} años de edad."

print(variable_global_local())
```

## funciones_adicionales7

**Solución**

```python
# Define una variable dentro de una función y muestra su valor fuera de la función. ¿Qué ocurre?

def variable_local():
    nombre = "Jeiron"
    print(f"La variable dentro de la función -> {nombre}")

variable_local()
# print(f"La variable fuera de función -> {nombre}") # Obtiene el error -> NameError: name 'nombre' is not defined, porque la variable está en el ámbito local de la función y no se puede acceder a ella fuera de la función.
```

## funciones_adicionales8

**Solución**

```python
# Modifica una variable global desde dentro de una función utilizando la palabra clave global.

nombre = "Jeiron"

def modificar_variable_global():
    global nombre
    nombre = nombre.upper()

    return nombre

print(modificar_variable_global())
```

## funciones_adicionales9

**Solución**

```python
# Crea dos funciones: una que use una variable local y otra que use una global. Imprime el valor de ambas.

variable_global = "Jeiron"

def es_global():
    global variable_global

    print(f"La variable global contiene: {variable_global}")

def es_local():
    variable_local = 21

    print(f"La variable local contiene: {variable_local}")

es_global()
es_local()
```

## funciones_adicionales10

**Solución**

```python
# Define una variable dentro de una función y otra fuera de la función. Llama a la función y muestra el valor de ambas variables.

def variables():
    nombre = "Jeiron"
    return nombre

edad = 21
print(f"Hola {variables()}, tienes {edad} años de edad.")
```

## funciones_adicionales11

**Solución**

```python
# Crea una función que acepte un número indefinido de argumentos (usando *args) y los sume.

lista_numeros = []

numeros = input("Ingrese una lista de números separados por coma: ")

for i in numeros.split(","):
    lista_numeros.append(int(i))

def sumar_args(*args):
    return sum(args)

resultado = sumar_args(*lista_numeros)
print(f"La suma de todos los argumentos es: {resultado}")
```

## funciones_adicionales12

**Solución**

```python
# Define una función que reciba un número variable de argumentos y los imprima.

def argumentos_variables(*args):
    for arg in args:
        print(arg,end="")

argumentos_variables('J', 'e', 'i', 'r', 'o', 'n', 2, 1)
```

## funciones_adicionales13

**Solución**

```python
# Escribe una función que reciba un número de argumentos de palabra clave (usando **kwargs) y los imprima en formato clave:valor.

def clave_valor(**kwargs):
    for clave, valor in kwargs.items():
        print(f"{clave}: {valor}")

clave_valor(nombre = "Jeiron", edad = 21)
```

## funciones_adicionales14

**Solución**

```python
# Crea una función que reciba tanto *args como **kwargs y los imprima.

def mostrar_argumentos(*args, **kwargs):
    print("(*args):")
    for arg in args:
        print(arg)

    print("\n(**kwargs):")
    for clave, valor in kwargs.items():
        print(f"{clave}: {valor}")

mostrar_argumentos(1, 2, 3, nombre="Juan", edad=30)
```

## funciones_adicionales15

**Solución**

```python
# Define una función que reciba argumentos posicionales y de palabra clave, y los devuelva como una lista y un diccionario, respectivamente.

def separar_argumentos(*args, **kwargs):
    lista_args = list(args)
    
    diccionario_kwargs = kwargs
    
    return lista_args, diccionario_kwargs

lista, diccionario = separar_argumentos(1, 2, 3, nombre="Juan", edad=30)

print("Lista de argumentos posicionales:", lista)
print("Diccionario de argumentos con nombre:", diccionario)
```

## funciones_adicionales16

**Solución**

```python
# Crea una función que divida dos números. Asegúrate de que maneje el error si el divisor es cero.

def division(num1, num2):
    try:
        print(f"El resultado de la división es: {num1 / num2}")
    except ZeroDivisionError:
        print("No se puede dividir por cero.")

num1 = int(input("Ingrese el primer numero: "))
num2 = int(input("Ingrese el segundo numero: "))
division(num1, num2)
```

## funciones_adicionales17

**Solución**

```python
# Escribe una función que intente convertir un valor a entero y maneje la excepción si no es posible.

def convertir_a_int(valor):
    try:
        valor = int(valor)
        print(f"El valor convertido a entero es: {valor}")
    except ValueError:
        print(f"No se pudo convertir '{valor}' a entero.")

valor = input("Ingrese un valor: ")
convertir_a_int(valor)
```

## funciones_adicionales18

**Solución**

```python
# Crea un programa que pida un número al usuario. Si el usuario ingresa un valor no numérico, maneja la excepción y muestra un mensaje.

def numerico():
    try:
        numero = int(input("Ingrese un valor numérico: "))
        print(f"Has ingresado el número {numero}.")
    except ValueError:
        print(f"El valor ingresado no es numérico")

numerico()
```

## funciones_adicionales19

**Solución**

```python
# Escribe un código que intente acceder a un índice fuera de rango en una lista y maneje la excepción.

def index(lista, indice):
    try:
        elemento = lista[indice]
        print(f"El elemento en el indice {indice} es: {elemento}.")
    except IndexError:
        print(f"Error. El indice {indice} está fuera del rango de la lista.")

lista = []

numeros = input("Ingrese una lista de números separados por coma: ")

for i in numeros.split(","):
    lista.append(int(i))

indice = int(input("Ingrese el indice de la lista al que quiere acceder: "))

index(lista, indice)
```

## funciones_adicionales20

**Solución**

```python
# Crea una función que reciba un número y si es negativo, lance una excepción personalizada.

def verificar_numero():
    numero = int(input("Ingrese un número entero: "))
    if numero < 0:
        raise ValueError(f"El número {numero} es negativo.")
    else:
        print(f"EL número {numero} es positivo.")

verificar_numero()
```

## funciones_adicionales21

**Solución**

```python
# Usa filter() para obtener todos los números pares de una lista.

lista_numeros = []

numeros = input("Ingrese una lista de números separados por coma: ")

for i in numeros.split(","):
    lista_numeros.append(int(i))

def numero_par(numero):
    if numero % 2 == 0:
        return numero
    
resultado = filter(numero_par, lista_numeros)
print(f"Los números pares de la lista son: {list(resultado)}")
```

## funciones_adicionales22

**Solución**

```python
# Usa filter() para obtener todas las palabras que tengan más de 4 letras de una lista de cadenas.

lista_palabras = []

palabras = input("Ingrese una lista de palabras separadas por coma: ")

for i in palabras.split(","):
    lista_palabras.append(i)

def cadena_mayor_a_4(palabra):
    if len(palabra) > 4:
        return palabra
    
resultado = filter(cadena_mayor_a_4, lista_palabras)
print(f"La(s) palabra(s) de la lista con más de 4 letras son: {list(resultado)}")
```

## funciones_adicionales23

**Solución**

```python
# Filtra una lista de números y devuelve solo aquellos que sean mayores que 10.

lista_numeros = []

numeros = input("Ingrese una lista de números separados por coma: ")

for i in numeros.split(","):
    lista_numeros.append(int(i))

def mayor_que_10(numero):
    return numero > 10

resultado = filter(mayor_que_10, lista_numeros)
print(f"Los números de las lista mayor a 10 son: {list(resultado)}")
```

## funciones_adicionales24

**Solución**

```python
# Usa filter() para encontrar todos los elementos en una lista que sean mayores a 50.

lista_numeros = []

numeros = input("Ingrese una lista de números separados por coma: ")

for i in numeros.split(","):
    lista_numeros.append(int(i))

mayores_a_50 = filter(lambda num: num > 50, lista_numeros)

print(f"Los números de la lista mayores a 50 son: {list(mayores_a_50)}")
```

## funciones_adicionales25

**Solución**

```python
# Filtra una lista de cadenas y devuelve solo aquellas que comiencen con la letra "A".

lista_palabras = []

palabras = input("Ingrese una lista de palabras separadas por coma: ")

for i in palabras.split(","):
    lista_palabras.append(i)

comienza_por_a = filter(lambda c: c[0].lower() == 'a', lista_palabras)

print(f"Las palabras de la lista que comienzan por 'a' son: {list(comienza_por_a)}")
```

## funciones_adicionales26

**Solución**

```python
# Usa una función lambda para multiplicar un número por 3.

numero = int(input("Ingrese un número: "))

multiplicar_por_3 = lambda num: num * 3

print(f"El número multiplicado por 3 es igual a: {multiplicar_por_3(numero)}")
```

## funciones_adicionales27

**Solución**

```python
# Crea una función lambda que calcule el cuadrado de un número.

numero = int(input("Ingrese un número: "))

cuadrado = lambda num: num * num

print(f"El cuadrado del número es: {cuadrado(numero)}")
```

## funciones_adicionales28

**Solución**

```python
# Usa una función lambda dentro de filter() para obtener los números mayores que 10 en una lista.

lista_numeros = []

numeros = input("Ingrese una lista de números separados por coma: ")

for i in numeros.split(","):
    lista_numeros.append(int(i))
    
mayor_que_10 = filter(lambda num: num > 10, lista_numeros)

print(f"Los números de la lista mayores a 10 son: {list(mayor_que_10)}")
```

## funciones_adicionales29

**Solución**

```python
# Crea una lista de números y usa lambda y sorted() para ordenarla de menor a mayor.

lista_numeros = []

numeros = input("Ingrese una lista de números separados por coma: ")

for i in numeros.split(","):
    lista_numeros.append(int(i))

menor_a_mayor = sorted(lista_numeros, key=lambda num: num)

print(menor_a_mayor)
```

## funciones_adicionales30

**Solución**

```python
# Usa lambda para crear una función que calcule la longitud de una cadena.

cadena = input("Ingrese una palabra: ")

longitud_cadena = lambda c : len(c)

print(f"La longitud de la palabra es: {longitud_cadena(cadena)}")
```

## funciones_adicionales31

**Solución**

```python
# Usa map() para convertir una lista de números a su cuadrado.

lista_numeros = []

numeros = input("Ingrese una lista de números separados por coma: ")

for i in numeros.split(","):
    lista_numeros.append(int(i))

cuadrado = map(lambda num: num * num, lista_numeros)

print(f"El cuadrado de los números de la lista son: {list(cuadrado)}")
```

## funciones_adicionales32

**Solución**

```python
# Crea una lista de cadenas y usa map() para convertirlas todas a mayúsculas.

lista_palabras = []

palabras = input("Ingrese una lista de palabras separadas por coma: ")

for i in palabras.split(","):
    lista_palabras.append(i)

palabra_mayuscula = map(lambda c: c.upper(), lista_palabras)

print(f"Las palabras de la lista en mayúscula: {list(palabra_mayuscula)}")
```

## funciones_adicionales33

**Solución**

```python
# Usa map() para sumar dos listas elemento por elemento.

lista_numeros1 = []
lista_numeros2 = []

for i in range(2):
    numeros = input("Ingrese una lista de números separados por coma: ")

    for k in numeros.split(","):
        if i == 0:
            lista_numeros1.append(int(k))
        else:
            lista_numeros2.append(int(k))

sumar_elementos = map(lambda a, b: a + b, lista_numeros1, lista_numeros2)
print(f"La suma de los numeros de las listas: {list(sumar_elementos)}")
```

## funciones_adicionales34

**Solución**

```python
# Usa map() para convertir una lista de grados Celsius a Fahrenheit.

grados_celsius = [-10, 0, 15, 20, 25, 30, 35, 40, 50, 100]

grados_fahrenheit = map(lambda gc: gc * (9 / 5) + 32, grados_celsius)

print(f"La conversión de los grados celsius de la lista a fahrenheit: {list(grados_fahrenheit)}")
```

## funciones_adicionales35

**Solución**

```python
# Crea una lista de números y usa map() para calcular su raíz cuadrada.

import math

numeros = [4, 16, 25, 36, 49, 64, 81, 100]

raiz_cuadrada = map(math.sqrt, numeros)

print(f"La raiz cuadrada de los números de la lista: {list(raiz_cuadrada)}")
```

## funciones_adicionales36

**Solución**

```python
# Usa zip() para combinar dos listas de nombres y edades en una lista de tuplas.

nombres = ["Maria", "Jose", "Pedro"]
edades = [40, 38, 53]

combinacion = zip(nombres, edades)

print(list(combinacion))
```

## funciones_adicionales37

**Solución**

```python
# Usa zip() para combinar tres listas: una de nombres, otra de edades y otra de ciudades.

nombres = ["Maria", "Jose", "Pedro"]
edades = [40, 38, 53]
ciudades = ["San pedro", "San juan", "San francisco"]

combinacion = zip(nombres, edades, ciudades)

print(list(combinacion))
```

## funciones_adicionales38

**Solución**

```python
# Usa zip() para combinar dos listas, luego desempaqueta el resultado en dos variables y muestra los elementos.

estudiantes = ["Jeiron", "Junior"]
notas = [90, 100]

combinacion = zip(estudiantes, notas)

for estudiante, nota in combinacion:
    print(f"El estudiante {estudiante} tiene una nota de {nota}.")
```

## funciones_adicionales39

**Solución**

```python
# Combina dos listas de números y usa zip() para sumar los elementos correspondientes.

lista1 = [1, 2, 3, 4, 5]
lista2 = [10, 20, 30, 40, 50]

sumar_elementos =  [a + b for a, b in zip(lista1, lista2)]

print(f"La suma correspondiente a cada elemento de las listas: {list(sumar_elementos)}")
```

## funciones_adicionales40

**Solución**

```python
# Usa zip() para combinar varias listas y luego imprime las tuplas resultantes.

lista1 = [1, 2, 3]
lista2 = [4, 5, 6]
lista3 = [7, 8, 9]

combinacion = zip(lista1, lista2, lista3)

for tupla in combinacion:
    print(tupla)
```
