import {
    Activity,
    FileSpreadsheet,
    FileText,
    LayoutDashboard,
    ScrollText,
    Settings,
    Users,
    type LucideIcon,
} from "lucide-react";

export interface NavItem {
    title: string;
    href: string;
    icon: LucideIcon;
}

export interface NavSection {
    label: string;
    items: NavItem[];
}

// Estructura de la navegación lateral, agrupada por área.
export const navSections: NavSection[] = [
    {
        label: "General",
        items: [{ title: "Resumen", href: "/", icon: LayoutDashboard }],
    },
    {
        label: "Gestión",
        items: [
            { title: "Usuarios", href: "/usuarios", icon: Users },
            { title: "Contenido", href: "/contenido", icon: FileText },
        ],
    },
    {
        label: "Sistema",
        items: [
            { title: "Auditoría", href: "/auditoria", icon: ScrollText },
            { title: "Configuración", href: "/configuracion", icon: Settings },
            { title: "Salud", href: "/salud", icon: Activity },
        ],
    },
    {
        label: "Datos",
        items: [{ title: "Reportes", href: "/reportes", icon: FileSpreadsheet }],
    },
];

// Lista plana para la command palette y la búsqueda.
export const flatNav: NavItem[] = navSections.flatMap((section) => section.items);

// Rutas fuera de la navegación lateral (ej. perfil) con su propio título.
const extraTitles: Record<string, string> = {
    "/perfil": "Perfil",
};

// Devuelve el título del item que coincide con la ruta actual.
export function pageTitleForPath(pathname: string): string {
    if (extraTitles[pathname]) return extraTitles[pathname];
    const match = flatNav.find((item) =>
        item.href === "/" ? pathname === "/" : pathname.startsWith(item.href),
    );
    return match?.title ?? "Consola";
}
