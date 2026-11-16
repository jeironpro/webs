import {
    formatAngle,
    formatNumber,
    formatRadians,
    normalizeAngle,
    quadrantOf,
    trigValues,
} from "./modules/trig.js";

const $ = (id) => document.getElementById(id);

const elements = {
    angleValue: $("angle-value"),
    angleRadians: $("angle-radians"),
    sinValue: $("sin-value"),
    cosValue: $("cos-value"),
    tanValue: $("tan-value"),
    coordsValue: $("coords-value"),
    quadrant: $("quadrant"),
    range: $("angle-range"),
    number: $("angle-number"),
    svg: $("orbit-svg"),
    arc: $("arc"),
    cosLine: $("cos-line"),
    sinLine: $("sin-line"),
    radius: $("radius"),
    point: $("point"),
};

const presets = Array.from(document.querySelectorAll("[data-angle]"));

let dragging = false;
let currentAngle = 30;

function arcPath(angle) {
    if (angle < 0.05 || angle > 359.95) return "";

    const radius = 0.28;
    const radians = (angle * Math.PI) / 180;
    const x = radius * Math.cos(radians);
    const y = -radius * Math.sin(radians);
    const largeArc = angle > 180 ? 1 : 0;

    return `M ${radius} 0 A ${radius} ${radius} 0 ${largeArc} 0 ${x} ${y}`;
}

function render(degrees, options = {}) {
    const angle = normalizeAngle(degrees);
    const { sin, cos, tan } = trigValues(angle);
    const x = cos;
    const y = -sin;

    currentAngle = angle;

    elements.angleValue.textContent = formatAngle(angle);
    elements.angleRadians.textContent = formatRadians(angle);
    elements.sinValue.textContent = formatNumber(sin, 3);
    elements.cosValue.textContent = formatNumber(cos, 3);
    elements.tanValue.textContent = tan === null ? "no definida" : formatNumber(tan, 3);
    elements.coordsValue.textContent = `(${formatNumber(cos, 3)}, ${formatNumber(sin, 3)})`;
    elements.quadrant.textContent = quadrantOf(angle);

    elements.arc.setAttribute("d", arcPath(angle));
    elements.cosLine.setAttribute("x2", String(x));
    elements.cosLine.setAttribute("y2", "0");
    elements.sinLine.setAttribute("x1", String(x));
    elements.sinLine.setAttribute("y1", "0");
    elements.sinLine.setAttribute("x2", String(x));
    elements.sinLine.setAttribute("y2", String(y));
    elements.radius.setAttribute("x2", String(x));
    elements.radius.setAttribute("y2", String(y));
    elements.point.setAttribute("cx", String(x));
    elements.point.setAttribute("cy", String(y));

    if (options.range !== false) elements.range.value = String(Math.round(angle));
    if (options.number !== false) elements.number.value = String(Number(angle.toFixed(1)));

    presets.forEach((button) => {
        const matches = Math.abs(normalizeAngle(Number(button.dataset.angle)) - angle) < 0.05;
        button.setAttribute("aria-pressed", String(matches));
    });
}

function angleFromPointer(event) {
    const rect = elements.svg.getBoundingClientRect();
    const scaleX = 2.6 / rect.width;
    const scaleY = 2.6 / rect.height;
    const x = (event.clientX - rect.left) * scaleX - 1.3;
    const y = (event.clientY - rect.top) * scaleY - 1.3;

    return normalizeAngle((Math.atan2(-y, x) * 180) / Math.PI);
}

elements.range.addEventListener("input", () => {
    render(Number(elements.range.value));
});

elements.number.addEventListener("input", () => {
    if (elements.number.value.trim() === "") return;
    const value = Number(elements.number.value);
    if (Number.isFinite(value)) render(value, { number: false });
});

presets.forEach((button) => {
    button.addEventListener("click", () => {
        render(Number(button.dataset.angle));
    });
});

elements.svg.addEventListener("pointerdown", (event) => {
    dragging = true;
    elements.svg.setPointerCapture(event.pointerId);
    render(angleFromPointer(event));
});

elements.svg.addEventListener("pointermove", (event) => {
    if (dragging) render(angleFromPointer(event));
});

["pointerup", "pointercancel"].forEach((type) => {
    elements.svg.addEventListener(type, () => {
        dragging = false;
    });
});

render(currentAngle);
