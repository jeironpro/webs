"""
    Programa que une pdfs usando la libreria PyPDF2.
    Toma los pdfs de un directorio y los une en un solo
    pdf.
"""
import os
from PyPDF2 import PdfMerger

merger = PdfMerger()

directorio = "pdfs"
pdfs = os.listdir(directorio)
ruta_destino = "combinacion.pdf"

for pdf in pdfs:
    ruta_pdf = os.path.join(directorio, pdf)
    merger.append(ruta_pdf)

merger.write(ruta_destino)
merger.close()

print(f"PDF combinacion en {ruta_destino}")