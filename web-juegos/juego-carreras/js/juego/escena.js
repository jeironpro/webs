import {
    BoxGeometry,
    CanvasTexture,
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
    RepeatWrapping,
    Scene,
    SRGBColorSpace,
    SphereGeometry,
} from "three/webgpu";
import { crearAzar } from "./utilidades.js";

export function crearEscena() {
    const escena = new Scene();
    escena.background = new Color(0x060a16);
    escena.fog = new FogExp2(0x0a1224, 0.0016);

    const ambiente = new HemisphereLight(0x8aa6ff, 0x141d33, 2.3);
    escena.add(ambiente);

    // Relleno sin sombras desde el lado opuesto: separa el coche del asfalto en
    // las curvas donde la luz principal queda de espaldas.
    const relleno = new DirectionalLight(0x6f8bff, 0.9);
    relleno.position.set(-140, 90, -120);
    escena.add(relleno);

    // Luz direccional sin sombras: el coche lleva su propia sombra de contacto
    // y así el asfalto no recibe auto-sombreado.
    const luna = new DirectionalLight(0xcfe0ff, 3.4);
    luna.position.set(60, 95, 40);
    escena.add(luna);
    escena.add(luna.target);

    const suelo = new Mesh(
        new CircleGeometry(900, 72).rotateX(-Math.PI / 2),
        new MeshStandardNodeMaterial({ color: 0x0a1220, roughness: 0.96, metalness: 0.06 })
    );
    suelo.position.y = -0.35;
    escena.add(suelo);

    escena.add(crearLuna());
    escena.add(crearEstrellas());
    escena.add(crearPerfilUrbano());

    return { escena };
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

/**
 * Fachada procedural en dos mapas: el muro con sus ventanas apagadas y, aparte,
 * solo las ventanas encendidas. Así la emisión ilumina únicamente los huecos y
 * el edificio no se convierte en una masa beige al alejarse la cámara.
 */
function texturaFachada() {
    const azar = crearAzar(53);
    const ancho = 128;
    const alto = 256;
    const muro = document.createElement("canvas");
    muro.width = ancho;
    muro.height = alto;
    const luces = document.createElement("canvas");
    luces.width = ancho;
    luces.height = alto;
    const contexto = muro.getContext("2d");
    const emision = luces.getContext("2d");

    contexto.fillStyle = "#2b3a5c";
    contexto.fillRect(0, 0, ancho, alto);
    emision.fillStyle = "#000000";
    emision.fillRect(0, 0, ancho, alto);

    // Rejilla de 5x5 ventanas por baldosa: huecos grandes y separados, para que
    // la fachada se lea como un edificio y no como una trama de puntos.
    for (let fila = 0; fila < 5; fila += 1) {
        const y = 5 + fila * 26;
        // Losa de forjado entre plantas: da escala al edificio.
        contexto.fillStyle = "#1e2b44";
        contexto.fillRect(0, y - 4, ancho, 2);

        for (let columna = 0; columna < 5; columna += 1) {
            const x = 4 + columna * 26;
            if (azar() > 0.45) {
                const calida = azar() > 0.35;
                contexto.fillStyle = calida ? "#e8c48c" : "#cfd9f0";
                contexto.fillRect(x, y, 15, 14);
                emision.fillStyle = calida ? "#ffc978" : "#dfe9ff";
                emision.fillRect(x, y, 15, 14);
            } else {
                contexto.fillStyle = "#33445f";
                contexto.fillRect(x, y, 15, 14);
            }
        }
    }

    const preparar = (lienzo) => {
        const textura = new CanvasTexture(lienzo);
        textura.colorSpace = SRGBColorSpace;
        textura.wrapS = RepeatWrapping;
        textura.wrapT = RepeatWrapping;
        textura.repeat.set(1, 2);
        return textura;
    };

    return { mapa: preparar(muro), emisiva: preparar(luces) };
}

function crearPerfilUrbano() {
    const azar = crearAzar(31);
    const cantidad = 64;
    const fachada = texturaFachada();
    const material = new MeshStandardNodeMaterial({
        color: 0xffffff,
        map: fachada.mapa,
        emissive: 0xffd9a0,
        emissiveMap: fachada.emisiva,
        emissiveIntensity: 1.4,
        roughness: 0.72,
        metalness: 0.15,
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
