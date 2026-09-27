import { useLocation, useNavigate } from "react-router-dom";
import { Menu, Search } from "lucide-react";

import { NotificationsPanel } from "./NotificationsPanel";
import { pageTitleForPath } from "@/lib/nav";
import { data } from "@/data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { initials } from "@/lib/format";

interface TopbarProps {
    onOpenMenu: () => void;
    onOpenPalette: () => void;
}

export function Topbar({ onOpenMenu, onOpenPalette }: TopbarProps) {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const title = pageTitleForPath(pathname);
    const currentUser = data.users[0];

    return (
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-background/90 px-4 backdrop-blur md:px-6">
            <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={onOpenMenu}
                aria-label="Abrir menú"
            >
                <Menu className="h-5 w-5" />
            </Button>

            <div className="min-w-0 flex-1">
                <p className="mono-label text-[10px] text-muted-foreground">
                    Nexo · consola
                </p>
                <h1 className="truncate text-base font-semibold leading-tight">
                    {title}
                </h1>
            </div>

            <button
                type="button"
                onClick={onOpenPalette}
                className="hidden h-9 w-64 items-center gap-2 rounded-md border bg-muted/60 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted md:flex"
            >
                <Search className="h-4 w-4" aria-hidden="true" />
                <span className="flex-1 text-left">Buscar…</span>
                <kbd className="mono-label rounded border bg-background px-1.5 py-0.5 text-[10px]">
                    ⌘K
                </kbd>
            </button>

            <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={onOpenPalette}
                aria-label="Buscar"
            >
                <Search className="h-5 w-5" />
            </Button>

            <NotificationsPanel />

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        type="button"
                        className="rounded-full outline-none"
                        aria-label="Perfil"
                    >
                        <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-accent text-xs text-accent-foreground">
                                {initials(currentUser.name)}
                            </AvatarFallback>
                        </Avatar>
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                        <span className="block text-sm font-medium">
                            {currentUser.name}
                        </span>
                        <span className="block text-xs font-normal text-muted-foreground">
                            {currentUser.email}
                        </span>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/perfil")}>
                        Perfil
                    </DropdownMenuItem>
                    <DropdownMenuItem>Salir</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}
