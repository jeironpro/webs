// Convierte imágenes PNG de personajes a WebP optimizados en public/images.
//
// Los PNG originales (~5-22 MB cada uno) ya no viven en el proyecto: se guardan
// en una carpeta hermana FUERA del repositorio. Para añadir personajes nuevos:
//   1. Copia los .png a ../web-naruto-imagenes-originales/
//   2. Ejecuta: pnpm optimize
// El script genera el .webp optimizado en public/images (máx 800px, calidad 80).
//
// La carpeta de originales se puede personalizar con: ORIGINALES_DIR=/ruta pnpm optimize

import { readdirSync, statSync } from 'fs';
import { join, parse, resolve } from 'path';
import sharp from 'sharp';

const IMG_DIR = 'public/images';
const ORIG_DIR = process.env.ORIGINALES_DIR ?? resolve(IMG_DIR, '../../web-naruto-imagenes-originales');
const MAX_WIDTH = 800;
const QUALITY = 80;

let files;
try {
    files = readdirSync(ORIG_DIR).filter((f) => f.toLowerCase().endsWith('.png'));
} catch {
    console.error(`No se encontró la carpeta de originales: ${ORIG_DIR}`);
    console.error('Créala o especifica otra ruta con: ORIGINALES_DIR=/ruta pnpm optimize');
    process.exit(1);
}

console.log(`Originales: ${ORIG_DIR}`);
console.log(`Encontrados ${files.length} PNG(s)`);

let ok = 0;
let skip = 0;

for (const file of files) {
    const srcPath = join(ORIG_DIR, file);
    const name = parse(file).name;
    const destPath = join(IMG_DIR, `${name}.webp`);

    const srcStat = statSync(srcPath);

    let needsBuild = true;
    try {
        const destStat = statSync(destPath);
        if (destStat.mtimeMs > srcStat.mtimeMs) {
            needsBuild = false;
        }
    } catch {
        // dest no existe
    }

    if (!needsBuild) {
        skip++;
        continue;
    }

    const img = sharp(srcPath);
    const meta = await img.metadata();

    let pipeline = img;
    if (meta.width && meta.width > MAX_WIDTH) {
        pipeline = pipeline.resize(MAX_WIDTH);
    }

    await pipeline.webp({ quality: QUALITY }).toFile(destPath);

    const outSize = statSync(destPath).size;
    console.log(`  ${file} (${(srcStat.size / 1024 / 1024).toFixed(1)} MB) → ${name}.webp (${(outSize / 1024 / 1024).toFixed(2)} MB)`);
    ok++;
}

console.log(`\nHecho: ${ok} convertidas, ${skip} omitidas (ya optimizadas)`);
