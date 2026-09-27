# Polimorfismo

**Polimorfismo**
El polimorfismo es otro pilar fundamental de la Programación Orientada a Objetos (POO) y se refiere a la capacidad de un objeto de tomar muchas formas. En términos simples, el polimorfismo permite que diferentes clases tengan métodos con el mismo nombre, pero cada uno de estos métodos puede comportarse de manera diferente según la clase que lo implemente.

**El polimorfismo puede manifestarse de dos formas**
1. Polimorfismo de sobrecarga: aunque Python no soporta la sobrecarga de métodos en el sentido tradicional (como en otros lenguajes), se puede simular mediante el uso de argumentos por defecto o la comprobación del tipo de argumento.

- **2.** Polimorfismo de sustitución_ ocurre cuando un objeto de una clase hija puede ser utilizado en lugar de un objeto de la clase base, y su comportamiento específico es ejecutado.

Polimorfismo: permite utilizar diferentes objetos de manera intercambiable, siempre que compartan una interfaz común.

**Explicación del ejemplo**
- El método hablar() está definido en la clase base Animal, pero no tiene implementación.

- Las clases hijas Perro y Gato sobrescriben este método y proporcionan su propia implementación.

- El polimorfismo permite que, sin importar el tipo de objeto (Perro o Gato), el mismo método hablar() se ejecute correctamente según el tipo de objeto que se pase a la función escuchar_animal().

**Beneficios del polimorfismo**
- Flexibilidad y extensibilidad: puedes crear sistemas más flexibles y extensibles, donde diferentes clases pueden compartir la misma interfaz pero comportarse de manera diferente.

- Código más limpio y reutilizable: al utilizar métodos comunes en diferentes clases, puedes escribir código más limpio y reutilizable.

- Facilita el mantenimiento: puedes cambiar el comportamiento de un método en una clase hija sin afectar a otras clases que utilicen ese mismo método.

```python
# Ejemplo de polimorfismo con sobrescritura de métodos:
# En este caso, tenemos una clase base Animal y varias clases hijas como Perro y Gato, donde el método hablar() es sobrescrito en cada una de las clases hijas.
# Clase base
class Animal:
    def hablar(self):
        pass

# Clase hija Perro
class Perro(Animal):
    def hablar(self):
        return "¡Guau Guau!"

# Clase hija Gato
class Gato(Animal):
    def hablar(self):
        return "¡Miau Miau!"

# Como ambas clases (Perro y Gato) comparten el mismo método hablar(), creamos una función llamada escuchar_animal que acepta un objeto, no una clase.
def escuchar_animal(animal):
    print(animal.hablar())

perro = Perro()
gato = Gato()

escuchar_animal(perro)
escuchar_animal(gato)
```
