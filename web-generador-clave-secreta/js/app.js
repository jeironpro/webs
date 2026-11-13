const CHARSETS = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

const AMBIGUOUS = "O0Il1";
const GROUP_SIZE = 4;
const UINT32_RANGE = 0x100000000;
const ENTROPY_WEAK = 40;
const ENTROPY_MODERATE = 64;
const ENTROPY_STRONG = 100;
const TOAST_MS = 2000;

function getCharacterSet(options) {
    let chars = "";
    if (options.uppercase) chars += CHARSETS.uppercase;
    if (options.lowercase) chars += CHARSETS.lowercase;
    if (options.numbers) chars += CHARSETS.numbers;
    if (options.symbols) chars += CHARSETS.symbols;
    if (options.excludeAmbiguous) {
        chars = [...chars].filter((character) => !AMBIGUOUS.includes(character)).join("");
    }
    return chars;
}

function unbiasedRandomInt(max) {
    const limit = UINT32_RANGE - (UINT32_RANGE % max);
    const view = new Uint32Array(1);
    do {
        crypto.getRandomValues(view);
    } while (view[0] >= limit);
    return view[0] % max;
}

function generateKey(options) {
    const chars = getCharacterSet(options);
    if (chars.length === 0) return "";
    const size = chars.length;
    let key = "";
    for (let i = 0; i < options.length; i += 1) {
        key += chars[unbiasedRandomInt(size)];
    }
    return key;
}

function calculateEntropy(length, charsetSize) {
    if (charsetSize <= 1) return 0;
    return length * Math.log2(charsetSize);
}

function getCharsetSize(options) {
    return getCharacterSet(options).length;
}

function getStrengthLevel(entropy) {
    if (entropy < ENTROPY_WEAK) return { label: "Débil", level: 0, color: "danger" };
    if (entropy < ENTROPY_MODERATE) return { label: "Moderada", level: 1, color: "warning" };
    if (entropy < ENTROPY_STRONG) return { label: "Fuerte", level: 2, color: "success" };
    return { label: "Muy fuerte", level: 3, color: "success" };
}

function groupKey(key) {
    const groups = [];
    for (let i = 0; i < key.length; i += GROUP_SIZE) {
        groups.push(key.substring(i, i + GROUP_SIZE));
    }
    return groups;
}

let toastTimer = null;

function showToast(message, type) {
    let toast = document.getElementById("toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        toast.setAttribute("role", "status");
        toast.setAttribute("aria-live", "polite");
        document.body.appendChild(toast);
    }
    toast.className = "toast";
    if (type === "success") toast.classList.add("toast--success");

    const icon = document.createElement("span");
    icon.className = "toast__icon material-symbols-outlined";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = type === "success" ? "check_circle" : "info";
    toast.replaceChildren(icon, document.createTextNode(message));

    void toast.offsetWidth;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), TOAST_MS);
}

async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast("Copiada al portapapeles", "success");
    } catch {
        if (legacyCopy(text)) {
            showToast("Copiada al portapapeles", "success");
        } else {
            showToast("No se pudo copiar al portapapeles");
        }
    }
}

function legacyCopy(text) {
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.classList.add("visually-hidden");
    document.body.appendChild(field);
    field.select();
    try {
        return document.execCommand("copy");
    } catch {
        return false;
    } finally {
        field.remove();
    }
}

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
const strengthSegments = document.querySelectorAll(".strength__segment");
const strengthLabel = document.getElementById("strengthLabel");
const entropyValue = document.getElementById("entropyValue");

let currentKey = "";

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

function renderKey(key) {
    keyNumber.replaceChildren();
    if (!key) {
        const empty = document.createElement("span");
        empty.className = "key-card__empty";
        empty.textContent = "Selecciona tipos de carácter";
        keyNumber.appendChild(empty);
        return;
    }
    groupKey(key).forEach((group) => {
        const span = document.createElement("span");
        span.className = "key-card__group";
        span.textContent = group;
        keyNumber.appendChild(span);
    });
}

function updateStrength(charsetSize, length) {
    const entropy = calculateEntropy(length, charsetSize);
    const info = getStrengthLevel(entropy);
    strengthSegments.forEach((segment, index) => {
        segment.className = "strength__segment";
        if (index <= info.level) {
            segment.classList.add(`strength__segment--${info.color}`);
        }
    });
    strengthLabel.className = "strength__label";
    strengthLabel.classList.add(`strength__label--${info.color}`);
    strengthLabel.textContent = info.label;
    entropyValue.textContent = `${entropy.toFixed(0)} bits de entropía`;
}

function resetStrength() {
    strengthLabel.className = "strength__label";
    strengthLabel.textContent = "—";
    entropyValue.textContent = "0 bits de entropía";
    strengthSegments.forEach((segment) => {
        segment.className = "strength__segment";
    });
}

function generateAndDisplay() {
    const options = getOptions();
    if (!options.uppercase && !options.lowercase && !options.numbers && !options.symbols) {
        renderKey("");
        currentKey = "";
        resetStrength();
        return;
    }
    const key = generateKey(options);
    currentKey = key;
    renderKey(key);
    updateStrength(getCharsetSize(options), options.length);
    if (autoCopy.checked) copyToClipboard(key);
}

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

const expiryElement = document.getElementById("cardExpiry");
if (expiryElement) {
    const year = new Date().getFullYear() + 2;
    expiryElement.textContent = `12/${year.toString().slice(-2)}`;
}

generateAndDisplay();
