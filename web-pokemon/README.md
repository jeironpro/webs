# Web Pokémon

Aplicación web estática para consultar información de Pokémon por generación.

## Stack

- HTML5 semántico, CSS3 con tokens y BEM, y JavaScript ES6+ en módulos.
- Sin backend.
- Datos y sprites servidos desde `data/pokemones.json` y `assets/images/pokemon/`.
- Google Fonts (Kanit) y Material Icons.
- ESLint + Prettier.

## Uso

Abre `index.html` en el navegador o sirve la carpeta con un servidor estático:

```bash
python3 -m http.server 8000
```

La pantalla de bienvenida redirige automáticamente a la primera generación. Desde ahí puedes:

- cambiar de generación con los botones o el menú superior;
- buscar Pokémon por nombre;
- filtrar por tipo;
- navegar por páginas de 24 resultados;
- consultar tipos, descripción y estadísticas de cada Pokémon.

## Rutas

La app conserva las rutas `/generation/:id`. El `404.html` de la raíz redirige las rutas profundas a `web-pokemon/?/generation/:id`, y el módulo de entrada restaura la URL antes de renderizar.

## Estructura

```text
web-pokemon/
├── index.html
├── css/
│   ├── tokens.css
│   └── styles.css
├── js/
│   └── app.js
├── data/
│   └── pokemones.json
└── assets/
    ├── icons/favicon.svg
    └── images/
        ├── pokemon-logo.png
        └── pokemon/
```

## Créditos

Pokémon y los sprites pertenecen a Nintendo, Game Freak y The Pokémon Company. Este proyecto es una demostración sin ánimo de lucro.

## Licencia

MIT. Consulta el archivo [LICENSE](../LICENSE).
