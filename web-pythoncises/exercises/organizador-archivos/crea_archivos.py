"""
    Programa que crea los archivos para utilizarlos en el programa organizador de archivos
"""
import os

archivos = [
    "informe_ventas_2023.pdf",
    "resumen_proyecto.txt",
    "clientes.csv",
    "configuracion.json",
    "foto_vacaciones.jpg",
    "animacion.gif",
    "logo_empresa.png",
    "imagen_producto.jpeg",
    "video_presentacion.mp4",
    "video_evento.mkv",
    "podcast_episodio1.mp3",
    "manual_usuario.pdf",
    "notas_reunion.txt",
    "base_datos.csv",
    "datos_backup.json",
    "retrato_familiar.jpg",
    "banner_animado.gif",
    "mockup.png",
    "foto_perfil.jpeg",
    "entrevista.mp4",
    "conferencia.mkv",
    "audio_intro.mp3",
    "propuesta_comercial.pdf",
    "todo_list.txt",
    "export_enero.csv",
    "settings.json",
    "paisaje.jpg",
    "icono.gif",
    "fondo_pantalla.png",
    "scan.jpeg",
    "corto.mp4",
    "documental.mkv",
    "cancion_cover.mp3",
    "factura_001.pdf",
    "readme.txt",
    "ventas_q1.csv",
    "credentials.json",
    "evento_fotos.jpg",
    "sticker.gif",
    "grafico.png",
    "imagen_producto_erronea.jpeg",
    "clip_promocional.mp4",
    "serie_ep01.mkv",
    "audiobook_ch1.mp3",
    "presentacion_final.pdf",
    "diario.txt",
    "registros.csv",
    "metadata.json",
    "captura_pantalla.jpg",
    "loop.gif",
    "diagram.png",
    "foto_antigua.jpeg",
    "trailer.mp4",
    "pelicula.mkv",
    "voz_narracion.mp3",
    "contrato_firma.pdf",
    "ideas.txt",
    "lista_contactos.csv",
    "schema.json",
    "foto_producto.jpg",
    "memes.gif",
    "mapa.png",
    "archivo_corrupto.jpeg",
    "grabacion.mp4",
    "webinar.mkv",
    "mezcla.mp3",
    "plan_marketing.pdf",
    "borrador.txt",
    "datos_clientes.csv",
    "package.json",
    "portfolio.jpg",
    "badge.gif",
    "thumbnail.png",
    "foto_evento.jpeg",
    "spot.mp4",
    "corto2.mkv",
    "master_audio.mp3",
    "informe_tecnico.pdf",
    "recetas.txt",
    "export_abril.csv",
    "locales.json",
    "foto_naturaleza.jpg",
    "gif_demo.gif",
    "avatar.png",
    "foto10.jpeg",
    "music_video.mp4",
    "documento_mk.mkv",
    "sample_track.mp3",
    "tesis_final.pdf",
    "agenda.txt",
    "inventario.csv",
    "response.json",
    "paisaje_nocturno.jpg",
    "reaction.gif",
    "sprite.png",
    "foto_extra.jpeg",
    "clip_highlight.mp4",
    "serie_ep02.mkv",
    "audio_bumeran.mp3",
    "extra_documento.pdf"
]

def crear_archivos(archivos):
    directorio = "archivos"

    if not os.path.exists(directorio):
        os.makedirs(directorio, exist_ok=True)
        print(f"La carpeta {directorio} ha sido creada")
    
    for archivo in archivos:
        ruta_archivo = os.path.join(directorio, archivo)

        with open(ruta_archivo, "w") as arc:
            pass
        
        print(f"Archivo: {archivo} creado correctamente")

crear_archivos(archivos)