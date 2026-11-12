const algorithms = [
    {
        name: "Huffman-coding-compression",
        description:
            "Algoritmo de compresión sin pérdida que asigna códigos más cortos a símbolos más frecuentes.",
        icon: "compress",
    },
    {
        name: "Euclid's",
        description:
            "Calcula el máximo común divisor (MCD) de dos números mediante restas o divisiones sucesivas.",
        icon: "calculate",
    },
    {
        name: "Union-find",
        description:
            "Estructura para manejar conjuntos disjuntos, útil para detectar ciclos o agrupar elementos relacionados.",
        icon: "merge",
    },
    {
        name: "Kadone's",
        description:
            "Encuentra la subcadena contigua con la suma máxima dentro de un arreglo de números.",
        icon: "trending_up",
    },
    {
        name: "Floyd's-cycle-detection",
        description: "Detecta ciclos en estructuras enlazadas mediante punteros lento y rápido.",
        icon: "loop",
    },
    {
        name: "Kmp",
        description:
            "Algoritmo eficiente para buscar patrones en texto usando coincidencias parciales.",
        icon: "find_replace",
    },
    {
        name: "Quick-select",
        description:
            "Encuentra el k-ésimo elemento más pequeño de una lista sin ordenarla completamente.",
        icon: "filter_alt",
    },
    {
        name: "Boyer-moore",
        description:
            "Algoritmo rápido de búsqueda de patrones que salta partes del texto usando heurísticas.",
        icon: "text_snippet",
    },
    {
        name: "Linear-search",
        description:
            "Busca un elemento recorriendo secuencialmente todos los elementos de la lista.",
        icon: "search",
    },
    {
        name: "Binary-search",
        description:
            "Busca eficientemente en listas ordenadas dividiendo el rango de búsqueda a la mitad.",
        icon: "splitscreen",
    },
    {
        name: "Jump-search",
        description:
            "Busca en listas ordenadas saltando bloques y luego haciendo búsqueda lineal dentro del bloque.",
        icon: "skip_next",
    },
    {
        name: "Interpolation-search",
        description:
            "Versión mejorada de la búsqueda binaria que estima la posición del elemento según su valor.",
        icon: "timeline",
    },
    {
        name: "Exponential-search",
        description:
            "Combina búsqueda exponencial y binaria para encontrar elementos en listas ordenadas.",
        icon: "rocket_launch",
    },
    {
        name: "Bubble-sort",
        description:
            "Ordena comparando y cambiando elementos adyacentes repetidamente hasta que todo esté ordenado.",
        icon: "bubble_chart",
    },
    {
        name: "Selection-sort",
        description:
            "Ordena seleccionando repetidamente el elemento más pequeño y colocándolo en su posición correcta.",
        icon: "select_all",
    },
    {
        name: "Insertion-sort",
        description:
            "Construye una lista ordenada insertando cada elemento en la posición adecuada.",
        icon: "input",
    },
    {
        name: "Merge-sort",
        description:
            "Divide la lista en mitades, las ordena recursivamente y luego las combina en orden.",
        icon: "merge",
    },
    {
        name: "Quick-sort",
        description:
            "Ordena usando el método divide y vencerás al elegir un pivote y particionar la lista.",
        icon: "bolt",
    },
    {
        name: "Dijkstra's",
        description:
            "Encuentra las rutas más cortas desde un nodo origen en un grafo con pesos positivos.",
        icon: "route",
    },
    {
        name: "Bellman-ford",
        description: "Calcula caminos mínimos incluso con pesos negativos en un grafo dirigido.",
        icon: "alt_route",
    },
    {
        name: "Floyd-warshall",
        description:
            "Encuentra las distancias más cortas entre todos los pares de nodos en un grafo.",
        icon: "lan",
    },
    {
        name: "Prim's",
        description:
            "Construye un árbol de expansión mínima añadiendo aristas de menor peso sin formar ciclos.",
        icon: "account_tree",
    },
    {
        name: "Kruskal's",
        description:
            "Forma un árbol de expansión mínima uniendo los vértices con las aristas más ligeras posibles.",
        icon: "device_hub",
    },
];

const cardsContainer = document.getElementById("cards");

const createCard = (algorithm) => {
    const card = document.createElement("div");
    const cardInner = document.createElement("div");
    const cardFront = document.createElement("div");
    const title = document.createElement("h2");
    const icon = document.createElement("span");
    const cardBack = document.createElement("div");
    const description = document.createElement("p");

    card.classList.add("card");
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `${algorithm.name}: ${algorithm.description}`);
    cardInner.classList.add("card__inner");
    cardFront.classList.add("card__face", "card__front");
    cardBack.classList.add("card__face", "card__back");
    icon.classList.add("material-symbols-outlined");

    icon.textContent = `${algorithm.icon}`;
    title.textContent = `${algorithm.name}`;
    description.textContent = `${algorithm.description}`;

    cardFront.appendChild(icon);
    cardFront.appendChild(title);
    cardBack.appendChild(description);
    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);
    const flip = () => card.classList.toggle("is-flipped");
    card.addEventListener("click", flip);
    card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            flip();
        }
    });

    cardsContainer.appendChild(card);
};

const initCards = () => {
    algorithms.forEach((algorithm) => createCard(algorithm));
};

initCards();
