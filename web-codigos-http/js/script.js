const codigos = {
    "1xx": [
        {
            100: "Continue - El servidor recibió los encabezados y el cliente puede continuar con el cuerpo de la solicitud"
        },
        {
            101: "Switching Protocols - El cliente solicitó cambiar de protocolo y el servidor acepta."
        },
        {
            102: "Processing (WebDAV) - El servidor está procesando la solicitud, pero aún no hay respuesta."
        },
        {
            103: "Early Hints - Sugiere recursos que el cliente podría precargar antes de la respuesta final."
        }
    ],
    "2xx": [
        {
            200: "OK - La solicitud se completó con éxito."
        },
        {
            201: "Created - La solicitud fue exitosa y se creó un nuevo recurso."
        },
        {
            202: "Accepted - La solicitud fue aceptada, pero aún no procesada."
        },
        {
            203: "Non-Authoritative Information - La respuesta proviene de una fuente diferente."
        },
        {
            204: "No Content - La solicitud fue exitosa pero no hay contenido que devolver."
        },
        {
            205: "Reset Content - La solicitud fue exitosa y el cliente debe reiniciar la vista."
        },
        {
            206: "Partial Content - La respuesta contiene solo una parte del recurso (rango)."
        },
        {
            207: "Multi-Status (WebDAV) - Devuelve múltiples estados para diferentes recursos."
        },
        {
            208: "Already Reported (WebDAV) - Elementos ya reportados previamente."
        },
        {
            226: "IM Used - La solicitud fue completada usando la instancia de manipulación de contenido."
        }
    ],
    "3xx": [
        {
            300: "Multiple Choices - Hay múltiples opciones para el recurso solicitado."
        },
        {
            301: "Moved Permanently - El recurso se movió permanentemente a otra URL."
        },
        {
            302: "Found - El recurso se encuentra temporalmente en otra URL."
        },
        {
            303: "See Other - La respuesta puede obtenerse en otra URL usando GET."
        },
        {
            304: "Not Modified - El recurso no ha cambiado desde la última solicitud."
        },
        {
            305: "Use Proxy - El recurso debe ser accedido a través de un proxy. (Obsoleto)"
        },
        {
            306: "Switch Proxy - Reservado, no usado."
        },
        {
            307: "Temporary Redirect - Redirección temporal, la misma solicitud debe repetirse."
        },
        {
            308: "Permanent Redirect - Redirección permanente, la misma solicitud debe repetirse."
        }
    ],
    "4xx": [
        {
            400: "Bad Request - La solicitud es inválida o mal formada."
        },
        {
            401: "Unauthorized - Requiere autenticación."
        },
        {
            402: "Payment Required - Reservado para pagos."
        },
        {
            403: "Forbidden - El servidor entiende la solicitud pero se niega a cumplirla."
        },
        {
            404: "Not Found - El recurso solicitado no existe."
        },
        {
            405: "Method Not Allowed - El método HTTP no está permitido para este recurso."
        },
        {
            406: "Not Acceptable - El recurso no cumple con las condiciones de aceptación del cliente."
        },
        {
            407: "Proxy Authentication Required - Requiere autenticación con un proxy."
        },
        {
            408: "Request Timeout - El servidor agotó el tiempo de espera de la solicitud."
        },
        {
            409: "Conflict - La solicitud no puede completarse por un conflicto."
        },
        {
            410: "Gone - El recurso ya no está disponible y no lo estará."
        },
        {
            411: "Length Required - La longitud de la solicitud es requerida."
        },
        {
            412: "Precondition Failed - Una condición previa en los encabezados falló."
        },
        {
            413: "Payload Too Large - La carga de la solicitud es demasiado grande."
        },
        {
            414: "URI Too Long - La URI es demasiado larga para procesarla."
        },
        {
            415: "Unsupported Media Type - El tipo de medio no es soportado."
        },
        {
            416: "Range Not Satisfiable - El rango solicitado no puede ser satisfecho."
        },
        {
            417: "Expectation Failed - El servidor no puede cumplir la expectativa de los encabezados."
        },
        {
            418: "I'm a teapot - Broma de April Fools (RFC 2324)."
        },
        {
            421: "Misdirected Request - La solicitud se dirigió a un servidor incorrecto."
        },
        {
            422: "Unprocessable Entity - La solicitud está bien formada pero contiene errores semánticos."
        },
        {
            423: "Locked - El recurso está bloqueado (WebDAV)."
        },
        {
            424: "Failed Dependency - La solicitud falló debido a una dependencia anterior (WebDAV)."
        },
        {
            425: "Too Early - El servidor no quiere procesar la solicitud aún."
        },
        {
            426: "Upgrade Required - Se requiere un protocolo diferente."
        },
        {
            428: "Precondition Required - Se requiere una condición previa."
        },
        {
            429: "Too Many Requests - El cliente ha enviado demasiadas solicitudes."
        },
        {
            431: "Request Header Fields Too Large - Los encabezados son demasiado grandes."
        },
        {
            451: "Unavailable For Legal Reasons - Recurso bloqueado por razones legales."
        }
    ],
    "5xx": [
        {
            500: "Internal Server Error - Error general del servidor."
        },
        {
            501: "Not Implemented - El servidor no soporta la funcionalidad requerida."
        },
        {
            502: "Bad Gateway - El servidor actuó como puerta de enlace y recibió una respuesta inválida."
        },
        {
            503: "Service Unavailable - El servidor está temporalmente fuera de servicio."
        },
        {
            504: "Gateway Timeout - Tiempo de espera agotado en una puerta de enlace."
        },
        {
            505: "HTTP Version Not Supported - La versión HTTP no es soportada."
        },
        {
            506: "Variant Also Negotiates - Error de negociación de contenido."
        },
        {
            507: "Insufficient Storage - Espacio insuficiente para completar la solicitud (WebDAV)."
        },
        {
            508: "Loop Detected - Se detectó un bucle infinito (WebDAV)."
        },
        {
            510: "Not Extended - La extensión de la solicitud requerida no está implementada."
        },
        {
            511: "Network Authentication Required - Requiere autenticación de red."
        }
    ]
};

