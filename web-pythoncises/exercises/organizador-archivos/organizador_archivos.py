"""
    Programa que organiza archivos en carpetas segun
    su extension. En una carpeta pueden ir archivos
    de mas de una extensión
"""
import os
import shutil

carpeta_archivos = {
    "documentos": ['pdf', 'txt', 'json', 'docx'],
    "hoja_de_calculo": ['xlsx', 'csv'],
    "imagenes": ['jpg', 'gif', 'png', 'jpeg'],
    "audios": ['mp3'],
    "videos": ['mp4', 'mkv', 'mov'],
    "codigo": ['py', 'js', 'java', 'c', 'html']
}

directorio = "archivos"

archivos = os.listdir(directorio)

for archivo in archivos:
    partes = archivo.split(".")

    # Verificar si el archivo es valido
    if len(partes) < 2: 
        continue

    # Tomar la extensión del archivo
    extension = partes[-1].lower()

    for carpeta, extensiones in carpeta_archivos.items():
        if extension in extensiones:
            ruta_carpeta = os.path.join(directorio, carpeta)
            ruta_origen = os.path.join(directorio, archivo)
            ruta_destino = os.path.join(ruta_carpeta, archivo)

            # Verificar y crear la carpeta de cada grupo de archivos
            if not os.path.exists(ruta_carpeta):
                os.makedirs(ruta_carpeta, exist_ok=True)
                print(f"Carpeta: {carpeta} creada correctamente")

            # Mover el archivo a su respectiva carpeta
            shutil.move(ruta_origen, ruta_destino)
            print(f"Archivo: {archivo} organizado en {ruta_destino}")
            break