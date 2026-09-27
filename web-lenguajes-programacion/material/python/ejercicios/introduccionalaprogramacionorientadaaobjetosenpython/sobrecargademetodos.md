# Ejercicios — Sobrecarga de métodos

## sobrecarga_de_metodos_adicionales1

Calculadora de operaciones básicas

Crea una clase Calculadora con un método operar que pueda realizar las siguientes operaciones según la cantidad de argumentos:

- Con 2 argumentos: suma.
- Con 3 argumentos: producto.
- Con más de 3 argumentos: suma de todos los valores.

**Solución**

```python
class Calculadora:
    def operar(self, *args):
        if len(args) == 2:
            return f"La suma de los dos argunentos: {args[0] + args[1]}"
        elif len(args) == 3:
            return f"El producto de los tres argumentos: {args[0] * args[1] * args[2]}"
        elif len(args) > 3:
            return f"La suma de todos los argumentos: {sum(args)}"
        else:
            return "Error: Debe introducir al menos dos argumentos para operar." 

calculadora = Calculadora()

print(calculadora.operar(5, 3))
print(calculadora.operar(2, 3, 4))
print(calculadora.operar(1, 2, 3, 4, 5))
print(calculadora.operar(10))
```

## sobrecarga_de_metodos_adicionales2

Mensajes personalizados

Crea una clase Saludo con un método saludar.

- Si se proporciona un argumento, muestra: "Hola, {nombre}".

- Si no se proporcionan argumentos, muestra: "Hola, mundo".

- Si se proporcionan dos argumentos, muestra: "Hola, {nombre} desde {lugar}".

**Solución**

```python
class Saludo:
    def saludar(self, *args):
        if len(args) == 1:
            return f"Hola, {args[0]}"
        elif len(args) == 0:
            return "Hola, mundo"
        elif len(args) == 2:
            return f"Hola, {args[0]} desde {args[1]}"
        else:
            return "Error: Número incorrecto de argumentos."

saludo = Saludo()

print(saludo.saludar("Jeiron"))
print(saludo.saludar("Jeiron", "Santiago"))
print(saludo.saludar())
```

## sobrecarga_de_metodos_adicionales3

Cálculo de áreas

Crea una clase Figura con un método area.

- Si se proporciona un argumento, calcula el área de un cuadrado (lado * lado).

- Si se proporcionan dos argumentos, calcula el área de un rectángulo (base * altura).

- Si se proporcionan tres argumentos, calcula el área de un prisma rectangular (base * altura * profundidad).

**Solución**

```python
class Figura:
    def area(self, *args):
        if len(args) == 1:
            return args[0] ** 2
        elif len(args) == 2:
            return args[0] * args[1]
        elif len(args) == 3:
            return args[0] * args[1] * args[2]
        else:
            return "Error: Número incorrecto de argumentos."
        
figura = Figura()

print(f"Área de un cuadrado (lado 4): {figura.area(4)}")

print(f"Área de un rectángulo (base 5, altura 3): {figura.area(5, 3)}")

print(f"Área de un prisma rectangular (base 4, altura 3, profundidad 2): {figura.area(4, 3, 2)}")

print(figura.area(1, 2, 3, 4))
```

## sobrecarga_de_metodos_adicionales4

Concatenación flexible

Crea una clase Concatenador con un método concatenar.

- Si se proporciona un argumento, retorna el mismo texto.

- Si se proporcionan dos argumentos, retorna la concatenación de ambos con un espacio en medio.

- Si se proporcionan más de dos argumentos, retorna la concatenación de todos separados por comas.

**Solución**

```python
class Concatenador:
    def concatenar(self, *args):
        if len(args) == 1:
            return args[0]
        elif len(args) == 2:
            return f"{args[0]} {args[1]}"
        elif len(args) > 2:
            return ", ".join(args)
        else:
            return "Error: No se proporcionaron argumentos."
        
concatenador = Concatenador()

print(concatenador.concatenar("Hola"))

print(concatenador.concatenar("Hola", "mundo"))

print(concatenador.concatenar("Este", "es", "un", "ejemplo"))

print(concatenador.concatenar())
```

## sobrecarga_de_metodos_adicionales5

Conversión de temperaturas

Crea una clase Temperatura con un método convertir.

- Si se proporcionan 2 argumentos: convierte de una unidad a otra (por ejemplo, Celsius a Fahrenheit).

- Si se proporciona 1 argumento: considera que la conversión es de Celsius a Kelvin.

**Fórmulas**
- De Celsius a Fahrenheit: (°C * 9/5) + 32.
- De Celsius a Kelvin: °C + 273.15.

**Solución**

```python
class Temperatura:
    def convertir(self, *args):
        if len(args) == 2:
            celsius = args[0]
            if args[1].lower() == "fahrenheit":
                return (celsius * 9 / 5) + 32
            else:
                return "Unidad no reconocida para la conversión a Fahrenheit."
        elif len(args) == 1:
            celsius = args[0]
            return celsius + 273.15
        else:
            return "Error: Debe proporcionar al menos un argumento para la conversión."

temperatura = Temperatura()

print(f"25°C a Kelvin: {temperatura.convertir(25)} K")

print(f"25°C a Fahrenheit: {temperatura.convertir(25, 'fahrenheit')} °F")

print(f"100°C a Kelvin: {temperatura.convertir(100)} K")

print(f"0°C a Fahrenheit: {temperatura.convertir(0, 'fahrenheit')} °F")
```
