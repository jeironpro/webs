# Pomodoro

App Pomodoro construida con React + Vite + TailwindCSS v4.

## Características

- **Ciclo completo**: Focus → Descanso → repite, con diálogo automático al finalizar cada segmento
- **Timer circular**: SVG de 300px con barra de progreso que se vacía en sentido horario
- **Duración configurable**: 1–99 min mediante presets o botones +/-1
- **Título de tarea**: Input editable, con lápiz hover cuando el timer está corriendo
- **Contador de pomodoros**: 4 puntos que se iluminan al completar cada ciclo
- **Sonido**: 3 notas ascendentes con Web Audio API (Do-Mi-Sol)
- **Fondo animado**: 80 estrellas parpadeantes + 3 meteoros con ciclos de 28/38/48s
- **Info popover**: Explicación del método Pomodoro en 4 pasos
- **Diseño galaxy**: Azul profundo (#0c1222), cyan (#00d4ff) para Focus, ámbar (#f59e0b) para Break

## Stack

- [React](https://react.dev) + [Vite](https://vite.dev)
- [TailwindCSS v4](https://tailwindcss.com)
- [Google Material Symbols](https://fonts.google.com/icons) (icono info)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) (sonido)

## Instalación

```bash
yarn install
```

## Desarrollo

```bash
yarn dev
```

## Build

```bash
yarn build
```

## Estructura

```
src/
├── App.jsx                  # Orquestador principal
├── main.jsx                 # Punto de entrada
├── index.css                # Tema Tailwind + animaciones
├── hooks/
│   └── useTimer.js          # Timer con useReducer
├── components/
│   ├── CircularTimer.jsx    # SVG de progreso circular
│   ├── Stars.jsx            # Fondo de estrellas animadas
│   ├── TaskTitle.jsx        # Título de tarea editable
│   ├── Controls.jsx         # Botones ▶ ⏸ ⏹
│   ├── ModeToggle.jsx       # Toggle Focus / Break
│   ├── DurationSelector.jsx # Selector de minutos
│   ├── SessionCounter.jsx   # Contador de pomodoros
│   ├── CompletionDialog.jsx # Diálogo al terminar
│   └── InfoPopover.jsx      # Popover informativo
└── utils/
    └── sound.js             # Sonido con Web Audio API
```

## Créditos

Método Pomodoro creado por Francesco Cirillo en los años 80.

## License

MIT
