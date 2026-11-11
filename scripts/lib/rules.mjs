/**
 * Auditoría estática de las reglas de HTML, CSS y JavaScript del equipo
 * (`~/.agents/skills/dicresoft/rules`). Solo detecta, no modifica nada: cada
 * hallazgo lleva su regla, la línea y el fragmento para poder corregirlo.
 *
 * Las funciones de análisis reciben el contenido del fichero y devuelven
 * hallazgos, de modo que se pueden probar sin tocar el disco.
 */

/** Catálogo de reglas con su descripción legible. */
export const REGLAS = {
    "html-lang": { tipo: "html", descripcion: "sin <html lang>, el documento no declara idioma" },
    "html-charset": { tipo: "html", descripcion: "sin <meta charset>" },
    "html-viewport": { tipo: "html", descripcion: "sin <meta name=viewport> (no es responsive)" },
    "html-title": { tipo: "html", descripcion: "sin <title> descriptivo" },
    "html-img-alt": { tipo: "html", descripcion: "<img> sin atributo alt" },
    "html-control-label": {
        tipo: "html",
        descripcion: "campo de formulario sin label ni aria-label",
    },
    "html-div-interactivo": {
        tipo: "html",
        descripcion: "div/span con manejador en vez de un elemento nativo",
    },
    "css-important": { tipo: "css", descripcion: "uso de !important" },
    "css-media-max": { tipo: "css", descripcion: "media query con max-width (no es mobile-first)" },
    "css-hex-suelto": {
        tipo: "css",
        descripcion: "color hex fuera de :root, debería ser un token",
    },
    "js-innerhtml": {
        tipo: "js",
        descripcion: "innerHTML/outerHTML/insertAdjacentHTML (inyección de HTML)",
    },
    "js-var": { tipo: "js", descripcion: "declaración con var" },
    "js-igualdad": { tipo: "js", descripcion: "comparación no estricta (==/!=)" },
    "js-then": { tipo: "js", descripcion: "cadena .then() en lugar de async/await" },
    "js-require": { tipo: "js", descripcion: "require() en lugar de import" },
};

/** Etiquetas de formulario que nunca necesitan label visible. */
const TIPOS_SIN_LABEL = new Set(["hidden", "submit", "button", "reset", "image"]);

/** Índice de inicio de cada línea, para traducir desplazamientos a líneas. */
function indicesDeLineas(texto) {
    const indices = [0];
    for (let i = 0; i < texto.length; i += 1) {
        if (texto[i] === "\n") indices.push(i + 1);
    }
    return indices;
}

/** Línea (1-based) de un desplazamiento del texto. */
function lineaDe(indices, desplazamiento) {
    let baja = 0;
    let alta = indices.length - 1;
    while (baja < alta) {
        const medio = Math.ceil((baja + alta) / 2);
        if (indices[medio] <= desplazamiento) baja = medio;
        else alta = medio - 1;
    }
    return baja + 1;
}

/** Fragmento recortado alrededor de un hallazgo. */
function fragmento(texto, desplazamiento, longitud = 60) {
    return texto
        .slice(desplazamiento, desplazamiento + longitud)
        .replace(/\s+/g, " ")
        .trim();
}

/**
 * Sustituye por espacios el contenido de comentarios y cadenas, conservando
 * longitud y saltos de línea, para que las búsquedas no den falsos positivos.
 * Es una aproximación: no distingue literales de expresión regular.
 */
export function enmascararJs(texto) {
    const salida = texto.split("");
    const tapar = (desde, hasta) => {
        for (let k = desde; k < hasta && k < salida.length; k += 1) {
            if (salida[k] !== "\n") salida[k] = " ";
        }
    };
    let i = 0;
    while (i < texto.length) {
        const actual = texto[i];
        const siguiente = texto[i + 1];
        if (actual === "/" && siguiente === "/") {
            const fin = texto.indexOf("\n", i);
            const hasta = fin === -1 ? texto.length : fin;
            tapar(i, hasta);
            i = hasta;
        } else if (actual === "/" && siguiente === "*") {
            const fin = texto.indexOf("*/", i + 2);
            const hasta = fin === -1 ? texto.length : fin + 2;
            tapar(i, hasta);
            i = hasta;
        } else if (actual === '"' || actual === "'" || actual === "`") {
            let j = i + 1;
            while (j < texto.length && texto[j] !== actual) {
                if (texto[j] === "\\") j += 2;
                else j += 1;
            }
            tapar(i, Math.min(j + 1, texto.length));
            i = j + 1;
        } else {
            i += 1;
        }
    }
    return salida.join("");
}

