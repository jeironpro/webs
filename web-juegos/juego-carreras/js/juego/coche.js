import {
    BoxGeometry,
    CylinderGeometry,
    Group,
    Mesh,
    MeshBasicNodeMaterial,
    MeshStandardNodeMaterial,
    PlaneGeometry,
} from "three/webgpu";

const RADIO_RUEDA = 0.4;

export function crearCoche({ color = 0x35c6db } = {}) {
    const grupo = new Group();
    grupo.name = "coche";
    grupo.rotation.order = "YXZ";

    const pintura = new MeshStandardNodeMaterial({ color, metalness: 0.6, roughness: 0.3 });
    const cristal = new MeshStandardNodeMaterial({ color: 0x0a1526, metalness: 0.95, roughness: 0.1 });
    const oscuro = new MeshStandardNodeMaterial({ color: 0x0d1120, roughness: 0.8 });
    const luzBlanca = new MeshBasicNodeMaterial({ color: 0xfff3d0 });
    const luzRoja = new MeshBasicNodeMaterial({ color: 0xff3860 });
    const neon = new MeshBasicNodeMaterial({ color, transparent: true, opacity: 0.32 });

    const piezas = [
        [new BoxGeometry(1.9, 0.42, 4.1), pintura, [0, 0.56, 0]],
        [new BoxGeometry(1.5, 0.34, 1.0), pintura, [0, 0.8, 1.5]],
        [new BoxGeometry(1.42, 0.46, 1.7), cristal, [0, 1.03, -0.18]],
        [new BoxGeometry(1.7, 0.08, 0.45), oscuro, [0, 1.16, -1.86]],
        [new BoxGeometry(0.16, 0.24, 0.16), oscuro, [0.62, 1.02, -1.86]],
        [new BoxGeometry(0.16, 0.24, 0.16), oscuro, [-0.62, 1.02, -1.86]],
        [new BoxGeometry(0.34, 0.13, 0.08), luzBlanca, [0.58, 0.74, 2.02]],
        [new BoxGeometry(0.34, 0.13, 0.08), luzBlanca, [-0.58, 0.74, 2.02]],
        [new BoxGeometry(0.42, 0.11, 0.06), luzRoja, [0.58, 0.82, -2.06]],
        [new BoxGeometry(0.42, 0.11, 0.06), luzRoja, [-0.58, 0.82, -2.06]],
        [new BoxGeometry(0.3, 0.08, 0.5), oscuro, [0.92, 0.42, 1.2]],
        [new BoxGeometry(0.3, 0.08, 0.5), oscuro, [-0.92, 0.42, 1.2]],
    ];

    for (const [geometria, material, posicion] of piezas) {
        const pieza = new Mesh(geometria, material);
        pieza.position.set(...posicion);
        pieza.castShadow = true;
        grupo.add(pieza);
    }

    const halo = new Mesh(new PlaneGeometry(2.6, 4.8), neon);
    halo.rotation.x = -Math.PI / 2;
    halo.position.y = 0.08;
    grupo.add(halo);

    const geometriaRueda = new CylinderGeometry(
        RADIO_RUEDA,
        RADIO_RUEDA,
        0.34,
        18,
        1,
        false
    );
    geometriaRueda.rotateZ(Math.PI / 2);
    const ruedas = [];

    for (const [x, z] of [
        [0.95, 1.32],
        [-0.95, 1.32],
        [0.95, -1.32],
        [-0.95, -1.32],
    ]) {
        const soporte = new Group();
        soporte.position.set(x, RADIO_RUEDA, z);

        const rueda = new Mesh(geometriaRueda, oscuro);
        rueda.castShadow = true;
        soporte.add(rueda);

        const buje = new Mesh(
            new CylinderGeometry(0.16, 0.16, 0.36, 12).rotateZ(Math.PI / 2),
            new MeshBasicNodeMaterial({ color })
        );
        rueda.add(buje);

        grupo.add(soporte);
        ruedas.push({ soporte, rueda, frontal: z > 0 });
    }

    let giroRuedas = 0;

    return {
        grupo,
        ruedas,
        actualizar({ dt = 0, velocidad = 0, giro = 0 }) {
            giroRuedas += (velocidad / RADIO_RUEDA) * dt;
            for (const { soporte, rueda, frontal } of ruedas) {
                rueda.rotation.x = giroRuedas;
                if (frontal) soporte.rotation.y = giro * 0.42;
            }
            grupo.rotation.z = -giro * 0.035;
        },
    };
}
