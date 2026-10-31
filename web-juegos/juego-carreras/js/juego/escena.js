import {
    BoxGeometry,
    CircleGeometry,
    Color,
    DirectionalLight,
    FogExp2,
    HemisphereLight,
    InstancedMesh,
    Mesh,
    MeshBasicNodeMaterial,
    MeshStandardNodeMaterial,
    Object3D,
    Scene,
    SphereGeometry,
} from "three/webgpu";
import { crearAzar } from "./utilidades.js";

export function crearEscena() {
    const escena = new Scene();
    escena.background = new Color(0x060a16);
    escena.fog = new FogExp2(0x0a1224, 0.0019);

    const ambiente = new HemisphereLight(0x8aa6ff, 0x141d33, 2.3);
    escena.add(ambiente);

    // Relleno sin sombras desde el lado opuesto: separa el coche del asfalto en
    // las curvas donde la luz principal queda de espaldas.
    const relleno = new DirectionalLight(0x6f8bff, 0.9);
    relleno.position.set(-140, 90, -120);
    escena.add(relleno);

    const luna = new DirectionalLight(0xcfe0ff, 3.4);
    luna.position.set(120, 190, 80);
    luna.castShadow = true;
    luna.shadow.mapSize.set(2048, 2048);
    luna.shadow.camera.left = -220;
    luna.shadow.camera.right = 220;
    luna.shadow.camera.top = 220;
    luna.shadow.camera.bottom = -220;
    luna.shadow.camera.far = 620;
    luna.shadow.bias = -0.0008;
    escena.add(luna);
    escena.add(luna.target);

    const suelo = new Mesh(
        new CircleGeometry(900, 72).rotateX(-Math.PI / 2),
        new MeshStandardNodeMaterial({ color: 0x0a1220, roughness: 0.96, metalness: 0.06 })
    );
    suelo.position.y = -0.35;
    suelo.receiveShadow = true;
    escena.add(suelo);

    escena.add(crearLuna());
    escena.add(crearEstrellas());
    escena.add(crearPerfilUrbano());

    return { escena, luces: { luna } };
}

function crearLuna() {
    const cuerpo = new Mesh(
        new SphereGeometry(24, 28, 28),
        new MeshBasicNodeMaterial({ color: 0xe6eeff })
    );
    cuerpo.position.set(-300, 210, -360);
    return cuerpo;
}

function crearEstrellas() {
    const azar = crearAzar(7);
    const cantidad = 180;
    const estrellas = new InstancedMesh(
        new SphereGeometry(0.9, 6, 6),
        new MeshBasicNodeMaterial({ color: 0xcfe0ff }),
        cantidad
    );
    const matriz = new Object3D();

    for (let i = 0; i < cantidad; i += 1) {
        const angulo = azar() * Math.PI * 2;
        const radio = 520 + azar() * 320;
        matriz.position.set(
            Math.cos(angulo) * radio,
            90 + azar() * 300,
            Math.sin(angulo) * radio
        );
        const escala = 0.6 + azar() * 1.4;
        matriz.scale.setScalar(escala);
        matriz.updateMatrix();
        estrellas.setMatrixAt(i, matriz.matrix);
    }

    estrellas.instanceMatrix.needsUpdate = true;
    return estrellas;
}

function crearPerfilUrbano() {
    const azar = crearAzar(31);
    const cantidad = 64;
    const material = new MeshStandardNodeMaterial({
        color: 0x0a1020,
        emissive: 0x22306b,
        emissiveIntensity: 0.8,
        roughness: 0.9,
    });
    const edificios = new InstancedMesh(new BoxGeometry(1, 1, 1), material, cantidad);
    const matriz = new Object3D();

    for (let i = 0; i < cantidad; i += 1) {
        const angulo = (i / cantidad) * Math.PI * 2 + azar() * 0.06;
        const radio = 330 + azar() * 150;
        const alto = 34 + azar() * 96;
        const ancho = 14 + azar() * 22;

        matriz.position.set(Math.cos(angulo) * radio, alto / 2, Math.sin(angulo) * radio);
        matriz.scale.set(ancho, alto, ancho);
        matriz.rotation.y = angulo;
        matriz.updateMatrix();
        edificios.setMatrixAt(i, matriz.matrix);
    }

    edificios.instanceMatrix.needsUpdate = true;
    return edificios;
}
