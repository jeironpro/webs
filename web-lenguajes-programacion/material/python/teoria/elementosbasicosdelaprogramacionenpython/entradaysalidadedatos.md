# Entrada y salida de datos

**Salida de datos (print())**
La función print() permite mostrar datos o mensajes en la pantalla. Es una de las formas más comunes de interactuar con el usuario.

```python
# Uso básico
print("Hola, mundo")

# Mostrar varias cosas
# Puedes mostrar múltiples valores separados por comas.
nombre = "Jeiron"
edad = 21
print("Mi nombre es", nombre, "y tengo", edad, "años de edad.")

# Personalizar la salida
# Cambiar el separador
print("Python", "es", "genial", sep="-")

# Cambiar el final
# Por defecto, print() termina con un salto de línea (\n), pero puedes cambiarlo.
print("Hola", end=" ")
print("Mundo")

# Uso de format
print("Mi nombre es {} y tengo {} años de edad.".format(nombre,edad))

# Otra forma con format (abreviada)
print(f"Mi nombre es {nombre} y tengo {edad} años de edad.")

''' Entrada de datos (input())
La función input() permite al usuario ingresar información. Estos datos se devuelven como cadena de texto (str).
'''

# Uso básico
nombre = input("¿Cuál es tu nombre? ")
print("Hola", nombre)

# · input() siempre devuelve una cadena (str), asi que si necesitas otro tipo de dato, debes convertirlo.

# Conversión de tipos
# Convertir a número entero (int)
edad = int(input("¿Cuántos años tienes? "))
print("Tienes", edad, "años de edad.")

# Convertir a número flotante
precio = float(input("Ingresa el precio del producto: "))
print(f"El precio del producto es {precio}")

'''
Diferencia entre Entrada y Salida
Función	  Propósito
print()	  Muestra datos o mensajes al usuario en la consola.
input()	  Recoge datos ingresados por el usuario desde la consola.
'''
```
