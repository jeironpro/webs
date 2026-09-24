"""
    Programa que simula el juego de piedra papel o tijera,
    el usuario elige una de las opciones y la maquina tambien, 
    finalmente muestra el ganador o empate.
"""
import random

def verifica_ganador(opcion_usuario, opcion_maquina):
    if opcion_usuario == "tijera" and opcion_maquina == "papel":
        return "Has ganado!"
    elif opcion_usuario == "papel" and opcion_maquina == "piedra":
        return "Has ganado!"
    elif opcion_usuario == "piedra" and opcion_maquina == "tijera":
        return "Has ganado!"
    elif opcion_usuario == opcion_maquina:
        return "Empate!"
    else:
        return "Maquina gana!"

opciones = ['piedra', 'papel', 'tijera']

while True:
    opcion_maquina = random.choice(opciones) # opción aleatoria entre las tres disponibles
    opcion_usuario = input("Piedra, Papel o Tijera (enter para salir): ").lower()

    # Verificar salida
    if not opcion_usuario:
        print("Adios")
        break

    print(f"La maquina elige: {opcion_maquina}")
    print(verifica_ganador(opcion_usuario, opcion_maquina))