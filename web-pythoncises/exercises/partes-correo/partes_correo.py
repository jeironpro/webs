"""
    Programa que lee cualquier archivo que sea de texto
    y busca los correos electronicos y muestras sus partes 
    (nombre y dominio)
"""
import os

nombre_archivo = input("Introduce el nombre del archivo: ")

# Verificar que el archivo existe antes de leer
if os.path.exists(nombre_archivo):
    with open(nombre_archivo, "r") as archivo:
        for linea in archivo:
            linea = linea.strip()

            if "@" in linea:
                partes = linea.split("@")

                nombre_usuario = partes[0]
                dominio = partes[1]

                print(f"Nombre usuario: {nombre_usuario}")
                print(f"Dominio: {dominio}")
else:
    print(f"El archivo {nombre_archivo} no existe")