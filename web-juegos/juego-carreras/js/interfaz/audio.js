/**
 * Audio del motor sin assets: un oscilador con filtro para el motor y ruido
 * filtrado para los derrapes. Todo se crea tras el primer gesto del jugador,
 * porque los navegadores bloquean el audio hasta entonces.
 */
export function crearAudio() {
    let contexto = null;
    let motor = null;
    let filtroMotor = null;
    let gananciaMotor = null;
    let gananciaRuido = null;
    let activo = true;

    function asegurarContexto() {
        if (contexto) return contexto;

        const AudioContexto = globalThis.AudioContext || globalThis.webkitAudioContext;
        if (!AudioContexto) return null;

        contexto = new AudioContexto();

        motor = contexto.createOscillator();
        motor.type = "sawtooth";
        motor.frequency.value = 60;

        filtroMotor = contexto.createBiquadFilter();
        filtroMotor.type = "lowpass";
        filtroMotor.frequency.value = 700;

        gananciaMotor = contexto.createGain();
        gananciaMotor.gain.value = 0;

        motor.connect(filtroMotor);
        filtroMotor.connect(gananciaMotor);
        gananciaMotor.connect(contexto.destination);
        motor.start();

        const longitud = Math.floor(contexto.sampleRate * 1.5);
        const buffer = contexto.createBuffer(1, longitud, contexto.sampleRate);
        const muestras = buffer.getChannelData(0);
        for (let i = 0; i < longitud; i += 1) {
            muestras[i] = Math.random() * 2 - 1;
        }

        const ruido = contexto.createBufferSource();
        ruido.buffer = buffer;
        ruido.loop = true;

        const filtroRuido = contexto.createBiquadFilter();
        filtroRuido.type = "bandpass";
        filtroRuido.frequency.value = 1600;
        filtroRuido.Q.value = 0.7;

        gananciaRuido = contexto.createGain();
        gananciaRuido.gain.value = 0;

        ruido.connect(filtroRuido);
        filtroRuido.connect(gananciaRuido);
        gananciaRuido.connect(contexto.destination);
        ruido.start();

        return contexto;
    }

    return {
        activar(silencioso = false) {
            activo = !silencioso;
            const ctx = asegurarContexto();
            if (!ctx) return;
            if (ctx.state === "suspended") ctx.resume();
        },
        aplicarSilencio(silencioso) {
            activo = !silencioso;
            if (!contexto || activo) return;
            gananciaMotor?.gain.setTargetAtTime(0, contexto.currentTime, 0.05);
            gananciaRuido?.gain.setTargetAtTime(0, contexto.currentTime, 0.05);
        },
        actualizar({ velocidad, derrape }) {
            if (!contexto || !activo) return;

            const v = Math.min(velocidad, 72);
            const marcha = 1 + Math.floor(v / 20) * 0.5;
            const ahora = contexto.currentTime;

            motor.frequency.setTargetAtTime(55 + v * 2.3 * marcha, ahora, 0.06);
            filtroMotor.frequency.setTargetAtTime(450 + v * 20, ahora, 0.08);
            gananciaMotor.gain.setTargetAtTime(0.03 + Math.min(v / 72, 1) * 0.05, ahora, 0.1);
            gananciaRuido.gain.setTargetAtTime(derrape && v > 8 ? 0.05 : 0, ahora, 0.07);
        },
        pausar() {
            if (!contexto) return;
            gananciaMotor?.gain.setTargetAtTime(0, contexto.currentTime, 0.04);
            gananciaRuido?.gain.setTargetAtTime(0, contexto.currentTime, 0.04);
        },
    };
}
