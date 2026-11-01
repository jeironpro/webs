import {
    BoxGeometry,
    BufferGeometry,
    CanvasTexture,
    DoubleSide,
    Float32BufferAttribute,
    FrontSide,
    Group,
    InstancedMesh,
    Mesh,
    MeshBasicNodeMaterial,
    MeshStandardNodeMaterial,
    NearestFilter,
    Object3D,
    RepeatWrapping,
    SphereGeometry,
    SRGBColorSpace,
    Vector3,
} from "three/webgpu";
import { modulo } from "./utilidades.js";

const ARRIBA = new Vector3(0, 1, 0);
export const ANCHO_PISTA = 14;
const ANCHO_BORDILLO = 0.9;

/**
 * Circuito cerrado y determinista: la semilla mueve los puntos de control y el
 * peralte. Devuelve la malla lista para la escena y una API de consulta por
 * progreso (0..1) que la física y la cámara usan para colocarse.
 */
export function crearCircuito({ nucleo }) {
    if (!nucleo) throw new Error("crearCircuito necesita un núcleo WebAssembly cargado");

    const muestras = leerMuestras(nucleo);
    const grupo = new Group();
    grupo.name = "circuito";

    const asfalto = new MeshStandardNodeMaterial({
        color: 0x39435f,
        metalness: 0.22,
        roughness: 0.72,
        side: DoubleSide,
        // La cinta es de doble cara: sin esto la cara trasera entra en el mapa
        // de sombras y aparecen manchas oscuras sobre el asfalto.
        shadowSide: FrontSide,
    });
    const pista = new Mesh(construirCinta(muestras, 0, ANCHO_PISTA), asfalto);
    grupo.add(pista);

    const centro = new MeshBasicNodeMaterial({
        color: 0xa9bcf5,
        transparent: true,
        opacity: 0.85,
        polygonOffset: true,
        polygonOffsetFactor: -3,
        polygonOffsetUnits: -3,
    });
    // A ras de asfalto: al ir elevada, entre la cinta y el asfalto quedaba un
    // hueco vertical por el que se veía el fondo y aparecía un filo negro.
    grupo.add(new Mesh(construirCinta(muestras, 0, 0.32, 0.012), centro));

    // Los bordillos van por encima del asfalto y con polygonOffset: si no, en
    // las curvas peraltadas su canto rozaba la cinta y dejaba líneas sueltas
    // sobre todo en el borde izquierdo.
    const bordilloDerecho = new MeshBasicNodeMaterial({
        color: 0x35c6db,
        polygonOffset: true,
        polygonOffsetFactor: -2,
        polygonOffsetUnits: -2,
    });
    const bordilloIzquierdo = new MeshBasicNodeMaterial({
        color: 0xb45cff,
        polygonOffset: true,
        polygonOffsetFactor: -2,
        polygonOffsetUnits: -2,
    });
    const desvioBordillo = ANCHO_PISTA / 2 + ANCHO_BORDILLO / 2;
    grupo.add(
        new Mesh(construirCinta(muestras, desvioBordillo, ANCHO_BORDILLO, 0.008), bordilloDerecho)
    );
    grupo.add(
        new Mesh(
            construirCinta(muestras, -desvioBordillo, ANCHO_BORDILLO, 0.008),
            bordilloIzquierdo
        )
    );

    // Faldones: dan grosor a la cinta para que la pista se vea maciza desde el
    // lado y no quede flotando sobre el suelo.
    const faldon = new MeshStandardNodeMaterial({
        color: 0x0b1224,
        roughness: 0.95,
        metalness: 0.1,
        side: DoubleSide,
    });
    const bordeExterior = ANCHO_PISTA / 2 + ANCHO_BORDILLO;
    grupo.add(new Mesh(construirFaldon(muestras, bordeExterior), faldon));
    grupo.add(new Mesh(construirFaldon(muestras, -bordeExterior), faldon));

    grupo.add(crearLineaMeta(muestras));
    grupo.add(crearPostes(muestras, desvioBordillo + 2.4));

    const total = muestras.length;
    const indiceDe = (progreso) => Math.floor(modulo(progreso, 1) * total) % total;

    return {
        grupo,
        muestras,
        nucleo,
        longitud: nucleo.longitud,
        ancho: ANCHO_PISTA,
        semilla: nucleo.semilla,
        muestraEn(progreso) {
            return muestras[indiceDe(progreso)];
        },
        posicionEn(progreso, desvio = 0, altura = 0) {
            const muestra = muestras[indiceDe(progreso)];
            return muestra.posicion
                .clone()
                .addScaledVector(muestra.lateral, desvio)
                .addScaledVector(ARRIBA, altura);
        },
        rumboEn(progreso) {
            const { tangente } = muestras[indiceDe(progreso)];
            return Math.atan2(tangente.x, tangente.z);
        },
        inclinacionEn(progreso) {
            return muestras[indiceDe(progreso)].tangente.y;
        },
        peralteEn(progreso) {
            return muestras[indiceDe(progreso)].peralte;
        },
    };
}

