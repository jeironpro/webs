# Listas

**Colecciones (Listas)**
Las colecciones en Python son estructuras de datos que permiten agrupar múltiples objetos o valores de diferentes tipos bajo un mismo nombre. En Python, existen cuatro colecciones básicas, que son:

**1- Listas**
2- Tuplas
3- Diccionarios
4- Conjuntos

**Las listas**
Las listas son estructuras de datos que nos permiten almacenar una gran cantidad de valores identificados por índices (equivalentes a los arrays en otros lenguajes de programación).

Una lista es una colección ordenada y mutable de elementos, lo que significa que los elementos tienen un orden específico. Puedes modificar, agregar o eliminar elementos después de que la lista ha sido creada.

**Características principales**
- En Python, las listas pueden guardar diferentes tipos de datos (en otros lenguajes esto no es posible con los arrays).
- Se pueden expandir dinámicamente añadiendo nuevos elementos (otra diferencia con los arrays en otros lenguajes).
- Las listas se representan con corchetes [].

Sintaxis: nombreLista = [elemento1, elemento2, elemento3, ...]

**Métodos útiles de listas**
Método         Descripción
append(x)      Añade un elemento al final de la lista.
insert(i, x)   Inserta un elemento en el índice i.
remove(x)      Elimina la primera aparición de x.
pop(i)         Elimina y retorna el elemento en el índice i.
sort()         Ordena los elementos de la lista.
reverse()      Invierte el orden de los elementos.
clear()        Elimina todos los elementos de la lista.

