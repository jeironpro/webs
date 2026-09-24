/* Funcion de autoejecucion para evitar contaminar el ambito global */
(function () {
    /* Conjuntos de caracteres disponibles para la clave */
    var CHARSETS = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    };

    /* Caracteres ambiguos que se excluyen opcionalmente */
    var AMBIGUOUS = 'O0Il1';
    /* Cantidad de caracteres por grupo visual en la tarjeta */
    var GROUP_SIZE = 4;

    /* Construye el string con los caracteres permitidos segun opciones */
    function getCharacterSet(opts) {
        var chars = '';
        if (opts.uppercase) chars += CHARSETS.uppercase;
        if (opts.lowercase) chars += CHARSETS.lowercase;
        if (opts.numbers) chars += CHARSETS.numbers;
        if (opts.symbols) chars += CHARSETS.symbols;
        if (opts.excludeAmbiguous) {
            /* Filtra caracteres que aparecen en la lista de ambiguos */
            chars = chars.split('').filter(function (c) { return AMBIGUOUS.indexOf(c) === -1; }).join('');
        }
        return chars;
    }

    /* Genera un entero aleatorio sin sesgo en [0, max) usando rejection sampling */
    function unbiasedRandomInt(max) {
        /* Limite superior multiplo de max para eliminar sesgo modulo */
        var limit = 0x100000000 - (0x100000000 % max);
        var view = new Uint32Array(1);
        /* Descarta valores que caen en el rango de sesgo */
        do { crypto.getRandomValues(view); } while (view[0] >= limit);
        return view[0] % max;
    }

    /* Genera la clave completa caracter por caracter */
    function generateKey(opts) {
        var chars = getCharacterSet(opts);
        if (!chars.length) return '';
        var n = chars.length;
        var key = '';
        for (var i = 0; i < opts.length; i++) {
            key += chars[unbiasedRandomInt(n)];
        }
        return key;
    }

    /* Formula de entropia de Shannon: longitud * log2(tamano del conjunto) */
    function calculateEntropy(length, charsetSize) {
        if (charsetSize <= 1) return 0;
        return length * Math.log2(charsetSize);
    }

    /* Obtiene el tamano del conjunto de caracteres segun opciones activas */
    function getCharsetSize(opts) {
        return getCharacterSet(opts).length;
    }

    /* Determina el nivel de fortaleza segun los bits de entropia */
    function getStrengthLevel(entropy) {
        if (entropy < 40) return { label: 'Debil', level: 0, color: 'danger' };
        if (entropy < 64) return { label: 'Moderada', level: 1, color: 'warning' };
        if (entropy < 100) return { label: 'Fuerte', level: 2, color: 'success' };
        return { label: 'Muy fuerte', level: 3, color: 'success' };
    }

    /* Divide la clave en grupos de 4 caracteres para mostrar en la tarjeta */
    function groupKey(key) {
        var groups = [];
        for (var i = 0; i < key.length; i += GROUP_SIZE) {
            groups.push(key.substring(i, i + GROUP_SIZE));
        }
        return groups;
    }

    /* ─── Toast (notificacion emergente) ─── */
    var toastTimer = null;

    /* Muestra un mensaje temporal en la parte inferior de la pantalla */
    function showToast(message, type) {
        var toast = document.getElementById('toast');
        if (!toast) {
            /* Crea el elemento si no existe */
            toast = document.createElement('div');
            toast.id = 'toast';
            toast.className = 'toast';
            document.body.appendChild(toast);
        }
        toast.className = 'toast';
        if (type) toast.classList.add(type);
        toast.innerHTML = '<span class="toast-icon material-symbols-outlined">' + (type === 'success' ? 'check_circle' : 'info') + '</span>' + message;
        requestAnimationFrame(function () { toast.classList.add('visible'); });
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { toast.classList.remove('visible'); }, 2000);
    }

    /* Copia texto al portapapeles usando execCommand para evitar toast nativo en movil */
    function copyToClipboard(text) {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        ta.style.top = '-9999px';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        ta.setSelectionRange(0, text.length);
        try { document.execCommand('copy'); } catch (e) { }
        document.body.removeChild(ta);
        showToast('Copiada al portapapeles', 'success');
    }

    /* ─── Referencias al DOM ─── */
    var keyNumber = document.getElementById('keyNumber');
    var copyBtn = document.getElementById('copyBtn');
    var regenBtn = document.getElementById('regenBtn');
    var lengthSlider = document.getElementById('length');
    var lengthValue = document.getElementById('lengthValue');
    var uppercase = document.getElementById('uppercase');
    var lowercase = document.getElementById('lowercase');
    var numbers = document.getElementById('numbers');
    var symbols = document.getElementById('symbols');
    var excludeAmbiguous = document.getElementById('excludeAmbiguous');
    var autoCopy = document.getElementById('autoCopy');
    var strengthSegments = document.querySelectorAll('.strength-segment');
    var strengthLabel = document.getElementById('strengthLabel');
    var entropyValue = document.getElementById('entropyValue');

    /* Almacena la ultima clave generada para copiarla sin regenerar */
    var currentKey = '';

    /* Lee el estado actual de todos los controles de opciones */
    function getOptions() {
        return {
            length: parseInt(lengthSlider.value, 10),
            uppercase: uppercase.checked,
            lowercase: lowercase.checked,
            numbers: numbers.checked,
            symbols: symbols.checked,
            excludeAmbiguous: excludeAmbiguous.checked,
        };
    }

    /* Renderiza la clave en grupos de 4 caracteres dentro de la tarjeta */
    function renderKey(key) {
        keyNumber.innerHTML = '';
        if (!key) {
            /* Muestra mensaje si no hay conjunto de caracteres seleccionado */
            keyNumber.innerHTML = '<span class="key-empty">Selecciona tipos de caracter</span>';
            return;
        }
        var groups = groupKey(key);
        groups.forEach(function (g) {
            var span = document.createElement('span');
            span.className = 'key-group';
            span.textContent = g;
            keyNumber.appendChild(span);
        });
    }

    /* Actualiza la barra de fortaleza y los bits de entropia */
    function updateStrength(charsetSize, length) {
        var entropy = calculateEntropy(length, charsetSize);
        var info = getStrengthLevel(entropy);
        /* Ilumina los segmentos segun el nivel */
        strengthSegments.forEach(function (seg, i) {
            seg.className = 'strength-segment';
            if (i <= info.level) {
                seg.classList.add('active');
                seg.style.background = 'var(--color-' + info.color + ')';
            } else {
                seg.style.background = '';
            }
        });
        strengthLabel.textContent = info.label;
        strengthLabel.style.color = 'var(--color-' + info.color + ')';
        entropyValue.textContent = entropy.toFixed(0) + ' bits de entropia';
    }

    /* Genera una nueva clave y actualiza toda la interfaz */
    function generateAndDisplay() {
        var opts = getOptions();
        /* Valida que al menos un tipo de caracter este seleccionado */
        if (!opts.uppercase && !opts.lowercase && !opts.numbers && !opts.symbols) {
            renderKey('');
            currentKey = '';
            strengthLabel.textContent = '\u2014';
            entropyValue.textContent = '0 bits de entropia';
            strengthSegments.forEach(function (s) {
                s.className = 'strength-segment';
                s.style.background = '';
            });
            return;
        }
        var key = generateKey(opts);
        currentKey = key;
        renderKey(key);
        updateStrength(getCharsetSize(opts), opts.length);
        /* Si auto-copia esta activo, copia al portapapeles */
        if (autoCopy.checked) {
            copyToClipboard(key);
        }
    }

    /* ─── Eventos ─── */

    /* Boton copiar: copia la clave actual al portapapeles */
    copyBtn.addEventListener('click', function () {
        if (currentKey) copyToClipboard(currentKey);
    });

    /* Boton regenerar: genera una nueva clave */
    regenBtn.addEventListener('click', generateAndDisplay);

    /* Slider de longitud: actualiza el valor numerico y regenera */
    lengthSlider.addEventListener('input', function () {
        lengthValue.textContent = lengthSlider.value;
        generateAndDisplay();
    });

    /* Checkboxes: cualquier cambio regenera la clave */
    [uppercase, lowercase, numbers, symbols, excludeAmbiguous].forEach(function (cb) {
        cb.addEventListener('change', generateAndDisplay);
    });

    /* Actualiza el anyo de vencimiento de la tarjeta: anyo actual + 2 */
    var expiryEl = document.getElementById('cardExpiry');
    if (expiryEl) {
        var year = new Date().getFullYear() + 2;
        expiryEl.textContent = '12/' + year.toString().slice(-2);
    }

    /* Inicializa la aplicacion con una clave por defecto */
    generateAndDisplay();
})();
