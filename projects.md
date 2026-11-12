# Proyectos de `webs`

Monorepositorio con **56 webs** y sus subwebs, publicadas en GitHub Pages:
<https://jeironpro.github.io/webs/>. El catálogo de la portada se genera desde `projects.yml`.

Casi todas son HTML/CSS/JS estático y se publican tal cual; `web-programmer-day` es la excepción,
porque importa Three.js y se compila con Vite antes de desplegarse. `web-reloj` y `web-exerciness`
conservan tooling de Vite, pero su build ya está versionado y el deploy tampoco los recompila.

## Cómo se publica

- El workflow `.github/workflows/deploy.yml` corre en cada push a `main`.
- Ensambla el sitio con todo el repositorio y superpone el build de `web-programmer-day`.
- Cada web queda servida en `https://jeironpro.github.io/webs/<id>/`.

## Convenciones

- Cada web vive en `web-<slug>/` con su `index.html`, estilos, scripts y `README.md`.
- Los metadatos (título, descripción, categoría, captura, estado) se declaran en `projects.yml`;
  `npm run data:build` regenera `assets/projects.json`.
- `npm run links:check` valida los enlaces internos contra los ficheros versionados.

## Webs raíz (56)

| Web                                                                                            | Título                     | Categoría       |
| ---------------------------------------------------------------------------------------------- | -------------------------- | --------------- |
| [web-algoritmos](https://jeironpro.github.io/webs/web-algoritmos/)                             | Algoritmos de repaso       | Educación       |
| [web-apis](https://jeironpro.github.io/webs/web-apis/)                                         | Apis                       | Referencia      |
| [web-biblia](https://jeironpro.github.io/webs/web-biblia/)                                     | Biblia                     | Educación       |
| [web-calculadora](https://jeironpro.github.io/webs/web-calculadora/)                           | Calculadora                | Utilidades      |
| [web-calculadora-edad](https://jeironpro.github.io/webs/web-calculadora-edad/)                 | Calculadora de edad        | Utilidades      |
| [web-calendario](https://jeironpro.github.io/webs/web-calendario/)                             | Calendario                 | Utilidades      |
| [web-calificaciones-escolares](https://jeironpro.github.io/webs/web-calificaciones-escolares/) | Calificaciones escolares   | Educación       |
| [web-clima](https://jeironpro.github.io/webs/web-clima/)                                       | Clima                      | Utilidades      |
| [web-codelang-quiz](https://jeironpro.github.io/webs/web-codelang-quiz/)                       | Codelang Quiz              | Educación       |
| [web-codi-wiki](https://jeironpro.github.io/webs/web-codi-wiki/)                               | Codi Wiki                  | Referencia      |
| [web-codigos-http](https://jeironpro.github.io/webs/web-codigos-http/)                         | Codigos HTTP               | Referencia      |
| [web-codingbat-solutions](https://jeironpro.github.io/webs/web-codingbat-solutions/)           | CodingBat solutions        | Educación       |
| [web-color-picker](https://jeironpro.github.io/webs/web-color-picker/)                         | Color Picker               | Utilidades      |
| [web-contador-palabras](https://jeironpro.github.io/webs/web-contador-palabras/)               | Contador de palabras       | Utilidades      |
| [web-continguts-daw](https://jeironpro.github.io/webs/web-continguts-daw/)                     | Continguts DAW             | Curricular      |
| [web-conversor-universal](https://jeironpro.github.io/webs/web-conversor-universal/)           | Conversor universal        | Utilidades      |
| [web-convertidor-moneda](https://jeironpro.github.io/webs/web-convertidor-moneda/)             | Convertidor de moneda      | Utilidades      |
| [web-curso-dcs](https://jeironpro.github.io/webs/web-curso-dcs/)                               | Curso DCS                  | Curricular      |
| [web-curso-git](https://jeironpro.github.io/webs/web-curso-git/)                               | Curso de Git               | Educación       |
| [web-curso-sql](https://jeironpro.github.io/webs/web-curso-sql/)                               | Curso de SQL               | Educación       |
| [web-cursos-cpnl](https://jeironpro.github.io/webs/web-cursos-cpnl/)                           | Cursos CPNL                | Curricular      |
| [web-dados](https://jeironpro.github.io/webs/web-dados/)                                       | Dados                      | Entretenimiento |
| [web-dashboards](https://jeironpro.github.io/webs/web-dashboards/)                             | Dashboards                 | Productividad   |
| [web-daw](https://jeironpro.github.io/webs/web-daw/)                                           | Portal DAW                 | Curricular      |
| [web-ejercicios-pyja](https://jeironpro.github.io/webs/web-ejercicios-pyja/)                   | Ejercicios PyJa            | Educación       |
| [web-exerciness](https://jeironpro.github.io/webs/web-exerciness/)                             | Exerciness                 | Productividad   |
| [web-frontend](https://jeironpro.github.io/webs/web-frontend/)                                 | Frontend                   | Referencia      |
| [web-generador-clave-secreta](https://jeironpro.github.io/webs/web-generador-clave-secreta/)   | Generador de clave secreta | Generadores     |
| [web-generador-codigo-qr](https://jeironpro.github.io/webs/web-generador-codigo-qr/)           | Generador de QR            | Generadores     |
| [web-generador-contrasena](https://jeironpro.github.io/webs/web-generador-contrasena/)         | Generador de contrasenas   | Generadores     |
| [web-generador-crucigramas](https://jeironpro.github.io/webs/web-generador-crucigramas/)       | Generador de crucigramas   | Generadores     |
| [web-generador-cv](https://jeironpro.github.io/webs/web-generador-cv/)                         | Generador CV               | Productividad   |
| [web-gestiona-presupuesto](https://jeironpro.github.io/webs/web-gestiona-presupuesto/)         | Gestiona presupuesto       | Productividad   |
| [web-instruccion-login-google](https://jeironpro.github.io/webs/web-instruccion-login-google/) | Login con Google           | Educación       |
| [web-javarcises](https://jeironpro.github.io/webs/web-javarcises/)                             | Javarcises                 | Educación       |
| [web-juegos](https://jeironpro.github.io/webs/web-juegos/)                                     | Juegos                     | Entretenimiento |
| [web-lector-archivo](https://jeironpro.github.io/webs/web-lector-archivo/)                     | Lector de archivos         | Utilidades      |
| [web-lenguajes-programacion](https://jeironpro.github.io/webs/web-lenguajes-programacion/)     | Lenguajes de programacion  | Educación       |
| [web-lexaro](https://jeironpro.github.io/webs/web-lexaro/)                                     | Lexaro                     | Productividad   |
| [web-mandala](https://jeironpro.github.io/webs/web-mandala/)                                   | Mandala                    | Entretenimiento |
| [web-narcopedia](https://jeironpro.github.io/webs/web-narcopedia/)                             | Narcopedia                 | Entretenimiento |
| [web-naruto](https://jeironpro.github.io/webs/web-naruto/)                                     | Naruto                     | Entretenimiento |
| [web-oracle-academy-dpsql](https://jeironpro.github.io/webs/web-oracle-academy-dpsql/)         | Oracle Academy DPSQL       | Curricular      |
| [web-paises-visitados](https://jeironpro.github.io/webs/web-paises-visitados/)                 | Paises visitados           | Entretenimiento |
| [web-pokemon](https://jeironpro.github.io/webs/web-pokemon/)                                   | Pokemon                    | Entretenimiento |
| [web-pomodoro](https://jeironpro.github.io/webs/web-pomodoro/)                                 | Pomodoro                   | Productividad   |
| [web-porcentaje-anual](https://jeironpro.github.io/webs/web-porcentaje-anual/)                 | Porcentaje anual           | Utilidades      |
| [web-programmer-day](https://jeironpro.github.io/webs/web-programmer-day/)                     | Programmer Day             | Entretenimiento |
| [web-pythoncises](https://jeironpro.github.io/webs/web-pythoncises/)                           | Pythoncises                | Educación       |
| [web-redimensiona-imagen](https://jeironpro.github.io/webs/web-redimensiona-imagen/)           | Redimensiona imagen        | Utilidades      |
| [web-refprog](https://jeironpro.github.io/webs/web-refprog/)                                   | RefProg                    | Referencia      |
| [web-reloj](https://jeironpro.github.io/webs/web-reloj/)                                       | Reloj                      | Entretenimiento |
| [web-reproductor-musica](https://jeironpro.github.io/webs/web-reproductor-musica/)             | Reproductor de musica      | Entretenimiento |
| [web-ruleta](https://jeironpro.github.io/webs/web-ruleta/)                                     | Ruleta                     | Entretenimiento |
| [web-tests-daw](https://jeironpro.github.io/webs/web-tests-daw/)                               | Tests DAW                  | Curricular      |
| [web-votacion](https://jeironpro.github.io/webs/web-votacion/)                                 | La Papeleta                | Entretenimiento |

## Subwebs

### Dashboards · `web-dashboards/` (5)

Paneles de administración, todos en HTML/CSS/JS vanilla.

| Subweb                                                                                                          | Título                                    |
| --------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| [dashboard-administrador](https://jeironpro.github.io/webs/web-dashboards/dashboard-administrador/)             | Nexo · Consola de administración          |
| [dashboard-financiero](https://jeironpro.github.io/webs/web-dashboards/dashboard-financiero/)                   | Suma · Finanzas al día                    |
| [dashboard-monitoreo](https://jeironpro.github.io/webs/web-dashboards/dashboard-monitoreo/)                     | Vigía · Observabilidad de infraestructura |
| [dashboard-operativo-analitico](https://jeironpro.github.io/webs/web-dashboards/dashboard-operativo-analitico/) | Dashboard Operativo · Pulso               |
| [dashboard-soporte](https://jeironpro.github.io/webs/web-dashboards/dashboard-soporte/)                         | Dashboard de soporte                      |

### Juegos · `web-juegos/` (20)

Juegos de navegador servidos como estáticos desde su propia carpeta.

| Subweb                                                                                    | Título                                  |
| ----------------------------------------------------------------------------------------- | --------------------------------------- |
| [juego-4-rayas](https://jeironpro.github.io/webs/web-juegos/juego-4-rayas/)               | 4 en Raya                               |
| [juego-7-letras](https://jeironpro.github.io/webs/web-juegos/juego-7-letras/)             | 7 Letras · colmena de palabras          |
| [juego-adivina-numero](https://jeironpro.github.io/webs/web-juegos/juego-adivina-numero/) | Adivina el número · Juego de adivinanza |
| [juego-ajedrez](https://jeironpro.github.io/webs/web-juegos/juego-ajedrez/)               | Ajedrez                                 |
| [juego-carreras](https://jeironpro.github.io/webs/web-juegos/juego-carreras/)             | Circuito Neón                           |
| [juego-damas](https://jeironpro.github.io/webs/web-juegos/juego-damas/)                   | Damas                                   |
| [juego-farsante](https://jeironpro.github.io/webs/web-juegos/juego-farsante/)             | Farsante · uno no sabe la palabra       |
| [juego-memoriza-carta](https://jeironpro.github.io/webs/web-juegos/juego-memoriza-carta/) | Memoriza la carta · mesa de parejas     |
| [juego-palabra-oculta](https://jeironpro.github.io/webs/web-juegos/juego-palabra-oculta/) | Palabra oculta · cinco letras           |
| [juego-patches](https://jeironpro.github.io/webs/web-juegos/juego-patches/)               | Patches · composición                   |
| [juego-puntos-cajas](https://jeironpro.github.io/webs/web-juegos/juego-puntos-cajas/)     | Puntos y Cajas                          |
| [juego-queens](https://jeironpro.github.io/webs/web-juegos/juego-queens/)                 | Queens · hoja de puzle                  |
| [juego-serpiente](https://jeironpro.github.io/webs/web-juegos/juego-serpiente/)           | Serpiente · arcade de bolsillo          |
| [juego-sopa-letras](https://jeironpro.github.io/webs/web-juegos/juego-sopa-letras/)       | Sopa de letras · cuaderno de palabras   |
| [juego-sudoku](https://jeironpro.github.io/webs/web-juegos/juego-sudoku/)                 | Sudoku · cuaderno de lógica             |
| [juego-tango](https://jeironpro.github.io/webs/web-juegos/juego-tango/)                   | Tango · sol y luna                      |
| [juego-tic-tac-toe](https://jeironpro.github.io/webs/web-juegos/juego-tic-tac-toe/)       | Tres en raya · duelo de mesa            |
| [juego-wend](https://jeironpro.github.io/webs/web-juegos/juego-wend/)                     | Wend · la red de palabras               |
| [juego-yatzy](https://jeironpro.github.io/webs/web-juegos/juego-yatzy/)                   | Yatzy                                   |
| [juego-zip](https://jeironpro.github.io/webs/web-juegos/juego-zip/)                       | Zip · un solo camino                    |

### DAW · `web-daw/` (7)

Subportales curriculares agrupados por curso (`daw1` y `daw2`).

| Subweb                                                                                                     | Título                                                       |
| ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| [daw1/web-activitats-ras-daw1](https://jeironpro.github.io/webs/web-daw/daw1/web-activitats-ras-daw1/)     | Activitats Mòduls                                            |
| [daw1/web-calendari-daw1](https://jeironpro.github.io/webs/web-daw/daw1/web-calendari-daw1/)               | Setmanes                                                     |
| [daw1/web-qualificacio-ras-daw1](https://jeironpro.github.io/webs/web-daw/daw1/web-qualificacio-ras-daw1/) | RA's Mòduls DAW 1                                            |
| [daw2/web-activitats-ras-daw2](https://jeironpro.github.io/webs/web-daw/daw2/web-activitats-ras-daw2/)     | Activitats Mòduls DAW2                                       |
| [daw2/web-calendari-daw2](https://jeironpro.github.io/webs/web-daw/daw2/web-calendari-daw2/)               | CALENDARI DAW 2                                              |
| [daw2/web-horari-daw2](https://jeironpro.github.io/webs/web-daw/daw2/web-horari-daw2/)                     | Horari DAW 2                                                 |
| [daw2/web-qualificacio-ras-daw2](https://jeironpro.github.io/webs/web-daw/daw2/web-qualificacio-ras-daw2/) | Qualificació RA's DAW 2 \| Desenvolupament d'Aplicacions Web |

## Portales con catálogo propio

No son subwebs independientes, sino webs que listan contenido interno:

- **web-apis** — portal de 5 APIs REST en Python: biblia, correo SMTP (Flask), trivia, naruto y pokemon.
- **web-frontend** — catálogo de 17 componentes de interfaz (modal, menú acordeón, lista de tareas, modo claro/oscuro, etc.).
- **web-continguts-daw** — materiales docentes organizados por curso y módulo.
- **web-lenguajes-programacion** — documentación generada con Sphinx y MyST.

## Estructura del repositorio

```
webs/
├── web-*/                  # cada web o hub (dashboards, juegos, daw…)
├── assets/                 # catálogo, capturas y recursos compartidos
├── css/ · js/              # estilos y scripts de la portada
├── scripts/                # datos, capturas, check-links y compilación de hubs
├── tests/                  # pruebas del catálogo
├── projects.yml            # fuente de verdad de las webs
└── .github/workflows/      # ci, deploy, links y capturas
```

## Mantenimiento

1. Añadir o editar la web en `projects.yml`.
2. Ejecutar `npm run data:build` y `npm run links:check`.
3. Abrir un PR contra `main`; al fusionar, el deploy publica el sitio.
