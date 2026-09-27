# Dataclasses

**Dataclasses**
Las dataclasses son una forma sencilla y eficiente de crear clases en Python que principalmente contienen datos. Introducidas en Python 3.7, las dataclasses proporcionan una forma rápida de definir clases sin tener que escribir mucho código repetitivo. Python genera automáticamente varios métodos mágicos para las clases, como __init__, __repr__, __eq__, __hash__, entre otros, para hacer que trabajar con ellas sea más conveniente.

**¿Qué hace @dataclass?**
El decorador @dataclass genera automáticamente:
- Un constructor (__init__) para inicializar los atributos de la clase.

- Un método __repr__ para representar el objeto como una cadena.

- Un método __eq__ para comparar objetos de la clase.

- Un método __hash__ (si todos los atributos son inmutables).

- Un método __post_init__ (opcional) que puedes usar paara realizar acciones adicionales después de la inicialización.

**Campos con valores predeterminados**
Puedes establecer valores predeterminados para los campos, lo que permite crear objetos sin proporcionar todos los valores de manera obligatoria.

**__post_init__ para personalización adicional**
Si necesitas realizar alguna acción después de la inicialización de los atributos, puedes definir el método __post_init__. Este método se llama automáticamente después del constructor generado por @dataclass.

**Ventajas de usar Dataclasses**
- Reducción de código repetitivo: el decorador @dataclass genera automáticamente métodos importantes, como __init__, __repr__ y __eq__.

- Claridad y simplicidad: son especialmente útiles cuando solo necesitas almacenar datos y no quieres escribir métodos adicionales.

- Inmutablidad opcional: puedes hacer que las dataclasses sean inmutables usando el parámetro frozen=True en el decorador, lo que las convierte en una especie de tupla con propiedades accesibles pero no modificables.

```python
@dataclass(frozen=True)
class Persona:
    nombre: str
    edad: int
```

**Conclusión sobre las Dataclasses**
Las dataclasses son una excelente opción cuando trabajas con clases que principalmente almacenan datos. Te permiten escribir clases más concisas y legibles sin sacrificar funcionalidad.

```python
# Uso básico de dataclass
# Para usar una dataclass, simplemente tienes que decorar una clase con el decorador @dataclass. Aquí hay un ejemplo básico:

from dataclasses import dataclass

@dataclass
class Persona:
    nombre: str
    edad: int

# Crear un objeto de la clase Persona
persona = Persona("Jeiron", 21)

# Acceder a los atributos
print(persona.nombre) # Jeiron
print(persona.edad) # 21

# Ejemplo de __repr__ y __eq__ automáticos
from dataclasses import dataclass

@dataclass
class Persona:
    nombre: str
    edad: int

persona1 = Persona("Jeiron", 21)
persona2 = Persona("Junior", 22)
persona3 = Persona("JeyJey", 23)

# Imprimir el objeto (llama a __repr__ automáticamente)
print(persona1) # Persona(nombre = 'Jeiron', edad = 21)

# Comparar objetos (llama a __eq__ automáticamente)
print(persona1 == persona2) # False

# Campos con valores predeterminados
from dataclasses import dataclass

@dataclass
class Persona:
    nombre: str
    edad: int = 18 # Edad con valor predeterminado

persona1 = Persona("Jeiron")
persona2 = Persona("Junior", 22)

print(persona1.edad)  # 18
print(persona2.edad)  # 22

# __post_init__ para personalización adicional
from dataclasses import dataclass

@dataclass
class Persona:
    nombre: str
    edad: int

    def __post_init__(self):
        if self.edad < 18:
            print(f"{self.nombre} es menor de edad.")
        else:
            print(f"{self.nombre} es mayor de edad.")

persona1 = Persona("Jeiron", 17) # Jeiron es menor de edad.
persona2 = Persona("Junior", 22) # Junior es mayor de edad.

# Para utilizar las DataClasses, utilizaremos el decorador @dataclass, para lo cual lo importamos
from dataclasses import dataclass
from typing import Any

# Crearemos una clase User con el decorador @dataclass
@dataclass
class User:
    username: str
    email: str
    # Si no se desea indicar un tipo específico de un atributo, se puede usar la clase Any, la cual importamos
    password: Any

# class User:
#     def __init__(self, username, email):
#         self.username = username
#         self.email = email

# Crear un método
    def saludar(self):
        print(f"Hola, Estudiantes, le saluda {self.username}")

# Crear una instancia de dicha clase
if __name__ == '__main__':
    jeiron = User('Jeiron', 'jeiron1@gmail.com', 'password')

# Usar los atributos de la clase
# print(jeiron.username)
# print(jeiron.email)
# print(jeiron.password)

print("Mi nombre es", jeiron.username, "y mi correo es", jeiron.email)

jeiron.saludar()
```
