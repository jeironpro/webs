/* Modulo: Ruleta - dibujo, animacion y logica de giro */

// Paleta de colores para los segmentos
const COLORS = [
	'#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6',
	'#1abc9c', '#e67e22', '#e84393', '#00b894', '#6c5ce7',
	'#fd79a8', '#0984e3', '#00cec9', '#d63031', '#fdcb6e',
	'#a29bfe', '#55a3e8', '#74b9ff', '#ff7675', '#fab1a0',
	'#81ecec', '#ffeaa7', '#dfe6e9', '#636e72', '#e17055',
	'#00b894', '#6c5ce7', '#fd79a8', '#0984e3', '#00cec9',
];

export class Roulette {
	constructor(canvasId) {
		this.canvas = document.getElementById(canvasId);
		this.ctx = this.canvas.getContext('2d');
		this.segments = [];
		this.currentAngle = 0;
		this.isSpinning = false;
		this.onComplete = null;
		this._animationId = null;

		this._resizeCanvas();
		window.addEventListener('resize', () => this._resizeCanvas());
	}

	_resizeCanvas() {
		const rect = this.canvas.getBoundingClientRect();
		const size = Math.min(rect.width, rect.height);
		if (size > 0) {
			this.canvas.width = size * (window.devicePixelRatio || 1);
			this.canvas.height = size * (window.devicePixelRatio || 1);
			this.canvas.style.width = `${size}px`;
			this.canvas.style.height = `${size}px`;
			this._scale = window.devicePixelRatio || 1;
			this._size = size;
			this.draw();
		}
	}

	setSegments(segments) {
		this.segments = segments;
		this.currentAngle = 0;
		this.draw();
	}

	getColor(index) {
		return COLORS[index % COLORS.length];
	}

	draw() {
		const ctx = this.ctx;
		const size = this.canvas.width;
		const cx = size / 2;
		const cy = size / 2;
		const radius = size / 2 - 4;
		const count = this.segments.length;
		const scale = this._scale || 1;
		const cssRadius = (this._size || size) / 2 - 4;

		ctx.clearRect(0, 0, size, size);

		if (count === 0) {
			// Dibujar circulo vacio
			ctx.beginPath();
			ctx.arc(cx, cy, radius, 0, Math.PI * 2);
			ctx.fillStyle = '#2d3436';
			ctx.fill();
			ctx.strokeStyle = '#636e72';
			ctx.lineWidth = 2;
			ctx.stroke();
			return;
		}

		const arcSize = (Math.PI * 2) / count;

		ctx.save();
		ctx.translate(cx, cy);
		ctx.rotate(this.currentAngle);

		for (let i = 0; i < count; i++) {
			const startAngle = i * arcSize - Math.PI / 2;
			const endAngle = startAngle + arcSize;

			// Dibujar segmento
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.arc(0, 0, radius, startAngle, endAngle);
			ctx.closePath();

			ctx.fillStyle = this.getColor(i);
			ctx.fill();
			ctx.strokeStyle = 'rgba(255,255,255,0.2)';
			ctx.lineWidth = 1.5;
			ctx.stroke();

			// Dibujar texto
			ctx.save();
			ctx.rotate(startAngle + arcSize / 2);
			ctx.textAlign = 'right';
			ctx.fillStyle = '#ffffff';
			const fontSize = Math.max(11, Math.min(16, cssRadius / count * 1.2));
			ctx.font = `bold ${Math.round(fontSize * scale)}px Inter, sans-serif`;
			ctx.shadowColor = 'rgba(0,0,0,0.5)';
			ctx.shadowBlur = 2;

			const textRadius = radius * 0.68;
			const label = String(this.segments[i]);
			const maxWidth = radius * 0.55;

			if (ctx.measureText(label).width > maxWidth) {
				const truncated = label.slice(0, 6) + '...';
				ctx.fillText(truncated, textRadius, 5);
			} else {
				ctx.fillText(label, textRadius, 5);
			}

			ctx.restore();
		}

		// Circulo central
		ctx.beginPath();
		ctx.arc(0, 0, radius * 0.12, 0, Math.PI * 2);
		ctx.fillStyle = '#1a1a2e';
		ctx.fill();
		ctx.strokeStyle = '#636e72';
		ctx.lineWidth = 2;
		ctx.stroke();

		ctx.restore();
	}

	spin() {
		if (this.isSpinning || this.segments.length === 0) return;
		this.isSpinning = true;

		// Velocidad inicial aleatoria (radianes por frame)
		const initialSpeed = 0.3 + Math.random() * 0.2;
		let speed = initialSpeed;

		// Desaceleracion
		const friction = 0.985;
		const minSpeed = 0.001;

		const animate = () => {
			speed *= friction;
			this.currentAngle += speed;
			this.draw();

			if (speed > minSpeed) {
				this._animationId = requestAnimationFrame(animate);
			} else {
				this.isSpinning = false;
				this._onSpinComplete();
			}
		};

		this._animationId = requestAnimationFrame(animate);
	}

	_onSpinComplete() {
		const count = this.segments.length;
		const arcSize = (Math.PI * 2) / count;

		// Calculamos el angulo relativo del puntero (parte superior) respecto al inicio del segmento 0
		const normalizedAngle = ((this.currentAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
		const relativeAngle = ((Math.PI * 2) - normalizedAngle) % (Math.PI * 2);
		const index = Math.floor(relativeAngle / arcSize) % count;

		const result = this.segments[index];

		if (this.onComplete) {
			this.onComplete(result, index);
		}
	}

	destroy() {
		if (this._animationId) {
			cancelAnimationFrame(this._animationId);
		}
		window.removeEventListener('resize', this._resizeCanvas);
	}
}
