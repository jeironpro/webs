# Condicionales

**Condicionales**
Las condicionales son estructura que permiten ejecutar diferentes bloques de código dependiendo de si una condición se cumple (True) o no (False). Esto es fundamental para que un programa pueda tomar decisiones.

* Instrucciones *
if
if else
if elif else
condicionales anidadas
operador ternario

**Las condiciones pueden usar**
- Operadores de comparación: ==, !=, <, >, <=, >=.
- Operadores lógicos: and, or, not.
- Operadores de pertenencia: in, not, in.

```python
# Condicional if simple
edad = 18

if edad >= 18:
    print("Eres mayor de edad") # Este mensaje se mostrará si la condición es True. En este caso lo es.

# Condicional if else
# Si la condición es False, se ejecuta el bloque del else.
edad = 17

if edad >= 18:
    print("Eres mayor de edad.") # Este mensaje se mostrará si la condición es True.
else:
    print("Eres menor de edad.") # Este mensaje se mostrará si la condición es False. En este caso lo es.

# Condicional if elif else
'''
Para manejar múltiples condiciones.
Nota: Solo se ejecuta un bloque de código, el primero cuya condición sea verdadera.
'''
nota = 80

if nota >= 90:
    print("Excelente") # Este mensaje se mostrará si la condición es True.
elif nota >= 70:
    print("Aprobado") # Este mensaje se mostrará si la condición es True.  En este caso lo es.
else:
    print("Reprobado") # Este mensaje se mostrará si la condición es False.

''' Condicionales anidadas
Las condicionales anidadas son bloques if, elif, o else que se encuentran dentro de otro bloque de condicional. Se utilizan cuando necesitas realizar decisiones más complejas, evaluando múltiples condiciones en jerarquías.
'''

nombre = input("Escriba su nombre: ")
educacion = input("Escriba su nivel academico: ")

if educacion == "Bachiller" or "bachiller" or "BACHILLER":

    edad = int(input(f"{nombre}, usted ya es bachiller.\nPor favor, introduzca su edad: "))

    if edad >= 16:
        print(f"{nombre}, usted es {educacion} y tiene {edad}, por lo que usted reune las condiciones para realizar los cursos técnicos del INFOTEP.")
    else:
        print(f"{nombre} usted no tiene la edad minima requerida para estudiar en el INFOTEP.")
else:
    print(f"{nombre}, usted aun no es bachiller, por lo que no puede realizar los cursos técnicos del INFOTEP.")

'''
Flujo de ejecución:
1. primero evaluá if educacion.
2. Si es True, pasa a pedir la edad y evaluar la condición anidada if edad >= 16.
3. Si edad no es mayor o igual a 16 ejecuta el else anidado de la condición.
4. Si educacion es False, ejecuta el else de la condición principal.
'''

''' Consejo
Puedes anidar múltiples niveles, demasiados niveles hacen que el código sea difícil de leer. Trata de simplificar usando operadores lógicos (and, or) cuando sea posible.
'''

''' Operador ternario
El operador ternario es una herramienta que es utilizada por muchos lenguajes de programación, es igual a if...else..., o sea, tiene una condición a evaluar, el código a ejecutar si se cumple la condición y el código a ejecutar si no se cumple dicha condición.

Sintaxis: 
[código si se cumple] if [condicion] else [código si
no se cumpe].
'''

num1 = 9
num2 = 5

mensaje = "Valor si es True" if num1 > num2 else "Valor si es False"
print(mensaje)

''' Consejo
Evitar usarlo en decisiones complejas o múltiples condiciones, ya que puede hacer que el código sea difícil de leer.
'''
```
