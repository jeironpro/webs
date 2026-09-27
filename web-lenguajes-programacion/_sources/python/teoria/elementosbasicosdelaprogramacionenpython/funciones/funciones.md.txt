# Funciones

**Funciones**
Las funciones son un conjunto de líneas de código agrupadas (bloque de código) que funcionan como una unidad, realizando una tarea específica.

Las funciones en Python pueden devolver o no valores y, además, pueden tener parámetros o argumentos.

Una función es un bloque de código reutilizable que realiza una tarea específica. Las funciones nos permiten:

- Organizar el código.
- Reducir la redundancia.
- Mejorar la legibilidad.
- Facilitar el mantenimiento.

Utilidad: Reutilizar el código.

En Python, la funciones se definen con la palabra clave def.

**Sintaxis**
def nombre_funcion(parametros):

```python
    instrucciones de la función
    return (opcional)
```

- **1.** def: indica el inicio de la definición de la función.
  2. nombre_funcion(): es el identificador de la función.
3. parametros: (opcionales) son valores que la función recibe para trabajar.
4. return: (opcional) devuelve un valor al lugar donde se llamó la función.

Ejecución de la función: Se ejecuta escribiendo el nombre de la función con o sin parámetros o argumentos.

A las variables también se les denomina como "métodos" cuando se encuentran definidas dentro de una clase.
- Funciones predefinidas son las que nos proporciona el lenguaje.
- Funciones propias son las que nosotros creamos.

```python
# Ejemplo básico
def saludar():
    print("¡Hola, mundo!")

saludar()  # Salida: ¡Hola, mundo!

# Tipos de funciones
# Sin parámetros y sin retorno
def bienvenida():
    print("Bienvenido a las funciones.")

# Con parámetros y sin retorno
def saludar(nombre):
    print(f"Hola, {nombre}.")

saludar("Jeiron")  # Salida: Hola, Jeiron.

# Con parámetros y con retorno
def sumar(a, b):
    return a + b

resultado = sumar(3, 5)
print(resultado)  # Salida: 8

# Sin parámetros y con retorno
def obtener_pi():
    return 3.14159

print(obtener_pi())  # Salida: 3.14159

# Realizar cálculos con una función sin parámetros o argumentos
def suma():  # Declaración de la función con la palabra reservada def
    # Cuerpo de la función
    num1 = 15
    num2 = 25
    print(num1 + num2)

suma()  # Llamada de la función

# No se puede llamar a una función antes de su declaración
# Realizar cálculos diferentes con una función con parámetros
def suma(num1, num2):
    print(num1 + num2)

suma(150, 250)  # Salida: 400
suma(35, 25)    # Salida: 60

# Crear una función con parámetros y utilizar la palabra clave return
def suma(num1, num2):
    resultado = num1 + num2
    return resultado  # Se utiliza return porque se puede almacenar en una variable

print(suma(75, 25))  # Salida: 100

resultado_variable = suma(100, 400)
print(resultado_variable)  # Salida: 500
```
