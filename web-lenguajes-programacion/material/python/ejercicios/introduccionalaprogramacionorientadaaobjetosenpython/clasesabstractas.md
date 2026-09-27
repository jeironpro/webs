# Ejercicios — Clases abstractas

## clases_abstractas_adicionales1

Crear una clase abstracta Vehículo

- Define una clase abstracta llamada Vehículo con un método abstracto moverse() y un método no abstracto detalles().

- Crea dos clases hijas, Coche y Bicicleta, que implementen el método moverse() de manera diferente (el coche puede "conducir" y la bicicleta puede "pedalear").

- La clase Vehículo debe tener un método detalles() que imprima la marca y el modelo del vehículo.

**Solución**

```python
from abc import ABC, abstractmethod

class Vehiculo(ABC):
    def __init__(self, marca, modelo):
        self.marca = marca
        self.modelo = modelo

    @abstractmethod
    def moverse(self):
        pass

    def detalle(self):
        return f"La marca del vehículo es {self.marca} y el modelo es {self.modelo}"

class Coche(Vehiculo):
    def moverse(self):
        return "El coche puede conducir"
    
class Bicicleta(Vehiculo):
    def moverse(self):
        return "La bicicleta puede pedalear"
    
coche = Coche("Toyota", "Corolla")
bicicleta = Bicicleta("Giant", "Escape 3")

print(coche.moverse())
print(coche.detalle())

print(bicicleta.moverse())
print(bicicleta.detalle())
```

## clases_abstractas_adicionales2

Animal con múltiples métodos abstractos

- Crea una clase abstracta llamada Animal que tenga dos métodos abstractos: hacer_sonido() y alimentarse().

- Crea dos clases hijas, Perro y Gato, que implementen ambos métodos (hacer_sonido() y alimentarse()) con un comportamiento específico para cada uno.

- Haz que las clases hijas impriman qué sonido hace el animal y qué come.

**Solución**

```python
from abc import ABC, abstractmethod

class Animal(ABC):
    @abstractmethod
    def hacer_sonido(self):
        pass

    @abstractmethod
    def alimentarse(self):
        pass

class Gato(Animal):
    def hacer_sonido(self):
        return "¡Miau!"
    
    def alimentarse(self):
        return "Purina"
    
class Perro(Animal):
    def hacer_sonido(self):
        return "¡Guau!"
    
    def alimentarse(self):
        return "Croquetas"
    
gato = Gato()
perro = Perro()

print(f"Mia dice {gato.hacer_sonido()}")
print(f"Mia come {gato.alimentarse()}")

print(f"Coral dice {perro.hacer_sonido()}")
print(f"Coral come {perro.alimentarse()}")
```

## clases_abstractas_adicionales3

Clase Abstracta para Forma Geométrica

- Crea una clase abstracta llamada Forma con un método abstracto area() y un método no abstracto perimetro() que calcule el perímetro de la forma.

- Define dos clases hijas, Círculo y Rectángulo, que implementen el método area() de manera correspondiente.

- La clase Rectángulo debe tener atributos largo y ancho, y la clase Círculo debe tener un atributo radio.

**Solución**

```python
from abc import ABC, abstractmethod
import math

class Forma(ABC):
    @abstractmethod
    def area(self):
        pass

    def perimetro(self):
        pass

class Circulo(Forma):
    def __init__(self, radio):
        self.radio = radio

    def area(self):
        return math.pi * (self.radio ** 2)
    
    def perimetro(self):
        return 2 * math.pi * self.radio
    
class Rectangulo(Forma):
    def __init__(self, largo, ancho):
        self.largo = largo
        self.ancho = ancho

    def area(self):
        return self.largo * self.ancho
    
    def perimetro(self):
        return 2 * (self.largo + self.ancho)
    
circulo = Circulo(5)

rectangulo = Rectangulo(7, 4)

print(f"El área del círculo es: {circulo.area():.2f}")
print(f"El perímetro del círculo es: {circulo.perimetro():.2f}")

print(f"El área del rectángulo es: {rectangulo.area()}")
print(f"El perímetro del rectángulo es: {rectangulo.perimetro()}")
```

## clases_abstractas_adicionales4

Clase Abstracta para Producto

- Crea una clase abstracta llamada Producto con un método abstracto precio_final().

- Crea dos clases hijas, Electrodoméstico y Ropa, que implementen el método precio_final(). Los electrodomésticos deben agregar un 18% del ITBIS al precio base y la ropa debe aplicar un descuento del 5%.

- Define los precios base en cada clase y calcula el precio final después de aplicar los ajustes.

**Solución**

```python
from abc import ABC, abstractmethod

class Producto(ABC):
    @abstractmethod
    def precio_final(self):
        pass

class Electrodoméstico(Producto):
    def __init__(self, precio, itbis=18):
        self.precio = precio
        self.itbis = itbis

    def precio_final(self):
        return self.precio + (self.precio * (self.itbis / 100))

class Ropa(Producto):
    def __init__(self, precio, descuento=5):
        self.precio = precio
        self.descuento = descuento

    def precio_final(self):
        return self.precio * (1 - self.descuento / 100)
    
mueble = Electrodoméstico(100)
abrigo = Ropa(50)

print(f"EL precio final del electrodoméstico es: ${mueble.precio_final():.2f}")
print(f"El precio final de la ropa es: ${abrigo.precio_final():.2f}")
```

## clases_abstractas_adicionales5

Clase Abstracta y Polimorfismo

- Define una clase abstracta InstrumentoMusical con el método abstracto tocar().

- Crea dos clases hijas, Guitarra y Piano, que implementen el método tocar().

- Crea una función llamada interpretar() que reciba una lista de objetos de tipo InstrumentoMusical y los haga "sonar", es decir, llame al método tocar() de cada instrumento.

**Solución**

```python
from abc import ABC, abstractmethod

class InstrumentoMusical(ABC):
    @abstractmethod
    def tocar(self):
        pass

class Guitarra(InstrumentoMusical):
    def tocar(self):
        return "Sonido de guitarra"

class Piano(InstrumentoMusical):
    def tocar(self):
        return "Sonido de piano"

def interpretar(instrumentos):
    for instrumento in instrumentos:
        print(instrumento.tocar())

guitarra = Guitarra()
piano = Piano()

instrumentos = [guitarra, piano]

interpretar(instrumentos)
```
