# IMPORTACIONES
import os
from sqlmodel import Session, create_engine
from dotenv import load_dotenv

# CARGAR VARIABLES DE ENTORNO
load_dotenv()

# URL DE LA BASE DE DATOS DESDE EL .env
DATABASE_URL = os.getenv("DATABASE_URL")

# MOTOR DE LA BASE DE DATOS
engine = create_engine(DATABASE_URL)

# FUNCIÓN PARA INICIALIZAR Y CERRAR LA BASE DE DATOS EN CADA LLAMADA
def obtener_db():
    db = Session(engine)
    try: 
        yield db
    finally:
        db.close()
    return db