# Nexo · Consola de administración

Panel de administración de una plataforma SaaS ficticia, construido como parte
de un portafolio para demostrar buenas prácticas de organización, diseño y
documentación.

## Stack

- **HTML / CSS / JavaScript** (vanilla)
- **Three.js** para visualizaciones 3D
- **GSAP** para animaciones
- **yarn** (Berry, linker `node-modules`)
- Sistema de diseño con tokens OKLCH

## Secciones

1. Resumen general (métricas, gráfico de actividad, alertas)
2. Gestión de usuarios (búsqueda, filtro, paginación, CRUD, roles)
3. Gestión de contenido (productos y artículos, estados de publicación)
4. Logs y auditoría (acciones, errores, accesos fallidos)
5. Configuración (variables de entorno, integraciones, feature flags)
6. Salud del sistema (BD, recursos, servicios, colas)
7. Reportes y exportación (CSV/Excel, programables)

Los datos son un `MOCK` estático.

## Desarrollo

```bash
yarn install
yarn dev        # servidor de desarrollo
yarn typecheck  # chequeo de tipos
yarn build      # build de producción
```

## Licencia

MIT — ver [LICENSE](LICENSE).
