# Ejercicios — Condicionales

## condicionales1

Escribir un programa que pida al usuario su edad y muestre por pantalla:

Si es menor de 18 años, imprime "Eres menor de edad".
Si tiene 18 años o más, imprime "Eres mayor de edad".

**Solución**

```python
edad = int(input("Introduzca su edad: "))

if edad >=18:
    print("Eres mayor de edad")
else:
    print("Eres menor de edad")
```

## condicionales2

Escribir un programa que almacene la cadena de caracteres "contraseña" en una variable, pregunte al usuario por la contraseña e imprima por pantalla si la contraseña introducida por el usuario coincide con la guardada en la variable, sin tener en cuenta mayúsculas y minúsculas.

**Solución**

```python
contrasena = "contraseña"

contrasena_usuario = input("Introduce tu contraseña: ")

if contrasena.lower() == contrasena_usuario.lower():
    print("La contraseña coincide.")
else:
    print("La contraseña no coincide.")
```

## condicionales3

Escribir un programa que pida al usuario dos números y muestre por pantalla su división. Si el divisor es cero, el programa debe mostrar un error.

**Solución**

```python
n1 = int(input("Introduzca el primer número: "))
n2 = int(input("Introduzca el segundo número: "))

if n2 == 0:
    print("No se puede dividir entre 0")
else:
    print(n1 / n2)
```

## condicionales4

**Solución**

```python
# Escribir un programa que pida al usuario un número entero y muestre por pantalla si es par o impar.

numero = int(input("Introduzca un número entero: "))

resultado = "El número es par" if numero % 2 == 0 else "El número es impar"
print(resultado)
```

## condicionales5

Para tributar un determinado impuesto, se debe ser mayor de 16 años y tener unos ingresos iguales o superiores a 1000 dólares mensuales. Escribir un programa que pregunte al usuario su edad y sus ingresos mensuales, y muestre por pantalla si el usuario tiene que tributar o no.

**Solución**

```python
edad = int(input("Introduzca su edad: "))
ingresos = int(input("Introduzca sus ingresos mensuales en dólares: $"))

if edad >= 16 and ingresos >= 1000:
    print("Tienes que tributar.")
else:
    print("No tienes que tributar.")
```

## condicionales6

Los alumnos de un curso se han dividido en dos grupos, A y B, de acuerdo con el sexo y el nombre. El grupo A está formado por las mujeres con un nombre anterior a la M y los hombres con un nombre posterior a la N, y el grupo B por el resto. Escribir un programa que pregunte al usuario su nombre y sexo, y muestre por pantalla el grupo correspondiente.

**Solución**

```python
nombre = input("Introduce tu nombre: ")
sexo = input("Introduce tu sexo (M para masculino, F para femenino): ").upper()

primera_letra = nombre[0].upper()

if primera_letra < "M" and sexo == "F":
    print("Tú eres del grupo A")
elif primera_letra > "N" and sexo == "M":
    print("Tú eres del grupo A")
else:
    print("Tú eres del grupo B")
```

## condicionales7

Los tramos impositivos para la declaración de la renta en un determinado país son los siguientes:
- Menos de 10 000:         5%
- Entre 10 000 y 20 000:   15%
- Entre 20 000 y 35 000:   20%
- Entre 35 000 y 60 000:   30%
- Más de 60 000:           45%

Escribir un programa que pregunte al usuario su renta anual y muestre por pantalla el tipo impositivo que le corresponde.

**Solución**

```python
renta = int(input("De cuanto es su renta anual: RD$"))
impositivo = 0;

if renta < 10000:
    impositivo = 5
elif renta >= 10000 and renta < 20000:
    impositivo = 15
elif renta >= 20000 and renta < 35000:
    impositivo = 20
elif renta >= 35000 and renta <= 60000:
    impositivo = 30
else:
    impositivo = 45

print(f"Tu impositivo es de {impositivo}%")
```

## condicionales8

En una determinada empresa, sus empleados son evaluados al final de cada año. Los puntos que pueden obtener en la evaluación comienzan en 0.0 y pueden ir aumentando, traduciéndose en mejores beneficios. Los puntos que pueden conseguir los empleados son 0.0, 0.4, 0.6 o más, pero no valores intermedios entre las cifras mencionadas. A continuación, se muestra una tabla con los niveles correspondientes a cada puntuación. La cantidad de dinero conseguida en cada nivel es de 2,400 dólares multiplicada por la puntuación del nivel.

- Inaceptable: 0.0
- Aceptable: 0.4
- Meritoria: 0.6

Escribir un programa que lea la puntuación del usuario e indique su nivel de rendimiento, así como la cantidad de dinero que recibirá el usuario.

**Solución**

```python
puntuacion = float(input("Ingrese su puntuacion: "))
dinero = 2400 * puntuacion

if puntuacion == 0.0:
    puntuacion = "inaceptable"
elif puntuacion == 0.4:
    puntuacion = "aceptable"
elif puntuacion >= 0.6:
    puntuacion = "meritoria"
print(f"Tu puntuación es {puntuacion}\nLa cantidad de dinero conseguida es de RD$", dinero)
```

## condicionales9

Escribir un programa para una empresa que tiene salas de juegos para todas las edades y quiere calcular de forma automática el precio que debe cobrar a sus clientes por entrar. El programa debe preguntar al usuario la edad del cliente y mostrar el precio de la entrada. Si el cliente es menor de 4 años, puede entrar gratis; si tiene entre 4 y 18 años, debe pagar 5 dólares; y si es mayor de 18, debe pagar 10 dólares.

