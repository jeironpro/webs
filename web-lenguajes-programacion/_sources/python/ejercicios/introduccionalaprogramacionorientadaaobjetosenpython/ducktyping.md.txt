# Ejercicios — Ducktyping

## duck_typing_adicionales1

Función de saludo

Crea una función llamada saludar que reciba un objeto y llame a un método saludar() del objeto. Si el objeto tiene un método saludar, la función debe imprimir "Hola, [nombre]!". Si no tiene el método, debe imprimir un mensaje de error. Crea dos clases: Persona (con el método saludar) y ObjetoGenérico (sin el método saludar), y prueba la función con ambas.

**Solución**

```python
def saludar(objeto):
    if hasattr(objeto, 'saludar'):
        print(f"Hola, {objeto.saludar()}")
    else:
        print("Error: El objeto no tiene el método saludar.")

class Persona:
    def __init__(self, nombre):
        self.nombre = nombre

    def saludar(self):
        return self.nombre
    
class ObjetoGenérico:
    def __init__(self, descripcion):
        self.descripcion = descripcion

persona = Persona("Jeiron")
objeto_generico = ObjetoGenérico("Objeto sin saludo")

saludar(persona)
saludar(objeto_generico)
```

## duck_typing_adicionales2

Operación aritmética

Crea una función llamada realizar_operacion que reciba dos objetos y realice la operación + entre ellos. Para ello, ambos objetos deben tener el método sumar(). Si uno de los objetos no tiene este método, debe imprimir un mensaje de error. Crea dos clases: Numero (con el método sumar) y Texto (sin el método sumar) para probar el código.

**Solución**

```python
def realizar_operacion(objeto1, objeto2):
    if hasattr(objeto1, 'sumar') and hasattr(objeto2, 'sumar'):
        resultado = objeto1.sumar(objeto2)
        print(f"El resultado de la operación es: {resultado}")
    else:
        print("Error: Uno o ambos objetos no tienen el método sumar.")

class Numero:
    def __init__(self, valor):
        self.valor = valor

    def sumar(self, otro_objeto):
        return self.valor + otro_objeto.valor
    
class Texto:
    def __init__(self, contenido):
        self.contenido = contenido

numero1 = Numero(5)
numero2 = Numero(10)
texto = Texto("Hola")

realizar_operacion(numero1, numero2)
realizar_operacion(numero1, texto)
```

## duck_typing_adicionales3

Reproducción de sonido

Crea una función llamada reproducir_sonido que reciba un objeto y lo haga "sonar". Si el objeto tiene el método hacer_sonido(), la función debe llamarlo. Crea dos clases: Guitarra (con el método hacer_sonido) y Tambor (con el método hacer_sonido), y prueba la función con ambas. También prueba con una clase Silla que no tenga el método hacer_sonido.

**Solución**

```python
def reproducir_sonido(objeto):
    if hasattr(objeto, 'hacer_sonido'):
        objeto.hacer_sonido()
    else:
        print("Error: El objeto no tiene el método hacer_sonido.")

class Guitarra:
    def hacer_sonido(self):
        print("La guitarra está sonando: ¡Strum strum!")

class Tambor:
    def hacer_sonido(self):
        print("El tambor está sonando: ¡Boom boom!")

class Silla:
    def __init__(self):
        print("Soy una silla, no hago sonido.")

guitarra = Guitarra()
tambor = Tambor()
silla = Silla()

reproducir_sonido(guitarra)
reproducir_sonido(tambor)
reproducir_sonido(silla)
```

## duck_typing_adicionales4

Dibujar formas

Crea una función llamada dibujar_forma que reciba un objeto y lo dibuje. Si el objeto tiene un método dibujar(), debe llamarlo. Crea una clase Círculo (con el método dibujar) y una clase Cuadrado (con el método dibujar), y prueba la función con ambas. Además, prueba con una clase Triángulo que no tenga el método dibujar.

**Solución**

```python
def dibujar_forma(objeto):
    if hasattr(objeto, 'dibujar'):
        objeto.dibujar()
    else:
        print("Error: El objeto no tiene el método dibujar.")

class Circulo:
    def dibujar(self):
        print("Dibujando un círculo.")

class Cuadrado:
    def dibujar(self):
        print("Dibujando un cuadrado.")

class Triangulo:
    def __init__(self):
        print("Soy un triángulo, pero no puedo dibujar.")

circulo = Circulo()
cuadrado = Cuadrado()
triangulo = Triangulo()

dibujar_forma(circulo)
dibujar_forma(cuadrado)
dibujar_forma(triangulo)
```

## duck_typing_adicionales5

Función para medir el área

Crea una función llamada calcular_area que reciba un objeto y calcule el área. El objeto debe tener un método area(). Crea dos clases: Rectángulo (con el método area) y Círculo (con el método area), y prueba la función con ambas. Luego, prueba con una clase Carro que no tenga el método area.

**Solución**

```python
import math

def calcular_area(objeto):
    if hasattr(objeto, 'area'):
        return objeto.area()
    else:
        print("Error: El objeto no tiene el método area.")
        return None

class Rectangulo:
    def __init__(self, largo, ancho):
        self.largo = largo
        self.ancho = ancho

    def area(self):
        return self.largo * self.ancho

class Circulo:
    def __init__(self, radio):
        self.radio = radio

    def area(self):
        return math.pi * self.radio ** 2

class Carro:
    def __init__(self, modelo):
        self.modelo = modelo

rectangulo = Rectangulo(5, 3)
circulo = Circulo(4)
carro = Carro("Toyota")

print(f"Área del rectángulo: {calcular_area(rectangulo)}")
print(f"Área del círculo: {calcular_area(circulo)}")
print(f"Área del carro: {calcular_area(carro)}")
```
