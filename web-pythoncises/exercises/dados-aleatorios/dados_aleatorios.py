"""
    Programa que simula un lanzador de dados,
    pide al usuario un número de lanzamientos,
    lanza el número de dados indicados y muestra
    el valor de cada dado, la suma y el producto de todos
"""

import random

# Lanzar los dados indicados
def lanza_dados(numero):
    valores_dados = []
    contador = 0

    while contador < numero:
        dado = random.randint(1, 6)
        valores_dados.append(dado)
        contador += 1
    
    return valores_dados

while True:
    print("Opciones:")
    print("1. Lanzar dados")
    print("2. Salir")

    opcion = input("Opcion: ")
    if opcion == "1":
        numero_dados = input("Introduce el numero de dados: ")
        valores_dados = lanza_dados(int(numero_dados))
        producto = valores_dados[0]

        for i, valor in enumerate(valores_dados):
            print(f"Dado {i+1}: {valor}")
            
            if i < len(valores_dados) - 1:
                producto *= valores_dados[i+1]

        print(f"\nSuma: {sum(valores_dados)}")
        print(f"Producto: {producto}\n")
    elif opcion == "2":
        print("Adios")
        break
    else:
        print("Opción no valida")