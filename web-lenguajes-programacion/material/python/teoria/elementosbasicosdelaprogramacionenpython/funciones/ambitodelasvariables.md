# Ámbito de las variables

**' Ámbito de las variables**
El ámbito (o scope) de una variable se refiere a la parte del programa donde esa variable es accesible. En Python, el ámbito de las variables depende de dónde se declara y utiliza la variable.

El ambito de una variable es el area dentro del programa donde esa variable es conocida.

**Tipos de ámbitos en Pyhton**
1. Ámbito local: una variable tiene un ámbito local si se declara dentro de una función. Solo es accesible dentro de esa función.

**Sintaxis**
def nombre_funcion():

```python
    nombre_variable_local = valor
    print(nombre_variable_local)
```

nombre_funcion() # Salida: valor de nombre_variable_local

Si se intenta mostrar el valor de nombre_variable_local print(nombre_variable_local) fuera de la función, causará un error porque nombre_variable_local no es accesible fuera de la función.

- **2.** Ámbito global: una variable tiene ámbito global si se declara fuera de cualquier función o bloque. Es accesible desde cualquier parte del programa, excepto cuando una función local tiene una variable con el mismo nombre.

**Sintaxis**
nombre_variable_global = valor

**def nombre_funcion()**

```python
    print(nombre_variable_global)
```

nombre_funcion() # Salida: valor de nombre_variable_global

A esta variable nombre_variable_global se puede acceder desde cualquier parte del programa.

- **3.** Ámbito no local (nonlocal): se utiliza para acceder o modificar variables en el ámbito de una función envolvente, que no sean globales. Es útil en funciones anidadas.

**Sintaxis**
def nombre_funcion():

```python
    nombre_variable_nonlocal = valor

    def nombre_funcion_interna():
        nonlocal nombre_variable_nonlocal
        nombre_variable_nonlocal += valor
        print(nombre_variable_nonlocal)

    nombre_funcion_interna()
    print(nombre_variable_nonlocal)
```

nombre_funcion() # Salida: 35

**Reglas de resolución de ámbito (LEGB)**
Python utiliza el modelo LEGB para buscar una variable en este orden:

- **1.** Local: dentro de la función actual.

- **2.** Enclosing (Envolvente): en funciones que envuelven otras funciones (si existe).

- **3.** Global: en el ámbito global.

- **4.** Built-in: en el ámbito de las funciones y objetos incorporados de Python.

**Variables globales dentro de funciones**
Si necesitas modificar una variable global dentro de una función, debes usar la palabra clave global. Sin esto, Python creará una nueva variable local con el mismo nombre, en lugar de modificar la global.

**Sintaxis**
nombre_variable_global = valor

**def nombre_funcion()**

```python
    global nombre_variable_global
    nombre_variable_global += valor
    print(nombre_variable_global)
```

**nombre_funcion() # Salida: 1**
nombre_funcion() # Salida: 2

```python
# Errores comunes
# Confusión entre variables locales y globales
x = 5
def mi_funcion():
    x += 1 # Error: Referencia a una variable global sin declararla como global
    print(x)

# Modificar una variable no local sin nonlocal
def externa():
    y = 10
    def interna():
        y += 5 # Error: Necesita nonlocal para modificar y

# Declarar una variable dentro de una función
valor = 7  # Variable global porque está fuera de la función y se puede llamar desde cualquier lugar.

def avariable(n):
    datos = 3  # Variable local porque solo puede ser llamada desde la función en la que se encuentra.
    print(n * datos)
    print("El valor de la variable dentro de la función:", datos)
    print("El valor de la variable fuera de la función es:", valor)

avariable(valor)
print(valor)  # Salida: 7

# print("Llamando una variable desde fuera de la función:", datos)  # Error: datos no está definido
# Llamar una variable declarada dentro de una función desde fuera de esta. Esto generará un error porque las variables locales no son accesibles fuera de la función.

# Al crear dos funciones con las mismas variables, estas se consideran diferentes
valor = 7

def avariable(n):
    datos = 3
    print(n * datos)
    print("El valor de la variable dentro de la función:", datos)

def avariable2(n):
    datos = 8
    print(n + datos)
    print("El valor de la variable dentro de la función:", datos)

avariable(valor)
avariable2(valor)

# Crear dos variables con el mismo nombre (una global y otra local)
# Cuando una variable local y global tienen el mismo nombre, se usará solo la local dentro de la función.
datos = 25  # Variable global

def avariable(n):
    datos = 3  # Variable local
    print(n * datos)
    print("El valor de la variable dentro de la función:", datos)

def avariable2(n):
    datos = 8  # Variable local
    print(n + datos)
    print("El valor de la variable dentro de la función:", datos)

def avariable3(n):
    print("El valor de la variable fuera de la función:", datos)  # Se refiere a la variable global

avariable(datos)
avariable2(datos)
avariable3(datos)
print(datos)  # Salida: 25
```
