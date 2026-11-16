import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()


def _booleano(nombre, defecto=False):
    """Convierte variables de entorno tipo 'true/1/yes' en booleanos reales."""
    valor = os.getenv(nombre)
    if valor is None:
        return defecto
    return valor.strip().lower() in {"1", "true", "yes", "si", "sí", "on"}


class Config:
    # SECRET_KEY debe venir del entorno en produccion; el valor aleatorio
    # por arranque solo sirve para desarrollo local.
    SECRET_KEY = os.getenv("SECRET_KEY") or os.urandom(32)
    API_KEY = os.getenv("API_KEY")
    MAIL_SERVER = os.getenv("MAIL_SERVER")
    MAIL_PORT = int(os.getenv("MAIL_PORT", "587"))
    MAIL_SENDER = os.getenv("MAIL_SENDER")
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
    MAIL_USE_TLS = _booleano("MAIL_USE_TLS", True)
    MAIL_USE_SSL = _booleano("MAIL_USE_SSL", False)
    FRONTEND_URL = os.getenv("FRONTEND_URL", "")
