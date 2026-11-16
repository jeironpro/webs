# Importaciones
import hmac
import os

from flask import Flask, jsonify, request
from flask_cors import CORS
from configuracion import Config
from flask_mail import Mail, Message
from smtplib import SMTPException
from pathlib import Path

# Iniciar la aplicación
app = Flask(__name__)

# Carga la configuración
app.config.from_object(Config)

# Iniciar el servidor mail
mail = Mail(app)

# CORS solo para los orígenes configurados (nunca "*" con credenciales).
origins = [o.strip() for o in app.config.get("FRONTEND_URL", "").split(",") if o.strip()]
if not origins:
    origins = [
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]
CORS(app, origins=origins, allow_headers=["Content-Type", "X-API-Key"])


def _api_key_valida():
    """Valida X-API-Key en comparación de tiempo constante y falla cerrado."""
    esperada = app.config.get("API_KEY")
    if not esperada:
        return None  # servidor mal configurado
    recibida = request.headers.get("X-API-Key", "")
    return hmac.compare_digest(recibida, esperada)


def _autorizar():
    """Devuelve una respuesta de error si la petición no está autorizada."""
    estado = _api_key_valida()
    if estado is None:
        return jsonify({"error": "API_KEY no configurada en el servidor"}), 503
    if not estado:
        return jsonify({"error": "API Key inválida o no proporcionada"}), 401
    return None


def _error_campos(campos_faltantes):
    return jsonify({"error": "Faltan los campos: " + ", ".join(campos_faltantes)}), 400


# Ruta principal
@app.route("/")
def index():
    return jsonify({"mensaje": "Envio de correos electrónicos usando smtp"})


# Envio de correo por defecto
@app.route("/enviar_correo", methods=["POST"])
def enviar_correo():
    no_autorizado = _autorizar()
    if no_autorizado:
        return no_autorizado

    try:
        if not request.is_json:
            return jsonify({"error": "El body debe ser JSON"}), 400

        datos = request.json

        campos_obligatorios = ["subject", "to", "message"]
        campos_faltantes = [campo for campo in campos_obligatorios if not datos.get(campo)]

        if campos_faltantes:
            return _error_campos(campos_faltantes)

        mensaje = Message(
            subject=datos.get("subject"),
            sender=app.config["MAIL_SENDER"],
            recipients=[datos.get("to")],
            body=datos.get("message"),
        )

        mail.send(mensaje)

        return jsonify({"exito": "Correo enviado correctamente"})
    except SMTPException:
        return jsonify({"error": "Error SMTP"}), 502
    except Exception:
        # No se filtran detalles internos al cliente.
        return jsonify({"error": "Error interno"}), 500


# Envio de correo usando una plantilla HTML
@app.route("/enviar_correo_html", methods=["POST"])
def enviar_correo_html():
    no_autorizado = _autorizar()
    if no_autorizado:
        return no_autorizado

    try:
        if not request.is_json:
            return jsonify({"error": "El body debe ser JSON"}), 400

        datos = request.json

        campos_obligatorios = ["subject", "to"]
        campos_faltantes = [campo for campo in campos_obligatorios if not datos.get(campo)]

        if campos_faltantes:
            return _error_campos(campos_faltantes)

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
            html=contenido_html,
        )

        mail.send(mensaje)

        return jsonify({"exito": "Correo enviado correctamente"})
    except SMTPException:
        return jsonify({"error": "Error SMTP"}), 502
    except Exception:
        # No se filtran detalles internos al cliente.
        return jsonify({"error": "Error interno"}), 500


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=int(os.getenv("PORT", "5000")), debug=False)
