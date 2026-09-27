# Herencia múltiple

**" Herencia múltiple**
La herencia múltiple ocurre cuando una clase hereda de más de una clase base. En Python, se permite heredar de múltiples clases, y esto se logra especificando varias clases base entre paréntesis al definir la clase derivada.

Herencia múltiple: Se refiere a la posibilidad de crear una clase a partir de múltiples clases superiores.

**Sintaxis**

```python
class Hm1:
    # Métodos y atributos de la clase Hm1
    pass

class Hm2:
    # Métodos y atributos de la clase Hm2
    pass

class DerivadoMultiples(Hm1, Hm2)
    # Métodos y atributos adicionales de la ClaseDerivada
    pass
```

Herencia multinivel: Las características de la clase base y de las clases derivadas se heredan en una nueva clase derivada, formando una cadena de herencia.

**Sintaxis**

```python
class Base:
    pass

class Derivado1(Base):
    pass

class Derivado2(Derivado1):
    pass
```

**Orden de resolución de métodos (MRO)**
Python utiliza el algoritmo C3 Linearization para determinar el orden en el que se buscan los métodos en una jerarquía de herencia múltiple. Este orden puede consultarse utilizando el atributo especial __mro__ o el método help().

**Ejemplo**

```python
print(Perro.__mro__)
```

**Ventajas de la herencia múltiple**
1. Reutilización de código: puedes combinar funcionalidades de diferentes clases base.

- **2.** Flexibilidad: permite modelar objetos complejos que comparten comportamientos de múltiples clases.

**Desafios de la herencia múltiple**
1. Confusión: puede generar conflitos si las clases base tienen métodos o atributos con el mismo nombre.

- **2.** Complejidad: es más difícil de entender y mantener que la herencia simple.

```python
# Ejemplo 1 de herencia múltiple
# En este ejemplo, la clase Perro hereda métodos tanto de Animal como de Mascota.
class Animal:
    def sonido(self):
        return "Sonido de un animal"
    
class Mascota:
    def tipo(self):
        return "Es una mascota"
    
class Perro(Animal, Mascota):
    def sonido(self):
        return "Ladra"
    
# Crear un obejto de la clase Perro
mi_perro = Perro()
print(mi_perro.sonido()) # Salida: Ladra
print(mi_perro.tipo()) # Salida: Es una mascota

# Ejemplo 2 de herencia múltiple
# Crear una clase
class Telefono:
    # Definir constructor
    def __init__(self):
        pass

    # Crear acciones o métodos
    def llamar(self):
        print("Llamando...")

    def ocupado(self):
        print("Ocupado...")

class Camara:
    def __init__(self):
        pass

    def fotografia(self):
        print("Tomando fotos...")

class Reproduccion:
    def __init__(self):
        pass

    def reproduccion_musica(self):
        print("Reproduciendo música...")

    def reproduccion_video(self):
        print("Reproduciendo video...")

class Smartphone(Telefono, Camara, Reproduccion):
    # El método __del__ se utiliza para limpiar los recursos
    def __del__(self):
        print("Teléfono apagado!")

# Crear un objeto
movil = Smartphone()

# Llamar al método ocupado
movil.ocupado()
```
