# Nexo · Consola de administración

Panel de administración de una plataforma SaaS ficticia, construido como parte
de un portafolio para demostrar buenas prácticas de organización, diseño y
documentación.

## Stack

- **React 19 + Vite + TypeScript** (alias `@/` → `src/`)
- **yarn** (Berry, linker `node-modules`)
- **Tailwind CSS v4 + shadcn/ui** (estilo `new-york`)
- **animejs v4** para las animaciones firmadas
- Sistema de diseño **Cobalt** (Hallmark) con tokens OKLCH en [`tokens.css`](tokens.css)

## Secciones

1. Resumen general (métricas, gráfico de actividad, alertas)
2. Gestión de usuarios (búsqueda, filtro, paginación, CRUD, roles)
3. Gestión de contenido (productos y artículos, estados de publicación)
4. Logs y auditoría (acciones, errores, accesos fallidos)
5. Configuración (variables de entorno, integraciones, feature flags)
6. Salud del sistema (BD, recursos, servicios, colas)
7. Reportes y exportación (CSV/Excel, programables)

Los datos son un `MOCK` estático en [`src/data/mock.json`](src/data/mock.json).

## Desarrollo

```bash
yarn install
yarn dev        # servidor de desarrollo
yarn typecheck  # chequeo de tipos
yarn build      # build de producción
```

## Documentación

- [`docs/TASKS.md`](docs/TASKS.md) — plan de implementación por tarea (skill `dicresoft/TASK.md`)
- [`docs/style-guide.md`](docs/style-guide.md) — libro de estilo

## Licencia

MIT — ver [LICENSE](LICENSE).
