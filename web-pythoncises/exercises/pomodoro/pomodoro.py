"""
    Programa que simula un pomodoro método de gestión del tiempo desarrollado por Francesco cirillo. El programa pide al usuario una lista de tareas separadas por espacios y inicia un temporizador de 25 minutos por cada tarea y un descanso de 5 minutos a cada tarea y en cada 4 tareas el tiempo de descanso aumenta a 15 minutos
"""
import os
import time

def limpiar_pantalla():
    os.system('cls' if os.name == 'nt' else 'clear')

def temporizador(minutos, mensaje):
    print("¡Inicia el tiempo regresivo!")
    for minuto in range(minutos, 0, -1):
        for segundo in range(59, -1, -1):
            print(f"{mensaje} - {minuto-1:02d}:{segundo:02d}", end="\r")
            time.sleep(1)
    print()

def pomodoro(tareas):
    contador = 0

    for tarea in tareas:
        contador+= 1
        limpiar_pantalla()
        print(f"Pomodoro {contador} - Tarea: {tarea}")
        temporizador(25, "Trabajando")
        print("¡Pomodoro terminado!")

        if contador % 4 != 0:
            temporizador(5, "Descansando")
        else:
            temporizador(15, "Descansando")

tareas_usuario = input("Introduce una lista de taras separadas por espacios: ")
lista_tareas = tareas_usuario.split()

pomodoro(lista_tareas)
print("¡Todos los Pomodoros completados!")