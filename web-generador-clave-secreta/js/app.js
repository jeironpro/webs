/* Generador de claves secretas: lógica de la interfaz (módulo ES). */

/* Conjuntos de caracteres disponibles para la clave. */
const CHARSETS = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

/* Caracteres ambiguos que se excluyen opcionalmente. */
const AMBIGUOUS = "O0Il1";
/* Cantidad de caracteres por grupo visual en la tarjeta. */
const GROUP_SIZE = 4;
/* Rango de un entero de 32 bits sin signo: base del muestreo sin sesgo. */
const UINT32_RANGE = 0x100000000;
/* Umbrales de entropía (bits) que separan los niveles de fortaleza. */
const ENTROPY_WEAK = 40;
const ENTROPY_MODERATE = 64;
const ENTROPY_STRONG = 100;
/* Tiempo que el aviso emergente permanece visible, en milisegundos. */
const TOAST_MS = 2000;

/* Construye la cadena con los caracteres permitidos según las opciones. */
function getCharacterSet(opts) {
    let chars = "";
    if (opts.uppercase) chars += CHARSETS.uppercase;
    if (opts.lowercase) chars += CHARSETS.lowercase;
    if (opts.numbers) chars += CHARSETS.numbers;
    if (opts.symbols) chars += CHARSETS.symbols;
    if (opts.excludeAmbiguous) {
        /* Filtra los caracteres que aparecen en la lista de ambiguos. */
        chars = [...chars].filter((caracter) => !AMBIGUOUS.includes(caracter)).join("");
    }
    return chars;
}

/* Genera un entero aleatorio sin sesgo en [0, max) con rejection sampling. */
function unbiasedRandomInt(max) {
    /* Límite superior múltiplo de max, que elimina el sesgo del módulo. */
    const limit = UINT32_RANGE - (UINT32_RANGE % max);
    const view = new Uint32Array(1);
    /* Descarta los valores que caen en el rango sesgado. */
    do {
        crypto.getRandomValues(view);
    } while (view[0] >= limit);
    return view[0] % max;
}

/* Genera la clave completa carácter a carácter. */
function generateKey(opts) {
    const chars = getCharacterSet(opts);
    if (chars.length === 0) return "";
    const size = chars.length;
    let key = "";
    for (let i = 0; i < opts.length; i += 1) {
        key += chars[unbiasedRandomInt(size)];
    }
    return key;
}

/* Entropía de Shannon para una clave aleatoria: longitud * log2(conjunto). */
function calculateEntropy(length, charsetSize) {
    if (charsetSize <= 1) return 0;
    return length * Math.log2(charsetSize);
}

/* Tamaño del conjunto de caracteres según las opciones activas. */
function getCharsetSize(opts) {
    return getCharacterSet(opts).length;
}

/* Nivel de fortaleza según los bits de entropía. */
function getStrengthLevel(entropy) {
    if (entropy < ENTROPY_WEAK) return { label: "Débil", level: 0, color: "danger" };
    if (entropy < ENTROPY_MODERATE) return { label: "Moderada", level: 1, color: "warning" };
    if (entropy < ENTROPY_STRONG) return { label: "Fuerte", level: 2, color: "success" };
    return { label: "Muy fuerte", level: 3, color: "success" };
}

/* Divide la clave en grupos para mostrarla en la tarjeta. */
function groupKey(key) {
    const groups = [];
    for (let i = 0; i < key.length; i += GROUP_SIZE) {
        groups.push(key.substring(i, i + GROUP_SIZE));
    }
    return groups;
}

/* ─── Aviso emergente (toast) ─── */
let toastTimer = null;

/* Muestra un mensaje temporal en la parte inferior de la pantalla. */
function showToast(message, type) {
    let toast = document.getElementById("toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        toast.className = "toast";
        document.body.appendChild(toast);
    }
    toast.className = "toast";
    if (type) toast.classList.add(type);

    /* El icono y el texto se crean como nodos, sin inyectar HTML. */
    const icono = document.createElement("span");
    icono.className = "toast-icon material-symbols-outlined";
    icono.textContent = type === "success" ? "check_circle" : "info";
    toast.replaceChildren(icono, document.createTextNode(message));

    requestAnimationFrame(() => toast.classList.add("visible"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("visible"), TOAST_MS);
}

/* Copia al portapapeles con la API moderna y, si no está disponible, con el
 * método clásico de selección de un textarea oculto. */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast("Copiada al portapapeles", "success");
    } catch (error) {
        console.error("No se pudo copiar con la API del portapapeles", error);
        if (legacyCopy(text)) {
            showToast("Copiada al portapapeles", "success");
        } else {
            showToast("No se pudo copiar al portapapeles");
        }
    }
}

