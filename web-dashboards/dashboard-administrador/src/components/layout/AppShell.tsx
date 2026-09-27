import { useCallback, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { CommandPalette } from "./CommandPalette";

export function AppShell() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [paletteOpen, setPaletteOpen] = useState(false);
    const { pathname } = useLocation();

    // Cierra el menú móvil al cambiar de ruta.
    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    // ⌘K / Ctrl+K abre la paleta; Escape la cierra.
    const onKeyDown = useCallback((event: KeyboardEvent) => {
        if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
            event.preventDefault();
            setPaletteOpen((open) => !open);
        }
    }, []);

    useEffect(() => {
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [onKeyDown]);

    return (
        <div className="min-h-dvh">
            <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
            <div className="lg:pl-60">
                <Topbar
                    onOpenMenu={() => setMenuOpen(true)}
                    onOpenPalette={() => setPaletteOpen(true)}
                />
                <main className="mx-auto w-full max-w-7xl p-4 md:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
            <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
        </div>
    );
}
