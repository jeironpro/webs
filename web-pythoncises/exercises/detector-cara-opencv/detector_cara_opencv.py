"""
    Programa que detecta rostros que se posicionen frente a la cámara.
    Utiliza la libreria opencv para abrir la camara y detectar los rostros.
"""
import cv2
"""
    Función	                  Descripción
    cv2.imread()	          Cargar imagen
    cv2.imwrite()	          Guardar imagen
    cv2.VideoCapture()	      Leer cámara o video
    cv2.cvtColor()	          Cambiar espacio de color
    cv2.GaussianBlur()	      Aplicar desenfoque
    cv2.Canny()	              Detectar bordes
    cv2.resize()	          Redimensionar imagen
    cv2.threshold()	          Umbralización (blanco/negro)
    cv2.findContours()	      Detección de contornos
    cv2.CascadeClassifier()	  Detección facial
"""

# Clasificador de rostros preentranado de OpenCV
clasificador_rostros = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# Cargar la cámara
camara = cv2.VideoCapture(0)

# Verificar si la camara no se abre
if not camara.isOpened():
    print("No se pudo acceder a la cámara")
    exit()

while True:
    """
        El método .read() lee una imagen (frame) desde el objeto VideoCapture, puede ser tanto una cámara como un archivo de video.
    """
    lectura_exitosa, imagen = camara.read()

    # Verificar si la lectura de la imagen se realizo correctamente
    if not lectura_exitosa:
        print("No se leer la imagen")
        break

    """
        El método cv2.cvtColor(imagen, cv2.COLOR_BGR2GRAY) convierte una imagen (frame) de color (BGR) a escala de grises (GRAY). La imagen pasa de 3 canales de color (azul, verde, rojo) a una imagen de un solo canal (intensidad de luz). 
    """
    conversion_imagen_gray = cv2.cvtColor(imagen, cv2.COLOR_BGR2GRAY)

    """
        El método .detectMultiScale(imagen_en_escala_de_grises, reductor_de_escala, detenciones_vecinas, tamaño_del_rostro) busca un rostro dentro de la imagen.

        Devuelve una lista de coordenadas con todos los rostros detectados.
    """
    rostros = clasificador_rostros.detectMultiScale(
        conversion_imagen_gray, 
        scaleFactor=1.1, 
        minNeighbors=5, 
        minSize=(50, 50)
    )

    # Iterar la tupla de coordenadas de cada rostro detectado 
    """
        x = posición X del rostro (esquina superior izquierda)
        y = posición Y del rostro
        w = ancho del rostro detectado
        h = alto del rostro detectado
    """
    for (x, y, w, h) in rostros:
        """
            El método .rectangle(imagen, coordenadas_de_la_esquina_superior_izquierda, coordenadas_de_la_esquina_inferior_derecha_sumando_ancho_y_alto, color_del_rectangulo_en_formato_BGR_(azul_verde_rojo), grosor_de_la_linea) dibuja un rectángulo sobre la imagen en la posición donde se detectó el rostro.
        """
        cv2.rectangle(imagen, (x, y), (x + w, y + h), (0, 255, 0), 2)

    # Muestra el video en una ventana con el titulo "Camara"
    cv2.imshow("Camara", imagen)

    """
        El método .waitKey(tiempo) espera una tecla del teclado durante un número determinado de milisegundos. Ademas, permite actualizar la ventana de la cámara evitando que se congele.

        & 0xFF: se asegura que el valor leido de la tecla presionada sea compatible entre sistemas operativos, tomando 8 bits bajos del código ASCII.

        ord('q'): convierte el caracter q en su valor numérico ASCII.
    """
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Liberación de la cámara para que no se quede bloqueada o encendida después de cerrar el programa
camara.release()
# Cierre de todo lo que abrio cv2.imshow()
cv2.destroyAllWindows()