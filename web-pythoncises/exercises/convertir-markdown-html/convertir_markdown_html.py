"""
    Programa que convierte un archivo markdown a un archivo html.
    Utiliza la libreria markdown para realizar la conversión
"""
import os
import markdown

def leer_markdown(ruta_archivo):
    with open(ruta_archivo, "r") as md:
        contenido = md.read()
    return contenido

def convertir_markdown_html(texto_md):
    html = markdown.markdown(texto_md)
    return html
    
def guardar_html(ruta_destino, contenido_html):
    with open(ruta_destino, "w") as html:
        html.write(contenido_html)

ruta_archivo_md = input("Introduce la ruta absoluta del archivo markdown: ")

if not os.path.exists(ruta_archivo_md):
    print("El archivo no existe")
else:
    texto_md = leer_markdown(ruta_archivo_md)
    html = convertir_markdown_html(texto_md)

    ruta_destino_html = "index.html"
    html_guardado = guardar_html(ruta_destino_html, html)