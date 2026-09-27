import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Search } from "lucide-react";

import { flatNav } from "@/lib/nav";
import { cn } from "@/lib/utils";

interface CommandPaletteProps {
    open: boolean;
    onClose: () => void;
}

// Paleta ⌘K: apertura instantánea, búsqueda por texto y navegación por teclado.
export function CommandPalette({ open, onClose }: CommandPaletteProps) {
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const results = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return flatNav;
        return flatNav.filter((item) => item.title.toLowerCase().includes(q));
    }, [query]);

    useEffect(() => {
        if (!open) return;
        setQuery("");
        setSelected(0);
        // Enfoca el input en cuanto se monta la paleta.
        requestAnimationFrame(() => inputRef.current?.focus());
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.preventDefault();
                onClose();
            } else if (event.key === "ArrowDown") {
                event.preventDefault();
                setSelected((current) => (current + 1) % Math.max(results.length, 1));
            } else if (event.key === "ArrowUp") {
                event.preventDefault();
                setSelected(
                    (current) =>
                        (current - 1 + results.length) % Math.max(results.length, 1),
                );
            } else if (event.key === "Enter") {
                event.preventDefault();
                const target = results[selected];
                if (target) {
                    onClose();
                    navigate(target.href);
                }
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, results, selected, onClose, navigate]);

    useEffect(() => {
        setSelected(0);
    }, [query]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[60]"
            role="dialog"
            aria-modal="true"
            aria-label="Búsqueda"
        >
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
                aria-hidden="true"
            />
            <div className="absolute left-1/2 top-[12vh] w-[92vw] max-w-lg -translate-x-1/2 overflow-hidden rounded-lg border bg-popover shadow-xl">
                <div className="flex items-center gap-3 border-b px-4">
                    <Search
                        className="h-4 w-4 text-muted-foreground"
                        aria-hidden="true"
                    />
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Buscar una sección…"
                        className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                        aria-label="Buscar sección"
                    />
                    <kbd className="mono-label hidden rounded border px-1.5 py-0.5 text-[10px] text-muted-foreground sm:block">
                        ESC
                    </kbd>
                </div>

                <ul className="max-h-72 overflow-y-auto p-1.5" role="listbox">
                    {results.length === 0 ? (
                        <li className="px-3 py-8 text-center text-sm text-muted-foreground">
                            Sin resultados para «{query}».
                        </li>
                    ) : (
                        results.map((item, index) => (
                            <li
                                key={item.href}
                                role="option"
                                aria-selected={index === selected}
                            >
                                <button
                                    type="button"
                                    onClick={() => {
                                        onClose();
                                        navigate(item.href);
                                    }}
                                    onMouseEnter={() => setSelected(index)}
                                    className={cn(
                                        "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-colors",
                                        index === selected
                                            ? "bg-accent text-accent-foreground"
                                            : "text-foreground",
                                    )}
                                >
                                    <item.icon
                                        className="h-4 w-4 shrink-0"
                                        aria-hidden="true"
                                    />
                                    <span className="flex-1 whitespace-nowrap">
                                        {item.title}
                                    </span>
                                    {index === selected && (
                                        <ArrowRight
                                            className="h-4 w-4"
                                            aria-hidden="true"
                                        />
                                    )}
                                </button>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
}
