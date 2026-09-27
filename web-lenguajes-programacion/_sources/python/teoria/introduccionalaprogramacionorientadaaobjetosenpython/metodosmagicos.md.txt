# Métodos mágicos

**Métodos mágicos**
Los métodos mágicos son métodos especiales en Python que permiten que los objetos interactúen de manera más intuitiva con operadores y funciones del lenguaje. Estos métodos tienen un nombre que comienza y termina con dos guiones bajos (__), de ahí el termino "dunder" (de double underscore).

Los métodos mágicos permiten ampliar las capacidades de las clases que definimos en Python. Inician y terminan con doble guion bajo. Son métodos que están definidos por defecto en cualquier clase, pero los podemos sobrescribir.

**Algunos de los métodos mágicos más comunes son**
1. __init__(self): constructor de la clase. Se ejecuta cuando se crea un nuevo objeto.

- **2.** __str__(self): define el comportamiento de la función str() y la representación en cadena de un objeto.

- **3.** __repr__(self): define la representación en cadena del objeto para el uso interno, generalmente útil para depuración.

- **4.** __len__(self): permite usar la función len() en objetos personalizados.

- **5.** __add__(self, other): permite usar el operador + para sumar objetos de la clase.

- **6.** __eq__(self, other): permite usar el operador == para comparar objetos de la clase.

- **7.** __getitem__(self, key): permite acceder a los elementos de un objeto como si fuera un diccionario o lista.

- **8.** __setitem__(self, key, value): permite asignar valores a los elementos de un objeto.

- **9.** __delitem__(self, key): permite eliminar elementos de un objeto como si fuera un diccionario o lista.

- **10.** __iter__(self): permite hacer que un objeto sea iterable, por ejemplo, con un bucle for.

**Explicación del ejemplo 1**
- __init__: este método es el constructor de la clase y se usa para inicializar los atributos del objeto.

- __str__: el método se usa para definir cómo se debe representar un objeto como cadena. En este caso, muestra el título y el autor del libro.

- __len__: permite usar la función len() sobre el objeto, en este caso, devuelve la longitud del título del libro.

- __add__: sobrescribe el operador + para concatenar los títulos de dos libros.

**Beneficios de los métodos mágicos**
- Permiten que los objetos iteractúen de manera natural con las funciones y operadores de Python.

- Facilitan la creación de clases más intuitivas y fáciles de usar.

- Ayudan a controlar la representación de los objetos, su comparación, iteración entre oras funcionalidades.

```python
# Ejemplo 1 de uso de algunos métodos mágicos
class Libro:
    def __init__(self, titulo, autor):
        self.titulo = titulo
        self.autor = autor

    def __str__(self):
        return f"{self.titulo} por {self.autor}"

    def __len__(self):
        return len(self.titulo)
    
    def __add__(self, otro):
        return f"{self.titulo} y {otro.titulo}"

# Crear objetos
libro1 = Libro("Cien años de soledad", "Gabriel García Márquez")
libro2 = Libro("Don Quijote de la Mancha", "Miguel de Cervantes")

# Usar el método __str__
print(str(libro1)) # Imprime: Cien años de soledad por Gabriel García Marquez

# Usar el método __len__
print(len(libro1)) # Imprime: 19 (la longitud del título)

# Usar el método __add__
print(libro1 + libro2) # Imprime: Cien años de soledad y Don Quijote de la Mancha

# Ejemplo 2 de uso de algunos métodos mágicos
class Persona:
    # Método mágico __init__: define qué sucede al crear un nuevo objeto de una clase.
    def __init__(self, nombre, apellidos, edad):
        self.nombre = nombre
        self.apellidos = apellidos
        self.edad = edad

    # Método mágico __str__: permite definir qué sucede al imprimir un objeto o al llamar al método __str__. Es una representación informal de nuestro objeto (información que deseamos ver).
    def __str__(self):
        return f"{self.nombre} {self.apellidos}"

    # Método mágico __repr__: es parecido a __str__, pero es una representación formal. Se utiliza para pasar información del objeto a otro método que pueda analizar todos sus datos.
    def __repr__(self):
        return f'Persona("{self.nombre}", "{self.apellidos}", {self.edad})'
    
    # El método mágico __eq__: realiza la función de comparar (igual a).
    def __eq__(self, other):
        # El método isinstance permite verificar si el objeto es instancia de una clase.
        if isinstance(other, Persona):
            return self.edad == other.edad
        return False
    
    # El método mágico __bool__: devuelve False o True dependiendo de la lógica definida.
    def __bool__(self):
        return self.edad >= 18

# Crear un objeto en el programa
amigo = Persona("Daniel", "Lama", 26)

# Imprimir el objeto amigo
print(amigo)  # Usando __str__

# Imprimir el objeto amigo con __repr__
print(repr(amigo))

# Comparar dos objetos. Si comparo con otro objeto con la misma edad, mostrará True.
# Crear otro objeto para la comparación
otro_amigo = Persona("Jho", "Guzmán", 22)

print(amigo == otro_amigo)  # False

# Comparar con un valor que no es una instancia de Persona
print(amigo == 26)  # False

# Evaluar el objeto con __bool__
print(bool(amigo))  # True

# Crear otro objeto y evaluar con __bool__
amigo_del_otro_amigo = Persona("Kimberly", "Turbi", 28)
print(bool(amigo_del_otro_amigo))  # True

# Mostrar los datos de la clase en forma de diccionario
print(Persona.__dict__)
```
