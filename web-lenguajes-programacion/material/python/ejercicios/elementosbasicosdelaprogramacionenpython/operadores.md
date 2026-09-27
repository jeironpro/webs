# Ejercicios — Operadores

## operadores1

Escribir un programa que pida al usuario dos números y calcule:

- Suma
- Resta
- Multiplicación
- División

**Solución**

```python
num1 = int(input("Ingresa el primer número: "))
num2 = int(input("Ingresa el segundo número: "))

suma = num1 + num2
print("Suma:", suma)

resta = num1 - num2
print("Resta:", resta)

multiplicacion = num1 * num2
print("Multiplicación:", multiplicacion)

division = num1 / num2
print("División:", division)
```

## operadores2

Escribir un programa que solicite al usuario la base y la altura de un triángulo y calcule su área.

**Fórmula**
a = (b * al) / 2

**Solución**

```python
base = int(input("Ingresa la base: "))
altura = int(input("Ingresa la altura: "))

area = (base * altura) / 2
print("El área del triángulo es:", area)
```

## operadores3

**Solución**

```python
# Escribir un programa que pida al usuario un número y un exponente, y calcula la potencia.

numero = int(input("Ingresa el número base: "))
exponente = int(input("Ingresa el exponente: "))

print(f"{numero} elevado a la {exponente} es {numero ** exponente}")
```

## operadores4

Escribir un programa que pida al usuario una cantidad de días y calcule cuántas semanas completa y días sobran.

**Fórmula**
semanas = dias // 7
dias_restantes = dias % 7

**Solución**

```python
dias = int(input("Ingresa una cantidad de días: "))

semanas = dias // 7
dias_restantes = dias % 7

print(f"{dias} días son {semanas} semana(s) y {dias_restantes} día(s)")
```

## operadores5

Escribir un programa que pida al usuario el radio de un círculo y calcula su perimetro.

**Fórmula**
perimetro = 2 * PI * radio
PI = 3.1416

**Solución**

```python
radio = int(input("Ingresa el radio: "))
PI = 3.1416
perimetro = 2 * PI * radio

print("El perímetro del círculo es:", perimetro)
```

## operadores6

Escribir un programa que pida al usuario dos números y muestre los valores intercambiados.

* No usar estructuras de control, usar una asignación múltiple. *

**Solución**

```python
num1 = int(input("Ingresa el primer número: "))
num2 = int(input("Ingresa el segundo número: "))

print("Antes del intercambio:")
print("Primer número:", num1)
print("Segundo número:", num2)

num1, num2 = num2, num1
print("Después del intercambio:")
print("Primer número:", num1)
print("Segundo número:", num2)
```
