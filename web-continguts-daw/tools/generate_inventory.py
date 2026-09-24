#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Genera data/files.js con el inventario de ficheros de los materiales DAW.

Uso:
    python3 tools/generate_inventory.py --materials /ruta/a/materiales
    python3 tools/generate_inventory.py --materials /ruta/a/materiales --out data/files.js

La carpeta de materiales debe contener moduls_1er_curs_24_25/ y
moduls_2n_curs_25_26/. Los ficheros no se copian: solo se genera el
catálogo con sus metadatos (el material real no se versiona).

Convenciones de este archivo:
    - Los identificadores (funciones, variables, claves JSON) van en
      inglés.
    - Los comentarios y mensajes van en español.
    - Las etiquetas de los módulos (contenido) se mantienen en catalán.
"""

import argparse
import json
import re
from pathlib import Path

# Carpeta raíz de cada curso dentro de la carpeta de materiales.
COURSE_DIRS = [
    (1, "moduls_1er_curs_24_25"),
    (2, "moduls_2n_curs_25_26"),
]

# Etiquetas de los módulos en catalán (clave: nombre de la carpeta).
MODULE_LABELS = {
    # 1r curso (2024-25)
    "0000_tutoria": "Tutoria",
    "0179_angles_professional": "Anglès professional",
    "0373_llenguatges_marques_sistemes_gestion_informacio": (
        "Llenguatges de marques i sistemes de gestió d'informació"
    ),
    "0483_sistemes_informatics": "Sistemes informàtics",
    "0484_bases_dades": "Bases de dades",
    "0485_programacio_0487_entorns_desenvolupament": (
        "Programació i entorns de desenvolupament"
    ),
    "0615_disseny_interficies_web": "Disseny d'interfícies web",
    "1709_itinerari_personal_ocupabilitat_1": (
        "Itinerari personal per a l'ocupabilitat I"
    ),
    "info_util": "Informació útil",
    "investigacio": "Investigació",
    # 2n curso (2025-26)
    "0614_desplegament_d_aplicacions_web": "Desplegament d'aplicacions web",
    "0616_projecte_intermodular_de_desenvolupament_d_aplicacions_web": (
        "Projecte intermodular de desenvolupament d'aplicacions web"
    ),
    "1665_digitalitzacio_aplicada_als_sectors_productius": (
        "Digitalització aplicada als sectors productius"
    ),
    "1710_itinerari_personal_per_a_l_ocupabilitat_2": (
        "Itinerari personal per a l'ocupabilitat II"
    ),
    "client_servidor_sostenibilidad": "Client / servidor i sostenibilitat",
    "modul_professional_optatiu_machine_learning": "Optatiu: Machine Learning",
}

# Expresión regular para extraer el código oficial de 4 cifras del
# nombre de la carpeta del módulo (p. ej. "0484_bases_dades" -> "0484").
CODE_RE = re.compile(r"^(\d{4})_")


def module_code(folder_name):
    """Devuelve el código oficial del módulo si la carpeta lo lleva delante."""
    match = CODE_RE.match(folder_name)
    return match.group(1) if match else ""


def module_label(module_id):
    """Nombre legible del módulo; si no está catalogado, humaniza la carpeta."""
    return MODULE_LABELS.get(module_id, module_id.replace("_", " ").strip().title())


def scan_materials(materials_root):
    """Recorre los materiales y devuelve la lista de ficheros con metadatos."""
    files = []
    for course, dir_name in COURSE_DIRS:
        root = materials_root / dir_name
        if not root.is_dir():
            continue
        for module_dir in sorted(path for path in root.iterdir() if path.is_dir()):
            module_id = module_dir.name
            for file_path in sorted(module_dir.rglob("*")):
                if not file_path.is_file():
                    continue
                ext = (file_path.suffix or "").lstrip(".").lower()
                files.append(
                    {
                        "name": file_path.name,
                        "ext": ext,
                        "size": file_path.stat().st_size,
                        "course": course,
                        "module": module_label(module_id),
                        "moduleId": module_id,
                        "code": module_code(module_id),
                        "path": file_path.relative_to(materials_root).as_posix(),
                    }
                )
    return files


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--materials",
        default="./",
        help="carpeta raíz de los materiales (contiene moduls_1er_... y moduls_2n_...)",
    )
    parser.add_argument("--out", default="data/files.js", help="fichero de salida")
    args = parser.parse_args()

    materials_root = Path(args.materials).expanduser().resolve()
    files = scan_materials(materials_root)
    if not files:
        raise SystemExit(
            f"No se ha encontrado ningún fichero en {materials_root}. Revisa la ruta --materials."
        )

    header = "// Generado por tools/generate_inventory.py — no editar a mano.\n"
    body = (
        header
        + "export const FILES = "
        + json.dumps(files, ensure_ascii=False, separators=(",", ":"))
        + ";\n"
    )

    output = Path(args.out)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(body, encoding="utf-8")
    print(f"OK: {len(files)} ficheros -> {output}")


if __name__ == "__main__":
    main()
