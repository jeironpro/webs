# Funcionmap

**Función map()**
La función map() es una función de orden superior que aplica una función a cada elemento de un iterable (como una lista, tupla, etc.) y devuelve un iterable (un map object) con los resultados. Esta función es útil cuando necesitas realizar una operación a todos los elementos de una colección sin usar un bucle explícito.

La funcion map() aplica una funcion a cada elemento de una lista iterable (listas, tuplas, etc) devolviendo una lista con los resultados. Permite utilizar una funcion en lugar de una condicion.

**Sintaxis**
map(func, iterable)

- func: es la función que se aplica a cada elemento del iterable. Puede usar una función definida por el usuario, una función estándar o incluso una función lambda.

- iterable: es la colección de elementos (como una lista, tupla o conjunto) sobre la que se aplicará la función.

El resultado de map() es un iterador, por lo que si deseas obtener los resultados como una lista o tupla, debes convertirlo utilizando list() o tuple().

**Uso de map() con varios iterables**
Si pasas más de un iterable a map(), la función se aplicará a los elementos correspondientes de cada iterable. Si los iterables tienen longitudes diferentes, map() detendrá el proceso cuando se agote el iterable más corto.

**Filtrar y transformar con map()**
Puedes usar map() no solo para transformar elementos, sino también para realizar múltiples operaciones.

**Ventajas de usar map()**
- Simplicidad: permite aplicar una función a todos los elementos de una colección de manera eficiente y sin escribir bucles explícitos.

- Optimización: al usar map(), puedes mejorar la legibilidad y posiblemente la eficiencia del código, especialmente cuando se utiliza con funciones integradas como lambda.

**Limitaciones de map()**
- Iterador: el resultado de map() es un iterador, por lo que necesitas convertirlo explícitamente a una lista, tupla u otro tipo de secuencia para visualizar los resultados.

- No retorna valores intermedios: si necesitas realizar transformaciones más complejas, puede que el uso de un bucle explícito o compresión de listas sea más adecuado.

```python
# Ejemplo básico de map()
# Supongamos que queremos multiplicar cada número de una lista por 2
# Usamos map() para aplicar una función a cada elemento de la lista
def multiplicar_por_dos(num):
    return num * 2

numeros = [1, 2, 3, 4]
resultado = map(multiplicar_por_dos, numeros)

print(list(resultado)) # Salida: [2, 4, 6, 8]

# Ejemplo de uso de map() com lambda()
# Usamos map() junto con una función lambda() para hacer el código más compacto
numeros = [1, 2, 3, 4]
resultado = map(lambda num: num * 2, numeros)

print(list(resultado)) # Salida: [2, 4, 6, 8]

# Ejemplo de map() con dos iterables
numeros = [1, 2, 3]
otros_numeros = [4, 5, 6]

resultado = map(lambda x, y: x + y, numeros, otros_numeros)

print(list(resultado)) # Salida: 5, 7, 9

# Sumar dos listas y luego multiplicar los resultados por 2
numeros1 = [1, 2, 3]
numeros2 = [4, 5, 6]

resultado = map(lambda x, y: (x + y) * 2, numeros1, numeros2)

print(list(resultado)) # Salida: [10, 14, 18]

# Ejemplo con una lista de cadenas
# Podemos usar map() para convertir todas las cadenas de una lista a mayúsculas.
frutas = ["manzana", "platano", "cereza"]
resultado = map(lambda fruta: fruta.upper(), frutas)

print(list(resultado)) # Salida: ['MANZANA', 'PLATANO', 'CEREZA']

class Empleado:
    def __init__(self, nombre, cargo, salario):
        self.nombre = nombre
        self.cargo = cargo
        self.salario = salario

    def __str__(self):
        return "{} trabaja como {}, y tiene un salario de RD${} pesos.".format(self.nombre, self.cargo, self.salario)

listaEmpleados = [
    Empleado("Kimberly","Administradora",225000),
    Empleado("Jeiron","Gerente",180000),
    Empleado("Daniel","Supervisor",100000),
    Empleado("Gabriel","Encargado",65000),
    Empleado("Emmanuel","Mantenimiento",50000)
]

# Crear una funcion para calcular la comision a los empleados con salarios bajos.
def calculo_comision(empleado):
    if (empleado.salario <= 50000):
        empleado.salario = empleado.salario * 1.03
    return empleado

# Aplicar la función de comisión a los empleados
listaEmpleadosComision = map(calculo_comision, listaEmpleados)

# Imprimir la información de los empleados con la comisión calculada
for empleado in listaEmpleadosComision:
    print(empleado)
```
