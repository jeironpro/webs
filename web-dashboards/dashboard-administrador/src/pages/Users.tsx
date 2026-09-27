import { useEffect, useMemo, useState } from "react";
import {
    Ban,
    CheckCircle2,
    Edit,
    Eye,
    KeyRound,
    MoreHorizontal,
    Plus,
    Search,
    Trash2,
    UserPlus,
} from "lucide-react";

import { data } from "@/data";
import type { Role, User, UserStatus } from "@/data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { initials, timeAgo } from "@/lib/format";
import { StatusBadge } from "@/components/ui/status-badge";
import { userStatusStyles } from "@/lib/status";

const PAGE_SIZE = 8;

const roleLabel: Record<Role, string> = {
    admin: "Administrador",
    editor: "Editor",
    soporte: "Soporte",
    miembro: "Miembro",
};

// Matriz de permisos por rol, mostrada en el panel inferior.
const rolePermissions: Record<Role, { description: string; permissions: string[] }> = {
    admin: {
        description: "Acceso total a la consola y a la configuración.",
        permissions: [
            "Gestionar usuarios",
            "Editar contenido",
            "Ver auditoría",
            "Configurar sistema",
            "Exportar reportes",
        ],
    },
    editor: {
        description: "Crea y modera contenido; no toca usuarios ni configuración.",
        permissions: ["Crear contenido", "Publicar y archivar", "Moderar comentarios"],
    },
    soporte: {
        description: "Atiende incidencias y consulta datos de clientes.",
        permissions: ["Ver usuarios", "Cambiar planes", "Gestionar incidencias"],
    },
    miembro: {
        description: "Acceso de solo lectura a su propio espacio.",
        permissions: ["Ver contenido propio"],
    },
};

interface Notice {
    message: string;
    undo?: () => void;
}

interface UserFormState {
    name: string;
    email: string;
    role: Role;
    status: UserStatus;
    plan: string;
    location: string;
    verified: boolean;
}

const emptyForm: UserFormState = {
    name: "",
    email: "",
    role: "miembro",
    status: "pendiente",
    plan: "Starter",
    location: "",
    verified: false,
};

