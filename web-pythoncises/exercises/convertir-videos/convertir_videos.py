"""
    Programa que convierte un video de un formato a otro,
    permtiendo opcionalmente ajustar la resolución y la calidad del video
"""
import os
from moviepy import VideoFileClip

ruta_video = input("Ingrese la ruta del video: ")

# Verificar si el video existe
if not os.path.exists(ruta_video):
    print("El video no existe")
    exit()

# Cargar el video
video = VideoFileClip(ruta_video)

formato_destino = input("Ingrese el formato de salida deseado (ej: mp4, avi, mov): ")

cambio_resolucion = input("Desea cambiar la resolución del video? (si/no): ")

# Resolución original del video
ancho_resolucion = video.size[0]
alto_resolucion = video.size[1]

if cambio_resolucion == "si":
    resolucion = input("Ingresa la nueva resolución (ej: 1920x1080): ")

    partes_resolucion = resolucion.split("x")

    if len(partes_resolucion) == 2:
        ancho_resolucion = int(partes_resolucion[0])
        alto_resolucion = int(partes_resolucion[1])
    else:
        print("Formato de resolución no válido")
        exit()

cambio_calidad = input("Desea cambiar la calidad o bitrate del video? (si/no): ")
calidad = None

if cambio_calidad == "si":
    calidad = input("Ingrese el bitrate deseado en kbps (ej: 2000): ")

# Verificar y ajustar valores de resolución
if ancho_resolucion and alto_resolucion:
    video = video.resized((ancho_resolucion, alto_resolucion))

calidad_valida = None
# Verificar y validad calidad
if calidad:
    calidad_valida = f"{calidad}k"

video.write_videofile(
    f"video_convertido.{formato_destino}",
    codec="libx264",
    bitrate=calidad_valida
)   