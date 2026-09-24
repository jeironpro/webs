# Wireframes

## Vista completa (desktop)

```
┌─────────────────────────────────────────────────────────────┐
│  Contador de palabras            Cómo funciona   GitHub      │ ─── planteó header
│─────────────────────────────────────────────────────────────│
│  CONTADOR · PALABRAS Y LETRAS                                 │
│  Cuenta palabras y letras mientras escribes                  │
│  Escribe, pega o sube un archivo de texto plano. Las         │
│  métricas se actualizan al instante…                          │
│                                                              │
│  ┌ TU TEXTO                                          ┐        │
│  │ [área de texto de varias líneas]                │        │
│  └────────────────────────────────────────────────┘        │
│  [Limpiar] [Copiar] [Ejemplo]                              │
│                                                              │
│  ┌─┬─┬──────────────────┐                                   │
│  │palabras│caracteres│sin espacios│                          │
│  │   0    │    0     │     0      │                          │
│  └────────┴─────────┴──────────┘                            │
│                                                              │
│  ┌─ zona de subida ──────────────────────────────┐           │
│  │ Suelta un archivo aquí                        │           │
│  │ o pulsa para elegirlo (.txt, .md, .html, csv) │           │
│  └────────────────────────────────────────────────┘          │
│──────────────────────────────────────────────────────────────│
│  colofón (footer)                                             │
└─────────────────────────────────────────────────────────────┘
```

## Notas

- **Área de texto**: ocupa el ancho principal; altura mínima de 14 rem, redimensionable.
- **Métricas**: una fila de tres celdas separadas por hairlines; en móvil pasa a una columna.
- **Zona de subida**: borde discontinuo que se rellena y marca al arrastrar (estado `is-dragover`).
- El diseño es editorial austero: tinta cálida sobre crema, serifas de display, acento cálido usado con moderación.