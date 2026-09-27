# Encapsulamiento de métodos

**Encapsulamiento de métodos**
El encapsulamiento de métodos es un principio fundamental de la programación orientada a objetos (POO), que se refiere a la ocultación de los detalles internos de un objeto y la exposición solo de aquellos elementos necesarios para interactuar con él. En Python, esto se logra usando modificadores de acceso como privado, protegido y público.

Aunque Python no tiene mecanismos estrictos de control de acceso como otros lenguajes (por ejemplo, Java), puedes seguir convenciones para hacer que ciertos atributos o métodos sean considerados "privados" o "protegidos", restringiendo su acceso.

**Métodos Públicos, Protegidos y Privados**
1. Públicos: Son métodos y atributos que pueden ser accedidos desde cualquier parte del código. Son el comportamiento normal de las clases.

- **2.** Protegidos: Aunque no es un mecanismo estricto, se puede indicar que un atributo o método es "protegido" usando un solo guion bajo (_). Esto indica que el atributo o método está destinado a ser usado solo dentro de la clase y sus subclases.

- **3.** Privados: En Python, el concepto de atributos y métodos privados se implementa mediante un doble guion bajo (__). Esto "manglea" el nombre del atributo o método para evitar el acceso desde fuera de la clase. Sin embargo, no impide el acceso, solo lo dificulta.

**Acceso a Atributos y Métodos Privados**
Aunque se pueden hacer privados, el acceso a estos sigue siendo posible mediante un mecanismo conocido como name mangling, donde el nombre real del atributo es modificado por Python para evitar el acceso directo.

**Métodos de Acceso (Getters y Setters)**
Aunque puedes hacer que los atributos sean privados, a menudo se utilizan métodos getter y setter para acceder a ellos de manera controlada. Los getters permiten obtener el valor de un atributo privado, mientras que los setters permiten modificarlo de forma controlada.

**Ventajas del encapsulamiento**
1. Control sobre los datos: puedes controlar cómo se acceden y modifican los atributos de un objeto.

- **2.** Protección de datos: permite ocultar la complejidad y proteger los datos sensibles dentro de la clase.

- **3.** Mayor flexibilidad: puedes cambiar la implementación interna de una clase sin afectar el código que la utiliza, ya que solo interactúan con los métodos públicos.

**Conclusión sobre el encapsulamiento de métodos**
El encapsulamiento ayuda a proteger el estado interno de un objeto, asegurando que los atributos solo sena accesibles a través de métodos de acceso controlados. Es una de las características fundamentales de la POO y permite que el código sea más seguro y modular.

```python
# Métodos públicos, protegidos y privados
# Públicos
class Persona:
    def __init__(self, nombre):
        self.nombre = nombre # Atributo público

    def saludar(self): # Método público
        print(f"Hola, mi nombre es {self.nombre}")

# Protegidos
class Persona:
    def __init__(self, nombre):
        self._nombre = nombre # Atributo protegido
    
    def _saludar(self): # Método protegido
        print(f"Hola, mi nombre es {self._nombre}")

# Privados
class Persona:
    def __init__(self, nombre):
        self.__nombre = nombre # Atributo privado

    def __saludar(self): # Método privado
        print(f"Hola, mi nombre es {self.nombre}")

# Acceso a Atributos y Métodos Privados
persona = Persona("Jeiron")

# No se puede acceder directamente al atributo privado
# print(persona.__nombre) # Esto causará un error

# Sin embargo, Python convierte __nombre en _Persona__nombre internamente
print(persona._Persona__nombre) # Esto si funcionará

# Métodos de Acceso (Getters y Setters)
class Persona:
    def __init__(self, nombre):
        self.__nombre = nombre

    # Getter
    def get_nombre(self):
        return self.__nombre
    
    # Setter
    def set_nombre(self, nombre):
        if len(nombre) > 2: # Control de acceso
            self.__nombre = nombre
        else:
            print("El nombre es demasiado corto")

persona = Persona("Jeiron")
print(persona.get_nombre()) # Jeiron
persona.set_nombre("J") # El nombre es demasiado corto
persona.set_nombre("Junior")
print(persona.get_nombre()) # Junior

# Otro ejemplo
class Auto:
    def __init__(self, marca, modelo, año):
        # Crear dos atributos privados (con name mangling)
        self.__marca = marca
        self.__modelo = modelo
        self.año = año

    # Crear un metodo privado (con name mangling)
    def __acelerar(self):
        print("Acelerando...")

# Crear una instancia de Auto
mi_auto = Auto("Kia", "Sportage", 2023)

# No se puede ejecutar directamente el método privado
# mi_auto.__acelerar()  # Esto dará un error, ya que el método es privado

# Para poder ejecutar el método privado, usamos name mangling
mi_auto._Auto__acelerar()  # Acceso a __acelerar() a través del name mangling
```
