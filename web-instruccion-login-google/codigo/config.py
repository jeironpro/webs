# Importaciones
import os
import secrets
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()


class Config:
    """ Clase de configuración de variables de entorno de la aplicación """
    SECRET_KEY=secrets.token_hex(64)
    GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", None)
    GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET", None)
    GOOGLE_DISCOVERY_URL = (
        "https://accounts.google.com/.well-known/openid-configuration"
    )
    DATABASE=os.getenv("DATABASE")
    OAUTHLIB_INSECURE_TRANSPORT=os.getenv("OAUTHLIB_INSECURE_TRANSPORT")