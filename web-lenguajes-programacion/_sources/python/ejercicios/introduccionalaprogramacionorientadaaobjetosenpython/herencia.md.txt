# Ejercicios — Herencia

## herencia_adicionales1

Herencia en vehículos

- Crea una clase base llamada Vehículo con los atributos:
- marca
- modelo
- año

- Crea un método llamado descripcion() que imprima una descripción del vehículo (marca, modelo y año).

- Crea dos clases hijas: Coche y Moto. Ambas deben heredar de Vehículo y agregar un atributo adicional:
- Coche: puertas (número de puertas)
- Moto: cilindrada (cilindrada del motor)

- Modifica el método descripcion() en las clases hijas para incluir la información específica de cada vehículo (puertas para el coche, cilindrada para la moto).

**Solución**

```python
class Vehiculo:
    def __init__(self, marca, modelo, anio):
        self.marca = marca
        self.modelo = modelo
        self.anio = anio

    def descripcion(self):
        return f"La marca del vehículo es {self.marca}, el modelo es {self.modelo} y el año {self.anio}"

class Coche(Vehiculo):
    def __init__(self, marca, modelo, anio, puertas):
        super().__init__(marca, modelo, anio)
        self.puertas = puertas

    def descripcion(self):
        return f"{super().descripcion()}, tiene {self.puertas} puertas"

class Moto(Vehiculo):
    def __init__(self, marca, modelo, anio, cilindrada):
        super().__init__(marca, modelo, anio)
        self.cilindrada = cilindrada

    def descripcion(self):
        return f"{super().descripcion()}, tiene una cilindrada de {self.cilindrada}"
        
coche = Coche("Toyota", "Corolla", 2020, 4)
moto = Moto("Yamaha", "R1", 2022, 1000)

print(coche.descripcion())
print(moto.descripcion())
```

## herencia_adicionales2

Herencia con métodos adicionales

- Crea una clase base Empleado con los siguientes atributos:
- nombre
- edad
- salario
- Crea un método detalles() que imprima el nombre, edad y salario.

- Crea dos clases hijas: Gerente y Tecnico. La clase Gerente debe tener un atributo adicional equipo (el equipo que dirige), mientras que Tecnico debe tener un atributo adicional especialidad (especialidad del técnico).

- Ambos deben sobrescribir el método detalles() para incluir la información extra correspondiente.

**Solución**

```python
class Empleado:
    def __init__(self, nombre, edad, salario):
        self.nombre = nombre
        self.edad = edad
        self.salario = salario

    def detalles(self):
        return f"EL empleado {self.nombre} tiene {self.edad} años de edad y cobra un salario de {self.salario}."

class Gerente(Empleado):
    def __init__(self, nombre, edad, salario, equipo):
        super().__init__(nombre, edad, salario)
        self.equipo = equipo

    def detalles(self):
        return f"{super().detalles()} Dirige el equipo {self.equipo}"

class Tecnico(Empleado):
    def __init__(self, nombre, edad, salario, especialidad):
        super().__init__(nombre, edad, salario)
        self.especialidad = especialidad
    
    def detalles(self):
        return f"{super().detalles()} Su especialidad es {self.especialidad}"
    
gerente = Gerente("Jeiron", 23, 50000, "Programadores")
tecnico = Tecnico("Junior", 21, 30000, "Programador")

print(gerente.detalles())
print(tecnico.detalles())
```

## herencia_adicionales3

Herencia con el método super()

- Crea una clase base Forma con el método area() que retorne 0 (esto será sobrescrito en las clases hijas).

- Crea dos clases hijas: Cuadrado y Círculo. La clase Cuadrado debe tener un atributo lado y la clase Círculo debe tener un atributo radio.

- En el método area() de ambas clases hijas, calcula el área correspondiente:
- Para el cuadrado: lado * lado
- Para el círculo: π * radio^2

- Utiliza el método super() para llamar al constructor de la clase base Forma y asignar valores comunes.

**Solución**

```python
import math

class Forma:
    def __init__(self):
        pass

    def area(self):
        return 0
    
class Cuadrado(Forma):
    def __init__(self, lado):
        super().__init__()
        self.lado = lado

    def area(self):
        return self.lado * self.lado

class Circulo(Forma):
    def __init__(self, radio):
        super().__init__()
        self.radio = radio

    def area(self):
        return math.pi * self.radio ** 2
    
cuadrado = Cuadrado(8)
circulo = Circulo(10)

print(f"El área del cuadrado es: {cuadrado.area()}")
print(f"El área del círculo es: {circulo.area()}")
```

## herencia_adicionales4

Herencia múltiple

- Crea dos clases base: Animal y Domestico. La clase Animal tiene un atributo especie y un método hacer_sonido(), mientras que la clase Domestico tiene un atributo nombre y un método jugar().

- Crea una clase hija llamada Perro que herede de ambas clases base (Animal y Domestico).

- En la clase Perro, sobrescribe el método hacer_sonido() y agrega una implementación propia para jugar().

**Solución**

```python
class Animal:
    def __init__(self, especie):
        self.especie = especie

    def hacer_sonido(self):
        return "El animal hace un sonido"

class Domestico:
    def __init__(self, nombre):
        self.nombre = nombre
    
    def jugar(self):
        return "El animal juega"

class Perro(Animal, Domestico):
    def __init__(self, especie, nombre):
        Animal.__init__(self, especie)
        Domestico.__init__(self, nombre)

    def hacer_sonido(self):
        return "¡Guau!"

    def jugar(self):
        return f"{self.nombre} está jugando con una pelota."

perro = Perro("Ladradora", "Coral")

print(f"{perro.nombre} de especie '{perro.especie}' dice: {perro.hacer_sonido()}")
print(f"{perro.jugar()}")
```

## herencia_adicionales5

Clase abstracta y herencia

- Crea una clase abstracta InstrumentoMusical con el método abstracto tocar().

- Crea dos clases hijas: Piano y Guitarra, ambas deben implementar el método tocar().

- La clase Piano debe imprimir "Tocando el piano", y la clase Guitarra debe imprimir "Tocando la guitarra".

- Crea una función interpretar_musica() que reciba una lista de objetos InstrumentoMusical y llame al método tocar() de cada instrumento.

**Solución**

```python
from abc import ABC, abstractmethod

class InstrumentoMusical(ABC):
    @abstractmethod
    def tocar(self):
        pass

class Piano(InstrumentoMusical):
    def tocar(self):
        print("Tocando el piano")

class Guitarra(InstrumentoMusical):
    def tocar(self):
        print("Tocando la guitarra")

def interpretar_musica(instrumentos):
    for instrumento in instrumentos:
        instrumento.tocar()

piano = Piano()
guitarra = Guitarra()

instrumentos = [piano, guitarra]

interpretar_musica(instrumentos)
```
