# Encapsulamiento

**Encapsulamiento**
El encapsulamiento es el concepto que implica ocultar los detalles internos de una clase y exponer solo lo necesario. En Python, esto se logra mediante el uso de modificadores de acceso, como:

- Atributos públicos: son accesibles desde cualquier parte del código.

- Atributos privados: son accesibles solo desde dentro de la clase.

- Atributo protegidos: generalmente se usan para indicar que el atributo no debe ser accesible desde fuera de la clase, pero no se impide totalmente el acceso.

El encapsulamiento: permite ocultar los detalles internos de una clase y exponer solo lo necesario a través de una interfaz pública. Esto hace que el código sea más fácil de mantener y protege los datos de manipulaciones externas no deseadas. En Python, se puede indicar que un atributo o método es privado agregando dos guiones bajos antes de su nombre.

**Beneficios del encapsulamiento**
- Control sobre los datos: puedes controlar comó se accede o se modifica un atributo.

- Seguridad: puedes prevenir que los datos de un objeto se cambien de forma inapropiada.

- Mantenibilidad: al tener una interfaz bien definida (con métodos públicos), puedes cambiar la implementación interna sin afectar el código que usa la clase.

Encapsulamiento es esencial para asegurar que los objetos de una clase se usen de manera adecuada, restringiendo o controlando el acceso a sus atributos y métodos internos.

```python
# Sintaxis de encapsulamiento en Python:
# 1. Atributos públicos: no tienen ninguna convención especial
class Persona:
    def __init__(self, nombre, edad):
        self.nombre = nombre # Atriuto público
        self.edad = edad # Atributo público

# 2. Atributos privados: se denotan con dos guiones bajos (__) antes del nombre
class Persona:
    def __init__(self, nombre, edad):
        self.__nombre = nombre # Atributo privado
        self.__edad = edad # Atributo privado

# 3. Atributo protegidos: se denotan con un guion bajo (_) antes del nombre, lo que indica que no deben ser accedidos directamente
class Persona:
    def __init__(self, nombre, edad):
        self._nombre = nombre # Atributo protegido
        self._edad = edad # Atributo protegido

# 4. Uso de métodos getter y setter: para controlar el acceso a los atributos privados y permitir o restringir la modificación de esos atrubutos
class Persona:
    def __init__(self, nombre, edad):
        self.__nombre = nombre
        self.__edad = edad

    # Getter para __nombre
    def get_nombre(self):
        return self.__nombre
    
    # Setter para __nombre
    def set_nombre(self, nombre):
        self.__nombre = nombre

# Ejemplo de encapsulamiento
class Auto:
    def __init__(self, marca, modelo, año):
        # Crear dos atributos privados
        self.__marca = marca
        self.__modelo = modelo
        self.año = año

    # Para acceder a los atributos se debe crear un método público con el método get_nombreAtributo
    def get_marca(self):
        return self.__marca

    def get_modelo(self):
        return self.__modelo  

    # Para cambiar un atributo, se crea un método público con set_nombreAtributo, permitiendo acceder a un atributo privado desde un método público
    def set_marca(self, marca):
        self.__marca = marca

    def set_modelo(self, modelo):
        self.__modelo = modelo

mi_auto = Auto("Kia", "Sportage", 2023)

print(f"La marca del auto es {mi_auto.get_marca()} y el modelo es {mi_auto.get_modelo()} y el año es {mi_auto.año}")

mi_auto.set_marca("BYD")
mi_auto.set_modelo("Atto 3")

print(f"La marca del auto es {mi_auto.get_marca()} y el modelo es {mi_auto.get_modelo()} y el año es {mi_auto.año}")

# print(mi_auto.año)
# print(mi_auto.__marca)
# print(mi_auto.__modelo)
```
