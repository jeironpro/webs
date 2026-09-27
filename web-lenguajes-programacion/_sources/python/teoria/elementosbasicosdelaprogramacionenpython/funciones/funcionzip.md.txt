# Funcionzip

**Función zip()**
La función zip() se utiliza para combinar dos o más iterables (como listas, tuplas o cadenas) en un único iterable, donde cada elemento del iterable resultante es una tupla que contiene los elementos correspondientes de los iterables originales. Es útil cuando necesitas combinar datos relacionados, como nombres y edades, en pares.

La funcion zip() combina los elementos de los diferentes iterables que se le pasen y nos devuelven un objeto iterador que ira generando tuplas con los elementos correspondientes a cada uno de los iterables por el indice que ocupa, o sea, va a combinar o agrupar los diferentes elementos de cada uno de los iterables
que le pasemos en una tupla.

**Sintaxis**
zip(iterable1, iterable2, ...)

- iterable1, iterable2, ...: son los iterables que se van a combinar. Pueden ser listas, tuplas, cadenas, etc.

El resultado de zip() es un iterador, por lo que si desea obtener los resultado como una lista o tupla, debes convertirlo utilizando list() o tuple().

**Desempaquetado de tuplas con zip()**
Puedes desempaquetar los elementos de un iterable combinado usando la función zip() y la sintaxis de desempaquetado.

**Transposición con zip()**
Si aplicamos zip() a una lista de tuplas, podemos obtener una "transposición" de esas tuplas. Esto puede ser útil cuando quieres invertir las filas y las columnas de una tabla representada por tuplas.

**Ventajas de usar zip()**
- Combinación eficiente de múltiples iterables en una sola estructura.

- Simplicidad: no es necesario escribir bucles complicados para combinar datos.

- Flexibilidad: puedes usarlo con cualquier tipo de iterable y también en casos de transposición.

**Limitaciones de zip()**
- Los elementos adicionales se pierden cuando los iterables tienen longitudes diferentes.

- Iterador: al igual que otras funciones de combinación, zip() devuelve un iterador, por lo que debe ser convertido en una lista o tupla si se necesita.

```python
# Ejemplo básico de zip()
# Supongamos que tenemos dos listas, una con nombres y otra con edad, y queremos combinarlas en pares
nombres = ["Jeiron", "Junior", "Espinal"]
edades = [21, 22, 23]

resultado = zip(nombres, edades)

print(list(resultado)) # Salida: [('Jeiron', 21), ('Junior', 22), ('Espinal', 23)]
# En este caso, zip() combina cada elemento de la lista nombres con el elemento correspondiente de la lista edades en tuplas

# Uso de zip() con mas de dos iterables
# Puedes combinar más de dos iterables
nombres = ["Jeiron", "Junior", "Espinal"]
edades = [21, 22, 23]
ciudades = ["Santiago", "La vega", "Moca"]

resultado = zip(nombres, edades, ciudades)

print(list(resultado)) # Salida: [('Jeiron', 21, 'Santiago'), ('Junior', 22, 'La vega'), ('Espinal', 23, 'Moca')]

# Longitud de los iterables
# Si los iterables no tienen la misma longitud, zip() detendrá la combinación al llegar al final del iterable más corto
# Los elementos adicionales de los iterables más largos se omitirán
nombres = ["Jeiron", "Junior", "Espinal"]
edades = [21, 22]

resultado = zip(nombres, edades)

print(list(resultado)) # Salida: [('Jeiron', 21), ('Junior', 22)]
# En este caso, el elemento "Espinal" de nombres no aparece en el resultado porque no tiene un elemento correspondiente en la lista edades

# Desempaquetado de tuplas con zip()
nombres = ["Jeiron", "Junior", "Espinal"]
edades = [21, 22, 23]

resultado = zip(nombres, edades)

for nombre, edad in resultado:
    print(f"Nombre: {nombre}, Edad: {edad}")
# Salida:
# Nombre: Jerion, Edad: 21
# Nombre: Junior, Edad: 22
# Nombre: Espinal, Edad: 23

# Transposición con zip()
tuplas = [(1, 2, 3), (4, 5, 6), (7, 8, 9)]

resultado = zip(*tuplas)

print(list(resultado)) # Salida: [(1, 4, 7), (2, 5, 8), (3, 6, 9)]
# Aquí usamos el operador * para desempaquetar la lista de tiplas y luego transponer las columnas en filas.

# Si en una tupla tenemos más elementos que en otra, estos se ignoran
alumnos = ["Jan", "Emmanuel", "Dorian", "Frailin", "Jeiron", "Jho"]  # los valores que sobren los ignora (en cualquier variable)

edades = [25, 19, 23, 25, 18, 22, 30]

notas = [80, 90, 75, 100, 40, 60]

datos_alumnos = zip(alumnos, edades, notas)

# for dato in datos_alumnos:
#    print(dato)

# Desempaquetar las tuplas
for alum, eda, n in datos_alumnos:
    print("{} de {} años ha obtenido una nota de {}".format(alum, eda, n))

# Convertir todas las tuplas en una lista
datos_alumnos = list(zip(alumnos, edades, notas))
print(datos_alumnos)

# Convertir todas las tuplas en un diccionario, pero solo podemos usar dos iterables
datos_alumnos = dict(zip(alumnos, notas))
print(datos_alumnos)

# La función Zip acepta cualquier tipo de iterable (cadena de caracteres, lista, range())
minusc = "abcde"
mayus = ["A", "B", "C", "D", "E"]
numero = range(1, 10)

grupos = zip(minusc, mayus, numero)

for g in grupos:
    print(g)

# Convertir grupos a lista
lista_grupos = list(grupos)
print(lista_grupos)  # Aparece una lista vacía, porque ya el grupo está vacío.

'''
Crear un diccionario cuyas claves sean los nombres de los alumnos y cuyos valores sean las notas medias 
de las tres notas parciales.
'''

nombres = ["Jan", "Emmanuel", "Dorian", "Frailin", "Jeiron", "Jho"]
cuatrimestre1 = [50, 70, 30, 50, 40]
cuatrimestre2 = [70, 90, 50, 60, 30]
cuatrimestre3 = [60, 80, 40, 70, 20]

# Ejemplo 1
notas = {}

for n, c1, c2, c3 in zip(nombres, cuatrimestre1, cuatrimestre2, cuatrimestre3):
    notas[n] = (c1 + c2 + c3) / 3
for nb, nt in notas.items():
    print("{:8}: {:2.1f}".format(nb, nt))  # El 8 es la cantidad de espacios antes de los dos puntos. El 2 es la cantidad de espacios y el .1f es la cantidad de decimales.

# Ejemplo 2
nombres = ["Jan", "Emmanuel", "Dorian", "Frailin", "Jeiron", "Jho"]
cuatrimestre1 = [50, 70, 30, 50, 40]
cuatrimestre2 = [70, 90, 50, 60, 30]
cuatrimestre3 = [60, 80, 40, 70, 20]

medias = [(c1 + c2 + c3) / 3 for (c1, c2, c3) in zip(cuatrimestre1, cuatrimestre2, cuatrimestre3)]
notas = dict(zip(nombres, medias))

for nb, nt in notas.items():
    print("{:8}: {:2.1f}".format(nb, nt))
```