/** Quita los comentarios de CSS conservando posiciones. */
export function enmascararCss(texto) {
    let salida = texto;
    let inicio = salida.indexOf("/*");
    while (inicio !== -1) {
        const fin = salida.indexOf("*/", inicio + 2);
        const hasta = fin === -1 ? salida.length : fin + 2;
        const hueco = salida.slice(inicio, hasta).replace(/[^\n]/g, " ");
        salida = salida.slice(0, inicio) + hueco + salida.slice(hasta);
        inicio = salida.indexOf("/*", inicio + hueco.length);
    }
    return salida;
}

/** Convierte una lista de índices en hallazgos con línea y fragmento. */
function hallazgosDesde(regla, texto, indices) {
    const lineas = indicesDeLineas(texto);
    return indices.map((indice) => ({
        regla,
        linea: lineaDe(lineas, indice),
        fragmento: fragmento(texto, indice),
    }));
}

/** Busca todas las apariciones de una expresión regular global. */
function apariciones(texto, patron) {
    const indices = [];
    const regex = new RegExp(
        patron.source,
        patron.flags.includes("g") ? patron.flags : `${patron.flags}g`
    );
    let coincidencia = regex.exec(texto);
    while (coincidencia !== null) {
        indices.push(coincidencia.index);
        if (coincidencia[0].length === 0) regex.lastIndex += 1;
        coincidencia = regex.exec(texto);
    }
    return indices;
}

