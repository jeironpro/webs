# Diccionarios

**Colecciones (Diccionarios)**
Las colecciones en Python son estructuras de datos que permiten agrupar múltiples objetos o valores de diferentes tipos bajo un mismo nombre. En Python, existen cuatro colecciones básicas, que son:

**1- Listas**
2- Tuplas
3- Diccionarios
4- Conjuntos

**Los diccionarios**
Los diccionarios se colocan dentro de llaves {}, son colecciones desordenadas y contienen dos elementos por posición: clave y valor. Además, no pueden existir claves duplicadas y aceptan tipos de datos diferentes para las claves y los valores.

Un diccionario es una colección desordenada, mutable e indexada por claves, en lugar de índices numéricos como las listas o tuplas.

**Características principales**
1. Está compuesto por pares clave-valor.
2. Las claves son únicas y no pueden cambiar (deben ser inmutables, como cadenas, números o tuplas inmutables).
3. Los valores pueden ser de cualquier tipo, incluyendo listas, otros diccionarios o tipos personalizados.

**Métodos útiles para diccionarios**
Método             Descripción
keys()             Devuelve una vista con todas las claves.
values()           Devuelve una vista con todos los valores.
items()            Devuelve una vista con los pares clave-valor.
update(otro_dic)   Actualiza el diccionario con las claves y valores de otro diccionario.
clear()            Elimina todos los elementos del diccionario.

**Diferencia clave entre listas y diccionarios**
Aspecto      Lista                        Diccionario
Acceso       Basado en índice numérico.   Basado en clave personalizada.
Ordenado     Sí (desde Python 3.7+).      Sí (desde Python 3.7+).
Mutable      Sí                           Sí (pero las claves son inmutables).
Uso típico   Secuencia de elementos.      Colección de datos asociados.

