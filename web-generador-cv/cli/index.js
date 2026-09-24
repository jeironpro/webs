// Punto de entrada del generador de CV por línea de comandos.
// Uso: node index.js [es|ca|en...] — por defecto genera en español.
import { existsSync, mkdirSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { renderCV } from './src/renderer.js';
import { LANG_CODES } from '../shared/constants.js';

// Las rutas se resuelven respecto a la ubicación del script, no al cwd.
const cliDir = dirname(fileURLToPath(import.meta.url));
const dataPath = resolve(cliDir, 'data', 'cv-data.js');
const outputDir = resolve(cliDir, 'output');

const args = process.argv.slice(2);
const langs = args.length ? args : ['es'];

// Carga los datos del CV desde data/cv-data.js.
let data;
if (existsSync(dataPath)) {
    data = (await import(pathToFileURL(dataPath).href)).cv;
} else {
    console.error('No se encontró data/cv-data.js');
    process.exit(1);
}

mkdirSync(outputDir, { recursive: true });

// Genera un PDF para cada idioma solicitado.
for (const lang of langs) {
    if (!LANG_CODES.includes(lang)) {
        console.warn(`Idioma "${lang}" no soportado. Saltando.`);
        continue;
    }

    if (!data.profiles || !data.profiles[lang]) {
        console.warn(`No hay datos para "${lang}".`);
        continue;
    }

    const outputPath = resolve(outputDir, `cv-${lang}.pdf`);
    renderCV(data, lang, outputPath);
    console.log(`CV generado: ${outputPath}`);
}