// Función para crear una tarjeta de código individual
const crearTarjetaCodigo = (elemento, categoria) => {
    const [codigo, descripcion] = Object.entries(elemento)[0];
    
    const codigoObj = document.createElement("div");
    codigoObj.classList.add("codigo");
    codigoObj.setAttribute("data-categoria", categoria);
    codigoObj.textContent = codigo;

    const descripcionObj = document.createElement("div");
    descripcionObj.classList.add("descripcion");
    descripcionObj.textContent = descripcion;

    codigoObj.appendChild(descripcionObj);
    
    return codigoObj;
};

// Función para renderizar una sección de códigos
const renderizarSeccion = (seccion, listaCodigos) => {
    const contenedorSeccionObj = document.createElement("div");
    contenedorSeccionObj.classList.add("contenedor-seccion");

    const tituloSeccionObj = document.createElement("h2");
    tituloSeccionObj.textContent = seccion;
    contenedorSeccionObj.appendChild(tituloSeccionObj);

    const codigosObj = document.createElement("div");
    codigosObj.classList.add("codigos");

    listaCodigos.forEach(elemento => {
        const tarjetaCodigo = crearTarjetaCodigo(elemento, seccion);
        codigosObj.appendChild(tarjetaCodigo);
    });

    contenedorSeccionObj.appendChild(codigosObj);
    
    return contenedorSeccionObj;
};

// Función para inicializar la lista de códigos
const inicializar = () => {
    const listaCodigosObj = document.getElementById("contenedor-lista-codigos");

    for (const seccion in codigos) {
        const seccionRenderizada = renderizarSeccion(seccion, codigos[seccion]);
        listaCodigosObj.appendChild(seccionRenderizada);
    }
};

// Inicializar la lista de códigos cuando el DOM esté listo
inicializar();