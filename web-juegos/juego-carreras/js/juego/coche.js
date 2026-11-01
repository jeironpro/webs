import {
    BoxGeometry,
    BufferGeometry,
    CanvasTexture,
    CylinderGeometry,
    Float32BufferAttribute,
    Group,
    Mesh,
    MeshBasicNodeMaterial,
    MeshStandardNodeMaterial,
    PlaneGeometry,
    SRGBColorSpace,
} from "three/webgpu";

/**
 * Prisma de 8 vértices con caras delantera y trasera distintas: la base de las
 * piezas inclinadas del coche (morro, capó, cabina, luna trasera). +Z es el morro.
 */
function crearPrisma({ largo, anchoFrente, anchoFondo, altoFrente, altoFondo }) {
    const frente = largo / 2;
    const fondo = -largo / 2;
    const anchoF = anchoFrente / 2;
    const anchoB = anchoFondo / 2;

    const vertices = [
        [-anchoF, 0, frente],
        [anchoF, 0, frente],
        [-anchoF, altoFrente, frente],
        [anchoF, altoFrente, frente],
        [-anchoB, 0, fondo],
        [anchoB, 0, fondo],
        [-anchoB, altoFondo, fondo],
        [anchoB, altoFondo, fondo],
    ];

    const indices = [
        0, 1, 3, 0, 3, 2,
        4, 6, 7, 4, 7, 5,
        0, 2, 6, 0, 6, 4,
        1, 5, 7, 1, 7, 3,
        2, 3, 7, 2, 7, 6,
        0, 4, 5, 0, 5, 1,
    ];

    const geometria = new BufferGeometry();
    geometria.setAttribute("position", new Float32BufferAttribute(vertices.flat(), 3));
    geometria.setIndex(indices);
    geometria.computeVertexNormals();
    return geometria;
}

/**
 * Rueda con neumático, llanta de cinco radios y pinza fija. El grupo `giro` gira
 * sobre el eje X; el soporte exterior es el que gira con la dirección.
 */
function crearRueda({ radio, ancho, colorPinza }) {
    const soporte = new Group();
    const giro = new Group();
    soporte.add(giro);

    const goma = new MeshStandardNodeMaterial({ color: 0x0a0e16, metalness: 0.2, roughness: 0.85 });
    const llantaMaterial = new MeshStandardNodeMaterial({
        color: 0xa8b4c8,
        metalness: 0.95,
        roughness: 0.25,
    });

    const neumatico = new Mesh(
        new CylinderGeometry(radio, radio, ancho, 26).rotateZ(Math.PI / 2),
        goma
    );
    neumatico.castShadow = true;
    giro.add(neumatico);

    const llanta = new Mesh(
        new CylinderGeometry(radio * 0.68, radio * 0.68, ancho * 1.02, 22).rotateZ(Math.PI / 2),
        llantaMaterial
    );
    giro.add(llanta);

    for (let i = 0; i < 5; i += 1) {
        const radio_ = new Mesh(
            new BoxGeometry(ancho * 1.04, 0.045, radio * 1.28),
            llantaMaterial
        );
        radio_.rotation.x = (i / 5) * Math.PI * 2;
        giro.add(radio_);
    }

    const buje = new Mesh(
        new CylinderGeometry(radio * 0.16, radio * 0.16, ancho * 1.12, 12).rotateZ(Math.PI / 2),
        new MeshBasicNodeMaterial({ color: 0x111826 })
    );
    giro.add(buje);

    const pinza = new Mesh(
        new BoxGeometry(ancho * 0.44, radio * 0.4, 0.085),
        new MeshBasicNodeMaterial({ color: colorPinza })
    );
    pinza.position.set(0, radio * 0.56, 0);
    soporte.add(pinza);

    return { soporte, giro };
}

/**
 * McLaren 570S estilizado: monocasco bajo y ancho, morro descendente, cabina
 * adelantada con flying buttresses, tomas laterales, difusor y doble escape alto.
 */
