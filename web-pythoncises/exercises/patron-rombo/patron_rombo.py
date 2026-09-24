"""
    Programa que dibuja un rombo de astericos
"""

filas = 5

# Triangulo
for i in range(1, filas + 1):
    print(" " * (filas - i) + '*' * (2 * i -1))

# Triangulo invertido
for i in range(filas - 1, 0, -1):
    print(" " * (filas - i) + '*' * (2 * i -1))