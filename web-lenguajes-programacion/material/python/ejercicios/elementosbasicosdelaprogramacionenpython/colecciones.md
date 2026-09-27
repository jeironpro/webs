# Ejercicios — Colecciones

## colecciones_1

Escribir un programa que almacene las asignaturas de un curso, por ejemplo: Matemáticas, Física, Química, Historia y Lengua, en una lista y las muestre por pantalla.

**Solución**

```python
asignaturas = ["Matematicas", "Fisica", "Quimica", "Historia", "lengua"]
print(asignaturas)
```

## colecciones_2

Escribir un programa que almacene las asignaturas de un curso (por ejemplo: Matemáticas, Física, Química, Historia y Lengua) en una lista y muestre por pantalla el mensaje "Yo estudio <asignatura>", donde <asignatura> es cada una de las asignaturas de la lista.

**Solución**

```python
asignaturas = ["Matematicas", "Fisica", "Quimica", "Historia", "lengua"]
print("Yo estudio: ")

for asignatura in asignaturas:
    print(asignatura)
```

## colecciones_3

Escribir un programa que almacene las asignaturas de un curso (por ejemplo: Matemáticas, Física, Química, Historia y Lengua) en una lista, pregunte al usuario la nota que ha sacado en cada asignatura, y después las muestre por pantalla con el mensaje "En <asignatura> has sacado <nota>", donde <asignatura> es cada una de las asignaturas de la lista y <nota> cada una de las correspondientes notas introducidas por el usuario.

**Solución**

```python
asignaturas = ["Matematicas", "Fisica", "Quimica", "Historia", "lengua"]
notas = []

for asignatura in asignaturas:
    nota = float(input(f"Introduce la nota que has sacado en {asignatura}: "))
    notas.append(nota)

for asignatura in range(len(asignaturas)):
    print(f"En {asignaturas[asignatura]} has sacado {notas[asignatura]}")
```

## colecciones_4

Escribir un programa que pregunte al usuario los números ganadores de la lotería primitiva, los almacene en una lista y los muestre por pantalla ordenados de menor a mayor.

**Solución**

```python
lista_numeros = []

for i in range(3):
    numeros_loteria = int(input("Introduzca el número ganador de la lotería primitiva: "))
    lista_numeros.append(numeros_loteria)
    
lista_numeros.sort()
print(lista_numeros)
```

## colecciones_5

**Solución**

```python
# Escribir un programa que almacene en una lista los números del 1 al 10 y los muestre por pantalla en orden inverso, separados por comas.

numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
numeros.reverse()

for num in numeros:
    if num > 1:
        print(num, end=", ")
    else:
        print(num)
```

## colecciones_6

Escribir un programa que almacene las asignaturas de un curso (por ejemplo: Matemáticas, Física, Química, Historia y Lengua) en una lista, pregunte al usuario la nota que ha sacado en cada asignatura y elimine de la lista las asignaturas aprobadas. Al final, el programa debe mostrar por pantalla las asignaturas que el usuario tiene que repetir.

**Solución**

```python
asignaturas = ["Matematicas", "Fisica", "Quimica", "Historia", "lengua"]
notas = []

for asignatura in asignaturas:
    nota = float(input(f"Introduce la nota que has sacado en {asignatura}: "))
    notas.append(nota)

for asignatura in range(len(asignaturas)):
    if notas[asignatura] < 60:
        print(f"Debes repetir: {asignaturas[asignatura]}")
```

## colecciones_7

Escribir un programa que almacene el abecedario en una lista, elimine de la lista las letras que ocupen posiciones múltiplos de 3, y muestre por pantalla la lista resultante.

**Solución**

```python
abecedario = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "Ñ", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]

for i in range(len(abecedario), 0, -1):
    if i % 3 == 0:
        abecedario.pop(i-1)
print(abecedario)
```

## colecciones_8

**Solución**

```python
# Escribir un programa que pida al usuario una palabra y muestre por pantalla si es un palíndromo.

palabra = input("Escribe una palabra: ")

palabra_reves = palabra
palabra = list(palabra)
palabra_reves = list(palabra_reves)
palabra_reves.reverse()

if palabra == palabra_reves:
    print("La palabra es un palindromo")
else:
    print("La palabra no es un palindromo")
```

## colecciones_9

**Solución**

