import { PerspectiveCamera, Vector3 } from "three/webgpu";

const ARRIBA = new Vector3(0, 1, 0);

export function crearCamara(relacionAspecto) {
    return new PerspectiveCamera(62, relacionAspecto, 0.4, 1400);
}

/**
 * Persecución suavizada detrás del coche y órbita lenta para el menú.
 * La distancia crece con la velocidad para dar sensación de aceleración.
 */
export function crearSeguimiento(camara) {
    const deseada = new Vector3();
    const objetivo = new Vector3();
    const adelante = new Vector3();

    return {
        seguir(posicion, rumbo, dt, velocidad = 0) {
            adelante.set(Math.sin(rumbo), 0, Math.cos(rumbo));
            const distancia = 9 + Math.min(velocidad, 60) * 0.05;
            const altura = 3.6 + Math.min(velocidad, 60) * 0.012;

            deseada.copy(posicion).addScaledVector(adelante, -distancia).addScaledVector(ARRIBA, altura);
            camara.position.lerp(deseada, 1 - Math.exp(-6 * dt));

            objetivo.copy(posicion).addScaledVector(adelante, 9).addScaledVector(ARRIBA, 1.3);
            camara.lookAt(objetivo);
        },
        colocar(posicion, rumbo) {
            adelante.set(Math.sin(rumbo), 0, Math.cos(rumbo));
            camara.position
                .copy(posicion)
                .addScaledVector(adelante, -9)
                .addScaledVector(ARRIBA, 3.6);
            camara.lookAt(
                posicion.x + adelante.x * 9,
                posicion.y + 1.3,
                posicion.z + adelante.z * 9
            );
        },
        orbitar(tiempo, centro, radio = 46) {
            const angulo = 0.6 + tiempo * 0.12;
            camara.position.set(
                centro.x + Math.cos(angulo) * radio,
                centro.y + 19,
                centro.z + Math.sin(angulo) * radio
            );
            camara.lookAt(centro.x, centro.y + 1.2, centro.z);
        },
    };
}
