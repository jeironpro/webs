for (let i = 0; i < 20; i++) {
    const cloud = document.createElement("div");
    cloud.className = "cloud";
    const scale = Math.random() * 0.5 + 0.6;
    cloud.style.width = `${200 * scale}px`;
    cloud.style.height = `${120 * scale}px`;
    cloud.style.top = `${Math.random() * 100}vh`;
    cloud.style.left = `${Math.random() * 100}vw`;
    cloud.style.animationDuration = `${60 + Math.random() * 40}s`;
    document.body.appendChild(cloud);
}

const planeWrapper = document.getElementById("plane-wrapper");
const plane = document.getElementById("plane");

let x = window.innerWidth / 2;
let y = window.innerHeight / 2;
let dx = Math.random() * 2 - 1;
let dy = Math.random() * 2 - 1;

function normalize() {
    const mag = Math.sqrt(dx * dx + dy * dy);
    dx /= mag;
    dy /= mag;
}
normalize();

function move() {
    const speed = 2.5;
    x += dx * speed;
    y += dy * speed;

    if (x < 0 || x > window.innerWidth) dx *= -1;
    if (y < 0 || y > window.innerHeight) dy *= -1;

    if (Math.random() < 0.01) {
        dx += (Math.random() - 0.5) * 0.3;
        dy += (Math.random() - 0.5) * 0.3;
        normalize();
    }

    const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;

    planeWrapper.style.left = `${x}px`;
    planeWrapper.style.top = `${y}px`;
    plane.style.transform = `rotate(${angle}deg)`;

    const trail = document.createElement("div");
    trail.className = "trail";

    // Ajustamos la posición al centro trasero del avión
    const trailX = x - Math.cos(((angle - 90) * Math.PI) / 180) * 20;
    const trailY = y - Math.sin(((angle - 90) * Math.PI) / 180) * 20;

    trail.style.left = `${trailX - 12}px`; // 12 = ancho / 2
    trail.style.top = `${trailY - 6}px`; // 6 = alto / 2
    trail.style.transform = `rotate(${angle}deg)`;
    document.body.appendChild(trail);

    setTimeout(() => trail.remove(), 2000);

    requestAnimationFrame(move);
}

move();