```python
# Crear una lista vacía
miLista = []
print(miLista)

# Lista con números
numeros = [1, 2, 3, 4, 5]
print(numeros)
print(len(numeros))  # Muestra la longitud de la lista, que será el número de elementos (5)

# Lista con cadenas
nombres = ["Juan", "Ana", "Luis"]
print(nombres)

# Lista mixta (int, str, float, booleano)
mixta = [1, "Hola", 3.14, True]
print(mixta)

# Mostrar toda la lista con [:]
miLista = ["Learny", "Juan", "Pedro", "Maria"]
print(miLista[:])

# Intentar acceder a un índice inexistente genera un error (índice fuera de rango)
# print(miLista[4])  # Descomentar para probar la excepción

# Acceder a un elemento desde el final de la lista con índices negativos
miLista = ["Learny", "Juan", "Pedro", "Maria"]
print(miLista[-1])  # Último elemento

# Seleccionar una porción de una lista (sublista)
miLista = ["Learny", "Juan", "Pedro", "Maria"]
print(miLista[1:3])  # [1:3]: Desde el índice 1 hasta el 3 (sin incluir el 3)
print(miLista[:3])   # Desde el inicio hasta el índice 3 (sin incluir el 3)
print(miLista[2:])   # Desde el índice 2 hasta el final

# Agregar elementos al final de una lista con append()
miLista = ["Learny", "Juan", "Pedro", "Maria"]
miLista.append("Raul")  # append: método para agregar un elemento
print(miLista[:])

# Agregar elementos en cualquier posición con insert()
miLista = ["Learny", "Juan", "Pedro", "Maria"]
miLista.insert(0, "Raul")  # insert: método para insertar un elemento
print(miLista[:])

# Agregar varios elementos a una lista con extend()
miLista = ["Learny", "Juan", "Pedro", "Maria"]
miLista.extend(["Manuel", "Raul", "Jose", "Abel"])  # extend: método para extender la lista
print(miLista[:])

# Conocer el índice de un elemento con index()
miLista = ["Learny", "Juan", "Pedro", "Maria"]
miLista.extend(["Manuel", "Raul", "Jose", "Abel"])
print(miLista.index("Manuel"))  # index: busca el índice del elemento

# Eliminar un elemento por su valor con remove()
nombres = ["Juan", "Ana", "Luis", "Marcos"]
nombres.remove("Ana")  # Elimina "Ana" por su valor
print(nombres)

# Eliminar un elemento por su índice con pop()
nombres = ["Juan", "Ana", "Luis", "Marcos"]
nombres.pop(2)  # Elimina "Luis" (índice 2)
print(nombres)

# El método pop() sin índice elimina el último elemento
nombres = ["Juan", "Ana", "Luis", "Marcos"]
nombres.pop()  # Elimina el último elemento ("Marcos")
print(nombres)

# Unir dos listas
lista1 = [1, 2, 3]
lista2 = [4, 5, 6]
lista3 = lista1 + lista2
print(lista3)
# También se puede realizar directamente en el print()
# print(lista1 + lista2)

# Iterar sobre una lista
numeros = [1, 2, 3, 4, 5]
for numero in numeros:
    print(numero)

'''
Las pilas (stacks)
En Python, las pilas (stacks) no existen como una estructura de datos predefinida, pero se pueden simular utilizando listas y los métodos .append() y .pop() para gestionar la entrada y salida de datos. Las pilas siguen el principio de LIFO (Last In, First Out), que significa:

· Último en entrar, primero en salir
'''

# Agregar un elemento al final de la pila
pila = [1, 2, 3]
pila.append(4)  # append: agrega un elemento al final
print(pila)  # Muestra la pila actualizada: [1, 2, 3, 4]

# Extraer elementos del final de la pila (simulación de LIFO)
pila = [1, 2, 3, 4]
pila.pop()  # Elimina el último elemento (4)
pila.pop()  # Elimina el nuevo último elemento (3)
pila.pop()  # Elimina el siguiente último elemento (2)
print(pila)  # Muestra los elementos restantes en la pila: [1]

# Extraer un elemento del final de la pila y almacenarlo en una variable
pila = [1, 2, 3, 4]
elemento = pila.pop()  # Extrae el último elemento (4) y lo almacena en una variable
print(f"Sacando el elemento {elemento}")  # Muestra el elemento extraído
print(pila)  # Muestra los elementos restantes en la pila: [1, 2, 3]

'''
Las colas (queues)
En Python, las colas (queues) no existen como una estructura de datos predefinida, pero se pueden simular utilizando listas y los métodos .append() y .pop(0) para gestionar la entrada y salida de datos.

Las colas siguen el principio de FIFO (First In, First Out), que significa:

· Primero en entrar, primero en salir
'''

# Mostrar el contenido de una cola
cola = ["Juan", "Raul", "Manuel", "Abel"]
print(cola)  # Muestra la cola inicial: ["Juan", "Raul", "Manuel", "Abel"]

# Agregar elementos al final de la cola
cola = ["Juan", "Raul", "Manuel", "Abel"]
cola.append("Maria")   # Agrega "Maria" al final de la cola
cola.append("Raquel")  # Agrega "Raquel" al final de la cola
print(cola)  # Muestra la cola actualizada: ["Juan", "Raul", "Manuel", "Abel", "Maria", "Raquel"]

# Sacar elementos de la cola (FIFO) usando pop(0)
cola = ["Juan", "Raul", "Manuel", "Abel", "Maria", "Raquel"]
cola.pop(0)  # Elimina "Juan" (índice 0)
cola.pop(0)  # Elimina "Raul", que ahora es el índice 0 después de la primera eliminación
print(cola)  # Muestra la cola actualizada: ["Manuel", "Abel", "Maria", "Raquel"]

# Sacar elementos de una cola y almacenarlos en una variable
cola = ["Juan", "Raul", "Manuel", "Abel", "Maria", "Raquel"]

elemento = cola.pop(0)  # Almacena "Juan"
print(f"Atendiendo a {elemento}")

elemento = cola.pop(0)  # Almacena "Raul"
print(f"Atendiendo a {elemento}")

elemento = cola.pop(0)  # Almacena "Manuel"
print(f"Atendiendo a {elemento}")

print(cola)  # Muestra la cola restante: ["Abel", "Maria", "Raquel"]
```
