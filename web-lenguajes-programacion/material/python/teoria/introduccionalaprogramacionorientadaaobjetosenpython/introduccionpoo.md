# Introducción a la POO

**Introducción a la programación orientada a objetos (POO)**
La programación orientada a objetos (POO) es un paradigma de programación basado en "objetos", que son instancias de clases. Las clases definen los atributos (propiedades) y métodos (funciones) que los objetos pueden tener.

En Python, todo es un objeto, y la POO es una forma poderosa de organizar y estructurar el código, lo que facilita la reutilización y el mantenimiento.

Definición de clases: Se definen usando la palabra reservada class. Por ejemplo, para crear la clase Perro:

```python
class Perro:
    pass (Se utiliza cuando no incluimos atributos y metodos, para evitar errores)
```

**Conceptos clave en POO**
1. Clases y obejtos
2. Atributos y Métodos
3. Herencia
4. Polimorfismo
5. Encapsulación
6. abstracción

- **1.** Clases y objetos
- Clase: es una plantilla para crear objetos. Define los atributos y métodos que sus objetos tendrán.

- Objeto: es una instancia de una clase. Se puede pensar en un objeto como una entidad concreta que se crea a partir de una clase.

- **2.** Atributos y Métodos
- Atributos: son las características que un objeto tiene. Se definen dentro de la clase.

- Métodos: son las acciones que los objetoss pueden realizar. Se definen dentro de la clase.

- **3.** Herencia
  La herencia permite crear una nueva clase a partir de una clase existente. La nueva clase (subclase) hereda los atributos y métodos de la clase base (superclase).

- **4.** Polimorfismo
  El poliformismo permite que las clases hijas tengan diferentes imprementaciones de un mismo método. Es decir, un mismo método puede comportarse de diferentes formas dependiendo del objeto que lo invoque.

- **5.** Encapsulación
  La encapsulación es el proceso de ocultar los detalles internos de un objeto y solo exponer lo necesario. Se logra mediante los modificadores de acceso, como public, private, y protected.

En Python, los atributos privados se indican utilizando dos guiones bajos (__), lo que hace que no se puedan acceder directamente fuera de la clase.

- **6.** Abstracción
  La abstracción es el proceso de ocultar la implementación interna de un objeto y mostrar solo las funcionalidades esenciales. En Python, se puede lograr mediante clases abstractas, que no pueden ser instanciadas directamente y deben ser heredadas por otras clases.

**Notas**
El método constructor se utiliza para inicializar los valores de ciertos atributos.

El método constructor __init__() se llama automáticamente cuando creamos un objeto de una clase. Permite inicializar los atributos del objeto.

Creación de objetos (instancias): Para crear un objeto de una clase, llamamos a la clase como si fuera una función. Es decir, se crea un objeto a partir de una clase.

**Resumen**
La POO te permite organizar tu código de manera más modular y reutilizable, permitiendo que los programas sean más fáciles de mantener y extender. En Python, los conceptos de clases, objetos, herencia, polimorfismo, encapsulación y abstracción son fundamentales para escribir programas más complejos y eficientes.

```python
# Definir una clase llamada 'Perro'
class Perro:
    # Atributo de clase, son características comunes en todos los objetos de la clase.
    especie = "Canino"

    # Método constructor (__init__) para inicializar atributos
    def __init__(self, nombre, edad): # self hace referencia al objeto sin necesidad de nombrarlo.
        self.nombre = nombre # Atributo
        self.edad = edad # Atributo

        # Comprobar si se ejecuta el método constructor
        print("Se ha ejecutado el constructor")

    # Se crea un método al definir una clase para todos los objetos y se utiliza la palabra reservada def 
    def ladrar(self):
        print("¡Guau Guau!")   

# Crear un objeto de la clase 'Perro'
mi_perro = Perro("Doggy", 9)

# Para acceder a los atributos del objeto
print(mi_perro.nombre)
print(mi_perro.edad)

# Acceder al método ladrar
mi_perro.ladrar()

# Para modificar el atributo de un objeto, se asigna un nuevo valor al atributo utilizando la notación de punto.
mi_perro.edad = 12
print(mi_perro.edad)

# Eliminación de objetos: Para eliminar un objeto en Python, se utiliza la palabra reservada/clave 'del'. Sin embargo, esto generalmente no es necesario, ya que Python maneja automáticamente la eliminación de objetos cuando no se utilizan.
del mi_perro.edad
print(mi_perro.edad)

# Clase con todos los conceptos expuesto en este documento
from abc import ABC, abstractmethod

# Clase base abstracta
class Animal(ABC):
    # Método abstracto que debe ser implementado por las clases hijas
    @abstractmethod
    def hablar(self):
        pass

# Clase hija que hereda de la clase Animal
class Perro(Animal):
    # Atributo de clase, común a todos los objetos de la clase
    especie = "Canino"

    # Método constructor (__init__) para inicializar los atributos del objeto
    def __init__(self, nombre, edad):
        self.nombre = nombre  # Atributo de instancia
        self.__edad = edad    # Atributo privado (encapsulación)

        # Imprimir para confirmar la ejecución del constructor
        print(f"Se ha creado un perro llamado {self.nombre}")

    # Método para hacer hablar al perro (polimorfismo)
    def hablar(self):
        print(f"{self.nombre} dice: ¡Guau! ¡Guau!")

    # Método para acceder a la edad de manera controlada (getter)
    def obtener_edad(self):
        return self.__edad

    # Método para modificar la edad (setter)
    def establecer_edad(self, nueva_edad):
        if nueva_edad > 0:
            self.__edad = nueva_edad
        else:
            print("La edad debe ser un valor positivo")

# Crear un objeto de la clase Perro
mi_perro = Perro("Doggy", 9)

# Acceder a los atributos públicos del objeto
print(f"Nombre del perro: {mi_perro.nombre}")

# Acceder al atributo privado usando un método getter
print(f"Edad del perro: {mi_perro.obtener_edad()} años")

# Acceder al método hablar
mi_perro.hablar()

# Modificar la edad del perro usando el setter
mi_perro.establecer_edad(10)
print(f"Nuevo edad del perro: {mi_perro.obtener_edad()} años")

# Acceder a un atributo de clase (especie)
print(f"Especie del perro: {mi_perro.especie}")

# Demostración de polimorfismo
class Gato(Animal):
    def hablar(self):
        print("El gato maúlla: ¡Miau!")

# Crear un objeto de la clase Gato
mi_gato = Gato()

# Llamar al método hablar de ambos objetos (demostración de polimorfismo)
mi_perro.hablar()  # Salida: Doggy dice: ¡Guau! ¡Guau!
mi_gato.hablar()   # Salida: El gato maúlla: ¡Miau!
```
