# Pomodoro

Aplicación Pomodoro estática construida con HTML, CSS y JavaScript vanilla.

## Características

- **Ciclo completo**: Focus → Descanso → repite, con diálogo automático al finalizar cada segmento.
- **Timer circular**: anillo SVG con barra de progreso que se vacía en sentido horario.
- **Duración configurable**: 1–99 min mediante presets o botones ±1.
- **Título de tarea**: editable, con lápiz cuando el timer está corriendo.
- **Contador de pomodoros**: 4 puntos que se iluminan al completar cada ciclo.
- **Sonido**: 3 notas ascendentes con Web Audio API.
- **Fondo animado**: campo de estrellas y meteoros.
- **Info**: explicación del método Pomodoro en 4 pasos.
- **Diseño galaxy**: azul profundo, cian para Focus y ámbar para Break.

## Stack

- HTML5 semántico, CSS3 con tokens y BEM, y JavaScript ES6+ en módulos.
- Sin frameworks ni dependencias de ejecución.
- Google Fonts y Material Symbols.
- Web Audio API para el aviso sonoro.
- ESLint + Prettier.

## Uso

Abre `index.html` en el navegador o sirve la carpeta con un servidor estático:

```bash
python3 -m http.server 8000
```

El temporizador comienza en modo Focus con 25 minutos. Puedes cambiar la duración antes de iniciar, editar el título de la tarea y consultar la ayuda con el botón de información.

## Estructura

```text
web-pomodoro/
├── index.html
├── css/
│   ├── tokens.css
│   └── styles.css
├── js/
│   └── app.js
└── assets/
    └── icons/
        └── favicon.svg
```

## Créditos

Método Pomodoro creado por Francesco Cirillo en los años 80.

## Licencia

MIT. Consulta el archivo [LICENSE](../LICENSE).
