import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { generar } from "./lib/data.mjs";

const resultado = generar();

if (resultado.errores) {
    console.error(`projects.yml no valido (${resultado.errores.length} errores):`);
    resultado.errores.forEach((e) => console.error(`  - ${e}`));
    process.exit(1);
}

console.log(
    `OK ${resultado.output.replace(dirname(dirname(fileURLToPath(import.meta.url))), ".")}`
);
