import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { generar } from "./lib/data.mjs";

const resultado = generar();

if (resultado.errores) {
    process.stderr.write(`projects.yml no valido (${resultado.errores.length} errores):`);
    resultado.errores.forEach((e) => process.stderr.write(`  - ${e}`));
    process.exit(1);
}

process.stdout.write(
    `OK ${resultado.output.replace(dirname(dirname(fileURLToPath(import.meta.url))), ".")}`
);
