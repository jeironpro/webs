import { lessons as foundations } from "./foundations.js";
import { lessons as scaling } from "./scaling.js";
import { lessons as storage } from "./storage.js";
import { lessons as communication } from "./communication.js";
import { lessons as reliability } from "./reliability.js";
import { lessons as architecture } from "./architecture.js";
import { lessons as security } from "./security.js";
import { lessons as shipping } from "./shipping.js";
import { lessons as systems } from "./systems.js";
import { extraSteps } from "./extras.js";

export const courseModules = [
    {
        id: "fundamentos",
        num: "01",
        title: "Fundamentos",
        tone: "green",
        lessons: foundations,
        cheatsheet: [
            "Mide antes de optimizar; la media no cuenta la historia completa.",
            "Latencia y rendimiento son preguntas distintas.",
            "Convierte usuarios en peticiones y datos antes de dibujar cajas.",
        ],
    },
    {
        id: "escalado",
        num: "02",
        title: "Escalado",
        tone: "blue",
        lessons: scaling,
        cheatsheet: [
            "Quita estado de las instancias antes de añadir réplicas.",
            "Cachea lo que se repite y define cómo invalidarlo.",
            "Acerca el contenido estático; la física no se optimiza con código.",
        ],
    },
    {
        id: "datos",
        num: "03",
        title: "Datos y almacenamiento",
        tone: "purple",
        lessons: storage,
        cheatsheet: [
            "Elige el motor por el patrón de acceso, no por la moda.",
            "Replica para leer y sobrevivir; particiona cuando una máquina no baste.",
            "La consistencia es una decisión de negocio por operación.",
        ],
    },
    {
        id: "comunicacion",
        num: "04",
        title: "Comunicación",
        tone: "yellow",
        lessons: communication,
        cheatsheet: [
            "Cola para desacoplar ritmos; evento para avisar a varios.",
            "Diseña consumidores idempotentes desde el primer día.",
            "Tiempo real significa estado por conexión y reconexión probada.",
        ],
    },
    {
        id: "fiabilidad",
        num: "05",
        title: "Fiabilidad",
        tone: "green",
        lessons: reliability,
        cheatsheet: [
            "Todo falla: define RTO, RPO y capacidad de respaldo.",
            "Presupuesta timeouts y reintentos con backoff y jitter.",
            "Alerta sobre síntomas de usuario, no sobre cada métrica.",
        ],
    },
    {
        id: "arquitectura",
        num: "06",
        title: "Arquitectura",
        tone: "blue",
        lessons: architecture,
        cheatsheet: [
            "Empieza con un monolito modular y extrae por dolor real.",
            "Cada servicio nuevo añade red, despliegue y fallos parciales.",
            "Una saga compensa; no finge una transacción distribuida.",
        ],
    },
    {
        id: "seguridad",
        num: "07",
        title: "Seguridad",
        tone: "purple",
        lessons: security,
        cheatsheet: [
            "Autentica identidad y autoriza cada recurso en el servidor.",
            "Nunca guardes secretos en el repositorio; rótalos.",
            "Cifra en tránsito y en reposo; audita el acceso a claves.",
        ],
    },
    {
        id: "despliegue",
        num: "08",
        title: "Despliegue",
        tone: "yellow",
        lessons: shipping,
        cheatsheet: [
            "Prueba el riesgo, no el porcentaje de cobertura.",
            "Construye una vez y promueve el mismo artefacto.",
            "Despliega pequeño, con canary y rollback probado.",
        ],
    },
    {
        id: "sistemas",
        num: "09",
        title: "Sistemas completos",
        tone: "green",
        lessons: systems,
        cheatsheet: [
            "Requisitos y números antes de cajas y flechas.",
            "Encuentra el cuello real: lectura, escritura, red o coordinación.",
            "Un diseño se termina cuando sabes qué falla y cómo se recupera.",
        ],
    },
];

export const allLessons = courseModules.flatMap((module, moduleIndex) =>
    module.lessons.map((lesson, lessonIndex) => ({
        ...lesson,
        steps: [...lesson.steps, ...(extraSteps[lesson.id] ?? [])],
        moduleId: module.id,
        moduleTitle: module.title,
        moduleNum: module.num,
        moduleTone: module.tone,
        moduleIndex,
        lessonIndex,
        lessonCount: module.lessons.length,
    }))
);

export const lessonsById = new Map(allLessons.map((lesson) => [lesson.id, lesson]));
