import { useEffect, useRef } from 'react'

function random(min, max) {
    return Math.random() * (max - min) + min
}

const STAR_POLYGON = 'polygon(50% 0%, 40% 40%, 0% 50%, 40% 60%, 50% 100%, 60% 60%, 100% 50%, 60% 40%)'

// Fondo animado con estrellas parpadeantes (4 puntas) y 3 meteoros.
export default function Stars() {
    const containerRef = useRef(null)

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        // 80 estrellas de 4 puntas con parpadeo
        for (let i = 0; i < 80; i++) {
            const glow = document.createElement('div')
            const size = random(1.5, 3.5)
            const svgSize = size * 4
            const color = i % 7 === 0 ? '#f59e0b' : '#ffffff'
            const opacity = random(0.2, 0.9)

            // Glow circular detrás
            glow.style.cssText = `
                position: absolute;
                left: ${random(0, 100)}%;
                top: ${random(0, 100)}%;
                width: ${svgSize}px;
                height: ${svgSize}px;
                margin-left: -${svgSize / 2}px;
                margin-top: -${svgSize / 2}px;
                border-radius: 50%;
                background: radial-gradient(circle, ${color} ${size * 0.8}px, transparent ${size * 2.5}px);
                opacity: ${opacity * 0.4};
                animation: twinkle ${random(3, 7)}s ease-in-out infinite;
                animation-delay: ${random(0, 8)}s;
            `
            container.appendChild(glow)

            // Estrella de 4 puntas
            const star = document.createElement('div')
            star.style.cssText = `
                position: absolute;
                left: ${random(0, 100)}%;
                top: ${random(0, 100)}%;
                width: ${svgSize}px;
                height: ${svgSize}px;
                margin-left: -${svgSize / 2}px;
                margin-top: -${svgSize / 2}px;
                background: ${color};
                clip-path: ${STAR_POLYGON};
                opacity: ${opacity};
                animation: twinkle ${random(3, 7)}s ease-in-out infinite;
                animation-delay: ${random(0, 8)}s;
            `
            container.appendChild(star)
        }

        // 3 meteoros con ciclo de 30s y delays espaciados
        for (let i = 0; i < 3; i++) {
            const meteor = document.createElement('div')

            // Glow
            const glow = document.createElement('div')
            glow.style.cssText = `
                position: absolute;
                top: -5px;
                left: -5px;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(0,212,255,0.5) 0%, transparent 100%);
            `
            meteor.appendChild(glow)

            // Cabeza de estrella
            const head = document.createElement('div')
            head.style.cssText = `
                position: absolute;
                top: -6px;
                left: -6px;
                width: 14px;
                height: 14px;
                background: #ffffff;
                clip-path: ${STAR_POLYGON};
                box-shadow: 0 0 6px #00d4ff;
            `
            meteor.appendChild(head)

            meteor.style.cssText = `
                position: absolute;
                left: ${random(65, 100)}%;
                top: ${random(5, 35)}%;
                width: 2px;
                height: 2px;
                animation: shooting-cycle 30s ease-out infinite;
                animation-delay: ${i * 10}s;
            `
            container.appendChild(meteor)
        }

        return () => {
            container.innerHTML = ''
        }
    }, [])

    return (
        <div ref={containerRef} className="fixed inset-0 overflow-hidden pointer-events-none z-0" />
    )
}