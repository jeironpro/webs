# Importa el módulo os para configurar variables de entorno antes de importar la aplicación
import os

# Configura la URL de la base de datos de pruebas usando SQLite en un archivo local
os.environ["DATABASE_URL"] = "sqlite:///./test.db"
# Configura la API Key de pruebas para poder autenticarse en los tests
os.environ["API_KEY"] = "test-api-key-123"
# Importa pytest para definir fixtures y ejecutar las pruebas
import pytest
# Importa TestClient para simular peticiones HTTP a la aplicación FastAPI
from fastapi.testclient import TestClient
# Importa SQLModel para crear y eliminar tablas de la base de datos de pruebas
from sqlmodel import SQLModel, create_engine, Session
# Importa la aplicación principal que se va a testear
from main import app
# Importa la dependencia original de base de datos para reemplazarla en pruebas
from database.connection import obtener_db

# Crea un motor de base de datos específico para las pruebas usando SQLite
test_engine = create_engine(os.environ["DATABASE_URL"])


# Define una función que reemplaza la dependencia original de base de datos
def override_obtener_db():
    """Reemplaza la dependencia original de BD por una sesión de prueba."""
    # Crea una nueva sesión usando el motor de pruebas
    db = Session(test_engine)
    try:
        # Cede la sesión al endpoint que se está probando
        yield db
    finally:
        # Cierra la sesión automáticamente al finalizar
        db.close()


# Inyecta la función de reemplazo en la aplicación para que use la base de datos de pruebas
app.dependency_overrides[obtener_db] = override_obtener_db


# Define un fixture que se ejecuta automáticamente antes y después de cada prueba
@pytest.fixture(autouse=True)
def setup_db():
    """Crea las tablas antes de cada test y las elimina al finalizar."""
    # Crea todas las tablas en la base de datos de pruebas antes de cada test
    SQLModel.metadata.create_all(test_engine)
    # Cede el control a la prueba
    yield
    # Elimina todas las tablas después de cada test para dejar un estado limpio
    SQLModel.metadata.drop_all(test_engine)


# Define un fixture que proporciona un cliente HTTP de prueba
@pytest.fixture
def client():
    """Cliente HTTP de prueba basado en FastAPI TestClient."""
    # Retorna una instancia de TestClient configurada con la aplicación FastAPI
    return TestClient(app)


# Define un fixture que proporciona la API Key de prueba
@pytest.fixture
def api_key():
    """API Key de prueba para autenticación."""
    # Retorna la misma API Key que se configuró en las variables de entorno
    return "test-api-key-123"
