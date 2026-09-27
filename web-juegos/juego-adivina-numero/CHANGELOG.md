# Changelog

Todas las modificaciones notables de este proyecto se documentan en este archivo.

El formato se basa en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/), y este proyecto respeta [Versionado Semántico](https://semver.org/lang/es/).

## [0.3.1] - 2026-08-08

### Limpieza

- Se eliminan helpers y código sin uso: el export `qsa` de `dom.js` y el getter `attempts` del módulo del juego.
- Se eliminan tokens de diseño sin uso (`--color-paper-3`, `--color-coral-deep`, `--ease-snap`, `--dur-micro`, `--dur-long`, `--z-base`) y la propiedad `--btn-line`.
- Se unifican reglas duplicadas (`.wordmark:hover` y `.wordmark:active`).
- Se extrae el estado habilitado/deshabilitado del formulario a helpers `disableForm`/`enableForm`, eliminando código repetido.

### Changed

- El header simplifica su navegación: se elimina el enlace "Cómo se juega" y el enlace a GitHub pasa a ser un icono.

## [0.3.0] - 2026-08-08

### Added

- Sistema de globos: 10 globos representan los 10 intentos de cada partida, dibujados como SVG en línea con colores de la paleta.
- Animación de reventón al fallar: el globo revienta en su sitio y una capa a nivel de **viewport** expulsa **40 residuos** del color del globo que se esparcen radialmente desde el punto de la explosión y se funden.
- Animación de vuelo de los globos restantes al acertar (celebración).
- Estado de derrota al agotar los globos: se revela el número secreto y se deshabilita el formulario.

### Changed
- El juego pasa de permitir un número ilimitado de intentos a un máximo de **10 intentos por partida**.
- El mensaje inicial y el lede del hero explican el nuevo límite de 10 globos.

## [0.2.0] - 2026-08-07

### Added

- Modal informativo sobre el guardado de datos, abierto con el botón **?** de la tarjeta.
- Gestión de foco, cierre con `Esc`, clic fuera del diálogo y devolución del foco al origen.

### Changed

- Se sustituye el aviso estático "Tu mejor récord se guarda en este navegador" por un diálogo accesible que explica el uso de `localStorage`.

## [0.1.0] - 2026-08-07

### Added

- Juego de adivinar un número secreto entre 1 y 100.
- Pistas de "más alto" / "más bajo" con retroalimentación accesible (`aria-live`).
- Contador de intentos por partida.
- Mejor récord persistido en `localStorage`.
- Botón "Nuevo juego" para reiniciar la partida.
- Validación del campo de entrada (entero dentro del rango) con mensaje de error accesible.
- Diseño responsive mobile-first (320, 375, 414 y 768 px) con soporte de `prefers-reduced-motion`.
- Personaje decorativo (marca "?") que reacciona a cada suposición.
- Documentación técnica completa en `docs/`.
