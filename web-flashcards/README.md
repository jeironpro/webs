# Tarjetas de repaso

Mazos locales de tarjetas para estudiar con repetición espaciada. Todo ocurre en el navegador: no hay cuenta, servidor ni sincronización.

## Qué incluye

- Biblioteca de mazos con sus tarjetas pendientes y un mazo de ejemplo, «JavaScript esencial».
- Sesión de estudio con frente, reverso y cuatro calificaciones: Otra vez, Difícil, Bien y Fácil.
- Planificador propio inspirado en SM-2: cada tarjeta guarda intervalo, facilidad, repeticiones y último repaso.
- Gestión completa de mazos y tarjetas: crear, editar y eliminar, con confirmación antes de borrar.
- Agenda con el repaso pendiente más cercano, el reparto por estado y los próximos vencimientos.
- Persistencia en `localStorage` bajo la clave `fichero:v1`. Si el navegador bloquea el almacenamiento, la interfaz avisa y mantiene los cambios solo durante la visita.

## Cómo estudiar

1. Elige un mazo en la biblioteca.
2. Pulsa **Mostrar respuesta** o la barra espaciadora.
3. Califica con los botones o con las teclas `1`–`4`.

«Otra vez» devuelve la tarjeta al final de la sesión actual, aunque su próximo vencimiento sea de diez minutos. El resto de calificaciones la retiran de la cola y la reprograman.

## Planificador

Los valores iniciales son 6 horas para «Difícil», 1 día para «Bien» y 4 días para «Fácil»; «Otra vez» deja la tarjeta a 10 minutos. En repasos posteriores el intervalo se multiplica por la facilidad, que se ajusta entre 1,3 y 3. El intervalo máximo es de 3650 días.

La lógica pura vive en `js/modules/srs.js` y está cubierta por `tests/web-flashcards/srs.test.js`.

## Estructura

```text
web-flashcards/
├── assets/icons/favicon.svg
├── css/style.css
├── index.html
└── js/
    ├── app.js
    └── modules/srs.js
```

## Dirección visual

**Fichero**: una mesa de estudio con la biblioteca en verde ciruela, la tarjeta como ficha de papel rayado con pestaña y la agenda en el margen. Tipografías Gabarito y Red Hat Mono; azafrán para la pestaña, coral para «Otra vez» y salvia para «Bien».

## Accesibilidad

HTML semántico, pestañas con navegación por flechas, diálogo nativo de confirmación, foco visible, texto alternativo en la navegación y respeto por `prefers-reduced-motion`. La sesión se puede completar solo con teclado.

## Comprobaciones

Desde la raíz del monorepo:

```sh
npx vitest run tests/web-flashcards
npx eslint web-flashcards
npx prettier --check web-flashcards
```
