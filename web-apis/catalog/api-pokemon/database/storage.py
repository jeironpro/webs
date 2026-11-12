# Importa el módulo os para acceder a las variables de entorno del sistema
import os

# Importa uuid para generar nombres de archivo únicos
import uuid

# Importa la función create_client de supabase para conectar con Supabase Storage
from supabase import create_client


# Lee la URL del proyecto de Supabase desde las variables de entorno
SUPABASE_URL = os.getenv("SUPABASE_URL")

# Lee la Service Role Key de Supabase desde las variables de entorno
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

# Nombre del bucket donde se almacenarán las imágenes de los Pokémon
BUCKET_NAME = "pokemon-imagenes"


# Inicializa el cliente de Supabase solo si ambas credenciales están configuradas
supabase_client = None

if SUPABASE_URL and SUPABASE_SERVICE_KEY:
    # Crea el cliente de Supabase con la URL y la Service Role Key
    supabase_client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


# Define una función para subir una imagen a Supabase Storage
def subir_imagen_a_supabase(file_content: bytes, file_extension: str, content_type: str) -> str:
    """
    Sube un archivo de imagen al bucket de Supabase Storage y devuelve la URL pública.
    Si el bucket no existe, intenta crearlo automáticamente.
    """
    # Verifica que el cliente de Supabase esté configurado
    if supabase_client is None:
        raise RuntimeError(
            "Supabase no está configurado. "
            "Configura SUPABASE_URL y SUPABASE_SERVICE_KEY en el archivo .env"
        )

    # Genera un nombre de archivo único usando UUID para evitar colisiones
    nombre_archivo = f"{uuid.uuid4().hex}{file_extension}"

    # Obtiene una referencia al bucket de almacenamiento
    bucket = supabase_client.storage.from_(BUCKET_NAME)

    # Intenta subir el archivo al bucket
    bucket.upload(
        path=nombre_archivo,
        file=file_content,
        file_options={"content-type": content_type}
    )

    # Obtiene la URL pública del archivo recién subido
    url_publica = bucket.get_public_url(nombre_archivo)

    # Devuelve la URL pública para almacenarla en la base de datos
    return url_publica
