import os
import secrets
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

class Config:
    SECRET_KEY=secrets.token_hex(64)
    MAIL_SERVER=os.getenv("MAIL_SERVER")
    MAIL_PORT=os.getenv("MAIL_PORT")
    MAIL_SENDER=os.getenv("MAIL_SENDER")
    MAIL_USERNAME=os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD")
    MAIL_USE_TLS=os.getenv("MAIL_USE_TLS")
    MAIL_USER_SSL=os.getenv("MAIL_USE_SSL")