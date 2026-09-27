# Super

**Super**
La función super() se utiliza para llamar a métodos de una clase base desde una clase derivada. Es especialmente útil en la herencia, donde una clase hija necesita llamar a un método de su clase base para extender o modificar su comportamiento sin sobrescribirlo completamente.

**Explicación de super()**
- super().init(): llama al método __init__ de la clase base, lo que permite ejecutar el código de inicialización de la clase base antes de ejecutar el código adicional de la clase derivada.

- super().metodo(): llama al método metodo de la clase base, permitiendo que se ejecute el código original antes de ejecutar cualquier lógica adicional en la clase derivada.

**Uso típico de super()**
1. En el constructor (__init__): cuando tienes una clase base que incializa atributos importantes y quieres asegurarte de que los atributos de la clase base también se inicialicen en la clase derivada.

- **2.** Llamada a métodos: para extender el comportamiento de un método de la clase base sin sobrescribirlo completamente.

**Ventajas de usar super()**
1. Mejora la reutilización del código: evita la necesidad de repetir el mismo código de la clase base en la clase derivada.

- **2.** Facilita la herencia múltiple: en el case de la herencia múltiple, super() ayuda a resolver el orden de resolución de métodos (MRO- Method Resolution Order) correctamente.

- **3.** Hace el código más limpio y mantenible: usar super() mejora la claridad del código y lo hace más fácil de mantener, especialmente en jerarquías de clases más complejas.

```python
# Super(): Modifica un método sin que se elimine el método anterior
class ClaseBase:
    def __init__(self):
        print("Constructor de la clase base")
    
    def metodo(self):
        print("Método de la clase base")

class ClaseDerivada(ClaseBase):
    def __init__(self):
        # Crear un método super, para mantener el método/constructor anterior
        super().__init__()  # Llamada al constructor de la clase base
        print("Método __init__ de la clase derivada")
    
    def metodo(self):
        super().metodo()  # Llamada al método de la clase base
        print("Método de la clase derivada")

# Crear un objeto de la clase derivada
objeto = ClaseDerivada()
objeto.metodo()
```
