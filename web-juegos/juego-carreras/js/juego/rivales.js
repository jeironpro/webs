import { crearCoche } from "./coche.js";

const COLORES = [0xff3d6e, 0xffd166, 0x9d7bff];

export function crearRivales(cantidad) {
    const coches = [];

    for (let i = 0; i < cantidad; i += 1) {
        coches.push(crearCoche({ color: COLORES[i % COLORES.length] }));
    }

    return {
        anadirA(escena) {
            for (const coche of coches) escena.add(coche.grupo);
        },
        actualizar(rivales, dt) {
            rivales.forEach((estado, indice) => {
                const coche = coches[indice];
                if (!coche) return;

                coche.grupo.position.set(estado.x, estado.y, estado.z);
                coche.grupo.rotation.y = estado.rumbo;
                coche.actualizar({ dt, velocidad: estado.velocidad, giro: 0 });
            });
        },
    };
}