export function Users() {
    const [users, setUsers] = useState<User[]>(data.users);
    const [query, setQuery] = useState("");
    const [role, setRole] = useState<"todos" | Role>("todos");
    const [status, setStatus] = useState<"todos" | UserStatus>("todos");
    const [page, setPage] = useState(1);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<User | null>(null);
    const [form, setForm] = useState<UserFormState>(emptyForm);
    const [notice, setNotice] = useState<Notice | null>(null);

    // Aviso con deshacer: se descarta solo.
    useEffect(() => {
        if (!notice) return;
        const timer = window.setTimeout(() => setNotice(null), 6000);
        return () => window.clearTimeout(timer);
    }, [notice]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return users.filter((user) => {
            const matchesQuery =
                !q ||
                user.name.toLowerCase().includes(q) ||
                user.email.toLowerCase().includes(q);
            const matchesRole = role === "todos" || user.role === role;
            const matchesStatus = status === "todos" || user.status === status;
            return matchesQuery && matchesRole && matchesStatus;
        });
    }, [users, query, role, status]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const pageRows = filtered.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE,
    );

    function openCreate() {
        setEditing(null);
        setForm(emptyForm);
        setDialogOpen(true);
    }

    function openEdit(user: User) {
        setEditing(user);
        setForm({
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            plan: user.plan,
            location: user.location,
            verified: user.verified,
        });
        setDialogOpen(true);
    }

    function saveUser() {
        if (!form.name.trim() || !form.email.trim()) return;
        if (editing) {
            setUsers((current) =>
                current.map((user) =>
                    user.id === editing.id ? { ...user, ...form } : user,
                ),
            );
        } else {
            const newUser: User = {
                id: `usr_${String(users.length + 1).padStart(2, "0")}`,
                ...form,
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
            };
            setUsers((current) => [newUser, ...current]);
        }
        setDialogOpen(false);
    }

    function toggleSuspend(user: User) {
        setUsers((current) =>
            current.map((item) =>
                item.id === user.id
                    ? {
                          ...item,
                          status: item.status === "suspendido" ? "activo" : "suspendido",
                      }
                    : item,
            ),
        );
    }

    function removeUser(user: User) {
        setUsers((current) => current.filter((item) => item.id !== user.id));
        setNotice({
            message: `«${user.name}» eliminado.`,
            undo: () => setUsers((current) => [...current, user]),
        });
    }

    return (
        <div className="space-y-6">
            <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h2 className="text-xl font-semibold">Gestión de usuarios</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {users.length} usuarios ·{" "}
                        {users.filter((u) => u.status === "activo").length} activos
                    </p>
                </div>
                <Button onClick={openCreate}>
                    <UserPlus className="h-4 w-4" aria-hidden="true" />
                    Nuevo usuario
                </Button>
            </header>

            {/* Filtros */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <div className="relative flex-1">
                    <Search
                        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                        aria-hidden="true"
                    />
                    <Input
                        value={query}
                        onChange={(event) => {
                            setQuery(event.target.value);
                            setPage(1);
                        }}
                        placeholder="Buscar por nombre o correo…"
                        className="pl-9"
                        aria-label="Buscar usuarios"
                    />
                </div>
                <Select
                    value={role}
                    onValueChange={(value) => {
                        setRole(value as "todos" | Role);
                        setPage(1);
                    }}
                >
                    <SelectTrigger
                        className="w-full md:w-44"
                        aria-label="Filtrar por rol"
                    >
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="todos">Todos los roles</SelectItem>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="soporte">Soporte</SelectItem>
                        <SelectItem value="miembro">Miembro</SelectItem>
                    </SelectContent>
                </Select>
                <Select
                    value={status}
                    onValueChange={(value) => {
                        setStatus(value as "todos" | UserStatus);
                        setPage(1);
                    }}
                >
                    <SelectTrigger
                        className="w-full md:w-44"
                        aria-label="Filtrar por estado"
                    >
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="todos">Todos los estados</SelectItem>
                        <SelectItem value="activo">Activo</SelectItem>
                        <SelectItem value="suspendido">Suspendido</SelectItem>
                        <SelectItem value="pendiente">Pendiente</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Tabla */}
            <div className="surface-hairline overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[minmax(0,1fr)]">Usuario</TableHead>
                            <TableHead className="hidden md:table-cell">Rol</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="hidden lg:table-cell">Plan</TableHead>
                            <TableHead className="hidden xl:table-cell">
                                Último acceso
                            </TableHead>
                            <TableHead className="w-12 text-right"> </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pageRows.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="py-10 text-center text-sm text-muted-foreground"
                                >
                                    Sin resultados para los filtros actuales.
                                </TableCell>
                            </TableRow>
                        ) : (
                            pageRows.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className="bg-accent text-xs text-accent-foreground">
                                                    {initials(user.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0 leading-tight">
                                                <p className="truncate text-sm font-medium">
                                                    {user.name}
                                                </p>
                                                <p className="truncate text-xs text-muted-foreground">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <span className="mono-label text-muted-foreground">
                                            {roleLabel[user.role]}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge {...userStatusStyles[user.status]} />
                                    </TableCell>
                                    <TableCell className="hidden lg:table-cell">
                                        <span className="text-sm">{user.plan}</span>
                                    </TableCell>
                                    <TableCell className="hidden xl:table-cell">
                                        <span className="text-sm text-muted-foreground">
                                            {timeAgo(user.lastLogin)}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    aria-label={`Acciones de ${user.name}`}
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                align="end"
                                                className="w-48"
                                            >
                                                <DropdownMenuLabel className="truncate">
                                                    {user.name}
                                                </DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => openEdit(user)}
                                                >
                                                    <Eye
                                                        className="h-4 w-4"
                                                        aria-hidden="true"
                                                    />{" "}
                                                    Ver / editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => toggleSuspend(user)}
                                                >
                                                    {user.status === "suspendido" ? (
                                                        <>
                                                            <CheckCircle2
                                                                className="h-4 w-4"
                                                                aria-hidden="true"
                                                            />{" "}
                                                            Reactivar
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Ban
                                                                className="h-4 w-4"
                                                                aria-hidden="true"
                                                            />{" "}
                                                            Suspender
                                                        </>
                                                    )}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive"
                                                    onClick={() => removeUser(user)}
                                                >
                                                    <Trash2
                                                        className="h-4 w-4"
                                                        aria-hidden="true"
                                                    />{" "}
                                                    Eliminar
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Paginación */}
            <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                    {filtered.length === 0
                        ? "0 resultados"
                        : `${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, filtered.length)} de ${filtered.length}`}
                </p>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                        Anterior
                    </Button>
                    <span className="tabular text-sm text-muted-foreground">
                        {currentPage} / {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    >
                        Siguiente
                    </Button>
                </div>
            </div>

            {/* Roles y permisos */}
            <section>
                <h3 className="mb-3 flex items-center gap-2 text-base font-semibold">
                    <KeyRound
                        className="h-4 w-4 text-muted-foreground"
                        aria-hidden="true"
                    />
                    Roles y permisos
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {(Object.keys(rolePermissions) as Role[]).map((item) => (
                        <div key={item} className="surface-hairline rounded-lg p-5">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold">{roleLabel[item]}</p>
                                <span className="mono-label text-[10px] text-muted-foreground">
                                    {users.filter((u) => u.role === item).length}
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                {rolePermissions[item].description}
                            </p>
                            <ul className="mt-3 space-y-1.5">
                                {rolePermissions[item].permissions.map((permission) => (
                                    <li
                                        key={permission}
                                        className="flex items-center gap-2 text-sm"
                                    >
                                        <CheckCircle2
                                            className="h-3.5 w-3.5 text-muted-foreground"
                                            aria-hidden="true"
                                        />
                                        {permission}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {/* Diálogo crear/editar */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {editing ? "Editar usuario" : "Nuevo usuario"}
                        </DialogTitle>
                        <DialogDescription>
                            {editing
                                ? editing.email
                                : "Completa los datos del nuevo usuario."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="user-name">Nombre</Label>
                            <Input
                                id="user-name"
                                value={form.name}
                                onChange={(event) =>
                                    setForm({ ...form, name: event.target.value })
                                }
                                placeholder="Nombre y apellidos"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="user-email">Correo</Label>
                            <Input
                                id="user-email"
                                type="email"
                                value={form.email}
                                onChange={(event) =>
                                    setForm({ ...form, email: event.target.value })
                                }
                                placeholder="nombre@empresa.com"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="grid gap-2">
                                <Label>Rol</Label>
                                <Select
                                    value={form.role}
                                    onValueChange={(value) =>
                                        setForm({ ...form, role: value as Role })
                                    }
                                >
                                    <SelectTrigger aria-label="Rol">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">
                                            Administrador
                                        </SelectItem>
                                        <SelectItem value="editor">Editor</SelectItem>
                                        <SelectItem value="soporte">Soporte</SelectItem>
                                        <SelectItem value="miembro">Miembro</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Estado</Label>
                                <Select
                                    value={form.status}
                                    onValueChange={(value) =>
                                        setForm({ ...form, status: value as UserStatus })
                                    }
                                >
                                    <SelectTrigger aria-label="Estado">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="activo">Activo</SelectItem>
                                        <SelectItem value="pendiente">
                                            Pendiente
                                        </SelectItem>
                                        <SelectItem value="suspendido">
                                            Suspendido
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="grid gap-2">
                                <Label htmlFor="user-plan">Plan</Label>
                                <Select
                                    value={form.plan}
                                    onValueChange={(value) =>
                                        setForm({ ...form, plan: value })
                                    }
                                >
                                    <SelectTrigger id="user-plan" aria-label="Plan">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Starter">Starter</SelectItem>
                                        <SelectItem value="Pro">Pro</SelectItem>
                                        <SelectItem value="Enterprise">
                                            Enterprise
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="user-location">Ubicación</Label>
                                <Input
                                    id="user-location"
                                    value={form.location}
                                    onChange={(event) =>
                                        setForm({ ...form, location: event.target.value })
                                    }
                                    placeholder="Ciudad, país"
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between rounded-md border p-3">
                            <div className="leading-tight">
                                <p className="text-sm font-medium">Cuenta verificada</p>
                                <p className="text-xs text-muted-foreground">
                                    Confirma la identidad del titular.
                                </p>
                            </div>
                            <Switch
                                checked={form.verified}
                                onCheckedChange={(checked) =>
                                    setForm({ ...form, verified: checked })
                                }
                                aria-label="Cuenta verificada"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={saveUser}>
                            {editing ? (
                                <Edit className="h-4 w-4" aria-hidden="true" />
                            ) : (
                                <Plus className="h-4 w-4" aria-hidden="true" />
                            )}
                            {editing ? "Guardar cambios" : "Crear usuario"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Aviso con deshacer */}
            {notice && (
                <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-md border bg-popover px-4 py-3 shadow-lg">
                    <p className="text-sm">{notice.message}</p>
                    {notice.undo && (
                        <Button
                            variant="link"
                            size="sm"
                            className="px-0"
                            onClick={() => {
                                notice.undo?.();
                                setNotice(null);
                            }}
                        >
                            Deshacer
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}

export default Users;
