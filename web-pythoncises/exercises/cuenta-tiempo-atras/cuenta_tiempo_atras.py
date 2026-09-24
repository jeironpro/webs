"""
    Programa que pide al usuario un numero de tiempo inicial
    para iniciar un despegue, haciendo una cuentra regresiva
    del tiempo inicial hasta 1 y posteriormente hacer el despegue 
"""
import time

tiempo_inicial = input("Introduce el tiempo inicial: ")
contador = int(tiempo_inicial)

print("Iniciando cuenta regresiva...")

while contador > 0:
    print(contador)
    contador -= 1
    time.sleep(0.5) # espera de 5 milisegundos

print("Despegue!!!")