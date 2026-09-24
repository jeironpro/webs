"""
    Programa que dibuja un triangulo invertido de astericos
"""

filas = 5

for i in range(filas, 0, -1):
    print(" " * (filas - i) + '*' * (2 * i -1))