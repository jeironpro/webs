# For

**Bucles (for)**
Un bucle es una estructura de control que permite ejecutar repetidamente un bloque de código mientras se cumpla una condición o se recorran los elementos de una secuencia.

**Tipos de bucles**
1- for loop: itera sobre una secuencia (listas, tuplas, cadenas, rangos, etc).
2- while loop: repite un bloque de código mientras una condición sea verdadera.

El bucle o ciclo for se utiliza cuando conocemos la cantidad de iteraciones que se desea realizar (recorrer los elementos de una secuencia uno por uno).

sintaxis: For nombreVariable in colección

```python
# Mostrar una lista de numeros
for i in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]:
    print(i)

''' range()
La función range() genera una secuencia de números en un intervalo definido, pero no crea una lista en memoria. En su lugar, devuelve un objecto iterable que produce los números de uno en uno cuando se necesitan, lo que la hace muy eficiente.

Sintaxis: range(start, stop, step)

Parámetros:
1. start (opcional): el número donde comienza la secuencia (por defecto es 0).
2. stop (obligatorio): el número donde termina la secuencia (no se incluye en el resultado).
3. step (opcional): el incremento o salto entre cada número (por defecto es 1).

Ventajas de range()
1. Eficiencia: genera los números bajo demanda, ahorrando memoria.
2. Versatilidad: soporta incrementos positivos y negativos, y puede combinarse con otras funciones como list(), sum(), etc.
'''

# Mostrar los numeros dentro de un rango indicado, usando la funcion range()
for i in range(10):
    print(i)

# Mostrar los números del 1 al 10 con un paso de 2
for i in range(1, 11, 2):
    print(i)

# Mostrar una tabla de multiplicar
for i in range(1, 4):
    for j in range(1, 4):
        print(f"{i} x {j} = {i * j}")

# Valores negativos en range()
for i in range(10, 0, -2): # Comienza en 10. Termina antes de llegar a 0. Decrementa en 2.
    print(i)

# Convertir range() en una lista
numeros = list(range(1, 6))
print(numeros)

# Combinación de range() con otras funciones
# Sumar números generados por range()
print(sum(range(1, 11))) # Suma del 1 al 10

# Verificar si un número pertenece a un rango
print(5 in range(1, 10)) # Verifica si 5 está en el rango

# Invertir un rango con reversed()
for i in reversed(range(5)):
    print(i) # Muestra 4, 3, 2, 1, 0

# Mostrar los elementos del ciclo for usando una lista
for i in ["Rojo", 7, 25.2, True]:
    print(i)

# Mostrar los elementos de una coleccion en una variable
datos = ["Rojo", 2.7, 80, True]

for i in datos:
    print(i)

# Recorrer el contenido de un diccionario mostrando solo la clave
diccionario = {"Juan": 59}

for elementos in diccionario:
    print(f"El resultado es: {elementos}")

# Recorrer el contenido de un diccionario mostrando solo el valor
diccionario = {"Juan": 59, "Luis": 38, "Manuel": 25}

for elementos in diccionario:
    print(f"El resultado es: {diccionario[elementos]}")

# Recorrer el contenido de un diccionario mostrando el valor y la clave
diccionario = {"Juan": 59, "Luis": 38, "Manuel": 25}

for elementos in diccionario:
    print(f"{elementos} -> {diccionario[elementos]}")

# Recorrer el contenido de un diccionario mostrando la clave y el valor usando el metodo items
diccionario = {"Jose": 59, "Luis": 38, "Manuel": 25}

for clave, valor in diccionario.items():
    print(f"{clave} -> {valor}")

# Recorrer el contenido de una cadena de caracteres (muestra los carácteres en vertical)
cadenaCaracteres = "INFOTEP"

for i in cadenaCaracteres:
    print(f"{i}")

# Recorrer el contenido de una cadena de caracteres (al usar end="" muestra los carácteres en horizontal)
cadenaCaracteres = "INFOTEP"

for i in cadenaCaracteres:
    print(f"{i}",end="")

# Mostrar los elementos de un conjunto
conjunto = {1, 2, 3}

for elemento in conjunto:
    print(elemento)

# Mostrar los elementos de una tupla
tupla = (1, 2, 3)
for elemento in tupla:
    print(elemento)
```
