# Pomodoro

Aplicación Pomodoro estática construida con HTML, CSS y JavaScript vanilla.

## Características

- **Ciclo completo**: Focus → Descanso → repite, con diálogo automático al finalizar cada segmento.
- **Timer circular**: SVG de 300px con barra de progreso que se vacía en sentido horario.
- **Duración configurable**: 1–99 min mediante presets o botones +/-1.
- **Título de tarea**: Editable, con lápiz cuando el timer está corriendo.
- **Contador de pomodoros**: 4 puntos que se iluminan al completar cada ciclo.
- **Sonido**: 3 notas ascendentes con Web Audio API.
- **Fondo animado**: 80 estrellas parpadeantes y 3 meteoros.
- **Info popover**: Explicación del método Pomodoro en 4 pasos.
- **Diseño galaxy**: Azul profundo, cyan para Focus y ámbar para Break.

## Stack

- HTML5, CSS3 y JavaScript vanilla.
- Google Fonts y Material Symbols.
- Web Audio API para el aviso sonoro.

## Uso

Abre `index.html` en el navegador o sirve la carpeta con un servidor estático:

```bash
python3 -m http.server 8000
```

## Estructura

```text
web-pomodoro/
├── index.html
├── styles.css
├── app.js
└── favicon.svg
```

## Créditos

Método Pomodoro creado por Francesco Cirillo en los años 80.

## Licencia

MIT
