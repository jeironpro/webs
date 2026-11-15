/* Shell común del arcade: portada, marcador y salida al menú. */
(() => {
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

    const formatLast = (isoDate) => {
        if (!isoDate) {
            return "—";
        }
        const date = new Date(isoDate);
        if (Number.isNaN(date.getTime())) {
            return "—";
        }
        return new Intl.DateTimeFormat("es", {
            day: "2-digit",
            month: "short",
        }).format(date);
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

    const addReturnButton = () => {
        const link = document.createElement("a");
        link.className = "arcade-return";
        link.href = homeUrl;
        link.append(createIcon(["m15 6-6 6 6 6"]), createNode("span", "", "Arcade"));
        document.body.append(link);
    };

    if (playing) {
        addReturnButton();
        return;
    }

    const stats = readStats();
    const overlay = document.createElement("div");
    overlay.className = "arcade-home";
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
    const eyebrow = createNode("p", "arcade-home__eyebrow", `Arcade · ${game.genre}`);
    const title = createNode("h1", "arcade-home__title", game.title);
    title.id = "arcade-title";
    const subtitle = createNode("p", "arcade-home__subtitle", game.subtitle);
    const meta = createNode("ul", "arcade-home__meta");
    ["Partida individual", "Teclado y táctil", "Sin registro"].forEach((label) => {
        meta.append(createNode("li", "", label));
    });
    header.append(iconTile, eyebrow, title, subtitle, meta);

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
        "Partida rápida",
        "Abre el tablero con la configuración clásica.",
        true
    );
    const helpMode = createMode(
        "arcade-mode-help",
        "?",
        "Cómo jugar",
        "Consulta las reglas antes de empezar.",
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

    const scoreboard = createNode("section", "arcade-scoreboard");
    scoreboard.setAttribute("aria-label", "Estadísticas del juego");
    const playsItem = createNode("div", "arcade-scoreboard__item");
    const playsValue = createNode("strong", "", String(stats.plays));
    playsValue.id = "arcade-plays";
    playsItem.append(createNode("span", "", "Partidas"), playsValue);
    const divider = createNode("span", "arcade-scoreboard__divider");
    divider.setAttribute("aria-hidden", "true");
    const lastItem = createNode("div", "arcade-scoreboard__item");
    const lastValue = createNode("strong", "", formatLast(stats.last));
    lastValue.id = "arcade-last";
    lastItem.append(createNode("span", "", "Última partida"), lastValue);
    scoreboard.append(playsItem, divider, lastItem);

    const startButton = createNode("button", "arcade-home__start");
    startButton.id = "arcade-start";
    startButton.type = "button";
    startButton.append(createNode("span", "", "Jugar"), createIcon(["m9 6 6 6-6 6"]));

    const foot = createNode("p", "arcade-home__foot", `Arcade · ${game.genre} · 2026`);
    panel.append(header, modes, instructions, scoreboard, startButton, foot);
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
