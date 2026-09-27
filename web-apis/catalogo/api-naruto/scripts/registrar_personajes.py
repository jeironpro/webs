#!/usr/bin/env python3
"""
Script para guardar los registros en la base de datos con los personajes de Naruto.
Se conecta a la API REST usando httpx.
"""

# Importa módulos del sistema para manejo de archivos, rutas y argumentos
import os
import json
import argparse

# Importa Path de pathlib para manejo seguro y moderno de rutas de archivos
from pathlib import Path

# Importa httpx para hacer peticiones HTTP a la API
import httpx


# Define la ruta base del proyecto
RUTA_BASE = Path(__file__).resolve().parent.parent

# Ruta al archivo JSON con los datos de los personajes
JSON_DATA = RUTA_BASE / "data" / "personajes.json"

# Define la función principal del script
def main():
    """
    Proceso principal:
    1. Lee el archivo JSON con los datos de los personajes de Naruto.
    2. Crea cada personaje en la API mediante POST /personajes.
    """
    # Configura el analizador de argumentos de línea de comandos
    parser = argparse.ArgumentParser(
        description="Poblar la base de datos con los personajes de Naruto"
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

    # Verifica que el archivo JSON exista
    if not JSON_DATA.exists():
        print(f"ERROR: No se encontró el archivo de datos en {JSON_DATA}")
        raise SystemExit(1)

    # Abre y carga el contenido del archivo JSON
    with open(JSON_DATA, encoding="utf-8") as f:
        personajes = json.load(f)

    # Muestra el total de personajes que se van a procesar
    print(f"Total personajes a procesar: {len(personajes)}")

    # ------------------------------ PASO 2: CREAR PERSONAJES ------------------------------

    # Itera sobre cada personaje para crearlo en la API
    for i, personaje in enumerate(personajes, 1):
        # Construye el payload con los datos que espera el endpoint
        payload = {
            "nombre": personaje["nombre"],
            "aldea": personaje["aldea"],
            "equipo": personaje["equipo"],
            "rango": personaje["rango"],
            "habilidades": personaje["habilidades"],
            "debilidades": personaje["debilidades"],
            "fortalezas": personaje["fortalezas"],
            "estadisticas": personaje["stats"]
        }

        # Envía la petición POST para crear el personaje
        response = client.post("/personajes", json=payload)

        # Verifica si la creación fue exitosa
        if response.status_code != 200:
            # Muestra un mensaje de error si falló la creación
            print(f"ERROR al crear {personaje['nombre']}: {response.status_code} {response.text}")
        else:
            # Muestra el progreso de la creación
            print(f"[{i}/{len(personajes)}] Creado: {personaje['nombre']}")

    # Muestra un mensaje de finalización
    print("\nProceso completado.")


# Punto de entrada del script
if __name__ == "__main__":
    main()