**Solución**

```python
edad = int(input("¿Cuál es la edad del cliente? "))

if edad < 4:
    print("El cliente entra gratis")
elif edad >= 4 and edad <= 18:
    print("El cliente debe pagar 5$")
else:
    print("El cliente debe pagar 10$")
```

## condicionales10

La pizzería Bella Napoli ofrece pizzas vegetarianas y no vegetarianas a sus clientes. Los ingredientes para cada tipo de pizza aparecen a continuación.

Ingredientes vegetarianos: pimiento y tofu.
Ingredientes no vegetarianos: peperoni, jamón y salmón.

Escribir un programa que pregunte al usuario si quiere una pizza vegetariana o no, y en función de su respuesta le muestre un menú con los ingredientes disponibles para que elija. Solo se puede elegir un ingrediente, además de la mozzarella y el tomate, que están en todas las pizzas. Al final, se debe mostrar por pantalla si la pizza elegida es vegetariana o no, y todos los ingredientes que lleva.

**Solución**

```python
print("Pizzería Bella Napoli")
pizza_vegetariana = input("¿Quieres una pizza vegetariana? (sí o no): ")

if pizza_vegetariana == "si":
    ingrediente = int(input("Elija el ingrediente que desea agregar:\n1-Pimiento\n2-Tofu\n:"))
    if ingrediente == 1:
        print("Tu pizza es vegetariana y sus ingredientes son Mozzarella + Tomate + Pimiento")
    elif ingrediente == 2:
        print("Tu pizza es vegetariana y sus ingredientes son Mozzarella + Tomate + Tofu")
    else:
        print("¡ERROR! El número introducido no se encuentra en el menú")
elif pizza_vegetariana == "no":
    ingrediente = int(input("Elija el ingrediente que desea agregar:\n1-Pepperoni\n2-Jamón\n3-Salmón\n:"))
    if ingrediente == 1:
        print("Tu pizza no es vegetariana y sus ingredientes son Mozzarella + Tomate + Pepperoni")
    elif ingrediente == 2:
        print("Tu pizza no es vegetariana y sus ingredientes son Mozzarella + Tomate + Jamón")
    elif ingrediente == 3:
        print("Tu pizza no es vegetariana y sus ingredientes son Mozzarella + Tomate + Salmón")
    else:
        print("¡ERROR! El número introducido no se encuentra en el menú")
```

## condicionales_adicional1

Escribir un programa que pida al usuario su edad y lo clasifique en uno de los siguientes grupos:

- Menor de 18: "Niño"
- 18 a 35: "Joven"
- 36 a 60: "Adulto"
- Mayor de 60: "Adulto mayor"

**Solución**

```python
edad = int(input("¿Cuál es tu edad? "))
grupo = ""

if edad < 18:
    grupo = "niño"
elif edad >= 18 and edad <= 35:
    grupo = "joven"
elif edad >= 36 and edad <= 60:
    grupo = "adulto"
else:
    grupo = "adulto mayor"

print("Eres un", grupo)
```

## condicionales_adicional2

**Solución**

```python
# Escribir un programa que pida un número al usuario y, usando el operador ternario, determine si es positivo o negativo.

numero = int(input("Ingresa un número: "))

positivo_negativo = "El número es positivo" if numero >= 0 else "El número es negativo"

print(positivo_negativo)
```

## condicionales_adicional3

Escribir un programa que pida la hora del día (en formato de 24 horas) y muestre el mensaje correspondiente:

- Si es antes de las 12: "Buenos días".
- Si es de 12 a 18: "Buenas tardes".
- Si es después de las 18: "Buenas noches".

**Solución**

```python
hora_del_dia = int(input("¿Qué hora es? "))

if hora_del_dia < 12:
    print("Buenos días")
elif hora_del_dia >= 12 and hora_del_dia <= 18:
    print("Buenas tardes")
else:
    print("Buenas noches")
```

## condicionales_adicional4

Escribir un programa que pida un número y determine si es divisible tanto por 3 como por 5, usando condicionales anidadas. Si el número es divisible por ambos, imprime "Divisible por 3 y por 5". Si es divisible solo por uno, imprime el número correspondiente, y si no es divisible por ninguno, imprime "No es divisible ni por 3 ni por 5".

**Solución**

```python
numero = int(input("Ingresa un número? "))

if numero % 3 == 0:
    if numero % 5 == 0:
        print("Divisible por 3 y 5")
    else:
        print("Divisible por 3")
elif numero % 5 == 0:
    print("Divisible por 5")
else:
    print("No es divisible ni por 3 ni por 5")
```

## condicionales_adicional5

**Solución**

```python
# Escribir un programa que pida tres números al usuario y determine cuál es el mayor utilizando condicionales anidadas.

num1 = int(input("Ingresa el primer número: "))
num2 = int(input("Ingresa el segundo número: "))
num3 = int(input("Ingresa el tercer número: "))

if num1 >= num2: 
    if num1 >= num3:
        print("El número mayor es:", num1)
    else:
        print("El número mayor es:", num3)
elif num2 >= num3:
    print("El número mayor es:", num2)
else:
    print("El número mayor es:", num3)
```
