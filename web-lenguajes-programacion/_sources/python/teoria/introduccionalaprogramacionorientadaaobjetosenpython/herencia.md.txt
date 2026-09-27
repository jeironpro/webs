# Herencia

**Herencia**
La herencia es uno de los principios más importantes de la Programación Orientada a Objetos (POO). Permite que una clase herede atributos y métodos de otra clase, lo que facilita la reutilización del codigó y la creación de jerarquías de clases.

En Python, la herencia permite que una clase hija herede de una clase padre (o clase base). La clase hija puede acceder a los métodos y atributos de la clase padre, y también puede agregar sus propios métodos y atributos o sobrescribir los heredados.

Herencia: es un mecanismo que nos permite crear clases nuevas a partir de clases ya existentes, reutilizando y extendiendo el código ya escrito. La clase original se llama clase base y la nueva clase se llama clase derivada.

Las clases base: son las clases de las que heredamos, mientras que las clases derivadas son las que se crean a partir de las clases base.

Las clases derivadas pueden heredar atributos y métodos de las clases base, lo que permite reutilizar el código.

**Explicacion del ejemplo simple**
- La clase ClaseDerivada hereda de la clase ClaseBase. Esto significa que la clase ClaseDerivada puede acceder a los métodos y atributos de la clase ClaseBase.

- El metodo super().__init__() se utiliza para llamar al constructor de la clase base (ClaseBase) y asegurarse de que los atributos se inicialicen correctamente en la clase hija (ClaseDerivada).

- La clase ClaseDerivada sobreescribe los métodos de la clase ClaseBase, proporcionando su propia implementación.

**Beneficios de la herencia**
- Reutilización del código: puedes crear nuevas clases basadas en clases existentes, lo que reduce la duplicación de código.

- Modularidad y escalabilidad: la herencia permite construir jerarquías de clases que son fáciles de entender y mantener.

- Polimorfismo: las clases hijas pueden sobrescribir los métodos de la clase base, permitiendo que el mismo método se comporte de manera diferente según la clase.

```python
# Sintaxis de la herencia:
# Para definir una clase hija que hereda de una clase padre, se coloca el nombre de la clase base entre paréntesis al declarar la clase hija

# Ejemplo de herencia simple
# Clase base o clase padre
class ClaseBase:
    def __init__(self):
        """
        Constructor de la clase base que imprime un mensaje al ser instanciado.
        """
        print("Constructor de ClaseBase")

    def metodo_clase(self):
        """
        Método de la clase base que imprime un mensaje.
        """
        print("Método de la ClaseBase")

# Si llamamos la ClaseDerivada y le indicamos pass, mostrará el constructor de ClaseBase
# class ClaseDerivada(ClaseBase):
#     pass

# Clase derivada que hereda de ClaseBase
class ClaseDerivada(ClaseBase):
    def __init__(self):
        """
        Constructor de la clase derivada que llama al constructor de la clase base.
        """
        super().__init__()  # Llamamos al constructor de la clase base
        print("Constructor de la ClaseDerivada")

    def metodo_clase(self):
        """
        Sobrescribe el método de la clase base con una implementación diferente.
        """
        print("Método de la ClaseDerivada")

# Crear un objeto de la ClaseDerivada y llamar al método
obj = ClaseDerivada()
obj.metodo_clase()

# Ejemplo practico y simple de herencia
# Clase base o clase padre
class Animal:
    def __init__(self, nombre):
        self.nombre = nombre
    
    def hacer_sonido(self):
        print("El animal hace un sonido")

# Clase hija
class Perro(Animal):
    def __init__(self, nombre, raza):
        super().__init__(nombre) # Llama al constructor de la clase base
        self.raza = raza

    def hacer_sonido(self):
        print("El animal hace un sonido")

# Crear un objeto de la clase Perro
mi_perro = Perro("Coral", "Ladradora")
print(mi_perro.nombre) # Heredado de Animal
print(mi_perro.raza) # Atributo propio de Perro
mi_perro.hacer_sonido() # Método sobrescrito en Perro
```
