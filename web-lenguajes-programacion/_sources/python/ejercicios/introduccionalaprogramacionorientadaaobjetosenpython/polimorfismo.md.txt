# Ejercicios — Polimorfismo

## polimorfismo_adicionales1

Polimorfismo en figuras geométricas

- Crea una clase base llamada Figura con el método area(). Este método debe ser sobrescrito en las clases hijas.

- Crea dos clases hijas: Cuadrado y Círculo. La clase Cuadrado debe tener un atributo lado y la clase Círculo debe tener un atributo radio.

- Sobrescribe el método area() en ambas clases:
- Para el cuadrado, el área es lado * lado.
- Para el círculo, el área es π * radio^2.

- Crea una función mostrar_area() que reciba un objeto Figura y llame al método area(), mostrando el área correspondiente según la clase.

**Solución**

```python
import math

class Figura:
    def area(self):
        pass

class Cuadrado(Figura):
    def __init__(self, lado):
        self.lado = lado

    def area(self):
        return self.lado * self.lado

class Circulo(Figura):
    def __init__(self, radio):
        self.radio = radio

    def area(self):
        return math.pi * self.radio ** 2
    
def mostrar_area(figura):
    print(f"El área es: {figura.area()}")

cuadrado = Cuadrado(7)
circulo = Circulo(5)

mostrar_area(cuadrado)
mostrar_area(circulo)
```

## polimorfismo_adicionales2

Polimorfismo con vehículos

- Crea una clase base llamada Vehiculo con el método mover(), que imprime "El vehículo se mueve".

- Crea dos clases hijas: Coche y Bicicleta. La clase Coche debe sobrescribir el método mover() para imprimir "El coche avanza", mientras que la clase Bicicleta debe imprimir "La bicicleta pedalea".

- Crea una función iniciar_viaje() que reciba un objeto Vehiculo y llame al método mover(), demostrando el polimorfismo.

**Solución**

```python
class Vehiculo:
    def mover(self):
        return "El vehículo se mueve"
    
class Coche(Vehiculo):
    def mover(self):
        return "El coche avanza"

class Bicicleta(Vehiculo):
    def mover(self):
        return "La bicicleta pedalea"
    
def iniciar_viaje(vehiculo):
    print(vehiculo.mover())

coche = Coche()
bicicleta = Bicicleta()

iniciar_viaje(coche)
iniciar_viaje(bicicleta)
```

## polimorfismo_adicionales3

Polimorfismo con animales

- Crea una clase base llamada Animal con el método hacer_sonido(), que será sobrescrito por las clases hijas.

- Crea tres clases hijas: Perro, Gato, y Vaca. Cada una debe sobrescribir el método hacer_sonido():
- Perro: "¡Guau!"
- Gato: "¡Miau!"
- Vaca: "¡Muu!"

- Crea una función imprimir_sonido() que reciba un objeto Animal y llame al método hacer_sonido(), demostrando el polimorfismo en acción.

**Solución**

```python
class Animal:
    def hacer_sonido(self):
        pass

class Perro(Animal):
    def hacer_sonido(self):
        return "¡Guau!"
    
class Gato(Animal):
    def hacer_sonido(self):
        return "¡Miau!"

class Vaca(Animal):
    def hacer_sonido(self):
        return "¡Muu!"
    
def imprimir_sonido(animal):
    print(animal.hacer_sonido())

perro = Perro()
gato = Gato()
vaca = Vaca()

imprimir_sonido(perro)
imprimir_sonido(gato)
imprimir_sonido(vaca)
```

## polimorfismo_adicionales4

Polimorfismo con empleados

- Crea una clase base llamada Empleado con el método trabajar(), que imprime "El empleado está trabajando".

- Crea dos clases hijas: Gerente y Programador. La clase Gerente debe sobrescribir el método trabajar() para imprimir "El gerente está supervisando", mientras que la clase Programador debe imprimir "El programador está desarrollando código".

- Crea una función mostrar_trabajo() que reciba un objeto Empleado y llame al método trabajar(), demostrando el polimorfismo.

**Solución**

```python
class Empleado:
    def trabajar(self):
        return "El empleado está trabajando"
    
class Gerente(Empleado):
    def trabajar(self):
        return "El gerente está supervisando"
    
class Programador(Empleado):
    def trabajar(self):
        return "El programador está desarrollando código"
    
def mostrar_trabajo(empleado):
    print(empleado.trabajar())

gerente = Gerente()
programador = Programador()

mostrar_trabajo(gerente)
mostrar_trabajo(programador)
```

## polimorfismo_adicionales5

Polimorfismo en dispositivos electrónicos

- Crea una clase base llamada Dispositivo con el método encender(), que imprime "El dispositivo se enciende".

- Crea dos clases hijas: Telefono y Computadora. La clase Telefono debe sobrescribir el método encender() para imprimir "El teléfono se enciende", mientras que la clase Computadora debe imprimir "La computadora se enciende".

- Crea una función activar_dispositivo() que reciba un objeto Dispositivo y llame al método encender(), demostrando el polimorfismo.

**Solución**

```python
class Dispositivo:
    def encender(self):
        return "El dispositivo se enciende"
    
class Telefono(Dispositivo):
    def encender(self):
        return "El teléfono se enciende"

class Computadora(Dispositivo):
    def encender(self):
        return "La computadora se enciende"

def activar_dispositivo(dispositivo):
    print(dispositivo.encender())

telefono = Telefono()
computadora = Computadora()

activar_dispositivo(telefono)
activar_dispositivo(computadora)
```
