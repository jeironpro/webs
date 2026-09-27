// Utilidades de formato compartidas por las vistas. Usan Intl para
// respetar el locale del navegador.

const numberFormat = new Intl.NumberFormat("es-ES");
const currencyFormat = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
});
const dateFormat = new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
});
const dateTimeFormat = new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
});

export function formatNumber(value: number): string {
    return numberFormat.format(value);
}

export function formatCurrency(value: number): string {
    return currencyFormat.format(value);
}

export function formatDate(iso: string): string {
    return dateFormat.format(new Date(iso));
}

export function formatDateTime(iso: string): string {
    return dateTimeFormat.format(new Date(iso));
}

// "hace 3 min", "hace 2 h", "hace 5 d" — para timestamps recientes.
export function timeAgo(iso: string): string {
    const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (seconds < 60) return "ahora mismo";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `hace ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `hace ${hours} h`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `hace ${days} d`;
    return formatDate(iso);
}

// Iniciales de un nombre completo para avatares.
export function initials(name: string): string {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("");
}
