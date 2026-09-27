# Operadores

**Operadores**
En python, los operadores són símbolos o palabreas especiales que se utilizan para realizar operaciones en uno o más valores. Estos valores se llaman operandos.

* Tipos de operadores *
- Operadores aritméticos
- Operadores relacionales
- Operadores lógicos
- Operadores de asignación
- Operadores de pertenencia
- Operadores de identidad

```python
''' Operadores aritméticos
se usan para realizar cálculos matemáticos básicos.
Operador   Descripción	      Ejemplo   Resultado
+	       Suma	              5 + 3	    8
-	       Resta	          5 - 3	    2
*	       Multiplicación	  5 * 3	    15
/    	   División	          5 / 2	    2.5
//	       División entera	  5 // 2	2
%   	   Módulo (residuo)   5 % 2	    1
**  	   Potencia	          2 ** 3	8

PRIORIDAD DE LOS OPERADORES ARITMÉTICOS
1- Paréntesis (): Se evaluán de adentro hacia afuera
2- Exponenciación **
3- Multiplicación * | División / | Módulo %
4- Suma + | Resta -
'''

num1 = 25
num2 = 18

# Suma (+)
suma = num1 + num2
print("El resultado de la suma es", suma)

# Resta (-)
resta = num1 - num2
print("El resultado de la resta es", resta)

# Multiplicacion (*)
multiplicacion = num1 * num2
print("El resultado de la multiplicación es", multiplicacion)

# División (/)
division = num1 / num2
print("El resultado de la división es", division)

# División exacta (//)
divisionexacta = num1 // num2
print("El resultado de la división exacta es", divisionexacta)

# Módulo o residuo (%)
residuo = num1 % num2
print("El residuo de la división es", residuo)

num1 = 2
num2 = 5

# Potenciación (**)
potencia = num1 ** num2
print(f"El {num1} elavada a la potencia de {num2} es {potencia}")

''' Operadores relacionales
Se utilizan para establecer una relación entre 2 valores. Comparando estos valores entre sí y esta comparación produce un resultado de certeza o falsedad (True o False). Tienen el mismo nivel de prioridad en su evaluación y tienen menor prioridad que los aritméticos.

Operador   Descripción         Ejemplo   Resultado
==	       Igual a	           5 == 5	 True
!=	       No igual a	       5 != 3	 True
>	       Mayor que	       5 > 3	 True
<	       Menor que	       5 < 3	 False
>=	       Mayor o igual que   5 >= 5	 True
<=	       Menor o igual que   5 <= 3	 False
'''

# Combinar operadores relacionales con operadores aritmeticos
num1 = 4
num2 = 6
num3 = 10

resultado = num1 + num2 == num3
print(resultado)

''' Operaores logicos 
Permiten construir expresiones logicas y se obtiene como
resultado, booleanos.

1- Operador AND (Conjuncion): se le conoce como multiplicacion logica. sera
verdadero, solamente cuando ambas condiciones sean verdaderas.

2- Operador OR (Disyuncion): se le conoce como suma logica. sera verdadero,
cuando una o ambas condiciones sean verdaderas.

3- Operador NOT (Negacion): si niegas un valor, sera lo contrario al valor existente.

Operador   Descripción	                                Ejemplo	         Resultado
and	       Devuelve True si ambas son verdaderas	    True and False   False
or	       Devuelve True si al menos una es verdadera   True or False	 True
not	       Invierte el valor lógico	                    not True	     False

PRIORIDAD DE LOS OPERADORES LÓGICOS
1- NOT
2- AND
3- OR
'''

a = 10
b = 12
c = 13

resultado = ((a > b) or (a < c)) and ((a == c) or (a >= b))
print(resultado)

a = 10
b = 15
c = 20

resultadoAND = ((a < b) and (b < c))
print(resultadoAND)

resultadoOR = ((a > b) or (b < c))
print(resultadoOR)

resultadoNOT = not((a > b) and (b < c))
print(resultadoNOT)

''' Operadores de asignación
Asignan valores a las variables.

Operador   Descripción	                  Ejemplo   Equivalente
=	       Asignación	                  x = 5	    x = 5
+=	       Suma y asignación	          x += 3	x = x + 3
-=	       Resta y asignación	          x -= 2	x = x - 2
*=	       Multiplicación y asignación	  x *= 2	x = x * 2
/=	       División y asignación	      x /= 2	x = x / 2
//=	       División entera y asignación   x //= 2	x = x // 2
%=	       Módulo y asignación	          x %= 2	x = x % 2
**=	       Potencia y asignación	      x **= 3	x = x ** 3
'''

''' Operadores de pertenencia
Verifican si un elemento está en una colección (listas, cadenas, etc.).

Operador   Descripción	                       Ejemplo	           Resultado
in	       Devuelve True si el elemento está   'a' in 'hola'       True
not in	   Devuelve True si no está	           'z' not in 'hola'   True
'''

''' Operadores de identidad
Comparan si dos objetos son iguales en memoria.

Operador   Descripción	                     Ejemplo	  Resultado
is	       Devuelve True si son iguales	     x is y	      Depende
is not	   Devuelve True si no son iguales	 x is not y	  Depende
'''
```
