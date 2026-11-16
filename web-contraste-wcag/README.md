# Comprobador de contraste

Lumen compara una tinta y un papel y mide su relación de contraste según WCAG 2.2. No usa dependencias, cuentas ni servidor: el cálculo ocurre en el navegador y no se guarda nada.

## Qué incluye

- Dos selectores de color con código HEX editable y validación.
- Relación de contraste en vivo y escala de 1:1 a 21:1.
- Muestra compuesta con texto grande, texto normal y componentes de interfaz.
- Criterios AA y AAA para texto normal, texto grande y componentes.
- Intercambio de tinta y papel en un clic.
- Avisos accesibles del resultado mediante una región `aria-live`.

## Cálculo

La luminancia relativa se obtiene con la fórmula sRGB de WCAG y la relación aplica `(L1 + 0.05) / (L2 + 0.05)`, donde `L1` es el color más claro. Los umbrales comprobados son:

| Criterio                | Nivel | Mínimo |
| ----------------------- | ----- | ------ |
| Texto normal            | AA    | 4.5:1  |
| Texto grande            | AA    | 3:1    |
| Texto normal            | AAA   | 7:1    |
| Texto grande            | AAA   | 4.5:1  |
| Componentes de interfaz | AA    | 3:1    |

Se considera texto grande a partir de 24 px, o de 18.66 px en negrita.

La lógica pura vive en `js/modules/contrast.js` y está cubierta por `tests/web-contraste-wcag/contrast.test.js`.

## Estructura

```text
web-contraste-wcag/
├── assets/icons/favicon.svg
├── css/style.css
├── index.html
└── js/
    ├── app.js
    └── modules/contrast.js
```

## Dirección visual

**Lumen**: laboratorio óptico claro sobre una trama técnica. Dos fichas de color enfrentadas, marcador de relación negro con acento lima ácido, muestra compuesta y auditoría en tarjetas. Anybody + DM Mono; cobalto, lima y papel cálido; sin hero.

## Accesibilidad

Los estados de los criterios se transmiten con texto («Cumple» / «No cumple»), no solo con color. Los selectores nativos conservan el foco visible, los códigos HEX inválidos se marcan con `aria-invalid` y el resultado se anuncia con `aria-live`. La muestra usa el par elegido para que el propio texto sea la prueba.

## Comprobaciones

Desde la raíz del monorepo:

```sh
npx vitest run tests/web-contraste-wcag
npx eslint web-contraste-wcag
npx prettier --check web-contraste-wcag
```
