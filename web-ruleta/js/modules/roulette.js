const COLOR_COUNT = 18;

export class Roulette {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.segments = [];
        this.currentAngle = 0;
        this.isSpinning = false;
        this.onComplete = null;
        this._animationId = null;
        this._size = 0;

        const styles = getComputedStyle(document.documentElement);
        const read = (name) => styles.getPropertyValue(name).trim();
        this._colors = Array.from({ length: COLOR_COUNT }, (_, index) =>
            read(`--wheel-color-${index + 1}`)
        );
        this._emptyColor = read("--color-wheel-empty");
        this._borderColor = read("--color-wheel-border");
        this._separatorColor = read("--color-wheel-separator");
        this._textColor = read("--color-white");
        this._centerColor = read("--color-wheel-center");
        this._shadowColor = read("--color-wheel-shadow");
        this._fontFamily = read("--font-primary");

        this._handleResize = () => this._resizeCanvas();
        window.addEventListener("resize", this._handleResize);
        this._resizeCanvas();
    }

    _resizeCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        const size = rect.width;
        if (size <= 0) {
            return;
        }
        const scale = window.devicePixelRatio || 1;
        this.canvas.width = Math.round(size * scale);
        this.canvas.height = Math.round(size * scale);
        this._size = size;
        this._scale = scale;
        this.draw();
    }

    setSegments(segments) {
        this._cancelAnimation();
        this.segments = segments;
        this.currentAngle = 0;
        this.isSpinning = false;
        this.canvas.setAttribute("aria-label", `Ruleta con ${segments.length} opciones`);
        this.draw();
    }

    getColor(index) {
        return this._colors[index % this._colors.length];
    }

    draw() {
        if (!this.ctx || this._size <= 0) {
            return;
        }
        const size = this._size;
        const scale = this._scale;
        const cx = size / 2;
        const cy = size / 2;
        const radius = size / 2 - 4;
        const count = this.segments.length;

        this.ctx.setTransform(scale, 0, 0, scale, 0, 0);
        this.ctx.clearRect(0, 0, size, size);

        if (count === 0) {
            this.ctx.beginPath();
            this.ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            this.ctx.fillStyle = this._emptyColor;
            this.ctx.fill();
            this.ctx.strokeStyle = this._borderColor;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            return;
        }

        const arcSize = (Math.PI * 2) / count;

        this.ctx.save();
        this.ctx.translate(cx, cy);
        this.ctx.rotate(this.currentAngle);

        for (let index = 0; index < count; index += 1) {
            const startAngle = index * arcSize - Math.PI / 2;
            const endAngle = startAngle + arcSize;

            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            this.ctx.arc(0, 0, radius, startAngle, endAngle);
            this.ctx.closePath();
            this.ctx.fillStyle = this.getColor(index);
            this.ctx.fill();
            this.ctx.strokeStyle = this._separatorColor;
            this.ctx.lineWidth = 1.5;
            this.ctx.stroke();

            if (arcSize * radius < 14) {
                continue;
            }

            this.ctx.save();
            this.ctx.rotate(startAngle + arcSize / 2);
            this.ctx.textAlign = "right";
            this.ctx.fillStyle = this._textColor;
            this.ctx.shadowColor = this._shadowColor;
            this.ctx.shadowBlur = 2;
            const fontSize = Math.max(11, Math.min(16, (radius / count) * 1.2));
            this.ctx.font = `600 ${fontSize}px ${this._fontFamily}`;

            const textRadius = radius * 0.68;
            const maxWidth = radius * 0.55;
            const label = String(this.segments[index]);
            const text =
                this.ctx.measureText(label).width > maxWidth ? `${label.slice(0, 6)}…` : label;
            this.ctx.fillText(text, textRadius, 5);
            this.ctx.restore();
        }

        this.ctx.beginPath();
        this.ctx.arc(0, 0, radius * 0.12, 0, Math.PI * 2);
        this.ctx.fillStyle = this._centerColor;
        this.ctx.fill();
        this.ctx.strokeStyle = this._borderColor;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        this.ctx.restore();
    }

    spin() {
        if (this.isSpinning || this.segments.length === 0) {
            return;
        }
        this.isSpinning = true;

        let speed = 0.3 + Math.random() * 0.2;
        const friction = 0.985;
        const minSpeed = 0.001;

        const animate = () => {
            speed *= friction;
            this.currentAngle += speed;
            this.draw();

            if (speed > minSpeed) {
                this._animationId = requestAnimationFrame(animate);
            } else {
                this._animationId = null;
                this.isSpinning = false;
                this._finishSpin();
            }
        };

        this._animationId = requestAnimationFrame(animate);
    }

    _finishSpin() {
        const count = this.segments.length;
        const arcSize = (Math.PI * 2) / count;
        const normalizedAngle = ((this.currentAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        const relativeAngle = (Math.PI * 2 - normalizedAngle) % (Math.PI * 2);
        const index = Math.floor(relativeAngle / arcSize) % count;

        if (this.onComplete) {
            this.onComplete(this.segments[index], index);
        }
    }

    _cancelAnimation() {
        if (this._animationId) {
            cancelAnimationFrame(this._animationId);
            this._animationId = null;
        }
    }

    destroy() {
        this._cancelAnimation();
        window.removeEventListener("resize", this._handleResize);
    }
}
