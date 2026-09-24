// Sistema de sonido con Web Audio API. No requiere archivos externos.
// AudioContext se crea de forma perezosa y se reanuda con un gesto del usuario
// para cumplir con la política de autoplay de los navegadores.

let ctx = null

function getCtx() {
    if (!ctx) {
        ctx = new (window.AudioContext || window.webkitAudioContext)()
    }
    return ctx
}

// Reanuda el AudioContext si está suspendido (requiere interacción del usuario)
export function resumeAudio() {
    const c = getCtx()
    if (c.state === 'suspended') {
        c.resume()
    }
}

// Reproduce 3 notas ascendentes (Do-Mi-Sol ~523-659-784 Hz) con fade out.
// Cada nota suena 150ms después de la anterior y dura 400ms.
export function playFinish() {
    const c = getCtx()
    const now = c.currentTime
    const notes = [523.25, 659.25, 783.99]
    notes.forEach((freq, i) => {
        const osc = c.createOscillator()
        const gain = c.createGain()
        osc.type = 'sine'
        osc.frequency.value = freq
        gain.gain.setValueAtTime(0.3, now + i * 0.15)
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.4)
        osc.connect(gain)
        gain.connect(c.destination)
        osc.start(now + i * 0.15)
        osc.stop(now + i * 0.15 + 0.4)
    })
}
