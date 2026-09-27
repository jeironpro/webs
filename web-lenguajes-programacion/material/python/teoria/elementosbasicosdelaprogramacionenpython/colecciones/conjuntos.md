# Conjuntos

**Colecciones (Conjuntos)**
Las colecciones en Python son estructuras de datos que permiten agrupar múltiples objetos o valores de diferentes tipos bajo un mismo nombre. En Python, existen cuatro colecciones básicas, que son:

**1- Listas**
2- Tuplas
3- Diccionarios
4- Conjuntos

**Los conjuntos**
Los conjuntos o sets son colecciones donde los elementos se agregan de forma desordenada y no pueden existir elementos duplicados. Se utilizan llaves {}. Dentro de los conjuntos no se pueden agregar otras colecciones mutables, como listas o diccionarios.

Un conjunto es una colección desordenada, mutable, y que no permite elementos duplicados. Es similar al concepto de conjuntos en matemáticas, lo que significa que puedes realizar operaciones como unión, intersección y diferencia.

**Características principales**
1. Desordenados: los elementos no tienen un índice ni un orden específico.
2. No duplicados: si añades elementos repetidos, se eliminan automáticamente.
3. Mutables: puedes agregar o eliminar elementos, pero los elementos individuales deben ser inmutables (como números, cadenas o tuplas).

**Métodos útiles de los conjuntos**
Método                      Descripción
issubset(otro_conjunto)     Retorna True si el conjunto es un subconjunto del otro.
issuperset(otro_conjunto)   Retorna True si el conjunto es un superconjunto del otro.
isdisjoint(otro_conjunto)   Retorna True si los conjuntos no tienen elementos en común.
copy()                      Crea una copia del conjunto.

```python
# Creación de un conjunto vacío
# Con el método set()
# Utilizamos set porque Python puede asimilar que estamos trabajando con diccionarios
conjunto = set()
print(conjunto)

# Con llaves {}
# Nota: Este crea un diccionario vacío, no un conjunto vacío
conjunto = {}
print(conjunto)

# Creación de un conjunto con elementos
conjunto = {"Armando", 2.8, 3, True}
print(conjunto)

# Crear un conjunto con elementos e ignorar los que están repetidos
# Aunque no se permiten elementos duplicados, si los hay, el programa los ignora
conjunto = {"Armando", 2.8, 3, "Armando"}
print(conjunto)

# Convertir una lista a conjunto usando set()
conjunto = set(["Armando", 2.8, 3, "Armando"])
print(conjunto)

# Usar el método add() para añadir un elemento al conjunto
conjunto = {"Armando", 2.8, 3, True}
conjunto.add("Juanito")
print(conjunto)

# Eliminar un elemento del conjunto con el método remove(x)
# Si el elemento no existe, el programa lanza un error
conjunto = {"Armando", 2.8, 3, True}
conjunto.remove(3)
print(conjunto)

# Eliminar un elemento del conjunto con el método discard(x)
# Si el elemento no existe, el programa no lanza un error
# Con el método discard si un elemento se repite eliminará uno y el otro lo ignora
conjunto = {"Armando", 2.8, 3, True}
conjunto.discard("Armando")
print(conjunto)

# Eliminar un elemento aleatorio usando el método pop() y almacenarlo en una variable
conjunto = {"Armando", 2.8, 3, True}
elemento = conjunto.pop()
print(elemento)

# Vaciar un conjunto con el método clear()
conjunto = {"Armando", 2.8, 3, True}
conjunto.clear()
print(conjunto)

# Operaciones entre conjuntos
# Unión (| o union()): combina todos los elementos de dos conjuntos, sin los valores duplicados
conjunto1 = {1, 2, 3}
conjunto2 = {3, 4, 5}
unionConjunto = conjunto1 | conjunto2
print(unionConjunto)

# Intersección (& o intersection()): obtiene los elementos comunes entre dos conjuntos
conjunto1 = {1, 2, 3}
conjunto2 = {3, 4, 5}
interseccionConjuntos = conjunto1 & conjunto2
print(interseccionConjuntos)

# Diferencia (- o difference()): obtiene los elementos del primer conjunto que no están en el segundo
conjunto1 = {1, 2, 3}
conjunto2 = {3, 4, 5}
diferenciaConjuntos = conjunto1 - conjunto2
print(diferenciaConjuntos)

# Diferencia simétrica (^ o symmetric_difference()): obtiene los elementos que están en uno u otro conjunto, pero no en ambos
conjunto1 = {1, 2, 3}
conjunto2 = {3, 4, 5}
diferenciaSimetricaConjuntos = conjunto1 ^ conjunto2
print(diferenciaSimetricaConjuntos)

# Buscar un elemento dentro de un conjunto
conjunto = {"Juana", 2.8, 3, "Juan"}
print("Juana" in conjunto) 
print("Juani" not in conjunto)

# Comprobar si ambos conjuntos son iguales
conjunto1 = {1, 2, 3}
conjunto2 = {3, 1, 2}
print(conjunto1 == conjunto2)

# Conocer la cantidad de elementos que posee el conjunto usando el método len()
conjunto1 = {1, 2, 3}
conjunto2 = {3, 4, 5}
print(len(conjunto))

conjunto1 = {1, 2, 3}
conjunto2 = {2, 3}
conjunto3 = {4, 5}

print(conjunto2.issubset(conjunto1)) # Muestra True
print(conjunto1.issuperset(conjunto2)) # Muestra True
print(conjunto1.isdisjoint(conjunto3)) # Muestra True (no tienen elementos en común)

# Frozenset: conjunto inmutable
# Si se necesita un conjunto inmutable, puedes usar frozenset. No permite agregar ni eliminar elementos después de la creación
miFrozenset = frozenset([1, 2, 3, 2])
print(miFrozenset) # Muestra frozenset({1, 2, 3})
```
