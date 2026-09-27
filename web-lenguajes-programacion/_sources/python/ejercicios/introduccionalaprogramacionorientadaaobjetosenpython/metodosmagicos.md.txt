# Ejercicios — Métodos mágicos

## metodos_magicos_adicionales1

Representación de objetos (__str__ y __repr__)

Crea una clase Persona con los atributos nombre, edad y profesion.

- Implementa el método __str__ para mostrar la información de la persona en un formato amigable.

- Implementa el método __repr__ para devolver una representación técnica del objeto.

**Solución**

```python
class Persona:
    def __init__(self, nombre, edad, profesion):
        self.nombre = nombre
        self.edad = edad
        self.profesion = profesion

    def __str__(self):
        return f"{self.nombre}, {self.edad} años, {self.profesion}"
    
    def __repr__(self):
        return f"Persona(nombre='{self.nombre}', edad={self.edad}, profesion='{self.profesion}')"

persona = Persona("Jeiron", 30, "Ingeniera de Software")

print(str(persona))

print(persona)

print(repr(persona))
```

## metodos_magicos_adicionales2

Operador de suma (__add__)

Crea una clase Vector que tenga dos atributos: x y y.

- Implementa el método __add__ para permitir la suma de dos objetos de tipo Vector.

- La suma de dos vectores debe dar como resultado un nuevo vector con la suma de sus coordenadas.

**Solución**

```python
class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __add__(self, otro_vector):
        if not isinstance(otro_vector, Vector):
            raise TypeError("El operando debe ser una instancia de la clase Vector.")
        return Vector(self.x + otro_vector.x, self.y + otro_vector.y)
    
    def __str__(self):
        return f"Vector({self.x}, {self.y})"
    
vector1 = Vector(3, 4)
vector2 = Vector(1, 2)

sumar_vectores = vector1 + vector2

print(f"Primer vector: {vector1}")
print(f"Segundo vector: {vector2}")
print(f"Suma de los vectores: {sumar_vectores}")
```

## metodos_magicos_adicionales3

Uso de len() con un objeto (__len__)

Crea una clase Libro con los atributos titulo y num_paginas.

- Implementa el método __len__ para que la función len() aplicada a un objeto de tipo Libro devuelva el número de páginas.

**Solución**

```python
class Libro:
    def __init__(self, titulo, num_paginas):
        self.titulo = titulo
        self.num_paginas = num_paginas

    def __len__(self):
        return self.num_paginas
    
    def __str__(self):
        return f"Libro: '{self.titulo}' ({self.num_paginas} páginas)"
    
libro = Libro("El principito", 96)

print(len(libro))

print(libro)
```

## metodos_magicos_adicionales4

Acceso a elementos (__getitem__ y __setitem__)

Crea una clase Estanteria que almacene una lista de libros.

- Implementa el método __getitem__ para acceder a un libro en una posición específica.

- Implementa el método __setitem__ para reemplazar un libro en una posición específica.

**Solución**

```python
class Estanteria:
    def __init__(self):
        self.libros = []

    def agregar_libro(self, libro):
        self.libros.append(libro)

    def __getitem__(self, indice):
        return self.libros[indice]

    def __setitem__(self, indice, nuevo_libro):
        self.libros[indice] = nuevo_libro

    def __str__(self):
        return f"Estantería: {', '.join(self.libros)}"
    
estanteria = Estanteria()

estanteria.agregar_libro("El principito")
estanteria.agregar_libro("1984")
estanteria.agregar_libro("Cien años de soledad")

print(estanteria[1])

estanteria[1] = "Rebelión en la granja"
print(estanteria[1])

print(estanteria)
```

## metodos_magicos_adicionales5

Comparación de objetos (__eq__ y __lt__)

Crea una clase Producto con los atributos nombre y precio.

- Implementa el método __eq__ para comparar dos productos por su nombre.

- Implementa el método __lt__ para comparar dos productos por su precio (menor precio).

**Solución**

```python
class Producto:
    def __init__(self, nombre, precio):
        self.nombre = nombre
        self.precio = precio

    def __eq__(self, otro):
        if isinstance(otro, Producto):
            return self.nombre == otro.nombre
        return False
    
    def __lt__(self, otro):
        if isinstance(otro, Producto):
            return self.precio < otro.precio
        return NotImplemented
    
    def __str__(self):
        return f"{self.nombre} - RD${self.precio:.2f}"
    
producto1 = Producto("Manzana", 15)
producto2 = Producto("Manzana", 20)
producto3 = Producto("Banana", 10)

print(producto1 == producto2)
print(producto1 == producto3)

print(producto3 < producto1)
print(producto1 < producto2) 

print(producto1)
print(producto2)
print(producto3)
```
