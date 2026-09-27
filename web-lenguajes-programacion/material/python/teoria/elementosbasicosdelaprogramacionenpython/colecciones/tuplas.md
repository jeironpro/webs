# Tuplas

**Colecciones (Tuplas)**
Las colecciones en Python son estructuras de datos que permiten agrupar múltiples objetos o valores de diferentes tipos bajo un mismo nombre. En Python, existen cuatro colecciones básicas, que son:

**1- Listas**
2- Tuplas
3- Diccionarios
4- Conjuntos

**Las tuplas**
Las tuplas son listas inmutables, es decir, no se pueden modificar después de su creación.

Una tupla es una colección ordenada e inmutable en Python. Esto significa que, a diferencia de las listas:

- No permite añadir, eliminar o mover elementos, entre otras operaciones (como append, extend o remove).
- No permite mostrar el valor de un índice usando el método index(), pero sí permite mostrar el índice de un valor.
- Sí permite extraer porciones, pero el resultado de la extracción es una nueva tupla.
- Sí permite comprobar si un elemento se encuentra en la tupla.

**Características principales**
- Las tuplas se delimitan utilizando paréntesis ().
- Pueden contener elementos de diferentes tipos (int, str, listas u otras tuplas).

**Ventajas con respecto a las listas**
- Son más rápidas.
- Ocupan menos espacio en memoria (mayor optimización).
- Facilitan el formateo de strings.
- Pueden utilizarse como claves en un diccionario (las listas no lo permiten).

Sintaxis: nombreTupla = (elemento1, elemento2, elementos3, ...)

**Métodos útiles para tuplas**
Método     Descripción
count(x)   Retorna cuántas veces aparece el valor x en la tupla.
index(x)   Retorna el índice de la primera aparición del valor x.

**Diferencias clave entre listas y tuplas**
Características   Lista               Tupla
Mutable           Sí                  No
Definida con      Corchetes []        Paréntesis ()
Rendimiento       Más lenta           Más rápida
Uso típico        Datos que cambian   Datos constantes

**Nota**
set() elimina duplicados de una tupla

```python
# Creación de tupla vacía
miTupla = ()
print(miTupla)

# Tupla con un solo elemento (nota la coma)
miTupla = (5,)
print(miTupla)

# Nota: sin la coma (,), Python no considerará una tupla de un solo elemento.
# miTupla = (5) # Esto no es una tupla, es un número

# Mostrar un elemento basado en su índice
miTupla = ("Juan", 3.14, 20, True)
print(miTupla[0])   # Muestra el primer elemento: "Juan"
print(miTupla[-1])  # Muestra el último elemento: True

# Slicing (rebanado)
# Puedes obtener partes de una tupla, igual que con las listas
miTupla = ("Juan", 3.14, 20, True)
print(miTupla[1:3])  # Desde el índice 1 al 3 (sin incluir el 3)
print(miTupla[:3])   # Desde el inicio hasta el índice 3 (sin incluir el 3)
print(miTupla[2:])   # Desde el índice 2 hasta el final

# Operaciones básicas con tuplas
# Concatenación: combinación de tuplas utilizando el operador +
tupla1 = (1, 2, 3)
tupla2 = (4, 5, 6)
tupla3 = tupla1 + tupla2
print(tupla3)  # Muestra la concatenación de tupla1 y tupla2

# Repetición: repetir una tupla usando *
miTupla = (1, 2)
print(miTupla * 3)  # Muestra la tupla repetida 3 veces

# Pertenencia (in y not in): comprobar si un elemento existe dentro de la tupla
miTupla = ("Gabriel", 3.14, 20, True)
print("Gabriel" in miTupla)  # True: "Gabriel" está en la tupla
print(21 not in miTupla)     # True: 21 no está en la tupla

# Inmutabilidad de las tuplas: al ser inmutables, no puedes modificar sus elementos directamente
miTupla = ("Gabriel", 3.14, 20, True)
# miTupla[1] = 4.50  # Esto generará un error: TypeError: 'tuple' object does not support item assignment

# Si la tupla contiene un elemento mutable (como una lista), se puede modificar ese elemento mutable
miTupla = ("Gabriel", [1, 5], 3.14, 20, True)
miTupla[1][0] = 4  # Modificará el primer elemento de la lista dentro de la tupla
print(miTupla)

# Convertir una tupla a una lista con el método list()
miTupla = ("Gabriel", 3.14, 20, True)
miLista = list(miTupla)
print(miLista)

# Convertir una lista a una tupla con el método tuple()
miLista = ["Gabriel", 3.14, 20, True]
miTupla = tuple(miLista)
print(miTupla)

# Comprobar la cantidad de veces que se repite un elemento dentro de la tupla
miTupla = ("Gabriel", 3.14, 20, True, 20)
print(miTupla.count(20))  # Muestra cuántas veces aparece el valor 20

# Mostrar el índice de un elemento de la tupla
miTupla = ("Gabriel", 3.14, 20, True)
print(miTupla.index(20))  # Muestra el índice del elemento 20

# Comprobar la longitud de la tupla
miTupla = ("Gabriel", 3.14, 20, True, 20)
print(len(miTupla))  # Muestra la longitud de la tupla (número de elementos)

# Tupla unitaria: es una tupla con un único elemento, al final se coloca una coma (,)
miTupla = ("Gabriel",)
print(len(miTupla))  # Muestra la longitud de la tupla unitaria (1)

# Desempaquetando una tupla
miTupla = ("learny", 3.14, 20, True)
cadena, flotante, entero, booleano = miTupla
print(cadena, flotante, entero, booleano)  # Muestra los valores desempaquetados
```