/**
 * Lee el bloque plano del núcleo wasm y lo convierte en muestras con vectores.
 * El binario ya trae tangente, lateral y peralte resueltos.
 */
function leerMuestras(nucleo) {
    const { datos, estridas, total } = nucleo;
    const muestras = new Array(total);

    for (let i = 0; i < total; i += 1) {
        const base = i * estridas;
        muestras[i] = {
            posicion: new Vector3(datos[base], datos[base + 1], datos[base + 2]),
            tangente: new Vector3(datos[base + 3], datos[base + 4], datos[base + 5]),
            lateral: new Vector3(datos[base + 6], datos[base + 7], datos[base + 8]),
            peralte: datos[base + 9],
        };
    }

    return muestras;
}

/** Cinta continua a lo largo de las muestras: asfalto, bordillos y línea central. */
function construirCinta(muestras, desvio, ancho, elevacion = 0) {
    const posiciones = [];
    const uvs = [];
    const indices = [];
    const total = muestras.length;

    for (let i = 0; i <= total; i += 1) {
        const muestra = muestras[i % total];
        const centro = muestra.posicion.clone().addScaledVector(ARRIBA, elevacion);
        const bordeA = centro.clone().addScaledVector(muestra.lateral, desvio + ancho / 2);
        const bordeB = centro.clone().addScaledVector(muestra.lateral, desvio - ancho / 2);

        posiciones.push(bordeA.x, bordeA.y, bordeA.z, bordeB.x, bordeB.y, bordeB.z);
        const v = (i / total) * 90;
        uvs.push(0, v, 1, v);
    }

    for (let i = 0; i < total; i += 1) {
        const a = i * 2;
        const b = a + 1;
        const c = a + 2;
        const d = a + 3;
        indices.push(a, c, b, b, c, d);
    }

    const geometria = new BufferGeometry();
    geometria.setAttribute("position", new Float32BufferAttribute(posiciones, 3));
    geometria.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
    geometria.setIndex(indices);
    geometria.computeVertexNormals();
    return geometria;
}

/** Banda vertical bajo el borde de la pista: el grosor que la hace maciza. */
function construirFaldon(muestras, desvio, profundidad = 5.5) {
    const posiciones = [];
    const indices = [];
    const total = muestras.length;

    for (let i = 0; i <= total; i += 1) {
        const muestra = muestras[i % total];
        // Un pelín por debajo del asfalto: así el canto del faldón no asoma
        // como una línea al otro lado del borde.
        const borde = muestra.posicion
            .clone()
            .addScaledVector(muestra.lateral, desvio)
            .addScaledVector(ARRIBA, -0.06);
        const fondo = borde.clone().addScaledVector(ARRIBA, -profundidad);
        posiciones.push(borde.x, borde.y, borde.z, fondo.x, fondo.y, fondo.z);
    }

    for (let i = 0; i < total; i += 1) {
        const a = i * 2;
        const b = a + 1;
        const c = a + 2;
        const d = a + 3;
        indices.push(a, b, c, b, d, c);
    }

    const geometria = new BufferGeometry();
    geometria.setAttribute("position", new Float32BufferAttribute(posiciones, 3));
    geometria.setIndex(indices);
    geometria.computeVertexNormals();
    return geometria;
}

