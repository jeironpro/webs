export const lessons = [
    {
        id: "testing",
        title: "Pruebas",
        lede: "Saber que un cambio es seguro antes de que se enteren tus usuarios: pruebas rápidas para la lógica y unas pocas lentas para todo lo demás.",
        minutes: 11,
        level: "Intermedio",
        metrics: [
            ["Unit", "2 s"],
            ["Integración", "40 s"],
            ["E2E", "6 min"],
            ["Cobertura", "80 %"],
        ],
        scene: {
            url: "https://ci.example/tests",
            status: "pirámide de pruebas",
            labels: ["Código", "Unit", "Integr.", "E2E"],
        },
        steps: [
            {
                tag: "Problema",
                title: "Probar todo es imposible",
                body: "No puedes ejecutar cada combinación de usuario, red y dato. Necesitas una estrategia que dé confianza sin tardar horas.",
                insight:
                    "El objetivo de una prueba no es cobertura: es reducir el coste de un error concreto.",
                node: 0,
            },
            {
                tag: "Mecanismo",
                title: "La pirámide",
                body: "Muchas pruebas unitarias rápidas, algunas de integración con dependencias reales y pocas end-to-end para los flujos que sostienen el negocio.",
                insight:
                    "Si todo es end-to-end, el pipeline se vuelve lento y frágil; si todo es unitario, no pruebas el sistema.",
                node: 1,
            },
            {
                tag: "Trade-off",
                title: "Mocks y realidad",
                body: "Un mock permite probar rápido, pero puede mentir sobre el comportamiento de la base o la API. Los contratos ayudan a mantenerlo honesto.",
                insight:
                    "Cada mock es una suposición; si la suposición cambia, la prueba sigue verde y el sistema falla.",
                node: 2,
            },
            {
                tag: "Fallo",
                title: "Pruebas inestables",
                body: "Una prueba que falla a veces enseña al equipo a ignorar el rojo. Aísla el tiempo, los datos y las dependencias externas.",
                insight:
                    "Una suite inestable es peor que no tener suite: destruye la confianza en las señales.",
                node: 3,
            },
            {
                tag: "Decisión",
                title: "Prueba el riesgo, no el número",
                body: "Cubre dinero, autenticación, migraciones y flujos críticos. Usa pruebas de contrato para integraciones y acepta que la cobertura no mide calidad.",
                insight: "Pregunta qué fallo te despertaría de noche y escribe esa prueba primero.",
                node: 1,
            },
        ],
        learn: [
            "Qué aporta cada nivel de prueba.",
            "Cómo evitar mocks que mienten.",
            "Por qué una suite inestable es peligrosa.",
            "Cómo priorizar por riesgo.",
        ],
    },
    {
        id: "ci-cd",
        title: "CI/CD y despliegues",
        lede: "Llevar cada cambio a producción rápido y con seguridad, y deshacerlo igual de rápido.",
        minutes: 11,
        level: "Intermedio",
        metrics: [
            ["Pipeline", "8 min"],
            ["Canary", "5 %"],
            ["Rollback", "2 min"],
            ["Flags", "Sí"],
        ],
        scene: {
            url: "https://ci.example/deploy",
            status: "un cambio en camino",
            labels: ["Commit", "Build", "Canary", "Prod"],
        },
        steps: [
            {
                tag: "Problema",
                title: "Desplegar no debería ser un evento",
                body: "Si cada release requiere una noche y un héroe, el equipo desplegará menos y acumulará riesgo. El objetivo es cambiar poco y a menudo.",
                insight:
                    "Un despliegue frecuente es más seguro porque el delta es pequeño y fácil de revertir.",
                node: 0,
            },
            {
                tag: "Mecanismo",
                title: "Integración continua",
                body: "Cada commit ejecuta lint, pruebas y build. El artefacto que se prueba es exactamente el que se despliega, sin reconstrucciones distintas.",
                insight: "Construye una vez y promueve el mismo artefacto entre entornos.",
                node: 1,
            },
            {
                tag: "Mecanismo",
                title: "Canary y feature flags",
                body: "Un canary envía un porcentaje pequeño de tráfico a la versión nueva. Una flag permite activar lógica sin desplegar de nuevo.",
                insight: "Separa desplegar de liberar: así puedes revertir sin reconstruir.",
                node: 2,
            },
            {
                tag: "Fallo",
                title: "Migraciones incompatibles",
                body: "Un cambio de esquema puede romper la versión anterior durante el despliegue. Haz migraciones compatibles en dos pasos: añade, despliega, limpia.",
                insight: "El código y el esquema no cambian al mismo tiempo; diseña para convivir.",
                node: 3,
            },
            {
                tag: "Decisión",
                title: "Rollback probado",
                body: "Define cómo vuelves atrás y cuánto tardas. Si el rollback exige restaurar una base, el despliegue no era pequeño.",
                insight: "Un rollback que nunca se prueba es un deseo, no un plan.",
                node: 1,
            },
        ],
        learn: [
            "Qué hace un pipeline de CI.",
            "Cómo funciona un canary.",
            "Cómo separar despliegue y release.",
            "Cómo migrar sin romper la versión anterior.",
        ],
    },
];
