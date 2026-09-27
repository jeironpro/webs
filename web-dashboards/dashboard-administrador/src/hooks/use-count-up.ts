import { useEffect, useState } from "react";
import { animate } from "animejs";
import { useReducedMotion } from "./use-reduced-motion";

// Anima un número de 0 a `target` con animejs. Si el usuario prefiere
// movimiento reducido, devuelve directamente el valor final.
export function useCountUp(target: number, duration = 900): number {
    const [value, setValue] = useState(0);
    const reduced = useReducedMotion();

    useEffect(() => {
        if (reduced) {
            setValue(target);
            return;
        }
        const proxy = { n: 0 };
        const animation = animate(proxy, {
            n: [0, target],
            duration,
            ease: "outExpo",
            onUpdate: () => setValue(proxy.n),
        });
        return () => {
            animation.pause();
        };
    }, [target, duration, reduced]);

    return value;
}
