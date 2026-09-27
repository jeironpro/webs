# While

**Bucles (while)**
Un bucle es una estructura de control que permite ejecutar repetidamente un bloque de código mientras se cumpla una condición o se recorran los elementos de una secuencia.

**Tipos de bucles**
1- for loop: itera sobre una secuencia (listas, tuplas, cadenas, rangos, etc).
2- while loop: repite un bloque de código mientras una condición sea verdadera.

El bucle o ciclo while: se utiliza cuando no conocemos la cantidad de iteraciones que se va a ejecutar el bloque de código, sino que se repite mientras se cumpla una condición específica.

Sintaxis: While condición

```python
# Imprimir una cantidad definida de números
numero = 1

while numero <= 50:
    print(numero)
    numero = numero + 1

# Recibir valores positivos
import math
numero = int(input("Introduzca un número: "))

while numero < 0:
    print("El número no puede ser negativo. Intente de nuevo.")
    numero = int(input("Introduzca un número: "))

print(f"La raíz cuadrada de {numero} es: {(math.sqrt(numero)):.2f}")

# Bucle infinito (¡cuidado!)
# Si no modificas la condición, el bucle puede ser infinito

while True:
    print("Esto se repite siempre")
    break  # Sin el break es un bucle infinito
```
