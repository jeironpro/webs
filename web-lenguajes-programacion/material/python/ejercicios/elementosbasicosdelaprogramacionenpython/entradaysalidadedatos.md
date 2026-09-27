# Ejercicios — Entrada y salida de datos

## entrada_y_salida_de_datos1

**Solución**

```python
# Escribir un programa que pida al usuario su nombre y lo salude

nombre = input("¿Cuál es tu nombre? ")
print("Hola", nombre)
```

## entrada_y_salida_de_datos2

**Solución**

```python
# Escribir un programa que soicite dos números al usuario, los sume y muestre el resultado.

num1 = int(input("Ingresa el primer número: "))
num2 = int(input("Ingresa el segundo número: "))

print(f"La suma de {num1} y {num2} es {num1 + num2}")
```

## entrada_y_salida_de_datos3

Escribir un programa qye convierta una temperatura de grados Celsius a Fahrenheit.

**Formula**
f = c * 9 / 5 + 32

**Solución**

```python
temperatura_celsius = int(input("Ingresa la temperatura en Celsius: "))

temperatura_fahrenheit = temperatura_celsius * 9 / 5 + 32

print(f"{temperatura_celsius}°C son {int(temperatura_fahrenheit)}°F")
```

## entrada_y_salida_de_datos4

Escribir un programa que pida al usuario la base y la altura de un rectángulo y calcule su área

**Formula**
a = b * al

**Solución**

```python
base = int(input("Ingresa la base del rectángulo: "))
altura = int(input("Ingresa la altura del rectángulo: "))

area = base * altura
print("El área del rectángulo es:", area)
```

## entrada_y_salida_de_datos5

**Solución**

```python
# Escribir un programa que pida al usuario su edad actual y muestre cuántos años tendrà dentro de 10 años.

edad = int(input("¿Cuántos años tienes? "))
print(f"En 10 años, tendràs {edad + 10} años")
```

## entrada_y_salida_de_datos6

**Solución**

```python
# Escribir un programa que solicite tres números al usuario y calcule su promedio.

num1 = int(input("Ingresa el primer número: "))
num2 = int(input("Ingresa el segundo número: "))
num3 = int(input("Ingresa el tercer número: "))

print(f"El promedio es: {(num1 + num2 + num3) / 3}")
```

## entrada_y_salida_de_datos7

**Solución**

```python
# Escribir un programa que pida al usuario el precio de tres producto y calcule el total a pagar con el ITBIS del 18%.

producto1 = float(input("Precio del producto 1: "))
producto2 = float(input("Precio del producto 2: "))
producto3 = float(input("Precio del producto 3: "))

suma_productos = (producto1 + producto2 + producto3)
total_itbis = suma_productos + (suma_productos * 0.18)
print(f"El total con ITBIS es: {total_itbis:.2f}")
```

## entrada_y_salida_de_datos8

**Solución**

```python
# Escribir un programa que pida al usuario su nombre, edad y ciudad, y luego muestre un mensaje con esa información.

nombre = input("¿Cuál es tu nombre? ")
edad = int(input("¿Cuántos años tienes? "))
ciudad = input("¿En qué ciudad vives? ")

print(f"Hola, {nombre}. Tienes {edad} años y vives en {ciudad}.")
```
