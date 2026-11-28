# Guía GTA VI · Leónida al 100%

Guía no oficial de Grand Theft Auto VI en español. Reúne la historia de Jason y Lucía sin spoilers, los personajes confirmados, las seis regiones de Leónida sobre el mapa oficial, los sistemas de juego, las 16 cadenas de misiones secundarias, los finales documentados, el panel de progreso completo, una checklist de 100% y las ediciones anunciadas.

> **En construcción.** Las secciones **Finales** y **Progreso** siguen en revisión. Rockstar no ha publicado un número de finales y los recuentos de la comunidad van de cuatro a nueve, con foros que citan hasta dieciséis, así que la guía documenta solo las ramas que puede contrastar y marca el resto como pendiente. Los recuentos y los textos de las fichas de Progreso también pueden cambiar mientras se revisan.

## Qué incluye

- **Vistas por sección:** las 19 vistas de la guía (portada y 18 secciones) se abren por separado al pulsar el menú, con paginador anterior/siguiente para recorrerlas sin una página de 88.000 píxeles. Las URL siguen funcionando con `#seccion`.
- **Mapa interactivo de Leónida:** 12 puntos sobre el mapa oficial de Rockstar, con zoom, arrastre y filtros por ciudad, costa, naturaleza e historia.
- **Campaña completa:** 97 misiones (95 principales y 2 opcionales) repartidas en capítulos, con 29 misiones que muestran sus decisiones desplegables y el resto marcadas como lineales. Cada misión se puede marcar como completada y el progreso queda guardado en el navegador.
- **Misiones secundarias:** las 16 cadenas de Extraños y Locos con sus 48 misiones explicadas en orden, más 33 encargos ocultos con inicio, pasos y recompensa.
- **Fichas de personajes:** Jason, Lucía y el resto del reparto confirmado, con su papel en la historia y sus relaciones.
- **Las seis regiones:** Vice City, los Keys, Grassrivers, Port Gellhorn, Ambrosia y Kalaga, con su ambientación y actividad.
- **Ubicaciones:** sección reservada para el futuro mapa de puntos; por ahora solo muestra «PRÓXIMAMENTE».
- **Sistemas y mundo:** actividades, economías, personalización, fauna y detalles confirmados.
- **Los finales:** las cinco ramas verificadas, con sus requisitos, la escena completa, qué deja cada una y cómo verlas todas, junto al mapa de recuentos que circulan (de cuatro a nueve; en foros, dieciséis). El censo de finales y las variantes del epílogo quedan marcados como no confirmados.
- **Progreso:** las 12 categorías del panel del juego (vehículos, armas, animales, equipo, colecciones, actividades, contactos, bandas, robos, desafíos, historia y trucos) en 1.454 fichas navegables, con apartados y listas de trucos. Recuentos en revisión.
- **Checklist de 100%:** progreso guardado en el navegador, con reinicio y contador por bloques.
- **Consentimiento y borrado:** un banner explica qué guarda `localStorage` (checklist y misiones de Campaña), con aceptar, eliminar todo y un botón «Datos y privacidad» siempre visible para reabrirlo. Eliminar los datos desactiva el guardado y borra las marcas sin vuelta atrás.
- **Ediciones y recepción:** lo anunciado por Rockstar y el estado de las plataformas.

## Cómo abrirla

No necesita build. Desde la raíz del monorepo:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
# → http://127.0.0.1:8000/web-guia-gta-vi/
```

Los catálogos se cargan con `fetch`, así que hay que abrir la guía por HTTP: con `file://` el navegador bloquea los JSON.

## Estructura

```text
web-guia-gta-vi/
├── assets/              # arte oficial, mapa de Leónida y portadas propias
│   ├── progreso/        # una portada por categoría de Progreso
│   └── finales/         # una portada por rama de Finales
├── css/styles.css       # sistema visual, mapa, campaña y responsive
├── data/gta-vi/         # catálogos en JSON
│   ├── campana.json     # 97 misiones y sus decisiones
│   ├── checklist.json   # requisitos del 100%
│   ├── mapa.json        # puntos del mapa de Leónida
│   ├── progreso.json    # 12 categorías y 1.454 fichas
│   └── secundarias.json # 16 cadenas y 33 encargos ocultos
├── index.html           # contenido y secciones
├── js/data.js           # carga común de los catálogos JSON
├── js/main.js           # navegación, mapa, campaña y checklist
├── js/progress.js       # navegador de tarjetas de Progreso
└── js/progress-data.js  # progreso.json y contador de fichas
```

## Criterios técnicos

- HTML, CSS y JavaScript vanilla, sin dependencias de ejecución.
- Sin `!important`; los colores viven en tokens de `:root` y las media queries usan rangos (`width <= …`) como el resto del monorepo.
- Texto en español, navegación por teclado, enlaces de salto y respeto por `prefers-reduced-motion`.
- El progreso de la checklist se guarda en `localStorage` del navegador.
- Los datos de campaña, checklist, mapa, secundarias y progreso viven en `data/gta-vi/*.json`; el HTML y el CSS no duplican catálogos.
- El icono de privacidad usa Material Symbols Rounded (Google Icons).

## Créditos

Guía de fans sin relación con Rockstar Games. Grand Theft Auto, GTA VI y el arte oficial pertenecen a Rockstar Games. Las fuentes y fechas se citan en la propia guía.
