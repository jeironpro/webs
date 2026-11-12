#!/usr/bin/env python3
"""
Script para guardar los registros en la base de datos con los 1025 Pokémon y sus imágenes.
Se conecta a la API REST usando httpx.
"""

# Importa módulos del sistema para manejo de archivos, rutas y argumentos
import os
import sys
import json
import argparse

# Importa Path de pathlib para manejo seguro y moderno de rutas de archivos
from pathlib import Path

# Importa unicodedata para normalizar caracteres especiales (acentos, etc.)
import unicodedata

# Importa httpx para hacer peticiones HTTP a la API
import httpx


# Define las rutas fijas donde se encuentran los datos y las imágenes usando Path
RUTA_BASE = Path.home() / "Repositorios" / "privado"
JSON_DIR = RUTA_BASE / "coleccion-pokemon-json"
IMAGES_DIR = RUTA_BASE / "imagenes-pokemon"


# Define una función para normalizar nombres eliminando acentos, guiones, espacios y signos
def _normalizar(texto: str) -> str:
    """
    Elimina acentos, guiones bajos, espacios, guiones y puntos de un texto,
    y lo convierte a minúsculas para poder comparar nombres de forma flexible.
    Ejemplo: 'Código_Cero' -> 'codigocero', 'Mr._Mime' -> 'mrmime'.
    """
    # Separa los caracteres base de los acentos y descarta los acentos
    texto_sin_acentos = unicodedata.normalize("NFKD", texto).encode("ascii", "ignore").decode("ascii")
    # Convierte a minúsculas y elimina guiones bajos, espacios, guiones y puntos
    for caracter in ["_", " ", "-", "."]:
        texto_sin_acentos = texto_sin_acentos.replace(caracter, "")
    # Retorna el texto completamente normalizado
    return texto_sin_acentos.lower()


# Define una función para construir un mapa de imágenes con nombres normalizados
def _build_image_map() -> dict[str, str]:
    """
    Recorre todas las subcarpetas de imágenes y construye un diccionario
    que mapea el nombre normalizado del Pokémon a la ruta completa del archivo.
    Esto permite buscar imágenes aunque el nombre tenga diferencias de formato.
    """
    # Inicializa un diccionario vacío para el mapa de imágenes
    image_map = {}
    # Itera sobre todos los archivos .png dentro del directorio de imágenes (búsqueda recursiva)
    for archivo in IMAGES_DIR.rglob("*.png"):
        # Obtiene el nombre del archivo sin extensión
        nombre_sin_ext = archivo.stem
        # Normaliza el nombre para usarlo como clave
        clave = _normalizar(nombre_sin_ext)
        # Guarda la ruta completa (como string) en el mapa
        image_map[clave] = str(archivo.resolve())
    # Retorna el mapa de imágenes
    return image_map


# Construye el mapa de imágenes una sola vez al cargar el módulo
IMAGE_MAP = _build_image_map()


# Define una función para cargar los colores de los tipos desde el archivo JSON
def _cargar_colores_tipos() -> dict[str, str]:
    """
    Lee el archivo tipos_colores.json y devuelve un diccionario
    que mapea el nombre del tipo a su color hexadecimal.
    """
    # Define la ruta al archivo de colores dentro del directorio de datos
    ruta_colores = JSON_DIR / "tipos_colores.json"
    # Verifica que el archivo exista
    if not ruta_colores.exists():
        # Muestra un error y termina el script si no se encuentra el archivo
        print(f"ERROR: No se encontró el archivo {ruta_colores}")
        sys.exit(1)
    # Abre y carga el archivo JSON
    with open(ruta_colores, encoding="utf-8") as f:
        datos = json.load(f)
    # Convierte la lista de objetos a un diccionario: {nombre: color}
    return {tipo["nombre"]: tipo["color"] for tipo in datos}


# Carga los colores de los tipos desde el archivo JSON al cargar el módulo
COLORES_TIPOS = _cargar_colores_tipos()


# Mapea el nombre textual de la generación a su número correspondiente
MAPA_GENERACIONES = {
    "primera": 1, "segunda": 2, "tercera": 3, "cuarta": 4,
    "quinta": 5, "sexta": 6, "septima": 7, "octava": 8, "novena": 9
}


