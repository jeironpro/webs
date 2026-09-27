import { copyFileSync, cpSync, existsSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { execSync } from "node:child_process";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = fileURLToPath(new URL("..", import.meta.url));
const HUBS = ["web-dashboards", "web-juegos"];
const INSTALAR = process.argv.includes("--install");

// Subproyectos con build de Vite dentro de cada hub.
function subproyectos(hub) {
    return readdirSync(join(RAIZ, hub), { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => join(hub, d.name))
        .filter((sub) => {
            const pkg = join(RAIZ, sub, "package.json");
            return existsSync(pkg) && readFileSync(pkg, "utf8").includes("vite build");
        });
}

// Compila un subproyecto desde su plantilla fuente (index.src.html) y publica
// el build en su raiz: index.html, assets/ y favicon, con base relativa ./ .
function publicar(sub) {
    const base = join(RAIZ, sub);
    const plantilla = join(base, "index.src.html");
    if (!existsSync(plantilla)) {
        console.error(`  x ${sub}: falta index.src.html`);
        process.exitCode = 1;
        return;
    }

    if (INSTALAR || !existsSync(join(base, "node_modules"))) {
        execSync("yarn install --immutable", { cwd: base, stdio: "inherit" });
    }

    copyFileSync(plantilla, join(base, "index.html"));
    execSync("yarn build --base=./", { cwd: base, stdio: "inherit" });

    const dist = join(base, "dist");
    rmSync(join(base, "assets"), { recursive: true, force: true });
    cpSync(join(dist, "assets"), join(base, "assets"), { recursive: true });
    copyFileSync(join(dist, "index.html"), join(base, "index.html"));
    for (const entrada of readdirSync(dist, { withFileTypes: true })) {
        if (entrada.isFile() && entrada.name !== "index.html") {
            copyFileSync(join(dist, entrada.name), join(base, entrada.name));
        }
    }
    rmSync(dist, { recursive: true, force: true });
    console.log(`  o ${sub}`);
}

let total = 0;
for (const hub of HUBS) {
    for (const sub of subproyectos(hub)) {
        publicar(sub);
        total += 1;
    }
}
console.log(`Compilados ${total} subproyectos.`);
