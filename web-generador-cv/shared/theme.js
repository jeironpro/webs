// Tema visual compartido del CV (diseño de dos columnas)
// Fuente única de colores, dimensiones y fuentes.
// Lo usan tanto el renderizador web (jsPDF) como la CLI (PDFKit).

export const theme = {
    page: {
        size: 'A4',
        width: 595.28,
        height: 841.89,
        margin: 60
    },
    leftPanel: {
        width: 200,
        bg: '#eef2f6',
        text: '#1a2a4a',
        accent: '#2b6cb0',
        muted: '#5a6b7d'
    },
    rightPanel: {
        bg: '#ffffff',
        heading: '#1a2a4a',
        accent: '#2b6cb0',
        text: '#2d2d2d',
        muted: '#5a6b7d',
        border: '#d0d5dd'
    },
    fonts: {
        heading: 'Helvetica-Bold',
        body: 'Helvetica',
        mono: 'Courier'
    }
};
