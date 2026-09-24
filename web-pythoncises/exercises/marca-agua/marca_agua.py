"""
    Programa que inserta marca de agua en imagenes
"""
from PIL import Image, ImageDraw, ImageFont

"""
    La imagen se convierte a un modo de color con canal alfa.

    El canal alfa controla la opacidad.

    Para marcas de agua con trasparencias se necesita que la imagen soporte el canal alfa, porque si la imagen solo soporta RGB no se puede insertar la capa de texto semitransparente correctamente.
"""
# Abrir la imagen convertida a RGBA
imagen = Image.open("imagen.jpg").convert("RGBA")

# Caracteristicas de la marca de agua
marca_agua = "JeironPro"
tamano_texto = 150
margen_derecho = 75
margen_inferior = 75

"""
    El método ImageFont.truetype carga las fuentes TrueType(TTF) para poder usarla al dibujar la marca de agua en la imagen.

    Recibe la ruta de la fuente y el tamaño como un entero que representa pixeles.

    Devuelve un objeto ImageFont.FreeTypeFont que podemos usar con ImageDraw.text() para dibujar texto con la fuente que se ha indicado y el tamaño.
"""
# Usar un fuente del sistema para pasarla al texto de la marca de agua
fuente = ImageFont.truetype("/usr/share/fonts/open-sans/OpenSans-Bold.ttf", tamano_texto)

# Crear una nueva capa transparente para insertarla en la imagen
capa = Image.new("RGBA", imagen.size, (255, 255, 255, 0))

"""
    El método ImageDraw.Draw(capa) crea un objeto (lienzo) para dibujar sobre la imagen.

    Permite dibujar texto, líneas, formas, rectángulos, círculos, etc. sobre la imagen. En este caso la imagen es una capa trasparente.
"""
dibujo = ImageDraw.Draw(capa)

"""
    El método dibujo.textbbox(posociones, texto, fuente) se usa para medir el tamaño exacto del texto antes de dibujarlo.

    Devuelve una caja delimitadora (bounding box) del texto que deseamos dibujar. Con exactitud te dice cuánto espacio ocupará el texto en pixeles, teniendo en cuenta la fuente y el tamaño.
"""
tamano_exacto_texto = dibujo.textbbox((0, 0), marca_agua, font=fuente)
"""
    Toma las posiciones x1, x0 para calcula cuanto mide horizontalmente, restando los valores a la inversa
"""
ancho_texto = tamano_exacto_texto[2] - tamano_exacto_texto[0] 
"""
    Toma las posiciones y1, y0 para calcula cuanto mide verticalmente, restando los valores a la inversa
"""
alto_texto = tamano_exacto_texto[3] - tamano_exacto_texto[1]

"""
    Posiciones del plano cartesiano a la se va a dibujar el texto en la capa (imagen).
    
    La posición x (horizontal) se obtiene restando el ancho de la imagen con el ancho del texto y el margen horizontal.

    La posición y (vertical) se obtiene restando el alto de la imagen con el alto del texto y el margen vertical.
"""
posicion_x = imagen.width - ancho_texto - margen_derecho
posicion_y = imagen.height - alto_texto - margen_inferior

# Dibujar texto en la capa
dibujo.text((posicion_x, posicion_y), marca_agua, font=fuente, fill=(255, 255, 255, 180))  # fill es el color del texto

"""
    El método Image.alpha_composite(imagen, capa) sirve para combinar dos imágenes que tienen canal alfa (transparencia), superponiendo la segunda sobre la primera.
"""
imagen_final = Image.alpha_composite(imagen, capa)

"""
    Para obtener la imagen con la marca de agua, se convierta a imagen sin transparencia RGB o mejor dicho sin canal alfa y se guarda en una nueva ruta o nombre de imagen con su formato original
"""
imagen_final.convert("RGB").save("imagen_marca_agua.jpg")
print("Marca de agua agregada correctamente")