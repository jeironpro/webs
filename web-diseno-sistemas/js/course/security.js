export const lessons = [
    {
        id: "authentication",
        title: "Autenticación",
        lede: "Demostrar quién es alguien, sin convertirte en la razón por la que se filtra su contraseña.",
        minutes: 12,
        level: "Intermedio",
        metrics: [
            ["Sesión", "Cookie"],
            ["MFA", "Sí"],
            ["Hash", "Argon2id"],
            ["Expiración", "30 d"],
        ],
        scene: {
            url: "https://auth.example/login",
            status: "verificando identidad",
            labels: ["Cliente", "Login", "Token", "Store"],
        },
        steps: [
            {
                tag: "Problema",
                title: "¿Quién eres?",
                body: "Antes de mostrar datos privados necesitas saber a quién pertenecen. La autenticación verifica una identidad; no decide qué puede hacer.",
                insight:
                    "Autenticar es demostrar identidad; autorizar es decidir permisos. Son pasos distintos.",
                node: 0,
            },
            {
                tag: "Mecanismo",
                title: "Contraseñas y hashes",
                body: "Nunca guardes contraseñas en claro. Usa un hash lento con sal, como Argon2id, y compara en tiempo constante.",
                insight:
                    "Un hash rápido es bueno para integridad y malo para contraseñas: el atacante también puede calcularlo rápido.",
                node: 1,
            },
            {
                tag: "Mecanismo",
                title: "Sesión o token",
                body: "Una cookie de sesión permite revocar al instante y requiere un almacén. Un token firmado escala sin estado, pero vive hasta caducar.",
                insight:
                    "La duración y la revocación son parte del modelo de amenaza, no detalles de implementación.",
                node: 2,
            },
            {
                tag: "Fallo",
                title: "MFA y recuperación",
                body: "Un segundo factor frena el robo de contraseña, pero la recuperación suele ser el eslabón débil. Protege también el correo y las preguntas de seguridad.",
                insight:
                    "El atacante no rompe la puerta si puede convencer a soporte de que le abra.",
                node: 3,
            },
            {
                tag: "Decisión",
                title: "Cookies seguras y CSRF",
                body: "Marca HttpOnly, Secure y SameSite. Si usas cookies para mutaciones, añade protección CSRF y valida el origen.",
                insight:
                    "El navegador es parte del sistema de autenticación; configúralo a favor, no en contra.",
                node: 1,
            },
        ],
        learn: [
            "Diferencia entre autenticación y autorización.",
            "Cómo almacenar contraseñas.",
            "Sesión frente a token.",
            "Qué proteger además del login.",
        ],
    },
    {
        id: "authorization",
        title: "Autorización",
        lede: "Saber quién es alguien no te dice qué puede ver o hacer. Comprobarlo, en todas partes.",
        minutes: 13,
        level: "Avanzado",
        metrics: [
            ["Modelo", "RBAC + owner"],
            ["Recurso", "Pedido"],
            ["Check", "Servidor"],
            ["Default", "Denegar"],
        ],
        scene: {
            url: "https://api.example/orders/42",
            status: "comprobando permisos",
            labels: ["Usuario", "Rol", "Policy", "Recurso"],
        },
        steps: [
            {
                tag: "Problema",
                title: "Un ID no es un permiso",
                body: "Cambiar /orders/42 por /orders/43 no debería mostrar el pedido de otra persona. La autorización debe comprobar la relación con el recurso.",
                insight: "Nunca confíes en un ID que llega del cliente para decidir propiedad.",
                node: 0,
            },
            {
                tag: "Mecanismo",
                title: "RBAC, ABAC y ownership",
                body: "RBAC asigna permisos por rol; ABAC evalúa atributos; ownership compara el usuario autenticado con el dueño. Muchos sistemas combinan los tres.",
                insight:
                    "El rol responde 'qué tipo de usuario eres'; la propiedad responde 'este recurso es tuyo'.",
                node: 1,
            },
            {
                tag: "Fallo",
                title: "La comprobación solo en la UI",
                body: "Ocultar un botón no impide llamar a la API. Cada endpoint y cada consulta deben verificar permisos en el servidor.",
                insight: "La interfaz es una sugerencia; el servidor es la frontera de seguridad.",
                node: 2,
            },
            {
                tag: "Trade-off",
                title: "Permisos finos y mantenimiento",
                body: "Un modelo muy granular protege mejor y se vuelve difícil de auditar. Empieza con roles claros y añade excepciones explícitas.",
                insight: "Un permiso que nadie entiende acabará concedido por miedo.",
                node: 3,
            },
            {
                tag: "Decisión",
                title: "Denegar por defecto",
                body: "Si falta una regla, deniega. Registra las decisiones y prueba casos de otro usuario, otro tenant y otro rol.",
                insight:
                    "La seguridad se mide por el caso que olvidaste, no por el botón que escondiste.",
                node: 1,
            },
        ],
        learn: [
            "Por qué autenticación no basta.",
            "Cómo combinar roles y propiedad.",
            "Dónde comprobar permisos.",
            "Cómo probar aislamiento entre usuarios.",
        ],
    },
    {
        id: "encryption-secrets",
        title: "Cifrado y secretos",
        lede: "Proteger los datos en la red, en disco, y las claves y contraseñas que usan tus servicios.",
        minutes: 12,
        level: "Intermedio",
        metrics: [
            ["Tránsito", "TLS 1.3"],
            ["Reposo", "AES-256"],
            ["KMS", "Sí"],
            ["Rotación", "90 d"],
        ],
        scene: {
            url: "https://api.example/secure",
            status: "datos y claves protegidos",
            labels: ["Cliente", "TLS", "KMS", "Secreto"],
        },
        steps: [
            {
                tag: "Problema",
                title: "Datos en tránsito y en reposo",
                body: "Un paquete puede ser leído en la red y un disco puede ser copiado. TLS protege el viaje; el cifrado en reposo protege el almacenamiento.",
                insight:
                    "Cifrar en tránsito sin cifrar en reposo deja la copia de seguridad como único punto de fuga.",
                node: 0,
            },
            {
                tag: "Mecanismo",
                title: "TLS y confianza",
                body: "TLS negocia claves y autentica el servidor con un certificado. Renueva certificados y no desactives la validación para 'que funcione'.",
                insight:
                    "Desactivar la verificación de certificados convierte una conexión cifrada en una conexión con un desconocido.",
                node: 1,
            },
            {
                tag: "Mecanismo",
                title: "KMS y claves",
                body: "Un key management service guarda claves maestras y audita su uso. La aplicación pide descifrar sin ver la clave raíz.",
                insight:
                    "La clave más peligrosa es la que está copiada en una variable de entorno y nadie rota.",
                node: 2,
            },
            {
                tag: "Fallo",
                title: "Secretos en el repositorio",
                body: "Un token en Git sigue en el historial aunque lo borres. Rótalo, retíralo y usa un gestor de secretos con permisos mínimos.",
                insight: "Un secreto filtrado no se arregla ocultándolo: se invalida.",
                node: 3,
            },
            {
                tag: "Decisión",
                title: "Rota y audita",
                body: "Define quién puede leer cada secreto, cuándo caduca y cómo se rota. Registra accesos y prueba la rotación antes de necesitarla.",
                insight: "La rotación que nunca se ensaya es la que falla en el incidente.",
                node: 1,
            },
        ],
        learn: [
            "Qué protege TLS y qué no.",
            "Cómo funciona un KMS.",
            "Qué hacer con un secreto filtrado.",
            "Cómo planificar la rotación.",
        ],
    },
];
