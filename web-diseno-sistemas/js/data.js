export { courseModules, allLessons, lessonsById } from "./course/index.js";

export const quizQuestions = [
    {
        question:
            "Tu p95 sube de 180 a 900 ms justo después de un pico. La API está al 38 % de CPU, la caché acierta el 84 % y la base de datos acumula 40 consultas en cola. ¿Qué mirarías primero?",
        options: [
            "Añadir otra región para repartir el tráfico.",
            "La consulta y el tiempo de espera de la base de datos.",
            "Comprimir mejor las respuestas.",
            "Subir la caché al 90 %.",
        ],
        correct: 1,
        explanation:
            "La cola es la señal. Antes de añadir capacidad, mira qué consulta la está llenando y cuánto espera; una región nueva reparte la entrada, pero no arregla una consulta cara.",
    },
    {
        question:
            "La caché acierta el 95 %, pero el p95 no baja. ¿Qué hipótesis tiene más sentido?",
        options: [
            "La caché está mal configurada siempre.",
            "El cuello está en los misses, en la API o en la red; la media de aciertos tapa la cola.",
            "La base de datos no puede ser el problema.",
            "Hay que añadir más caché antes de medir.",
        ],
        correct: 1,
        explanation:
            "Un hit ratio alto no elimina la cola del 5 % que falla. Si ese 5 % concentra las consultas caras, el p95 seguirá alto aunque la media parezca sana.",
    },
    {
        question: "Vas a abrir tres regiones. ¿Qué decisión evita más dolor a largo plazo?",
        options: [
            "Duplicar todas las tablas en cada región.",
            "Poner una caché delante de todo.",
            "Definir una fuente de verdad y el orden de las escrituras.",
            "Comprar más servidores para cada región.",
        ],
        correct: 2,
        explanation:
            "Repartir lectura es fácil; repartir escritura exige decidir quién manda. Sin una fuente de verdad y un orden claro, las regiones solo hacen que los conflictos viajen más rápido.",
    },
    {
        question:
            "El balanceador sigue enviando tráfico a una instancia que dejó de responder hace un minuto. ¿Qué falta?",
        options: [
            "Más CPU en el balanceador.",
            "Un health check que detecte la instancia y la retire.",
            "Una caché delante del balanceador.",
            "Cambiar el algoritmo a round robin.",
        ],
        correct: 1,
        explanation:
            "El balanceador necesita una señal de salud y un umbral de fallo. Sin health checks, reparte peticiones hacia un agujero negro aunque el algoritmo sea perfecto.",
    },
    {
        question:
            "Un pago se reintenta tras un timeout y el cliente recibe dos cobros. ¿Cuál es la corrección más directa?",
        options: [
            "Bajar el timeout.",
            "Reintentar menos veces.",
            "Usar una clave de idempotencia por operación.",
            "Cobrar solo por la mañana.",
        ],
        correct: 2,
        explanation:
            "La clave de idempotencia permite que el servidor reconozca el segundo intento como la misma operación. Reintentar es correcto; duplicar el efecto no.",
    },
    {
        question:
            "Tras cambiar el precio de un producto, algunos usuarios siguen viendo el anterior durante minutos. ¿Qué revisas primero?",
        options: [
            "El ancho de banda del servidor.",
            "La política de invalidación y el TTL de la caché.",
            "El número de réplicas de la base de datos.",
            "El algoritmo del balanceador.",
        ],
        correct: 1,
        explanation:
            "El dato viejo apunta a una caché que no se invalida al escribir o a un TTL demasiado largo. La solución puede ser borrar la clave, versionarla o reducir su vida.",
    },
];
