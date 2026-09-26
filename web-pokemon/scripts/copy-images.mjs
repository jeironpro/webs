import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Script que copia las imágenes de Pokémon desde data/pokemon-images a public/pokemon-images
// para que estén disponibles como archivos estáticos en el build.

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.resolve(__dirname, '../data/pokemon-images');
const dst = path.resolve(__dirname, '../public/pokemon-images');

// Solo copia si el destino no existe (evita sobrescribir en cada ejecución)
if (!fs.existsSync(dst)) {
  fs.cpSync(src, dst, { recursive: true });
  console.log('Imagenes copiadas a public/pokemon-images/');
}
