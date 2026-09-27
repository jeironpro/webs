# funcionlambda

**Función lambda()**
La función lambda en Python es una forma de crear funciones pequeñas y anónimas en una sola línea. A menudo se utiliza cuando se necesita una función para una tarea específica y no es necesario definirla con un nombre.

Lambda es una función anónima y se utiliza en Python al momento de programar para abreviar la sintaxis y así ahorrar tiempo. O sea, nos permite resumir una función normal de Python en una función lambda.

def se utiliza para crear objetos, los cuales son definidos por cada usuario. Son sentencias para ejecutar con el nombre de la función y tienen referencias al nombre o espacio de nombres local o global.

**Sintaxis**
lambda argumentos: expresion

- argumentos: son los parámetros que recibe la función, al igual que en una función tradicional.

- expresion: es el código que ejecuta la función y devuelve el valor. La diferencia es que no se usa return en las funciones lambda, ya que la expresión se evalúa y se devuelve automáticamente.

**Uso de lambda con filter()**
La función lambda se usa a menudo con funciones de orden superior como filter().

**Uso de lambda con map()**
De manera similar, lambda también se usa con la función map(). Esto es útil para aplicar una operación a cada elemento de una lista.

**Uso de lambda con sorted()**
lambda también es útil cuando se necesita ordenar una lista de objetos según un criterio específico.

**Ventajas de usar lambda**
- Compacto y conciso: permite escribir funciones simples sin la necesidad de definir una funcion completa con def.

- Ideal para funciones de orden superior: es comúnmente usada en funciones como map(), filter(), sorted(), entre otras, donde se necesita pasar una pequeña función.

**Limitaciones de lambda**
- No es adecuada para funciones complejas: las funciones lambda están diseñadas para operaciones simples. Si la lógica es más compleja, es mejor usar una función tradicional con def.

- Difícil de depurar: al no tener nombre y esta encapsuladas en una sola línea, las funciones lambda pueden ser difíciles de depurar.

```python
# Ejemplo básico de lambda
# Función lambda que suma dos números
suma = lambda x, y: x + y

print(suma(5, 3)) # Salida: 8

# Ejemplo de uso de lambda con filter()
# Filtrar una lista de números para obtener solo los números impares
numeros = [1, 2, 3, 4, 5, 6]
resultado = filter(lambda x: x % 2 != 0, numeros)

print(list(resultado)) # Salida: [1, 3, 5]

# Ejemplo de uso de lambda con map()
# Elevar al cuadrado cada número en una lista
numeros = [1, 2, 3, 4]
resultado = map(lambda x: x ** 2, numeros)

print(list(resultado)) # Salida: [1, 4, 9, 16]

# Ejemplo de uso de lambda con sorted()
# Ordenar una lista de diccionarios por la clave "edad"
personas = [
    {"nombre": "Jeiron", "edad": 21},
    {"nombre": "Junior", "edad": 22},
    {"nombre": "Espinal", "edad": 23}
]

personas_ordenadas = sorted(personas, key=lambda persona: persona["edad"])

print(personas_ordenadas) # Salida: [{'nombre': 'Jeiron', 'edad': 21}, {'nombre': 'Junior', 'edad': 22}, {'nombre': 'Espinal', 'edad': 23}]

# Ejemplo de lambda más complejo
# Aunque las funciones lambda se suelen utilizar para operaciones sencillas, pueden tener más de un parámetro y realizar operaciones relativamente complejas.
area_rectangulo = lambda largo, ancho: largo * ancho

print(area_rectangulo(5, 3)) # Salida: 15

# Función normal
def areaTriangulo(base,altura):
    return(base * altura)/2

triangulo1 = areaTriangulo(5,7)
print(triangulo1)

triangulo2 = areaTriangulo(9,6)
print(triangulo2)

# Función lambda: Ejemplo 1
areaTriangulo = lambda base,altura:(base * altura)/2

print(areaTriangulo(5,7))
print(areaTriangulo(9,6))

# Función lambda: Ejemplo 2
cubo = lambda numero:pow(numero, 3) # Con la función pow()
cubo = lambda numero:numero**3 # Sin función

print(cubo(5))

# Función lambda: Ejemplo 3
mostrarComision = lambda comision:"¡RD${}!".format(comision)

comision_jeiron = 5800

print(mostrarComision(comision_jeiron))
```
