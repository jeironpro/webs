"""
    Programa de reconocimiento facial usando las librerias opencv y face_recognition, compara el rostro de una imagen con el rostro que se posicione frente a la camara y verifica si coincide o no, mostrando el resultado de la comparación en el recuadro del detector de rostros y tambien muestra un aproximado de la distancia entre la coincidencia. 
"""
import cv2
import face_recognition
import os

# Ruta de la imagen de la comparación
ruta_imagen = "rostro.jpg"

# Verificar si la imagen existe
if not os.path.exists(ruta_imagen):
    print("La imagen no existe")
    exit()

# Cargar la imagen a comparar
cargar_imagen = face_recognition.load_image_file(ruta_imagen)

"""
    El método face_encodings(imagen_cargada) busca todos los rostros en la imagen y genera un vector numérico de 128 dimensiones que representa las características faciales únicas de cada rostro. El vector se llama "encoding" o codificación facial.
"""
# Tomar la primera codificación de la lista
codificacion_imagen = face_recognition.face_encodings(cargar_imagen)[0]

# Cargar la cámara
camara = cv2.VideoCapture(0)

while True:
    """
        El método .read() lee una imagen (frame) desde el objeto VideoCapture, puede ser tanto una cámara como un archivo de video.
    """
    lectura_existosa, imagen_camara = camara.read()

    # Verificar si la lectura de la imagen se realizo correctamente
    if not lectura_existosa:
        print("No se leer la imagen")
        break
    
    """
        El método cv2.cvtColor(imagen, cv2.COLOR_BGR2RGB) convierte una imagen (frame) de color (BGR) a RGB. La imagen pasa de 3 canales de color (azul, verde, rojo) a una imagen de 3 canales (rojo, verde, azul). 
    """
    conversion_imagen_rgb = cv2.cvtColor(imagen_camara, cv2.COLOR_BGR2RGB)

    """
        El método face_recognition.face_locations(imagen_rgb) toma una imagen en RGB y analiza dónde se encuentran los rostros y devuelve una lista de coordenadas, una por cada rostro detectado.

        Formato de las coordenadas devueltas: tupla de 4 valores (top, right, bottom, left).

        top: fila superior del rostro

        right: columna derecha del rostro

        bottom: fila inferior del rostro

        left: columna izquierda del rostro
    """
    localizaciones_caras = face_recognition.face_locations(conversion_imagen_rgb)
    
    """
        El método face_recognition.face_encodings(imagen_rgb, localizaciones_caras) toma la imagen en rgb y una lista de coordenadas de rostros para cada rostro de la lista calcula un vector de 128 dimensiones llamado encoding o codificación facial. El vector captura las características únicas del rostro, como la distancia entre ojos, forma de la nariz, contorno del rostro, y más. Devolviendo una lista de vectores uno por cada rostro detectado, cada vector tiene 128 números flotantes que representa el rosotro de manera matemática.
    """
    codificaciones_caras = face_recognition.face_encodings(conversion_imagen_rgb, localizaciones_caras)

    """
        Desempaqueta cada tupla de coordenadas de la cara. Estas coordenadas se usan para dibujar rectángulos o mostrar texto alrededor del rostro

        zip(localizaciones_caras, codificaciones_caras) une las dos listas y devuelve pares (coordenadas, codificacion) que corresponden al mismo rostro.
    """
    for (arriba, derecha, abajo, izquierda), codificacion_cara in zip(localizaciones_caras, codificaciones_caras):
        """
            El método face_recognition.compare_faces(lista_codificacion_imagen, codificacion_a_comparar) compara las codificiones obtenidas de la imagen y la codificaciones del rostro en la cámara y devuelve una lista de valores boolenos (True o False), uno por cada codificación de referencia.
        """
        coincide = face_recognition.compare_faces([codificacion_imagen], codificacion_cara)

        """
            El método face_recognition.face_distance(lista_codificacion_imagen, codificacion_a_comparar) calcula la distancia euclidiana entre los vectores de codificación (los 128 números) de cada rostro de referencia y el rostro a comparar y devuelve una lista de distancias donde cada distancia es un número flotante. Los valores más bajos indican que los rostros son más parecidos y los valores más altos indican que los rostros son diferentes.
        """
        distancia = face_recognition.face_distance([codificacion_imagen], codificacion_cara)[0]

        # Guardar color verde si los rostros coinciden y rojo de lo contrario
        color = (0, 255, 0) if coincide[0] else (0, 0, 255)
        
        """
            El método cv2.rectangle(imagen_camara, (coordenadas_de_las_esquina_superior_izquierda), (coordenadas_de_las_esquina_inferior_derecha), color, grosor_linea) dibuja un rectángulo alrededor del rostro detectado en la imagen.
        """
        cv2.rectangle(imagen_camara, (izquierda, arriba), (derecha, abajo), color, 2)

        # Guardar "Coincide" si hay coincidencias en los rostros, de lo contrario guardar "No coincide"
        texto = "Coincide" if coincide[0] else "No coincide"
        
        """
            El método cv2.putText(imagen_camara, texto, posicion_del_texto, tipo_de_fuente, tamaño_del_texto, color, grosor_del_texto) sirve para escribir el texto sobre la imagen encima del rectángulo que rodea el rostro.
        """
        cv2.putText(imagen_camara, f"{texto} ({distancia:.2f})", (izquierda, arriba-10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)

    # Muestra el video en una ventana con el titulo "Reconocimiento Facial"
    cv2.imshow("Reconocimiento Facial", imagen_camara)

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