```python
# Escribir un programa que pida al usuario una palabra y muestre por pantalla el número de veces que contiene cada vocal.

vocales = ["a", "e", "i", "o", "u"]
palabra = input("Escribe una palabra: ")

for vocal in vocales:
    contador = 0
    for letra in palabra:
        if vocal == letra:
            contador += 1
    print(f"La palabra: {palabra} tiene: {contador} {vocal}")
```

## colecciones_10

**Solución**

```python
# Escribir un programa que almacene en una lista los siguientes precios: 50, 75, 46, 22, 80, 65, 8 y muestre por pantalla el menor y el mayor de los precios.

precios = [50, 75, 46, 22, 80, 65, 8]
menor = mayor = precios[0]

for precio in precios:
    if precio < menor:
        menor = precio
    elif precio > mayor:
        mayor = precio
print("EL mayor es: ", mayor)
print("El menor es: ", menor)
```

## colecciones_11

**Solución**

```python
# Escribir un programa que almacene los vectores (1, 2, 3) y (-1, 0, 2) en dos listas y muestre por pantalla su producto escalar.

vector1 = [1, 2, 3]
vector2 = [-1, 0, 2]

producto_escalar = 0
for i in range(len(vector1)):
    producto_escalar += vector1[i] * vector2[i]

print(f"El producto escalar de los vectores {vector1} y {vector2} es: {producto_escalar}")

print("Comprobación:")
index0 = vector1[0] * vector2[0]
index1 = vector1[1] * vector2[1]
index2 = vector1[2] * vector2[2]

print(f"La multiplicación de la posoción 0 de los vectores {vector1[0]} * {vector2[0]} da como resultado: {index0}")
print(f"La multiplicación de la posoción 1 de los vectores {vector1[1]} * {vector2[1]} da como resultado: {index1}")
print(f"La multiplicación de la posoción 2 de los vectores {vector1[2]} * {vector2[2]} da como resultado: {index2}")

print(f"El resultado de la comprobación es: {index0 + index1 + index2}")
```

## colecciones_12

Escribir un programa que almacene las siguientes matrices:

**A = [1, 2, 3]   B = [-1, 0]**

```python
    [4, 5, 6]       [0, 1]
                    [1, 1]
```

En una lista y muestre por pantalla su producto.
Nota: Para representar matrices mediante listas anidadas, representando cada vector fila en una lista.

**Solución**

```python
a = [
    [1, 2, 3],
    [4, 5, 6]
]

b = [
    [-1, 0],
    [0, 1],
    [1, 1]
]

resultado = [
    [0, 0],
    [0, 0]
]

for i in range(len(a)):
   for j in range(len(b[0])):
      for k in range(len(b)):
        resultado[i][j] += a[i][k] * b[k][j]

print("El producto de las matrices A y B es:")
for l in resultado:
    print(l)
```

## colecciones_13

Escribir un programa que pregunte por una muestra de números, separados por comas, los guarde en una lista y muestre por pantalla su media y desviación típica.

**Solución**

```python
import math

lista_muestras = []
suma_numeros = 0
x = 0
numeros = input("Introduce una muestra de números separados por comas: ")

for i in numeros.split(","):
    lista_muestras.append(float(i))

for j in lista_muestras:
    suma_numeros += j

media = suma_numeros / len(lista_muestras)

for k in lista_muestras:
    x += (k - media) ** 2

varianza = x / len(lista_muestras)

desviacion_tipica = math.sqrt(varianza)

print(f"La media de la muestra es: {media}")  
print(f"La desviación típica de la muestra es: {desviacion_tipica}")
```

## colecciones_adicionales1

Crea una lista que contenga los números del 1 al 10. Luego, imprime solo los números pares de la lista. (Pista: Usa un bucle y condicionales)

**Solución**

```python
numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

for i in numeros:
    if i % 2 == 0:
        print(i)
```

## colecciones_adicionales2

**Solución**

```python
# Solicita al usuario que ingrese 5 palabras y guárdalas en una lista. Al final, imprime la lista ordenada alfabéticamente.

lista_palabras = []

for i in range(5):
    palabra = input(f"Ingrese la palabra {i + 1}: ")
    lista_palabras.append(palabra)

lista_palabras.sort()
print(lista_palabras)
```

## colecciones_adicionales3

**Solución**

```python
# Dada la lista nombres = ["Ana", "Luis", "Sofía", "Juan"], reemplaza el segundo nombre por "Carlos" e imprime la lista actualizada.

nombres = ["Ana", "Luis", "Sofía", "Juan"]

nombres.pop(1)
nombres.insert(1, "Carlos")
print(nombres)
```

