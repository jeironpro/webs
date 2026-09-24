"""
    Programa que renombra archivo.
    Pide al usuario la ruta del archivo y el nuevo nombre,
    verifica si el archivo existe y lo renombra,
    de lo contrario muestra un mensaje de error
"""
import os

ruta_archivo = input("Introduce la ruta del archivo: ")
nuevo_nombre = input("Introduce el nuevo nombre: ")
# Obtener el directorio de la ruta ruta del archivo
directorio_archivo = os.path.dirname(ruta_archivo)

# Verificar si el archivo existe
if os.path.exists(ruta_archivo):
    # Ruta completa del nuevo nombre
    directorio_nuevo_nombre = os.path.join(directorio_archivo, nuevo_nombre)

    # Renombrar el archivo
    os.rename(ruta_archivo, directorio_nuevo_nombre)
    print(f"Archivo {ruta_archivo} renombrado a {directorio_nuevo_nombre}")
else:
    print("El archivo no existe")