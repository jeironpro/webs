const algoritmos = [
    { nombre: "Huffman-coding-compression", descripcion: "Algoritmo de compresión sin pérdida que asigna códigos más cortos a símbolos más frecuentes.", icono: "compress" },
    { nombre: "Euclid's", descripcion: "Calcula el máximo común divisor (MCD) de dos números mediante restas o divisiones sucesivas.", icono: "calculate" },
    { nombre: "Union-find", descripcion: "Estructura para manejar conjuntos disjuntos, útil para detectar ciclos o agrupar elementos relacionados.", icono: "merge" },
    { nombre: "Kadone's", descripcion: "Encuentra la subcadena contigua con la suma máxima dentro de un arreglo de números.", icono: "trending_up" },
    { nombre: "Floyd's-cycle-detection", descripcion: "Detecta ciclos en estructuras enlazadas mediante punteros lento y rápido.", icono: "loop" },
    { nombre: "Kmp", descripcion: "Algoritmo eficiente para buscar patrones en texto usando coincidencias parciales.", icono: "find_replace" },
    { nombre: "Quick-select", descripcion: "Encuentra el k-ésimo elemento más pequeño de una lista sin ordenarla completamente.", icono: "filter_alt" },
    { nombre: "Boyer-moore", descripcion: "Algoritmo rápido de búsqueda de patrones que salta partes del texto usando heurísticas.", icono: "text_snippet" },
    { nombre: "Linear-search", descripcion: "Busca un elemento recorriendo secuencialmente todos los elementos de la lista.", icono: "search" },
    { nombre: "Binary-search", descripcion: "Busca eficientemente en listas ordenadas dividiendo el rango de búsqueda a la mitad.", icono: "splitscreen" },
    { nombre: "Jump-search", descripcion: "Busca en listas ordenadas saltando bloques y luego haciendo búsqueda lineal dentro del bloque.", icono: "skip_next" },
    { nombre: "Interpolation-search", descripcion: "Versión mejorada de la búsqueda binaria que estima la posición del elemento según su valor.", icono: "timeline" },
    { nombre: "Exponential-search", descripcion: "Combina búsqueda exponencial y binaria para encontrar elementos en listas ordenadas.", icono: "rocket_launch" },
    { nombre: "Bubble-sort", descripcion: "Ordena comparando y cambiando elementos adyacentes repetidamente hasta que todo esté ordenado.", icono: "bubble_chart" },
    { nombre: "Selection-sort", descripcion: "Ordena seleccionando repetidamente el elemento más pequeño y colocándolo en su posición correcta.", icono: "select_all" },
    { nombre: "Insertion-sort", descripcion: "Construye una lista ordenada insertando cada elemento en la posición adecuada.", icono: "input" },
    { nombre: "Merge-sort", descripcion: "Divide la lista en mitades, las ordena recursivamente y luego las combina en orden.", icono: "merge" },
    { nombre: "Quick-sort", descripcion: "Ordena usando el método divide y vencerás al elegir un pivote y particionar la lista.", icono: "bolt" },
    { nombre: "Dijkstra's", descripcion: "Encuentra las rutas más cortas desde un nodo origen en un grafo con pesos positivos.", icono: "route" },
    { nombre: "Bellman-ford", descripcion: "Calcula caminos mínimos incluso con pesos negativos en un grafo dirigido.", icono: "alt_route" },
    { nombre: "Floyd-warshall", descripcion: "Encuentra las distancias más cortas entre todos los pares de nodos en un grafo.", icono: "lan" },
    { nombre: "Prim's", descripcion: "Construye un árbol de expansión mínima añadiendo aristas de menor peso sin formar ciclos.", icono: "account_tree" },
    { nombre: "Kruskal's", descripcion: "Forma un árbol de expansión mínima uniendo los vértices con las aristas más ligeras posibles.", icono: "device_hub" }
];

const contenedorTarjetas = document.getElementById("contenedor-tarjetas");

const crearTarjeta = (algoritmo) => {
    const tarjeta = document.createElement("div");
    const tarjetaVuelta = document.createElement("div");
    const tarjetaFrontal = document.createElement("div");
    const nombre = document.createElement("h2");
    const icono = document.createElement("span");
    const tarjetaTrasera = document.createElement("div");
    const descripcion = document.createElement("p");

    tarjeta.classList.add("tarjeta");
    tarjetaVuelta.classList.add("tarjeta-vuelta");
    tarjetaFrontal.classList.add("tarjeta-cara", "tarjeta-frontal");
    tarjetaTrasera.classList.add("tarjeta-cara", "tarjeta-trasera");
    icono.classList.add("material-symbols-outlined");

    icono.textContent = `${algoritmo.icono}`;
    nombre.textContent = `${algoritmo.nombre}`;
    descripcion.textContent = `${algoritmo.descripcion}`;

    tarjetaFrontal.appendChild(icono);
    tarjetaFrontal.appendChild(nombre);
    tarjetaTrasera.appendChild(descripcion);
    tarjetaVuelta.appendChild(tarjetaFrontal);
    tarjetaVuelta.appendChild(tarjetaTrasera);
    tarjeta.appendChild(tarjetaVuelta);
    contenedorTarjetas.appendChild(tarjeta);
};

const inicializarTarjetas = () => {
    algoritmos.forEach(algoritmo => crearTarjeta(algoritmo));
};

inicializarTarjetas();