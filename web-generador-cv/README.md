# Web Generador CV

Generador de currículum vitae en PDF con dos interfaces:

- **App web**: formulario en 4 pasos que genera el PDF en el navegador.
- **CLI**: generación por línea de comandos desde un archivo de datos.

Ambas comparten el mismo **tema visual** y las mismas **etiquetas i18n** (español, catalán e inglés), definidos una única vez en la carpeta `shared/`.

## Stack

- **Frontend**: React + Vite + TailwindCSS
- **PDF web**: jsPDF (generación en el cliente)
- **CLI**: Node.js + PDFKit + Lucide Static
- **Iconos**: Material Symbols (Google Fonts)
- **Canvas**: partículas animadas de fondo

## Requisitos

- Node.js >= 18

## Instalación

```bash
npm install
```

## Desarrollo (app web)

```bash
npm run dev
```

Abre http://localhost:5173.

## Build (app web)

```bash
npm run build
npm run preview
```

## Generador CLI

```bash
cd cli
npm install
```

Crea el archivo `cli/data/cv-data.js` exportando el objeto `cv` (mismo modelo de datos que la web) y, opcionalmente, una foto en `cli/data/`.

```bash
# Español (por defecto)
npm run build

# Idioma específico
npm run build:es
npm run build:ca
npm run build:en

# Todos los idiomas
npm run build:all
```

Los PDFs se generan en `cli/output/cv-{lang}.pdf`.

## Modelo de datos

La web y la CLI comparten el mismo modelo de datos:

- Personales: `name`, `email`, `telephone`, `address`, `nationality`, `dateOfBirth`, `socialLinks`.
- Foto: en la web es un archivo subido; en la CLI es una ruta a una imagen (`photo`).
- Perfiles por idioma (`profiles.es`, `profiles.ca`, `profiles.en`), cada uno con:
  - `title`, `shortDescription`
  - `workExperience`, `education`
  - `languageSkills`, `digitalSkills`
  - `communicationSkills`, `organisationalSkills`, `jobRelatedSkills`
  - `additionalInfo`

## Estructura

```
web-generador-cv/
├── src/                    # Frontend React (wizard de 4 pasos)
│   ├── App.jsx
│   ├── StepReview.jsx
│   ├── ParticleBackground.jsx
│   ├── pdf-renderer.js     # Renderizador PDF con jsPDF
│   ├── index.css
│   └── main.jsx
├── shared/                 # Código compartido web + CLI
│   ├── theme.js            # Tema (colores, dimensiones, fuentes)
│   ├── i18n.js             # Etiquetas de sección por idioma
│   └── constants.js        # Idiomas soportados
├── cli/                    # Generador CLI (PDFKit)
│   ├── index.js
│   ├── src/
│   │   ├── renderer.js
│   │   └── components.js
│   ├── data/               # cv-data.js (no versionado)
│   └── output/             # PDFs generados (no versionado)
├── public/
├── index.html
├── vite.config.js
└── package.json
```

## Personalización

- **Tema**: `shared/theme.js` — colores del panel izquierdo/derecho, dimensiones y fuentes.
- **Etiquetas**: `shared/i18n.js` — encabezados de sección por idioma.
- **Idiomas**: `shared/constants.js` — lista de idiomas soportados.
