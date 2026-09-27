# Ejercicios — Herencia múltiple

## herencia_multiple_adicionales1

Dispositivos Electrónicos

Crea tres clases:

- Dispositivo: tiene un método encender que imprime "Dispositivo encendido".

- Portátil: tiene un método transportar que imprime "Portátil transportado".

- Smartphone: hereda de ambas clases y agrega un método usar_red que imprime "Usando red móvil".

**Solución**

```python
class Dispositivo:
    def encender(self):
        print("Dispositivo encendido")

class Portatil:
    def transportar(self):
        print("Portátil transportado")

class Smartphone(Dispositivo, Portatil):
    def usar_red(self):
        print("Usando red móvil")

smartphone = Smartphone()

smartphone.encender()

smartphone.transportar()

smartphone.usar_red()
```

## herencia_multiple_adicionales2

Animales con habilidades

Crea tres clases:

- Animal: tiene un método comer que imprime "Este animal está comiendo".

- Volador: tiene un método volar que imprime "Este animal puede volar".

- PezVolador: hereda de ambas y puede comer y volar.

**Solución**

```python
class Animal:
    def comer(self):
        print("Este animal está comiendo")

class Volador:
    def volar(self):
        print("Este animal puede volar")

class PezVolador(Animal, Volador):
    pass

pez_volador = PezVolador()

pez_volador.comer()

pez_volador.volar()
```

## herencia_multiple_adicionales3

Vehículos Terrestres y Acuáticos

Crea tres clases:

- Vehiculo: con un método moverse que imprime "El vehículo se está moviendo".

- Terrestre: con un método usar_ruedas que imprime "Usando ruedas".

```python
    Anfibio: hereda de ambas y puede moverse y usar ruedas.
```

**Solución**

```python
class Vehiculo:
    def moverse(self):
        print("El vehículo se está moviendo")

class Terrestre:
    def usar_ruedas(self):
        print("Usando ruedas")

class Anfibio(Vehiculo, Terrestre):
    pass

coche = Anfibio()

coche.moverse()

coche.usar_ruedas()
```

## herencia_multiple_adicionales4

Empleados y Estudiantes

Crea tres clases:

- Persona: tiene un atributo nombre y un método presentarse que imprime "Hola, soy {nombre}".

- Empleado: tiene un método trabajar que imprime "Estoy trabajando".

- Estudiante: hereda de ambas clases y puede presentarse, trabajar y estudiar.

**Solución**

```python
class Persona:
    def __init__(self, nombre):
        self.nombre = nombre

    def presentarse(self):
        print(f"Hola, soy {self.nombre}")
    
class Empleado:
    def trabajar(self):
        print("Estoy trabajando")

class Estudiante(Persona, Empleado):
    def estudiar(self):
        print("Estoy estudiando")

estudiante = Estudiante("Jeiron")

estudiante.presentarse()

estudiante.trabajar()

estudiante.estudiar()
```

## herencia_multiple_adicionales5

Electrodomésticos

Crea tres clases:

- Electrodomestico: tiene un método usar que imprime "Usando electrodoméstico".

- Refrigerador: tiene un método enfriar que imprime "Enfriando alimentos".

- Lavadora: tiene un método lavar que imprime "Lavando ropa".

- Crea una clase Combi que herede de Refrigerador y Lavadora.

**Solución**

```python
class Electrodomestico:
    def usar(self):
        print("Usando electrodoméstico")

class Refrigerador(Electrodomestico):
    def enfriar(self):
        print("Enfriando alimentos")

class Lavadora(Electrodomestico):
    def lavar(self):
        print("Lavando ropa")

class Combi(Refrigerador, Lavadora):
    pass

combi = Combi()

combi.usar()

combi.enfriar()

combi.lavar()
```
