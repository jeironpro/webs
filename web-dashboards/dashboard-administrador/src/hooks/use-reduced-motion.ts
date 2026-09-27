import { useEffect, useState } from "react";

// Detecta prefers-reduced-motion una sola vez y reacciona a cambios del SO.
export function useReducedMotion(): boolean {
    const [reduced, setReduced] = useState(false);

    useEffect(() => {
        const query = window.matchMedia("(prefers-reduced-motion: reduce)");
        const onChange = () => setReduced(query.matches);
        setReduced(query.matches);
        query.addEventListener("change", onChange);
        return () => query.removeEventListener("change", onChange);
    }, []);

    return reduced;
}
