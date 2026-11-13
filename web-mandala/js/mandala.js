const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

const SIZE = 600;
const CENTER = SIZE / 2;
const MAX_RADIUS = 290;

const LINE_WIDTH = 2;

const SAND_COLOR = "oklch(97% 0.012 85)";
const LINE_COLOR = "oklch(18% 0.014 70)";

const MIN_RADIUS = 0.001;

function point(radius, angulo) {
    return {
        x: CENTER + radius * Math.cos(angulo),
        y: CENTER + radius * Math.sin(angulo),
    };
}

function circlePath(radius) {
    return (
        `M ${CENTER + radius} ${CENTER} ` +
        `A ${radius} ${radius} 0 1 1 ${CENTER - radius} ${CENTER} ` +
        `A ${radius} ${radius} 0 1 1 ${CENTER + radius} ${CENTER} Z`
    );
}

function ringPath(outerRadius, innerRadius) {
    if (innerRadius <= MIN_RADIUS) {
        return circlePath(outerRadius);
    }
    return `${circlePath(outerRadius)} ${circlePath(innerRadius)}`;
}

function wedgePath(innerRadius, outerRadius, startAngle, endAngle) {
    const pi0 = point(innerRadius, startAngle);
    const pi1 = point(innerRadius, endAngle);
    const pe0 = point(outerRadius, startAngle);
    const pe1 = point(outerRadius, endAngle);
    const arcoGrande = endAngle - startAngle > Math.PI ? 1 : 0;

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

const PATH_TYPES = {
    cuna: wedgePath,
    diamante: diamondPath,
};

function tracePetal(type, innerRadius, outerRadius, startAngle, endAngle) {
    const tracer = PATH_TYPES[type] || petalPath;
    return tracer(innerRadius, outerRadius, startAngle, endAngle);
}

function createRegion(label, id) {
    const node = document.createElementNS(SVG_NAMESPACE, label);
    node.setAttribute("id", id);
    node.setAttribute("fill", SAND_COLOR);
    node.setAttribute("stroke", LINE_COLOR);
    node.setAttribute("stroke-width", String(LINE_WIDTH));
    return node;
}

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

            if (petal.type === "gota") {
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

export { createSvg, MAX_RADIUS, SAND_COLOR, LINE_COLOR };