```python
# Creación de un diccionario vacío
diccionario = {}
print(diccionario)

# Agregar y mostrar los valores de un diccionario
estudiante = {
    "Nombre": "Jan",
    "Edad": 19,
    "Tecnico": "Diseño"
}
print(estudiante)
# claves = "Nombre", "Edad", "Tecnico"
# valores = "Jan", 19, "Diseño"

# Mostrar un valor específico de un diccionario
estudiante = {
    "Nombre": "Jan",
    "Edad": 19,
    "Tecnico": "Diseño"
}
print(estudiante["Nombre"]) # Muestra el valor de la clave "Nombre"

# Mostrar un valor específico de un diccionario utilizando el método get()
estudiante = {
    "Nombre": "Jan",
    "Edad": 19,
    "Tecnico": "Diseño"
}
print(estudiante.get("Edad")) # Muestra el valor de la clave "Edad"

# Diferencia: .get() devuelve None si la clave no existe, mientras que los corchetes generan un error.
estudiante = {
    "Nombre": "Jan",
    "Edad": 19,
    "Tecnico": "Diseño"
}
print(estudiante.get("Pais")) # La clave "Pais" no existe
# print(estudiante["Pais"]) # Generará un KeyError

# Modificar un elemento de un diccionario
estudiante = {
    "Nombre": "Jan",
    "Edad": 19,
    "Tecnico": "Diseño"
}
estudiante["Edad"] = 21 # Modificar la clave "Edad"
estudiante["Pais"] = "España" # Agregar una nueva clave y su valor, ya que no existe
print(estudiante)

# Mostrar los valores específicos de un diccionario con múltiples datos
estudiante = {
    "Nombre": "Jan",
    "Edad": 19,
    "Tecnico": ["Linux", "Python", "Git y GitHub"]
}
print(estudiante["Tecnico"][2]) 

# Mostrar los valores específicos de un diccionario con múltiples datos usando el constructor dict()
# Con el constructor (dict) las claves no llevan comillas y los dos puntos se cambian por igual (=)
estudiante = dict(
    Nombre = "Jan",
    Edad = 19,
    Tecnico = ["Linux", "Python", "Git y GitHub"])
print(type(estudiante))
print(estudiante)

# Agregar un elemento (clave-valor) a un diccionario
estudiante = {
    "Nombre": "Diego",
    "Edad": 28,
    "Tecnico": ["Linux", "Python", "Git y GitHub"]
}
estudiante["Tanda"] = "Tarde"
print(estudiante)

# Modificar el valor de una clave en un diccionario que contiene otra colección
estudiante = {
    "Nombre":"Diego",
    "Edad":28,
    "Tecnico":["Linux", "Python", "Git y GitHub"]
}
estudiante["Tecnico"] = "HTML, CSS, JAVASCRIPT"
print(estudiante)

# Eliminar una clave específica de un diccionario usando el método del()
estudiante = {
    "Nombre": "Diego",
    "Edad": 28,
    "Tecnico": ["Linux", "Python", "Git y GitHub"],
    "Tanda": "Tarde"
}
del(estudiante["Tanda"])
print(estudiante)

# Eliminar una clave específica de un diccionario usando el método pop() y almacenar el valor en una variable
estudiante = {
    "Nombre": "Diego",
    "Edad": 28,
    "Tecnico": ["Linux", "Python", "Git y GitHub"],
    "Tanda": "Tarde"
}
edad = estudiante.pop("Edad")
print(edad)
print(estudiante)

# Eliminar una clave específica de un diccionario usando el método popitem()
estudiante = {
    "Nombre": "Diego",
    "Edad": 28,
    "Tecnico": ["Linux", "Python", "Git y GitHub"],
    "Tanda": "Tarde"
}
print(estudiante.popitem()) # Elimina el último par clave-valor del diccionario

# Operaciones básicas
# Longitud del diccionario
estudiante = {
    "Nombre": "Diego",
    "Edad": 28,
    "Tecnico": ["Linux", "Python", "Git y GitHub"],
    "Tanda": "Tarde"
}
print(len(estudiante)) # Mostrar la longitud del diccionario (cantidad de claves)

# Comprobar si una clave existe
estudiante = {
    "Nombre": "Diego",
    "Edad": 28,
    "Tecnico": ["Linux", "Python", "Git y GitHub"],
    "Tanda": "Tarde"
}

if "Nombre" in estudiante:
    print("La clave 'Nombre' está en el diccionario.")

# Iterar sobre claves y valores
estudiante = {
    "Nombre": "Diego",
    "Edad": 28,
    "Tecnico": ["Linux", "Python", "Git y GitHub"],
    "Tanda": "Tarde"
}
# Solo claves
for clave in estudiante:
    print(clave)

# Claves y valores
for clave, valor in estudiante.items():
    print(clave, ":", valor)

# Agregar elementos con diferentes tipos de datos en un diccionario (con listas)
estudiantes = {
    "Jan": [20, 5.6],
    "Kimberly": [20, 5.1],
    "Diego": [23, 5.6]
}
print(estudiantes)

# Agregar elementos con diferentes tipos de datos en un diccionario (con otro diccionario)
estudiantes = {
    "Jan": {"edad": 20, "estatura": 5.6},
    "Kimberly": {"edad": 20, "estatura": 5.1},
    "Diego": {"edad": 23, "estatura": 5.6}
}
print(estudiantes)

# Realizar búsquedas directas en un diccionario utilizando el método in que verifica si una clave existe
estudiantes = {
    254658: "Jeiron",
    254659: "Frederick",
    254660: "Jho",
    254661: "Daniel"
}
print(254657 in estudiantes) # Un resultado falso (False)
print(254661 in estudiantes) # Un resultado verdadero (True)

# Mostrar todas las claves en un diccionario con el método keys()
estudiantes = {
    254658: "Jeiron",
    254659: "Frederick",
    254660: "Jho",
    254661: "Daniel"
}
print(estudiantes.keys())

# Mostrar todos los valores en un diccionario con el método values()
estudiantes = {
    254658: "Jeiron",
    254659: "Frederick",
    254660: "Jho",
    254661: "Daniel"
}
print(estudiantes.values())

# Mostrar todas las claves y los valores en un diccionario con el método items()
estudiantes = {
    254658: "Jeiron",
    254659: "Frederick",
    254660: "Jho",
    254661: "Daniel"
}
print(estudiantes.items())

# Eliminar todos los elementos de un diccionario usando el método clear()
estudiantes = {
    254658: "Jeiron",
    254659: "Frederick",
    254660: "Jho",
    254661: "Daniel"
}
estudiantes.clear()
print(estudiantes)
```
