"""
    Programa que simula una reloj alarma. 
    Pide al usuario configurar su alarma en un formato especifico,
    marca la alarma configurada y muestra el tiempo restante (horas y minutos) 
    que faltan para sonar la alarma
"""
import time

alarma = input("Configura la hora de la alarma en formato 24H (ej: 7:45): ")

# Validar formato
if ":" not in alarma or len(alarma.split(":")) != 2:
    print("Formato no valido")
else:
    partes = alarma.split(":")
    hora_objetivo = int(partes[0])
    minutos_objetivo = int(partes[1])

    print(f"Alarma configurada a las {alarma}")

    while True:
        ahora = time.localtime()
        hora_actual = ahora.tm_hour
        minutos_actuales = ahora.tm_min
        segundos_actuales = ahora.tm_sec

        # Verificar si la hora es la alarma configurada
        if hora_actual == hora_objetivo and minutos_actuales == minutos_objetivo:
            print("ALARMA ACTIVADA")
            break
        else:
            horas_faltantes = hora_objetivo - hora_actual
            minutos_faltantes = minutos_objetivo - minutos_actuales

            # Verificar minutos faltantes
            if minutos_faltantes < 0:
                minutos_faltantes += 60
                horas_faltantes -= 1
            
            # Verificar horas faltantes
            if horas_faltantes < 0:
                horas_faltantes += 24

            print(f"Faltan {horas_faltantes} horas y {minutos_faltantes} {"minutos" if minutos_faltantes > 1 else "minuto"}")
            time.sleep(60 - segundos_actuales) # Espera del siguiente minuto