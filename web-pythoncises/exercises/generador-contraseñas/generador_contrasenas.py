"""
    Programa que pide una longitud al usuario y
    genera una contraseña con esa longitud
"""
import random

# Todos los caracteres posibles de una contraseña
caracteres = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~"

longitud = input("Introduce la longitud de la contraseña: ")

contrasena = "".join(random.choice(caracteres) for _ in range(int(longitud)))

print(f"La contraseña generada es: {contrasena}")