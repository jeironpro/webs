# Excepciones

**Excepciones**
Las excepciones son errores que ocurren durante la ejecución de un programa. Estos errores surgen a pesar de que la sintaxis sea correcta.

**Ejemplos**
- Acceder a una posicion de una lista superior a la longitud de esta.
- Intentar abrir un archivo o fichero que no existe.
- Convertir string a int

Gestionar las excepciones permite que el codigo continue ejecutandose a pesar de lo errores que puedan ocurrir.

**Manejo de excepciones con try y except**
- El bloque try contiene el código que podría causar un error.
- El bloque except contiene el código que se ejecutará si se produce un error en el bloque try.

**Sintaxis**
try:

```python
    # Código que podría generar una excepción
    resultado = 10 / 0 # Error: división por cero
```

except ZeroDivisionError:

```python
    print("¡Error! No puedes dividir por cero.")
```

**Bloque else**
El bloque else se ejecuta si no ocurre ninguna excepción en el bloque try.

**Sintaxis**
try:

```python
    # Código que podría generar una excepción
    resultado = 10 / 2
```

except ZeroDivisionError:

```python
    print("¡Error! No puedes dividir por cero.")
else:
    print("La operación se realizó correctamente.")
```

**Bloque finally**
El bloque finally se ejecuta siempre, independientemente de si ocurre o no una excepción. Se utiliza para liberar recursos o realizar tareas de limpieza, como cerrar archivos o conexiones.

**Sintaxis**
try:

```python
    # Código que podría generar una excepción
    archivo = open("archivo.txt", "r")
```

except FileNotFoundError:

```python
    print("El archivo no fue encontrado.")
```

finally:

```python
    print("Este bloque siempre se ejecuta.")
```

**Excepciones personalizadas**
Puedes crear tus propias excepciones en Python para casos específicos, heredando de la clase base Exception.

**Sintaxis**

```python
class MiExcepcion(Exception):
    pass
```

**try**

```python
    raise MiExcepcion("Ocurrio un error personalizado.")
```

except MiExcepcion as e:

```python
    print(e)
```

**Jerarquía de Excepciones**
En Python, las excepciones son clases que heredan de la clase base Exception. Existen excepciones predefinidas para distintos errores, como ZeroDivisionError, ValueError, IndexError, etc. Puedes capturar excepciones de manera más general usando Exception.

**Re-levantamiento de excepciones**
Puedes volver a lanzar una excepción después de haberla manejado utilizando raise:

**Sintaxis**
try:

```python
    numero = int(input("Ingresa un número: "))
```

except ValueError:

```python
    print("¡Error! No es un número.")
    raise # Vuelve a levantar la excepción
```

**Beneficios del manejo de excepciones**
- Mejora la estabilidad de tu programa al evitar que se detenga por errores inesperados.

- Permite que el código sea más claro y fácil de mantener.

- Te da la oportunidad de realizar acciones de limpieza cuando sea necesario.

```python
# Ejemplo de try y except
try:
    numero = int(input("Ingresa un número: "))
    resultado = 10 / numero
    print(f"El resultado es: {resultado}")
except ZeroDivisionError:
    print("¡Error! No puedes dividir por cero.")
except ValueError:
    print("¡Error! Debes ingresar un número válido.")

# Ejemplo de try, except y else
try:
    numero = int(input("Ingresa un número: "))
    resultado = 10 / numero
    print(f"El resultado es: {resultado}")
except ZeroDivisionError:
    print("¡Error! No puedes dividir por cero.")
except ValueError:
    print("¡Error! Debes ingresar un número válido.")
else:
    print(f"El resultado es: {resultado}")

# Ejemplo de try, except y finally
try:
    archivo = open("archivo.txt", "r")
    contenido = archivo.read()
except FileNotFoundError:
    print("El archivo no fue encontrado.")
finally:
    print("Cerrando archivo.")
    archivo.close() # Este código se ejecutará sin importar lo que ocurra arriba.

# Ejemplo de jerarquía de excepciones
try:
    num = int("abc")
except ValueError as e:
    print(f"Error: {e}")
except Exception as e:
    print(f"Error general: {e}")

# Ejemplo 1: try, except
def division(num1, num2):
    try:  # try prueba el código para comprobar si todo funciona correctamente
        resultado = num1 / num2
        print(resultado)
    except ZeroDivisionError:  # except muestra un mensaje si encuentra un error
        print("No se puede dividir entre 0")

division(10, 2)
division(10, 0)
print("Aquí termina este programa")

# Ejemplo 2: Gestionar distintos tipos de excepciones
menu = ["0-Yuca con Chicharrón", "1-Mofongo", "2-Arroz con Camarones"]

def elegirMenu(listaMenu):
    try:
        print(listaMenu)
        index = int(input("Elige un plato del menú (Escribe el número): "))
        print(f"Tu comida favorita es {listaMenu[index]}")
    except IndexError:  # Si el índice digitado no existe, está fuera del rango
        print(f"Índice incorrecto, debe estar entre 0 y {len(listaMenu)-1}")
    except ValueError:  # Está introduciendo un número que no es entero
        print("Solo acepta números enteros")

elegirMenu(menu)
elegirMenu(menu)
elegirMenu(menu)
elegirMenu(menu)
elegirMenu(menu)

# Ejemplo 3: Excepción Exception
# Las excepciones son objetos que heredan de la clase Exception
menu = ["0-Yuca con Chicharrón", "1-Mofongo", "2-Arroz con Camarones"]

def elegirMenu(listaMenu):
    try:
        print(listaMenu)
        index = int(input("Elige un plato del menú (Escribe el número): "))
        print(f"Tu comida favorita es {listaMenu[index]}")
    except Exception:  # Muestra el error, sin importar la razón
        print("Ha ocurrido un error, algo salió mal.")

elegirMenu(menu)

# Renombrar excepción Exception
import logging

menu = ["0-Yuca con Chicharrón", "1-Mofongo", "2-Arroz con Camarones"]

def elegirMenu(listaMenu):
    try:
        print(listaMenu)
        index = int(input("Elige un plato del menú (Escribe el número): "))
        print(f"Tu comida favorita es {listaMenu[index]}")
    except Exception as errorRandom:  # Renombramos la excepción y mostramos el error
        # print(errorRandom)  # Muestra el error
        logging.exception("El error es el siguiente: ")  # Muestra el error más detallado

elegirMenu(menu)

# Ejemplo 4: else, finally, raise
# Sumar los números que nos pase el usuario separados por espacios
while True:
    try:
        total = 0
        numeros = input("Escribe números separados por espacios: ")
        numeros = numeros.split()

        for num in numeros:
            if num.isnumeric():
                total += float(num)
            else:
                raise ValueError("El valor introducido no es número.")
    except ValueError:
        print("Los datos son incorrectos")
        print("Vuelva a introducir los números")
    else:  # Si el try se ejecuta sin errores entonces se ejecuta el else
        print("El valor de la suma es", total)
        break  # El break se utiliza para salir del while True
    finally:  # Ejecuta este código independientemente de si ha habido una excepción o no
        print("Ha terminado el programa")
```
