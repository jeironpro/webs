# Argsykwargs

*args y **kwargs
Cuando trabajas con funciones, a veces necesitas que una función acepte un número variable de argumentos. Pythom tiene dos mecanismos que permiten esto: *args y **kwargs.

- **1.** *args (Argumentos Posicionales variables)
- *args permite pasar un número variable de argumentos posicionales a una función.
- *Args: permite utilizar argumentos de manera indefinida. El asterisco indica que tendrá una cantidad indeterminada de argumentos.
- Dentro de la función, args se comporta como una tupla que contiene todos los argumentos adicionales que se pasen.

**Sintaxis**
def nombre_funcion():

```python
    for arg in args:
        print(arg)
```

- **2.** **kwargs (Argumentos con Palabra Clave Varibales)
- **kwargs permite pasar un número variable de argumentos con palabra clave (pares clave-valor).
- Dentro de la función, kwargs se comporta como un diccionario donde las claves son los nombres de los argumentos y los valores pasados a esos argumentos.

**Sintaxis**
def nombre_funcion(**kwargs):

```python
    for clave, valor in kwargs.items():
        print(f"{clave}: {valor}")
```

- **3.** Uso combinado de *args y **kwargs
- Puedes combinar ambos, *args y **kwargs, en una misma función. Sin embargo, *args debe aparecer antes que **kwargs en la definición de la función.

- **4.** Uso de *args y **kwargs con funciones predefinidas
- *args y **kwargs se usan mucho en funciones que aceptan un número variable de parámetros, como en las funciones de bibliotecas estándar o al definir clases y decoradores.

**Diferencia clave entre *args y **kwargs**
- *args: recibe una cantidad variable de argumentos posicionales y los convierte en un tupla.

- **kwargs: recibe una cantidad variable de argumentos con palabra clave y los convierte en un diccionario.

```python
# Ejemplo con *args
def imprimir_numeros(*args):
    for numero in args:
        print(numero)

imprimir_numeros(1, 2, 3, 4) 
# Salida:
# 1
# 2
# 3
# 4

# Ejemplo con **kwargs
def imprimir_persona(**kwargs):
    for clave, valor in kwargs.items():
        print(f"{clave}: {valor}")

imprimir_persona(nombre = "Jeiron", edad = 21)
# Salida:
# nombre: Jeiron
# edad: 21

# Ejemplo de uso combinado de *args y **kwargs
def funcion_combinada(*args, **kwargs):
    print("Argumentos posicionales:")
    for arg in args:
        print(arg)
    
    print("\nArgumentos con palabra clave:")
    for clave, valor in kwargs.items():
        print(f"{clave}: {valor}")

funcion_combinada(1, 2, 3, nombre = "Jeiron", edad = 21)
# Salida:
# Argumentos posicionales:
# 1
# 2
# 3

# Argumentos con palabra clave:
# nombre: Jeiron
# edad: 21

# Ejemplo de uso en una función predefinada
def sumar(*args):
    return sum(args)

print(sumar(1, 2, 3)) # Salida: 6
print(sumar(4, 5)) # Salida: 9

# Función con parámetros fijos
def indefinida(arg1, arg2, arg3, arg4, arg5):
    print(arg1)
    print(arg2)
    print(arg3)
    print(arg4)
    print(arg5)

indefinida("Santiago", "i", "j", "f", "a")

# Utilizar *args y agrupar como una tupla
def indefinida(*args):
    print(args)

indefinida("Santiago", "i", "j", "f", "a", "cibao")

# Utilizar *args con un bucle for
def indefinida(*args):
    for i in args:
        print(i)

indefinida("Santiago", "i", "j", "f", "a", "cibao")

# Realizar cálculos con *args
def numeros(*args):
    total = sum(args)
    print("El total de la suma es", total)

numeros(50, 30, 80, 75, 35, 84, 55, 16, 250, 45, 100)

# Función con **kwargs (Keyword Arguments)
def empleado(nombre, puesto, lenguaje):
    print(nombre)
    print(puesto)
    print(lenguaje)

empleado("Juan", "Programador", "Python")

# Utilizar **kwargs para pasar argumentos como diccionario
def empleado(**kwargs):
    for clave, valor in kwargs.items():
        print(f"{clave} : {valor}")
        # print("{} : {}".format(clave, valor)) # Ambas formas son válidas.

empleado(nombre="Juan", puesto="Programador", lenguaje="Python")
```
