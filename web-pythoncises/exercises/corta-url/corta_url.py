"""
    Programa que acorta una url larga.
    Pide al usuario la url larga y retorna la url corta
"""
import random

""" 
    Deberia sustituir esta diccionario por un archivo JSON o una base de datos, 
    ya que los datos solo son persistentes en un archivo o una base de datos. 
    Recomendable y seguro en una base de datos
""" 
urls = {}

# Debe ser tu servidor real
MI_SERVIDOR = "https://miservidor.com/" 

def generar_codigo_corto():
    caracteres = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

    codigo = [random.choice(caracteres) for _ in range(8)]
    return ''.join(codigo)

def validar_codigo(codigo):
    while codigo in urls.keys():
        codigo = generar_codigo_corto()
    return codigo

def acorta_url(codigo, url_larga):
    urls[codigo] = url_larga
    return MI_SERVIDOR + codigo

def redirigir(codigo_corto):
    if codigo_corto in urls.keys():
        ulr_larga = urls.get(codigo_corto)
        return ulr_larga
    else:
        print("URL no encontrada")

url = input("Introduce la URL a acortar: ")

codigo = generar_codigo_corto()
codigo_valido = validar_codigo(codigo)

url_corta = acorta_url(codigo, url)
url_redirigida = redirigir(codigo_valido)

print(f"URL corta: {url_corta}")
print(f"URL larga: {url_redirigida}")