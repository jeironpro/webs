# Clases abstractas

**Clases Abstractas**
Las clases abstractas son fundamentales en POO porque permiten definir una estructura base para otras clases. No puedes instanciar una clase abstracta directamente, pero puedes heredar de ella para crear clases más concretas que implementen los métodos que la clase abstracta define.

Clases abstractas: no representan algo específico y se utilizan para crear otras clases. No pueden ser instanciadas, por lo que no se pueden crear nuevos objetos con ellas. Para crear una clase abstracta, se debe importar la clase base ABC y el decorador abstractmethod para los métodos abstractos.

**Conceptos clave**
1. Definición: una clase abstracta es una clase que no se puede instanciar por sí misma. Se utiliza como una plantilla para otras clases.

- **2.** Métodos abstractos: son métodos que se definen en la clase abstracta pero no tienen implementación. Las clases que heredan de una clase abstracta deben implementar estos métodos.

**Sintaxis básica**
Para crear una clase abstracta en Python, usamos el módulo abc (Abstract Base Class). Esto permite definir métodos que deben ser implementados en las clases hijas.

**Explicación del ejemplo**
- ABC: la clase ABC permite crear clases abstractas en Python.

- @abstractmethod: el decorador @abstractmethod marca los métodos que deben ser implementados por las subclases.

- Herencia: las clases Cuadrado y Circulo heredan de Figura, y ambas implementan los métodos area() y perimetro() que estaban definidos como abstractos.

- No se puede instanciar una clase abstracta: si intentas crear una instancia de Figura directamente, obtendrás un error.

```python
# Ejemplo de una clase abstracta
from abc import ABC, abstractmethod

# Crear la clase abstracta, la cual desciende de ABC. Con esto no se podrá crear instancias de la clase directamente, solo de aquellas que descienden de ella.
class Figura(ABC):
    # Crear un método abstracto para el área. No tiene código en su interior, ya que es un método vacío. Las clases hijas se ven obligadas a implementarlo. Hacemos uso del decorador abstractmethod.
    @abstractmethod
    def area(self):
        pass

    @abstractmethod
    def perimetro(self):
        pass

# Crear una clase que dependa de la clase Figura
class Cuadrado(Figura):
    def __init__(self, lado):
        self.lado = lado

    # Implementar el primer método
    def area(self):
        return self.lado * self.lado
    
    # Implementar el segundo método
    def perimetro(self):
        return self.lado * 4
        
# Crear otra clase que descienda de la clase Figura
class Circulo(Figura):
    def __init__(self, radio):
        self.radio = radio

    def area(self):
        return 3.14159 * self.radio * self.radio
    
    def perimetro(self):
        return 2 * 3.14159 * self.radio

# No se puede instanciar una clase abstracta
# f1 = Figura()

# Instanciar el cuadrado
c1 = Cuadrado(5)

print("El área del cuadrado es", c1.area())
print("El perímetro del cuadrado es", c1.perimetro())

# Instanciar el círculo
c2 = Circulo(5)
print("El área del círculo es", c2.area())
print("El perímetro del círculo es", c2.perimetro())
```
