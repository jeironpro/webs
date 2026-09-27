# Ejercicios — Introduccion POO

**Solución**

```python
# Definir la clase Persona
class Persona:
    def __init__(self, nombre, edad):
        self.nombre = nombre
        self.edad = edad

    def saludar(self):
        print(f"¡Hola! Soy {self.nombre} y tengo {self.edad} años.")

# Crear un objeto de la clase Persona
persona1 = Persona("Jeiron", 21)

# Llamar al método saludar del objeto persona1
persona1.saludar() # Salida: ¡Hola! Soy Jeiron y tengo 21 años.
```
