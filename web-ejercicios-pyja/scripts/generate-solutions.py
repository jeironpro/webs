#!/usr/bin/env python3
"""Generate json/solutions.json from the site's solutions directory.

Usage:
    python3 scripts/generate-solutions.py [--source DIR]

By default it reads the "solutions/" directory at the project root and writes
"json/solutions.json". Each solution folder must be named "<id>_<slug>", where
<id> matches the "id" field of the exercises in json/python.json and
json/java.json (for example, "02_cifrado_escalonado").
"""

import argparse
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def list_solutions(source):
    """Return {language: {id: [relative paths, sorted]}}."""
    solutions = {}
    if not os.path.isdir(source):
        sys.exit(f"El directorio de origen no existe: {source}")

    for language in sorted(os.listdir(source)):
        language_dir = os.path.join(source, language)
        if not os.path.isdir(language_dir):
            continue
        solutions[language] = {}
        for category in sorted(os.listdir(language_dir)):
            category_dir = os.path.join(language_dir, category)
            if not os.path.isdir(category_dir):
                continue
            for folder in sorted(os.listdir(category_dir)):
                exercise_dir = os.path.join(category_dir, folder)
                if not os.path.isdir(exercise_dir):
                    continue
                exercise_id = folder.split("_", 1)[0]
                files = sorted(os.listdir(exercise_dir))
                solutions[language][exercise_id] = [
                    os.path.relpath(os.path.join(exercise_dir, filename), ROOT)
                    for filename in files
                ]
    return solutions


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", default=os.path.join(ROOT, "solutions"),
                        help="Directorio con las soluciones (default: solutions/)")
    args = parser.parse_args()

    solutions = list_solutions(args.source)
    target = os.path.join(ROOT, "json", "solutions.json")
    with open(target, "w", encoding="utf-8") as file:
        json.dump(solutions, file, ensure_ascii=False, indent=2)

    total = sum(len(ids) for ids in solutions.values())
    print(f"Manifest generado: {target}")
    for language, ids in solutions.items():
        print(f"  {language}: {len(ids)} soluciones")
    print(f"  total: {total}")


if __name__ == "__main__":
    main()
