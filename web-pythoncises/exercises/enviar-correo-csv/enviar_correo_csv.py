"""
    Programa que lee un archivo csv y 
    envia un correo electronico a los correos que encuentre
"""

import csv
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email.mime.text import MIMEText
from email import encoders

remitente = "jeironprogrammer@gmail.com"
"""
    Es necesario crear un contraseña de aplicación en gmail para que se puedan enviar los correos. 
    
    Se crea aqui: https://myaccount.google.com/apppasswords
"""
contrasena = ""
asunto = "Correos desde csv"
cuerpo = """<html>
    <body>
        <h1>Hola desde python!</h1>
        <p>Este es un correo enviado desde python con una plantilla <b>HTML</b>.</p>
    <body>
</html>
"""

with open('usuarios.csv', newline='') as archivo:
    lectura = csv.DictReader(archivo)
    correos = [columna['correo'] for columna in lectura]

for correo in correos:
    mensaje = MIMEMultipart()
    mensaje['From'] = remitente
    mensaje['To'] = correo
    mensaje['Subject'] = asunto
    mensaje.attach(MIMEText(cuerpo, 'html'))

    with smtplib.SMTP('smtp.gmail.com', 587) as servidor:
        servidor.starttls()
        servidor.login(remitente, contrasena)
        servidor.send_message(mensaje)

    print("Correo enviado!")