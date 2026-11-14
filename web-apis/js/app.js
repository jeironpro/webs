(function () {
    "use strict";

    const REPO = { owner: "jeironpro", repo: "webs", branch: "main" };
    const RAW_BASE = `https://raw.githubusercontent.com/${REPO.owner}/${REPO.repo}/${REPO.branch}/`;
    const TREE_URL = `https://api.github.com/repos/${REPO.owner}/${REPO.repo}/git/trees/${REPO.branch}?recursive=1`;
    const CATALOG_DIR = "web-apis/catalog";

    const CATALOG = [
        {
            slug: "api-pokemon",
            name: "API Pokémon",
            tagline: "Los 1.025 Pokémon con tipos, estadísticas e imágenes.",
            stack: "FastAPI · SQLModel",
            db: "PostgreSQL · Supabase",
            auth: "X-API-Key",
            surface: "saffron",
            badge: "FastAPI",
            badgeClass: "",
            featured: true,
            price: "1.025",
            priceUnit: "registros",
            routesLabel: "5 rutas",
            install: [
                "python -m venv .venv",
                "source .venv/bin/activate",
                "pip install -r requirements.txt",
                "uvicorn main:app --reload",
            ],
            endpoints: [
                ["POST", "/agregar_pokemon", "Crear un Pokémon"],
                ["GET", "/pokemones", "Listar los 1.025"],
                ["GET", "/pokemones/{id}", "Pokémon por ID"],
                ["GET", "/pokemones/tipo/{tipo}", "Filtrar por tipo"],
                ["POST", "/pokemones/{id}/imagen", "Subir imagen"],
            ],
            env: [
                "DATABASE_URL",
                "API_KEY",
                "SUPABASE_URL",
                "SUPABASE_SERVICE_KEY",
                "FRONTEND_URL",
            ],
        },
        {
            slug: "api-naruto",
            name: "API Naruto",
            tagline: "Personajes con habilidades, debilidades, fortalezas y estadísticas.",
            stack: "FastAPI · SQLModel",
            db: "PostgreSQL · Render",
            auth: "X-API-Key",
            surface: "terracotta",
            badge: "FastAPI",
            badgeClass: "",
            price: "129",
            priceUnit: "personajes",
            routesLabel: "6 rutas",
            install: [
                "python -m venv .venv",
                "source .venv/bin/activate",
                "pip install -r requirements.txt",
                "uvicorn main:app --reload",
            ],
            endpoints: [
                ["POST", "/personajes", "Crear personaje"],
                ["GET", "/personajes", "Listar personajes"],
                ["GET", "/personajes/{id}", "Personaje por ID"],
                ["GET", "/personajes/aldea/{aldea}", "Filtrar por aldea"],
                ["GET", "/personajes/rango/{rango}", "Filtrar por rango"],
                ["GET", "/personajes/equipo/{equipo}", "Filtrar por equipo"],
            ],
            env: ["DATABASE_URL", "API_KEY", "FRONTEND_URL"],
        },
        {
            slug: "api-biblia",
            name: "API Biblia",
            tagline: "CRUD de biblias, testamentos, libros, capítulos y versículos.",
            stack: "FastAPI · SQLModel",
            db: "MySQL",
            auth: "Sin auth · local/demo",
            surface: "marine",
            badge: "FastAPI",
            badgeClass: "",
            price: "5",
            priceUnit: "recursos",
            routesLabel: "CRUD completo",
            install: [
                "python -m venv .venv",
                "source .venv/bin/activate",
                "pip install -r requirements.txt",
                "uvicorn main:app --reload",
            ],
            endpoints: [
                ["POST", "/biblia · /testamento · /libro · /capitulo · /versiculo", "Crear"],
                ["GET", "/biblias · /testamentos · /libros · /capitulos · /versiculos", "Listar"],
                ["GET", "/{recurso}/{id}", "Por ID"],
                ["GET", "/versiculos/{libro}/{capitulo}", "Por libro y capítulo"],
                ["PATCH", "/{recurso}/{id}", "Actualizar"],
                ["DELETE", "/{recurso}/{id}", "Eliminar"],
            ],
            env: ["DATABASE_URL (MySQL)"],
        },
        {
            slug: "api-juego-preguntas-respuestas",
            name: "API Trivia",
            tagline: "350 preguntas en 7 categorías, con validación de respuestas y Swagger.",
            stack: "Flask · SQLAlchemy",
            db: "PostgreSQL · Neon",
            auth: "X-API-Key / api_key",
            surface: "ink",
            badge: "Flask",
            badgeClass: "new",
            price: "350",
            priceUnit: "preguntas",
            routesLabel: "9 rutas",
            install: [
                "python -m venv venv",
                "source venv/bin/activate",
                "pip install -r requirements.txt",
                "python app.py",
            ],
            endpoints: [
                ["GET", "/api/categorias", "Categorías"],
                ["GET", "/api/preguntas", "Listar preguntas"],
                ["POST", "/api/preguntas", "Crear pregunta"],
                ["GET", "/api/preguntas/aleatoria", "Pregunta al azar"],
                ["GET", "/api/preguntas/{id}", "Pregunta por ID"],
                ["PUT", "/api/preguntas/{id}", "Actualizar"],
                ["DELETE", "/api/preguntas/{id}", "Eliminar"],
                ["POST", "/api/preguntas/{id}/validar", "Validar respuesta"],
                ["GET", "/apidocs/", "Swagger UI"],
            ],
            env: ["DATABASE_URL", "API_KEYS"],
        },
        {
            slug: "api-correo-smtp-flask",
            name: "API Correo SMTP",
            tagline: "Envío de correos por SMTP, en texto plano o con plantilla HTML.",
            stack: "Flask · Flask-Mail",
            db: "—",
            auth: "Sin auth · local/demo",
            surface: "bone",
            badge: "Flask",
            badgeClass: "low",
            price: "2",
            priceUnit: "rutas",
            routesLabel: "2 rutas",
            install: [
                "python -m venv venv",
                "source venv/bin/activate",
                "pip install -r requirements.txt",
                "python app.py",
            ],
            endpoints: [
                ["POST", "/enviar_correo", "Correo en texto plano"],
                ["POST", "/enviar_correo_html", "Correo con plantilla HTML"],
            ],
            env: [
                "MAIL_SERVER",
                "MAIL_PORT",
                "MAIL_SENDER",
                "MAIL_USERNAME",
                "MAIL_PASSWORD",
                "MAIL_USE_TLS",
                "MAIL_USE_SSL",
            ],
        },
    ];

    const bySlug = Object.fromEntries(CATALOG.map((a) => [a.slug, a]));
    const featured = CATALOG.find((a) => a.featured) || CATALOG[0];

    function element(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    }

    function isLightSurface(surface) {
        return surface === "bone";
    }

    function methodClass(method) {
        return "mth--" + method.toLowerCase();
    }

    function codeBlock(lines, copyValue, withPrompt) {
        const code = element("div", "code");
        const copy = element("button", "code__copy", "Copiar");
        copy.type = "button";
        copy.dataset.copy = copyValue;
        const pre = element("pre");
        lines.forEach((line, index) => {
            if (index > 0) pre.append(document.createTextNode("\n"));
            if (withPrompt) pre.append(element("span", "c-mute", "$ "));
            pre.append(document.createTextNode(line));
        });
        code.append(copy, pre);
        return code;
    }

    function renderFeature() {
        const slot = document.getElementById("featureSlot");
        if (!slot) return;
        const dark = isLightSurface(featured.surface);
        const link = element("a", "feature-card");
        link.href = "#";
        link.dataset.open = featured.slug;
        link.setAttribute("aria-label", `Ver documentación de ${featured.name}`);

        const surface = element("div", `surface surface--${featured.surface}`);
        const zellige = element("div", "zellige");
        if (dark) zellige.classList.add("zellige--dark");
        zellige.setAttribute("aria-hidden", "true");

        const body = element("div", "feature-card__body");
        if (dark) body.classList.add("is-dark");
        const tag = element(
            "span",
            "feature-card__tag",
            `★ Destacada · 01/${String(CATALOG.length).padStart(2, "0")}`
        );
        const title = element("div", "feature-card__title", featured.name);
        const row = element("div", "feature-card__row feature-card__row--tight");
        const price = element("div", "feature-card__price", featured.price);
        price.append(element("small", undefined, featured.priceUnit));
        const cta = element("span", "feature-card__cta", "↗");
        cta.setAttribute("aria-hidden", "true");
        row.append(price, cta);
        body.append(tag, title, row);
        link.append(surface, zellige, body);
        slot.replaceChildren(link);
    }

    function renderCollection() {
        const grid = document.getElementById("collection");
        if (!grid) return;
        const cards = CATALOG.map((api) => {
            const dark = isLightSurface(api.surface);
            const card = element("article", "product");
            card.setAttribute("role", "listitem");

            const media = element("div", "product__media");
            media.dataset.open = api.slug;
            media.tabIndex = 0;
            media.setAttribute("role", "button");
            media.setAttribute("aria-label", `Ver documentación de ${api.name}`);

            const surface = element("div", `surface surface--${api.surface}`);
            const zellige = element("div", "zellige");
            if (dark) zellige.classList.add("zellige--dark");
            zellige.setAttribute("aria-hidden", "true");

            const badge = element(
                "span",
                "product__badge" + (api.badgeClass ? ` product__badge--${api.badgeClass}` : ""),
                api.badge
            );
            const quick = element("button", "product__quick", "Descargar .zip");
            quick.type = "button";
            quick.dataset.download = api.slug;
            media.append(surface, zellige, badge, quick);

            const row = element("div", "product__row");
            const copy = element("div", "product__row-copy");
            const name = element("h3", "product__name");
            const link = element("a", undefined, api.name);
            link.href = "#";
            link.dataset.open = api.slug;
            name.append(link);
            const meta = element("p", "product__meta", `${api.stack} · ${api.db}`);
            copy.append(name, meta);
            const routes = element("p", "product__price", api.routesLabel);
            row.append(copy, routes);

            const download = element("button", "product__download", "Ver documentación →");
            download.type = "button";
            download.dataset.open = api.slug;

            card.append(media, row, download);
            return card;
        });
        grid.replaceChildren(...cards);
    }

    function renderDrawer(api) {
        const title = document.getElementById("drawerTitle");
        const body = document.getElementById("drawerBody");
        const download = document.getElementById("drawerDownload");
        title.textContent = api.name;

        const tagline = element("p", "drawer__tagline", api.tagline);
        const chips = element("div", "chips");
        chips.append(
            element("span", "chip chip--accent", api.stack),
            element("span", "chip", api.db),
            element("span", "chip", api.auth),
            element("span", "chip chip--ink", "MIT")
        );

        const endpointsSection = element("div", "drawer__section");
        const endpointsTitle = element("h4", "drawer__h", "Endpoints");
        endpointsTitle.append(element("small", undefined, api.routesLabel));
        const endpoints = element("ul", "ep");
        for (const [method, route, description] of api.endpoints) {
            const item = element("li", "ep__row");
            item.append(
                element("span", `mth ${methodClass(method)}`, method),
                element("code", "ep__route", route),
                element("span", "ep__desc", description)
            );
            endpoints.append(item);
        }
        endpointsSection.append(endpointsTitle, endpoints);

        const installSection = element("div", "drawer__section");
        const installTitle = element("h4", "drawer__h", "Arranque local");
        installTitle.append(element("small", undefined, "terminal"));
        installSection.append(installTitle, codeBlock(api.install, api.install.join("\n"), true));

        const envSection = element("div", "drawer__section");
        const envTitle = element("h4", "drawer__h", "Variables de entorno");
        envTitle.append(element("small", undefined, ".env"));
        const envLines = api.env.map((variable) => variable + "=");
        envSection.append(envTitle, codeBlock(envLines, envLines.join("\n"), false));

        body.replaceChildren(tagline, chips, endpointsSection, installSection, envSection);
        download.dataset.download = api.slug;
    }

    const drawer = document.getElementById("drawer");
    const scrim = document.getElementById("scrim");
    let lastFocus = null;

    function openDrawer(slug) {
        const api = bySlug[slug];
        if (!api) return;
        renderDrawer(api);
        lastFocus = document.activeElement;
        drawer.classList.add("is-open");
        drawer.setAttribute("aria-hidden", "false");
        scrim.classList.add("is-open");
        scrim.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        const close = drawer.querySelector(".drawer__close");
        if (close) close.focus();
    }

    function closeDrawer() {
        drawer.classList.remove("is-open");
        drawer.setAttribute("aria-hidden", "true");
        scrim.classList.remove("is-open");
        scrim.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    let toastTimer = null;
    function toast(msg) {
        const el = document.getElementById("toast");
        if (!el) return;
        el.textContent = msg;
        el.classList.add("is-visible");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => el.classList.remove("is-visible"), 3000);
    }

    let treeCache = null;
    let busy = false;

    async function fetchTree() {
        if (treeCache) return treeCache;
        const res = await fetch(TREE_URL);
        if (!res.ok) throw new Error("tree http " + res.status);
        const data = await res.json();
        if (data.truncated) throw new Error("tree truncated");
        treeCache = data.tree.filter((t) => t.type === "blob");
        return treeCache;
    }

    async function fetchFile(path) {
        const res = await fetch(RAW_BASE + path);
        if (!res.ok) throw new Error("raw http " + res.status + " " + path);
        return new Uint8Array(await res.arrayBuffer());
    }

    async function buildEntries(nodes, strip) {
        const entries = [];
        for (const node of nodes) {
            const name =
                strip && node.path.startsWith(strip) ? node.path.slice(strip.length) : node.path;

            const data = node.size === 0 ? new Uint8Array(0) : await fetchFile(node.path);
            entries.push({ path: name, data });
        }
        return entries;
    }

    function saveZip(bytes, filename) {
        const blob = new Blob([bytes], { type: "application/zip" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 4000);
    }

    async function downloadApi(slug) {
        if (busy) return;
        busy = true;
        const api = bySlug[slug];
        try {
            toast("Preparando " + api.name + "…");
            const tree = await fetchTree();
            const prefix = CATALOG_DIR + "/" + slug + "/";
            const nodes = tree.filter((t) => t.path.startsWith(prefix));
            if (nodes.length === 0) throw new Error("no files for " + slug);
            const license = tree.find((t) => t.path === "LICENSE");
            if (license) nodes.push(license);

            const entries = await buildEntries(nodes, CATALOG_DIR + "/");
            const zip = window.Zip.buildZip(entries);
            saveZip(zip, slug + ".zip");
            toast("Descargando " + api.name + "…");
        } catch {
            toast("No se pudo preparar la descarga. Revisa tu conexión.");
        } finally {
            busy = false;
        }
    }

    async function downloadAll() {
        if (busy) return;
        busy = true;
        try {
            toast("Preparando todas las APIs…");
            const tree = await fetchTree();
            const strip = CATALOG_DIR + "/";
            const nodes = tree.filter((t) => t.path.startsWith(strip));
            const license = tree.find((t) => t.path === "LICENSE");
            if (license) nodes.push(license);

            const entries = await buildEntries(nodes, strip);
            const zip = window.Zip.buildZip(entries);
            saveZip(zip, "apis.zip");
            toast("Descargando todas las APIs…");
        } catch {
            toast("No se pudo preparar la descarga. Revisa tu conexión.");
        } finally {
            busy = false;
        }
    }

    async function copyText(text, btn) {
        try {
            await navigator.clipboard.writeText(text);
            const original = btn.textContent;
            btn.textContent = "Copiado";
            btn.classList.add("is-copied");
            setTimeout(() => {
                btn.textContent = original;
                btn.classList.remove("is-copied");
            }, 1600);
        } catch {
            toast("No se pudo copiar al portapapeles");
        }
    }

    document.addEventListener("click", function (e) {
        const downloadAllEl = e.target.closest("[data-download-all]");
        if (downloadAllEl) {
            e.preventDefault();
            downloadAll();
            return;
        }

        const downloadEl = e.target.closest("[data-download]");
        if (downloadEl) {
            e.preventDefault();
            downloadApi(downloadEl.dataset.download);
            return;
        }

        const copyEl = e.target.closest("[data-copy]");
        if (copyEl) {
            e.preventDefault();
            copyText(copyEl.dataset.copy, copyEl);
            return;
        }

        const openEl = e.target.closest("[data-open]");
        if (openEl) {
            e.preventDefault();
            openDrawer(openEl.dataset.open);
            return;
        }

        if (e.target.closest(".drawer__close") || e.target === scrim) {
            closeDrawer();
        }
    });

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && drawer.classList.contains("is-open")) {
            closeDrawer();
        }
        if (e.key === "Enter" || e.key === " ") {
            const media = e.target.closest(".product__media[role='button']");
            if (media) {
                e.preventDefault();
                openDrawer(media.dataset.open);
            }
        }
    });

    function applyCounts() {
        const total = CATALOG.length;
        document.querySelectorAll(".js-count").forEach((el) => {
            el.textContent = String(total);
        });
        document.querySelectorAll(".js-count-pad").forEach((el) => {
            el.textContent = String(total).padStart(2, "0");
        });
    }

    renderFeature();
    renderCollection();
    applyCounts();
})();
