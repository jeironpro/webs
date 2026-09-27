# Sobrecarga de métodos

**Sobrecarga de métodos**
En algunos lenguajes de programación como Java o C++, la sobrecarga de métodos permite que dos o más métodos dentro de la misma clase tengan el mismo nombre, pero diferentes parámetros. Sin embargo, en Python, la sobrecarga de métodos no funciona de forma directa, ya que un método definido más recientemente con el mismo nombre sobrescribe al anterior.

**En Python, la sobrecarga de métodos se logra utilizando**
1. Valores predeterminados en los parámetros.

- **2.** Args y kwargs para aceptar un número variable de argumentos.

Sobrecarga de métodos: cuando heredamos métodos, en muchas ocasiones estos quedan obsoletos, por lo que deben ser actualizados. Sin embargo, si realizamos los cambios directamente en el método de la clase padre, podríamos romper el programa si dicho método estaba siendo utilizado por las clases hijas.

Para resolver esta situación, se crea un nuevo método dentro de la clase hija con los requisitos actualizados. La sobrecarga de métodos nos permite utilizar el mismo nombre del método que está en la clase padre, pero modificando los argumentos que recibe y cambiando el procesamiento de los datos que devuelve.

**Ventajas de la sobrecarga de métodos en Python**
- Hace que el código sea más flexible y reutilizable.

- Permite manejar diferentes casos con un solo método en lugar de múltiples métodos.

```python
# Ejemplo 1 de sobrecarga
class Calculadora:
    # Este método admite diferentes números como parámetros
    def suma(self, a = None, b = None, c = None):
        # La lógica interna comprueba qué parámetros se proporcionan y actúa en consecuencia.
        if a is not None and b is not None and c is not None:
            return a + b + c
        elif a is not None and b is not None:
            return a + b
        else:
            return "Proporciona al menos dos números"

# Crear objeto
calc = Calculadora()

# Llamar al método con diferentes argumentos
print(calc.suma(5, 3)) # 8
print(calc.suma(5, 3, 2)) # 10
print(calc.suma(5)) # Proporciona al menos dos números

# Ejemplo 2 de sobrecarga
# Crear la clase Persona
class Persona:
    def __init__(self, nombre: str, edad: int):
        self.nombre = nombre
        self.__edad = edad

    # Crear una función llamada get_datos()
    def get_datos(self):
        return f"El nombre de la persona es {self.nombre} y tiene {self.__edad} años de edad."
    
    # Para acceder a un valor privado, creamos una función dentro del elemento padre
    def get_edad(self):
        return self.__edad
    
# Crear una clase Empleado que hereda de Persona
class Empleado(Persona):
    def __init__(self, nombre: str, edad: int):
        super().__init__(nombre, edad)
        self.calificacion = "*****"

    # Sobrecargar el método get_datos()
    def get_datos(self):
        return f"El nombre del empleado es {self.nombre} y tiene {self.get_edad()} años. Su calificación es de {self.calificacion} estrellas."

# Función principal
def main():
    jeiron = Persona("Jeiron", 20)
    print(jeiron.get_datos())

    ariel = Empleado("Ariel", 23)
    print(ariel.get_datos())

main()
```
