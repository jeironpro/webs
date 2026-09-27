# Ejercicios — Dataclasses

## dataclasses_adicionales1

Definir una dataclass simple

Crea una dataclass llamada Libro que tenga los siguientes atributos: titulo, autor, y anio_publicacion. Luego, crea una instancia de esta clase y muestra los valores de los atributos.

**Solución**

```python
from dataclasses import dataclass

@dataclass
class Libro:
    titulo: str
    autor: str
    anio_publicacion: int

libro = Libro("Cien años de soledad", "Gabriel García Márquez", 1967)
print(f"Título: {libro.titulo}")
print(f"Autor: {libro.autor}")
print(f"Año de publicación: {libro.anio_publicacion}")
```

## dataclasses_adicionales2

Comparar objetos

Crea dos instancias de la clase Persona con el mismo nombre y edad. Luego, compara los objetos usando == para verificar si son iguales. Haz lo mismo con dos objetos que tengan valores diferentes.

**Solución**

```python
from dataclasses import dataclass

@dataclass
class Persona:
    nombre: str
    edad: int

persona1 = Persona("Jeiron", 21)
persona2 = Persona("Junior", 22)

print(persona1 == persona2)

persona3 = Persona("JeyJey", 21)
persona4 = Persona("JeyJey", 21)

print(persona3 == persona4)
```

## dataclasses_adicionales3

Campos con valor predeterminado

Crea una dataclass llamada Empleado con los siguientes atributos: nombre, salario (con valor predeterminado de 3000) y cargo. Crea dos objetos de la clase, uno especificando el salario y otro sin especificarlo (usando el valor predeterminado).

**Solución**

```python
from dataclasses import dataclass

@dataclass
class Empleado:
    nombre: str
    cargo: str
    salario: float = 3000

empleado1 = Empleado("Jeiron", "Programador", 50000)

empleado2 = Empleado("Junior", cargo="Gerente")

print(empleado1)

print(empleado2)
```

## dataclasses_adicionales4

Modificar datos con __post_init__

Crea una dataclass llamada Producto que tenga los atributos nombre, precio y cantidad. En el método __post_init__, verifica si la cantidad es 0 y muestra un mensaje indicando que el producto está agotado. Crea un producto con cantidad 0 y otro con cantidad mayor que 0 para probar el código.

**Solución**

```python
from dataclasses import dataclass

@dataclass
class Producto:
    nombre: str
    precio: float
    cantidad: int

    def __post_init__(self):
        if self.cantidad == 0:
            print(f"El producto {self.nombre} está agotando.")
        else:
            print(f"El producto {self.nombre} está disponible.")

producto1 = Producto("Teclado", 50.0, 0)

producto2 = Producto("Ratón", 30.0, 10)
```

## dataclasses_adicionales5

Inmutabilidad de la dataclass

Crea una dataclass llamada Punto que tenga los atributos x y y. Haz que la clase sea inmutable usando frozen=True. Intenta cambiar el valor de uno de los atributos después de crear la instancia y observa qué sucede.

**Solución**

```python
from dataclasses import dataclass

# Al establecer frozen en True la clase se convierte en inmutable
@dataclass(frozen=True)
class Punto:
    x: int
    y: int

punto1 = Punto(3, 4)

try:
    punto1.x = 5
except AttributeError as e:
    print(f"Error: {e}")
```
