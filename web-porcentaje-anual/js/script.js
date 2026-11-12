/* Milisegundos que tiene un día, base del cálculo del día del año. */
const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

document.addEventListener("DOMContentLoaded", () => {
    // Referencias a elementos del DOM
    const currentYearText = document.getElementById("current-year-text");
    const remainingDaysText = document.getElementById("remaining-days");
    const daysGrid = document.getElementById("days-grid");
    const percentageValue = document.getElementById("percentage-value");
    const progressBar = document.getElementById("progress-bar");

    /**
     * Calcula la información relevante sobre la fecha actual
     */
    const getDateInfo = () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();

        // Determinar si es bisiesto
        const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
        const totalDaysInYear = isLeapYear ? 366 : 365;

        // Calcular día del año (1-indexed)
        const yearStart = new Date(year, 0, 1);
        const millisecondsPerDay = MILLISECONDS_PER_DAY;

        // Calcular diferencia y convertir a días
        const differenceInMilliseconds = currentDate.getTime() - yearStart.getTime();
        const currentDayNumber = Math.floor(differenceInMilliseconds / millisecondsPerDay) + 1;

        return {
            year,
            currentDayNumber,
            totalDaysInYear,
        };
    };

    /**
     * Genera la cuadrícula de puntos
     */
    const generateDots = (totalDias, diaActual) => {
        // Verificar si ya existen puntos para no regenerar todo (opcional, pero buena práctica)
        // En este caso simple, limpiamos y regeneramos.

        const fragment = document.createDocumentFragment();

        for (let i = 1; i <= totalDias; i++) {
            const dot = document.createElement("div");
            dot.classList.add("day-dot");

            // Estado completado
            if (i <= diaActual) {
                dot.classList.add("completed");
            }

            // Tooltip personalizado
            dot.setAttribute("data-tooltip", `Día ${i}`);

            fragment.appendChild(dot);
        }

        // Limpiar y renderizar (sin innerHTML: los nodos ya están construidos)
        daysGrid.replaceChildren(fragment);
    };

    /**
     * Actualiza toda la interfaz
     */
    const updateView = () => {
        const { year, currentDayNumber, totalDaysInYear } = getDateInfo();

        // 1. Textos Generales
        currentYearText.textContent = year;
        remainingDaysText.textContent = totalDaysInYear - currentDayNumber;

        // 2. Porcentaje
        const exactPercentage = (currentDayNumber / totalDaysInYear) * 100;
        const roundedPercentage = Math.round(exactPercentage);

        percentageValue.textContent = roundedPercentage;

        // 3. Barra de Progreso
        // Pequeño delay para permitir que la transición CSS se vea al cargar
        setTimeout(() => {
            progressBar.style.width = `${exactPercentage}%`;
        }, 100);

        // 4. Grid
        generateDots(totalDaysInYear, currentDayNumber);
    };

    // Inicializar
    updateView();
});
