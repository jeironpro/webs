"""
    Programa que escanea documentos pdf usando OCR (Optical Character Recognition o Reconocimiento Óptico de Caracteres) que es un tecnica que se utiliza para leer texto desde imágenes o documentos y convertirlos a texto editable
"""
import fitz
import pytesseract
from pdf2image import convert_from_path

ruta_archivo = "comandos_esenciales_docker_engine.pdf"

texto_total = ""

# Abrir el documento
documento_pdf = fitz.open(ruta_archivo)

# Iterar cada página del documento
for numero, pagina in enumerate(documento_pdf, start=1):
    texto = pagina.get_text().strip() # Obtener el texto

    # Si el documento no tiene texto, tratar imagenes
    if not texto:
        print(f"Página {numero}: sin texto, aplicando OCR...")
        # Tratar el documento como imagen
        imagen = convert_from_path(ruta_archivo, first_page=numero, last_page=numero)[0]
        # Usar ocr para convertir la imagen en texto
        texto = pytesseract.image_to_string(imagen)
    else:
        print(f"Página {numero}: texto digital detectado")
    
    # Guardar el texto de cada pagina 
    texto_total += f"\n--- Página {numero} ---\n{texto}\n"

# Mostrar el texto obtenido
print(texto_total)