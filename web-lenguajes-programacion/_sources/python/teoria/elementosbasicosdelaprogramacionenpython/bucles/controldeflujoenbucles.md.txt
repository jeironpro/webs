# Control de flujo en bucles

**Control de flujo en bucles**
El contro de flujo en bucles en Python se refiere a las herramientas y técnicas que nos permiten alterar o modificar el comportamiento predeterminado de un bucle. Esto incluye detener el bucle, omitir una iteración o ejecutar un bloque adicional al final del bucle.

**Tipos de controles de flujo**
1. break: El comando break se utiliza para terminar un bucle de manera anticipada, es decir, finaliza el bucle actual aunque la condición del bucle no haya terminado.

- **2.** continue: el comando continue se utiliza para saltar la iteración actual y pasar directamente a la siguente, sin ejecutarse el resto del código en esa iteración.

- **3.** else: El comando else puede usarse con los bucles for o while. Se ejecuta una vez al final del bucle si este no se interrumpe con un break.

**Flujo completo del bucle**
1. Se evalúa la condición inicial (en while) o se inicia la iteración (en for).
2. En cada iteración:
- Si se cumple la condición para un break, el bucle termina inmediatamente.
- Si se encuentra un continue, se omite el resto del código de la iteración actual y pasa a la siguiente.
3. Si no se cumple la condición inicial (o la iteración finaliza), se ejecuta el bloque del else (si existe).

```python
# Uso de break en el bucle for
for num in range(1, 10):
    if num == 5:
        break # Detiene el bucle cuando num es 5
    print(num)

# Uso de break en el bucle while
contador = 1
while contador <= 10:
    print(contador)
    if contador == 7:
        break # Finaliza el bucle cuando contador llega a 7
    contador += 1

# Uso de continue en el bucle for
for num in range(1, 6):
    if num == 3:
        continue # Salta la iteración cuando num es 3
    print(num)

# Uso de continue en el bucle while
contador = 0
while contador < 5:
    contador += 1
    if contador == 3:
        continue # Salta el número 3
    print(contador)

# Uso de else en el bucle for
for num in range(1, 5):
    print(num)
else:
    print("El bucle ha terminado correctamente.")

# Uso de break y else en el bucle for
for num in range(1, 5):
    if num == 3:
        break # Detiene el bucle antes de completarse
    print(num)
else:
    print("El bucle ha terminado correctamente.") # No se ejecuta porque hubo un break

# Uso de else en el bucle while
contador = 1
while contador < 5:
    print(contador)
    contador += 1
else:
    print("El bucle ha terminado correctamente.")

# Uso combinado de break y continue en el bucle for
for num in range(1, 10):
    if num % 2 == 0:
        continue # Salta los números pares
    if num > 7:
        break # Termina el bucle al superar 7
    print(num)

# Bucle while infinito
while True:
    print("Esto se ejecutará para siempre si no hay un break")
    break # Para detener el bucle

# Olvidar actualizar la variable en un while
i = 1
while i < 5:
    print(i) # Esto se ejecutará infinitamente si no incrementamos i
    i += 1 # Para que no sea infinito

# Buscar un núemro si existe en una lista, usando break y else

numeros = [10, 20, 30, 40, 50]
buscado = 25

for num in numeros:
    if num == buscado:
        print(f"{buscado} encontrado.")
        break
else:
    print(f"{buscado} no está en la lista.")
```
