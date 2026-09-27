/* Portal de APIs — catálogo, descargas en el cliente y drawer de documentación.
 * Sin frameworks ni backend: fetch a los archivos del repo en GitHub y ZIP en
 * memoria (ver zip.js). El catálogo vive aquí, en un solo lugar.
 */
(function () {
    "use strict";

    /* ── Origen de los archivos ──────────────────────── */
    const REPO = { owner: "jeironpro", repo: "apis", branch: "main" };
    const RAW_BASE = `https://raw.githubusercontent.com/${REPO.owner}/${REPO.repo}/${REPO.branch}/`;
    const TREE_URL = `https://api.github.com/repos/${REPO.owner}/${REPO.repo}/git/trees/${REPO.branch}?recursive=1`;
    const CATALOG_DIR = "catalogo"; // carpeta del repo donde viven las APIs

    /* ── Catálogo ────────────────────────────────────── */
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
            env: ["DATABASE_URL", "API_KEY", "SUPABASE_URL", "SUPABASE_SERVICE_KEY", "FRONTEND_URL"],
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
            env: ["MAIL_SERVER", "MAIL_PORT", "MAIL_SENDER", "MAIL_USERNAME", "MAIL_PASSWORD", "MAIL_USE_TLS", "MAIL_USE_SSL"],
        },
    ];

    const bySlug = Object.fromEntries(CATALOG.map((a) => [a.slug, a]));
    const featured = CATALOG.find((a) => a.featured) || CATALOG[0];

    /* ── Helpers ─────────────────────────────────────── */
    function esc(s) {
        return String(s).replace(/[&<>"']/g, (c) => ({
            "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
        }[c]));
    }

    function isLightSurface(surface) {
        return surface === "bone";
    }

    function methodClass(method) {
        return "mth--" + method.toLowerCase();
    }

    /* ── Render: hero feature card ───────────────────── */
    function renderFeature() {
        const slot = document.getElementById("featureSlot");
        if (!slot) return;
        const dark = isLightSurface(featured.surface) ? " is-dark" : "";
        slot.innerHTML = `
      <a class="feature-card" href="#" data-open="${featured.slug}"
         aria-label="Ver documentación de ${esc(featured.name)}">
        <div class="surface surface--${featured.surface}"></div>
        <div class="zellige${dark ? " zellige--dark" : ""}" aria-hidden="true"></div>
        <div class="feature-card__body${dark}">
          <span class="feature-card__tag">★ Destacada · 01/${String(CATALOG.length).padStart(2, "0")}</span>
          <div>
            <div class="feature-card__title">${esc(featured.name)}</div>
            <div class="feature-card__row" style="margin-top:.5rem">
              <div class="feature-card__price">${esc(featured.price)} <small>${esc(featured.priceUnit)}</small></div>
              <span class="feature-card__cta" aria-hidden="true">↗</span>
            </div>
          </div>
        </div>
      </a>`;
    }

    /* ── Render: collection grid ─────────────────────── */
    function renderCollection() {
        const grid = document.getElementById("collection");
        if (!grid) return;
        grid.innerHTML = CATALOG.map((a) => {
            const dark = isLightSurface(a.surface);
            const badgeClass = a.badgeClass ? ` product__badge--${a.badgeClass}` : "";
            return `
      <article class="product" role="listitem">
        <div class="product__media" data-open="${a.slug}" tabindex="0" role="button"
             aria-label="Ver documentación de ${esc(a.name)}">
          <div class="surface surface--${a.surface}"></div>
          <div class="zellige${dark ? " zellige--dark" : ""}" aria-hidden="true"></div>
          <span class="product__badge${badgeClass}">${esc(a.badge)}</span>
          <button class="product__quick" data-download="${a.slug}">Descargar .zip</button>
        </div>
        <div class="product__row">
          <div style="min-width:0">
            <h3 class="product__name"><a href="#" data-open="${a.slug}">${esc(a.name)}</a></h3>
            <p class="product__meta">${esc(a.stack)} · ${esc(a.db)}</p>
          </div>
          <p class="product__price">${esc(a.routesLabel)}</p>
        </div>
        <button class="product__download" data-open="${a.slug}">Ver documentación →</button>
      </article>`;
        }).join("");
    }

    /* ── Render: drawer ──────────────────────────────── */
    function renderDrawer(api) {
        const title = document.getElementById("drawerTitle");
        const body = document.getElementById("drawerBody");
        const download = document.getElementById("drawerDownload");
        title.textContent = api.name;

        const endpointRows = api.endpoints.map(([m, route, desc]) => `
      <li class="ep__row">
        <span class="mth ${methodClass(m)}">${esc(m)}</span>
        <code class="ep__route">${esc(route)}</code>
        <span class="ep__desc">${esc(desc)}</span>
      </li>`).join("");

        body.innerHTML = `
      <p class="drawer__tagline">${esc(api.tagline)}</p>
      <div class="chips">
        <span class="chip chip--accent">${esc(api.stack)}</span>
        <span class="chip">${esc(api.db)}</span>
        <span class="chip">${esc(api.auth)}</span>
        <span class="chip chip--ink">MIT</span>
      </div>

      <div class="drawer__section">
        <h4 class="drawer__h">Endpoints <small>${esc(api.routesLabel)}</small></h4>
        <ul class="ep">${endpointRows}</ul>
      </div>

      <div class="drawer__section">
        <h4 class="drawer__h">Arranque local <small>terminal</small></h4>
        <div class="code">
          <button class="code__copy" data-copy="${esc(api.install.join("\n"))}">Copiar</button>
          <pre>${api.install.map((l) => `<span class="c-mute">$ </span>${esc(l)}`).join("\n")}</pre>
        </div>
      </div>

      <div class="drawer__section">
        <h4 class="drawer__h">Variables de entorno <small>.env</small></h4>
        <div class="code">
          <button class="code__copy" data-copy="${esc(api.env.map((v) => v + "=").join("\n"))}">Copiar</button>
          <pre>${api.env.map((v) => esc(v) + "=").join("\n")}</pre>
        </div>
      </div>`;

        download.dataset.download = api.slug;
    }

    /* ── Drawer open/close ───────────────────────────── */
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

    /* ── Toast ───────────────────────────────────────── */
    let toastTimer = null;
    function toast(msg) {
        const el = document.getElementById("toast");
        if (!el) return;
        el.textContent = msg;
        el.classList.add("is-visible");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => el.classList.remove("is-visible"), 3000);
    }

    /* ── Descargas (cliente) ─────────────────────────── */
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

    async function buildEntries(paths, strip) {
        const entries = [];
        for (const path of paths) {
            const name = strip && path.startsWith(strip) ? path.slice(strip.length) : path;
            entries.push({ path: name, data: await fetchFile(path) });
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
            const paths = tree.filter((t) => t.path.startsWith(prefix)).map((t) => t.path);
            if (paths.length === 0) throw new Error("sin archivos para " + slug);
            if (tree.some((t) => t.path === "LICENSE")) paths.push("LICENSE");

            const entries = await buildEntries(paths, CATALOG_DIR + "/");
            const zip = window.Zip.buildZip(entries);
            saveZip(zip, slug + ".zip");
            toast("Descargando " + api.name + "…");
        } catch (err) {
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
            const paths = tree
                .filter((t) => t.path.startsWith(strip) || t.path === "LICENSE" || t.path === "README.md")
                .map((t) => t.path);

            const entries = await buildEntries(paths, strip);
            const zip = window.Zip.buildZip(entries);
            saveZip(zip, "apis.zip");
            toast("Descargando todas las APIs…");
        } catch (err) {
            toast("No se pudo preparar la descarga. Revisa tu conexión.");
        } finally {
            busy = false;
        }
    }

    /* ── Copy ────────────────────────────────────────── */
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
        } catch (err) {
            toast("No se pudo copiar al portapapeles");
        }
    }

    /* ── Event delegation ────────────────────────────── */
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

    /* ── Init ────────────────────────────────────────── */
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
