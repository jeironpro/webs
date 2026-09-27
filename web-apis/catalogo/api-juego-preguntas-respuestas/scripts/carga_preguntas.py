"""
Script para cargar preguntas desde un archivo JSON a la base de datos.

Uso:
    python scripts/carga_preguntas.py                          # carga normal
    python scripts/carga_preguntas.py --clear                  # limpia DB antes de cargar
    python scripts/carga_preguntas.py --json ruta/al/archivo.json
    python scripts/carga_preguntas.py --clear --json datos.json

Requiere que DATABASE_URL este configurada en .env o variables de entorno.
"""

import argparse
import json
import os
import sys

# Agrega el directorio raiz del proyecto al path para poder importar app y models
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app, init_db
from models import Pregunta, db


def cargar(json_path, clear=False):
    if not os.path.exists(json_path):
        print(f"ERROR: No se encuentra el archivo {json_path}")
        sys.exit(1)

    with app.app_context():
        init_db()

        if clear:
            cantidad = Pregunta.query.delete()
            db.session.commit()
            print(f"Eliminadas {cantidad} preguntas existentes.")

        with open(json_path, 'r', encoding='utf-8') as f:
            datos = json.load(f)

        contador = 0
        for item in datos:
            if 'pregunta' not in item:
                continue
            p = Pregunta(
                pregunta=item['pregunta'],
                respuestas=json.dumps(item['respuestas']),
                respuesta_correcta=item['respuesta_correcta'],
                categoria=item['categoria']
            )
            db.session.add(p)
            contador += 1

        db.session.commit()
        total = Pregunta.query.count()
        print(f"Cargadas {contador} preguntas desde {json_path}")
        print(f"Total en base de datos: {total}")


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Cargar preguntas desde JSON a la base de datos')
    parser.add_argument('--json', default=None, help='Ruta al archivo JSON (default: preguntas-respuestas.json)')
    parser.add_argument('--clear', action='store_true', help='Eliminar preguntas existentes antes de cargar')
    args = parser.parse_args()

    # Si no se especifica --json, busca preguntas-respuestas.json en la raiz del proyecto
    json_path = args.json
    if json_path is None:
        basedir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        json_path = os.path.join(basedir, 'preguntas-respuestas.json')

    cargar(json_path, clear=args.clear)
