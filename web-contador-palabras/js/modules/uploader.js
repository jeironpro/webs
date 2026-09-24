/**
 * Lectura de archivos de texto plano en el navegador.
 * @module uploader
 */

/**
 * Lee un archivo de texto plano como UTF-8.
 * @param {File} file Archivo a leer.
 * @returns {Promise<string>} Texto leído del archivo.
 */
export function readTextFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener("load", () => resolve(String(reader.result)));
    reader.addEventListener("error", () => reject(reader.error));

    reader.readAsText(file, "UTF-8");
  });
}