# Ejercicios — Encapsulamiento

## encapsulamiento_adicionales1

Atributos privados con métodos getter y setter

- Crea una clase Coche con los siguientes atributos privados:
- marca
- modelo
- año

- Implementa los métodos getter y setter para cada uno de estos atributos.

- Agrega una validación en el setter para el atributo año, asegurando que solo se pueda establecer un valor mayor que 1900.

**Solución**

```python
class Coche:
    def __init__(self, marca, modelo, anio):
        self.__marca = marca
        self.__modelo = modelo
        self.__anio = None
        self.set_anio(anio)

    def get_marca(self):
        return self.__marca
    
    def set_marca(self, marca):
        self.__marca = marca

    def get_modelo(self):
        return self.__modelo
    
    def set_modelo(self, modelo):
        self.__modelo = modelo
    
    def get_anio(self):
        return self.__anio
    
    def set_anio(self, anio):
        if anio > 1900:
            self.__anio = anio
        else:
            print("Error: El año debe ser mayor que 1900.")

mi_coche = Coche("Toyota", "Corolla", 2022)
print(f"Marca: {mi_coche.get_marca()}")
print(f"Modelo: {mi_coche.get_modelo()}")
print(f"Año: {mi_coche.get_anio()}")

mi_coche.set_anio(1900)

print(f"Año después del intento de cambio: {mi_coche.get_anio()}")
```

## encapsulamiento_adicionales2

Control de acceso a edad

- Crea una clase Empleado con los siguientes atributos privados:
- nombre
- edad
- salario

- Implementa los métodos getter y setter para cada atributo.

- En el setter de edad, asegúrate de que no se pueda establecer un valor menor que 18.

- En el setter de salario, asegúrate de que el salario no sea negativo.

**Solución**

```python
class Empleado:
    def __init__(self, nombre, edad, salario):
        self.__nombre = nombre
        self.__edad = edad
        self.__salario = salario

    def get_nombre(self):
        return self.__nombre
    
    def set_nombre(self, nombre):
        self.__nombre = nombre

    def get_edad(self):
        return self.__edad
    
    def set_edad(self, edad):
        if edad >= 18:
            self.__edad = edad
        else:
            print("Debe ser mayor de edad.")

    def get_salario(self):
        return self.__salario
    
    def set_salario(self, salario):
        self.__salario = salario

empleado = Empleado("Jeiron", 21, 50000)

print(f"Nombre: {empleado.get_nombre()}")
print(f"Edad: {empleado.get_edad()}")
print(f"Salario: {empleado.get_salario()}")

empleado.set_edad(17)

print(f"Edad después del intento de cambio: {empleado.get_edad()}")
```

## encapsulamiento_adicionales3

Encapsulamiento en una clase de cuenta bancaria

- Crea una clase CuentaBancaria que tenga los siguientes atributos privados:
- titular (nombre del titular de la cuenta)
- saldo

- Implementa los métodos getter y setter para los atributos.

- Añade un método depositar() que permita añadir dinero a la cuenta, pero solo si el monto es positivo.

- Añade un método retirar() que permita retirar dinero de la cuenta, pero solo si el saldo es suficiente.

**Solución**

```python
class CuentaBancaria:
    def __init__(self, titular, saldo=0):
        self.__titular = titular
        self.__saldo = saldo

    def get_titular(self):
        return self.__titular
    
    def set_titular(self, titular):
        self.__titular = titular
    
    def get_saldo(self):
        return self.__saldo
    
    def set_saldo(self, saldo):
        self.__saldo = saldo

    def depositar(self, monto):
        if monto > 0:
            self.__saldo += monto
            print(f"Se ha depositado {monto}. Nuevo saldo: {self.__saldo}")
        else:
            print("Error: El monto a depositar debe ser mayor a 0.")
    
    def retirar(self, monto):
        if monto > 0:
            if self.__saldo >= monto:
                self.__saldo -= monto
                print(f"{self.__titular}, usted ha retirado {monto} de su cuenta. Nuevo saldo: {self.__saldo}.")
            else:
                print(f"Error: {self.__titular}, usted no cuenta con saldo suficiente para realizar el retiro")
        else:
            print(f"Error: El monto a retirar deber ser mayor a 0.")

cuenta = CuentaBancaria("Jeiron Espinal", 50000)

print(f"Titular: {cuenta.get_titular()}. Saldo: {cuenta.get_saldo()}")

cuenta.depositar(10000)

cuenta.depositar(0)

cuenta.retirar(30000)

cuenta.retirar(40000)

cuenta.retirar(0)
```

## encapsulamiento_adicionales4

Clase de estudiante con validación de notas

- Crea una clase Estudiante con los siguientes atributos privados:
- nombre
- nota

- Implementa métodos getter y setter.

- En el setter de nota, asegúrate de que la nota esté entre 0 y 100. Si la nota está fuera de este rango, muestra un mensaje de error.

**Solución**

```python
class Estudiante:
    def __init__(self, nombre, nota=0):
        self.__nombre = nombre
        self.__nota = nota

    def get_nombre(self):
        return self.__nombre
    
    def set_nombre(self, nombre):
        self.__nombre = nombre
    
    def get_nota(self):
        return self.__nota
    
    def set_nota(self, nota):
        if nota >= 0 and nota <= 100:
            self.__nota = nota
        else:
            print("Error: La nota está fuera de rango.")
    
estudiante = Estudiante("Jeiron", 90)

print(f"El estudiante {estudiante.get_nombre()} obtuvo la nota de {estudiante.get_nota()}.")

estudiante.set_nota(101)

print(F"La nota después del intento de cambio: {estudiante.get_nota()}")
```

## encapsulamiento_adicionales5

Empleado con un aumento de salario

- Crea una clase Empleado con los siguientes atributos privados:
- nombre
- salario

- Implementa los métodos getter y setter para estos atributos.

- Crea un método aumentar_salario() que aumente el salario en un porcentaje específico, pero asegúrate de que el salario no sea inferior a un valor mínimo (por ejemplo, 1000).

**Solución**

```python
class Empleado:
    def __init__(self, nombre, salario):
        self.__nombre = nombre
        self.__salario = salario

    def get_nombre(self):
        return self.__nombre
    
    def set_nombre(self, nombre):
        self.__nombre = nombre

    def get_salario(self):
        return self.__salario

    def set_salario(self, salario):
        if salario >= 1000:
            self.__salario = salario
        else:
            print("Error: El salario no puede ser inferior a 1000.")

    def aumentar_salario(self, porcentaje):
        aumento = self.__salario * (porcentaje / 100)
        nuevo_salario = self.__salario + aumento

        if nuevo_salario < 1000:
            self.__salario = 1000
        else:
            self.__salario = nuevo_salario

empleado = Empleado("Jeiron", 50000)

print(f"Salario de {empleado.get_nombre()}: {empleado.get_salario()}")

empleado.aumentar_salario(15)

print(f"Salaraio después del aumento: {empleado.get_salario()}")

empleado.set_salario(800)
```
