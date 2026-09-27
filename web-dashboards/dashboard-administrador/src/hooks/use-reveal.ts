import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import { useReducedMotion } from "./use-reduced-motion";

// Revela los hijos directos de un contenedor con una entrada escalonada
// (opacity + translateY). Respeta prefers-reduced-motion.
export function useReveal<T extends HTMLElement>(delay = 60) {
    const ref = useRef<T>(null);
    const reduced = useReducedMotion();

    useEffect(() => {
        const root = ref.current;
        if (!root) return;
        const items = Array.from(root.children) as HTMLElement[];

        if (reduced) {
            items.forEach((el) => {
                el.style.opacity = "1";
                el.style.transform = "none";
            });
            return;
        }

        items.forEach((el) => {
            el.style.opacity = "0";
            el.style.transform = "translateY(10px)";
        });

        const animation = animate(items, {
            opacity: [0, 1],
            translateY: [10, 0],
            duration: 420,
            ease: "outExpo",
            delay: stagger(delay),
        });

        return () => {
            animation.pause();
        };
    }, [reduced, delay]);

    return ref;
}
