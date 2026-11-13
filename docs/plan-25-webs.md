# Plan de normalización de las 25 webs pendientes

Esta PR es el contenedor de la migración completa de las 25 webs que quedaron fuera de la PR #171. Se hará por fases, con una validación por web antes de pasar a la siguiente.

## Línea base

Auditoría real del 2026-11-13: análisis estático de todo el HTML/CSS/JS versionado y carga en Chromium de 1–3 páginas por web en escritorio y móvil. El informe completo está en `docs/auditoria-25-webs.html`.

| Web                            |  HTML   |   CSS   |   JS    | Navegador | Limpieza | Favicon | README  | Inglés  |
| ------------------------------ | :-----: | :-----: | :-----: | :-------: | :------: | :-----: | :-----: | :-----: |
| `web-apis`                     |   Sí    | Parcial |   Sí    |    Sí     |    Sí    |   Sí    |   Sí    |   No    |
| `web-biblia`                   |   Sí    |   No    |   No    |    Sí     |    No    | Parcial | Parcial |   No    |
| `web-calificaciones-escolares` |   Sí    |   No    |   No    |    Sí     |    No    |   Sí    | Parcial |   Sí    |
| `web-codelang-quiz`            | Parcial |   No    |   No    |    Sí     |    No    |   Sí    |   Sí    |   No    |
| `web-codingbat-solutions`      |   Sí    |   No    |   No    |    Sí     |    No    |   Sí    | Parcial |   No    |
| `web-continguts-daw`           |   Sí    |   No    |   No    |  Parcial  |    No    |   Sí    | Parcial |   No    |
| `web-curso-dcs`                |   No    |   No    |   Sí    |    Sí     |    No    | Parcial |   Sí    |   No    |
| `web-curso-git`                |   Sí    |   No    | Parcial |    Sí     |    No    | Parcial | Parcial |   No    |
| `web-curso-sql`                |   Sí    |   No    |   Sí    |    Sí     |    No    | Parcial | Parcial |   No    |
| `web-dashboards`               |   No    |   No    |   No    |    Sí     |    No    |   Sí    | Parcial |   No    |
| `web-daw`                      |   No    |   No    |   No    |    Sí     |    No    | Parcial | Parcial |   No    |
| `web-ejercicios-pyja`          | Parcial |   No    |   No    |    Sí     |    No    | Parcial |   Sí    |   No    |
| `web-exerciness`               |   No    |   No    |   No    |    Sí     |    No    |   Sí    | Parcial |   No    |
| `web-frontend`                 |   No    |   No    |   No    |  Parcial  |    No    |   Sí    | Parcial |   Sí    |
| `web-generador-cv`             |   No    |   No    |   No    |    Sí     |    No    | Parcial |   Sí    |   No    |
| `web-instruccion-login-google` | Parcial |   No    |   No    |    Sí     |    No    | Parcial |   Sí    |   No    |
| `web-javarcises`               |   Sí    |   No    |   No    |    Sí     |    No    |   Sí    |   Sí    |   No    |
| `web-juegos`                   |   No    |   No    |   No    |    Sí     |    No    |   Sí    | Parcial |   No    |
| `web-naruto`                   |   Sí    |   Sí    |   No    |    Sí     | Parcial  | Parcial |   Sí    |   No    |
| `web-oracle-academy-dpsql`     | Parcial |   No    |   No    |    Sí     |    No    |   Sí    | Parcial |   Sí    |
| `web-programmer-day`           |   Sí    |   No    |   No    |    No     |    No    |   Sí    | Parcial |   No    |
| `web-pythoncises`              |   Sí    |   No    |   No    |  Parcial  |    No    |   Sí    | Parcial |   No    |
| `web-refprog`                  |   Sí    |   No    |   No    |    Sí     |    No    |   Sí    | Parcial | Parcial |
| `web-reloj`                    |   No    |   No    |   No    |    Sí     |    No    |   Sí    | Parcial |   Sí    |
| `web-tests-daw`                |   Sí    |   No    |   No    |    Sí     |    No    | Parcial | Parcial |   No    |

## Fases

### Fase 1 — Estructura, assets y configuración

- Mover iconos, imágenes, media y fuentes a `assets/icons`, `assets/images`, `assets/media` y `assets/fonts`.
- Llevar hojas de estilo a `css/` y scripts a `js/`; datos a `data/`; documentación a `docs/`.
- Actualizar todas las referencias en HTML, CSS, JS, JSON y README.
- Eliminar configuraciones internas duplicadas solo cuando la web sea estática; conservar `package.json` y configuración de build en las SPAs.

### Fase 2 — Identificadores en inglés

- Migrar variables, funciones, clases, ids, `data-*`, clases CSS y tokens a inglés.
- Mantener comentarios y textos visibles en español.
- Conservar claves de `localStorage` y datos de usuario; si cambian, añadir migración.
- Resolver los hallazgos de HTML: `main`, un solo `h1`, alt, labels, ids duplicados y botones sin nombre.

### Fase 3 — Calidad y validación

- Aplicar Prettier y ESLint; añadir la web a `WEBS_CANONICAS` y retirarla de `WEBS_PENDIENTES` y `.prettierignore`.
- Ejecutar `npm run format:check`, `npm run lint`, `npm test`, `npm run links:check` y `npm run data:build`.
- Repetir la carga en navegador en escritorio y móvil; sin errores de consola, 404 locales ni desbordamiento.

## Orden de trabajo

1. `web-apis`
2. `web-biblia`
3. `web-calificaciones-escolares`
4. `web-codelang-quiz`
5. `web-codingbat-solutions`
6. `web-continguts-daw`
7. `web-curso-dcs`
8. `web-curso-git`
9. `web-curso-sql`
10. `web-dashboards`
11. `web-daw`
12. `web-ejercicios-pyja`
13. `web-exerciness`
14. `web-frontend`
15. `web-generador-cv`
16. `web-instruccion-login-google`
17. `web-javarcises`
18. `web-juegos`
19. `web-naruto`
20. `web-oracle-academy-dpsql`
21. `web-programmer-day`
22. `web-pythoncises`
23. `web-refprog`
24. `web-reloj`
25. `web-tests-daw`

## Progreso

- [x] `web-apis` — estructura, `main`, sin `innerHTML`, test en `tests/web-apis`, lint, tests, enlaces y navegador en escritorio/móvil.
- [ ] 24 webs restantes.

## Estado

- [ ] Fase 1
- [ ] Fase 2
- [ ] Fase 3
- [ ] Las 25 webs verificadas en navegador

> Nota: esta PR empieza en draft. La auditoría es la línea base y no sustituye la validación de cada fase.
