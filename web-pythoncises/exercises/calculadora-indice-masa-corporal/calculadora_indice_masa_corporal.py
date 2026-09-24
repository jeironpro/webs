"""
    Programa que pide al usuario su peso y altura,
    calcula su indice de masa corporal y muestra el resultado
"""

peso = input("Introduce tu peso en kg: ")
altura = input("Introduce tu altura en m: ")

imc = float(peso) / (float(altura)**2)

print(f"Tu indice de masa corporal es: {imc:.2f}")