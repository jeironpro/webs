/* Shell común del arcade: portada, marcador y salida al menú. */
(() => {
    const THEMES = {
        "juego-7-letras": {
            bg: "#1b1226",
            panel: "#261a36",
            text: "#f7efdf",
            muted: "#b9a6cf",
            line: "#3d2a52",
            accent: "#d8a33c",
            accentText: "#1b1226",
            card: "#2e2040",
            display: '"Fraunces", Georgia, serif',
            body: '"Archivo", system-ui, sans-serif',
            layout: "poster",
            radius: "1.25rem",
            titleWeight: "600",
            tracking: "-0.03em",
        },
        "juego-adivina-numero": {
            bg: "oklch(97% 0.012 95)",
            panel: "oklch(94% 0.016 95)",
            text: "oklch(20% 0.012 250)",
            muted: "oklch(42% 0.012 250)",
            line: "oklch(86% 0.015 95)",
            accent: "oklch(86% 0.18 95)",
            accentText: "oklch(20% 0.012 250)",
            card: "#fffdf7",
            display: '"Plus Jakarta Sans", ui-sans-serif, sans-serif',
            body: '"Plus Jakarta Sans", ui-sans-serif, sans-serif',
            layout: "row",
            radius: "1.25rem",
            titleWeight: "800",
            tracking: "-0.045em",
        },
        "juego-memoriza-carta": {
            bg: "#e6f0ff",
            panel: "#f7fbff",
            text: "#122a4a",
            muted: "#5a6d88",
            line: "#c3d6ef",
            accent: "#e88355",
            accentText: "#231407",
            card: "#ffffff",
            display: '"Archivo", system-ui, sans-serif',
            body: '"Archivo", system-ui, sans-serif',
            layout: "rail",
            radius: "1rem",
            titleWeight: "700",
            tracking: "-0.04em",
        },
        "juego-palabra-oculta": {
            bg: "#e8f5ec",
            panel: "#f7fff9",
            text: "#10291d",
            muted: "#557064",
            line: "#bcdcc8",
            accent: "#0b6b43",
            accentText: "#ffffff",
            card: "#ffffff",
            display: '"Fraunces", Georgia, serif',
            body: '"Archivo", system-ui, sans-serif',
            layout: "compact",
            radius: "1rem",
            titleWeight: "600",
            tracking: "-0.03em",
        },
        "juego-patches": {
            bg: "oklch(97% 0.006 90)",
            panel: "oklch(93% 0.007 88)",
            text: "oklch(19% 0.008 70)",
            muted: "oklch(48% 0.008 70)",
            line: "oklch(82% 0.006 80)",
            accent: "oklch(51% 0.2 27)",
            accentText: "oklch(97% 0.006 90)",
            card: "oklch(93% 0.007 88)",
            display: '"Jost", ui-sans-serif, sans-serif',
            body: '"Archivo", ui-sans-serif, sans-serif',
            layout: "stack",
            radius: "0.5rem",
            titleWeight: "600",
            tracking: "-0.035em",
        },
        "juego-queens": {
            bg: "#f4ecd8",
            panel: "#e9dec4",
            text: "#241c16",
            muted: "#6b5c4c",
            line: "#c9b998",
            accent: "#b8371c",
            accentText: "#f4ecd8",
            card: "#e9dec4",
            display: '"Fraunces", Georgia, serif',
            body: '"Archivo", system-ui, sans-serif',
            layout: "row",
            radius: "0.25rem",
            titleWeight: "600",
            tracking: "-0.03em",
        },
        "juego-serpiente": {
            bg: "#fff1e8",
            panel: "#ffe3d3",
            text: "#3b1320",
            muted: "#8a5a63",
            line: "#e8bfae",
            accent: "#c81d4e",
            accentText: "#ffffff",
            card: "#fff7f2",
            display: '"Archivo", system-ui, sans-serif',
            body: '"Archivo", system-ui, sans-serif',
            layout: "corner",
            radius: "0.75rem",
            titleWeight: "700",
            tracking: "-0.04em",
        },
        "juego-sopa-letras": {
            bg: "#f4ead5",
            panel: "#fffaf0",
            text: "#1b2a4a",
            muted: "#6b6a5f",
            line: "#dccdad",
            accent: "#2d5f9e",
            accentText: "#ffffff",
            card: "#fffaf0",
            display: '"IBM Plex Mono", ui-monospace, monospace',
            body: '"Archivo", system-ui, sans-serif',
            layout: "billboard",
            radius: "0.5rem",
            titleWeight: "500",
            tracking: "-0.05em",
        },
        "juego-sudoku": {
            bg: "#0d100e",
            panel: "#151a16",
            text: "#e8f5e9",
            muted: "#9db3a1",
            line: "#2a352d",
            accent: "#9ccf8a",
            accentText: "#0d100e",
            card: "#1b211c",
            display: '"Archivo", system-ui, sans-serif',
            body: '"Archivo", system-ui, sans-serif',
            layout: "split",
            radius: "0.25rem",
            titleWeight: "700",
            tracking: "-0.04em",
        },
        "juego-tango": {
            bg: "oklch(98.4% 0.006 245)",
            panel: "oklch(95.8% 0.014 245)",
            text: "oklch(31% 0.085 264)",
            muted: "oklch(56% 0.04 258)",
            line: "oklch(88% 0.025 248)",
            accent: "oklch(87% 0.11 84)",
            accentText: "oklch(31% 0.085 264)",
            card: "oklch(95.8% 0.014 245)",
            display: '"IBM Plex Sans Condensed", sans-serif',
            body: '"IBM Plex Sans", sans-serif',
            layout: "row",
            radius: "0.75rem",
            titleWeight: "600",
            tracking: "-0.03em",
        },
        "juego-wend": {
            bg: "#e7efff",
            panel: "#ffffff",
            text: "#101a3a",
            muted: "#68789b",
            line: "#c9d6ee",
            accent: "#2f5eea",
            accentText: "#ffffff",
            card: "#ffffff",
            display: '"Space Grotesk", ui-sans-serif, sans-serif',
            body: '"Inter", system-ui, sans-serif',
            layout: "row",
            radius: "1rem",
            titleWeight: "700",
            tracking: "-0.04em",
        },
        "juego-zip": {
            bg: "#0f1526",
            panel: "#161d31",
            text: "#f2f4ff",
            muted: "#a8b0cb",
            line: "#2f3a5c",
            accent: "#8477b8",
            accentText: "#ffffff",
            card: "#1e2740",
            display: '"Space Grotesk", ui-sans-serif, sans-serif',
            body: '"Inter", system-ui, sans-serif',
            layout: "stack",
            radius: "0.75rem",
            titleWeight: "700",
            tracking: "-0.04em",
        },
    };

    const GAMES = {
        "juego-7-letras": {
            title: "7 Letras",
            subtitle: "Forma todas las palabras posibles alrededor de la letra central.",
            genre: "Palabras",
            instructions:
                "Forma palabras de al menos cuatro letras alrededor de la letra central. La letra del centro es obligatoria y cada palabra debe incluirla.",
        },
        "juego-adivina-numero": {
            title: "Adivina el número",
            subtitle: "Descubre el número secreto con las pistas de mayor o menor.",
            genre: "Lógica",
            instructions:
                "Escribe un número del 1 al 100 y usa las pistas para acercarte. Cuantos menos intentos necesites, mejor será tu resultado.",
        },
        "juego-memoriza-carta": {
            title: "Memoriza cartas",
            subtitle: "Encuentra todas las parejas antes de que se acabe el tiempo.",
            genre: "Memoria",
            instructions:
                "Voltea dos cartas por turno y memoriza su posición. Encuentra todas las parejas con el menor número de intentos posible.",
        },
        "juego-palabra-oculta": {
            title: "Palabra oculta",
            subtitle: "Adivina la palabra de cinco letras en seis intentos.",
            genre: "Palabras",
            instructions:
                "Adivina la palabra de cinco letras en seis intentos. Los colores indican letra correcta, letra mal colocada o letra que no aparece.",
        },
        "juego-patches": {
            title: "Patches",
            subtitle: "Divide el tablero en retales que encajen con cada pista.",
            genre: "Lógica",
            instructions:
                "Divide la cuadrícula en rectángulos. Cada pista indica el área y la forma del retal que debe contenerla.",
        },
        "juego-queens": {
            title: "Queens",
            subtitle: "Coloca una reina en cada fila, columna y región de color.",
            genre: "Lógica",
            instructions:
                "Coloca una reina en cada fila, columna y región de color. Dos reinas no pueden tocarse, ni siquiera en diagonal.",
        },
        "juego-serpiente": {
            title: "Serpiente",
            subtitle: "Come, crece y sobrevive sin chocar con los bordes.",
            genre: "Reflejos",
            instructions:
                "Mueve la serpiente con las flechas o WASD. Come para crecer y evita los bordes y tu propio cuerpo.",
        },
        "juego-sopa-letras": {
            title: "Sopa de letras",
            subtitle: "Encuentra todas las palabras escondidas en la cuadrícula.",
            genre: "Palabras",
            instructions:
                "Arrastra sobre la cuadrícula para marcar cada palabra de la lista. Las palabras pueden esconderse en cualquier dirección.",
        },
        "juego-sudoku": {
            title: "Sudoku",
            subtitle: "Completa la cuadrícula sin repetir números en cada región.",
            genre: "Lógica",
            instructions:
                "Completa cada fila, columna y caja de 3×3 con los números del 1 al 9 sin repetir ninguno.",
        },
        "juego-tango": {
            title: "Tango",
            subtitle: "Equilibra soles y lunas en cada fila y columna.",
            genre: "Lógica",
            instructions:
                "Rellena cada casilla con sol o luna. Respeta el equilibrio de cada fila y columna y las parejas indicadas.",
        },
        "juego-wend": {
            title: "Wend",
            subtitle: "Traza un camino y encuentra todas las palabras de la red.",
            genre: "Palabras",
            instructions:
                "Traza un camino por todas las letras válidas y forma las palabras ocultas sin cruzar el recorrido.",
        },
        "juego-zip": {
            title: "Zip",
            subtitle: "Une los puntos en orden con un único camino.",
            genre: "Lógica",
            instructions:
                "Une los puntos en orden numérico con un único camino que pase por todas las casillas del tablero.",
        },
    };

    const pathParts = window.location.pathname.split("/").filter(Boolean);
    const gameId = pathParts[pathParts.length - 1];
    const game = GAMES[gameId];

    if (!game) {
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const playing = params.get("play") === "1";
    const playUrl = `${window.location.pathname}?play=1`;
    const storageKey = `arcade:${gameId}`;

    const readStats = () => {
        try {
            const raw = window.localStorage.getItem(storageKey);
            if (!raw) {
                return { plays: 0, last: null };
            }
            const parsed = JSON.parse(raw);
            return {
                plays: Number.isFinite(parsed.plays) ? parsed.plays : 0,
                last: typeof parsed.last === "string" ? parsed.last : null,
            };
        } catch {
            return { plays: 0, last: null };
        }
    };

    const registerPlay = () => {
        const stats = readStats();
        const next = {
            plays: stats.plays + 1,
            last: new Date().toISOString(),
        };
        try {
            window.localStorage.setItem(storageKey, JSON.stringify(next));
        } catch {
            /* Sin almacenamiento: la partida se abre igualmente. */
        }
    };

    const createNode = (tag, className, text) => {
        const element = document.createElement(tag);
        if (className) {
            element.className = className;
        }
        if (text) {
            element.textContent = text;
        }
        return element;
    };

    const RETHEMED_GAMES = new Set([
        "juego-7-letras",
        "juego-memoriza-carta",
        "juego-palabra-oculta",
        "juego-serpiente",
        "juego-sopa-letras",
        "juego-sudoku",
    ]);

    const applyVars = (root, theme) => {
        const vars = {
            "--arcade-bg": theme.bg,
            "--arcade-panel": theme.panel,
            "--arcade-text": theme.text,
            "--arcade-muted": theme.muted,
            "--arcade-line": theme.line,
            "--arcade-accent": theme.accent,
            "--arcade-accent-text": theme.accentText,
            "--arcade-card": theme.card,
            "--arcade-display": theme.display,
            "--arcade-body": theme.body,
            "--arcade-radius": theme.radius,
            "--arcade-title-weight": theme.titleWeight,
            "--arcade-title-tracking": theme.tracking,
        };
        Object.entries(vars).forEach(([name, value]) => root.style.setProperty(name, value));
    };

    const applyGameTheme = (root, theme) => {
        const tokens = {
            "--color": theme.accent,
            "--color-2": theme.text,
            "--color-3": theme.muted,
            "--color-4": theme.muted,
            "--color-5": theme.accent,
            "--color-6": theme.card,
            "--color-7": theme.line,
            "--color-8": theme.line,
            "--color-9": theme.accent,
            "--color-10": theme.card,
            "--color-11": theme.bg,
            "--color-12": theme.panel,
        };
        Object.entries(tokens).forEach(([name, value]) => root.style.setProperty(name, value));
    };

    const createIcon = (paths) => {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("aria-hidden", "true");
        paths.forEach((pathData) => {
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", pathData);
            svg.append(path);
        });
        return svg;
    };

    if (playing) {
        const theme = THEMES[gameId];
        if (theme) {
            applyVars(document.documentElement, theme);
            if (RETHEMED_GAMES.has(gameId)) {
                applyGameTheme(document.documentElement, theme);
            }
        }
        document.documentElement.classList.add("arcade-playing");
        if (RETHEMED_GAMES.has(gameId)) {
            document.documentElement.classList.add("arcade-rethemed");
        }
        document.documentElement.dataset.arcadeGame = gameId;
        return;
    }

    const overlay = document.createElement("div");
    overlay.className = "arcade-home";
    const theme = THEMES[gameId] ?? {
        bg: "#080b14",
        panel: "#0d1220",
        text: "#f4f7ff",
        muted: "#9daac4",
        line: "#26314d",
        accent: "#4f8cff",
        accentText: "#fff",
        card: "#111a2c",
        display: '"Inter", ui-sans-serif, sans-serif',
        body: '"Inter", ui-sans-serif, sans-serif',
        layout: "row",
        radius: "1rem",
        titleWeight: "800",
        tracking: "-0.045em",
    };
    overlay.classList.add(`arcade-home--${theme.layout}`);
    applyVars(overlay, theme);
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-labelledby", "arcade-title");

    const panel = createNode("section", "arcade-home__panel");

    const header = createNode("header", "arcade-home__header");
    const iconTile = createNode("span", "arcade-home__icon");
    iconTile.append(
        createIcon([
            "M7.5 8h9a4.5 4.5 0 0 1 4.4 3.6l.7 3.6a2.6 2.6 0 0 1-4.5 2.2L15.6 16H8.4l-1.5 1.4a2.6 2.6 0 0 1-4.5-2.2l.7-3.6A4.5 4.5 0 0 1 7.5 8Z",
            "M7 11v3M5.5 12.5h3",
            "M16.2 11.7h.1M18.2 13.5h.1",
        ])
    );
    const title = createNode("h1", "arcade-home__title", game.title);
    title.id = "arcade-title";
    const subtitle = createNode("p", "arcade-home__subtitle", game.subtitle);
    header.append(iconTile, title, subtitle);

    const modes = createNode("div", "arcade-home__modes");
    modes.setAttribute("role", "group");
    modes.setAttribute("aria-label", "Opciones de partida");

    const createMode = (id, symbol, label, description, pressed) => {
        const button = createNode("button", "arcade-home__mode");
        button.id = id;
        button.type = "button";
        button.setAttribute("aria-pressed", String(pressed));
        const icon = createNode("span", "arcade-home__mode-icon", symbol);
        icon.setAttribute("aria-hidden", "true");
        const text = createNode("span", "arcade-home__mode-text");
        text.append(createNode("strong", "", label), createNode("small", "", description));
        button.append(icon, text);
        return button;
    };

    const playMode = createMode(
        "arcade-mode-play",
        "▶",
        "Jugar",
        "Empieza una partida con la configuración clásica.",
        true
    );
    const isGuessingGame = gameId === "juego-adivina-numero";
    const helpMode = createMode(
        "arcade-mode-help",
        "?",
        isGuessingGame ? "Cómo se juega" : "Reglas",
        isGuessingGame ? "Abre las reglas antes de empezar." : "Consulta cómo se juega.",
        false
    );
    modes.append(playMode, helpMode);

    const instructions = createNode("div", "arcade-home__instructions");
    instructions.id = "arcade-instructions";
    instructions.hidden = true;
    instructions.append(
        createNode("strong", "", "Objetivo"),
        document.createTextNode(game.instructions)
    );

    const startButton = createNode("button", "arcade-home__start");
    startButton.id = "arcade-start";
    startButton.type = "button";
    startButton.append(createNode("span", "", "Jugar"), createIcon(["m9 6 6 6-6 6"]));

    panel.append(header, modes, instructions, startButton);
    overlay.append(panel);

    document.body.append(overlay);
    document.documentElement.classList.add("arcade-home-open");

    const siblings = [...document.body.children].filter(
        (element) => element !== overlay && !["SCRIPT", "LINK", "STYLE"].includes(element.tagName)
    );
    siblings.forEach((element) => {
        element.inert = true;
    });

    const helpModeButton = overlay.querySelector("#arcade-mode-help");
    const startButtonElement = overlay.querySelector("#arcade-start");

    helpModeButton.addEventListener("click", () => {
        const isOpen = !instructions.hidden;
        instructions.hidden = isOpen;
        helpModeButton.setAttribute("aria-pressed", String(!isOpen));
        playMode.setAttribute("aria-pressed", String(isOpen));
    });

    playMode.addEventListener("click", () => {
        instructions.hidden = true;
        playMode.setAttribute("aria-pressed", "true");
        helpModeButton.setAttribute("aria-pressed", "false");
        startButtonElement.focus();
    });

    startButtonElement.addEventListener("click", () => {
        registerPlay();
        window.location.href = playUrl;
    });

    window.requestAnimationFrame(() => startButtonElement.focus());
})();
