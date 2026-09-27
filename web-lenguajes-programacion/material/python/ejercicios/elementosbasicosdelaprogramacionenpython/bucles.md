# Ejercicios — Bucles

## bucles1

**Solución**

```python
# Escribir un programa que pida al usuario una palabra y la muestre por pantalla 10 veces.

palabra = input("Escribe una palabra: ")

for i in range(1, 11):
    print(f"{i}- {palabra}")
```

## bucles2

**Solución**

```python
# Escribir un programa que pregunte al usuario su edad y el año actual, y luego muestre por pantalla todos los años que ha cumplido, desde el primero hasta el año actual.

edad = int(input("Escriba su edad: "))
anio_actual = int(input("Escriba el año actual: "))
anio_actual_tmp = anio_actual 
anio_actual = anio_actual - edad

for i in range(0, edad):
    if i == 0:
        print(f"Has nacido en el {anio_actual}")
    else:
        anio_actual += 1
        print(f"En el {anio_actual} tenias {i}")

        if anio_actual == anio_actual_tmp-1:
            print(f"En el año actual {anio_actual_tmp} tienes o tendrás {i+1}")
```

## bucles3

Escribir un programa que pida al usuario un número positivo y muestre por pantalla todos los números impares desde 1 hasta ese número separados por comas.

**Solución**

```python
numero = int(input("Introduzca un número positivo: "))

for i in range(numero):
    if i % 2 != 0:
        if i < numero-1:
            print(i, end=", ")
        else:
            print(i)
```

## bucles4

Escribir un programa que pida al usuario un número entero positivo y muestre por pantalla la cuenta atrás desde ese número hasta cero, separados por comas.

**Solución**

```python
numero = int(input("Introduzca un numero positivo: "))

print("Inicio de la cuenta regresiva: ")
for i in range(numero, -1, -1):
    print(i)
```

## bucles5

Escribir un programa que pregunte al usuario una cantidad a invertir, el interés anual y el número de años, y muestre por pantalla el capital obtenido en la inversión cada año que dura la inversión.

**Solución**

```python
cantidad_invertir = int(input("Introduzca la cantidad a invertir: "))
interes_anual = int(input("Introduzca el interés anual: "))
numero_anios = int(input("Introduzca el número de año de la inversión: "))

contador = 1
while (contador <= numero_anios):
    anio = contador
    ganancias = (cantidad_invertir / 100) * interes_anual * anio

    if contador == 1:
        print(f"En {anio} año, tus ganancias seran de {ganancias}")
    else:
        print(f"En {anio} años, tus ganancias seran de {ganancias}")

    contador += 1
```

## bucles6

Escribir un programa que pida al usuario un número entero y muestre por pantalla un triángulo rectángulo como el de más abajo, de altura el número introducido.

```python
*
**
***
****
*****
```

**Solución**

```python
numero = int(input("Escriba un número entero: "))

for i in range(1, numero+1, 1):
    print(i * "*")
```

## bucles7

**Solución**

```python
# Escribir un programa que muestre por pantalla la tabla de multiplicar del 1 al 10.

for i in range(1, 11):
    for j in range(1, 11):
        print(f"{i} x {j} = {i * j}")
```

## bucles8

Escribir un programa que pida al usuario un numero entero y muestre por pantalla un triangulo rectagulo
como el de mas abajo

**1**
3 1
5 3 1
7 5 3 1
9 7 5 3 1

**Solución**

```python
numero = int(input("Introduce un número entero: "))

for i in range(1, numero, 2):
    for j in range(i, 0, -2):
        print(j, end=" ")
    print("\n")
```

## bucles9

Escribir un programa que almacene la cadena de caracteres "contraseña" en una variable, pregunte al usuario por la contraseña hasta que introduzca la contraseña correcta.

**Solución**

```python
contrasena = "contraseña"
contrasena_usuario = input("Introduzca la contraseña correcta: ")

while contrasena != contrasena_usuario:
    if contrasena != contrasena_usuario:
        print("Contraseña incorrecta.")
        contrasena_usuario = input("Introduzca nuevamente la contraseña: ")

print("La contraseña introducida es correcta.")
```

## bucles10

**Solución**