function crearLineaMeta(muestras) {
    const lienzo = document.createElement("canvas");
    lienzo.width = 128;
    lienzo.height = 32;
    const contexto = lienzo.getContext("2d");
    const celdas = 16;
    const lado = lienzo.width / celdas;
    for (let x = 0; x < celdas; x += 1) {
        for (let y = 0; y < 2; y += 1) {
            contexto.fillStyle = (x + y) % 2 === 0 ? "#f2f4ff" : "#0b1020";
            contexto.fillRect(x * lado, y * (lienzo.height / 2), lado, lienzo.height / 2);
        }
    }

    const textura = new CanvasTexture(lienzo);
    textura.colorSpace = SRGBColorSpace;
    textura.magFilter = NearestFilter;
    textura.wrapS = RepeatWrapping;
    textura.repeat.set(3, 1);

    // Cinta de la meta pegada a la pista. Un plano rígido de 14 m no sigue el
    // peralte: en la curva de salida se salía del bordillo y los cuadros negros
    // quedaban sobre la hierba del lado izquierdo.
    const tramos = 4;
    const medio = ANCHO_PISTA / 2;
    const posiciones = [];
    const uvs = [];
    const indices = [];

    for (let i = 0; i <= tramos; i += 1) {
        const muestra = muestras[i % muestras.length];
        const centro = muestra.posicion.clone().addScaledVector(ARRIBA, 0.012);
        const bordeA = centro.clone().addScaledVector(muestra.lateral, medio);
        const bordeB = centro.clone().addScaledVector(muestra.lateral, -medio);
        posiciones.push(bordeA.x, bordeA.y, bordeA.z, bordeB.x, bordeB.y, bordeB.z);
        uvs.push(0, i / tramos, 1, i / tramos);
    }

    for (let i = 0; i < tramos; i += 1) {
        const a = i * 2;
        const b = a + 1;
        const c = a + 2;
        const d = a + 3;
        indices.push(a, c, b, b, c, d);
    }

    const geometria = new BufferGeometry();
    geometria.setAttribute("position", new Float32BufferAttribute(posiciones, 3));
    geometria.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
    geometria.setIndex(indices);
    geometria.computeVertexNormals();

    return new Mesh(geometria, new MeshBasicNodeMaterial({ map: textura }));
}

/** Postes de luz instanciados a ambos lados: cian a la derecha, magenta a la izquierda. */
function crearPostes(muestras, desvio) {
    const grupo = new Group();
    const geometria = new BoxGeometry(0.16, 4.4, 0.16);
    const geometriaLuz = new SphereGeometry(0.42, 10, 10);
    const paso = 8;
    const cantidad = Math.floor(muestras.length / paso);
    const matriz = new Object3D();

    const derecho = new MeshBasicNodeMaterial({ color: 0x35c6db });
    const izquierdo = new MeshBasicNodeMaterial({ color: 0xb45cff });
    const postesDerecha = new InstancedMesh(geometria, derecho, cantidad);
    const postesIzquierda = new InstancedMesh(geometria, izquierdo, cantidad);
    const lucesDerecha = new InstancedMesh(geometriaLuz, derecho, cantidad);
    const lucesIzquierda = new InstancedMesh(geometriaLuz, izquierdo, cantidad);

    for (let i = 0; i < cantidad; i += 1) {
        const muestra = muestras[(i * paso) % muestras.length];
        const centro = muestra.posicion.clone().addScaledVector(ARRIBA, 2.2);
        const corona = muestra.posicion.clone().addScaledVector(ARRIBA, 4.5);

        const derecha = centro.clone().addScaledVector(muestra.lateral, desvio);
        matriz.position.copy(derecha);
        matriz.updateMatrix();
        postesDerecha.setMatrixAt(i, matriz.matrix);

        matriz.position.copy(corona.clone().addScaledVector(muestra.lateral, desvio));
        matriz.updateMatrix();
        lucesDerecha.setMatrixAt(i, matriz.matrix);

        const izquierda = centro.clone().addScaledVector(muestra.lateral, -desvio);
        matriz.position.copy(izquierda);
        matriz.updateMatrix();
        postesIzquierda.setMatrixAt(i, matriz.matrix);

        matriz.position.copy(corona.clone().addScaledVector(muestra.lateral, -desvio));
        matriz.updateMatrix();
        lucesIzquierda.setMatrixAt(i, matriz.matrix);
    }

    for (const malla of [postesDerecha, postesIzquierda, lucesDerecha, lucesIzquierda]) {
        malla.instanceMatrix.needsUpdate = true;
    }

    grupo.add(postesDerecha, postesIzquierda, lucesDerecha, lucesIzquierda);
    return grupo;
}