/** Reglas de HTML sobre un documento completo. */
export function analizarHtml(texto) {
    const sinComentarios = texto.replace(/<!--[\s\S]*?-->/g, (bloque) =>
        bloque.replace(/[^\n]/g, " ")
    );
    const hallazgos = [];
    const lineas = indicesDeLineas(sinComentarios);

    const etiquetaHtml = /<html\b[^>]*>/i.exec(sinComentarios);
    if (!etiquetaHtml || !/\blang\s*=/.test(etiquetaHtml[0])) {
        hallazgos.push({ regla: "html-lang", linea: 1, fragmento: "<html> sin lang" });
    }
    if (!/<meta\b[^>]*charset\s*=/i.test(sinComentarios)) {
        hallazgos.push({ regla: "html-charset", linea: 1, fragmento: "falta <meta charset>" });
    }
    if (!/<meta\b[^>]*name\s*=\s*["']?viewport["']?/i.test(sinComentarios)) {
        hallazgos.push({
            regla: "html-viewport",
            linea: 1,
            fragmento: "falta <meta name=viewport>",
        });
    }
    const titulo = /<title\b[^>]*>([\s\S]*?)<\/title>/i.exec(sinComentarios);
    if (!titulo || titulo[1].trim() === "") {
        hallazgos.push({ regla: "html-title", linea: 1, fragmento: "falta <title> o está vacío" });
    }

    const imagenes = sinComentarios.match(/<img\b[^>]*>/gi) ?? [];
    imagenes.forEach((etiqueta) => {
        if (/\balt\s*=/i.test(etiqueta)) return;
        hallazgos.push({
            regla: "html-img-alt",
            linea: lineaDe(lineas, sinComentarios.indexOf(etiqueta)),
            fragmento: etiqueta,
        });
    });

    // Campos de formulario: necesitan label con for, envoltorio <label> o aria-label.
    const rangosLabel = [];
    const regexLabel = /<label\b[^>]*>[\s\S]*?<\/label>/gi;
    let etiqueta = regexLabel.exec(sinComentarios);
    while (etiqueta !== null) {
        rangosLabel.push([etiqueta.index, etiqueta.index + etiqueta[0].length]);
        etiqueta = regexLabel.exec(sinComentarios);
    }
    const dentroDeLabel = (indice) =>
        rangosLabel.some(([inicio, fin]) => indice > inicio && indice < fin);

    const campos = sinComentarios.match(/<(input|select|textarea)\b[^>]*>/gi) ?? [];
    const etiquetasFor = new Set(
        [...(sinComentarios.match(/<label\b[^>]*>/gi) ?? [])]
            .map((etiqueta) => /\bfor\s*=\s*["']([^"']+)["']/i.exec(etiqueta)?.[1])
            .filter(Boolean)
    );
    campos.forEach((etiqueta) => {
        const tipo = /\btype\s*=\s*["']?([a-z]+)/i.exec(etiqueta)?.[1]?.toLowerCase() ?? "";
        if (TIPOS_SIN_LABEL.has(tipo)) return;
        const id = /\bid\s*=\s*["']([^"']+)["']/i.exec(etiqueta)?.[1];
        const conAria = /\baria-label(ledby)?\s*=/i.test(etiqueta);
        const indice = sinComentarios.indexOf(etiqueta);
        if (conAria || (id && etiquetasFor.has(id)) || dentroDeLabel(indice)) return;
        hallazgos.push({
            regla: "html-control-label",
            linea: lineaDe(lineas, indice),
            fragmento: etiqueta,
        });
    });

    // Elementos no nativos usados como control.
    apariciones(
        sinComentarios,
        /<(div|span)\b[^>]*\bon(click|mousedown|keydown|keyup)\s*=/i
    ).forEach((indice) => {
        hallazgos.push({
            regla: "html-div-interactivo",
            linea: lineaDe(lineas, indice),
            fragmento: fragmento(sinComentarios, indice),
        });
    });

    return hallazgos;
}

/**
 * Reglas de CSS. Recorre el fichero con una pila de selectores para saber si
 * una declaración está dentro de :root (donde sí se permiten literales).
 */
export function analizarCss(texto) {
    const limpio = enmascararCss(texto);
    const lineas = indicesDeLineas(limpio);
    const hallazgos = [];
    const pila = [];
    let preludio = "";

    apariciones(limpio, /!important/g).forEach((indice) => {
        hallazgos.push({
            regla: "css-important",
            linea: lineaDe(lineas, indice),
            fragmento: fragmento(limpio, indice),
        });
    });

    for (let i = 0; i < limpio.length; i += 1) {
        const caracter = limpio[i];
        if (caracter === "{") {
            pila.push(preludio.trim());
            if (/@media[^{]*max-width/i.test(preludio)) {
                hallazgos.push({
                    regla: "css-media-max",
                    linea: lineaDe(lineas, i),
                    fragmento: preludio.trim().slice(0, 60),
                });
            }
            preludio = "";
        } else if (caracter === "}") {
            pila.pop();
            preludio = "";
        } else if (caracter === ";") {
            preludio = "";
        } else {
            preludio += caracter;
            // Color literal fuera del bloque de tokens.
            if (caracter === "#" && !pila.includes(":root")) {
                const color = /^#[0-9a-fA-F]{3,8}\b/.exec(limpio.slice(i));
                if (color) {
                    hallazgos.push({
                        regla: "css-hex-suelto",
                        linea: lineaDe(lineas, i),
                        fragmento: fragmento(limpio, Math.max(0, i - 30)),
                    });
                }
            }
        }
    }
    return hallazgos;
}

/** Reglas de JavaScript sobre el texto ya enmascarado. */
export function analizarJs(texto) {
    const limpio = enmascararJs(texto);
    const hallazgos = [];

    hallazgos.push(
        ...hallazgosDesde(
            "js-innerhtml",
            limpio,
            apariciones(limpio, /\.(innerHTML|outerHTML|insertAdjacentHTML)\b/g)
        )
    );
    hallazgos.push(
        ...hallazgosDesde("js-var", limpio, apariciones(limpio, /\bvar\s+[A-Za-z_$[{]/g))
    );
    hallazgos.push(...hallazgosDesde("js-then", limpio, apariciones(limpio, /\.then\s*\(/g)));
    hallazgos.push(...hallazgosDesde("js-require", limpio, apariciones(limpio, /\brequire\s*\(/g)));

    // Igualdad no estricta: se permite `== null` / `!= null` (regla del equipo).
    apariciones(limpio, /(?:^|[^=!<>])(==|!=)(?!=)/g).forEach((indice) => {
        const operador = limpio.slice(indice).match(/^(?:[^=!<>])?(==|!=)/);
        const desde = indice + (operador?.[0].length ?? 2);
        const resto = limpio.slice(desde);
        if (/^\s*null\b/.test(resto)) return;
        hallazgos.push({
            regla: "js-igualdad",
            linea: lineaDe(indicesDeLineas(limpio), indice),
            fragmento: fragmento(limpio, indice),
        });
    });

    return hallazgos;
}

/** Analiza un fichero según su extensión; devuelve [] si no aplica. */
export function analizarArchivo(ruta, contenido) {
    if (/\.html?$/i.test(ruta)) return analizarHtml(contenido);
    if (/\.css$/i.test(ruta)) return analizarCss(contenido);
    if (/\.(js|mjs|cjs)$/i.test(ruta)) return analizarJs(contenido);
    return [];
}
