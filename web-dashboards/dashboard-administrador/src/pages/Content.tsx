import { useMemo, useState } from "react";
import {
    Archive,
    ArchiveRestore,
    FileText,
    MoreHorizontal,
    Package,
    Plus,
    Search,
} from "lucide-react";

import { data } from "@/data";
import type { Article, Product, PublishStatus } from "@/data";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency, formatDateTime, formatNumber } from "@/lib/format";
import { publishStatusStyles } from "@/lib/status";

function applyStatus<T extends { id: string }>(
    items: T[],
    id: string,
    status: PublishStatus,
): T[] {
    return items.map((item) => (item.id === id ? { ...item, status } : item));
}

function ProductsPanel() {
    const [products, setProducts] = useState<Product[]>(data.products);
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState<"todos" | PublishStatus>("todos");
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({ name: "", sku: "", category: "", price: 0 });

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return products.filter((product) => {
            const matchesQuery =
                !q ||
                product.name.toLowerCase().includes(q) ||
                product.sku.toLowerCase().includes(q) ||
                product.category.toLowerCase().includes(q);
            const matchesStatus = status === "todos" || product.status === status;
            return matchesQuery && matchesStatus;
        });
    }, [products, query, status]);

    function createProduct() {
        if (!form.name.trim()) return;
        const product: Product = {
            id: `prd_${String(products.length + 1).padStart(2, "0")}`,
            name: form.name,
            sku: form.sku || "NX-NEW-0000",
            category: form.category || "General",
            price: form.price,
            stock: 999,
            status: "borrador",
            updatedAt: new Date().toISOString(),
        };
        setProducts((current) => [product, ...current]);
        setForm({ name: "", sku: "", category: "", price: 0 });
        setOpen(false);
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <div className="relative flex-1">
                    <Search
                        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                        aria-hidden="true"
                    />
                    <Input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Buscar producto…"
                        className="pl-9"
                        aria-label="Buscar producto"
                    />
                </div>
                <Select
                    value={status}
                    onValueChange={(value) => setStatus(value as "todos" | PublishStatus)}
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
                        <SelectItem value="borrador">Borrador</SelectItem>
                        <SelectItem value="archivado">Archivado</SelectItem>
                    </SelectContent>
                </Select>
                <Button onClick={() => setOpen(true)}>
                    <Plus className="h-4 w-4" aria-hidden="true" /> Producto
                </Button>
            </div>

            <div className="surface-hairline overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Producto</TableHead>
                            <TableHead className="hidden md:table-cell">SKU</TableHead>
                            <TableHead className="hidden lg:table-cell">
                                Categoría
                            </TableHead>
                            <TableHead>Precio</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="w-12 text-right"> </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="py-10 text-center text-sm text-muted-foreground"
                                >
                                    Sin productos para los filtros actuales.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filtered.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
                                                <Package
                                                    className="h-4 w-4 text-muted-foreground"
                                                    aria-hidden="true"
                                                />
                                            </span>
                                            <div className="min-w-0 leading-tight">
                                                <p className="truncate text-sm font-medium">
                                                    {product.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatDateTime(product.updatedAt)}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <span className="mono-label text-muted-foreground">
                                            {product.sku}
                                        </span>
                                    </TableCell>
                                    <TableCell className="hidden lg:table-cell">
                                        <span className="text-sm">
                                            {product.category}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="tabular text-sm">
                                            {product.price === 0
                                                ? "Gratis"
                                                : formatCurrency(product.price)}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge
                                            {...publishStatusStyles[product.status]}
                                        />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    aria-label={`Acciones de ${product.name}`}
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                align="end"
                                                className="w-48"
                                            >
                                                <DropdownMenuLabel className="truncate">
                                                    {product.name}
                                                </DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        setProducts((c) =>
                                                            applyStatus(
                                                                c,
                                                                product.id,
                                                                "activo",
                                                            ),
                                                        )
                                                    }
                                                >
                                                    Publicar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        setProducts((c) =>
                                                            applyStatus(
                                                                c,
                                                                product.id,
                                                                "borrador",
                                                            ),
                                                        )
                                                    }
                                                >
                                                    Guardar borrador
                                                </DropdownMenuItem>
                                                {product.status === "archivado" ? (
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            setProducts((c) =>
                                                                applyStatus(
                                                                    c,
                                                                    product.id,
                                                                    "activo",
                                                                ),
                                                            )
                                                        }
                                                    >
                                                        <ArchiveRestore
                                                            className="h-4 w-4"
                                                            aria-hidden="true"
                                                        />{" "}
                                                        Restaurar
                                                    </DropdownMenuItem>
                                                ) : (
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            setProducts((c) =>
                                                                applyStatus(
                                                                    c,
                                                                    product.id,
                                                                    "archivado",
                                                                ),
                                                            )
                                                        }
                                                    >
                                                        <Archive
                                                            className="h-4 w-4"
                                                            aria-hidden="true"
                                                        />{" "}
                                                        Archivar
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Nuevo producto</DialogTitle>
                        <DialogDescription>Se crea como borrador.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="product-name">Nombre</Label>
                            <Input
                                id="product-name"
                                value={form.name}
                                onChange={(event) =>
                                    setForm({ ...form, name: event.target.value })
                                }
                                placeholder="Nexo Analytics Pro"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="grid gap-2">
                                <Label htmlFor="product-sku">SKU</Label>
                                <Input
                                    id="product-sku"
                                    value={form.sku}
                                    onChange={(event) =>
                                        setForm({ ...form, sku: event.target.value })
                                    }
                                    placeholder="NX-XX-000"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="product-price">Precio (€)</Label>
                                <Input
                                    id="product-price"
                                    type="number"
                                    min="0"
                                    value={form.price}
                                    onChange={(event) =>
                                        setForm({
                                            ...form,
                                            price: Number(event.target.value),
                                        })
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="product-category">Categoría</Label>
                            <Input
                                id="product-category"
                                value={form.category}
                                onChange={(event) =>
                                    setForm({ ...form, category: event.target.value })
                                }
                                placeholder="Analítica"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={createProduct}>Crear producto</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function ArticlesPanel() {
    const [articles, setArticles] = useState<Article[]>(data.articles);
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState<"todos" | PublishStatus>("todos");

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return articles.filter((article) => {
            const matchesQuery =
                !q ||
                article.title.toLowerCase().includes(q) ||
                article.author.toLowerCase().includes(q) ||
                article.category.toLowerCase().includes(q);
            const matchesStatus = status === "todos" || article.status === status;
            return matchesQuery && matchesStatus;
        });
    }, [articles, query, status]);

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <div className="relative flex-1">
                    <Search
                        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                        aria-hidden="true"
                    />
                    <Input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Buscar artículo…"
                        className="pl-9"
                        aria-label="Buscar artículo"
                    />
                </div>
                <Select
                    value={status}
                    onValueChange={(value) => setStatus(value as "todos" | PublishStatus)}
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
                        <SelectItem value="borrador">Borrador</SelectItem>
                        <SelectItem value="archivado">Archivado</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="surface-hairline overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Artículo</TableHead>
                            <TableHead className="hidden md:table-cell">Autor</TableHead>
                            <TableHead className="hidden lg:table-cell">
                                Categoría
                            </TableHead>
                            <TableHead>Vistas</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="w-12 text-right"> </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="py-10 text-center text-sm text-muted-foreground"
                                >
                                    Sin artículos para los filtros actuales.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filtered.map((article) => (
                                <TableRow key={article.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
                                                <FileText
                                                    className="h-4 w-4 text-muted-foreground"
                                                    aria-hidden="true"
                                                />
                                            </span>
                                            <div className="min-w-0 leading-tight">
                                                <p className="truncate text-sm font-medium">
                                                    {article.title}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {article.status === "activo"
                                                        ? formatDateTime(
                                                              article.publishedAt,
                                                          )
                                                        : "sin publicar"}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <span className="text-sm">{article.author}</span>
                                    </TableCell>
                                    <TableCell className="hidden lg:table-cell">
                                        <span className="text-sm">
                                            {article.category}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="tabular text-sm">
                                            {formatNumber(article.views)}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge
                                            {...publishStatusStyles[article.status]}
                                        />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    aria-label={`Acciones de ${article.title}`}
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                align="end"
                                                className="w-48"
                                            >
                                                <DropdownMenuLabel className="truncate">
                                                    Acciones
                                                </DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        setArticles((c) =>
                                                            applyStatus(
                                                                c,
                                                                article.id,
                                                                "activo",
                                                            ),
                                                        )
                                                    }
                                                >
                                                    Publicar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        setArticles((c) =>
                                                            applyStatus(
                                                                c,
                                                                article.id,
                                                                "borrador",
                                                            ),
                                                        )
                                                    }
                                                >
                                                    Guardar borrador
                                                </DropdownMenuItem>
                                                {article.status === "archivado" ? (
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            setArticles((c) =>
                                                                applyStatus(
                                                                    c,
                                                                    article.id,
                                                                    "activo",
                                                                ),
                                                            )
                                                        }
                                                    >
                                                        <ArchiveRestore
                                                            className="h-4 w-4"
                                                            aria-hidden="true"
                                                        />{" "}
                                                        Restaurar
                                                    </DropdownMenuItem>
                                                ) : (
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            setArticles((c) =>
                                                                applyStatus(
                                                                    c,
                                                                    article.id,
                                                                    "archivado",
                                                                ),
                                                            )
                                                        }
                                                    >
                                                        <Archive
                                                            className="h-4 w-4"
                                                            aria-hidden="true"
                                                        />{" "}
                                                        Archivar
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export function Content() {
    return (
        <div className="space-y-6">
            <header>
                <h2 className="text-xl font-semibold">Gestión de contenido</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    Productos y artículos de la plataforma con sus estados de publicación.
                </p>
            </header>

            <Tabs defaultValue="productos">
                <TabsList>
                    <TabsTrigger value="productos">Productos</TabsTrigger>
                    <TabsTrigger value="articulos">Artículos</TabsTrigger>
                </TabsList>
                <TabsContent value="productos">
                    <ProductsPanel />
                </TabsContent>
                <TabsContent value="articulos">
                    <ArticlesPanel />
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default Content;
