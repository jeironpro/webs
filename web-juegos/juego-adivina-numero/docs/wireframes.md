# Wireframes

## Wireframe de baja fidelidad

```
┌──────────────────────────────────────────────────────────┐
│ [ Saltar al juego ]                                      │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ adivina el número          Cómo se juega   GitHub   │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                          │
│  JUEGO · 1–100                                           │
│  Adivina el número            ┌───────────────────┐      │
│  Estoy pensando en un         │      (?)          │      │
│  número entre 1 y 100...      │ 〇〇〇〇〇〇〇〇〇〇 │      │
│  10 globos = 10 intentos      │                   │      │
│                               │ Tu suposición     │      │
│                               │ [ Entre 1 y 100 ] │      │
│                               │ [  Adivinar  ]    │      │
│                               │ [ mensaje ]       │      │
│                               │ [intentos] [record]│     │
│                               │ [ Nuevo juego ]   │      │
│  ┌────────────────────────────────────────────────┐     │
│  │ ¿Cómo se juega?                                │     │
│  │ 01 Pienso un número secreto                    │     │
│  │ 02 Escribe tu suposición                       │     │
│  │ 03 Sigue las pistas                            │     │
│  └────────────────────────────────────────────────┘     │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Adivina el número · Inténtalo otra vez · 1–100  │   │
│  └──────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

## Wireframe de alta fidelidad

### Mobile (320–414 px)

```
┌──────────────────────────────┐
│ [ Saltar al juego ]          │
│ adivina el número   GitHub   │
│ ───────────────────────────  │
│ JUEGO · 1–100                │
│ Adivina el                   │
│ número                       │
│ Estoy pensando en un número  │
│ entre el 1 y el 100...       │
│                              │
│ ┌──────────────────────────┐ │
│ │                     (?)  │ │
│ │ 〇〇〇〇〇                │ │
│ │ 〇〇〇〇〇 (10 globos)     │ │
│ │ Tu suposición            │ │
│ │ ┌─────────────┐ ┌─────┐  │ │
│ │ │ Entre 1 y 100│ │ Adiv│  │ │
│ │ └─────────────┘ └─────┘  │ │
│ │ ┌──────────────────────┐ │ │
│ │ │ Piensa un número...  │ │ │
│ │ └──────────────────────┘ │ │
│ │ ┌─────────┐ ┌─────────┐  │ │
│ │ │0 Intentos│ │— Récord │  │ │
│ │ └─────────┘ └─────────┘  │ │
│ │ [ Nuevo juego ]          │ │
│ └──────────────────────────┘ │
│ ¿Cómo se juega?              │
│ 01 Pienso un número secreto  │
│ 02 Escribe tu suposición     │
│ 03 Sigue las pistas          │
│ ───────────────────────────  │
│ ADIVINA · INTÉNTALO · 1–100  │
└──────────────────────────────┘
```

**Notas mobile**

- El botón **?** (marca en la esquina de la tarjeta) abre el modal informativo de datos; es un botón real con `aria-label`.
- La fila de **10 globos** (debajo del mensaje) representa los intentos: cada fallo la revienta uno y se vuelan al acertar. En pantallas estrechas envuelven en dos filas de cinco.
- El modal de datos (`modal__overlay` + `modal__dialog`) aparece centrado sobre un fondo oscurecido y se cierra con **Entendido**, la tecla `Esc` o pulsando fuera del diálogo.
- El hero apila en una columna: texto primero, tarjeta debajo.
- El formulario mantiene input + botón en una fila.
- La marca "(?)" sobresale del borde superior derecho de la tarjeta.
- Los pasos de las reglas se apilan verticalmente.

### Desktop (>= 960 px)

```
┌──────────────────────────────────────────────────────────┐
│ adivina el número        Cómo se juega        GitHub     │
│ ───────────────────────────────────────────────────────  │
│                     ┌───────────────────────────────┐    │
│ JUEGO · 1–100       │ Tu suposición           (?)   │    │
│ Adivina el número   │ ┌──────────────┐ ┌──────────┐ │    │
│ Estoy pensando en   │ │ Entre 1 y 100│ │ Adivinar │ │    │
│ un número entre el  │ └──────────────┘ └──────────┘ │    │
│ 1 y el 100...       │ 〇〇〇〇〇〇〇〇〇〇              │    │
│ Tienes 10 globos    │ ┌───────────────────────────┐ │    │
│ = 10 intentos       │ │ Piensa un número entre...  │ │    │
│                     │ └────────────────────────────┘ │    │
│                     │ ┌────────────┐ ┌────────────┐  │    │
│                     │ │ 0 Intentos │ │ — Mejor    │  │    │
│                     │ │            │ │   récord   │  │    │
│                     │ └────────────┘ └────────────┘  │    │
│                     │ [       Nuevo juego       ]    │    │
│                     └───────────────────────────────┘    │
│ ───────────────────────────────────────────────────────  │
│ ¿Cómo se juega?                                          │
│ 01            02             03                          │
│ Pienso un     Escribe tu     Sigue las                   │
│ número        suposición     pistas                      │
│ secreto                                                   │
│ ───────────────────────────────────────────────────────  │
│ ADIVINA EL NÚMERO · INTÉNTALO OTRA VEZ · 1–100 · ...     │
└──────────────────────────────────────────────────────────┘
```

**Notas desktop**

- El hero usa dos columnas: texto a la izquierda (leído primero), tarjeta a la derecha.
- La marca "(?)" sobresale del borde de la tarjeta como detalle asimétrico.
- Los **10 globos** van en una única fila centrada dentro de la tarjeta.
- Los tres pasos se disponen en una fila con número grande y regla superior.
- El pie usa un marquee (línea en desplazamiento infinito) a lo ancho de la página.
