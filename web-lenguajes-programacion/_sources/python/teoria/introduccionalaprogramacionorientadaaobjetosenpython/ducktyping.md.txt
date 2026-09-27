# Duck typing

**Duck Typing**
El duck Typing es un concepto en programación que se basa en la idea de que, en lugar de verificar el tipo exacto de un objeto, se verifica si tiene los métodos y los atributos esperados. La expresión "Si camina como un pato, nada como un pato y suena como un pato, entonces es un pato" resume la idea del Duck Typing.

En Python, no es necesario declarar explícitamente el tipo de una variable o una clase. Lo que importa es si un objeto tiene los métodos o atributos que se esperan de él. Esto permite mayor flexibilidad y la creación de código más genérico y reutilizable.

Duck Typing: Le da al programador la capacidad de no preocuparse por el tipo de clase, siempre y cuando implemente la operación necesaria.

Al usarlo, no se verifica el tipo. En su lugar, se verifica la presencia del método o atributo. Este proceso está relacionado con el dynamic typing.

**Ventajas del Duck Typing**
1. Flexibilidad: no es necesario que los objetos pertenezcan a una clase específica, solo deben tener los métodos y atributos necesarios.

- **2.** Mayor compatibilidad: puedes usar objetos de diferentes tipos en las mismas funciones, siempre y cuando implementen los métodos que necesitas.

- **3.** Menos restricciones: en lugar de trabajar con una jerarquía de clases rígida, puedes crear código más abierto y adaptable.

**Desventajas del Duck Typing**
1. Posibles errores en tiempo de ejecución: si un objeto no tiene el método esperado, se producirá un error cuando se intente acceder a él.

- **2.** Dificultad para el mantenimiento: puedes ser más difícil comprender y mantener el código si no se tienen claras las espectativas de los tipos de los objetos.

**Conclusión sobre el Duck Typing**
El Duck Typing permite escrinir código flexible y reutilizable en Python. Aprovechar este concepto puede mejorar la adaptabilidad del código, aunque debes tener cuidado con los errores que podrían surgir si los objetos no implementan los métodos o atributos esperados.

```python
# Ejemplo básico de Duck Typing
""" En este ejemplo, tanto Pato como Perro tienen un método llamado hablar, lo que permite que la función hacer_hablar funcione correctamente con ambos, aunque Pato y Perro son tipos diferentes. """
class Pato:
    def hablar(self):
        return "Cuac Cuac"

class Perro:
    def hablar(self):
        return "Guau Guau"

# Función que espera un objeto que pueda 'hablar'
def hacer_hablar(animal):
    print(animal.hablar())

# Crear instancias de Pato y Perro
pato = Pato()
perro = Perro()

# Ambos pueden 'hablar', aunque no son del mismo tipo
hacer_hablar(pato) # Cuac Cuac
hacer_hablar(perro) # Guau Guau

# Crear clases diferentes con métodos con el mismo nombre
class Perro:
    def moverse(self):
        print('Caminando')

class Delfin:
    def moverse(self):
        print('Nadando')

class Serpiente:
    def moverse(self):
        print('Reptando')

# Crear una clase que no comparte ese método
class Automovil:
    def avanzar(self):
        print('Rodando')

# Crear la clase que funcionará con cualquiera que implemente el método moverse
class Animal:
    def __init__(self, miAnimal):
        self.miAnimal = miAnimal
        self.miAnimal.moverse()

    def accion(self):
        self.miAnimal.moverse()

# Hacer uso de la clase Animal pasando las clases sin que nos importe el tipo, solo que implementen el método moverse
Animal(Perro())
Animal(Delfin())
Animal(Serpiente())

# Ejemplo de uso adicional
miMascota = Animal(Serpiente())
miMascota.accion()
```
