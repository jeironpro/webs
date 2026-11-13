const CLOUD_COUNT = 18;
const CLOUD_SIZES = ["cloud--sm", "cloud--md", "cloud--lg"];
const CLOUD_ROWS = [
    "cloud--row-1",
    "cloud--row-2",
    "cloud--row-3",
    "cloud--row-4",
    "cloud--row-5",
    "cloud--row-6",
    "cloud--row-7",
    "cloud--row-8",
];
const CLOUD_SPEEDS = ["cloud--speed-1", "cloud--speed-2", "cloud--speed-3", "cloud--speed-4"];
const CLOUD_DELAYS = ["cloud--delay-1", "cloud--delay-2", "cloud--delay-3", "cloud--delay-4"];

const randomItem = (items) => items[Math.floor(Math.random() * items.length)];

for (let index = 0; index < CLOUD_COUNT; index += 1) {
    const cloud = document.createElement("div");
    cloud.className = [
        "cloud",
        randomItem(CLOUD_SIZES),
        randomItem(CLOUD_ROWS),
        randomItem(CLOUD_SPEEDS),
        randomItem(CLOUD_DELAYS),
    ].join(" ");
    cloud.setAttribute("aria-hidden", "true");
    document.body.appendChild(cloud);
}

const planeWrapper = document.getElementById("plane-wrapper");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (planeWrapper && !reducedMotion.matches) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const margin = 100;
    const points = Array.from({ length: 6 }, () => ({
        x: margin + Math.random() * Math.max(width - margin * 2, 0),
        y: margin + Math.random() * Math.max(height - margin * 2, 0),
    }));

    const frames = points.map((point, index) => {
        const next = points[(index + 1) % points.length];
        const angle = (Math.atan2(next.y - point.y, next.x - point.x) * 180) / Math.PI + 90;
        return {
            transform: `translate3d(${point.x}px, ${point.y}px, 0) rotate(${angle}deg)`,
        };
    });

    planeWrapper.animate(frames, {
        duration: 36000,
        iterations: Infinity,
        direction: "alternate",
        easing: "linear",
    });
}
