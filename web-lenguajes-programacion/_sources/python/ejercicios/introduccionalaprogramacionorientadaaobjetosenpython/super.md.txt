# Ejercicios — Super

## super_adicionales1

Herencia con super()

Crea dos clases:

- Vehiculo: tiene un método informacion que imprime "Este es un vehículo".

- Coche: hereda de Vehiculo y redefine el método informacion para imprimir "Este es un coche". Utiliza super() para llamar al método informacion de la clase base.

Objetivo: Cuando crees un objeto de la clase Coche, el método informacion debe llamar a la clase base y luego imprimir información adicional de la clase derivada.

**Solución**

```python
class Vehiculo:
    def informacion(self):
        print("Este es un vehículo")
    
class Coche(Vehiculo):
    def informacion(self):
        super().informacion()
        print("Este es un coche")

coche = Coche()

coche.informacion()
```

## super_adicionales2

Constructor con super()

Crea dos clases:

- Empleado: tiene un método __init__ que inicializa nombre y edad y lo imprime.

- Gerente: hereda de Empleado y añade un atributo departamento. Usa super() para llamar al constructor de Empleado y luego inicializa el atributo departamento.

Objetivo: Al crear un objeto de la clase Gerente, debe imprimir los valores de nombre, edad y departamento.

**Solución**

```python
class Empleado:
    def __init__(self, nombre, edad):
        self.nombre = nombre
        self.edad = edad
        print(f"Empleado: Nombre: {self.nombre} - Edad: {self.edad}")

class Gerente(Empleado):
    def __init__(self, nombre, edad, departamento):
        super().__init__(nombre, edad)
        self.departamento = departamento
        print(f"Gerente: Departamento = {self.departamento}")

gerente = Gerente("Jeiron", 45, "Ventas")
```

## super_adicionales3

Herencia Múltiple con super()

Crea tres clases:

- Animal: tiene un método comer que imprime "Comiendo".

- Mamifero: tiene un método mamar que imprime "Mamando".

- Perro: hereda de Animal y Mamifero, y redefine el método comer para imprimir "El perro está comiendo". Usa super() para llamar al método comer de la clase base.

Objetivo: Cuando crees un objeto de la clase Perro, el método comer debe ejecutar el comportamiento de la clase base y luego mostrar el comportamiento adicional.

**Solución**

```python
class Animal:
    def comer(self):
        print("Comiendo")
    
class Mamifero:
    def mamar(self):
        print("Mamando")
    
class Perro(Animal, Mamifero):
    def comer(self):
        super().comer()
        print("El perro está comiendo")

coral = Perro()

coral.comer()
```

## super_adicionales4

Herencia y super() con Métodos

Crea dos clases:

- Figura: tiene un método area que imprime "Calculando el área".

- Cuadrado: hereda de Figura y redefine el método area para calcular el área del cuadrado. Usa super() para llamar al método de la clase base.

Objetivo: Al crear un objeto de la clase Cuadrado, el método area debe llamar al método de la clase base y luego calcular el área de un cuadrado.

**Solución**

```python
class Figura:
    def area(self):
        print("Calculando el área")
    
class Cuadrado(Figura):
    def __init__(self, lado):
        self.lado = lado

    def area(self):
        super().area()
        return self.lado * self.lado

cuadrado = Cuadrado(5)

print(f"El área del cuadrado es: {cuadrado.area()}")
```

## super_adicionales5

super() en Herencia Múltiple con Métodos

Crea tres clases:

- Persona: tiene un método saludar que imprime "Hola, soy una persona".

- Estudiante: tiene un método estudiar que imprime "Estoy estudiando".

- EstudianteDeIngenieria: hereda de Persona y Estudiante, y redefine el método saludar para imprimir "Hola, soy un estudiante de ingeniería". Usa super() para llamar al método saludar de la clase base.

Objetivo: Cuando crees un objeto de la clase EstudianteDeIngenieria, el método saludar debe mostrar el saludo adecuado, llamando a las clases base.

**Solución**

```python
class Persona:
    def saludar(self):
        print("Hola, soy una persona")

class Estudiante:
    def estudiar(self):
        print("Estoy estudiando")

class EstudianteDeIngenieria(Persona, Estudiante):
    def saludar(self):
        super().saludar()
        print("Hola, soy un estudiante de ingeniería")

estudiante = EstudianteDeIngenieria()

estudiante.saludar()
```