## colecciones_adicionales4

**Solución**

```python
# Crea una lista que contenga los números del 1 al 20 y elimina todos los números múltiplos de 3.

numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]

for i in range(len(numeros), 0, -1):
    if i % 3 == 0:
        numeros.pop(i-1)
print(numeros)
```

## colecciones_adicionales5

Escribe un programa que reciba una lista de números enteros del usuario y calcule la suma y el promedio de los números de la lista.

**Solución**

```python
numeros = input("Introduce una lista de numeros separados por coma: ")
lista_numeros = []
suma_numeros = 0;

for i in numeros.split(","):
    suma_numeros += int(i)
    lista_numeros.append(int(i))

promedio_numeros = suma_numeros / len(lista_numeros)
print(f"La suma de todos los números de la lista es: {suma_numeros}")
print(f"El promedio de los números de la lista es: {promedio_numeros}")
```

## colecciones_adicionales6

**Solución**

```python
# Crea una tupla con los nombres de los meses del año. Solicita al usuario un número (1-12) e imprime el mes correspondiente.

meses = ("enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre")

numero_mes = int(input("Escriba el numero del mes: "))
print(meses[numero_mes-1])
```

## colecciones_adicionales7

**Solución**

```python
# Dada la tupla tupla = (3, 7, 2, 5, 8, 7, 3, 5, 7), encuentra cuántas veces aparece el número 7.

tupla = (3, 7, 2, 5, 8, 7, 3, 5, 7)

contador = 0
for i in tupla:
    if i == 7:
        contador+=1
print(contador)
```

## colecciones_adicionales8

Crea una tupla con números enteros e imprime el mayor y el menor número de la tupla sin usar funciones predefinidas como max() o min().

**Solución**

```python
numeros = (10, 43, 21, 98, 4, 76, 14, 18)
menor = mayor = numeros[0]

for num in numeros:
    if num < menor:
        menor = num
    elif num > mayor:
        mayor = num

print("El menor de los números es:", menor)
print("El mayor de los números es:", mayor)
```

## colecciones_adicionales9

Dada la tupla colores = ("rojo", "verde", "azul"), convierte la tupla en una lista, agrega el color "amarillo" y vuelve a convertirla en tupla.

**Solución**

```python
colores = ("rojo", "verde", "azul")
print(colores)
colores = list(colores)
print(colores)
colores.append("amarrillo")
print(colores)
colores = tuple(colores)
print(colores)
```

## colecciones_adicionales10

Escribe un programa que reciba tres valores del usuario, cree una tupla con ellos y determine si todos los valores son iguales, diferentes o si hay al menos un duplicado.

**Solución**

```python
valor1 = input("Ingresa el primer valor: ")
valor2 = input("Ingresa el segundo valor: ")
valor3 = input("Ingresa el tercer valor: ")
tupla_valores = (valor1, valor2, valor3)

if valor1 == valor2 == valor3:
    print("Todos los valores son iguales")
elif valor1 == valor2 or valor1 == valor3 or valor2 == valor3:
    print("Hay al menos un duplicado")
else:
    print("Todos los valores son diferentes") 
    
tupla_valores = tuple(tupla_valores)
print(tupla_valores)
```

## colecciones_adicionales11

Crea un diccionario llamado persona que contenga las claves nombre, edad y ciudad. Solicita al usuario que ingrese valores para cada clave e imprime el diccionario resultante.

**Solución**

```python
persona = {
    "nombre": "",
    "edad": "",
    "ciudad": ""
}

persona["nombre"] = input("Ingrese su nombre: ")
persona["edad"] = int(input("Ingrese su edad: "))
persona["ciudad"] = input("Ingrese su ciudad: ")
print(persona)
```

## colecciones_adicionales12

**Solución**

```python
# Dado el diccionario calificaciones = {"Juan": 8, "Ana": 9, "Luis": 7}, calcula el promedio de todas las calificaciones.

calificaciones = {"Juan": 8, "Ana": 9, "Luis": 7}

suma = sum(calificaciones.values());
longitud = len(calificaciones)

print(suma/longitud)
```

## colecciones_adicionales13

Crea un programa que permita al usuario ingresar un número indefinido de pares clave-valor (por ejemplo, nombres y edades). Detén la entrada cuando el usuario escriba "fin" como clave.

