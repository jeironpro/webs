# funcionfilter

**Función filter()**
La función filter() en Python se utiliza para filtrar elementos de una secuencia (como una lista, tupla o conjunto) según una condición que se define en una función. La función devuelve un iterador que contiene solo los elementos que cumplen con la condición especificada.

La función filter verifica que los elementos de una secuencia cumplan una condición, devolviendo un iterador con los elementos que cumplen dicha condición.

**Sintaxis**
filter(func, iterable)

- func: es una función que devuelve un valor booleano (True o False). Se aplica a cada elemento del iterable.

- iterable: es la secuencia que se va a filtrar (como una lista, tupla, etc.).

La función filter() devuelve un iterador que contiene solo los elementos para los cuales la función func devuelve True.

**Uso de lambda con filter()**
Es común usar lambda en lugar de definir una función por separado, ya que hace el código más compacto.

**Filtrar elementos en listas de cadenas**
Podemos usar filter() para trabajar con cadenas. Por ejemplo, si queremos filtrar las palabras que tienen más de 4 letras.

**Filtrar elementos de listas de diccionarios**
También podemos filtrar colecciones más complejas, como una lista de diccionarios. Por ejemplo, supongamos que tenemos una lista de personas y queremos filtrar solo aquellas que tienen más de 30 años.

**Importante**
- filter() devuelve un iterador, por lo que si deseas obtener los resultados como una lista o tupla, debes convertir el resultado usando list() o tuple().

- Si no se encuentran elementos que cumplan la condición, filter() devuelve un iterador vacío.

**Beneficios de usar filter()**
- Filtra eficientemente elementos de colecciones.

- Facilita el código al eliminar la necesidad de bucles explícitos.

- Funciona muy bien cuando se usa junto con funciones como lambda.

```python
# Ejemplo básico de filter()
# Supongamos que tenemos una lista de números y queremos filtrar solo aquellos números que sean mayores que 5.
def es_mayor_que_5(num):
    return num > 5

numeros = [1, 4, 6, 8, 3, 9]
resultado = filter(es_mayor_que_5, numeros)

# Convertir el resultado a una lista para imprimirlo
print(list(resultado)) # Salida: [6, 8, 9]

# Ejemplo de lambda con filter()
numeros = [1, 4, 6, 8, 3, 9]
resultado = filter(lambda num: num > 5, numeros)

print(list(resultado)) # Salida: [6, 8, 9]

# Filtrar elementos en listas de cadenas
palabras = ["hola", "mundo", "Python", "es", "genial"]
resultado = filter(lambda palabra: len(palabra) > 4, palabras)

print(list(resultado)) # Salida: ['mundo', 'Python', 'genial']

# Filtrar elementos de listas de diccionarios
personas = [
    {"nombre": "Jeiron", "edad": 21},
    {"nombre": "Junior", "edad": 22},
    {"nombre": "Espinal", "edad": 23},
    {"nombre": "Cruz", "edad": 24},
]

resultado = filter(lambda persona: persona["edad"] > 22, personas)

print(list(resultado)) # Salida: [{'nombre': 'Espinal', 'edad': 23}, {'nombre': 'Cruz', 'edad': 24}]

# Devolver un número par de una lista
def numeroPar(num):
    if num % 2 == 0:
        return True

numeros = [8, 25, 30, 5, 7, 85, 69]

# La función filter lleva dos parámetros: la función que deseamos llamar para verificar si el número es par y luego la lista.
print(list(filter(numeroPar, numeros)))  # Devuelve un objeto, por eso debemos convertirlo en una lista
# Agregar 'list' antes de filter muestra el resultado como una lista.

# Devolver un número par usando una función lambda
numeros = [8, 25, 30, 5, 7, 85, 69]

# Usando lambda para verificar si el número es par
print(list(filter(lambda numero: numero % 2 == 0, numeros)))

# Ejemplo con una clase Empleado y filter
class Empleado:
    def __init__(self, nombre, cargo, salario):
        self.nombre = nombre
        self.cargo = cargo
        self.salario = salario

    def __str__(self):
        return "{} trabaja como {}, y tiene un salario de RD${} pesos.".format(self.nombre, self.cargo, self.salario)

listaEmpleados = [
    Empleado("Kimberly", "Administradora", 225000),
    Empleado("Jeiron", "Gerente", 180000),
    Empleado("Daniel", "Supervisor", 100000),
    Empleado("Gabriel", "Encargado", 65000),
    Empleado("Emmanuel", "Mantenimiento", 50000)
]

# Filtrar empleados con salario mayor o igual a 100000
salarios = filter(lambda empleado: empleado.salario >= 100000, listaEmpleados)

for empleadoSalario in salarios:
    print(empleadoSalario)
```
