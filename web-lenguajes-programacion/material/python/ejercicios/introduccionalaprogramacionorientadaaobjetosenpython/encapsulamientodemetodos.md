# Ejercicios — Encapsulamiento de métodos

## encapsulamiento_de_metodos_adicionales1

Atributos privados y métodos getter/setter

Crea una clase Coche con el atributo privado __velocidad que representa la velocidad del coche. Implementa un método getter llamado get_velocidad() para obtener el valor de __velocidad y un método setter llamado set_velocidad() para actualizar la velocidad, asegurando que no pueda ser negativa. Luego, crea una instancia de Coche y prueba los métodos getter y setter.

**Solución**

```python
class Coche:
    def __init__(self, velocidad=0):
        self.__velocidad = velocidad

    def get_velocidad(self):
        return self.__velocidad
    
    def set_velocidad(self, velocidad):
        if velocidad >= 0:
            self.__velocidad = velocidad
        else:
            print("La velocidad debe ser mayor o igual a 0")

coche = Coche()

print(f"La velocidad inicial del coche es: {coche.get_velocidad()} km/h")

coche.set_velocidad(100)
print(f"La nueva velocidad del coche es: {coche.get_velocidad()} km/h")

coche.set_velocidad(-10)
print(f"Después de intentar establecer una velocidad negativa, la velocidad es: {coche.get_velocidad()} km/h")
```

## encapsulamiento_de_metodos_adicionales2

Métodos públicos y privados

Crea una clase CuentaBancaria con los siguientes atributos privados: __saldo y __titular. Implementa un método público llamado depositar() que aumente el saldo y otro método público llamado retirar() que disminuya el saldo. Además, implementa un método privado __calcular_comision() que calcule una comisión de 1% al retirar dinero. Asegúrate de que el saldo nunca se vuelva negativo.

**Solución**

```python
class CuentaBancaria:
    def __init__(self, titular, saldo=0):
        self.__titular = titular
        self.__saldo = saldo

    def depositar(self, monto):
        if monto > 0:
            self.__saldo += monto
            print(f"Se ha depositado {monto}. Nuevo saldo: {self.__saldo}")
        else:
            print("Error: El monto a depositar debe ser mayor a 0.")

    def retirar(self, monto):
        if monto > 0:
            comision = self.__calcular_comision(monto)
            total_retiro = monto + comision
            if total_retiro <= self.__saldo:
                self.__saldo -= total_retiro
                print(f"Se ha retirado {monto} de su cuenta. Comisión: {comision}. Nuevo saldo: {self.__saldo}.")
            else:
                print(f"Error: Usted no cuenta con saldo suficiente para realizar el retiro")
        else:
            print(f"Error: El monto a retirar deber ser mayor a 0.")

    def __calcular_comision(self, monto):
        return monto * 0.01
    
    def consultar_saldo(self):
        return self.__saldo
    
cuenta = CuentaBancaria("Jeiron Espinal", 50000)

cuenta.depositar(10000)
cuenta.retirar(20000)
print(f"Saldo actual: {cuenta.consultar_saldo()}.") 

cuenta.retirar(50000)
```

## encapsulamiento_de_metodos_adicionales3

Control de acceso con setters

Crea una clase Producto con el atributo privado __precio. Implementa un método setter que verifique que el precio no sea negativo y otro getter para obtener el valor del precio. Crea una instancia de la clase y prueba los métodos setter y getter para asegurarte de que el precio no pueda ser negativo.

**Solución**

```python
class Producto:
    def __init__(self, precio=0):
        self.__precio = 0
        self.set_precio(precio)

    def get_precio(self):
        return self.__precio
    
    def set_precio(self, precio):
        if precio > 0:
            self.__precio = precio
            print(f"El precio se ha establecido en {self.__precio}.")
        else:
            print("Error: El precio debe ser mayor a 0")

producto = Producto(100)
print(f"Precio: {producto.get_precio()}.")

producto.set_precio(50)
print(f"Nuevo precio: {producto.get_precio()}.")

producto.set_precio(-10)
print(f"Precio final: {producto.get_precio()}.")
```

## encapsulamiento_de_metodos_adicionales4

Herencia y encapsulamiento

Crea una clase base Empleado con el atributo privado __nombre y un método público mostrar_nombre() que devuelva el nombre del empleado. Luego, crea una clase derivada Gerente que herede de Empleado y tenga el atributo privado __departamento. Implementa un método público mostrar_departamento() que devuelva el departamento del gerente. Asegúrate de que el atributo __nombre siga siendo privado en la clase base y no pueda ser modificado directamente desde la clase derivada.

**Solución**

```python
class Empleado:
    def __init__(self, nombre):
        self.__nombre = nombre
    
    def mostrar_nombre(self):
        return self.__nombre
    
class Gerente(Empleado):
    def __init__(self, nombre, departamento):
        super().__init__(nombre)
        self.__departamento = departamento

    def mostrar_departamento(self):
        return self.__departamento

gerente = Gerente("Jeiron", "Recursos Humanos")

print(f"Nombre del gerente: {gerente.mostrar_nombre()}")

print(f"Departamento del gerente: {gerente.mostrar_departamento()}")
```

## encapsulamiento_de_metodos_adicionales5

Encapsulamiento con métodos especiales

Crea una clase Producto con el atributo privado __precio. Implementa el método especial __str__() para que, al imprimir un objeto de tipo Producto, se muestre el precio en un formato adecuado. Asegúrate de que el precio sea privado y no se acceda directamente desde fuera de la clase.

**Solución**

```python
class Producto:
    def __init__(self, precio):
        if precio < 0:
            raise ValueError("El precio no puede ser negativo.")
        self.__precio = precio
    
    def get_precio(self):
        return self.__precio
    
    def set_precio(self, precio):
        if precio < 0:
            raise ValueError("El precio no puede ser negativo.")
        self.__precio = precio

    def __str__(self):
        return f"Precio del producto: ${self.__precio:.2f}"

producto = Producto(199.99)

print(producto)

producto.set_precio(249.99)

print(producto)
```
