/**
 * Motor generador de mandalas.
 *
 * Construye un mandala como SVG generando sus nodos con el DOM
 * (document.createElementNS), nunca con cadenas de HTML inyectadas.
 *
 * Cada "región" coloreable es un elemento <path> o <circle> con un id único.
 * Las regiones se agrupan en bandas anulares (aros), cada una con sus pétalos
 * replicados con simetría rotacional (N veces alrededor del centro).
 *
 * Expone el namespace global Mandala con la API de generación.
 */
(function (global) {
    "use strict";

    /* ------------------------------------------------------------------------
     * Constantes geométricas y de tema
     * ---------------------------------------------------------------------- */

    // Namespace del lenguaje SVG.
    const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

    // Lienzo cuadrado del mandala (viewBox y tamaño de render).
    const SIZE = 600;
    const CENTER = SIZE / 2;
    const MAX_RADIUS = 290;

    // Trazo de las líneas que delimitan cada región.
    const LINE_WIDTH = 2;

    // Colores del tema Newsprint (ver tokens.css): papel crema y tinta cálida.
    const SAND_COLOR = "#fbf8f2";
    const LINE_COLOR = "#2a2522";

    // Tolerancia para considerar un radio nulo y evitar arcos degenerados.
    const MIN_RADIUS = 0.001;

    /* ------------------------------------------------------------------------
     * Geometría (rutas SVG)
     * ---------------------------------------------------------------------- */

    /** Convierte una coordenada polar (radio, ángulo) en cartesianas. */
    function point(radius, angulo) {
        return {
            x: CENTER + radius * Math.cos(angulo),
            y: CENTER + radius * Math.sin(angulo),
        };
    }

    /** Trazo de un círculo completo centrado en el lienzo. */
    function circlePath(radius) {
        return (
            `M ${CENTER + radius} ${CENTER} ` +
            `A ${radius} ${radius} 0 1 1 ${CENTER - radius} ${CENTER} ` +
            `A ${radius} ${radius} 0 1 1 ${CENTER + radius} ${CENTER} Z`
        );
    }

    /**
     * Trazo de un aro (anillo) entre dos radios, con hueco interior.
     * Si el radio interior es nulo, degenera en un círculo relleno.
     */
    function ringPath(outerRadius, innerRadius) {
        if (innerRadius <= MIN_RADIUS) {
            return circlePath(outerRadius);
        }
        return `${circlePath(outerRadius)} ${circlePath(innerRadius)}`;
    }

    /** Trazo de una cuña (sector circular) entre dos radios y dos ángulos. */
    function wedgePath(innerRadius, outerRadius, startAngle, endAngle) {
        const pi0 = point(innerRadius, startAngle);
        const pi1 = point(innerRadius, endAngle);
        const pe0 = point(outerRadius, startAngle);
        const pe1 = point(outerRadius, endAngle);
        const arcoGrande = endAngle - startAngle > Math.PI ? 1 : 0;
        // Cuando el radio interior es nulo, el arco interior degenera en un punto:
        // se cierra con una línea recta para evitar arcos de radio 0.
        const cierreInterior =
            innerRadius <= MIN_RADIUS
                ? `L ${pi0.x} ${pi0.y}`
                : `A ${innerRadius} ${innerRadius} 0 ${arcoGrande} 0 ${pi0.x} ${pi0.y}`;
        return (
            `M ${pi0.x} ${pi0.y} ` +
            `L ${pe0.x} ${pe0.y} ` +
            `A ${outerRadius} ${outerRadius} 0 ${arcoGrande} 1 ${pe1.x} ${pe1.y} ` +
            `L ${pi1.x} ${pi1.y} ` +
            `${cierreInterior} Z`
        );
    }

    /**
     * Trazo de un pétalo: borde exterior curvo (cuadrática que se hincha hasta
     * el radio exterior) y borde interior de vuelta a lo largo del radio
     * interior. Requiere un radio interior positivo para no degenerar.
     */
    function petalPath(innerRadius, outerRadius, startAngle, endAngle) {
        const p0 = point(innerRadius, startAngle);
        const p2 = point(innerRadius, endAngle);
        const control = point(outerRadius, (startAngle + endAngle) / 2);
        return (
            `M ${p0.x} ${p0.y} ` +
            `Q ${control.x} ${control.y} ${p2.x} ${p2.y} ` +
            `A ${innerRadius} ${innerRadius} 0 0 0 ${p0.x} ${p0.y} Z`
        );
    }

    /**
     * Trazo de un diamante (lente): borde exterior curvo que se hincha hasta el
     * radio exterior y cierre en línea recta entre los dos puntos interiores.
     */
    function diamondPath(innerRadius, outerRadius, startAngle, endAngle) {
        const p0 = point(innerRadius, startAngle);
        const p2 = point(innerRadius, endAngle);
        const control = point(outerRadius, (startAngle + endAngle) / 2);
        return (
            `M ${p0.x} ${p0.y} ` +
            `Q ${control.x} ${control.y} ${p2.x} ${p2.y} ` +
            `L ${p0.x} ${p0.y} Z`
        );
    }

    // Trazadores de los pétalos con borde en "path". El tipo por defecto es el
    // pétalo clásico; el mapa asocia el nombre del tipo con su constructor.
    const PATH_TYPES = {
        cuna: wedgePath,
        diamante: diamondPath,
    };

    /** Traza la ruta de un pétalo según su tipo (por defecto, pétalo clásico). */
    function tracePetal(type, innerRadius, outerRadius, startAngle, endAngle) {
        const tracer = PATH_TYPES[type] || petalPath;
        return tracer(innerRadius, outerRadius, startAngle, endAngle);
    }

    /* ------------------------------------------------------------------------
     * Construcción del SVG
     * ---------------------------------------------------------------------- */

    /** Crea un nodo SVG básico para una región coloreable. */
    function createRegion(label, id) {
        const node = document.createElementNS(SVG_NAMESPACE, label);
        node.setAttribute("id", id);
        node.setAttribute("fill", SAND_COLOR);
        node.setAttribute("stroke", LINE_COLOR);
        node.setAttribute("stroke-width", String(LINE_WIDTH));
        return node;
    }

    /**
     * Añade las regiones que forman una banda: su aro de fondo y sus pétalos.
     * Cada descriptor de pétalo se replica "simetria" veces alrededor del centro
     * (o las repeticiones propias que indique, si tiene "repeticiones").
     */
    function buildBand(svg, index, band, symmetry) {
        const ring = createRegion("path", `anillo-${index}`);
        ring.setAttribute("d", ringPath(band.outerRadius, band.innerRadius));
        ring.setAttribute("fill-rule", "evenodd");
        svg.appendChild(ring);

        if (!band.petals) {
            return;
        }

        for (const petal of band.petals) {
            const repetitions = petal.repetitions || symmetry;
            const sector = (Math.PI * 2) / repetitions;
            const angularWidth = (petal.ancho || 1) * sector;
            const start = petal.start || 0;

            for (let k = 0; k < repetitions; k += 1) {
                const startAngle = start + k * sector;
                const endAngle = startAngle + angularWidth;
                const id = `region-${petal.type}-${index}-${k}`;

                if (petal.type === "drop") {
                    // La gota es un círculo centrado en la banda, con radio proporcional
                    // al grosor de la banda y al ancho del descriptor.
                    const drop = createRegion("circle", id);
                    const dropRadius =
                        (petal.outerRadius - petal.innerRadius) * 0.5 * (petal.ancho || 1);
                    const center = point(
                        (petal.innerRadius + petal.outerRadius) / 2,
                        (startAngle + endAngle) / 2
                    );
                    drop.setAttribute("cx", String(center.x));
                    drop.setAttribute("cy", String(center.y));
                    drop.setAttribute("r", String(dropRadius));
                    svg.appendChild(drop);
                } else {
                    const node = createRegion("path", id);
                    node.setAttribute(
                        "d",
                        tracePetal(
                            petal.type,
                            petal.innerRadius,
                            petal.outerRadius,
                            startAngle,
                            endAngle
                        )
                    );
                    svg.appendChild(node);
                }
            }
        }
    }

    /**
     * Genera el SVG completo del mandala a partir de una plantilla y lo devuelve
     * con todas sus regiones coloreables y el círculo de cierre si procede.
     */
    function createSvg(template) {
        const svg = document.createElementNS(SVG_NAMESPACE, "svg");
        svg.setAttribute("xmlns", SVG_NAMESPACE);
        svg.setAttribute("viewBox", `0 0 ${SIZE} ${SIZE}`);
        svg.setAttribute("width", String(SIZE));
        svg.setAttribute("height", String(SIZE));
        svg.setAttribute("class", "canvas__svg");
        svg.setAttribute("role", "img");
        svg.setAttribute("aria-label", `Mandala de la plantilla ${template.name}`);

        template.bands.forEach((band, index) => buildBand(svg, index, band, template.symmetry));

        if (template.center && template.center.radius > 0) {
            const center = createRegion("circle", "region-centro");
            center.setAttribute("cx", String(CENTER));
            center.setAttribute("cy", String(CENTER));
            center.setAttribute("r", String(template.center.radius));
            svg.appendChild(center);
        }

        return svg;
    }

    // API pública: generación de SVG, radio útil y colores del tema.
    global.Mandala = {
        createSvg,
        MAX_RADIUS,
        SAND_COLOR,
        LINE_COLOR,
    };
})(window);
