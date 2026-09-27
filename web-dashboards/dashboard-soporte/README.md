# Dashboard de Soporte

Panel de gestión de soporte técnico para e-commerce. Proyecto de portafolio que demuestra buenas prácticas de desarrollo frontend con React moderno.

## Stack tecnológico

| Capa        | Tecnología                          |
| ----------- | ----------------------------------- |
| Framework   | React 19 + TypeScript 6             |
| Bundler     | Vite 8                              |
| Estilos     | Tailwind CSS 4 (CSS-first config)   |
| Componentes | shadcn/base-nova (headless)         |
| Gráficos    | Recharts 3                          |
| Animaciones | anime.js 4                          |
| Routing     | React Router 7                      |
| Linter      | oxlint                              |
| Testing     | Vitest + Testing Library + jest-axe |

## Instalación

```bash
# Clonar el repositorio
git clone git@github.com:jeironpro/dashboard-soporte.git
cd dashboard-soporte

# Instalar dependencias
yarn install

# Iniciar servidor de desarrollo
yarn dev
```

## Scripts disponibles

| Comando           | Descripción                            |
| ----------------- | -------------------------------------- |
| `yarn dev`        | Servidor de desarrollo con hot reload  |
| `yarn build`      | Build de producción (tsc + vite build) |
| `yarn preview`    | Vista previa del build de producción   |
| `yarn test`       | Ejecutar tests una vez                 |
| `yarn test:watch` | Ejecutar tests en modo observación     |
| `yarn coverage`   | Ejecutar tests con cobertura de código |
| `yarn lint`       | Verificar código con oxlint            |
| `yarn typecheck`  | Verificar tipos con TypeScript         |

## Estructura del proyecto

```
src/
├── main.tsx                    # Punto de entrada
├── App.tsx                     # Configuración de rutas
├── index.css                   # Tema de Tailwind + variables CSS
│
├── pages/                      # Páginas (rutas)
│   ├── dashboard-page.tsx      # Dashboard principal con KPIs y gráficos
│   ├── tickets-page.tsx        # Listado de tickets con búsqueda y filtros
│   ├── ticket-detail-page.tsx  # Detalle de ticket con historial
│   └── profile-page.tsx        # Perfil del agente
│
├── components/
│   ├── layout/                 # Shell de la aplicación
│   │   ├── app-shell.tsx       # Layout base (sidebar + header + contenido)
│   │   ├── floating-sidebar.tsx # Sidebar flotante con navegación
│   │   └── header.tsx          # Cabecera de página
│   │
│   ├── kpis/                   # Tarjetas de métricas
│   │   └── kpi-card.tsx
│   │
│   ├── charts/                 # Gráficos reutilizables
│   │   ├── tickets-por-dia-chart.tsx
│   │   ├── distribucion-categoria-chart.tsx
│   │   └── chart-tooltip.tsx
│   │
│   ├── tickets/                # Componentes de tickets
│   │   ├── badges.tsx          # Badges de estado y prioridad
│   │   ├── tickets-recientes.tsx
│   │   ├── hilo-conversacion.tsx
│   │   ├── message-composer.tsx
│   │   └── nuevo-ticket-dialog.tsx
│   │
│   └── ui/                     # Componentes base (shadcn/base-nova)
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       └── ... (17 componentes)
│
├── hooks/                      # Custom hooks
│   └── use-mobile.ts           # Detección de dispositivo móvil
│
├── lib/                        # Utilidades y datos
│   ├── types.ts                # Definiciones TypeScript
│   ├── mock.ts                 # Datos mock y funciones de acceso
│   ├── stats.ts                # Funciones de agregación
│   ├── format.ts               # Formateo de fechas y números
│   └── utils.ts                # Utilidad cn() para clases
│
└── data/                       # Datos JSON mock
    ├── tickets.json
    ├── customers.json
    ├── agents.json
    └── conversations.json
```

## Arquitectura

### Rutas

| Ruta                 | Página           | Descripción                                         |
| -------------------- | ---------------- | --------------------------------------------------- |
| `/`                  | DashboardPage    | KPIs, gráficos de tendencia y tickets recientes     |
| `/tickets`           | TicketsPage      | Tabla completa con búsqueda, filtros y ordenamiento |
| `/tickets/:ticketId` | TicketDetailPage | Detalle del ticket con conversación                 |
| `/perfil`            | ProfilePage      | Información del agente                              |

### Datos

Todos los datos son mock (archivos JSON en `src/data/`). No hay backend ni autenticación. Las funciones en `src/lib/mock.ts` simulan consultas a base de datos.

### Estilos

El proyecto usa Tailwind CSS v4 con configuración CSS-first. Todos los tokens de diseño (colores, tipografía, espaciado) están definidos en `src/index.css` usando el espacio de color oklch.

## Licencia

MIT - Consulta el archivo [LICENSE](LICENSE) para más detalles.
