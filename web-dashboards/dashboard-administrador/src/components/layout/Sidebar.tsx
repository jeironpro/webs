import { Link, NavLink } from "react-router-dom";
import { X } from "lucide-react";

import { navSections } from "@/lib/nav";
import { data } from "@/data";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { initials } from "@/lib/format";

interface SidebarProps {
    open: boolean;
    onClose: () => void;
}

function SidebarContent() {
    const currentUser = data.users[0];

    return (
        <div className="flex h-full flex-col">
            <Link
                to="/"
                aria-label="Ir al inicio"
                className="flex h-16 items-center gap-3 border-b px-5 transition-colors hover:bg-muted/60"
            >
                <img
                    src="/favicon.svg"
                    alt=""
                    aria-hidden="true"
                    className="h-8 w-8 shrink-0"
                />
                <div className="flex flex-col leading-tight">
                    <span className="font-heading text-sm font-semibold tracking-tight">
                        Nexo
                    </span>
                    <span className="mono-label text-[10px] text-muted-foreground">
                        {data.meta.environment}
                    </span>
                </div>
            </Link>

            <nav
                className="flex-1 overflow-y-auto px-3 py-4"
                aria-label="Navegación principal"
            >
                {navSections.map((section) => (
                    <div key={section.label} className="mb-5">
                        <p className="mono-label mb-2 px-2 text-[10px] text-muted-foreground">
                            {section.label}
                        </p>
                        <ul className="space-y-0.5">
                            {section.items.map((item) => (
                                <li key={item.href}>
                                    <NavLink
                                        to={item.href}
                                        end={item.href === "/"}
                                        className={({ isActive }) =>
                                            cn(
                                                "group flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium transition-colors",
                                                isActive
                                                    ? "bg-accent text-accent-foreground"
                                                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                            )
                                        }
                                    >
                                        {({ isActive }) => (
                                            <>
                                                <item.icon
                                                    className={cn(
                                                        "h-4 w-4 shrink-0",
                                                        isActive
                                                            ? "text-accent-foreground"
                                                            : "text-muted-foreground",
                                                    )}
                                                    aria-hidden="true"
                                                />
                                                <span className="whitespace-nowrap">
                                                    {item.title}
                                                </span>
                                            </>
                                        )}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </nav>

            <div className="border-t p-3">
                <Link
                    to="/perfil"
                    className="flex items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-muted"
                >
                    <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-accent text-xs text-accent-foreground">
                            {initials(currentUser.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1 leading-tight">
                        <p className="truncate text-sm font-medium">{currentUser.name}</p>
                        <p className="mono-label text-[10px] text-muted-foreground">
                            {currentUser.role}
                        </p>
                    </div>
                </Link>
            </div>
        </div>
    );
}

export function Sidebar({ open, onClose }: SidebarProps) {
    return (
        <>
            {/* Escritorio: fija a la izquierda */}
            <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 border-r bg-background lg:block">
                <SidebarContent />
            </aside>

            {/* Móvil: panel deslizable con overlay */}
            <div
                className={cn(
                    "fixed inset-0 z-50 bg-black/50 transition-opacity lg:hidden",
                    open ? "opacity-100" : "pointer-events-none opacity-0",
                )}
                onClick={onClose}
                aria-hidden="true"
            />
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] border-r bg-background shadow-xl transition-transform duration-300 lg:hidden",
                    open ? "translate-x-0" : "-translate-x-full",
                )}
                aria-label="Navegación principal"
                aria-hidden={!open}
                inert={!open}
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-3 top-4 rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    aria-label="Cerrar menú"
                >
                    <X className="h-5 w-5" />
                </button>
                <SidebarContent />
            </aside>
        </>
    );
}