```python
# Escribir un programa que pida al usuario un número entero y muestre por pantalla si es un número primo o no. 

numero = int(input("Introduzca un número entero: "))
contador = 0

for i in range(1, numero+1):
    if numero % i == 0:
        print(f"{numero} / {i} = {numero / i}")
        contador += 1

if contador == 2:
    print("El número es primo")
else:
    print("El número no es primo")
```

## bucles11

Escribir un programa que pida al usuario una palabra y luego muestre por pantalla una a una las letras de la palabra introducida, empezando por la última.

**Solución**

```python
palabra = input("Escriba una palabra: ")

for i in range(len(palabra), 0, -1):
    print(palabra[i-1])
```

## bucles12

Escribir un programa en el que se le pregunte al usuario por una frase y una letra, y muestre por pantalla el número de veces que aparece la letra en la frase.

**Solución**

```python
frase = input("Escriba una frase: ")
letra = input("Escriba una letra: ")
contador = 0

for i in range(len(frase)):
    if frase[i] == letra:
        contador += 1
print(f"La {letra} aparece {contador} en la frase.")
```

## bucles13

**Solución**

```python
# Escribir un programa que muestre el eco de todo lo que el usuario introduzca hasta que el usuario escriba "salir", lo que terminará el programa. 

palabra = input("El eco espera palabra (o escribe 'salir' para terminar): ")

while palabra != "salir":
    print("El eco repite palabra", palabra)
    palabra = input("El eco espera palabra (o escribe 'salir' para terminar): ")
print("Ádios")
```

## bucles_adicionales1

Suma de números pares: Escribe un programa que calcule la suma de todos los números pares entre 1 y 100 usando un bucle for.

Entrada esperada: Ninguna.
Salida esperada: La suma de los números pares es: 2550.

**Solución**

```python
suma = 0
for i in range(1, 101):
    if i % 2 == 0:
        suma += i
print("La suma de los núemros pares es:", suma)
```

## bucles_adicionales2

Revertir un texto: Escribe un programa que, usando un bucle for, invierta un texto ingresado por el usuario.

Entrada: hola.
Salida esperada: aloh.

**Solución**

```python
texto = input("Escriba un texto: ")

for i in range(len(texto), 0, -1):
    print(texto[i-1], end="")
```

## bucles_adicionales3

Contar vocales en una palabra: Escribe un programa que pida una palabra al usuario y cuente cuántas vocales tiene.

Entrada: Python.
Salida esperada: La palabra contiene 1 vocal(es).

**Solución**

```python
vocales = ["a", "e", "i", "o", "u"]
palabra = input("Ingrese una palabra: ")

contador = 0
for vocal in vocales:
    for j in range(len(palabra)):
        if palabra[j] == vocal:
            contador += 1
print(f"La palabra contiene {contador} vocal(es).")
```

## bucles_adicionales4

Adivina el número: Implementa un programa que genere un número aleatorio entre 1 y 10, y que permita al usuario adivinarlo hasta acertar. Usa while para repetir las adivinanzas.

Entrada: 5 (suponiendo que el número aleatorio sea 5).
Salida esperada: ¡Correcto! Has adivinado el número.

**Solución**

```python
import random

numero_aleatorio = random.randint(1, 10)
numero_usuario = int(input("Adivina el número pensado: "))

while numero_usuario != numero_aleatorio:
    print("Incorrecto.")
    numero_usuario = int(input("Vuelva a intentarlo: "))

print("¡Correcto! Has adivinado el número.")
```

## bucles_adicionales5

Sumar hasta que el usuario ingrese 0: Pide al usuario que ingrese números y suma todos los valores. Termina el programa cuando el usuario ingrese 0.

Entrada: 10, 5, 0.
Salida esperada: La suma total es: 15.

**Solución**

```python
numero = int(input("Escriba un numero: (o para acabar escriba 0): "))

suma = 0
while numero > 0:
    suma += numero
    numero = int(input("Escriba un numero: (o para acabar escriba 0): "))
print(f"La suma total es: {suma}")
```

## bucles_adicionales6

Imprimir números impares: Usando un bucle while, imprime todos los números impares del 1 al 20.

Salida esperada: 1, 3, 5, ..., 19.

**Solución**

```python
impares = 1

while True:
    if impares < 19:
        print(impares, end=", ")
    else:
        print(impares)
    impares += 2

    if (impares > 20):
        break
```