# Define la función principal del script
def main():
    """
    Proceso principal:
    1. Lee todos los archivos JSON con los datos de los Pokémon.
    2. Crea cada Pokémon en la API mediante POST /agregar_pokemon.
    3. Obtiene la lista completa de Pokémon para mapear nombres a IDs.
    4. Sube la imagen de cada Pokémon mediante POST /pokemones/{id}/imagen.
    """
    # Configura el analizador de argumentos de línea de comandos
    parser = argparse.ArgumentParser(
        description="Poblar la base de datos con los 1025 Pokémon y sus imágenes"
    )
    # Argumento para la URL base de la API
    parser.add_argument(
        "--api-url",
        default=os.getenv("API_URL", "http://localhost:8000"),
        help="URL base de la API (ej: http://localhost:8000 o https://tu-app.render.com)"
    )
    # Argumento obligatorio para la API Key de autenticación
    parser.add_argument(
        "--api-key",
        required=True,
        help="API Key para autenticación (header X-API-Key)"
    )
    # Analiza los argumentos recibidos
    args = parser.parse_args()

    # Almacena la URL base sin la barra final
    api_url = args.api_url.rstrip("/")
    # Almacena la API Key
    api_key = args.api_key

    # Define los headers de autenticación que se enviarán en cada petición
    headers = {"X-API-Key": api_key}
    # Crea un cliente HTTP con timeout de 30 segundos por petición
    client = httpx.Client(base_url=api_url, headers=headers, timeout=30)

    # ------------------------------ PASO 1: CARGAR DATOS ------------------------------

    # Inicializa una lista para almacenar todos los Pokémon con sus metadatos
    pokemons = []
    # Obtiene todos los archivos JSON de generaciones ordenados alfabéticamente
    json_files = sorted(JSON_DIR.glob("pokemons_*_generacion.json"))

    # Verifica que existan archivos JSON en la ruta indicada
    if not json_files:
        print(f"ERROR: No se encontraron archivos JSON en {JSON_DIR}")
        sys.exit(1)

    # Itera sobre cada archivo JSON
    for json_file in json_files:
        # Obtiene el nombre base del archivo (sin ruta) para mostrar en logs
        nombre_archivo = json_file.name
        # Extrae la palabra de la generación desde el nombre del archivo
        # (ej: "primera" de "pokemons_primera_generacion.json")
        palabra_generacion = nombre_archivo.split("_")[1]
        # Obtiene el número de generación usando el mapa
        generacion = MAPA_GENERACIONES.get(palabra_generacion, 0)

        # Abre y carga el contenido del archivo JSON
        with open(json_file, encoding="utf-8") as f:
            data = json.load(f)

        # Itera sobre cada Pokémon en el archivo
        for pokemon in data:
            # Guarda el nombre del archivo de origen para referencia
            pokemon["_origen_json"] = nombre_archivo
            # Busca y guarda la ruta de la imagen asociada al Pokémon usando el mapa normalizado
            pokemon["_imagen_path"] = IMAGE_MAP.get(_normalizar(pokemon["nombre"]))
            # Agrega la generación del Pokémon extraída del nombre del archivo
            pokemon["generacion"] = generacion
            # Agrega el color a cada tipo del Pokémon según el mapa de colores
            for tipo in pokemon["tipos"]:
                tipo["color"] = COLORES_TIPOS.get(tipo["nombre"], "#A8A878")
            # Agrega el Pokémon a la lista principal
            pokemons.append(pokemon)

    # Muestra el total de Pokémon que se van a procesar
    print(f"Total Pokémon a procesar: {len(pokemons)}")

    # ------------------------------ PASO 2: CREAR POKÉMON ------------------------------

    # Itera sobre cada Pokémon para crearlo en la API
    for i, pokemon in enumerate(pokemons, 1):
        # Construye el payload con los datos que espera el endpoint
        payload = {
            "nombre": pokemon["nombre"],
            "descripcion": pokemon["descripcion"],
            "generacion": pokemon["generacion"],
            "tipos": pokemon["tipos"],
            "estadisticas": pokemon["estadisticas"]
        }

        # Envía la petición POST para crear el Pokémon
        response = client.post("/agregar_pokemon", json=payload)

        # Verifica si la creación fue exitosa
        if response.status_code != 200:
            # Muestra un mensaje de error si falló la creación
            print(f"ERROR al crear {pokemon['nombre']}: {response.status_code} {response.text}")
        else:
            # Muestra el progreso de la creación
            print(f"[{i}/{len(pokemons)}] Creado: {pokemon['nombre']} ({pokemon['_origen_json']})")

    # ------------------------------ PASO 3: OBTENER IDs ------------------------------

    # Obtiene la lista completa de Pokémon de la API
    response = client.get("/pokemones")

    # Verifica que la consulta sea exitosa
    if response.status_code != 200:
        # Muestra un mensaje de error y termina el script
        print(f"ERROR al obtener lista de Pokémon: {response.status_code}")
        sys.exit(1)

    # Construye un diccionario que mapea el nombre de cada Pokémon con su ID
    nombre_id_map = {p["nombre"]: p["id"] for p in response.json()}
    # Muestra cuántos Pokémon se encontraron en la base de datos
    print(f"Total Pokémon en BD: {len(nombre_id_map)}")

    # ------------------------------ PASO 4: SUBIR IMÁGENES ------------------------------

    # Itera sobre cada Pokémon para subir su imagen
    for i, pokemon in enumerate(pokemons, 1):
        # Obtiene el nombre del Pokémon
        nombre = pokemon["nombre"]
        # Busca el ID del Pokémon en el mapa de nombres a IDs
        pokemon_id = nombre_id_map.get(nombre)
        # Obtiene la ruta de la imagen
        imagen_path = pokemon["_imagen_path"]

        # Si no se encontró el ID, muestra un error y continúa con el siguiente
        if not pokemon_id:
            print(f"  ERROR: No se encontró ID para {nombre}")
            continue

        # Si no hay imagen o el archivo no existe, muestra un aviso y continúa
        if not imagen_path or not Path(imagen_path).exists():
            print(f"  [{i}/{len(pokemons)}] Sin imagen: {nombre}")
            continue

        # Abre el archivo de imagen en modo binario
        with open(imagen_path, "rb") as f:
            # Prepara el archivo para subirlo como multipart/form-data
            files = {"file": (Path(imagen_path).name, f, "image/png")}
            # Envía la petición POST para subir la imagen
            response = client.post(f"/pokemones/{pokemon_id}/imagen", files=files)

            # Verifica si la subida fue exitosa
            if response.status_code != 200:
                # Muestra un mensaje de error si falló la subida
                print(f"  ERROR al subir imagen de {nombre}: {response.status_code}")
            else:
                # Muestra el progreso de la subida de imágenes
                print(f"  [{i}/{len(pokemons)}] Imagen subida: {nombre}")

    # Muestra un mensaje de finalización
    print("\nProceso completado.")


# Punto de entrada del script
if __name__ == "__main__":
    main()
