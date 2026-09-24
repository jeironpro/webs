"""
    Programa genera un numero aleatorio del 1 al 100, le permite 10 intentos al usuario para adivinarlo 
"""
import random

def genera_numero_secreto():
    return random.randint(1, 100)

numero_secreto = genera_numero_secreto()
contador_intentos = 0
gana = False

while True:
    numero_usuario = input("Adivina el numero secreto (enter para salir): ")

    # Validación de salida
    if not numero_usuario:
        print("Adios")
        break
    
    # Convertir el número a un entero
    numero_usuario = int(numero_usuario)

    # Verificación de número y aumento intentos si falla
    if numero_usuario < numero_secreto:
        contador_intentos += 1
        print("El número secreto es mayor\n")
    elif numero_usuario > numero_secreto:
        contador_intentos += 1
        print("El número secreto es menor\n")
    else:
        gana = True # marcar que gana
        print("Has adivinado!!!")
        break
    
    # Verificacion de intentos sin ganar
    if contador_intentos == 10 and not gana:
        print("Se te han acabado los intentos y no has adivinado")
        break
