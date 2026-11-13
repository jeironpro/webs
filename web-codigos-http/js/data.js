export const httpStatusCodes = {
    "1xx": [
        {
            code: 100,
            description:
                "Continue - El servidor recibió los encabezados y el cliente puede continuar con el cuerpo de la solicitud",
        },
        {
            code: 101,
            description:
                "Switching Protocols - El cliente solicitó cambiar de protocolo y el servidor acepta.",
        },
        {
            code: 102,
            description:
                "Processing (WebDAV) - El servidor está procesando la solicitud, pero aún no hay respuesta.",
        },
        {
            code: 103,
            description:
                "Early Hints - Sugiere recursos que el cliente podría precargar antes de la respuesta final.",
        },
    ],
    "2xx": [
        {
            code: 200,
            description: "OK - La solicitud se completó con éxito.",
        },
        {
            code: 201,
            description: "Created - La solicitud fue exitosa y se creó un nuevo recurso.",
        },
        {
            code: 202,
            description: "Accepted - La solicitud fue aceptada, pero aún no procesada.",
        },
        {
            code: 203,
            description:
                "Non-Authoritative Information - La respuesta proviene de una fuente diferente.",
        },
        {
            code: 204,
            description:
                "No Content - La solicitud fue exitosa pero no hay contenido que devolver.",
        },
        {
            code: 205,
            description:
                "Reset Content - La solicitud fue exitosa y el cliente debe reiniciar la vista.",
        },
        {
            code: 206,
            description:
                "Partial Content - La respuesta contiene solo una parte del recurso (rango).",
        },
        {
            code: 207,
            description:
                "Multi-Status (WebDAV) - Devuelve múltiples estados para diferentes recursos.",
        },
        {
            code: 208,
            description: "Already Reported (WebDAV) - Elementos ya reportados previamente.",
        },
        {
            code: 226,
            description:
                "IM Used - La solicitud fue completada usando la instancia de manipulación de contenido.",
        },
    ],
    "3xx": [
        {
            code: 300,
            description: "Multiple Choices - Hay múltiples opciones para el recurso solicitado.",
        },
        {
            code: 301,
            description: "Moved Permanently - El recurso se movió permanentemente a otra URL.",
        },
        {
            code: 302,
            description: "Found - El recurso se encuentra temporalmente en otra URL.",
        },
        {
            code: 303,
            description: "See Other - La respuesta puede obtenerse en otra URL usando GET.",
        },
        {
            code: 304,
            description: "Not Modified - El recurso no ha cambiado desde la última solicitud.",
        },
        {
            code: 305,
            description:
                "Use Proxy - El recurso debe ser accedido a través de un proxy. (Obsoleto)",
        },
        {
            code: 306,
            description: "Switch Proxy - Reservado, no usado.",
        },
        {
            code: 307,
            description:
                "Temporary Redirect - Redirección temporal, la misma solicitud debe repetirse.",
        },
        {
            code: 308,
            description:
                "Permanent Redirect - Redirección permanente, la misma solicitud debe repetirse.",
        },
    ],
    "4xx": [
        {
            code: 400,
            description: "Bad Request - La solicitud es inválida o mal formada.",
        },
        {
            code: 401,
            description: "Unauthorized - Requiere autenticación.",
        },
        {
            code: 402,
            description: "Payment Required - Reservado para pagos.",
        },
        {
            code: 403,
            description: "Forbidden - El servidor entiende la solicitud pero se niega a cumplirla.",
        },
        {
            code: 404,
            description: "Not Found - El recurso solicitado no existe.",
        },
        {
            code: 405,
            description: "Method Not Allowed - El método HTTP no está permitido para este recurso.",
        },
        {
            code: 406,
            description:
                "Not Acceptable - El recurso no cumple con las condiciones de aceptación del cliente.",
        },
        {
            code: 407,
            description: "Proxy Authentication Required - Requiere autenticación con un proxy.",
        },
        {
            code: 408,
            description: "Request Timeout - El servidor agotó el tiempo de espera de la solicitud.",
        },
        {
            code: 409,
            description: "Conflict - La solicitud no puede completarse por un conflicto.",
        },
        {
            code: 410,
            description: "Gone - El recurso ya no está disponible y no lo estará.",
        },
        {
            code: 411,
            description: "Length Required - La longitud de la solicitud es requerida.",
        },
        {
            code: 412,
            description: "Precondition Failed - Una condición previa en los encabezados falló.",
        },
        {
            code: 413,
            description: "Payload Too Large - La carga de la solicitud es demasiado grande.",
        },
        {
            code: 414,
            description: "URI Too Long - La URI es demasiado larga para procesarla.",
        },
        {
            code: 415,
            description: "Unsupported Media Type - El tipo de medio no es soportado.",
        },
        {
            code: 416,
            description: "Range Not Satisfiable - El rango solicitado no puede ser satisfecho.",
        },
        {
            code: 417,
            description:
                "Expectation Failed - El servidor no puede cumplir la expectativa de los encabezados.",
        },
        {
            code: 418,
            description: "I'm a teapot - Broma de April Fools (RFC 2324).",
        },
        {
            code: 421,
            description: "Misdirected Request - La solicitud se dirigió a un servidor incorrecto.",
        },
        {
            code: 422,
            description:
                "Unprocessable Entity - La solicitud está bien formada pero contiene errores semánticos.",
        },
        {
            code: 423,
            description: "Locked - El recurso está bloqueado (WebDAV).",
        },
        {
            code: 424,
            description:
                "Failed Dependency - La solicitud falló debido a una dependencia anterior (WebDAV).",
        },
        {
            code: 425,
            description: "Too Early - El servidor no quiere procesar la solicitud aún.",
        },
        {
            code: 426,
            description: "Upgrade Required - Se requiere un protocolo diferente.",
        },
        {
            code: 428,
            description: "Precondition Required - Se requiere una condición previa.",
        },
        {
            code: 429,
            description: "Too Many Requests - El cliente ha enviado demasiadas solicitudes.",
        },
        {
            code: 431,
            description: "Request Header Fields Too Large - Los encabezados son demasiado grandes.",
        },
        {
            code: 451,
            description: "Unavailable For Legal Reasons - Recurso bloqueado por razones legales.",
        },
    ],
    "5xx": [
        {
            code: 500,
            description: "Internal Server Error - Error general del servidor.",
        },
        {
            code: 501,
            description: "Not Implemented - El servidor no soporta la funcionalidad requerida.",
        },
        {
            code: 502,
            description:
                "Bad Gateway - El servidor actuó como puerta de enlace y recibió una respuesta inválida.",
        },
        {
            code: 503,
            description: "Service Unavailable - El servidor está temporalmente fuera de servicio.",
        },
        {
            code: 504,
            description: "Gateway Timeout - Tiempo de espera agotado en una puerta de enlace.",
        },
        {
            code: 505,
            description: "HTTP Version Not Supported - La versión HTTP no es soportada.",
        },
        {
            code: 506,
            description: "Variant Also Negotiates - Error de negociación de contenido.",
        },
        {
            code: 507,
            description:
                "Insufficient Storage - Espacio insuficiente para completar la solicitud (WebDAV).",
        },
        {
            code: 508,
            description: "Loop Detected - Se detectó un bucle infinito (WebDAV).",
        },
        {
            code: 510,
            description:
                "Not Extended - La extensión de la solicitud requerida no está implementada.",
        },
        {
            code: 511,
            description: "Network Authentication Required - Requiere autenticación de red.",
        },
    ],
};