/* Copia con el método clásico, necesario en navegadores sin permisos de portapapeles. */
function legacyCopy(text) {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    let copiado = false;
    try {
        copiado = document.execCommand("copy");
    } catch (error) {
        console.error("El portapapeles clásico tampoco está disponible", error);
    }
    area.remove();
    return copiado;
}

/* ─── Referencias al DOM ─── */
const keyNumber = document.getElementById("keyNumber");
const copyBtn = document.getElementById("copyBtn");
const regenBtn = document.getElementById("regenBtn");
const lengthSlider = document.getElementById("length");
const lengthValue = document.getElementById("lengthValue");
const uppercase = document.getElementById("uppercase");
const lowercase = document.getElementById("lowercase");
const numbers = document.getElementById("numbers");
const symbols = document.getElementById("symbols");
const excludeAmbiguous = document.getElementById("excludeAmbiguous");
const autoCopy = document.getElementById("autoCopy");
const strengthSegments = document.querySelectorAll(".strength-segment");
const strengthLabel = document.getElementById("strengthLabel");
const entropyValue = document.getElementById("entropyValue");

/* Última clave generada, para poder copiarla sin regenerarla. */
let currentKey = "";

/* Lee el estado actual de todos los controles de opciones. */
function getOptions() {
    return {
        length: Number.parseInt(lengthSlider.value, 10),
        uppercase: uppercase.checked,
        lowercase: lowercase.checked,
        numbers: numbers.checked,
        symbols: symbols.checked,
        excludeAmbiguous: excludeAmbiguous.checked,
    };
}

/* Pinta la clave en grupos dentro de la tarjeta. */
function renderKey(key) {
    keyNumber.replaceChildren();
    if (!key) {
        /* Aviso cuando no hay ningún conjunto de caracteres seleccionado. */
        const vacio = document.createElement("span");
        vacio.className = "key-empty";
        vacio.textContent = "Selecciona tipos de caracter";
        keyNumber.appendChild(vacio);
        return;
    }
    groupKey(key).forEach((grupo) => {
        const span = document.createElement("span");
        span.className = "key-group";
        span.textContent = grupo;
        keyNumber.appendChild(span);
    });
}

/* Actualiza la barra de fortaleza y los bits de entropía. */
function updateStrength(charsetSize, length) {
    const entropy = calculateEntropy(length, charsetSize);
    const info = getStrengthLevel(entropy);
    /* Ilumina los segmentos hasta el nivel alcanzado. */
    strengthSegments.forEach((segmento, indice) => {
        segmento.className = "strength-segment";
        if (indice <= info.level) {
            segmento.classList.add("active");
            segmento.style.background = `var(--color-${info.color})`;
        } else {
            segmento.style.background = "";
        }
    });
    strengthLabel.textContent = info.label;
    strengthLabel.style.color = `var(--color-${info.color})`;
    entropyValue.textContent = `${entropy.toFixed(0)} bits de entropía`;
}

/* Genera una clave nueva y refresca toda la interfaz. */
function generateAndDisplay() {
    const opts = getOptions();
    /* Sin ningún tipo de carácter seleccionado no hay clave posible. */
    if (!opts.uppercase && !opts.lowercase && !opts.numbers && !opts.symbols) {
        renderKey("");
        currentKey = "";
        strengthLabel.textContent = "—";
        entropyValue.textContent = "0 bits de entropía";
        strengthSegments.forEach((segmento) => {
            segmento.className = "strength-segment";
            segmento.style.background = "";
        });
        return;
    }
    const key = generateKey(opts);
    currentKey = key;
    renderKey(key);
    updateStrength(getCharsetSize(opts), opts.length);
    if (autoCopy.checked) copyToClipboard(key);
}

/* ─── Eventos ─── */
copyBtn.addEventListener("click", () => {
    if (currentKey) copyToClipboard(currentKey);
});

regenBtn.addEventListener("click", generateAndDisplay);

lengthSlider.addEventListener("input", () => {
    lengthValue.textContent = lengthSlider.value;
    generateAndDisplay();
});

[uppercase, lowercase, numbers, symbols, excludeAmbiguous].forEach((checkbox) => {
    checkbox.addEventListener("change", generateAndDisplay);
});

/* Caducidad de la tarjeta: diciembre de dentro de dos años. */
const expiryEl = document.getElementById("cardExpiry");
if (expiryEl) {
    const year = new Date().getFullYear() + 2;
    expiryEl.textContent = `12/${year.toString().slice(-2)}`;
}

/* Arranca con una clave por defecto. */
generateAndDisplay();
