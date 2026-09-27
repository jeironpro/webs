# Dashboard Operativo · Pulso

Dashboard operativo analítico (frontend) para monitorear KPIs de negocio, analizar tendencias y exportar reportes. Pensado para el equipo comercial de una pyme e-commerce: todo el negocio de un vistazo, con datos de demostración realistas y diseño 100 % responsive.

## Funcionalidades

- **KPIs del negocio** — ventas, conversión, pedidos, ticket promedio, retención y clientes nuevos con contadores animados (animejs), variación vs. periodo anterior y sparklines.
- **Gráficos de tendencias** — ventas del periodo (área), por categoría (barras), por canal (donut) y por región (barras horizontales), con conmutador **diario / semanal / mensual** (Recharts).
- **Filtros** — rango de fechas (presets + calendario), categoría, región y canal. Todos los consumidores (KPIs, gráficos, tabla y reportes) se actualizan al cambiar cualquier filtro.
- **Detalle de pedidos** — tabla de pedidos recientes con búsqueda (id, cliente o categoría, ignora tildes), filtro por estado y paginación.
- **Reportes exportables** — desglose de ventas por categoría del periodo filtrado con exportación a **PDF**, **Excel (.xlsx)** y **CSV** (compatible con Excel en español).
- **Página de perfil** — `/perfil` con los datos de la persona (contacto, estadísticas animadas, habilidades y actividad reciente), accesible desde la navegación y el avatar de la barra superior.
- **Datos MOCK realistas** — generador determinista (semilla fija) que produce ~20 mil registros diarios coherentes entre series.
- **100 % responsive** — de 320 px en adelante: sidebar en desktop, drawer en móvil, tablas con columnas adaptativas.

## Stack

| Capa        | Tecnología                                                    |
| ----------- | ------------------------------------------------------------- |
| Framework   | React 19 + TypeScript + Vite 8                                |
| Gestor      | yarn 4 (`.yarnrc.yml`, Corepack)                              |
| UI          | shadcn/ui sobre Tailwind CSS v4 (Radix primitives)            |
| Estado      | zustand                                                       |
| Enrutado    | react-router (dashboard en `/`, perfil en `/perfil`)          |
| Gráficos    | Recharts (vía componente `chart` de shadcn/ui)                |
| Animaciones | animejs (contadores, transiciones, star-burst)                |
| Exportación | `jspdf` + `jspdf-autotable` (PDF), `xlsx` (Excel), Blob (CSV) |
| Tests       | vitest (+ ESLint, Prettier, Husky/lint-staged)                |
| CI          | GitHub Actions: install → lint → typecheck → test → build     |

## Requisitos

- Node.js ≥ 20 (recomendado 22 LTS)
- yarn 4.18 (`corepack enable` si usas Corepack, o `npm i -g yarn`)

## Instalación y uso

```bash
# 1. Instalar dependencias
yarn install

# 2. Levantar el dev server (http://localhost:5173)
yarn dev

# 3. Abrir otro puerto si el 5173 está ocupado
yarn dev --port 5199
```

### Scripts

| Script              | Descripción                                          |
| ------------------- | ---------------------------------------------------- |
| `yarn dev`          | Dev server con HMR                                   |
| `yarn build`        | Typecheck + build de producción (`dist/`)            |
| `yarn preview`      | Sirve el build de producción localmente              |
| `yarn lint`         | ESLint sobre todo el repo                            |
| `yarn lint:fix`     | ESLint con autocorrección                            |
| `yarn typecheck`    | `tsc -b` (verificación de tipos sin emitir)          |
| `yarn test`         | vitest (una pasada)                                  |
| `yarn test:watch`   | vitest en modo watch                                 |
| `yarn format`       | Prettier --write sobre todo el repo                  |
| `yarn format:check` | Prettier --check                                     |
| `yarn mock:data`    | Regenera los JSON mock en `src/data/` (determinista) |

> Pre-commit: Husky + lint-staged ejecutan ESLint y Prettier sobre los archivos modificados.

## Estructura

```
src/
├─ components/ui/      # Componentes base de shadcn/ui (botón, tabla, select…)
├─ data/               # Datos mock en JSON (generados por scripts/generate-mock-data.mjs)
├─ features/
│  ├─ charts/          # Tendencias: área, barras, donut + preparación de datos
│  ├─ filters/         # Barra de filtros y selector de rango de fechas
│  ├─ kpis/            # Tarjetas KPI con contadores y sparklines
│  ├─ layout/          # Shell: sidebar, topbar, footer marquee, mascota, logo
│  ├─ orders/          # Tabla de pedidos con búsqueda y paginación
│  ├─ profile/         # Página de perfil de la persona
│  └─ reports/         # Reporte por categoría + exportación PDF/Excel/CSV
├─ hooks/              # useAnimatedNumber, useReveal, useActiveSection
├─ lib/                # Lógica pura y testeable: agregaciones, filtros, pedidos, exporters
├─ store/              # Store global (zustand) con datos y filtros
└─ types/              # Tipos de dominio del negocio
```

## Decisiones de diseño (skill hallmark · tema Hum)

El diseño sigue la skill de diseño **hallmark** con el tema **Hum** (referencia [`hum-07`](https://www.usehallmark.com/examples/hum-07/)):

- **Paleta** — papel crema de fondo (nunca blanco puro ni negro puro), tinta cálida y acentos **pera** (verde), **cian** y **coral**. Ver tokens en `src/index.css` y el libro de estilo en [docs/style-guide.md](docs/style-guide.md).
- **Macroestructura** — **Stat-Led**: la banda de KPIs es el hero con contadores gigantes; el cuerpo funciona como **Workbench** con sidebar de navegación.
- **Tipografía** — Plus Jakarta Sans (interfaz) + JetBrains Mono (labels técnicos y números tabulares).
- **Forma** — radios generosos (píldoras y `rounded-4xl`), sin esquinas cuadradas; superficies con tint de acento y _lift_ en hover.
- **Motion** — animejs para contadores (_tick-up_), transición de periodo, _reveal_ de secciones, marquee del footer y **star-burst** coral como microcelebración al exportar o interactuar con la mascota. Todo respeta `prefers-reduced-motion`.
- **Personaje** — "Pulso", la mascota del dashboard: una bolita pera con ojos que vive en el hero y celebra al hacer clic. También es el favicon y el logo de la app.

## Flujo de trabajo (PRs)

El desarrollo se organiza por tareas, cada una en su rama y entregada mediante **pull request** con squash-merge hacia `main`.

Convenciones: rama `<prefijo>/<categoría>` (ej. `feature/kpi-cards`), commits `<prefijo>/<categoría>: <mensaje>` en imperativo, y CI verde obligatorio antes de mergear.

## Licencia

MIT — consulta [LICENSE](LICENSE).