**Solución**

```python
diccionario = {}

while True:
    clave = input("Ingresa la clave (escribe 'fin' para terminar): ")

    if clave == "fin":
        break

    valor = input(f"Ingresa el valor de la clave {clave}: ")
    
    diccionario[clave] = valor

print("Los pares clave-valor ingresados son:")
for clave, valor in diccionario.items():
    print(f"{clave}: {valor}")
```

## colecciones_adicionales14

**Solución**

```python
# Usa un diccionario para contar cuántas veces aparece cada palabra en la frase: "El sol brilla pero el sol se oculta también".

frase = "El sol brilla pero el sol se oculta también"
palabras = frase.lower().split()

contador_palabras = {}

for palabra in palabras:
    if palabra in contador_palabras:
        contador_palabras[palabra] += 1
    else:
        contador_palabras[palabra] = 1

print("Contador de palabras:")
for palabra, cantidad in contador_palabras.items():
    print(f"{palabra}: {cantidad}")
```

## colecciones_adicionales15

Crea un programa que reciba una lista de nombres y edades del usuario, los guarde en un diccionario y luego permita consultar la edad de cualquier nombre ingresado por el usuario.

**Solución**

```python
personas = {}

while True:
    nombre = input("Ingresa el nombre (o escribe 'fin' para terminar): ")

    if nombre.lower() == "fin":
        break

    edad = input(f"Ingrese la edad de {nombre}: ")

    while not edad.isdigit():
        print("Por favor, ingresar una edad válida.")
        edad = input(f"Ingrese la edad de {nombre}: ")
    
    personas[nombre] = int(edad)

while True:
    consulta = input("Ingresa un nombre para consultar la edad (o escribe 'fin' para terminar): ")

    if consulta.lower() == "fin":
        break

    if consulta in personas:
        print(f"La edad de {consulta} es: {personas[consulta]}")
    else:
        print(f"No se encontró el nombre {consulta}.")
```

## colecciones_adicionales16

Crea dos conjuntos con los números del 1 al 5 y del 4 al 8, respectivamente. Imprime:

La unión de los conjuntos.
La intersección de los conjuntos.
La diferencia de ambos conjuntos.

**Solución**

```python
conjunto1 = {1, 2, 3, 4, 5}
conjunto2 = {4, 5, 6, 7, 8}

print(conjunto1 | conjunto2)
print(conjunto1 & conjunto2)
print(conjunto1 - conjunto2)
```

## colecciones_adicionales17

Dado el conjunto colores = {"rojo", "verde", "azul"}, permite al usuario agregar un color al conjunto. Si el color ya está, muestra un mensaje indicando que ya existe.

**Solución**

```python
colores = {"rojo", "verde", "azul"}
color = input("Agregar el color: ")

if color in colores:
    print("El color ya existe")
else:
    colores.add(color)
print(colores)
```

## colecciones_adicionales18

**Solución**

```python
# Escribe un programa que compare dos conjuntos de palabras ingresadas por el usuario y determine si tienen elementos en común o no.

conjunto1 = input("Ingresa el primer conjunto de palabras, separado por espacios: ").split()

conjunto2 = input("Ingresa el segundo conjunto de palabras, separado por espacios: ").split()

conjunto1 = set(conjunto1)
conjunto2 = set(conjunto2)

if conjunto1 & conjunto2:
    print("Los conjuntos tienen elementos en común:", conjunto1 & conjunto2)
else:
    print("Los conjuntos no tienen elementos en común.")
```

## colecciones_adicionales19

**Solución**

```python
# Dado un conjunto con números del 1 al 10, elimina todos los números pares usando un bucle.

numeros = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10}

for i in range(len(numeros), 0, -1):
    if i % 2 == 0:
        numeros.remove(i)
print(numeros)
```

## colecciones_adicionales20

Usa dos conjuntos para guardar las letras de dos palabras ingresadas por el usuario. Imprime si las palabras son un anagrama o no (es decir, si contienen las mismas letras, sin importar el orden).

**Solución**

```python
palabra1 = input("Ingresa la primera palabra: ").lower()
palabra2 = input("Ingresa la segunda palabra: ").lower()

conjunto1 = set(palabra1)
conjunto2 = set(palabra2)

if conjunto1 == conjunto2:
    print("Las palabras son anagramas.")
else:
    print("Las palabras no son anagramas.")
```
