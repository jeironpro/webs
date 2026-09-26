#!/usr/bin/env python3
"""Recorta el contenido animado de los GIFs del dataset.

Los GIFs de origen son lienzos 180x180 con grandes márgenes muertos alrededor
del sujeto animado (~165x95). Al mostrar esa media a un tamaño razonable en la
UI, el escalado 2-4x degrada la nitidez. Este script calcula el bounding box del
contenido (unión de regiones no-fondo entre frames) y recorta el lienzo a ese
bbox, manteniendo la animación y su delta-coding, de forma que el sujeto se
pueda mostrar a un tamaño mayor sin más escalado.

Dependencias: Python 3 + Pillow (detección del bbox) e ImageMagick (recorte
optimizado). Es idempotente: solo procesa GIFs de 180x180 (los ya recortados
se omiten). El dataset fuente queda intacto.

Uso:
    python3 scripts/optimize-media.py [--src DIR] [--dst DIR] [--tol N] [--pad N]

Por defecto procesa exercises-dataset-main/videos -> public/videos.
"""

import argparse
import glob
import os
import shutil
import subprocess
import sys

from PIL import Image, ImageSequence, ImageChops

CANVAS_SIZE = (180, 180)
DEFAULT_SRC = 'exercises-dataset-main/videos'
DEFAULT_DST = 'public/videos'


def find_imagemagick():
    """Devuelve el binario de ImageMagick disponible o lanza un error claro."""
    for binary in ('magick', 'convert'):
        path = shutil.which(binary)
        if path:
            return path
    raise RuntimeError(
        'No se encontró ImageMagick. Instálalo (apt install imagemagick) para '
        'optimizar los GIFs.'
    )


def content_bbox(image, tol):
    """Bounding box del contenido animado: unión de regiones no-fondo entre frames."""
    union = None
    for frame in ImageSequence.Iterator(image):
        frame = frame.convert('RGB')
        background = frame.getpixel((0, 0))
        diff = ImageChops.difference(frame, Image.new('RGB', frame.size, background))
        mask = diff.convert('L').point(lambda v: 255 if v > tol else 0)
        box = mask.getbbox()
        if union is None:
            union = box
        elif box is not None:
            union = (
                min(union[0], box[0]),
                min(union[1], box[1]),
                max(union[2], box[2]),
                max(union[3], box[3]),
            )
    return union


def is_processed(dst_path):
    """True si el destino ya existe recortado (cualquier tamaño distinto de 180x180)."""
    if not os.path.exists(dst_path):
        return False
    try:
        with Image.open(dst_path) as image:
            return image.size != CANVAS_SIZE
    except (OSError, Image.UnidentifiedImageError):
        return False


def crop_gif(src_path, dst_path, tol, pad, magick):
    """Recorta un GIF a su contenido. Devuelve el bbox aplicado o None si no recorta."""
    with Image.open(src_path) as image:
        if image.size != CANVAS_SIZE:
            return None
        box = content_bbox(image, tol)
        if box is None:
            return None
        area_ratio = ((box[2] - box[0]) * (box[3] - box[1])) / (image.width * image.height)
        if area_ratio >= 0.95:
            return None
        x0, y0, x1, y1 = box
        x0 = max(0, x0 - pad)
        y0 = max(0, y0 - pad)
        x1 = min(image.width, x1 + pad)
        y1 = min(image.height, y1 + pad)

    geometry = f'{x1 - x0}x{y1 - y0}+{x0}+{y0}'
    subprocess.run(
        [magick, src_path, '-coalesce', '-crop', geometry, '+repage',
         '-layers', 'optimize', '-loop', '0', dst_path],
        check=True,
        capture_output=True,
    )
    return (x0, y0, x1, y1)


def main():
    parser = argparse.ArgumentParser(description='Recorta los GIFs del dataset a su contenido animado.')
    parser.add_argument('--src', default=DEFAULT_SRC, help='Carpeta de origen (dataset).')
    parser.add_argument('--dst', default=DEFAULT_DST, help='Carpeta de destino (public).')
    parser.add_argument('--tol', type=int, default=30, help='Tolerancia de color del fondo (0-255).')
    parser.add_argument('--pad', type=int, default=4, help='Padding extra alrededor del contenido.')
    parser.add_argument('--dry-run', action='store_true', help='Solo informa de los GIFs a recortar.')
    args = parser.parse_args()

    if not os.path.isdir(args.src):
        sys.exit(f'No existe la carpeta de origen: {args.src}')
    os.makedirs(args.dst, exist_ok=True)

    magick = find_imagemagick()
    files = sorted(glob.glob(os.path.join(args.src, '*.gif')))
    if not files:
        sys.exit(f'No hay GIFs en {args.src}')

    cropped = 0
    skipped = 0
    for src_path in files:
        dst_path = os.path.join(args.dst, os.path.basename(src_path))
        if is_processed(dst_path):
            skipped += 1
            continue
        if args.dry_run:
            with Image.open(src_path) as image:
                if image.size != CANVAS_SIZE:
                    skipped += 1
                    continue
                box = content_bbox(image, args.tol)
                if box is None or ((box[2] - box[0]) * (box[3] - box[1])) / (image.width * image.height) >= 0.95:
                    skipped += 1
                    continue
            cropped += 1
            print(f'{os.path.basename(src_path)}: {box[2] - box[0]}x{box[3] - box[1]}')
            continue

        box = crop_gif(src_path, dst_path, args.tol, args.pad, magick)
        if box is None:
            skipped += 1
        else:
            cropped += 1
            print(f'{os.path.basename(src_path)}: {box[2]-box[0]}x{box[3]-box[1]}')

    print(f'Listo: {cropped} recortados, {skipped} sin cambios.')


if __name__ == '__main__':
    main()
