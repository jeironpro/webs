"""
    Programa que dibuja un triangulo de astericos
"""

filas = 5

for i in range(1, filas + 1):
    print(" " * (filas - i) + '*' * (2 * i -1))