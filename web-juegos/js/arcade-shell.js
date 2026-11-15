/* Shell común del arcade: portada, marcador y salida al menú. */
(() => {
    const THEMES = {
        "juego-7-letras": {
            bg: "#f3eee4",
            panel: "#fbf8f1",
            text: "#201b17",
            muted: "#6b5e4f",
            line: "#d8cbb8",
            accent: "#16726f",
            accentText: "#fbf8f1",
            card: "#fbf8f1",
            display: '"Fraunces", Georgia, serif',
            body: '"Archivo", system-ui, sans-serif',
            layout: "stack",
            radius: "0.125rem",
            titleWeight: "600",
            tracking: "-0.03em",
        },
        "juego-adivina-numero": {
            bg: "#f7f2e6",
            panel: "#fffdf7",
            text: "#202936",
            muted: "#5f6877",
            line: "#e5dcc9",
            accent: "#e0ad00",
            accentText: "#202936",
            card: "#fffdf7",
            display: '"Plus Jakarta Sans", ui-sans-serif, sans-serif',
            body: '"Plus Jakarta Sans", ui-sans-serif, sans-serif',
            layout: "row",
            radius: "1.25rem",
            titleWeight: "800",
            tracking: "-0.045em",
        },
        "juego-memoriza-carta": {
            bg: "#efe9f7",
            panel: "#f8f4ff",
            text: "#2b1d3d",
            muted: "#6f5c86",
            line: "#d9ccea",
            accent: "#6d3fa8",
            accentText: "#f8f4ff",
            card: "#f8f4ff",
            display: '"Fraunces", Georgia, serif',
            body: '"Archivo", system-ui, sans-serif',
            layout: "stack",
            radius: "1rem",
            titleWeight: "600",
            tracking: "-0.03em",
        },
        "juego-palabra-oculta": {
            bg: "#f1ecf7",
            panel: "#fbf8ff",
            text: "#241a33",
            muted: "#645578",
            line: "#d9cde9",
            accent: "#6b4fa0",
            accentText: "#fbf8ff",
            card: "#fbf8ff",
            display: '"Fraunces", Georgia, serif',
            body: '"Archivo", system-ui, sans-serif',
            layout: "stack",
            radius: "0.25rem",
            titleWeight: "600",
            tracking: "-0.03em",
        },
        "juego-patches": {
            bg: "#171513",
            panel: "#211e1a",
            text: "#f7f1e7",
            muted: "#b4a897",
            line: "#3a332b",
            accent: "#ff5a36",
            accentText: "#171513",
            card: "#29241f",
            display: '"Jost", ui-sans-serif, sans-serif',
            body: '"Archivo", ui-sans-serif, sans-serif',
            layout: "stack",
            radius: "0.5rem",
            titleWeight: "600",
            tracking: "-0.035em",
        },
        "juego-queens": {
            bg: "#f4ecd8",
            panel: "#fbf7ea",
            text: "#241c16",
            muted: "#6b5c4c",
            line: "#dcc9a4",
            accent: "#a3281a",
            accentText: "#fbf7ea",
            card: "#fbf7ea",
            display: '"Fraunces", Georgia, serif',
            body: '"Archivo", system-ui, sans-serif',
            layout: "row",
            radius: "0.25rem",
            titleWeight: "600",
            tracking: "-0.03em",
        },
        "juego-serpiente": {
            bg: "#0b1410",
            panel: "#10201a",
            text: "#eafff3",
            muted: "#93b7a5",
            line: "#244535",
            accent: "#47e08a",
            accentText: "#062015",
            card: "#14271f",
            display: '"Archivo", system-ui, sans-serif',
            body: '"Archivo", system-ui, sans-serif',
            layout: "row",
            radius: "0.75rem",
            titleWeight: "700",
            tracking: "-0.04em",
        },
        "juego-sopa-letras": {
            bg: "#eef6fb",
            panel: "#ffffff",
            text: "#122b3b",
            muted: "#577285",
            line: "#cfe2ee",
            accent: "#1d6fa5",
            accentText: "#ffffff",
            card: "#ffffff",
            display: '"Fraunces", Georgia, serif',
            body: '"Archivo", system-ui, sans-serif',
            layout: "row",
            radius: "0.5rem",
            titleWeight: "600",
            tracking: "-0.03em",
        },
        "juego-sudoku": {
            bg: "#ececec",
            panel: "#ffffff",
            text: "#151515",
            muted: "#666666",
            line: "#d2d2d2",
            accent: "#151515",
            accentText: "#ffffff",
            card: "#ffffff",
            display: '"Archivo", system-ui, sans-serif',
            body: '"Archivo", system-ui, sans-serif',
            layout: "stack",
            radius: "0.25rem",
            titleWeight: "700",
            tracking: "-0.04em",
        },
        "juego-tango": {
            bg: "#f6f9ff",
            panel: "#ffffff",
            text: "#26355c",
            muted: "#5d6b8c",
            line: "#dbe4f5",
            accent: "#4f6bd8",
            accentText: "#ffffff",
            card: "#ffffff",
            display: '"IBM Plex Sans Condensed", sans-serif',
            body: '"IBM Plex Sans", sans-serif',
            layout: "row",
            radius: "0.75rem",
            titleWeight: "600",
            tracking: "-0.03em",
        },
        "juego-wend": {
            bg: "#effaf5",
            panel: "#ffffff",
            text: "#0d2a22",
            muted: "#4f7267",
            line: "#c6e5da",
            accent: "#0f9d76",
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
            accent: "#7d5cff",
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
    const homeUrl = `${window.location.pathname}`;
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

    const applyTheme = (root, theme) => {
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
        Object.entries(vars).forEach(([name, value]) => {
            root.style.setProperty(name, value);
        });
    };

    const addGameBar = () => {
        const theme = THEMES[gameId];
        if (theme) {
            applyTheme(document.documentElement, theme);
        }
        document.documentElement.classList.add("arcade-playing");
        document.documentElement.dataset.arcadeGame = gameId;
        const bar = createNode("div", "arcade-gamebar");
        bar.setAttribute("role", "navigation");
        bar.setAttribute("aria-label", "Arcade");
        const back = createNode("a", "arcade-gamebar__back");
        back.href = homeUrl;
        back.append(createIcon(["m15 6-6 6 6 6"]), createNode("span", "", "Arcade"));
        bar.append(back, createNode("span", "arcade-gamebar__title", game.title));
        document.body.prepend(bar);
    };

    if (playing) {
        addGameBar();
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
    applyTheme(overlay, theme);
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
    const helpMode = createMode(
        "arcade-mode-help",
        "?",
        "Reglas",
        "Consulta cómo se juega.",
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
