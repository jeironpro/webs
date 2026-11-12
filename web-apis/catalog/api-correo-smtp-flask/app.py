# Importaciones
from flask import Flask, jsonify, request
from configuracion import Config
from flask_mail import Mail, Message
from smtplib import SMTPException
from werkzeug.exceptions import BadRequest
from pathlib import Path

# Iniciar la aplicación
app = Flask(__name__)

# Carga la configuración
app.config.from_object(Config)

# Iniciar el servidor mail
mail = Mail(app)

# Ruta principal
@app.route("/")
def index():
    return jsonify({"mensaje": "Envio de correos electrónicos usando smtp"})

# Envio de correo por defecto
@app.route("/enviar_correo", methods=["POST"])
def enviar_correo():
    try:
        if not request.is_json:
            raise BadRequest("El body debe ser JSON")

        datos = request.json

        campos_obligatorios = ["subject", "to", "message"]
        campos_faltantes = [campo for campo in campos_obligatorios if not datos.get(campo)]

        if campos_faltantes:
            raise KeyError(f"Faltan los campos: {", ".join(campos_faltantes)}")
        
        mensaje = Message(
            subject=datos.get("subject"),
            sender=app.config["MAIL_SENDER"],
            recipients=[datos.get('to')],
            body=datos.get("message")
        )

        mail.send(mensaje)
        
        return jsonify({"exito": "Correo enviado correctamente"})
    except BadRequest as br:
        return jsonify({"error": f"{str(br)}"}), 400
    except SMTPException as se:
        return jsonify({"error": "Error SMTP"}), 502
    except Exception as e:
        return jsonify({"error": "Error interno"}), 500

# Envio de correo usando una plantilla HTML
@app.route("/enviar_correo_html", methods=["POST"])
def enviar_correo_html():
    try:
        if not request.is_json:
            raise BadRequest("El body debe ser JSON")

        datos = request.json

        campos_obligatorios = ["subject", "to"]
        campos_faltantes = [campo for campo in campos_obligatorios if not datos.get(campo)]

        if campos_faltantes:
            raise KeyError(f"Faltan los campos: {", ".join(campos_faltantes)}")

        ruta_template_mail = Path(app.root_path) / "template" / "mail.html"
        if ruta_template_mail.exists():
            with open(ruta_template_mail, "r", encoding="utf-8") as template:
                contenido_html = template.read()
        else:
            return jsonify({"error": "El template HTML no existe"}), 500
        
        mensaje = Message(
            subject=datos["subject"],
            sender=app.config["MAIL_SENDER"],
            recipients=[datos["to"]],
            html=contenido_html
        )

        mail.send(mensaje)
        
        return jsonify({"exito": "Correo enviado correctamente"})
    except BadRequest as br:
        return jsonify({"error": f"{str(br)}"}), 400
    except SMTPException as se:
        return jsonify({"error": "Error SMTP"}), 502
    except Exception as e:
        return jsonify({"error": "Error interno"}), 500

if __name__ == "__main__":
    app.run(debug=True)