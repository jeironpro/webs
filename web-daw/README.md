# DAW

Portal que contiene las 7 webs estáticas del ciclo de **Desarrollo de Aplicaciones Web (DAW)**, organizadas por curso académico (`daw1` y `daw2`). El índice `index.html` es un catálogo vertical con tema propio (paleta OKLCH, tipografías Plus Jakarta Sans + JetBrains Mono) que agrupa las webs por curso y enlaza cada una con su botón «Obrir».

Todas las páginas están construidas únicamente con HTML, CSS y JavaScript, sin frameworks ni dependencias externas. Están escritas en catalán.

## Webs del ciclo

### Primer curso (`daw1`)

| Carpeta | Contenido |
| --- | --- |
| `web-activitats-ras-daw1` | Tabla de actividades y calificaciones por módulo. |
| `web-calendari-daw1` | Calendario del curso: semanas lectivas con fechas y días festivos señalados. |
| `web-qualificacio-ras-daw1` | Calificaciones por resultado de aprendizaje (RA) de cada módulo, con las fórmulas de cálculo de la nota final. |

### Segundo curso (`daw2`)

| Carpeta | Contenido |
| --- | --- |
| `web-activitats-ras-daw2` | Actividades y calificaciones de los módulos de segundo curso (despliegue de aplicaciones web, desarrollo sostenible y machine learning). |
| `web-calendari-daw2` | Calendario del curso generado dinámicamente con JavaScript. |
| `web-horari-daw2` | Horario semanal del grupo DAW2B. |
| `web-qualificacio-ras-daw2` | Calificaciones por resultado de aprendizaje por módulo, con una subpágina para cada módulo. |

## Estructura

```text
web-daw/
├── index.html                  ← Portal índice del ciclo
├── css/
│   ├── tokens.css              ← Tokens de diseño (OKLCH, tipografías, espaciado)
│   └── portal.css              ← Estilos del portal
├── js/
│   └── portal.js               ← Animaciones de entrada y contadores
├── daw1/                       ← Webs de primer curso
│   ├── web-activitats-ras-daw1/
│   ├── web-calendari-daw1/
│   └── web-qualificacio-ras-daw1/
└── daw2/                       ← Webs de segundo curso
    ├── web-activitats-ras-daw2/
    ├── web-calendari-daw2/
    ├── web-horari-daw2/
    └── web-qualificacio-ras-daw2/
```

## Ver en línea

<https://jeironpro.github.io/web-daw/>

Cada web se sirve por ruta relativa desde la raíz del repositorio (p. ej. `daw1/web-calendari-daw1/`).

## Desarrollo

No requiere dependencias ni build. Sirve la raíz con cualquier servidor estático:

```bash
python3 -m http.server 8080
```

y abre <http://localhost:8080>.

## Tecnologías

- HTML5
- CSS3
- JavaScript (sin librerías)
- Google Fonts

## Verificado

- Responsive de 320 a 1440 px sin scroll horizontal (Chrome headless, 31/31 checks)
- Botones «Obrir» con `target="_blank" rel="noopener"`
- `prefers-reduced-motion` respetado: animaciones desactivadas
- Contenido visible sin JavaScript (mejora progresiva)

## Licencia

Este proyecto está bajo la licencia **MIT**.
Consulta el archivo [LICENSE](LICENSE) para más detalles.
