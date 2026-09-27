# Importa el módulo os para acceder a las variables de entorno del sistema
import os

# Importa create_engine para crear el motor de conexión a la base de datos
# y Session para manejar las sesiones de base de datos
from sqlmodel import create_engine, Session

# Importa load_dotenv para cargar las variables de entorno desde un archivo .env
from dotenv import load_dotenv

# Carga las variables de entorno definidas en el archivo .env
load_dotenv()

# Lee la URL de conexión a la base de datos desde la variable de entorno DATABASE_URL
DATABASE_URL = os.getenv("DATABASE_URL")

# Verifica que la variable DATABASE_URL esté configurada
if not DATABASE_URL:
    # Lanza un error si no se encontró la variable de entorno
    raise ValueError(
        "DATABASE_URL no está configurada. "
        "Crea un archivo .env con DATABASE_URL=..."
    )

# Crea el motor de conexión a la base de datos usando la URL configurada
engine = create_engine(DATABASE_URL)

# Define una función generadora que proporciona sesiones de base de datos
def obtener_db():
    """
    Generador de sesiones de base de datos.
    Se utiliza como dependencia de FastAPI para inyectar la sesión en los endpoints.
    La sesión se cierra automáticamente al finalizar la petición.
    """
    # Crea una nueva sesión usando el motor de base de datos
    db = Session(engine)

    try:
        # Cede la sesión al endpoint que la solicitó
        yield db
    finally:
        # Cierra la sesión automáticamente cuando termina la petición
        db.close()
