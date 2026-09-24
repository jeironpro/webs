"""
    Programa que simula un reloj digital, mostrando la hora
    actual cada segundo.
"""
import time
import os

tiempo = time.localtime()

horaActual = tiempo.tm_hour
minutosActuales = tiempo.tm_min
segundosActuales = tiempo.tm_sec

while True:
    # Limpiar pantalla
    os.system('clear')

    print(f"{horaActual}:{minutosActuales}:{segundosActuales}")

    time.sleep(1) # Espera de un segundo

    # Actualizar los segundos
    segundosActuales = segundosActuales + 1

    # Verificar limite de segundos y actualizar minutos
    if segundosActuales == 60:
        segundosActuales = 0
        minutosActuales = minutosActuales + 1

    # Verificar limite de minutos y actualizar hora
    if minutosActuales == 60:
        minutosActuales = 0
        horaActual = horaActual + 1

    # Verificar y actualizar limite hora
    if horaActual == 24:
        horaActual = 0