export function crearCoche({ color = 0x35c6db, colorPinza = 0xff7a1a } = {}) {
    const grupo = new Group();
    grupo.name = "coche";
    grupo.rotation.order = "YXZ";

    const pintura = new MeshStandardNodeMaterial({ color, metalness: 0.68, roughness: 0.26 });
    const carbono = new MeshStandardNodeMaterial({ color: 0x0a0e16, metalness: 0.45, roughness: 0.42 });
    const cristal = new MeshStandardNodeMaterial({ color: 0x0a1526, metalness: 0.95, roughness: 0.06 });
    const metal = new MeshStandardNodeMaterial({ color: 0x9fabc0, metalness: 0.95, roughness: 0.28 });
    const faro = new MeshBasicNodeMaterial({ color: 0xeaf2ff });
    const piloto = new MeshBasicNodeMaterial({ color: 0xff2d55 });
    // Sombra de contacto: un manchón suave bajo el coche en lugar de sombras
    // proyectadas, que dejaban motas oscuras sobre el asfalto.
    const sombra = (() => {
        const lienzo = document.createElement("canvas");
        lienzo.width = 64;
        lienzo.height = 64;
        const contexto = lienzo.getContext("2d");
        const degradado = contexto.createRadialGradient(32, 32, 2, 32, 32, 31);
        degradado.addColorStop(0, "rgba(0, 0, 0, 0.6)");
        degradado.addColorStop(0.55, "rgba(0, 0, 0, 0.35)");
        degradado.addColorStop(1, "rgba(0, 0, 0, 0)");
        contexto.fillStyle = degradado;
        contexto.fillRect(0, 0, 64, 64);
        const textura = new CanvasTexture(lienzo);
        textura.colorSpace = SRGBColorSpace;
        return textura;
    })();
    // `polygonOffset` mantiene el manchón por delante del asfalto aunque la
    // carrocería quede algo por debajo en el interior de una curva peraltada;
    // sin él, las esquinas del plano cortaban la pista y salían cuñas negras.
    const materialSombra = new MeshBasicNodeMaterial({
        map: sombra,
        transparent: true,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -8,
        polygonOffsetUnits: -8,
    });

    function anadir(geometria, material, posicion, rotacion = [0, 0, 0]) {
        const malla = new Mesh(geometria, material);
        malla.position.set(...posicion);
        malla.rotation.set(...rotacion);
        malla.castShadow = true;
        grupo.add(malla);
        return malla;
    }

    // Monocasco bajo: 4,3 m de largo, 1,9 m de ancho, apenas 0,24 m del suelo.
    anadir(
        crearPrisma({ largo: 4.3, anchoFrente: 1.58, anchoFondo: 1.92, altoFrente: 0.34, altoFondo: 0.5 }),
        pintura,
        [0, 0.24, 0]
    );

    // Morro descendente y capó, sin escalón entre ambos.
    anadir(
        crearPrisma({ largo: 1.0, anchoFrente: 1.3, anchoFondo: 1.6, altoFrente: 0.16, altoFondo: 0.3 }),
        pintura,
        [0, 0.28, 1.68]
    );
    anadir(
        crearPrisma({ largo: 1.5, anchoFrente: 1.44, anchoFondo: 1.64, altoFrente: 0.06, altoFondo: 0.1 }),
        pintura,
        [0, 0.56, 0.55]
    );

    // Cabina tipo gota: parabrisas tumbado, techo corto y luna trasera descendente.
    anadir(
        crearPrisma({ largo: 1.8, anchoFrente: 1.02, anchoFondo: 1.24, altoFrente: 0.1, altoFondo: 0.34 }),
        cristal,
        [0, 0.66, -0.25]
    );
    anadir(
        crearPrisma({ largo: 0.8, anchoFrente: 1.05, anchoFondo: 1.08, altoFrente: 0.03, altoFondo: 0.03 }),
        pintura,
        [0, 0.99, -0.55]
    );
    anadir(
        crearPrisma({ largo: 0.95, anchoFrente: 1.06, anchoFondo: 1.26, altoFrente: 0.3, altoFondo: 0.04 }),
        cristal,
        [0, 0.7, -1.4]
    );

    // Flying buttresses: dos canales pintados que caen del techo a la zaga.
    for (const lado of [-1, 1]) {
        anadir(
            new BoxGeometry(0.13, 0.05, 0.9),
            pintura,
            [lado * 0.57, 0.98, -1.02],
            [-0.28, 0, 0]
        );
        anadir(new BoxGeometry(0.05, 0.22, 0.55), carbono, [lado * 0.66, 0.84, -1.55], [-0.2, 0, 0]);
    }

    // Aletas musculosas sobre las ruedas, la seña de identidad del 570S.
    for (const lado of [-1, 1]) {
        anadir(new BoxGeometry(0.16, 0.2, 1.15), pintura, [lado * 0.9, 0.55, 1.26]);
        anadir(new BoxGeometry(0.18, 0.26, 1.35), pintura, [lado * 0.92, 0.58, -1.3]);
    }

    // Tomas laterales delante de las ruedas traseras.
    for (const lado of [-1, 1]) {
        anadir(
            new BoxGeometry(0.06, 0.24, 0.72),
            carbono,
            [lado * 0.94, 0.55, -0.62],
            [0, lado * 0.12, 0]
        );
        anadir(
            new BoxGeometry(0.05, 0.05, 0.78),
            pintura,
            [lado * 0.96, 0.72, -0.62],
            [0, lado * 0.12, 0]
        );
    }

    // Cubierta del motor con rejilla y alerón discreto.
    anadir(new BoxGeometry(0.92, 0.03, 0.6), carbono, [0, 0.86, -1.5]);
    for (let i = 0; i < 4; i += 1) {
        anadir(new BoxGeometry(0.84, 0.02, 0.05), metal, [0, 0.885, -1.72 + i * 0.15]);
    }
    anadir(new BoxGeometry(1.42, 0.04, 0.2), carbono, [0, 0.94, -1.98]);
    for (const lado of [-1, 1]) {
        anadir(new BoxGeometry(0.04, 0.12, 0.1), carbono, [lado * 0.55, 0.87, -1.98]);
    }

    // Zaga: panel oscuro, pilotos finos, difusor y doble escape alto.
    anadir(new BoxGeometry(1.62, 0.26, 0.12), carbono, [0, 0.6, -2.05]);
    for (let i = -1; i <= 1; i += 1) {
        anadir(new BoxGeometry(0.05, 0.22, 0.4), metal, [i * 0.42, 0.32, -1.98]);
    }
    anadir(new BoxGeometry(1.5, 0.16, 0.42), carbono, [0, 0.3, -1.95]);

    for (const lado of [-1, 1]) {
        anadir(new BoxGeometry(0.44, 0.055, 0.03), piloto, [lado * 0.6, 0.68, -2.14]);
        anadir(
            new CylinderGeometry(0.065, 0.065, 0.14, 14).rotateX(Math.PI / 2),
            metal,
            [lado * 0.16, 0.6, -2.16]
        );
    }

    // Faros enrasados en el morro, con firma horizontal.
    for (const lado of [-1, 1]) {
        anadir(new BoxGeometry(0.34, 0.05, 0.03), faro, [lado * 0.52, 0.45, 2.12], [0, lado * 0.1, 0]);
        anadir(new BoxGeometry(0.05, 0.14, 0.03), faro, [lado * 0.72, 0.4, 2.1], [0, lado * 0.25, 0]);
    }

    // Entradas de aire inferiores, splitter, faldones y espejos.
    for (const lado of [-1, 1]) {
        anadir(new BoxGeometry(0.56, 0.16, 0.05), carbono, [lado * 0.44, 0.31, 2.15]);
        anadir(new BoxGeometry(0.09, 0.1, 2.05), carbono, [lado * 0.93, 0.24, -0.1]);
        anadir(new BoxGeometry(0.14, 0.07, 0.1), pintura, [lado * 0.98, 0.82, 0.35]);
        anadir(new BoxGeometry(0.05, 0.1, 0.05), carbono, [lado * 0.92, 0.76, 0.33]);
    }
    anadir(new BoxGeometry(1.7, 0.04, 0.42), carbono, [0, 0.2, 2.0]);

    // Más pequeño que el coche: así sus esquinas quedan siempre bajo la
    // carrocería y nunca asoman sobre el asfalto en las curvas.
    const manchon = new Mesh(new PlaneGeometry(2.4, 4.0), materialSombra);
    manchon.rotation.x = -Math.PI / 2;
    manchon.position.y = 0.05;
    manchon.renderOrder = -1;
    grupo.add(manchon);

    // Ruedas escalonadas: 19" delante y 20" detrás, como el 570S.
    const ruedas = [];
    const configuraciones = [
        { x: 0.82, z: 1.33, radio: 0.36, ancho: 0.32, frontal: true },
        { x: -0.82, z: 1.33, radio: 0.36, ancho: 0.32, frontal: true },
        { x: 0.84, z: -1.32, radio: 0.39, ancho: 0.37, frontal: false },
        { x: -0.84, z: -1.32, radio: 0.39, ancho: 0.37, frontal: false },
    ];

    for (const configuracion of configuraciones) {
        const { soporte, giro } = crearRueda({
            radio: configuracion.radio,
            ancho: configuracion.ancho,
            colorPinza,
        });
        soporte.position.set(configuracion.x, configuracion.radio, configuracion.z);
        grupo.add(soporte);
        ruedas.push({ soporte, rueda: giro, frontal: configuracion.frontal });
    }

    let giroRuedas = 0;
    const RADIO_REFERENCIA = 0.36;

    return {
        grupo,
        actualizar({ dt = 0, velocidad = 0, giro = 0 }) {
            giroRuedas += (velocidad / RADIO_REFERENCIA) * dt;
            for (const { soporte, rueda, frontal } of ruedas) {
                rueda.rotation.x = giroRuedas;
                if (frontal) soporte.rotation.y = -giro * 0.42;
            }
            grupo.rotation.z = giro * 0.03;
        },
    };
}
