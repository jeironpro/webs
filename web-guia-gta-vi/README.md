# Guía GTA VI · Leónida al 100%

Guía no oficial de Grand Theft Auto VI en español. Reúne la historia de Jason y Lucía sin spoilers, los personajes confirmados, las seis regiones de Leónida sobre el mapa oficial, los sistemas de juego, las 15 cadenas de misiones secundarias, una checklist de 100% y las ediciones anunciadas.

## Qué incluye

- **Mapa interactivo de Leónida:** 12 puntos sobre el mapa oficial de Rockstar, con zoom, arrastre y filtros por ciudad, costa, naturaleza e historia.
- **Campaña completa:** 94 misiones (91 principales y 3 opcionales) repartidas en capítulos, con 29 misiones que muestran sus decisiones desplegables y el resto marcadas como lineales.
- **Misiones secundarias:** las 15 cadenas de Extraños y Locos con sus 50 misiones explicadas en orden, más 15 encargos ocultos con inicio, pasos y recompensa.
- **Fichas de personajes:** Jason, Lucía y el resto del reparto confirmado, con su papel en la historia y sus relaciones.
- **Las seis regiones:** Vice City, los Keys, Grassrivers, Port Gellhorn, Ambrosia y Kalaga, con su ambientación y actividad.
- **Sistemas y mundo:** actividades, economías, personalización, fauna y detalles confirmados.
- **Checklist de 100%:** progreso guardado en el navegador, con reinicio y contador por bloques.
- **Ediciones y recepción:** lo anunciado por Rockstar y el estado de las plataformas.

## Cómo abrirla

No necesita build. Desde la raíz del monorepo:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
# → http://127.0.0.1:8000/web-guia-gta-vi/
```

## Estructura

```text
web-guia-gta-vi/
├── assets/              # arte oficial y mapa de Leónida
├── css/styles.css       # sistema visual, mapa, campaña y responsive
├── index.html           # contenido y secciones
├── js/main.js           # navegación, mapa, campaña y checklist
└── js/side-missions.js  # datos de secundarias y encargos ocultos
```

## Criterios técnicos

- HTML, CSS y JavaScript vanilla, sin dependencias de ejecución.
- Sin `!important`; los colores viven en tokens de `:root` y las media queries usan rangos (`width <= …`) como el resto del monorepo.
- Texto en español, navegación por teclado, enlaces de salto y respeto por `prefers-reduced-motion`.
- El progreso de la checklist se guarda en `localStorage` del navegador.

## Créditos

Guía de fans sin relación con Rockstar Games. Grand Theft Auto, GTA VI y el arte oficial pertenecen a Rockstar Games. Las fuentes y fechas se citan en la propia guía.
